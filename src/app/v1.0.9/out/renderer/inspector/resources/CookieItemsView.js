/*
 * Copyright (C) 2009 Apple Inc.  All rights reserved.
 * Copyright (C) 2009 Joseph Pecoraro
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 * 1.  Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer.
 * 2.  Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution.
 * 3.  Neither the name of Apple Computer, Inc. ("Apple") nor the names of
 *     its contributors may be used to endorse or promote products derived
 *     from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE AND ITS CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL APPLE OR ITS CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
import * as BrowserSDK from '../browser_sdk/browser_sdk.js';
import * as Common from '../common/common.js';
import * as CookieTable from '../cookie_table/cookie_table.js';
import * as SDK from '../sdk/sdk.js';
import * as UI from '../ui/ui.js';
import { StorageItemsView } from './StorageItemsView.js';
class CookiePreviewWidget extends UI.Widget.VBox {
    constructor() {
        super();
        this.setMinimumSize(230, 45);
        /** @type {?SDK.Cookie.Cookie} cookie */
        this._cookie = null;
        this._showDecodedSetting = Common.Settings.Settings.instance().createSetting('cookieViewShowDecoded', false);
        const header = document.createElement('div');
        header.classList.add('cookie-preview-widget-header');
        const span = document.createElement('span');
        span.classList.add('cookie-preview-widget-header-label');
        span.textContent = 'Cookie Value';
        header.appendChild(span);
        this.contentElement.appendChild(header);
        const toggle = UI.UIUtils.CheckboxLabel.create(ls `Show URL decoded`, this._showDecodedSetting.get());
        toggle.classList.add('cookie-preview-widget-toggle');
        toggle.checkboxElement.addEventListener('click', () => this.showDecoded(!this._showDecodedSetting.get()));
        header.appendChild(toggle);
        this._toggle = toggle;
        const value = document.createElement('div');
        value.classList.add('cookie-preview-widget-cookie-value');
        value.textContent = '';
        value.addEventListener('dblclick', this.handleDblClickOnCookieValue.bind(this));
        this._value = value;
        this.contentElement.classList.add('cookie-preview-widget');
        this.contentElement.appendChild(value);
    }
    /**
     *
     * @param {boolean} decoded
     */
    showDecoded(decoded) {
        if (!this._cookie) {
            return;
        }
        this._showDecodedSetting.set(decoded);
        this._toggle.checkboxElement.checked = decoded;
        this._updatePreview();
    }
    _updatePreview() {
        if (this._cookie) {
            this._value.textContent =
                this._showDecodedSetting.get() ? decodeURIComponent(this._cookie.value()) : this._cookie.value();
        }
        else {
            this._value.textContent = '';
        }
    }
    /**
     * @param {!SDK.Cookie.Cookie} cookie
     */
    setCookie(cookie) {
        this._cookie = cookie;
        this._updatePreview();
    }
    /**
     * Select all text even if there a spaces in it
     * @param {!Event} event
     */
    handleDblClickOnCookieValue(event) {
        event.preventDefault();
        const range = document.createRange();
        range.selectNode(this._value);
        const selection = window.getSelection();
        if (!selection) {
            return;
        }
        selection.removeAllRanges();
        selection.addRange(range);
    }
}
export class CookieItemsView extends StorageItemsView {
    /**
     * @param {!SDK.CookieModel.CookieModel} model
     * @param {string} cookieDomain
     */
    constructor(model, cookieDomain) {
        super(Common.UIString.UIString('Cookies'), 'cookiesPanel');
        this.registerRequiredCSS('resources/cookieItemsView.css', { enableLegacyPatching: false });
        this.element.classList.add('storage-view');
        /** @type {!SDK.CookieModel.CookieModel} */
        this._model = model;
        this._cookieDomain = cookieDomain;
        this._totalSize = 0;
        /** @type {!CookieTable.CookiesTable.CookiesTable} */
        this._cookiesTable = new CookieTable.CookiesTable.CookiesTable(
        /* renderInline */ false, this._saveCookie.bind(this), this.refreshItems.bind(this), this._handleCookieSelected.bind(this), this._deleteCookie.bind(this));
        this._cookiesTable.setMinimumSize(0, 50);
        this._splitWidget = new UI.SplitWidget.SplitWidget(
        /* isVertical: */ false, /* secondIsSidebar: */ true, 'cookieItemsSplitViewState');
        this._splitWidget.show(this.element);
        this._previewPanel = new UI.Widget.VBox();
        const resizer = this._previewPanel.element.createChild('div', 'preview-panel-resizer');
        this._splitWidget.setMainWidget(this._cookiesTable);
        this._splitWidget.setSidebarWidget(this._previewPanel);
        this._splitWidget.installResizer(resizer);
        this._previewWidget = new CookiePreviewWidget();
        this._emptyWidget = new UI.EmptyWidget.EmptyWidget(ls `Select a cookie to preview its value`);
        this._emptyWidget.show(this._previewPanel.contentElement);
        this._onlyIssuesFilterUI = new UI.Toolbar.ToolbarCheckbox(ls `Only show cookies with an issue`, ls `Only show cookies which have an associated issue`, () => {
            this._updateWithCookies(this._allCookies);
        });
        this.appendToolbarItem(this._onlyIssuesFilterUI);
        this._refreshThrottler = new Common.Throttler.Throttler(300);
        /** @type {!Array<!Common.EventTarget.EventDescriptor>} */
        this._eventDescriptors = [];
        /** @type {!Array<!SDK.Cookie.Cookie>} */
        this._allCookies = [];
        /** @type {!Array<!SDK.Cookie.Cookie>} */
        this._shownCookies = [];
        /** @type {?SDK.Cookie.Cookie} */
        this._selectedCookie = null;
        this.setCookiesDomain(model, cookieDomain);
    }
    /**
     * @param {!SDK.CookieModel.CookieModel} model
     * @param {string} domain
     */
    setCookiesDomain(model, domain) {
        this._model = model;
        this._cookieDomain = domain;
        this.refreshItems();
        Common.EventTarget.EventTarget.removeEventListeners(this._eventDescriptors);
        const networkManager = model.target().model(SDK.NetworkManager.NetworkManager);
        if (networkManager) {
            this._eventDescriptors = [
                networkManager.addEventListener(SDK.NetworkManager.Events.ResponseReceived, this._onResponseReceived, this),
                networkManager.addEventListener(SDK.NetworkManager.Events.LoadingFinished, this._onLoadingFinished, this),
            ];
        }
    }
    /**
     * @param {?SDK.Cookie.Cookie} cookie
     */
    _showPreview(cookie) {
        if (cookie === this._selectedCookie) {
            return;
        }
        this._selectedCookie = cookie;
        if (!cookie) {
            this._previewWidget.detach();
            this._emptyWidget.show(this._previewPanel.contentElement);
        }
        else {
            this._emptyWidget.detach();
            this._previewWidget.setCookie(cookie);
            this._previewWidget.show(this._previewPanel.contentElement);
        }
    }
    _handleCookieSelected() {
        const cookie = this._cookiesTable.selectedCookie();
        this.setCanDeleteSelected(Boolean(cookie));
        this._showPreview(cookie);
    }
    /**
     * @param {!SDK.Cookie.Cookie} newCookie
     * @param {?SDK.Cookie.Cookie} oldCookie
     * @return {!Promise<boolean>}
     */
    async _saveCookie(newCookie, oldCookie) {
        if (oldCookie && newCookie.key() !== oldCookie.key()) {
            await this._model.deleteCookie(oldCookie);
        }
        return this._model.saveCookie(newCookie);
    }
    /**
     * @param {!SDK.Cookie.Cookie} cookie
     * @param {function():void} callback
     */
    _deleteCookie(cookie, callback) {
        this._model.deleteCookie(cookie).then(callback);
    }
    /**
     * @param {!Array<!SDK.Cookie.Cookie>} allCookies
     */
    _updateWithCookies(allCookies) {
        this._allCookies = allCookies;
        this._totalSize = allCookies.reduce((size, cookie) => size + cookie.size(), 0);
        const parsedURL = Common.ParsedURL.ParsedURL.fromString(this._cookieDomain);
        const host = parsedURL ? parsedURL.host : '';
        this._cookiesTable.setCookieDomain(host);
        this._shownCookies = this.filter(allCookies, cookie => `${cookie.name()} ${cookie.value()} ${cookie.domain()}`);
        if (this.hasFilter()) {
            this.setDeleteAllTitle(ls `Clear filtered cookies`);
            this.setDeleteAllGlyph('largeicon-delete-filter');
        }
        else {
            this.setDeleteAllTitle(ls `Clear all cookies`);
            this.setDeleteAllGlyph('largeicon-delete-list');
        }
        this._cookiesTable.setCookies(this._shownCookies, this._model.getCookieToBlockedReasonsMap());
        UI.ARIAUtils.alert(ls `Number of cookies shown in table: ${this._shownCookies.length}`, this.element);
        this.setCanFilter(true);
        this.setCanDeleteAll(this._shownCookies.length > 0);
        this.setCanDeleteSelected(Boolean(this._cookiesTable.selectedCookie()));
        if (!this._cookiesTable.selectedCookie()) {
            this._showPreview(null);
        }
    }
    /**
     * @override
     * @template T
     * @param {!Array<!T>} items
     * @param {function(!T): string} keyFunction
     * @return {!Array<!T>}
     * @protected
     */
    filter(items, keyFunction) {
        /** @param {T|null} object */
        const predicate = object => {
            if (!this._onlyIssuesFilterUI.checked()) {
                return true;
            }
            if (object instanceof SDK.Cookie.Cookie) {
                return BrowserSDK.RelatedIssue.hasIssues(object);
            }
            return false;
        };
        return super.filter(items, keyFunction).filter(predicate);
    }
    /**
     * This will only delete the currently visible cookies.
     *
     * @override
     */
    deleteAllItems() {
        this._showPreview(null);
        this._model.deleteCookies(this._shownCookies).then(() => this.refreshItems());
    }
    /**
     * @override
     */
    deleteSelectedItem() {
        const selectedCookie = this._cookiesTable.selectedCookie();
        if (selectedCookie) {
            this._showPreview(null);
            this._model.deleteCookie(selectedCookie).then(() => this.refreshItems());
        }
    }
    /**
     * @override
     */
    refreshItems() {
        this._model.getCookiesForDomain(this._cookieDomain).then(this._updateWithCookies.bind(this));
    }
    refreshItemsThrottled() {
        this._refreshThrottler.schedule(() => Promise.resolve(this.refreshItems()));
    }
    _onResponseReceived() {
        this.refreshItemsThrottled();
    }
    _onLoadingFinished() {
        this.refreshItemsThrottled();
    }
}
//# sourceMappingURL=CookieItemsView.js.map