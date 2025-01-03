import Protocol from 'devtools-protocol';
import { iOSProtocolAdaptor } from '../iOSProtocolAdapter';

export class Overlay {
  private protocolAdaptor: iOSProtocolAdaptor;

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

  constructor(protocolAdaptor: iOSProtocolAdaptor) {
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

  private highlightNode(msg: any): Promise<any> {
    let params: Protocol.Overlay.HighlightNodeRequest = msg.params;

    msg.method = 'DOM.highlightNode';
    msg.params = {
      highlightConfig: params.highlightConfig,
      nodeId: params.nodeId,
      objectId: msg.params.objectId,
    };

    return msg;
  }

  private hideHighlight(msg: any): Promise<any> {
    let params: Protocol.Overlay.HighlightNodeRequest = msg.params;

    msg.method = 'DOM.hideHighlight';
    return msg;
  }

  private highlightFrame(msg: any): Promise<any> {
    let params: Protocol.Overlay.HighlightFrameRequest = msg.params;

    msg.method = 'DOM.highlightFrame';
    return msg;
  }

  private async highlightQuad(msg: any): Promise<any> {
    let params: Protocol.Overlay.HighlightQuadRequest = msg.params;

    msg.method = 'DOM.highlightQuad';
    return msg;
  }

  private async highlightRect(msg: any): Promise<any> {
    let params: Protocol.Overlay.HighlightRectRequest = msg.params;
    msg.method = 'DOM.highlightReact';

    return msg;
  }

  private async setShowPaintRects(msg: any): Promise<any> {
    msg.method = 'Page.setShowPaintRects';

    return msg;
  }

  private async setInspectMode(msg: any): Promise<any> {
    let params: Protocol.Overlay.SetInspectModeRequest = msg.params;

    msg.method = 'DOM.setInspectModeEnabled';
    msg.params = {
      enabled: params.mode === 'searchForNode',
      highlightConfig: params.highlightConfig,
    };

    return msg;
  }

  private async onInspectorInspect(msg: any): Promise<any> {
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
