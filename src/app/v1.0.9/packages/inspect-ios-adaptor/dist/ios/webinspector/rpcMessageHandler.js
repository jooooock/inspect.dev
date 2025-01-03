"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const events_1 = require("events");
class RpcMessageHandler extends events_1.EventEmitter {
    constructor(isTargetBased = false, baseLogger) {
        super();
        this.logger = baseLogger.scope('RpcMessageHandler');
        this.setMaxListeners(40);
        this.isTargetBased = isTargetBased;
    }
    get isTargetBased() {
        return this._isTargetBased;
    }
    set isTargetBased(isTargetBased) {
        this._isTargetBased = !!isTargetBased;
    }
    async handleMessage(plist) {
        const selector = plist.__selector;
        if (!selector) {
            this.logger.debug('Got an invalid plist');
            return;
        }
        const argument = plist.__argument;
        // this.logger.debug(`Debugger got ${JSON.stringify(plist)}`);
        switch (selector) {
            case '_rpc_reportSetup:':
                // Keys from https://webkit.googlesource.com/WebKit/+/master/Source/JavaScriptCore/inspector/remote/RemoteInspectorConstants.h#111
                this.emit('_rpc_reportSetup:', null, argument.WIRSimulatorNameKey, argument.WIRSimulatorBuildKey, argument.WIRSimulatorProductVersionKey);
                break;
            case '_rpc_reportConnectedApplicationList:':
                this.emit('_rpc_reportConnectedApplicationList:', null, argument.WIRApplicationDictionaryKey);
                break;
            case '_rpc_applicationConnected:':
                this.emit('_rpc_applicationConnected:', null, argument);
                break;
            case '_rpc_applicationDisconnected:':
                this.emit('_rpc_applicationDisconnected:', null, argument);
                break;
            case '_rpc_applicationUpdated:':
                this.emit('_rpc_applicationUpdated:', null, argument);
                break;
            case '_rpc_applicationSentListing:':
                this.emit('_rpc_applicationSentListing:', null, argument.WIRApplicationIdentifierKey, argument.WIRListingKey);
                break;
            case '_rpc_reportConnectedDriverList:':
                this.emit('_rpc_reportConnectedDriverList:', null, argument);
                break;
            case '_rpc_reportCurrentState:':
                this.emit('_rpc_reportCurrentState:', null, argument);
                break;
            case '_rpc_applicationSentData:':
                await this.handleDataMessage(plist);
                break;
            default:
                this.logger.debug(`Debugger got a message for '${selector}' and have no ` + `handler, doing nothing.`);
        }
    }
    parseDataKey(plist) {
        try {
            return JSON.parse(plist.__argument.WIRMessageDataKey.toString('utf8'));
        }
        catch (err) {
            this.logger.error(`Unparseable message data: ${lodash_1.default.truncate(JSON.stringify(plist), {
                length: 100,
            })}`);
            throw new Error(`Unable to parse message data: ${err.message}`);
        }
    }
    async handleDataMessage(plist) {
        const dataKey = this.parseDataKey(plist);
        let method = dataKey.method;
        if (method === 'Target.targetCreated') {
            // this is in response to a `_rpc_forwardSocketSetup:` call
            // targetInfo: { targetId: 'page-1', type: 'page' }
            const app = plist.__argument.WIRApplicationIdentifierKey;
            const targetInfo = dataKey.params.targetInfo;
            this.emit('Target.targetCreated', null, app, targetInfo);
            return;
        }
        else if (method === 'Target.didCommitProvisionalTarget') {
            const app = plist.__argument.WIRApplicationIdentifierKey;
            const oldTargetId = dataKey.params.oldTargetId;
            const newTargetId = dataKey.params.newTargetId;
            this.emit('Target.didCommitProvisionalTarget', null, app, oldTargetId, newTargetId);
            return;
        }
        else if (method === 'Target.targetDestroyed') {
            const app = plist.__argument.WIRApplicationIdentifierKey;
            const targetInfo = dataKey.params.targetInfo || {
                targetId: dataKey.params.targetId,
            };
            this.emit('Target.targetDestroyed', null, app, targetInfo);
            return;
        }
        let rawMessage;
        if (!dataKey.error && this.isTargetBased) {
            if (dataKey.method !== 'Target.dispatchMessageFromTarget') {
                // this sort of message, at this point, is just an acknowledgement
                // that the original message was received
                return;
            }
            // at this point, we have a Target-based message wrapping a protocol message
            try {
                rawMessage = JSON.parse(dataKey.params.message);
            }
            catch (err) {
                // if this happens then some aspect of the protocol is missing to us
                // so print the entire message to get visibiity into what is going on
                this.logger.error(`Unexpected message format from Web Inspector:`);
            }
        }
        else {
            rawMessage = dataKey;
        }
        this.emit('_rpc_applicationSentDataParsed:', rawMessage);
    }
}
exports.default = RpcMessageHandler;
//# sourceMappingURL=rpcMessageHandler.js.map