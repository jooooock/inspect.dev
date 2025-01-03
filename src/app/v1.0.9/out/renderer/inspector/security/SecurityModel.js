// Copyright 2015 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as i18n from '../i18n/i18n.js';
import * as SDK from '../sdk/sdk.js';
export const UIStrings = {
    /**
    *@description Text in Security Panel of the Security panel
    */
    theSecurityOfThisPageIsUnknown: 'The security of this page is unknown.',
    /**
    *@description Text in Security Panel of the Security panel
    */
    thisPageIsNotSecure: 'This page is not secure.',
    /**
    *@description Text in Security Panel of the Security panel
    */
    thisPageIsSecureValidHttps: 'This page is secure (valid HTTPS).',
    /**
    *@description Text in Security Panel of the Security panel
    */
    thisPageIsNotSecureBrokenHttps: 'This page is not secure (broken HTTPS).',
    /**
    *@description Description of an SSL cipher that contains a separate (bulk) cipher and MAC.
    *@example {AES_256_CBC} PH1
    *@example {HMAC-SHA1} PH2
    */
    cipherWithMAC: '{PH1} with {PH2}',
    /**
    *@description Description of an SSL Key and its Key Exchange Group.
    *@example {ECDHE_RSA} PH1
    *@example {X25519} PH2
    */
    keyExchangeWithGroup: '{PH1} with {PH2}',
};
const str_ = i18n.i18n.registerUIStrings('security/SecurityModel.js', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class SecurityModel extends SDK.SDKModel.SDKModel {
    /**
     * @param {!SDK.SDKModel.Target} target
     */
    constructor(target) {
        super(target);
        this._dispatcher = new SecurityDispatcher(this);
        this._securityAgent = target.securityAgent();
        target.registerSecurityDispatcher(this._dispatcher);
        this._securityAgent.invoke_enable();
    }
    /**
     * @return {!SDK.ResourceTreeModel.ResourceTreeModel}
     */
    resourceTreeModel() {
        return /** @type {!SDK.ResourceTreeModel.ResourceTreeModel} */ (this.target().model(SDK.ResourceTreeModel.ResourceTreeModel));
    }
    /**
     * @return {!SDK.NetworkManager.NetworkManager}
     */
    networkManager() {
        return /** @type {!SDK.NetworkManager.NetworkManager} */ (this.target().model(SDK.NetworkManager.NetworkManager));
    }
    /**
     * @param {?Protocol.Security.SecurityState} a
     * @param {?Protocol.Security.SecurityState} b
     * @return {number}
     */
    static SecurityStateComparator(a, b) {
        const securityStateMap = getOrCreateSecurityStateOrdinalMap();
        const aScore = a && securityStateMap.get(a) || 0;
        const bScore = b && securityStateMap.get(b) || 0;
        return aScore - bScore;
    }
}
/** @type {?Map<!Protocol.Security.SecurityState, number>} */
let securityStateToOrdinal = null;
/**
 * @return {!Map<!Protocol.Security.SecurityState, number>}
 */
const getOrCreateSecurityStateOrdinalMap = () => {
    if (!securityStateToOrdinal) {
        securityStateToOrdinal = new Map();
        const ordering = [
            Protocol.Security.SecurityState.Info, Protocol.Security.SecurityState.InsecureBroken,
            Protocol.Security.SecurityState.Insecure, Protocol.Security.SecurityState.Neutral,
            Protocol.Security.SecurityState.Secure,
            // Unknown is max so that failed/cancelled requests don't overwrite the origin security state for successful requests,
            // and so that failed/cancelled requests appear at the bottom of the origins list.
            Protocol.Security.SecurityState.Unknown
        ];
        for (let i = 0; i < ordering.length; i++) {
            securityStateToOrdinal.set(ordering[i], i + 1);
        }
    }
    return securityStateToOrdinal;
};
SDK.SDKModel.SDKModel.register(SecurityModel, SDK.SDKModel.Capability.Security, false);
/** @enum {symbol} */
export const Events = {
    SecurityStateChanged: Symbol('SecurityStateChanged'),
    VisibleSecurityStateChanged: Symbol('VisibleSecurityStateChanged')
};
/** @type {!Object<string, string>} */
export const SummaryMessages = {
    [Protocol.Security.SecurityState.Unknown]: i18nString(UIStrings.theSecurityOfThisPageIsUnknown),
    [Protocol.Security.SecurityState.Insecure]: i18nString(UIStrings.thisPageIsNotSecure),
    [Protocol.Security.SecurityState.Neutral]: i18nString(UIStrings.thisPageIsNotSecure),
    [Protocol.Security.SecurityState.Secure]: i18nString(UIStrings.thisPageIsSecureValidHttps),
    [Protocol.Security.SecurityState.InsecureBroken]: i18nString(UIStrings.thisPageIsNotSecureBrokenHttps)
};
export class PageSecurityState {
    /**
     * @param {!Protocol.Security.SecurityState} securityState
     * @param {!Array<!Protocol.Security.SecurityStateExplanation>} explanations
     * @param {?string} summary
     */
    constructor(securityState, explanations, summary) {
        this.securityState = securityState;
        this.explanations = explanations;
        this.summary = summary;
    }
}
export class PageVisibleSecurityState {
    /**
     * @param {!Protocol.Security.SecurityState} securityState
     * @param {?Protocol.Security.CertificateSecurityState} certificateSecurityState
     * @param {?Protocol.Security.SafetyTipInfo} safetyTipInfo
     * @param {!Array<string>} securityStateIssueIds
     */
    constructor(securityState, certificateSecurityState, safetyTipInfo, securityStateIssueIds) {
        this.securityState = securityState;
        this.certificateSecurityState =
            certificateSecurityState ? new CertificateSecurityState(certificateSecurityState) : null;
        this.safetyTipInfo = safetyTipInfo ? new SafetyTipInfo(safetyTipInfo) : null;
        this.securityStateIssueIds = securityStateIssueIds;
    }
}
export class CertificateSecurityState {
    /**
     * @param {!Protocol.Security.CertificateSecurityState} certificateSecurityState
     */
    constructor(certificateSecurityState) {
        /** @type {string} */
        this.protocol = certificateSecurityState.protocol;
        /** @type {string} */
        this.keyExchange = certificateSecurityState.keyExchange;
        /** @type {?string} */
        this.keyExchangeGroup = certificateSecurityState.keyExchangeGroup || null;
        /** @type {string} */
        this.cipher = certificateSecurityState.cipher;
        /** @type {?string} */
        this.mac = certificateSecurityState.mac || null;
        /** @type {!Array<string>} */
        this.certificate = certificateSecurityState.certificate;
        /** @type {string} */
        this.subjectName = certificateSecurityState.subjectName;
        /** @type {string} */
        this.issuer = certificateSecurityState.issuer;
        /** @type {!Protocol.Network.TimeSinceEpoch} */
        this.validFrom = certificateSecurityState.validFrom;
        /** @type {!Protocol.Network.TimeSinceEpoch} */
        this.validTo = certificateSecurityState.validTo;
        /** @type {?string} */
        this.certificateNetworkError = certificateSecurityState.certificateNetworkError || null;
        /** @type {boolean} */
        this.certificateHasWeakSignature = certificateSecurityState.certificateHasWeakSignature;
        /** @type {boolean} */
        this.certificateHasSha1Signature = certificateSecurityState.certificateHasSha1Signature;
        /** @type {boolean} */
        this.modernSSL = certificateSecurityState.modernSSL;
        /** @type {boolean} */
        this.obsoleteSslProtocol = certificateSecurityState.obsoleteSslProtocol;
        /** @type {boolean} */
        this.obsoleteSslKeyExchange = certificateSecurityState.obsoleteSslKeyExchange;
        /** @type {boolean} */
        this.obsoleteSslCipher = certificateSecurityState.obsoleteSslCipher;
        /** @type {boolean} */
        this.obsoleteSslSignature = certificateSecurityState.obsoleteSslSignature;
    }
    /**
     * @return {boolean}
     */
    isCertificateExpiringSoon() {
        const expiryDate = new Date(this.validTo * 1000).getTime();
        return (expiryDate < new Date(Date.now()).setHours(48)) && (expiryDate > Date.now());
    }
    /**
     * @return {string}
     */
    getKeyExchangeName() {
        if (this.keyExchangeGroup) {
            return this.keyExchange ?
                i18nString(UIStrings.keyExchangeWithGroup, { PH1: this.keyExchange, PH2: this.keyExchangeGroup }) :
                this.keyExchangeGroup;
        }
        return this.keyExchange;
    }
    /**
     * @return {string}
     */
    getCipherFullName() {
        return this.mac ? i18nString(UIStrings.cipherWithMAC, { PH1: this.cipher, PH2: this.mac }) : this.cipher;
    }
}
class SafetyTipInfo {
    /**
     * @param {!Protocol.Security.SafetyTipInfo} safetyTipInfo
     */
    constructor(safetyTipInfo) {
        /** @type {string} */
        this.safetyTipStatus = safetyTipInfo.safetyTipStatus;
        /** @type {?string} */
        this.safeUrl = safetyTipInfo.safeUrl || null;
    }
}
export class SecurityStyleExplanation {
    /**
     * @param {!Protocol.Security.SecurityState} securityState
     * @param {string|undefined} title
     * @param {string} summary
     * @param {string} description
     * @param {!Array<string>=} certificate
     * @param {!Protocol.Security.MixedContentType=} mixedContentType
     * @param {!Array<string>=} recommendations
     */
    constructor(securityState, title, summary, description, certificate = [], mixedContentType = Protocol.Security.MixedContentType.None, recommendations = []) {
        this.securityState = securityState;
        this.title = title;
        this.summary = summary;
        this.description = description;
        this.certificate = certificate;
        this.mixedContentType = mixedContentType;
        this.recommendations = recommendations;
    }
}
/**
 * @implements {ProtocolProxyApi.SecurityDispatcher}
 */
class SecurityDispatcher {
    /**
     * @param {!SecurityModel} model
     */
    constructor(model) {
        this._model = model;
    }
    /**
     * @override
     * @param {!Protocol.Security.SecurityStateChangedEvent} event
     */
    securityStateChanged({ securityState, schemeIsCryptographic, explanations, insecureContentStatus, summary }) {
        const pageSecurityState = new PageSecurityState(securityState, explanations, summary || null);
        this._model.dispatchEventToListeners(Events.SecurityStateChanged, pageSecurityState);
    }
    /**
     * @override
     * @param {!Protocol.Security.VisibleSecurityStateChangedEvent} event
     */
    visibleSecurityStateChanged({ visibleSecurityState }) {
        const pageVisibleSecurityState = new PageVisibleSecurityState(visibleSecurityState.securityState, visibleSecurityState.certificateSecurityState || null, visibleSecurityState.safetyTipInfo || null, visibleSecurityState.securityStateIssueIds);
        this._model.dispatchEventToListeners(Events.VisibleSecurityStateChanged, pageVisibleSecurityState);
    }
    /**
     * @override
     * @param {!Protocol.Security.CertificateErrorEvent} event
     */
    certificateError({ eventId, errorType, requestURL }) {
    }
}
//# sourceMappingURL=SecurityModel.js.map