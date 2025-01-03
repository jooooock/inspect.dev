"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtocolAdapter = void 0;
const stream_1 = require("stream");
const pTimeout_1 = __importDefault(require("../../lib/pTimeout"));
class ProtocolAdapter extends stream_1.EventEmitter {
    constructor(baseLogger) {
        super();
        this.onMessageFromTarget = this.onMessageFromTarget.bind(this);
        this.onMessageFromClient = this.onMessageFromClient.bind(this);
        this.messageFilters = new Map();
        this.clientRequestMap = new Map();
        this.clientRequestParamsMap = new Map();
        this.adapterRequestMap = new Map();
        this.lastMsgId = 10000;
        this.baseLogger = baseLogger;
        this.logger = this.baseLogger.scope('ProtocolAdapter');
    }
    onMessageFromTarget(msg) {
        if ('id' in msg) {
            this.logger.info('onMessageFromTarget', msg.id);
            if (this.clientRequestMap.has(msg.id)) {
                // Resolve method name from request ID via clientRequestMap
                let eventName = `target::${this.clientRequestMap.get(msg.id)}`;
                this.clientRequestMap.delete(msg.id);
                if (this.messageFilters.has(eventName)) {
                    try {
                        let sequence = Promise.resolve(msg);
                        this.messageFilters.get(eventName).forEach(filter => {
                            sequence = sequence.then(filteredMessage => {
                                return filter(filteredMessage);
                            });
                        });
                        sequence.then(filteredMessage => {
                            this.sendToFrontend(filteredMessage);
                            this.clientRequestParamsMap.delete(msg.id);
                        });
                    }
                    catch (err) {
                        this.logger.error('onMessageFromTarget.filtering.failed', err);
                    }
                }
                else {
                    // Pass it on to the tools
                    this.sendToFrontend(msg);
                }
            }
            else if (this.adapterRequestMap.has(msg.id)) {
                this.logger.info('onMessageFromTarget.adapterRequestMap', msg.id);
                // Reply to adapter request
                const resultPromise = this.adapterRequestMap.get(msg.id);
                this.adapterRequestMap.delete(msg.id);
                if ('result' in msg) {
                    resultPromise.resolve(msg.result);
                }
                else if ('error' in msg) {
                    this.logger.error('msg', msg);
                    resultPromise.reject(msg.error.message);
                }
                else {
                    resultPromise.reject(msg);
                    this.logger.error(`Unhandled type of request message from target`, `msg=${msg}`);
                }
            }
            else {
                this.logger.debug('Request not made by client, but forward anyway', `id=${msg.id}`);
                this.sendToFrontend(msg);
            }
        }
        else {
            const eventName = `target::${msg.method}`;
            if (this.messageFilters.has(eventName)) {
                try {
                    let sequence = Promise.resolve(msg);
                    this.messageFilters.get(eventName).forEach(filter => {
                        sequence = sequence.then(filteredMessage => {
                            return filter(filteredMessage);
                        });
                    });
                    sequence.then(filteredMessage => {
                        this.sendToFrontend(filteredMessage);
                    });
                }
                catch (err) {
                    this.logger.error('onMessageFromTarget.filtering.failed', err);
                }
            }
            else {
                this.sendToFrontend(msg);
            }
        }
    }
    onMessageFromClient(msg) {
        const eventName = `tools::${msg.method}`;
        // this.lastMsgId = Math.max(this.lastMsgId, msg.id);
        // Store request in map
        this.clientRequestMap.set(msg.id, msg.method);
        this.clientRequestParamsMap.set(msg.id, msg.params);
        if (this.messageFilters.has(eventName)) {
            try {
                let sequence = Promise.resolve(msg);
                this.messageFilters.get(eventName).forEach(filter => {
                    sequence = sequence.then(filteredMessage => {
                        return filter(filteredMessage);
                    });
                });
                sequence.then(filteredMessage => {
                    // Only send on the message if it wasn't completely filtered out
                    if (filteredMessage) {
                        this.sendToTarget(filteredMessage);
                    }
                });
            }
            catch (err) {
                this.logger.error('onMessageFromClient.filtering.failed', err);
            }
        }
        else {
            this.sendToTarget(msg);
        }
    }
    getParamsFromRequest(msgId) {
        if (this.clientRequestParamsMap.has(msgId)) {
            return this.clientRequestParamsMap.get(msgId);
        }
        else {
            return null;
        }
    }
    addMessageFilter(method, filter) {
        if (!this.messageFilters.has(method)) {
            this.messageFilters.set(method, []);
        }
        this.messageFilters.get(method).push(filter);
    }
    makeRequest(method, params) {
        return (0, pTimeout_1.default)(new Promise((resolve, reject) => {
            let reqId = ++this.lastMsgId;
            const msg = {
                id: reqId,
                method: method,
                params: params,
            };
            this.logger.info('makeRequest', msg);
            this.adapterRequestMap.set(msg.id, { resolve: resolve, reject: reject });
            this.sendToTarget(msg);
        }), {
            milliseconds: 1000,
        }).catch((err) => {
            // TODO: Clean up this.adapterRequestMap, so requests dont hang round.
        });
    }
    fireEventToClient(method, params) {
        const response = {
            method: method,
            params: params,
        };
        this.sendToFrontend(response);
    }
    fireResultToClient(id, params) {
        const response = {
            id: id,
            result: params,
        };
        this.sendToFrontend(response);
    }
    replyWithEmpty(msg) {
        this.fireResultToClient(msg.id, {});
        return Promise.resolve(null);
    }
    sendToTarget(msg) {
        let { id, method } = msg;
        this.logger.debug('protocolAdaptor.sendToTarget', `id=${id} method=${method}`);
        this.emit('toTarget', msg);
    }
    sendToFrontend(msg) {
        if (!msg) {
            return;
        }
        let { id } = msg;
        this.logger.debug('protocolAdaptor.sendToFrontend', `id=${id}`);
        this.emit('toFrontend', msg);
    }
}
exports.ProtocolAdapter = ProtocolAdapter;
//# sourceMappingURL=protocolAdaptor.js.map