// Copyright (c) 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as Common from '../common/common.js';
import * as LitHtml from '../third_party/lit-html/lit-html.js';
const ls = Common.ls;
// A link to a survey. The link is rendered aysnchronously because we need to first check if
// canShowSurvey succeeds.
export class IssueSurveyLink extends HTMLElement {
    constructor() {
        super(...arguments);
        this.shadow = this.attachShadow({ mode: 'open' });
        this.trigger = '';
        this.canShowSurvey = () => { };
        this.showSurvey = () => { };
        this.state = "Checking" /* Checking */;
    }
    // Re-setting data will cause the state to go back to 'Checking' which hides the link.
    set data(data) {
        this.trigger = data.trigger;
        this.canShowSurvey = data.canShowSurvey;
        this.showSurvey = data.showSurvey;
        this.checkSurvey();
    }
    checkSurvey() {
        this.state = "Checking" /* Checking */;
        this.canShowSurvey(this.trigger, ({ canShowSurvey }) => {
            if (!canShowSurvey) {
                this.state = "DontShowLink" /* DontShowLink */;
            }
            else {
                this.state = "ShowLink" /* ShowLink */;
            }
            this.render();
        });
    }
    sendSurvey() {
        this.state = "Sending" /* Sending */;
        this.render();
        this.showSurvey(this.trigger, ({ surveyShown }) => {
            if (!surveyShown) {
                this.state = "Failed" /* Failed */;
            }
            else {
                this.state = "SurveyShown" /* SurveyShown */;
            }
            this.render();
        });
    }
    render() {
        if (this.state === "Checking" /* Checking */ || this.state === "DontShowLink" /* DontShowLink */) {
            return;
        }
        let linkText = ls `Is this issue message helpful to you?`;
        if (this.state === "Sending" /* Sending */) {
            linkText = ls `Opening survey …`;
        }
        else if (this.state === "SurveyShown" /* SurveyShown */) {
            linkText = ls `Thank you for your feedback`;
        }
        else if (this.state === "Failed" /* Failed */) {
            linkText = ls `An error occurred with the survey`;
        }
        let linkState = '';
        if (this.state === "Sending" /* Sending */) {
            linkState = 'pending-link';
        }
        else if (this.state === "Failed" /* Failed */ || this.state === "SurveyShown" /* SurveyShown */) {
            linkState = 'disabled-link';
        }
        const ariaDisabled = this.state !== "ShowLink" /* ShowLink */;
        // clang-format off
        const output = LitHtml.html `
      <style>
        .link-icon {
          width: 28px;
          height: 24px;
          text-align: center;
          vertical-align: sub;
        }
        .link {
          padding: 4px 0 0 0;
          text-decoration: underline;
          cursor: pointer;
          font-size: 14px;
          color: var(--issue-link);
          border: none;
          background: none;
        }
        .link:focus:not(:focus-visible) {
          outline: none;
        }
        .pending-link {
          opacity: 75%;
          pointer-events: none;
          cursor: default;
          text-decoration: none;
        }
        .disabled-link {
          pointer-events: none;
          cursor: default;
          text-decoration: none;
        }
      </style>
      <button class="link ${linkState}" tabindex=${ariaDisabled ? '-1' : '0'} aria-disabled=${ariaDisabled} @click=${this.sendSurvey}>
        <devtools-icon class="link-icon" .data=${{ iconName: 'feedback_thin_16x16_icon', color: 'var(--issue-link)', width: '16px', height: '16px' }}></devtools-icon><!--
      -->${linkText}
      </button>
    `;
        // clang-format on
        LitHtml.render(output, this.shadow, { eventContext: this });
    }
}
customElements.define('devtools-issue-survey-link', IssueSurveyLink);
//# sourceMappingURL=IssueSurveyLink.js.map