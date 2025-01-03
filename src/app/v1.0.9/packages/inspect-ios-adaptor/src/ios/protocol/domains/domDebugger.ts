import Protocol from 'devtools-protocol';
import { iOSProtocolAdaptor } from '../iOSProtocolAdapter';

// # Chromium APIs:

// ## No mapping needed
// - DOMDebugger.setDOMBreakpoint
// - DOMDebugger.removeDOMBreakpoint

// ## Partial support, but needs mapping for 100% compat

// ## Mapped
// - DOMDebugger.getEventListeners
// - DOMDebugger.setXHRBreakpoint
// - DOMDebugger.removeXHRBreakpoint
// - DOMDebugger.setEventListenerBreakpoint
// - DOMDebugger.removeEventListenerBreakpoint

// ## Not implemented

export class DOMDebugger {
  private protocolAdaptor: iOSProtocolAdaptor;

  constructor(protocolAdaptor: iOSProtocolAdaptor) {
    this.protocolAdaptor = protocolAdaptor;
    this.protocolAdaptor.addMessageFilter('tools::DOMDebugger.getEventListeners', this.getEventListeners.bind(this));
    this.protocolAdaptor.addMessageFilter('tools::DOMDebugger.setXHRBreakpoint', this.setXHRBreakpoint.bind(this));
    this.protocolAdaptor.addMessageFilter('tools::DOMDebugger.removeXHRBreakpoint', this.removeXHRBreakpoint.bind(this));
    this.protocolAdaptor.addMessageFilter('tools::DOMDebugger.setEventListenerBreakpoint', this.setEventListenerBreakpoint.bind(this));
    this.protocolAdaptor.addMessageFilter('tools::DOMDebugger.removeEventListenerBreakpoint', this.removeEventListenerBreakpoint.bind(this));
  }

  private async getEventListeners(msg: any): Promise<any> {
    let params: Protocol.DOMDebugger.GetEventListenersRequest = msg.params;

    try {
      let node = await this.protocolAdaptor.makeRequest('DOM.requestNode', {
        objectId: params.objectId,
      });

      let eventListeners = await this.protocolAdaptor.makeRequest('DOM.getEventListenersForNode', {
        nodeId: node.nodeId,
        objectGroup: 'event-listeners-panel',
      });

      const mappedListeners = eventListeners.listeners.map(listener => {
        return {
          type: listener.type,
          useCapture: listener.useCapture,
          passive: false, // iOS doesn't support this property, http://compatibility.remotedebug.org/DOM/Safari%20iOS%209.3/types/EventListener,
          location: listener.location,
          hander: listener.hander,
        };
      });

      const result: Protocol.DOMDebugger.GetEventListenersResponse = {
        listeners: mappedListeners,
      };

      this.protocolAdaptor.fireResultToClient(msg.id, result);
    } catch (error) {
      this.protocolAdaptor.logger.error('getEventListeners.failed');
    }

    return null;
  }

  private async setXHRBreakpoint(msg: any): Promise<any> {
    msg.method = 'DOM.setURLBreakpoint';
    return msg;
  }

  private async removeXHRBreakpoint(msg: any): Promise<any> {
    msg.method = 'DOM.removeURLBreakpoint';
    return msg;
  }

  private async setEventListenerBreakpoint(msg: any): Promise<any> {
    let params: Protocol.DOMDebugger.SetEventListenerBreakpointRequest = msg.params;

    msg.method = 'DOM.setEventBreakpoint';
    msg.params = {
      eventName: params.eventName,
      breakpointType: 'listener',
    };

    return msg;
  }

  private async removeEventListenerBreakpoint(msg: any): Promise<any> {
    let params: Protocol.DOMDebugger.RemoveEventListenerBreakpointRequest = msg.params;

    msg.method = 'DOM.removeEventBreakpoint';
    msg.params = {
      eventName: params.eventName,
      breakpointType: 'listener',
    };

    return msg;
  }
}
