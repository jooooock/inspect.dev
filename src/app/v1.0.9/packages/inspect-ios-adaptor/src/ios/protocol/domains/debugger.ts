import Protocol from 'devtools-protocol';
import { iOSProtocolAdaptor } from '../iOSProtocolAdapter';

export class Debugger {
  private protocolAdaptor: iOSProtocolAdaptor;

  // # Chromium APIs:

  // ## No mapping needed
  // Debugger.disable
  // Debugger.pause
  // Debugger.resume
  // Debugger.stepOut
  // Debugger.setBreakpointsActive
  // Debugger.evaluateOnCallFrame
  // Debugger.getScriptSource
  // Debugger.removeBreakpoint
  // Debugger.searchInContent
  // Debugger.setPauseOnExceptions

  // ## Partial support, but needs mapping for 100% compat
  // Debugger.stepInto
  // Debugger.stepOver
  // Debugger.continueToLocation

  // ## Mapped
  // Debugger.enable
  // Debugger.setAsyncCallStackDepth
  // Debugger.setBreakpoint
  // Debugger.setBreakpointByUrl

  // ## Not implemented
  // Debugger.getPossibleBreakpoints
  // Debugger.restartFrame
  // Debugger.setSkipAllPauses
  // Debugger.setVariableValue
  // Debugger.setScriptSource
  // Debugger.setInstrumentationBreakpoint

  constructor(protocolAdaptor: iOSProtocolAdaptor) {
    this.protocolAdaptor = protocolAdaptor;

    this.protocolAdaptor.addMessageFilter('tools::Debugger.canSetScriptSource', this.canSetScriptSource.bind(this));
    this.protocolAdaptor.addMessageFilter('tools::Debugger.setAsyncCallStackDepth', this.setAsyncCallStackDepth.bind(this));
    this.protocolAdaptor.addMessageFilter('tools::Debugger.setBreakpoint', this.setBreakpoint.bind(this));
    this.protocolAdaptor.addMessageFilter('tools::Debugger.setBreakpointByUrl', this.setBreakpointByUrl.bind(this));
    this.protocolAdaptor.addMessageFilter('tools::Debugger.enable', this.enable.bind(this));

    // Events
    this.protocolAdaptor.addMessageFilter('target::Debugger.scriptParsed', this.onScriptParsed.bind(this));
  }

  private async enable(msg: any): Promise<any> {
    try {
      this.protocolAdaptor.makeRequest('Debugger.enable', msg.params);

      this.protocolAdaptor.makeRequest('Debugger.setBreakpointsActive', {
        active: true,
      });

      this.protocolAdaptor.makeRequest('Debugger.setPauseOnDebuggerStatements', {
        enabled: true,
      });
    } catch (err) {
      this.protocolAdaptor.logger.error('Debugger.enable.failed');
    }

    return msg;
  }

  private async setAsyncCallStackDepth(msg: any): Promise<any> {
    msg.method = 'Debugger.setAsyncStackTraceDepth';
    return msg;
  }

  private async setBreakpoint(msg: any): Promise<any> {
    let params: Protocol.Debugger.SetBreakpointRequest = msg.params;

    let webkitParams = {
      location: params.location,
      options: {
        condition: params.condition,
      },
    };

    msg.params = webkitParams;
    return msg;
  }

  private async setBreakpointByUrl(msg: any): Promise<any> {
    let params: Protocol.Debugger.SetBreakpointByUrlRequest = msg.params;

    let webkitParams = {
      lineNumber: params.lineNumber,
      url: params.url,
      urlRegex: params.urlRegex,
      columnNumber: params.columnNumber,
      options: {
        condition: params.condition,
      },
    };

    msg.params = webkitParams;

    return msg;
  }

  private async onScriptParsed(msg: any): Promise<any> {
    this.protocolAdaptor.globalState.lastScriptEval = msg.params.scriptId;
    return Promise.resolve(msg);
  }

  private async canSetScriptSource(msg: any): Promise<any> {
    const result = {
      result: false,
    };

    this.protocolAdaptor.fireResultToClient(msg.id, result);
    return null;
  }
}
