"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoteMessages = void 0;
const lodash_1 = __importDefault(require("lodash"));
class RemoteMessages {
    constructor(isTargetBased = false) {
        this.isTargetBased = isTargetBased;
    }
    set isTargetBased(isTargetBased) {
        this._isTargetBased = isTargetBased;
    }
    get isTargetBased() {
        return this._isTargetBased;
    }
    getFullCommand(opts = {}) {
        const { method, params, connId, senderId, appIdKey, pageIdKey, targetId, id } = opts;
        let realMethod;
        let realParams;
        if (this.isTargetBased) {
            realMethod = 'Target.sendMessageToTarget';
            realParams = {
                targetId,
                message: JSON.stringify({
                    id,
                    method,
                    params: params,
                }),
            };
        }
        else {
            realMethod = method;
            realParams = params;
        }
        const plist = {
            __argument: {
                WIRSocketDataKey: {
                    method: realMethod,
                    params: realParams,
                },
                WIRConnectionIdentifierKey: connId,
                WIRSenderKey: senderId,
                WIRApplicationIdentifierKey: appIdKey,
                WIRPageIdentifierKey: pageIdKey,
            },
            __selector: '_rpc_forwardSocketData:',
        };
        return lodash_1.default.omitBy(plist, lodash_1.default.isNil);
    }
    getRemoteCommand(command, opts) {
        const { id, connId, appIdKey, senderId, pageIdKey, targetId, params } = opts;
        // deal with Safari Web Inspector commands
        switch (command) {
            case 'setConnectionKey':
                return {
                    __argument: {
                        WIRConnectionIdentifierKey: connId,
                    },
                    __selector: '_rpc_reportIdentifier:',
                };
            case 'indicateWebView':
                return {
                    __argument: {
                        WIRApplicationIdentifierKey: appIdKey,
                        WIRIndicateEnabledKey: lodash_1.default.isNil(opts.enabled) ? true : opts.enabled,
                        WIRConnectionIdentifierKey: connId,
                        WIRPageIdentifierKey: pageIdKey,
                    },
                    __selector: '_rpc_forwardIndicateWebView:',
                };
            case 'connectToApp':
                return {
                    __argument: {
                        WIRConnectionIdentifierKey: connId,
                        WIRApplicationIdentifierKey: appIdKey,
                    },
                    __selector: '_rpc_forwardGetListing:',
                };
            case 'getConnectedApplications':
                return {
                    __argument: {
                        WIRConnectionIdentifierKey: connId,
                    },
                    __selector: '_rpc_getConnectedApplications:',
                };
            case 'getListing':
                return {
                    __argument: {
                        WIRApplicationIdentifierKey: appIdKey,
                        WIRConnectionIdentifierKey: connId,
                    },
                    __selector: '_rpc_forwardGetListing:',
                };
            case 'setSenderKey':
                return {
                    __argument: {
                        WIRApplicationIdentifierKey: appIdKey,
                        WIRConnectionIdentifierKey: connId,
                        WIRSenderKey: senderId,
                        WIRPageIdentifierKey: pageIdKey,
                        WIRAutomaticallyPause: false,
                    },
                    __selector: '_rpc_forwardSocketSetup:',
                };
            case 'forwardDidClose':
                return {
                    __argument: {
                        WIRApplicationIdentifierKey: appIdKey,
                        WIRConnectionIdentifierKey: connId,
                        WIRSenderKey: senderId,
                        WIRPageIdentifierKey: pageIdKey,
                    },
                    __selector: '_rpc_forwardDidClose:',
                };
            case 'launchApplication':
                return {
                    __argument: {
                        WIRApplicationBundleIdentifierKey: opts.bundleId,
                    },
                    __selector: '_rpc_requestApplicationLaunch:',
                };
        }
        // deal with WebKit commands
        let cmd = this.getFullCommand({
            id: id,
            method: command,
            params: params,
            connId,
            appIdKey,
            senderId,
            pageIdKey,
            targetId,
        });
        return cmd;
    }
}
exports.RemoteMessages = RemoteMessages;
exports.default = RemoteMessages;
//# sourceMappingURL=remoteMessages.js.map