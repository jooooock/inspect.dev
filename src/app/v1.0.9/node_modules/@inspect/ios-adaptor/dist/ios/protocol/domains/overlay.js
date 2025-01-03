"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Overlay = void 0;
class Overlay {
    // # Chromium APIs:
    // https://chromedevtools.github.io/devtools-protocol/tot/Overlay/
    // - Overlay.disable
    // - Overlay.enable
    // - Overlay.setInspectMode
    // ## No mapping needed
    // ## Partial support, but needs mapping for 100% compat
    // ## Mapped
    // - Overlay.highlightFrame
    // - Overlay.highlightNode
    // - Overlay.highlightQuad
    // - Overlay.highlightRect
    // - Overlay.hideHighlight
    // - Overlay.setShowPaintRects
    // - Overlay.inspectNodeRequested
    // - Overlay.nodeHighlightRequested
    // ## Not implemented
    // - Overlay.getGridHighlightObjectsForTest
    // - Overlay.getHighlightObjectForTest
    // - Overlay.getSourceOrderHighlightObjectForTest
    // - Overlay.highlightSourceOrder
    // - Overlay.setShowAdHighlights
    // - Overlay.setShowDebugBorders
    // - Overlay.setShowFlexOverlays
    // - Overlay.setShowFPSCounter
    // - Overlay.setShowGridOverlays
    // - Overlay.setPausedInDebuggerMessage
    // - Overlay.setShowHinge
    // - Overlay.setShowHitTestBorders
    // - Overlay.setShowLayoutShiftRegions
    // - Overlay.setShowScrollBottleneckRects
    // - Overlay.setShowViewportSizeOnResize
    constructor(protocolAdaptor) {
        this.protocolAdaptor = protocolAdaptor;
        this.protocolAdaptor.addMessageFilter('tools::Overlay.highlightFrame', this.highlightFrame.bind(this));
        this.protocolAdaptor.addMessageFilter('tools::Overlay.highlightQuad', this.highlightQuad.bind(this));
        this.protocolAdaptor.addMessageFilter('tools::Overlay.highlightNode', this.highlightNode.bind(this));
        this.protocolAdaptor.addMessageFilter('tools::Overlay.highlightRect', this.highlightRect.bind(this));
        this.protocolAdaptor.addMessageFilter('tools::Overlay.hideHighlight', this.hideHighlight.bind(this));
        this.protocolAdaptor.addMessageFilter('tools::Overlay.setShowPaintRects', this.setShowPaintRects.bind(this));
        this.protocolAdaptor.addMessageFilter('tools::Overlay.setInspectMode', this.setInspectMode.bind(this));
        // Events
        this.protocolAdaptor.addMessageFilter('target::Inspector.inspect', this.onInspectorInspect.bind(this));
    }
    highlightNode(msg) {
        let params = msg.params;
        msg.method = 'DOM.highlightNode';
        msg.params = {
            highlightConfig: params.highlightConfig,
            nodeId: params.nodeId,
            objectId: msg.params.objectId,
        };
        return msg;
    }
    hideHighlight(msg) {
        let params = msg.params;
        msg.method = 'DOM.hideHighlight';
        return msg;
    }
    highlightFrame(msg) {
        let params = msg.params;
        msg.method = 'DOM.highlightFrame';
        return msg;
    }
    async highlightQuad(msg) {
        let params = msg.params;
        msg.method = 'DOM.highlightQuad';
        return msg;
    }
    async highlightRect(msg) {
        let params = msg.params;
        msg.method = 'DOM.highlightReact';
        return msg;
    }
    async setShowPaintRects(msg) {
        msg.method = 'Page.setShowPaintRects';
        return msg;
    }
    async setInspectMode(msg) {
        let params = msg.params;
        msg.method = 'DOM.setInspectModeEnabled';
        msg.params = {
            enabled: params.mode === 'searchForNode',
            highlightConfig: params.highlightConfig,
        };
        return msg;
    }
    async onInspectorInspect(msg) {
        // Event from webkit https://github.com/WebKit/WebKit/blob/main/Source/JavaScriptCore/inspector/protocol/Inspector.json#L27
        let nodeReq = await this.protocolAdaptor.makeRequest('DOM.requestNode', {
            objectId: msg.params.object.objectId,
        });
        this.protocolAdaptor.fireEventToClient('Overlay.inspectNodeRequested', {
            backendNodeId: nodeReq.nodeId,
        });
        this.protocolAdaptor.fireEventToClient('Overlay.nodeHighlightRequested', {
            nodeId: nodeReq.nodeId,
        });
        // Don't emit original Inspector.inspect event
        return null;
    }
}
exports.Overlay = Overlay;
//# sourceMappingURL=overlay.js.map