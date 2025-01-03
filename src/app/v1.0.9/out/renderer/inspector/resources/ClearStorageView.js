// Copyright (c) 2016 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as Common from '../common/common.js';
import * as i18n from '../i18n/i18n.js';
import * as PerfUI from '../perf_ui/perf_ui.js';
import * as Platform from '../platform/platform.js';
import * as SDK from '../sdk/sdk.js';
import * as UI from '../ui/ui.js';
import { ApplicationCacheModel } from './ApplicationCacheModel.js';
import { DatabaseModel } from './DatabaseModel.js';
import { DOMStorageModel } from './DOMStorageModel.js';
import { IndexedDBModel } from './IndexedDBModel.js';
export const UIStrings = {
    /**
     * @description Text in the Storage View that expresses the amout of used and available storage quota
     * @example {1.5 MB} PH1
     * @example {123.1 MB} PH2
     */
    storageQuotaUsed: '{PH1} used out of {PH2} storage quota',
    /**
     * @description Tooltip in the Storage View that expresses the precise amout of used and available storage quota
     * @example {200} PH1
     * @example {400} PH2
     */
    storageQuotaUsedWithBytes: '{PH1} bytes used out of {PH2} bytes storage quota',
    /**
     * @description Fragment indicating that a certain data size has been custom configured
     * @example {1.5 MB} PH1
     */
    storageWithCustomMarker: '{PH1} (custom)',
};
const str_ = i18n.i18n.registerUIStrings('resources/ClearStorageView.js', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
/**
 * @implements {SDK.SDKModel.Observer}
 */
export class ClearStorageView extends UI.ThrottledWidget.ThrottledWidget {
    constructor() {
        super(true, 1000);
        this.registerRequiredCSS('resources/clearStorageView.css', { enableLegacyPatching: false });
        this.contentElement.classList.add('clear-storage-container');
        const types = Protocol.Storage.StorageType;
        this._pieColors = new Map([
            [types.Appcache, 'rgb(110, 161, 226)'],
            [types.Cache_storage, 'rgb(229, 113, 113)'],
            [types.Cookies, 'rgb(239, 196, 87)'],
            [types.Indexeddb, 'rgb(155, 127, 230)'],
            [types.Local_storage, 'rgb(116, 178, 102)'],
            [types.Service_workers, 'rgb(255, 167, 36)'],
            [types.Websql, 'rgb(203, 220, 56)'],
        ]);
        // TODO(crbug.com/1156978): Replace UI.ReportView.ReportView with ReportView.ts web component.
        this._reportView = new UI.ReportView.ReportView(Common.UIString.UIString('Storage'));
        this._reportView.registerRequiredCSS('resources/clearStorageView.css', { enableLegacyPatching: false });
        this._reportView.element.classList.add('clear-storage-header');
        this._reportView.show(this.contentElement);
        /** @type {?SDK.SDKModel.Target} */
        this._target = null;
        /** @type {?string} */
        this._securityOrigin = null;
        this._settings = new Map();
        for (const type of AllStorageTypes) {
            this._settings.set(type, Common.Settings.Settings.instance().createSetting('clear-storage-' + type, true));
        }
        this._includeThirdPartyCookiesSetting =
            Common.Settings.Settings.instance().createSetting('clear-storage-include-third-party-cookies', false);
        const quota = this._reportView.appendSection(Common.UIString.UIString('Usage'));
        this._quotaRow = quota.appendSelectableRow();
        this._quotaRow.classList.add('quota-usage-row');
        const learnMoreRow = quota.appendRow();
        const learnMore = UI.XLink.XLink.create('https://developers.google.com/web/tools/chrome-devtools/progressive-web-apps#opaque-responses', ls `Learn more`);
        learnMoreRow.appendChild(learnMore);
        this._quotaUsage = null;
        this._pieChart = new PerfUI.PieChart.PieChart();
        this._populatePieChart(0, []);
        const usageBreakdownRow = quota.appendRow();
        usageBreakdownRow.classList.add('usage-breakdown-row');
        usageBreakdownRow.appendChild(this._pieChart);
        /** @type {string} */
        this._previousOverrideFieldValue = '';
        const quotaOverrideCheckboxRow = quota.appendRow();
        this._quotaOverrideCheckbox = UI.UIUtils.CheckboxLabel.create('Simulate custom storage quota', false, '');
        quotaOverrideCheckboxRow.appendChild(this._quotaOverrideCheckbox);
        this._quotaOverrideCheckbox.checkboxElement.addEventListener('click', this._onClickCheckbox.bind(this), false);
        this._quotaOverrideControlRow = quota.appendRow();
        /** @type {!HTMLInputElement} */
        this._quotaOverrideEditor = /** @type {!HTMLInputElement} */ (this._quotaOverrideControlRow.createChild('input', 'quota-override-notification-editor'));
        this._quotaOverrideControlRow.appendChild(UI.UIUtils.createLabel(Common.UIString.UIString('MB')));
        this._quotaOverrideControlRow.classList.add('hidden');
        this._quotaOverrideEditor.addEventListener('keyup', event => {
            if (isEnterKey(event)) {
                this._applyQuotaOverrideFromInputField();
                event.consume(true);
            }
        });
        this._quotaOverrideEditor.addEventListener('focusout', event => {
            this._applyQuotaOverrideFromInputField();
            event.consume(true);
        });
        const errorMessageRow = quota.appendRow();
        this._quotaOverrideErrorMessage = errorMessageRow.createChild('div', 'quota-override-error');
        const clearButtonSection = this._reportView.appendSection('', 'clear-storage-button').appendRow();
        this._clearButton = UI.UIUtils.createTextButton(ls `Clear site data`, this._clear.bind(this));
        this._clearButton.id = 'storage-view-clear-button';
        clearButtonSection.appendChild(this._clearButton);
        this._includeThirdPartyCookiesCheckbox = UI.SettingsUI.createSettingCheckbox(ls `including third-party cookies`, this._includeThirdPartyCookiesSetting, true);
        this._includeThirdPartyCookiesCheckbox.classList.add('include-third-party-cookies');
        clearButtonSection.appendChild(this._includeThirdPartyCookiesCheckbox);
        const application = this._reportView.appendSection(Common.UIString.UIString('Application'));
        this._appendItem(application, Common.UIString.UIString('Unregister service workers'), 'service_workers');
        application.markFieldListAsGroup();
        const storage = this._reportView.appendSection(Common.UIString.UIString('Storage'));
        this._appendItem(storage, Common.UIString.UIString('Local and session storage'), 'local_storage');
        this._appendItem(storage, Common.UIString.UIString('IndexedDB'), 'indexeddb');
        this._appendItem(storage, Common.UIString.UIString('Web SQL'), 'websql');
        this._appendItem(storage, Common.UIString.UIString('Cookies'), 'cookies');
        storage.markFieldListAsGroup();
        const caches = this._reportView.appendSection(Common.UIString.UIString('Cache'));
        this._appendItem(caches, Common.UIString.UIString('Cache storage'), 'cache_storage');
        this._appendItem(caches, Common.UIString.UIString('Application cache'), 'appcache');
        caches.markFieldListAsGroup();
        SDK.SDKModel.TargetManager.instance().observeTargets(this);
    }
    /**
     * @param {!UI.ReportView.Section} section
     * @param {string} title
     * @param {string} settingName
     */
    _appendItem(section, title, settingName) {
        const row = section.appendRow();
        row.appendChild(UI.SettingsUI.createSettingCheckbox(title, this._settings.get(settingName), true));
    }
    /**
     * @override
     * @param {!SDK.SDKModel.Target} target
     */
    targetAdded(target) {
        if (this._target) {
            return;
        }
        this._target = target;
        const securityOriginManager = /** @type {!SDK.SecurityOriginManager.SecurityOriginManager} */ (target.model(SDK.SecurityOriginManager.SecurityOriginManager));
        this._updateOrigin(securityOriginManager.mainSecurityOrigin(), securityOriginManager.unreachableMainSecurityOrigin());
        securityOriginManager.addEventListener(SDK.SecurityOriginManager.Events.MainSecurityOriginChanged, this._originChanged, this);
    }
    /**
     * @override
     * @param {!SDK.SDKModel.Target} target
     */
    targetRemoved(target) {
        if (this._target !== target) {
            return;
        }
        const securityOriginManager = /** @type {!SDK.SecurityOriginManager.SecurityOriginManager} */ (target.model(SDK.SecurityOriginManager.SecurityOriginManager));
        securityOriginManager.removeEventListener(SDK.SecurityOriginManager.Events.MainSecurityOriginChanged, this._originChanged, this);
    }
    /**
     * @param {!Common.EventTarget.EventTargetEvent} event
     */
    _originChanged(event) {
        const mainOrigin = /** *@type {string} */ (event.data.mainSecurityOrigin);
        const unreachableMainOrigin = /** @type {string} */ (event.data.unreachableMainSecurityOrigin);
        this._updateOrigin(mainOrigin, unreachableMainOrigin);
    }
    /**
     * @param {string} mainOrigin
     * @param {?string} unreachableMainOrigin
     */
    async _updateOrigin(mainOrigin, unreachableMainOrigin) {
        const oldOrigin = this._securityOrigin;
        if (unreachableMainOrigin) {
            this._securityOrigin = unreachableMainOrigin;
            this._reportView.setSubtitle(ls `${unreachableMainOrigin} (failed to load)`);
        }
        else {
            this._securityOrigin = mainOrigin;
            this._reportView.setSubtitle(mainOrigin);
        }
        if (oldOrigin !== this._securityOrigin) {
            this._quotaOverrideControlRow.classList.add('hidden');
            this._quotaOverrideCheckbox.checkboxElement.checked = false;
            this._quotaOverrideErrorMessage.textContent = '';
        }
        this.doUpdate();
    }
    async _applyQuotaOverrideFromInputField() {
        if (!this._target || !this._securityOrigin) {
            this._quotaOverrideErrorMessage.textContent = ls `Internal error`;
            return;
        }
        this._quotaOverrideErrorMessage.textContent = '';
        const editorString = this._quotaOverrideEditor.value;
        if (editorString === '') {
            await this._clearQuotaForOrigin(this._target, this._securityOrigin);
            this._previousOverrideFieldValue = '';
            return;
        }
        const quota = parseFloat(editorString);
        if (!Number.isFinite(quota)) {
            this._quotaOverrideErrorMessage.textContent = ls `Please enter a number`;
            return;
        }
        if (quota < 0) {
            this._quotaOverrideErrorMessage.textContent = ls `Number must be non-negative`;
            return;
        }
        const bytesPerMB = 1000 * 1000;
        const quotaInBytes = Math.round(quota * bytesPerMB);
        const quotaFieldValue = `${quotaInBytes / bytesPerMB}`;
        this._quotaOverrideEditor.value = quotaFieldValue;
        this._previousOverrideFieldValue = quotaFieldValue;
        await this._target.storageAgent().invoke_overrideQuotaForOrigin({ origin: this._securityOrigin, quotaSize: quotaInBytes });
    }
    /**
     * @param {!SDK.SDKModel.Target} target
     * @param {string} origin
     */
    async _clearQuotaForOrigin(target, origin) {
        await target.storageAgent().invoke_overrideQuotaForOrigin({ origin });
    }
    async _onClickCheckbox() {
        if (this._quotaOverrideControlRow.classList.contains('hidden')) {
            this._quotaOverrideControlRow.classList.remove('hidden');
            this._quotaOverrideCheckbox.checkboxElement.checked = true;
            this._quotaOverrideEditor.value = this._previousOverrideFieldValue;
            this._quotaOverrideEditor.focus();
        }
        else if (this._target && this._securityOrigin) {
            this._quotaOverrideControlRow.classList.add('hidden');
            this._quotaOverrideCheckbox.checkboxElement.checked = false;
            await this._clearQuotaForOrigin(this._target, this._securityOrigin);
            this._quotaOverrideErrorMessage.textContent = '';
        }
    }
    _clear() {
        if (!this._securityOrigin) {
            return;
        }
        const selectedStorageTypes = [];
        for (const type of this._settings.keys()) {
            if (this._settings.get(type).get()) {
                selectedStorageTypes.push(type);
            }
        }
        if (this._target) {
            const includeThirdPartyCookies = this._includeThirdPartyCookiesSetting.get();
            ClearStorageView.clear(this._target, this._securityOrigin, selectedStorageTypes, includeThirdPartyCookies);
        }
        this._clearButton.disabled = true;
        const label = this._clearButton.textContent;
        this._clearButton.textContent = Common.UIString.UIString('Clearing...');
        setTimeout(() => {
            this._clearButton.disabled = false;
            this._clearButton.textContent = label;
            this._clearButton.focus();
        }, 500);
    }
    /**
     * @param {!SDK.SDKModel.Target} target
     * @param {string} securityOrigin
     * @param {!Array<string>} selectedStorageTypes
     * @param {boolean} includeThirdPartyCookies
     */
    static clear(target, securityOrigin, selectedStorageTypes, includeThirdPartyCookies) {
        target.storageAgent().invoke_clearDataForOrigin({ origin: securityOrigin, storageTypes: selectedStorageTypes.join(',') });
        const set = new Set(selectedStorageTypes);
        const hasAll = set.has(Protocol.Storage.StorageType.All);
        if (set.has(Protocol.Storage.StorageType.Cookies) || hasAll) {
            const cookieModel = target.model(SDK.CookieModel.CookieModel);
            if (cookieModel) {
                cookieModel.clear(undefined, includeThirdPartyCookies ? undefined : securityOrigin);
            }
        }
        if (set.has(Protocol.Storage.StorageType.Indexeddb) || hasAll) {
            for (const target of SDK.SDKModel.TargetManager.instance().targets()) {
                const indexedDBModel = target.model(IndexedDBModel);
                if (indexedDBModel) {
                    indexedDBModel.clearForOrigin(securityOrigin);
                }
            }
        }
        if (set.has(Protocol.Storage.StorageType.Local_storage) || hasAll) {
            const storageModel = target.model(DOMStorageModel);
            if (storageModel) {
                storageModel.clearForOrigin(securityOrigin);
            }
        }
        if (set.has(Protocol.Storage.StorageType.Websql) || hasAll) {
            const databaseModel = target.model(DatabaseModel);
            if (databaseModel) {
                databaseModel.disable();
                databaseModel.enable();
            }
        }
        if (set.has(Protocol.Storage.StorageType.Cache_storage) || hasAll) {
            const target = SDK.SDKModel.TargetManager.instance().mainTarget();
            const model = target && target.model(SDK.ServiceWorkerCacheModel.ServiceWorkerCacheModel);
            if (model) {
                model.clearForOrigin(securityOrigin);
            }
        }
        if (set.has(Protocol.Storage.StorageType.Appcache) || hasAll) {
            const appcacheModel = target.model(ApplicationCacheModel);
            if (appcacheModel) {
                appcacheModel.reset();
            }
        }
    }
    /**
     * @override
     * @return {!Promise<?>}
     */
    async doUpdate() {
        if (!this._securityOrigin || !this._target) {
            this._quotaRow.textContent = '';
            this._populatePieChart(0, []);
            return;
        }
        const securityOrigin = /** @type {string} */ (this._securityOrigin);
        const response = await this._target.storageAgent().invoke_getUsageAndQuota({ origin: securityOrigin });
        this._quotaRow.textContent = '';
        if (response.getError()) {
            this._populatePieChart(0, []);
            return;
        }
        const quotaOverridden = response.overrideActive;
        const quotaAsString = Platform.NumberUtilities.bytesToString(response.quota);
        const usageAsString = Platform.NumberUtilities.bytesToString(response.usage);
        const formattedQuotaAsString = i18nString(UIStrings.storageWithCustomMarker, { PH1: quotaAsString });
        const quota = quotaOverridden ? UI.Fragment.Fragment.build `<b>${formattedQuotaAsString}</b>`.element() : quotaAsString;
        const element = i18n.i18n.getFormatLocalizedString(str_, UIStrings.storageQuotaUsed, { PH1: usageAsString, PH2: quota });
        this._quotaRow.appendChild(element);
        UI.Tooltip.Tooltip.install(this._quotaRow, i18nString(UIStrings.storageQuotaUsedWithBytes, { PH1: response.usage.toLocaleString(), PH2: response.quota.toLocaleString() }));
        if (!response.overrideActive && response.quota < 125829120) { // 120 MB
            UI.Tooltip.Tooltip.install(this._quotaRow, ls `Storage quota is limited in Incognito mode`);
            this._quotaRow.appendChild(UI.Icon.Icon.create('smallicon-info'));
        }
        if (this._quotaUsage === null || this._quotaUsage !== response.usage) {
            this._quotaUsage = response.usage;
            /** @type {!Array<!PerfUI.PieChart.Slice>} */
            const slices = [];
            for (const usageForType of response.usageBreakdown.sort((a, b) => b.usage - a.usage)) {
                const value = usageForType.usage;
                if (!value) {
                    continue;
                }
                const title = this._getStorageTypeName(usageForType.storageType);
                const color = this._pieColors.get(usageForType.storageType) || '#ccc';
                slices.push({ value, color, title });
            }
            this._populatePieChart(response.usage, slices);
        }
        this._usageUpdatedForTest(response.usage, response.quota, response.usageBreakdown);
        this.update();
    }
    /**
     * @param {number} total
     * @param {!Array<!PerfUI.PieChart.Slice>} slices
     */
    _populatePieChart(total, slices) {
        this._pieChart.data = {
            chartName: ls `Storage usage`,
            size: 110,
            formatter: Platform.NumberUtilities.bytesToString,
            showLegend: true,
            total,
            slices
        };
    }
    /**
     * @param {string} type
     * @return {string}
     */
    _getStorageTypeName(type) {
        switch (type) {
            case Protocol.Storage.StorageType.File_systems:
                return Common.UIString.UIString('File System');
            case Protocol.Storage.StorageType.Websql:
                return Common.UIString.UIString('Web SQL');
            case Protocol.Storage.StorageType.Appcache:
                return Common.UIString.UIString('Application Cache');
            case Protocol.Storage.StorageType.Indexeddb:
                return Common.UIString.UIString('IndexedDB');
            case Protocol.Storage.StorageType.Cache_storage:
                return Common.UIString.UIString('Cache Storage');
            case Protocol.Storage.StorageType.Service_workers:
                return Common.UIString.UIString('Service Workers');
            default:
                return Common.UIString.UIString('Other');
        }
    }
    /**
     * @param {number} usage
     * @param {number} quota
     * @param {!Array<!Protocol.Storage.UsageForType>} usageBreakdown
     */
    _usageUpdatedForTest(usage, quota, usageBreakdown) {
    }
}
export const AllStorageTypes = [
    Protocol.Storage.StorageType.Appcache, Protocol.Storage.StorageType.Cache_storage,
    Protocol.Storage.StorageType.Cookies, Protocol.Storage.StorageType.Indexeddb,
    Protocol.Storage.StorageType.Local_storage, Protocol.Storage.StorageType.Service_workers,
    Protocol.Storage.StorageType.Websql
];
/**
 * @implements {UI.ActionRegistration.ActionDelegate}
 */
export class ActionDelegate {
    /**
     * @override
     * @param {!UI.Context.Context} context
     * @param {string} actionId
     * @return {boolean}
     */
    handleAction(context, actionId) {
        switch (actionId) {
            case 'resources.clear':
                return this._handleClear(false);
            case 'resources.clear-incl-third-party-cookies':
                return this._handleClear(true);
        }
        return false;
    }
    /**
     * @param {boolean} includeThirdPartyCookies
     * @return {boolean}
     */
    _handleClear(includeThirdPartyCookies) {
        const target = SDK.SDKModel.TargetManager.instance().mainTarget();
        if (!target) {
            return false;
        }
        const resourceTreeModel = target.model(SDK.ResourceTreeModel.ResourceTreeModel);
        if (!resourceTreeModel) {
            return false;
        }
        const securityOrigin = resourceTreeModel.getMainSecurityOrigin();
        if (!securityOrigin) {
            return false;
        }
        ClearStorageView.clear(target, securityOrigin, AllStorageTypes, includeThirdPartyCookies);
        return true;
    }
}
//# sourceMappingURL=ClearStorageView.js.map