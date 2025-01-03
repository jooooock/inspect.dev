"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IO = void 0;
class IO {
    // # Chromium APIs:
    // https://chromedevtools.github.io/devtools-protocol/tot/IO/
    // ## No mapping needed
    // ## Mapped
    // - IO.close
    // - IO.read
    // ## Not implemented
    // - IO.resolveBlob
    constructor(protocolAdaptor) {
        this.protocolAdaptor = protocolAdaptor;
        this.cache = this.protocolAdaptor.globalState.IOcache;
        this.protocolAdaptor.addMessageFilter('tools::IO.close', this.close.bind(this));
        this.protocolAdaptor.addMessageFilter('tools::IO.read', this.read.bind(this));
    }
    async close(msg) {
        this.cache.delete(msg.params.handle);
        this.protocolAdaptor.fireResultToClient(msg.id, {});
        return null;
    }
    async read(msg) {
        let data = this.cache.get(msg.params.handle);
        if (data) {
            let response = {
                data: data,
                eof: false,
                base64Encoded: false,
            };
            this.protocolAdaptor.fireResultToClient(msg.id, response);
            this.cache.delete(msg.params.handle);
        }
        else {
            let response = {
                data: null,
                eof: true,
                base64Encoded: false,
            };
            this.protocolAdaptor.fireResultToClient(msg.id, response);
        }
        return null;
    }
}
exports.IO = IO;
//# sourceMappingURL=io.js.map