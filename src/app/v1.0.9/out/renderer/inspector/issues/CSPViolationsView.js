// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as BrowserSDK from '../browser_sdk/browser_sdk.js';
import * as SDK from '../sdk/sdk.js';
import * as UI from '../ui/ui.js';
import { ComboBoxOfCheckBoxes } from './ComboBoxOfCheckBoxes.js';
import { CSPViolationsListView } from './CSPViolationsListView.js';
export class CSPViolationsView extends UI.Widget.VBox {
    constructor() {
        super(true);
        this.listView = new CSPViolationsListView();
        this.issuesManager = BrowserSDK.IssuesManager.IssuesManager.instance();
        this.registerRequiredCSS('issues/cspViolationsView.css', { enableLegacyPatching: false });
        this.contentElement.classList.add('csp-violations-pane');
        const topToolbar = new UI.Toolbar.Toolbar('csp-violations-toolbar', this.contentElement);
        const textFilterUI = new UI.Toolbar.ToolbarInput(ls `Filter`, '', 1, .2, '');
        textFilterUI.addEventListener(UI.Toolbar.ToolbarInput.Event.TextChanged, () => {
            this.listView.updateTextFilter(textFilterUI.value());
        });
        topToolbar.appendToolbarItem(textFilterUI);
        const levelMenuButton = new ComboBoxOfCheckBoxes('Categories');
        levelMenuButton.setText('Categories');
        levelMenuButton.addOption('Trusted Type Policy', SDK.ContentSecurityPolicyIssue.trustedTypesPolicyViolationCode, true);
        levelMenuButton.addOption('Trusted Type Sink', SDK.ContentSecurityPolicyIssue.trustedTypesSinkViolationCode, true);
        levelMenuButton.addOption('CSP Inline', SDK.ContentSecurityPolicyIssue.inlineViolationCode, true);
        levelMenuButton.addOption('CSP Eval', SDK.ContentSecurityPolicyIssue.evalViolationCode, true);
        levelMenuButton.addOption('CSP URL', SDK.ContentSecurityPolicyIssue.urlViolationCode, true);
        levelMenuButton.addHeader('Reset', () => {
            levelMenuButton.getOptions().forEach((x, i) => levelMenuButton.setOptionEnabled(i, x.default));
        });
        levelMenuButton.setOnOptionClicked(() => {
            const categories = new Set(levelMenuButton.getOptions().filter(x => x.enabled).map(x => x.value));
            this.listView.updateCategoryFilter(categories);
        });
        topToolbar.appendToolbarItem(levelMenuButton);
        this.listView.show(this.contentElement);
        this.issuesManager.addEventListener(BrowserSDK.IssuesManager.Events.IssueAdded, this.onIssueAdded, this);
        this.issuesManager.addEventListener(BrowserSDK.IssuesManager.Events.FullUpdateRequired, this.onFullUpdateRequired, this);
        this.addAllIssues();
    }
    onIssueAdded(event) {
        const { issue } = 
        /** @type {!{issuesModel: !SDK.IssuesModel.IssuesModel, issue: !SDK.Issue.Issue}} */ (event.data);
        if (issue instanceof SDK.ContentSecurityPolicyIssue.ContentSecurityPolicyIssue) {
            this.listView.addIssue(issue);
        }
    }
    onFullUpdateRequired() {
        this.listView.clearIssues();
        this.addAllIssues();
    }
    addAllIssues() {
        for (const issue of this.issuesManager.issues()) {
            if (issue instanceof SDK.ContentSecurityPolicyIssue.ContentSecurityPolicyIssue) {
                this.listView.addIssue(issue);
            }
        }
    }
}
//# sourceMappingURL=CSPViolationsView.js.map