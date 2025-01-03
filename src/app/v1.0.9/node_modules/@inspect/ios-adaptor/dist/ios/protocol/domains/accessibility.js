"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Accessibility = void 0;
class Accessibility {
    // # Chromium APIs:
    // https://chromedevtools.github.io/devtools-protocol/tot/Accessibility/
    // ## No mapping needed
    // -
    // ## Mapped
    //  - Accessibility.disable
    //  - Accessibility.enable
    //  - Accessibility.getPartialAXTree EXPERIMENTAL
    // ## Not implemented
    //  - Accessibility.getChildAXNodes EXPERIMENTAL
    //  - Accessibility.getFullAXTree EXPERIMENTAL
    //  - Accessibility.queryAXTree EXPERIMENTAL
    constructor(protocolAdaptor) {
        this.protocolAdaptor = protocolAdaptor;
        this.protocolAdaptor.addMessageFilter('tools::Accessibility.disable', this.disable.bind(this));
        this.protocolAdaptor.addMessageFilter('tools::Accessibility.enable', this.enable.bind(this));
        this.protocolAdaptor.addMessageFilter('tools::Accessibility.getPartialAXTree', this.getPartialAXTree.bind(this));
    }
    async disable(msg) {
        const result = {
            result: true,
        };
        this.protocolAdaptor.fireResultToClient(msg.id, result);
        return null;
    }
    async enable(msg) {
        const result = {
            result: true,
        };
        this.protocolAdaptor.fireResultToClient(msg.id, result);
        return null;
    }
    async getPartialAXTree(msg) {
        let params = msg.params;
        try {
            let webkitResults = await this.protocolAdaptor.makeRequest('DOM.getAccessibilityPropertiesForNode', {
                nodeId: params.nodeId,
            });
            let properties = webkitResults.properties;
            let result = {
                nodes: [],
            };
            this.protocolAdaptor.fireResultToClient(msg.id, result);
            return null;
        }
        catch (err) {
            this.protocolAdaptor.logger.error('getPartialAXTree.failed');
            return null;
        }
    }
}
exports.Accessibility = Accessibility;
//# sourceMappingURL=accessibility.js.map