import Protocol from 'devtools-protocol';
import { iOSProtocolAdaptor } from '../iOSProtocolAdapter';

export class Log {
  private protocolAdaptor: iOSProtocolAdaptor;

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

  constructor(protocolAdaptor: iOSProtocolAdaptor) {
    this.protocolAdaptor = protocolAdaptor;

    this.protocolAdaptor.addMessageFilter('tools::Log.clear', this.clear.bind(this));
    this.protocolAdaptor.addMessageFilter('tools::Log.disable', this.disable.bind(this));
    this.protocolAdaptor.addMessageFilter('tools::Log.enable', this.enable.bind(this));
  }

  private async clear(msg: any): Promise<any> {
    msg.method = 'Console.clearMessages';
    return msg;
  }

  private async disable(msg: any): Promise<any> {
    msg.method = 'Console.disable';
    return msg;
  }

  private async enable(msg: any): Promise<any> {
    msg.method = 'Console.enable';
    return msg;
  }
}
