// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import '../ui/components/components.js';
import * as LitHtml from '../third_party/lit-html/lit-html.js';
import * as Platform from '../platform/platform.js';
import * as SDK from '../sdk/sdk.js';
import * as UI from '../ui/ui.js';
const ls = Platform.UIString.ls;
export class RequestTrustTokensView extends UI.Widget.VBox {
    constructor(request) {
        super();
        this.reportView = new RequestTrustTokensReport();
        this.request = request;
        this.contentElement.appendChild(this.reportView);
    }
    wasShown() {
        this.request.addEventListener(SDK.NetworkRequest.Events.TrustTokenResultAdded, this.refreshReportView, this);
        this.refreshReportView();
    }
    willHide() {
        this.request.removeEventListener(SDK.NetworkRequest.Events.TrustTokenResultAdded, this.refreshReportView, this);
    }
    refreshReportView() {
        this.reportView.data = {
            params: this.request.trustTokenParams(),
            result: this.request.trustTokenOperationDoneEvent(),
        };
    }
}
export class RequestTrustTokensReport extends HTMLElement {
    constructor() {
        super(...arguments);
        this.shadow = this.attachShadow({ mode: 'open' });
    }
    set data(data) {
        this.trustTokenData = data;
        this.render();
    }
    render() {
        if (!this.trustTokenData) {
            throw new Error('Trying to render a Trust Token report without providing data');
        }
        // Disabled until https://crbug.com/1079231 is fixed.
        // clang-format off
        LitHtml.render(LitHtml.html `
      <style>
        devtools-report {
          --name-column-width: 150px;
        }

        .code {
          font-family: var(--monospace-font-family);
          font-size: var(--monospace-font-size);
        }

        .issuers-list {
          display: flex;
          flex-direction: column;
          list-style-type: none;
          padding: 0;
          margin: 0;
        }

        .status-row {
          display: flex;
        }

        .status-icon {
          margin-right: 6px;
        }

        .status-text {
          display: flex;
          flex-direction: column;
        }
      </style>
      <devtools-report>
        ${this.renderParameterSection()}
        ${this.renderResultSection()}
      </devtools-report>
    `, this.shadow);
        // clang-format on
    }
    renderParameterSection() {
        if (!this.trustTokenData || !this.trustTokenData.params) {
            return LitHtml.nothing;
        }
        return LitHtml.html `
      <devtools-report-section .data=${{ sectionTitle: ls `Parameters` }}>
        ${renderRowWithCodeValue(ls `Type`, this.trustTokenData.params.type.toString())}
        ${this.renderRefreshPolicy(this.trustTokenData.params)}
        ${this.renderIssuers(this.trustTokenData.params)}
        ${this.renderIssuerAndTopLevelOriginFromResult()}
      </devtools-report-section>`;
    }
    renderRefreshPolicy(params) {
        if (params.type !== Protocol.Network.TrustTokenOperationType.Redemption) {
            return LitHtml.nothing;
        }
        return renderRowWithCodeValue(ls `Refresh policy`, params.refreshPolicy.toString());
    }
    renderIssuers(params) {
        if (!params.issuers || params.issuers.length === 0) {
            return LitHtml.nothing;
        }
        return LitHtml.html `
      <devtools-report-row>
        <span slot="name">${ls `Issuers`}</span>
        <ul slot="value" class="issuers-list">
          ${params.issuers.map(issuer => LitHtml.html `<li>${issuer}</li>`)}
        </ul>
      </devtools-report-row>`;
    }
    // The issuer and top level origin are technically parameters but reported in the
    // result structure due to the timing when they are calculated in the backend.
    // Nonetheless, we show them as part of the parameter section.
    renderIssuerAndTopLevelOriginFromResult() {
        if (!this.trustTokenData || !this.trustTokenData.result) {
            return LitHtml.nothing;
        }
        return LitHtml.html `
      ${renderSimpleRowIfValuePresent(ls `Top level origin`, this.trustTokenData.result.topLevelOrigin)}
      ${renderSimpleRowIfValuePresent(ls `Issuer`, this.trustTokenData.result.issuerOrigin)}`;
    }
    renderResultSection() {
        if (!this.trustTokenData || !this.trustTokenData.result) {
            return LitHtml.nothing;
        }
        return LitHtml.html `
      <devtools-report-section .data=${{ sectionTitle: ls `Result` }}>
        <devtools-report-row>
          <span slot="name">${ls `Status`}</span>
          <div slot="value" class="status-row">
            <devtools-icon class="status-icon"
              .data=${getIconForStatusCode(this.trustTokenData.result.status)}>
            </devtools-icon>
            <div class="status-text">
              <span><strong>${getSimplifiedStatusTextForStatusCode(this.trustTokenData.result.status)}</strong></span>
              <span>${getDetailedTextForStatusCode(this.trustTokenData.result.status)}</span>
            </div>
          </div>
        </devtools-report-row>
        ${this.renderIssuedTokenCount(this.trustTokenData.result)}
      </devtools-report-section>`;
    }
    renderIssuedTokenCount(result) {
        if (result.type !== Protocol.Network.TrustTokenOperationType.Issuance) {
            return LitHtml.nothing;
        }
        return renderSimpleRowIfValuePresent(ls `Number of issued tokens`, result.issuedTokenCount);
    }
}
const SUCCESS_ICON_DATA = {
    color: 'rgb(12, 164, 12)',
    iconName: 'ic_checkmark_16x16',
    width: '12px',
};
const FAILURE_ICON_DATA = {
    color: '',
    iconName: 'error_icon',
    width: '12px',
};
function statusConsideredSuccess(status) {
    return status === Protocol.Network.TrustTokenOperationDoneEventStatus.Ok ||
        status === Protocol.Network.TrustTokenOperationDoneEventStatus.AlreadyExists ||
        status === Protocol.Network.TrustTokenOperationDoneEventStatus.FulfilledLocally;
}
function getIconForStatusCode(status) {
    return statusConsideredSuccess(status) ? SUCCESS_ICON_DATA : FAILURE_ICON_DATA;
}
function getSimplifiedStatusTextForStatusCode(status) {
    return statusConsideredSuccess(status) ? ls `Success` : ls `Failure`;
}
function getDetailedTextForStatusCode(status) {
    switch (status) {
        case Protocol.Network.TrustTokenOperationDoneEventStatus.Ok:
            return null;
        case Protocol.Network.TrustTokenOperationDoneEventStatus.AlreadyExists:
            return ls `The operations result was served from cache.`;
        case Protocol.Network.TrustTokenOperationDoneEventStatus.FulfilledLocally:
            return ls `The operation was fulfilled locally, no request was sent.`;
        case Protocol.Network.TrustTokenOperationDoneEventStatus.InvalidArgument:
            return ls `A client-provided argument was malformed or otherwise invalid.`;
        case Protocol.Network.TrustTokenOperationDoneEventStatus.ResourceExhausted:
            return ls `Either no inputs for this operation are available or the output exceeds the operations quota.`;
        case Protocol.Network.TrustTokenOperationDoneEventStatus.BadResponse:
            return ls `The servers response was malformed or otherwise invalid.`;
        case Protocol.Network.TrustTokenOperationDoneEventStatus.FailedPrecondition:
        case Protocol.Network.TrustTokenOperationDoneEventStatus.Unavailable:
        case Protocol.Network.TrustTokenOperationDoneEventStatus.InternalError:
        case Protocol.Network.TrustTokenOperationDoneEventStatus.UnknownError:
            return ls `The operation failed for an unknown reason.`;
    }
}
function renderSimpleRowIfValuePresent(name, value) {
    if (value === undefined) {
        return LitHtml.nothing;
    }
    return LitHtml.html `
    <devtools-report-row>
      <span slot="name">${name}</span>
      <span slot="value">${value}</span>
    </devtools-report-row>`;
}
function renderRowWithCodeValue(name, value) {
    return LitHtml.html `
    <devtools-report-row>
      <span slot="name">${name}</span>
      <span slot="value" class="code">${value}</span>
    </devtools-report-row>
  `;
}
customElements.define('devtools-trust-token-report', RequestTrustTokensReport);
//# sourceMappingURL=RequestTrustTokensView.js.map