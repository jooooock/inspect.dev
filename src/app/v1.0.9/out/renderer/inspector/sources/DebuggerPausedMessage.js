// Copyright 2016 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as Common from '../common/common.js';
import * as SDK from '../sdk/sdk.js';
import * as UI from '../ui/ui.js';
export class DebuggerPausedMessage {
    constructor() {
        this._element = document.createElement('div');
        this._element.classList.add('paused-message');
        this._element.classList.add('flex-none');
        const root = UI.Utils.createShadowRootWithCoreStyles(this._element, { cssFile: 'sources/debuggerPausedMessage.css', enableLegacyPatching: true, delegatesFocus: undefined });
        /** @type {!HTMLElement} */
        this._contentElement = /** @type {!HTMLElement} */ (root.createChild('div'));
        UI.ARIAUtils.markAsPoliteLiveRegion(this._element, false);
    }
    /**
     * @return {!Element}
     */
    element() {
        return this._element;
    }
    /**
     * @param {string} description
     */
    static _descriptionWithoutStack(description) {
        const firstCallFrame = /^\s+at\s/m.exec(description);
        return firstCallFrame ? description.substring(0, firstCallFrame.index - 1) :
            description.substring(0, description.lastIndexOf('\n'));
    }
    /**
     * @param {!SDK.DebuggerModel.DebuggerPausedDetails} details
     * @return {!Promise<!Element>}
     */
    static async _createDOMBreakpointHitMessage(details) {
        const messageWrapper = document.createElement('span');
        const domDebuggerModel = details.debuggerModel.target().model(SDK.DOMDebuggerModel.DOMDebuggerModel);
        if (!details.auxData || !domDebuggerModel) {
            return messageWrapper;
        }
        const data = domDebuggerModel.resolveDOMBreakpointData(
        /** @type {!{type: !Protocol.DOMDebugger.DOMBreakpointType, nodeId: !Protocol.DOM.NodeId, targetNodeId: !Protocol.DOM.NodeId, insertion: boolean}} */
        (details.auxData));
        if (!data) {
            return messageWrapper;
        }
        const mainElement = messageWrapper.createChild('div', 'status-main');
        mainElement.appendChild(UI.Icon.Icon.create('smallicon-info', 'status-icon'));
        const breakpointType = BreakpointTypeNouns.get(data.type);
        mainElement.appendChild(document.createTextNode(ls `Paused on ${breakpointType}`));
        const subElement = messageWrapper.createChild('div', 'status-sub monospace');
        const linkifiedNode = await Common.Linkifier.Linkifier.linkify(data.node);
        subElement.appendChild(linkifiedNode);
        if (data.targetNode) {
            const targetNodeLink = await Common.Linkifier.Linkifier.linkify(data.targetNode);
            let messageElement;
            if (data.insertion) {
                if (data.targetNode === data.node) {
                    messageElement = UI.UIUtils.formatLocalized('Child %s added', [targetNodeLink]);
                }
                else {
                    messageElement = UI.UIUtils.formatLocalized('Descendant %s added', [targetNodeLink]);
                }
            }
            else {
                messageElement = UI.UIUtils.formatLocalized('Descendant %s removed', [targetNodeLink]);
            }
            subElement.appendChild(document.createElement('br'));
            subElement.appendChild(messageElement);
        }
        return messageWrapper;
    }
    /**
     * @param {?SDK.DebuggerModel.DebuggerPausedDetails} details
     * @param {!Bindings.DebuggerWorkspaceBinding.DebuggerWorkspaceBinding} debuggerWorkspaceBinding
     * @param {!Bindings.BreakpointManager.BreakpointManager} breakpointManager
     * @return {!Promise<void>}
     */
    async render(details, debuggerWorkspaceBinding, breakpointManager) {
        this._contentElement.removeChildren();
        this._contentElement.hidden = !details;
        if (!details) {
            return;
        }
        const status = this._contentElement.createChild('div', 'paused-status');
        const errorLike = details.reason === Protocol.Debugger.PausedEventReason.Exception ||
            details.reason === Protocol.Debugger.PausedEventReason.PromiseRejection ||
            details.reason === Protocol.Debugger.PausedEventReason.Assert ||
            details.reason === Protocol.Debugger.PausedEventReason.OOM;
        let messageWrapper;
        if (details.reason === Protocol.Debugger.PausedEventReason.DOM) {
            messageWrapper = await DebuggerPausedMessage._createDOMBreakpointHitMessage(details);
        }
        else if (details.reason === Protocol.Debugger.PausedEventReason.EventListener) {
            let eventNameForUI = '';
            if (details.auxData) {
                eventNameForUI = SDK.DOMDebuggerModel.DOMDebuggerManager.instance().resolveEventListenerBreakpointTitle(
                /** @type {!{directiveText: string, eventName: string, targetName: string, webglErrorName: string}} */ (details.auxData));
            }
            messageWrapper = buildWrapper(Common.UIString.UIString('Paused on event listener'), eventNameForUI);
        }
        else if (details.reason === Protocol.Debugger.PausedEventReason.XHR) {
            const auxData = /** @type {!PausedDetailsAuxData} */ (details.auxData);
            messageWrapper = buildWrapper(Common.UIString.UIString('Paused on XHR or fetch'), auxData.url || '');
        }
        else if (details.reason === Protocol.Debugger.PausedEventReason.Exception) {
            const auxData = /** @type {!PausedDetailsAuxData} */ (details.auxData);
            const description = auxData.description || auxData.value || '';
            const descriptionWithoutStack = DebuggerPausedMessage._descriptionWithoutStack(description);
            messageWrapper =
                buildWrapper(Common.UIString.UIString('Paused on exception'), descriptionWithoutStack, description);
        }
        else if (details.reason === Protocol.Debugger.PausedEventReason.PromiseRejection) {
            const auxData = /** @type {!PausedDetailsAuxData} */ (details.auxData);
            const description = auxData.description || auxData.value || '';
            const descriptionWithoutStack = DebuggerPausedMessage._descriptionWithoutStack(description);
            messageWrapper =
                buildWrapper(Common.UIString.UIString('Paused on promise rejection'), descriptionWithoutStack, description);
        }
        else if (details.reason === Protocol.Debugger.PausedEventReason.Assert) {
            messageWrapper = buildWrapper(Common.UIString.UIString('Paused on assertion'));
        }
        else if (details.reason === Protocol.Debugger.PausedEventReason.DebugCommand) {
            messageWrapper = buildWrapper(Common.UIString.UIString('Paused on debugged function'));
        }
        else if (details.reason === Protocol.Debugger.PausedEventReason.OOM) {
            messageWrapper = buildWrapper(Common.UIString.UIString('Paused before potential out-of-memory crash'));
        }
        else if (details.reason === Protocol.Debugger.PausedEventReason.CSPViolation && details.auxData &&
            details.auxData['violationType']) {
            const text = /** @type {string} */ (details.auxData['violationType']);
            if (text === Protocol.DOMDebugger.CSPViolationType.TrustedtypeSinkViolation) {
                messageWrapper = buildWrapper(ls `Paused on CSP violation`, ls `Trusted Type Sink Violation`);
            }
            else if (text === Protocol.DOMDebugger.CSPViolationType.TrustedtypePolicyViolation) {
                messageWrapper = buildWrapper(ls `Paused on CSP violation`, ls `Trusted Type Policy Violation`);
            }
        }
        else if (details.callFrames.length) {
            const uiLocation = await debuggerWorkspaceBinding.rawLocationToUILocation(details.callFrames[0].location());
            const breakpoint = uiLocation ? breakpointManager.findBreakpoint(uiLocation) : null;
            const defaultText = breakpoint ? Common.UIString.UIString('Paused on breakpoint') : Common.UIString.UIString('Debugger paused');
            messageWrapper = buildWrapper(defaultText);
        }
        else {
            console.warn('ScriptsPanel paused, but callFrames.length is zero.'); // TODO remove this once we understand this case better
        }
        status.classList.toggle('error-reason', errorLike);
        if (messageWrapper) {
            status.appendChild(messageWrapper);
        }
        /**
         * @param  {string} mainText
         * @param  {string=} subText
         * @param  {string=} title
         * @return {!Element}
         */
        function buildWrapper(mainText, subText, title) {
            const messageWrapper = document.createElement('span');
            const mainElement = messageWrapper.createChild('div', 'status-main');
            const icon = UI.Icon.Icon.create(errorLike ? 'smallicon-error' : 'smallicon-info', 'status-icon');
            mainElement.appendChild(icon);
            mainElement.appendChild(document.createTextNode(mainText));
            if (subText) {
                const subElement = messageWrapper.createChild('div', 'status-sub monospace');
                subElement.textContent = subText;
                UI.Tooltip.Tooltip.install(subElement, title || subText);
            }
            return messageWrapper;
        }
    }
}
export const BreakpointTypeNouns = new Map([
    [Protocol.DOMDebugger.DOMBreakpointType.SubtreeModified, Common.UIString.UIString('subtree modifications')],
    [Protocol.DOMDebugger.DOMBreakpointType.AttributeModified, Common.UIString.UIString('attribute modifications')],
    [Protocol.DOMDebugger.DOMBreakpointType.NodeRemoved, Common.UIString.UIString('node removal')],
]);
/**
 * @typedef {{
 *   description: (string|undefined),
 *   url: (string|undefined),
 *   value: (string|undefined),
 * }}
 */
let PausedDetailsAuxData; // eslint-disable-line no-unused-vars
//# sourceMappingURL=DebuggerPausedMessage.js.map