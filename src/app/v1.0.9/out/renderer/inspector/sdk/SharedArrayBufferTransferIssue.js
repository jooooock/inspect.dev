// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { ls } from '../common/common.js'; // eslint-disable-line rulesdir/es_modules_import
import { Issue, IssueCategory, IssueKind } from './Issue.js'; // eslint-disable-line no-unused-vars
export class SharedArrayBufferTransferIssue extends Issue {
    constructor(issueDetails, issuesModel) {
        super(Protocol.Audits.InspectorIssueCode.SharedArrayBufferTransferIssue, issuesModel);
        this.issueDetails = issueDetails;
    }
    getCategory() {
        return IssueCategory.Other;
    }
    sharedArrayBufferTransfers() {
        return [this.issueDetails];
    }
    details() {
        return this.issueDetails;
    }
    getDescription() {
        return {
            file: 'issues/descriptions/sharedArrayBufferTransfer.md',
            substitutions: undefined,
            issueKind: IssueKind.BreakingChange,
            links: [{ link: 'https://web.dev/enabling-shared-array-buffer/', linkTitle: ls `Enabling Shared Array Buffer` }],
        };
    }
    primaryKey() {
        return JSON.stringify(this.issueDetails);
    }
}
//# sourceMappingURL=SharedArrayBufferTransferIssue.js.map