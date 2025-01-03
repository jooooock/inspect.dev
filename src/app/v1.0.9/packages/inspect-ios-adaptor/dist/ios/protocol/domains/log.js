"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = void 0;
class Log {
    // # Chromium APIs:
    // https://chromedevtools.github.io/devtools-protocol/1-3/Log/
    // ## No mapping needed
    // ## Partial support, but needs mapping for 100% compat
    // ## Mapped
    // - Log.clear
    // - Log.disable
    // - Log.enable
    // ## Not implemented
    // - Log.startViolationsReport
    // - Log.stopViolationsReport
    constructor(protocolAdaptor) {
        this.protocolAdaptor = protocolAdaptor;
        this.protocolAdaptor.addMessageFilter('tools::Log.clear', this.clear.bind(this));
        this.protocolAdaptor.addMessageFilter('tools::Log.disable', this.disable.bind(this));
        this.protocolAdaptor.addMessageFilter('tools::Log.enable', this.enable.bind(this));
    }
    async clear(msg) {
        msg.method = 'Console.clearMessages';
        return msg;
    }
    async disable(msg) {
        msg.method = 'Console.disable';
        return msg;
    }
    async enable(msg) {
        msg.method = 'Console.enable';
        return msg;
    }
}
exports.Log = Log;
//# sourceMappingURL=log.js.map