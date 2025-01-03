// Copyright 2017 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as Common from '../common/common.js';
import * as i18n from '../i18n/i18n.js';
import * as SDK from '../sdk/sdk.js';
import { ThrottlingPresets } from './ThrottlingPresets.js'; // eslint-disable-line no-unused-vars
export const UIStrings = {
    /**
    *@description Text to indicate something is not enabled
    */
    disabled: 'Disabled',
    /**
    *@description Title for a group of configuration options
    */
    presets: 'Presets',
    /**
    *@description Text in Network Throttling Selector of the Network panel
    */
    custom: 'Custom',
};
const str_ = i18n.i18n.registerUIStrings('mobile_throttling/NetworkThrottlingSelector.js', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class NetworkThrottlingSelector {
    /**
     * @param {function(!Array<!NetworkThrottlingConditionsGroup>):!Array<?SDK.NetworkManager.Conditions>} populateCallback
     * @param {function(number):void} selectCallback
     * @param {!Common.Settings.Setting<!Array<!SDK.NetworkManager.Conditions>>} customNetworkConditionsSetting
     */
    constructor(populateCallback, selectCallback, customNetworkConditionsSetting) {
        this._populateCallback = populateCallback;
        this._selectCallback = selectCallback;
        this._customNetworkConditionsSetting = customNetworkConditionsSetting;
        this._customNetworkConditionsSetting.addChangeListener(this._populateOptions, this);
        SDK.NetworkManager.MultitargetNetworkManager.instance().addEventListener(SDK.NetworkManager.MultitargetNetworkManager.Events.ConditionsChanged, () => {
            this._networkConditionsChanged();
        }, this);
        /** @type {!Array<?SDK.NetworkManager.Conditions>} */
        this._options;
        this._populateOptions();
    }
    revealAndUpdate() {
        Common.Revealer.reveal(this._customNetworkConditionsSetting);
        this._networkConditionsChanged();
    }
    /**
     * @param {!SDK.NetworkManager.Conditions} conditions
     */
    optionSelected(conditions) {
        SDK.NetworkManager.MultitargetNetworkManager.instance().setNetworkConditions(conditions);
    }
    _populateOptions() {
        const disabledGroup = { title: i18nString(UIStrings.disabled), items: [SDK.NetworkManager.NoThrottlingConditions] };
        const presetsGroup = { title: i18nString(UIStrings.presets), items: ThrottlingPresets.networkPresets };
        const customGroup = { title: i18nString(UIStrings.custom), items: this._customNetworkConditionsSetting.get() };
        this._options = this._populateCallback([disabledGroup, presetsGroup, customGroup]);
        if (!this._networkConditionsChanged()) {
            for (let i = this._options.length - 1; i >= 0; i--) {
                if (this._options[i]) {
                    this.optionSelected(/** @type {!SDK.NetworkManager.Conditions} */ (this._options[i]));
                    break;
                }
            }
        }
    }
    /**
     * @return {boolean} returns false if selected condition no longer exists
     */
    _networkConditionsChanged() {
        const value = SDK.NetworkManager.MultitargetNetworkManager.instance().networkConditions();
        for (let index = 0; index < this._options.length; ++index) {
            const option = this._options[index];
            if (option && option.download === value.download && option.upload === value.upload &&
                option.latency === value.latency && option.title === value.title) {
                this._selectCallback(index);
                return true;
            }
        }
        return false;
    }
}
//# sourceMappingURL=NetworkThrottlingSelector.js.map