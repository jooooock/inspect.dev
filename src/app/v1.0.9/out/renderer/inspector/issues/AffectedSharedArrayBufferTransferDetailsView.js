// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { AffectedResourcesView } from './AffectedResourcesView.js';
export class AffectedSharedArrayBufferTransferDetailsView extends AffectedResourcesView {
    constructor(parentView, issue) {
        super(parentView, { singular: ls `directive`, plural: ls `directives` });
        this.issue = issue;
    }
    appendStatus(element, isWarning) {
        const status = document.createElement('td');
        if (isWarning) {
            status.classList.add('affected-resource-report-only-status');
            status.textContent = ls `warning`;
        }
        else {
            status.classList.add('affected-resource-blocked-status');
            status.textContent = ls `blocked`;
        }
        element.appendChild(status);
    }
    appendDetails(sabIssues) {
        const header = document.createElement('tr');
        this.appendColumnTitle(header, ls `Source Location`);
        this.appendColumnTitle(header, ls `Status`);
        this.affectedResources.appendChild(header);
        let count = 0;
        for (const sabIssue of sabIssues) {
            count++;
            this.appendDetail(sabIssue);
        }
        this.updateAffectedResourceCount(count);
    }
    appendDetail(sabIssue) {
        const element = document.createElement('tr');
        element.classList.add('affected-resource-directive');
        const sabIssueDetails = sabIssue.details();
        this.appendSourceLocation(element, sabIssueDetails.sourceCodeLocation);
        this.appendStatus(element, sabIssueDetails.isWarning);
        this.affectedResources.appendChild(element);
    }
    update() {
        this.clear();
        this.appendDetails(this.issue.sharedArrayBufferTransfersIssues());
    }
}
//# sourceMappingURL=AffectedSharedArrayBufferTransferDetailsView.js.map