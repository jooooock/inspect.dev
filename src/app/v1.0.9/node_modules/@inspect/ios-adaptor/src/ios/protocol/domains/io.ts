import Protocol from 'devtools-protocol';
import { iOSProtocolAdaptor } from '../iOSProtocolAdapter';

export class IO {
  private protocolAdaptor: iOSProtocolAdaptor;
  private cache: Map<string, any>;

  // # Chromium APIs:
  // https://chromedevtools.github.io/devtools-protocol/tot/IO/

  // ## No mapping needed

  // ## Mapped
  // - IO.close
  // - IO.read

  // ## Not implemented
  // - IO.resolveBlob

  constructor(protocolAdaptor: iOSProtocolAdaptor) {
    this.protocolAdaptor = protocolAdaptor;
    this.cache = this.protocolAdaptor.globalState.IOcache;

    this.protocolAdaptor.addMessageFilter('tools::IO.close', this.close.bind(this));
    this.protocolAdaptor.addMessageFilter('tools::IO.read', this.read.bind(this));
  }

  private async close(msg: any): Promise<any> {
    this.cache.delete(msg.params.handle);

    this.protocolAdaptor.fireResultToClient(msg.id, {});

    return null;
  }

  private async read(msg: any): Promise<any> {
    let data = this.cache.get(msg.params.handle);

    if (data) {
      let response: Protocol.IO.ReadResponse = {
        data: data,
        eof: false,
        base64Encoded: false,
      };

      this.protocolAdaptor.fireResultToClient(msg.id, response);
      this.cache.delete(msg.params.handle);
    } else {
      let response: Protocol.IO.ReadResponse = {
        data: null,
        eof: true,
        base64Encoded: false,
      };
      this.protocolAdaptor.fireResultToClient(msg.id, response);
    }

    return null;
  }
}
