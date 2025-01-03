// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as Common from '../common/common.js';
import * as Components from '../components/components.js';
import * as Host from '../host/host.js';
import * as Network from '../network/network.js';
import * as SDK from '../sdk/sdk.js';
import * as WebComponents from '../ui/components/components.js';
import * as UI from '../ui/ui.js';
export const extractShortPath = (path) => {
    // 1st regex matches everything after last '/'
    // if path ends with '/', 2nd regex returns everything between the last two '/'
    return (/[^/]+$/.exec(path) || /[^/]+\/$/.exec(path) || [''])[0];
};
/**
 * The base class for all affected resource views. It provides basic scaffolding
 * as well as machinery for resolving request and frame ids to SDK objects.
 */
export class AffectedResourcesView extends UI.TreeOutline.TreeElement {
    /**
     * @param resourceName - Singular and plural of the affected resource name.
     */
    constructor(parent, resourceName) {
        super();
        this.toggleOnClick = true;
        this.parentView = parent;
        this.resourceName = resourceName;
        this.affectedResourcesCountElement = this.createAffectedResourcesCounter();
        this.affectedResources = this.createAffectedResources();
        this.affectedResourcesCount = 0;
        this.networkListener = null;
        this.frameListeners = [];
        this.unresolvedRequestIds = new Set();
        this.unresolvedFrameIds = new Set();
    }
    createAffectedResourcesCounter() {
        const counterLabel = document.createElement('div');
        counterLabel.classList.add('affected-resource-label');
        this.listItemElement.appendChild(counterLabel);
        return counterLabel;
    }
    createAffectedResources() {
        const body = new UI.TreeOutline.TreeElement();
        const affectedResources = document.createElement('table');
        affectedResources.classList.add('affected-resource-list');
        body.listItemElement.appendChild(affectedResources);
        this.appendChild(body);
        return affectedResources;
    }
    getResourceName(count) {
        if (count === 1) {
            return this.resourceName.singular;
        }
        return this.resourceName.plural;
    }
    updateAffectedResourceCount(count) {
        this.affectedResourcesCount = count;
        this.affectedResourcesCountElement.textContent = `${count} ${this.getResourceName(count)}`;
        this.hidden = this.affectedResourcesCount === 0;
        this.parentView.updateAffectedResourceVisibility();
    }
    isEmpty() {
        return this.affectedResourcesCount === 0;
    }
    clear() {
        this.affectedResources.textContent = '';
    }
    expandIfOneResource() {
        if (this.affectedResourcesCount === 1) {
            this.expand();
        }
    }
    /**
     * This function resolves a requestId to network requests. If the requestId does not resolve, a listener is installed
     * that takes care of updating the view if the network request is added. This is useful if the issue is added before
     * the network request gets reported.
     */
    resolveRequestId(requestId) {
        const requests = SDK.NetworkLog.NetworkLog.instance().requestsForId(requestId);
        if (!requests.length) {
            this.unresolvedRequestIds.add(requestId);
            if (!this.networkListener) {
                this.networkListener = SDK.NetworkLog.NetworkLog.instance().addEventListener(SDK.NetworkLog.Events.RequestAdded, this.onRequestAdded, this);
            }
        }
        return requests;
    }
    onRequestAdded(event) {
        const request = event.data;
        const requestWasUnresolved = this.unresolvedRequestIds.delete(request.requestId());
        if (this.unresolvedRequestIds.size === 0 && this.networkListener) {
            // Stop listening once all requests are resolved.
            Common.EventTarget.EventTarget.removeEventListeners([this.networkListener]);
            this.networkListener = null;
        }
        if (requestWasUnresolved) {
            this.update();
        }
    }
    /**
     * This function resolves a frameId to a ResourceTreeFrame. If the frameId does not resolve, or hasn't navigated yet,
     * a listener is installed that takes care of updating the view if the frame is added. This is useful if the issue is
     * added before the frame gets reported.
     */
    resolveFrameId(frameId) {
        const frame = SDK.FrameManager.FrameManager.instance().getFrame(frameId);
        if (!frame || !frame.url) {
            this.unresolvedFrameIds.add(frameId);
            if (!this.frameListeners.length) {
                const addListener = SDK.FrameManager.FrameManager.instance().addEventListener(SDK.FrameManager.Events.FrameAddedToTarget, this.onFrameChanged, this);
                const navigateListener = SDK.FrameManager.FrameManager.instance().addEventListener(SDK.FrameManager.Events.FrameNavigated, this.onFrameChanged, this);
                this.frameListeners = [addListener, navigateListener];
            }
        }
        return frame;
    }
    onFrameChanged(event) {
        const frame = event.data.frame;
        if (!frame.url) {
            return;
        }
        const frameWasUnresolved = this.unresolvedFrameIds.delete(frame.id);
        if (this.unresolvedFrameIds.size === 0 && this.frameListeners.length) {
            // Stop listening once all requests are resolved.
            Common.EventTarget.EventTarget.removeEventListeners(this.frameListeners);
            this.frameListeners = [];
        }
        if (frameWasUnresolved) {
            this.update();
        }
    }
    createFrameCell(frameId, issue) {
        const frame = this.resolveFrameId(frameId);
        const url = frame && (frame.unreachableUrl() || frame.url) || ls `unknown`;
        const frameCell = document.createElement('td');
        frameCell.classList.add('affected-resource-cell');
        if (frame) {
            const icon = new WebComponents.Icon.Icon();
            icon.data = { iconName: 'elements_panel_icon', color: 'var(--issue-link)', width: '16px', height: '16px' };
            icon.classList.add('link', 'elements-panel');
            icon.onclick = async () => {
                Host.userMetrics.issuesPanelResourceOpened(issue.getCategory(), "Element" /* Element */);
                const frame = SDK.FrameManager.FrameManager.instance().getFrame(frameId);
                if (frame) {
                    const ownerNode = await frame.getOwnerDOMNodeOrDocument();
                    if (ownerNode) {
                        Common.Revealer.reveal(ownerNode);
                    }
                }
            };
            UI.Tooltip.Tooltip.install(icon, ls `Click to reveal the frame's DOM node in the Elements panel`);
            frameCell.appendChild(icon);
        }
        frameCell.appendChild(document.createTextNode(url));
        frameCell.onmouseenter = () => {
            const frame = SDK.FrameManager.FrameManager.instance().getFrame(frameId);
            if (frame) {
                frame.highlight();
            }
        };
        frameCell.onmouseleave = () => SDK.OverlayModel.OverlayModel.hideDOMNodeHighlight();
        return frameCell;
    }
    createRequestCell(request) {
        let url = request.url;
        let filename = url ? extractShortPath(url) : '';
        const requestCell = document.createElement('td');
        requestCell.classList.add('affected-resource-cell');
        const icon = new WebComponents.Icon.Icon();
        icon.data = { iconName: 'network_panel_icon', color: 'var(--issue-link)', width: '16px', height: '16px' };
        icon.classList.add('network-panel');
        requestCell.appendChild(icon);
        const requests = this.resolveRequestId(request.requestId);
        if (requests.length) {
            const request = requests[0];
            requestCell.onclick = () => {
                Network.NetworkPanel.NetworkPanel.selectAndShowRequest(request, Network.NetworkItemView.Tabs.Headers);
            };
            requestCell.classList.add('link');
            icon.classList.add('link');
            url = request.url();
            filename = extractShortPath(url);
            UI.Tooltip.Tooltip.install(icon, ls `Click to show request in the network panel`);
        }
        else {
            UI.Tooltip.Tooltip.install(icon, ls `Request unavailable in the network panel, try reloading the inspected page`);
            icon.classList.add('unavailable');
        }
        if (url) {
            UI.Tooltip.Tooltip.install(requestCell, url);
        }
        requestCell.appendChild(document.createTextNode(filename));
        return requestCell;
    }
    // TODO(chromium:1158753): Provide `target` and `scriptId` at call sites once
    // available from the back-end.
    appendSourceLocation(element, sourceLocation, target = null, scriptId = null) {
        const sourceCodeLocation = document.createElement('td');
        sourceCodeLocation.classList.add('affected-source-location');
        if (sourceLocation) {
            const maxLengthForDisplayedURLs = 40; // Same as console messages.
            // TODO(crbug.com/1108503): Add some mechanism to be able to add telemetry to this element.
            const linkifier = new Components.Linkifier.Linkifier(maxLengthForDisplayedURLs);
            const sourceAnchor = linkifier.linkifyScriptLocation(target, scriptId, sourceLocation.url, sourceLocation.lineNumber);
            sourceCodeLocation.appendChild(sourceAnchor);
        }
        element.appendChild(sourceCodeLocation);
    }
    appendColumnTitle(header, title, additionalClass = null) {
        const info = document.createElement('td');
        info.classList.add('affected-resource-header');
        if (additionalClass) {
            info.classList.add(additionalClass);
        }
        info.textContent = title;
        header.appendChild(info);
    }
    update() {
        throw new Error('This should never be called, did you forget to override?');
    }
}
//# sourceMappingURL=AffectedResourcesView.js.map