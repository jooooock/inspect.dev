// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as BrowserSDK from '../browser_sdk/browser_sdk.js';
import * as Common from '../common/common.js'; // eslint-disable-line no-unused-vars
import * as Components from '../components/components.js';
import * as Elements from '../elements/elements.js';
import * as Host from '../host/host.js';
import * as Network from '../network/network.js';
import * as SDK from '../sdk/sdk.js';
import * as WebComponents from '../ui/components/components.js';
import * as UI from '../ui/ui.js';
import { AffectedResourcesView, extractShortPath } from './AffectedResourcesView.js';
import { AffectedSharedArrayBufferTransferDetailsView } from './AffectedSharedArrayBufferTransferDetailsView.js';
import { Events as IssueAggregatorEvents, IssueAggregator } from './IssueAggregator.js'; // eslint-disable-line no-unused-vars
import { IssueSurveyLink } from './IssueSurveyLink.js';
import { createIssueDescriptionFromMarkdown } from './MarkdownIssueDescription.js';
class AffectedElementsView extends AffectedResourcesView {
    /**
     * @param {!IssueView} parent
     * @param {!SDK.Issue.Issue} issue
     */
    constructor(parent, issue) {
        super(parent, { singular: ls `element`, plural: ls `elements` });
        /** @type {!SDK.Issue.Issue} */
        this._issue = issue;
    }
    _sendTelemetry() {
        Host.userMetrics.issuesPanelResourceOpened(this._issue.getCategory(), "Element" /* Element */);
    }
    /**
     * @param {!Iterable<!SDK.Issue.AffectedElement>} affectedElements
     */
    async _appendAffectedElements(affectedElements) {
        let count = 0;
        for (const element of affectedElements) {
            await this._appendAffectedElement(element);
            count++;
        }
        this.updateAffectedResourceCount(count);
    }
    /**
     * @param {!SDK.Issue.AffectedElement} element
     */
    async _appendAffectedElement({ backendNodeId, nodeName }) {
        const mainTarget = /** @type {!SDK.SDKModel.Target} */ (SDK.SDKModel.TargetManager.instance().mainTarget());
        const deferredDOMNode = new SDK.DOMModel.DeferredDOMNode(mainTarget, backendNodeId);
        const anchorElement = await Common.Linkifier.Linkifier.linkify(deferredDOMNode);
        anchorElement.textContent = nodeName;
        anchorElement.addEventListener('click', this._sendTelemetry);
        anchorElement.addEventListener('keydown', /** @param {!Event} event */ /** @param {!Event} event */ event => {
            if (isEnterKey(event)) {
                this._sendTelemetry();
            }
        });
        const cellElement = document.createElement('td');
        cellElement.classList.add('affected-resource-element', 'devtools-link');
        cellElement.appendChild(anchorElement);
        const rowElement = document.createElement('tr');
        rowElement.appendChild(cellElement);
        this.affectedResources.appendChild(rowElement);
    }
    /**
     * @override
     */
    update() {
        this.clear();
        this._appendAffectedElements(this._issue.elements());
    }
}
class AffectedDirectivesView extends AffectedResourcesView {
    /**
     * @param {!IssueView} parent
     * @param {!AggregatedIssue} issue
     */
    constructor(parent, issue) {
        super(parent, { singular: ls `directive`, plural: ls `directives` });
        /** @type {!AggregatedIssue} */
        this._issue = issue;
    }
    /**
     * @param {!Element} element
     * @param {boolean} isReportOnly
     */
    _appendStatus(element, isReportOnly) {
        const status = document.createElement('td');
        if (isReportOnly) {
            status.classList.add('affected-resource-report-only-status');
            status.textContent = ls `report-only`;
        }
        else {
            status.classList.add('affected-resource-blocked-status');
            status.textContent = ls `blocked`;
        }
        element.appendChild(status);
    }
    /**
     * @param {!Element} element
     * @param {string} directive
     */
    _appendViolatedDirective(element, directive) {
        const violatedDirective = document.createElement('td');
        violatedDirective.textContent = directive;
        element.appendChild(violatedDirective);
    }
    /**
     * @param {!Element} element
     * @param {string} url
     */
    _appendBlockedURL(element, url) {
        const info = document.createElement('td');
        info.classList.add('affected-resource-directive-info');
        info.textContent = url;
        element.appendChild(info);
    }
    /**
     * @param {!Element} element
     * @param {number | undefined} nodeId
     * @param {!SDK.IssuesModel.IssuesModel} model
     */
    _appendBlockedElement(element, nodeId, model) {
        const elementsPanelLinkComponent = new Elements.ElementsPanelLink.ElementsPanelLink();
        if (nodeId) {
            const violatingNodeId = nodeId;
            UI.Tooltip.Tooltip.install(elementsPanelLinkComponent, ls `Click to reveal the violating DOM node in the Elements panel`);
            /** @type {function(!Event=):void} */
            const onElementRevealIconClick = () => {
                const target = model.getTargetIfNotDisposed();
                if (target) {
                    Host.userMetrics.issuesPanelResourceOpened(this._issue.getCategory(), "Element" /* Element */);
                    const deferredDOMNode = new SDK.DOMModel.DeferredDOMNode(target, violatingNodeId);
                    Common.Revealer.reveal(deferredDOMNode);
                }
            };
            /** @type {function(!Event=):void} */
            const onElementRevealIconMouseEnter = () => {
                const target = model.getTargetIfNotDisposed();
                if (target) {
                    const deferredDOMNode = new SDK.DOMModel.DeferredDOMNode(target, violatingNodeId);
                    if (deferredDOMNode) {
                        deferredDOMNode.highlight();
                    }
                }
            };
            /** @type {function(!Event=):void} */
            const onElementRevealIconMouseLeave = () => {
                SDK.OverlayModel.OverlayModel.hideDOMNodeHighlight();
            };
            elementsPanelLinkComponent
                .data = { onElementRevealIconClick, onElementRevealIconMouseEnter, onElementRevealIconMouseLeave };
        }
        const violatingNode = document.createElement('td');
        violatingNode.classList.add('affected-resource-csp-info-node');
        violatingNode.appendChild(elementsPanelLinkComponent);
        element.appendChild(violatingNode);
    }
    /**
     * @param {!Iterable<!SDK.ContentSecurityPolicyIssue.ContentSecurityPolicyIssue>} cspIssues
     */
    _appendAffectedContentSecurityPolicyDetails(cspIssues) {
        const header = document.createElement('tr');
        if (this._issue.code() === SDK.ContentSecurityPolicyIssue.inlineViolationCode) {
            this.appendColumnTitle(header, ls `Directive`);
            this.appendColumnTitle(header, ls `Element`);
            this.appendColumnTitle(header, ls `Source Location`);
            this.appendColumnTitle(header, ls `Status`);
        }
        else if (this._issue.code() === SDK.ContentSecurityPolicyIssue.urlViolationCode) {
            this.appendColumnTitle(header, ls `Resource`, 'affected-resource-directive-info-header');
            this.appendColumnTitle(header, ls `Status`);
            this.appendColumnTitle(header, ls `Directive`);
            this.appendColumnTitle(header, ls `Source Location`);
        }
        else if (this._issue.code() === SDK.ContentSecurityPolicyIssue.evalViolationCode) {
            this.appendColumnTitle(header, ls `Source Location`);
            this.appendColumnTitle(header, ls `Directive`);
            this.appendColumnTitle(header, ls `Status`);
        }
        else if (this._issue.code() === SDK.ContentSecurityPolicyIssue.trustedTypesSinkViolationCode) {
            this.appendColumnTitle(header, ls `Source Location`);
            this.appendColumnTitle(header, ls `Status`);
        }
        else if (this._issue.code() === SDK.ContentSecurityPolicyIssue.trustedTypesPolicyViolationCode) {
            this.appendColumnTitle(header, ls `Source Location`);
            this.appendColumnTitle(header, ls `Directive`);
            this.appendColumnTitle(header, ls `Status`);
        }
        else {
            this.updateAffectedResourceCount(0);
            return;
        }
        this.affectedResources.appendChild(header);
        let count = 0;
        for (const cspIssue of cspIssues) {
            count++;
            this._appendAffectedContentSecurityPolicyDetail(cspIssue);
        }
        this.updateAffectedResourceCount(count);
    }
    /**
     * @param {!SDK.ContentSecurityPolicyIssue.ContentSecurityPolicyIssue} cspIssue
     */
    _appendAffectedContentSecurityPolicyDetail(cspIssue) {
        const element = document.createElement('tr');
        element.classList.add('affected-resource-directive');
        const cspIssueDetails = cspIssue.details();
        const model = cspIssue.model();
        if (this._issue.code() === SDK.ContentSecurityPolicyIssue.inlineViolationCode && model) {
            this._appendViolatedDirective(element, cspIssueDetails.violatedDirective);
            this._appendBlockedElement(element, cspIssueDetails.violatingNodeId, model);
            this.appendSourceLocation(element, cspIssueDetails.sourceCodeLocation);
            this._appendStatus(element, cspIssueDetails.isReportOnly);
        }
        else if (this._issue.code() === SDK.ContentSecurityPolicyIssue.urlViolationCode) {
            const url = cspIssueDetails.blockedURL ? cspIssueDetails.blockedURL : '';
            this._appendBlockedURL(element, url);
            this._appendStatus(element, cspIssueDetails.isReportOnly);
            this._appendViolatedDirective(element, cspIssueDetails.violatedDirective);
            this.appendSourceLocation(element, cspIssueDetails.sourceCodeLocation);
        }
        else if (this._issue.code() === SDK.ContentSecurityPolicyIssue.evalViolationCode) {
            this.appendSourceLocation(element, cspIssueDetails.sourceCodeLocation);
            this._appendViolatedDirective(element, cspIssueDetails.violatedDirective);
            this._appendStatus(element, cspIssueDetails.isReportOnly);
        }
        else if (this._issue.code() === SDK.ContentSecurityPolicyIssue.trustedTypesSinkViolationCode) {
            this.appendSourceLocation(element, cspIssueDetails.sourceCodeLocation);
            this._appendStatus(element, cspIssueDetails.isReportOnly);
        }
        else if (this._issue.code() === SDK.ContentSecurityPolicyIssue.trustedTypesPolicyViolationCode) {
            this.appendSourceLocation(element, cspIssueDetails.sourceCodeLocation);
            this._appendViolatedDirective(element, cspIssueDetails.violatedDirective);
            this._appendStatus(element, cspIssueDetails.isReportOnly);
        }
        else {
            return;
        }
        this.affectedResources.appendChild(element);
    }
    /**
     * @override
     */
    update() {
        this.clear();
        this._appendAffectedContentSecurityPolicyDetails(this._issue.cspIssues());
    }
}
class AffectedCookiesView extends AffectedResourcesView {
    /**
     * @param {!IssueView} parent
     * @param {!AggregatedIssue} issue
     */
    constructor(parent, issue) {
        super(parent, { singular: ls `cookie`, plural: ls `cookies` });
        /** @type {!AggregatedIssue} */
        this._issue = issue;
    }
    /**
     * @param {!Iterable<!{cookie: !Protocol.Audits.AffectedCookie, hasRequest: boolean}>} cookies
     */
    _appendAffectedCookies(cookies) {
        const header = document.createElement('tr');
        const name = document.createElement('td');
        name.classList.add('affected-resource-header');
        name.textContent = 'Name';
        header.appendChild(name);
        const info = document.createElement('td');
        info.classList.add('affected-resource-header');
        info.classList.add('affected-resource-cookie-info-header');
        info.textContent = ls `Domain` +
            ' & ' + ls `Path`;
        header.appendChild(info);
        this.affectedResources.appendChild(header);
        let count = 0;
        for (const cookie of cookies) {
            count++;
            this.appendAffectedCookie(cookie.cookie, cookie.hasRequest);
        }
        this.updateAffectedResourceCount(count);
    }
    /**
     * @param {!Protocol.Audits.AffectedCookie} cookie
     * @param {boolean} hasAssociatedRequest
     */
    appendAffectedCookie(cookie, hasAssociatedRequest) {
        const element = document.createElement('tr');
        element.classList.add('affected-resource-cookie');
        const name = document.createElement('td');
        if (hasAssociatedRequest) {
            name.appendChild(UI.UIUtils.createTextButton(cookie.name, () => {
                Host.userMetrics.issuesPanelResourceOpened(this._issue.getCategory(), "Cookie" /* Cookie */);
                Network.NetworkPanel.NetworkPanel.revealAndFilter([
                    {
                        filterType: 'cookie-domain',
                        filterValue: cookie.domain,
                    },
                    {
                        filterType: 'cookie-name',
                        filterValue: cookie.name,
                    },
                    {
                        filterType: 'cookie-path',
                        filterValue: cookie.path,
                    }
                ]);
            }, 'link-style devtools-link'));
        }
        else {
            name.textContent = cookie.name;
        }
        const info = document.createElement('td');
        info.classList.add('affected-resource-cookie-info');
        info.textContent = `${cookie.domain}${cookie.path}`;
        element.appendChild(name);
        element.appendChild(info);
        this.affectedResources.appendChild(element);
    }
    /**
     * @override
     */
    update() {
        this.clear();
        this._appendAffectedCookies(this._issue.cookiesWithRequestIndicator());
    }
}
class AffectedRequestsView extends AffectedResourcesView {
    /**
     * @param {!IssueView} parent
     * @param {!SDK.Issue.Issue} issue
     */
    constructor(parent, issue) {
        super(parent, { singular: ls `request`, plural: ls `requests` });
        /** @type {!SDK.Issue.Issue} */
        this._issue = issue;
    }
    /**
     * @param {!Iterable<!Protocol.Audits.AffectedRequest>} affectedRequests
     */
    _appendAffectedRequests(affectedRequests) {
        let count = 0;
        for (const affectedRequest of affectedRequests) {
            for (const request of this.resolveRequestId(affectedRequest.requestId)) {
                count++;
                this._appendNetworkRequest(request);
            }
        }
        this.updateAffectedResourceCount(count);
    }
    /**
     *
     * @param {!SDK.NetworkRequest.NetworkRequest} request
     */
    _appendNetworkRequest(request) {
        const nameText = request.name().trimMiddle(100);
        const nameElement = document.createElement('td');
        const tab = issueTypeToNetworkHeaderMap.get(this._issue.getCategory()) || Network.NetworkItemView.Tabs.Headers;
        nameElement.appendChild(UI.UIUtils.createTextButton(nameText, () => {
            Host.userMetrics.issuesPanelResourceOpened(this._issue.getCategory(), "Request" /* Request */);
            Network.NetworkPanel.NetworkPanel.selectAndShowRequest(request, tab);
        }, 'link-style devtools-link'));
        const element = document.createElement('tr');
        element.classList.add('affected-resource-request');
        element.appendChild(nameElement);
        this.affectedResources.appendChild(element);
    }
    /**
     * @override
     */
    update() {
        this.clear();
        // eslint-disable-next-line no-unused-vars
        for (const _ of this._issue.blockedByResponseDetails()) {
            // If the issue has blockedByResponseDetails, the corresponding AffectedBlockedByResponseView
            // will take care of displaying the request.
            this.updateAffectedResourceCount(0);
            return;
        }
        this._appendAffectedRequests(this._issue.requests());
    }
}
class AffectedSourcesView extends AffectedResourcesView {
    /**
     * @param {!IssueView} parent
     * @param {!SDK.Issue.Issue} issue
     */
    constructor(parent, issue) {
        super(parent, { singular: ls `source`, plural: ls `sources` });
        /** @type {!SDK.Issue.Issue} */
        this._issue = issue;
    }
    /**
     * @param {!Iterable<!SDK.Issue.AffectedSource>} affectedSources
     */
    _appendAffectedSources(affectedSources) {
        let count = 0;
        for (const source of affectedSources) {
            this._appendAffectedSource(source);
            count++;
        }
        this.updateAffectedResourceCount(count);
    }
    /**
     * @param {!SDK.Issue.AffectedSource} source
     */
    _appendAffectedSource({ url, lineNumber, columnNumber }) {
        const cellElement = document.createElement('td');
        // TODO(chromium:1072331): Check feasibility of plumping through scriptId for `linkifyScriptLocation`
        //                         to support source maps and formatted scripts.
        const linkifierURLOptions = 
        /** @type {!Components.Linkifier.LinkifyURLOptions} */ ({ columnNumber, lineNumber, tabStop: true });
        // An element created with linkifyURL can subscribe to the events
        // 'click' neither 'keydown' if that key is the 'Enter' key.
        // Also, this element has a context menu, so we should be able to
        // track when the user use the context menu too.
        // TODO(crbug.com/1108503): Add some mechanism to be able to add telemetry to this element.
        const anchorElement = Components.Linkifier.Linkifier.linkifyURL(url, linkifierURLOptions);
        cellElement.appendChild(anchorElement);
        const rowElement = document.createElement('tr');
        rowElement.classList.add('affected-resource-source');
        rowElement.appendChild(cellElement);
        this.affectedResources.appendChild(rowElement);
    }
    /**
     * @override
     */
    update() {
        this.clear();
        this._appendAffectedSources(this._issue.sources());
    }
}
/** @type {!Map<!SDK.Issue.IssueCategory, !Network.NetworkItemView.Tabs>} */
const issueTypeToNetworkHeaderMap = new Map([
    [SDK.Issue.IssueCategory.SameSiteCookie, Network.NetworkItemView.Tabs.Cookies],
    [SDK.Issue.IssueCategory.CrossOriginEmbedderPolicy, Network.NetworkItemView.Tabs.Headers],
    [SDK.Issue.IssueCategory.MixedContent, Network.NetworkItemView.Tabs.Headers]
]);
class AffectedMixedContentView extends AffectedResourcesView {
    /**
     * @param {!IssueView} parent
     * @param {!SDK.Issue.Issue} issue
     */
    constructor(parent, issue) {
        super(parent, { singular: ls `resource`, plural: ls `resources` });
        /** @type {!SDK.Issue.Issue} */
        this._issue = issue;
    }
    /**
     * @param {!Iterable<!Protocol.Audits.MixedContentIssueDetails>} mixedContents
     */
    _appendAffectedMixedContents(mixedContents) {
        const header = document.createElement('tr');
        const name = document.createElement('td');
        name.classList.add('affected-resource-header');
        name.textContent = ls `Name`;
        header.appendChild(name);
        const info = document.createElement('td');
        info.classList.add('affected-resource-header');
        info.textContent = ls `Restriction Status`;
        header.appendChild(info);
        this.affectedResources.appendChild(header);
        let count = 0;
        for (const mixedContent of mixedContents) {
            if (mixedContent.request) {
                this.resolveRequestId(mixedContent.request.requestId).forEach(networkRequest => {
                    this.appendAffectedMixedContent(mixedContent, networkRequest);
                    count++;
                });
            }
            else {
                this.appendAffectedMixedContent(mixedContent);
                count++;
            }
        }
        this.updateAffectedResourceCount(count);
    }
    /**
     * @param {!Protocol.Audits.MixedContentIssueDetails} mixedContent
     * @param {?SDK.NetworkRequest.NetworkRequest} maybeRequest
     */
    appendAffectedMixedContent(mixedContent, maybeRequest = null) {
        const element = document.createElement('tr');
        element.classList.add('affected-resource-mixed-content');
        const filename = extractShortPath(mixedContent.insecureURL);
        const name = document.createElement('td');
        if (maybeRequest) {
            const request = maybeRequest; // re-assignment to make type checker happy
            const tab = issueTypeToNetworkHeaderMap.get(this._issue.getCategory()) || Network.NetworkItemView.Tabs.Headers;
            name.appendChild(UI.UIUtils.createTextButton(filename, () => {
                Host.userMetrics.issuesPanelResourceOpened(this._issue.getCategory(), "Request" /* Request */);
                Network.NetworkPanel.NetworkPanel.selectAndShowRequest(request, tab);
            }, 'link-style devtools-link'));
        }
        else {
            name.classList.add('affected-resource-mixed-content-info');
            name.textContent = filename;
        }
        UI.Tooltip.Tooltip.install(name, mixedContent.insecureURL);
        element.appendChild(name);
        const status = document.createElement('td');
        status.classList.add('affected-resource-mixed-content-info');
        status.textContent = SDK.MixedContentIssue.MixedContentIssue.translateStatus(mixedContent.resolutionStatus);
        element.appendChild(status);
        this.affectedResources.appendChild(element);
    }
    /**
     * @override
     */
    update() {
        this.clear();
        this._appendAffectedMixedContents(this._issue.mixedContents());
    }
}
class AffectedHeavyAdView extends AffectedResourcesView {
    /**
     * @param {!IssueView} parent
     * @param {!SDK.Issue.Issue} issue
     */
    constructor(parent, issue) {
        super(parent, { singular: ls `resource`, plural: ls `resources` });
        /** @type {!SDK.Issue.Issue} */
        this._issue = issue;
    }
    /**
     * @param {!Iterable<!Protocol.Audits.HeavyAdIssueDetails>} heavyAds
     */
    _appendAffectedHeavyAds(heavyAds) {
        const header = document.createElement('tr');
        const reason = document.createElement('td');
        reason.classList.add('affected-resource-header');
        reason.textContent = ls `Limit exceeded`;
        header.appendChild(reason);
        const resolution = document.createElement('td');
        resolution.classList.add('affected-resource-header');
        resolution.textContent = ls `Resolution Status`;
        header.appendChild(resolution);
        const frame = document.createElement('td');
        frame.classList.add('affected-resource-header');
        frame.textContent = ls `Frame URL`;
        header.appendChild(frame);
        this.affectedResources.appendChild(header);
        let count = 0;
        for (const heavyAd of heavyAds) {
            this._appendAffectedHeavyAd(heavyAd);
            count++;
        }
        this.updateAffectedResourceCount(count);
    }
    /**
     * @param {!Protocol.Audits.HeavyAdResolutionStatus} status
     * @return {string}
     */
    _statusToString(status) {
        switch (status) {
            case Protocol.Audits.HeavyAdResolutionStatus.HeavyAdBlocked:
                return ls `Removed`;
            case Protocol.Audits.HeavyAdResolutionStatus.HeavyAdWarning:
                return ls `Warned`;
        }
        return '';
    }
    /**
     * @param {!Protocol.Audits.HeavyAdReason} status
     * @return {string}
     */
    _limitToString(status) {
        switch (status) {
            case Protocol.Audits.HeavyAdReason.CpuPeakLimit:
                return ls `CPU peak limit`;
            case Protocol.Audits.HeavyAdReason.CpuTotalLimit:
                return ls `CPU total limit`;
            case Protocol.Audits.HeavyAdReason.NetworkTotalLimit:
                return ls `Network limit`;
        }
        return '';
    }
    /**
     * @param {!Protocol.Audits.HeavyAdIssueDetails} heavyAd
     */
    _appendAffectedHeavyAd(heavyAd) {
        const element = document.createElement('tr');
        element.classList.add('affected-resource-heavy-ad');
        const reason = document.createElement('td');
        reason.classList.add('affected-resource-heavy-ad-info');
        reason.textContent = this._limitToString(heavyAd.reason);
        element.appendChild(reason);
        const status = document.createElement('td');
        status.classList.add('affected-resource-heavy-ad-info');
        status.textContent = this._statusToString(heavyAd.resolution);
        element.appendChild(status);
        const frameId = heavyAd.frame.frameId;
        const frameUrl = this.createFrameCell(frameId, this._issue);
        element.appendChild(frameUrl);
        this.affectedResources.appendChild(element);
    }
    /**
     * @override
     */
    update() {
        this.clear();
        this._appendAffectedHeavyAds(this._issue.heavyAds());
    }
}
class AffectedBlockedByResponseView extends AffectedResourcesView {
    /**
     * @param {!IssueView} parent
     * @param {!SDK.Issue.Issue} issue
     */
    constructor(parent, issue) {
        super(parent, { singular: ls `request`, plural: ls `requests` });
        /** @type {!SDK.Issue.Issue} */
        this._issue = issue;
    }
    /**
     * @param {!Iterable<!Protocol.Audits.BlockedByResponseIssueDetails>} details
     */
    _appendDetails(details) {
        const header = document.createElement('tr');
        const request = document.createElement('td');
        request.classList.add('affected-resource-header');
        request.textContent = ls `Request`;
        header.appendChild(request);
        const name = document.createElement('td');
        name.classList.add('affected-resource-header');
        name.textContent = ls `Parent Frame`;
        header.appendChild(name);
        const frame = document.createElement('td');
        frame.classList.add('affected-resource-header');
        frame.textContent = ls `Blocked Resource`;
        header.appendChild(frame);
        this.affectedResources.appendChild(header);
        let count = 0;
        for (const detail of details) {
            this._appendDetail(detail);
            count++;
        }
        this.updateAffectedResourceCount(count);
    }
    /**
     * @param {!Protocol.Audits.BlockedByResponseIssueDetails} details
     */
    _appendDetail(details) {
        const element = document.createElement('tr');
        element.classList.add('affected-resource-row');
        const requestCell = this.createRequestCell(details.request);
        element.appendChild(requestCell);
        if (details.parentFrame) {
            const frameUrl = this.createFrameCell(details.parentFrame.frameId, this._issue);
            element.appendChild(frameUrl);
        }
        else {
            element.appendChild(document.createElement('td'));
        }
        if (details.blockedFrame) {
            const frameUrl = this.createFrameCell(details.blockedFrame.frameId, this._issue);
            element.appendChild(frameUrl);
        }
        else {
            element.appendChild(document.createElement('td'));
        }
        this.affectedResources.appendChild(element);
    }
    /**
     * @override
     */
    update() {
        this.clear();
        this._appendDetails(this._issue.blockedByResponseDetails());
    }
}
/** @type {!Map<!SDK.Issue.IssueCategory, string>} */
export const IssueCategoryNames = new Map([
    [SDK.Issue.IssueCategory.CrossOriginEmbedderPolicy, ls `Cross Origin Embedder Policy`],
    [SDK.Issue.IssueCategory.MixedContent, ls `Mixed Content`],
    [SDK.Issue.IssueCategory.SameSiteCookie, ls `SameSite Cookie`], [SDK.Issue.IssueCategory.HeavyAd, ls `Heavy Ads`],
    [SDK.Issue.IssueCategory.ContentSecurityPolicy, ls `Content Security Policy`],
    [SDK.Issue.IssueCategory.Other, ls `Other`]
]);
class IssueCategoryView extends UI.TreeOutline.TreeElement {
    /**
     * @param {!SDK.Issue.IssueCategory} category
     */
    constructor(category) {
        super();
        this._category = category;
        /** @type {!Array<!AggregatedIssue>} */
        this._issues = [];
        this.toggleOnClick = true;
        this.listItemElement.classList.add('issue-category');
    }
    getCategoryName() {
        return IssueCategoryNames.get(this._category) || ls `Other`;
    }
    /**
     * @override
     */
    onattach() {
        this._appendHeader();
    }
    _appendHeader() {
        const header = document.createElement('div');
        header.classList.add('header');
        const title = document.createElement('div');
        title.classList.add('title');
        title.textContent = this.getCategoryName();
        header.appendChild(title);
        this.listItemElement.appendChild(header);
    }
}
// These come from chrome/browser/ui/hats/hats_service.cc.
/** @type {!Map<!SDK.Issue.IssueCategory, string|null>} */
const issueSurveyTriggers = new Map([
    [SDK.Issue.IssueCategory.CrossOriginEmbedderPolicy, 'devtools-issues-coep'],
    [SDK.Issue.IssueCategory.MixedContent, 'devtools-issues-mixed-content'],
    [SDK.Issue.IssueCategory.SameSiteCookie, 'devtools-issues-cookies-samesite'],
    [SDK.Issue.IssueCategory.HeavyAd, 'devtools-issues-heavy-ad'],
    [SDK.Issue.IssueCategory.ContentSecurityPolicy, 'devtools-issues-csp'], [SDK.Issue.IssueCategory.Other, null]
]);
export class IssueView extends UI.TreeOutline.TreeElement {
    /**
     *
     * @param {!IssuesPaneImpl} parent
     * @param {!AggregatedIssue} issue
     * @param {!SDK.Issue.IssueDescription} description
     */
    constructor(parent, issue, description) {
        super();
        this._parent = parent;
        this._issue = issue;
        /** @type {!SDK.Issue.IssueDescription} */
        this._description = description;
        this.toggleOnClick = true;
        this.listItemElement.classList.add('issue');
        this.childrenListElement.classList.add('body');
        this.affectedResources = this._createAffectedResources();
        /** @type {!Array<!AffectedResourcesView>} */
        this._affectedResourceViews = [
            new AffectedCookiesView(this, this._issue), new AffectedElementsView(this, this._issue),
            new AffectedRequestsView(this, this._issue), new AffectedMixedContentView(this, this._issue),
            new AffectedSourcesView(this, this._issue), new AffectedHeavyAdView(this, this._issue),
            new AffectedDirectivesView(this, this._issue), new AffectedBlockedByResponseView(this, this._issue),
            new AffectedSharedArrayBufferTransferDetailsView(this, this._issue)
        ];
        this._aggregatedIssuesCount = null;
        this._hasBeenExpandedBefore = false;
    }
    /**
     * @returns {string}
     */
    getIssueTitle() {
        return this._description.title;
    }
    /**
     * @override
     */
    onattach() {
        this._appendHeader();
        this._createBody();
        this.appendChild(this.affectedResources);
        for (const view of this._affectedResourceViews) {
            this.appendAffectedResource(view);
            view.update();
        }
        this._createReadMoreLinks();
        this.updateAffectedResourceVisibility();
    }
    /**
     * @param {!UI.TreeOutline.TreeElement} resource
     */
    appendAffectedResource(resource) {
        this.affectedResources.appendChild(resource);
    }
    _appendHeader() {
        const header = document.createElement('div');
        header.classList.add('header');
        const icon = new WebComponents.Icon.Icon();
        icon.data = { iconName: 'breaking_change_icon', color: '', width: '16px', height: '16px' };
        icon.classList.add('breaking-change');
        this._aggregatedIssuesCount = /** @type {!HTMLElement} */ (document.createElement('span'));
        const countAdorner = Elements.Adorner.Adorner.create(this._aggregatedIssuesCount, 'countWrapper');
        countAdorner.classList.add('aggregated-issues-count');
        this._aggregatedIssuesCount.textContent = `${this._issue.getAggregatedIssuesCount()}`;
        header.appendChild(icon);
        header.appendChild(countAdorner);
        const title = document.createElement('div');
        title.classList.add('title');
        title.textContent = this._description.title;
        header.appendChild(title);
        this.listItemElement.appendChild(header);
    }
    /**
     * @override
     */
    onexpand() {
        const issueCategory = this._issue.getCategory().description;
        Host.userMetrics.issuesPanelIssueExpanded(issueCategory);
        if (!this._hasBeenExpandedBefore) {
            this._hasBeenExpandedBefore = true;
            for (const view of this._affectedResourceViews) {
                view.expandIfOneResource();
            }
        }
    }
    _updateAggregatedIssuesCount() {
        if (this._aggregatedIssuesCount) {
            this._aggregatedIssuesCount.textContent = `${this._issue.getAggregatedIssuesCount()}`;
        }
    }
    updateAffectedResourceVisibility() {
        const noResources = this._affectedResourceViews.every(view => view.isEmpty());
        this.affectedResources.hidden = noResources;
    }
    /**
     *
     * @returns {!UI.TreeOutline.TreeElement}
     */
    _createAffectedResources() {
        const wrapper = new UI.TreeOutline.TreeElement();
        wrapper.setCollapsible(false);
        wrapper.setExpandable(true);
        wrapper.expand();
        wrapper.selectable = false;
        wrapper.listItemElement.classList.add('affected-resources-label');
        wrapper.listItemElement.textContent = ls `Affected Resources`;
        wrapper.childrenListElement.classList.add('affected-resources');
        return wrapper;
    }
    _createBody() {
        const messageElement = new UI.TreeOutline.TreeElement();
        messageElement.setCollapsible(false);
        messageElement.selectable = false;
        const message = this._description.message();
        messageElement.listItemElement.appendChild(message);
        this.appendChild(messageElement);
    }
    _createReadMoreLinks() {
        const linkWrapper = new UI.TreeOutline.TreeElement();
        linkWrapper.setCollapsible(false);
        linkWrapper.listItemElement.classList.add('link-wrapper');
        const linkList = linkWrapper.listItemElement.createChild('ul', 'link-list');
        for (const description of this._description.links) {
            const link = UI.Fragment.html `<a class="link devtools-link" role="link" tabindex="0" href=${description.link}>${ls `Learn more: ${description.linkTitle}`}</a>`;
            const linkIcon = new WebComponents.Icon.Icon();
            linkIcon.data = { iconName: 'link_icon', color: 'var(--issue-link)', width: '16px', height: '16px' };
            linkIcon.classList.add('link-icon');
            link.prepend(linkIcon);
            self.onInvokeElement(link, event => {
                Host.userMetrics.issuesPanelResourceOpened(this._issue.getCategory(), "LearnMore" /* LearnMore */);
                const mainTarget = SDK.SDKModel.TargetManager.instance().mainTarget();
                if (mainTarget) {
                    mainTarget.targetAgent().invoke_createTarget({ url: description.link });
                }
                event.consume(true);
            });
            const linkListItem = linkList.createChild('li');
            linkListItem.appendChild(link);
        }
        this.appendChild(linkWrapper);
        const surveyTrigger = issueSurveyTriggers.get(this._issue.getCategory());
        if (surveyTrigger) {
            // This part of the UI is async so be careful relying on it being available.
            const surveyLink = new IssueSurveyLink();
            surveyLink.data = {
                trigger: surveyTrigger,
                canShowSurvey: Host.InspectorFrontendHost.InspectorFrontendHostInstance.canShowSurvey,
                showSurvey: Host.InspectorFrontendHost.InspectorFrontendHostInstance.showSurvey
            };
            linkList.createChild('li').appendChild(surveyLink);
        }
    }
    update() {
        this._affectedResourceViews.forEach(view => view.update());
        this.updateAffectedResourceVisibility();
        this._updateAggregatedIssuesCount();
    }
    /**
     * @param {(boolean|undefined)=} expand - Expands the issue if `true`, collapses if `false`, toggles collapse if undefined
     */
    toggle(expand) {
        if (expand || (expand === undefined && !this.expanded)) {
            this.expand();
        }
        else {
            this.collapse();
        }
    }
}
/** @return {!Common.Settings.Setting<boolean>} */
export function getGroupIssuesByCategorySetting() {
    return Common.Settings.Settings.instance().createSetting('groupIssuesByCategory', false);
}
export class IssuesPaneImpl extends UI.Widget.VBox {
    constructor() {
        super(true);
        this.registerRequiredCSS('issues/issuesPane.css', { enableLegacyPatching: false });
        this.contentElement.classList.add('issues-pane');
        this._categoryViews = new Map();
        this._issueViews = new Map();
        this._showThirdPartyCheckbox = null;
        const { toolbarContainer, updateToolbarIssuesCount } = this._createToolbars();
        this._issuesToolbarContainer = toolbarContainer;
        this._updateToolbarIssuesCount = updateToolbarIssuesCount;
        this._issuesTree = new UI.TreeOutline.TreeOutlineInShadow();
        this._issuesTree.registerRequiredCSS('issues/issuesTree.css', { enableLegacyPatching: true });
        this._issuesTree.setShowSelectionOnKeyboardFocus(true);
        this._issuesTree.contentElement.classList.add('issues');
        this.contentElement.appendChild(this._issuesTree.element);
        this._noIssuesMessageDiv = document.createElement('div');
        this._noIssuesMessageDiv.classList.add('issues-pane-no-issues');
        this.contentElement.appendChild(this._noIssuesMessageDiv);
        /** @type {!BrowserSDK.IssuesManager.IssuesManager} */
        this._issuesManager = BrowserSDK.IssuesManager.IssuesManager.instance();
        /** @type {!IssueAggregator} */
        this._aggregator = new IssueAggregator(this._issuesManager);
        this._aggregator.addEventListener(IssueAggregatorEvents.AggregatedIssueUpdated, this._issueUpdated, this);
        this._aggregator.addEventListener(IssueAggregatorEvents.FullUpdateRequired, this._fullUpdate, this);
        for (const issue of this._aggregator.aggregatedIssues()) {
            this._updateIssueView(issue);
        }
        this._issuesManager.addEventListener(BrowserSDK.IssuesManager.Events.IssuesCountUpdated, this._updateCounts, this);
        this._updateCounts();
    }
    /**
     * @override
     * @return {!Array<!Element>}
     */
    elementsToRestoreScrollPositionsFor() {
        return [this._issuesTree.element];
    }
    /**
     * @returns {!{toolbarContainer: !Element, updateToolbarIssuesCount: function(number):void}}
     */
    _createToolbars() {
        const toolbarContainer = this.contentElement.createChild('div', 'issues-toolbar-container');
        new UI.Toolbar.Toolbar('issues-toolbar-left', toolbarContainer);
        const rightToolbar = new UI.Toolbar.Toolbar('issues-toolbar-right', toolbarContainer);
        const groupByCategorySetting = getGroupIssuesByCategorySetting();
        const groupByCategoryCheckbox = new UI.Toolbar.ToolbarSettingCheckbox(groupByCategorySetting, ls `Group displayed issues under associated categories`, ls `Group by category`);
        // Hide the option to toggle category grouping for now.
        groupByCategoryCheckbox.setVisible(false);
        rightToolbar.appendToolbarItem(groupByCategoryCheckbox);
        groupByCategorySetting.addChangeListener(() => {
            this._fullUpdate();
        });
        const thirdPartySetting = SDK.Issue.getShowThirdPartyIssuesSetting();
        this._showThirdPartyCheckbox = new UI.Toolbar.ToolbarSettingCheckbox(thirdPartySetting, ls `Include cookie Issues caused by third-party sites`, ls `Include third-party cookie issues`);
        rightToolbar.appendToolbarItem(this._showThirdPartyCheckbox);
        this.setDefaultFocusedElement(this._showThirdPartyCheckbox.inputElement);
        rightToolbar.appendSeparator();
        const toolbarWarnings = document.createElement('div');
        toolbarWarnings.classList.add('toolbar-warnings');
        const breakingChangeIcon = new WebComponents.Icon.Icon();
        breakingChangeIcon.data = { iconName: 'breaking_change_icon', color: '', width: '16px', height: '16px' };
        breakingChangeIcon.classList.add('breaking-change');
        toolbarWarnings.appendChild(breakingChangeIcon);
        const toolbarIssuesCount = toolbarWarnings.createChild('span', 'warnings-count-label');
        const toolbarIssuesItem = new UI.Toolbar.ToolbarItem(toolbarWarnings);
        rightToolbar.appendToolbarItem(toolbarIssuesItem);
        /** @param {number} count */
        const updateToolbarIssuesCount = count => {
            toolbarIssuesCount.textContent = `${count}`;
            if (count === 1) {
                toolbarIssuesItem.setTitle(ls `Issues pertaining to ${count} operation detected.`);
            }
            else {
                toolbarIssuesItem.setTitle(ls `Issues pertaining to ${count} operations detected.`);
            }
        };
        return { toolbarContainer, updateToolbarIssuesCount };
    }
    /**
     * @param {!Common.EventTarget.EventTargetEvent} event
     */
    _issueUpdated(event) {
        const issue = /** @type {!AggregatedIssue} */ (event.data);
        this._updateIssueView(issue);
    }
    /**
     * @param {!AggregatedIssue} issue
     */
    _updateIssueView(issue) {
        if (!this._issueViews.has(issue.code())) {
            let description = issue.getDescription();
            if (!description) {
                console.warn('Could not find description for issue code:', issue.code());
                return;
            }
            if ('file' in description) {
                description = createIssueDescriptionFromMarkdown(description);
            }
            const view = new IssueView(this, issue, description);
            this._issueViews.set(issue.code(), view);
            const parent = this._getIssueViewParent(issue);
            parent.appendChild(view, (a, b) => {
                if (a instanceof IssueView && b instanceof IssueView) {
                    return a.getIssueTitle().localeCompare(b.getIssueTitle());
                }
                console.error('The issues tree should only contain IssueView objects as direct children');
                return 0;
            });
        }
        this._issueViews.get(issue.code()).update();
        this._updateCounts();
    }
    /**
     * @param {!AggregatedIssue} issue
     * @returns {!UI.TreeOutline.TreeOutline | !UI.TreeOutline.TreeElement}
     */
    _getIssueViewParent(issue) {
        if (!getGroupIssuesByCategorySetting().get()) {
            return this._issuesTree;
        }
        const category = issue.getCategory();
        const view = this._categoryViews.get(category);
        if (view) {
            return view;
        }
        const newView = new IssueCategoryView(category);
        this._issuesTree.appendChild(newView, (a, b) => {
            if (a instanceof IssueCategoryView && b instanceof IssueCategoryView) {
                return a.getCategoryName().localeCompare(b.getCategoryName());
            }
            return 0;
        });
        this._categoryViews.set(category, newView);
        return newView;
    }
    /**
     * @param {!Map<*, !UI.TreeOutline.TreeElement>} views
     */
    _clearViews(views) {
        for (const view of views.values()) {
            view.parent && view.parent.removeChild(view);
        }
        views.clear();
    }
    _fullUpdate() {
        this._clearViews(this._categoryViews);
        this._clearViews(this._issueViews);
        if (this._aggregator) {
            for (const issue of this._aggregator.aggregatedIssues()) {
                this._updateIssueView(issue);
            }
        }
        this._updateCounts();
    }
    _updateCounts() {
        const count = this._issuesManager.numberOfIssues();
        this._updateToolbarIssuesCount(count);
        this._showIssuesTreeOrNoIssuesDetectedMessage(count);
    }
    /**
     * @param {number} issuesCount
     */
    _showIssuesTreeOrNoIssuesDetectedMessage(issuesCount) {
        if (issuesCount > 0) {
            this._issuesTree.element.hidden = false;
            this._noIssuesMessageDiv.style.display = 'none';
            const firstChild = this._issuesTree.firstChild();
            if (firstChild) {
                firstChild.select(/** omitFocus= */ true);
                this.setDefaultFocusedElement(firstChild.listItemElement);
            }
        }
        else {
            this._issuesTree.element.hidden = true;
            if (this._showThirdPartyCheckbox) {
                this.setDefaultFocusedElement(this._showThirdPartyCheckbox.inputElement);
            }
            // We alreay know that issesCount is zero here.
            const hasOnlyThirdPartyIssues = this._issuesManager.numberOfAllStoredIssues() > 0;
            this._noIssuesMessageDiv.textContent =
                hasOnlyThirdPartyIssues ? ls `Only third-party cookie issues detected so far` : ls `No issues detected so far`;
            this._noIssuesMessageDiv.style.display = 'flex';
        }
    }
    /**
     * @param {string} code
     */
    revealByCode(code) {
        const issueView = this._issueViews.get(code);
        if (issueView) {
            issueView.expand();
            issueView.reveal();
        }
    }
}
//# sourceMappingURL=IssuesPane.js.map