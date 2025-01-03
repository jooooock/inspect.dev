import Protocol from 'devtools-protocol';
import { iOSProtocolAdaptor } from '../iOSProtocolAdapter';

export class Browser {
  private protocolAdaptor: iOSProtocolAdaptor;

  // # Chromium APIs:
  // https://chromedevtools.github.io/devtools-protocol/1-3/Browser/

  // ## No mapping needed

  // ## Partial support, but needs mapping for 100% compat

  // ## Mapped
  // - Browser.getVersion

  // ## Not implemented
  // - Browser.close

  constructor(protocolAdaptor: iOSProtocolAdaptor) {
    this.protocolAdaptor = protocolAdaptor;

    this.protocolAdaptor.addMessageFilter('tools::Browser.getVersion', this.getVersion.bind(this));
  }

  private async getVersion(msg: any): Promise<any> {
    let webkitResult = await this.protocolAdaptor.makeRequest('Runtime.evaluate', {
      expression: 'navigator',
    });

    let result = {
      protocolVersion: '1.3',
      product: webkitResult.product,
      revision: webkitResult.appVersion,
      userAgent: webkitResult.userAgent,
      jsVersion: '',
    };

    this.protocolAdaptor.fireResultToClient(msg.id, result);
    return null;
  }
}
