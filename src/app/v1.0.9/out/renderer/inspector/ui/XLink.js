// Copyright 2017 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as Host from '../host/host.js';
import * as ARIAUtils from './ARIAUtils.js';
import { html } from './Fragment.js';
import { Tooltip } from './Tooltip.js';
import { addReferrerToURLIfNecessary, copyLinkAddressLabel, MaxLengthForDisplayedURLs, openLinkExternallyLabel } from './UIUtils.js';
import { XElement } from './XElement.js';
/**
 * @extends {XElement}
 */
export class XLink extends XElement {
    /**
     * @param {string} url
     * @param {string=} linkText
     * @param {string=} className
     * @param {boolean=} preventClick
     * @return {!HTMLElement}
     */
    static create(url, linkText, className, preventClick) {
        if (!linkText) {
            linkText = url;
        }
        className = className || '';
        url = addReferrerToURLIfNecessary(url);
        // clang-format off
        // TODO(dgozman): migrate css from 'devtools-link' to 'x-link'.
        const element = html `
        <x-link href='${url}' class='${className} devtools-link' ${preventClick ? 'no-click' : ''}
        >${linkText.trimMiddle(MaxLengthForDisplayedURLs)}</x-link>`;
        // clang-format on
        return /** @type {!HTMLElement} */ (element);
    }
    constructor() {
        super();
        this.style.setProperty('display', 'inline');
        ARIAUtils.markAsLink(this);
        this.tabIndex = 0;
        this.target = '_blank';
        this.rel = 'noopener';
        /** @type {?string} */
        this._href = null;
        this._clickable = true;
        /** @type {function(!Event):void} */
        this._onClick = event => {
            event.consume(true);
            Host.InspectorFrontendHost.InspectorFrontendHostInstance.openInNewTab(/** @type {string} */ (this._href));
        };
        /** @type {function(!Event):void} */
        this._onKeyDown = event => {
            if (isEnterOrSpaceKey(event)) {
                event.consume(true);
                Host.InspectorFrontendHost.InspectorFrontendHostInstance.openInNewTab(/** @type {string} */ (this._href));
            }
        };
    }
    /**
     * @override
     * @return {!Array<string>}
     */
    static get observedAttributes() {
        // TODO(dgozman): should be super.observedAttributes, but it does not compile.
        return XElement.observedAttributes.concat(['href', 'no-click']);
    }
    /**
     * @param {string} attr
     * @param {?string} oldValue
     * @param {?string} newValue
     * @override
     */
    attributeChangedCallback(attr, oldValue, newValue) {
        if (attr === 'no-click') {
            this._clickable = !newValue;
            this._updateClick();
            return;
        }
        if (attr === 'href') {
            // For invalid or non-absolute URLs, `href` should remain `null`.
            if (!newValue) {
                newValue = '';
            }
            let href = null;
            let url = null;
            try {
                url = new URL(newValue);
                href = url.toString();
            }
            catch {
            }
            if (url && url.protocol === 'javascript:') {
                href = null;
            }
            this._href = href;
            Tooltip.install(this, newValue);
            this._updateClick();
            return;
        }
        super.attributeChangedCallback(attr, oldValue, newValue);
    }
    _updateClick() {
        if (this._href !== null && this._clickable) {
            this.addEventListener('click', this._onClick, false);
            this.addEventListener('keydown', this._onKeyDown, false);
            this.style.setProperty('cursor', 'pointer');
        }
        else {
            this.removeEventListener('click', this._onClick, false);
            this.removeEventListener('keydown', this._onKeyDown, false);
            this.style.removeProperty('cursor');
        }
    }
}
/**
 * @implements {Provider}
 */
export class ContextMenuProvider {
    /**
     * @override
     * @param {!Event} event
     * @param {!ContextMenu} contextMenu
     * @param {!Object} target
     */
    appendApplicableItems(event, contextMenu, target) {
        let targetNode = /** @type {?Node} */ (target);
        while (targetNode && !(targetNode instanceof XLink)) {
            targetNode = targetNode.parentNodeOrShadowHost();
        }
        if (!targetNode || !targetNode._href) {
            return;
        }
        /** @type {!XLink} */
        const node = targetNode;
        contextMenu.revealSection().appendItem(openLinkExternallyLabel(), () => {
            if (node._href) {
                Host.InspectorFrontendHost.InspectorFrontendHostInstance.openInNewTab(node._href);
            }
        });
        contextMenu.revealSection().appendItem(copyLinkAddressLabel(), () => {
            if (node._href) {
                Host.InspectorFrontendHost.InspectorFrontendHostInstance.copyText(node._href);
            }
        });
    }
}
self.customElements.define('x-link', XLink);
//# sourceMappingURL=XLink.js.map