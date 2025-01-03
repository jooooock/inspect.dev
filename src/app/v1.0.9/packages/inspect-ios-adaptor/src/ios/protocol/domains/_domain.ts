import Protocol from 'devtools-protocol';
import { iOSProtocolAdaptor } from '../iOSProtocolAdapter';

export class Domain {
  private adaptor: iOSProtocolAdaptor;

  // # Chromium APIs:

  // ## No mapping needed

  // ## Partial support, but needs mapping for 100% compat

  // ## Mapped

  // ## Not implemented

  constructor(protocolAdaptor: iOSProtocolAdaptor) {
    this.adaptor = protocolAdaptor;
  }
}
