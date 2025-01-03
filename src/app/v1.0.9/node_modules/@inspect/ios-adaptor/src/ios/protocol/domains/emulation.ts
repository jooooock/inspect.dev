import Protocol from 'devtools-protocol';
import { iOSProtocolAdaptor } from '../iOSProtocolAdapter';

export class Emulation {
  private protocolAdaptor: iOSProtocolAdaptor;

  // # Chromium APIs:
  // ## No mapping needed

  // ## Partial support, but needs mapping for 100% compat
  // Emulation.setUserAgentOverride
  // Emulation.setEmulatedMedia
  // Emulation.setDeviceMetricsOverride

  // ## Mapped
  // Emulation.canEmulate
  // Emulation.setScriptExecutionDisabled
  // Emulation.clearDeviceMetricsOverride

  // ## Not implemented
  // Emulation.setGeolocationOverride
  // Emulation.setTouchEmulationEnabled
  // Emulation.clearGeolocationOverride
  // Emulation.setDefaultBackgroundColorOverride

  constructor(protocolAdaptor: iOSProtocolAdaptor) {
    this.protocolAdaptor = protocolAdaptor;

    this.protocolAdaptor.addMessageFilter('tools::Emulation.canEmulate', this.onCanEmulate.bind(this));
    this.protocolAdaptor.addMessageFilter('tools::Emulation.setTouchEmulationEnabled', this.setTouchEmulationEnabled.bind(this));
    this.protocolAdaptor.addMessageFilter('tools::Emulation.setScriptExecutionDisabled', this.setScriptExecutionDisabled.bind(this));
    this.protocolAdaptor.addMessageFilter('tools::Emulation.setEmulatedMedia', this.setEmulatedMedia.bind(this));
    this.protocolAdaptor.addMessageFilter('tools::Emulation.setUserAgentOverride', this.setUserAgentOverride.bind(this));
    this.protocolAdaptor.addMessageFilter('tools::Emulation.setDeviceMetricsOverride', this.setDeviceMetricsOverride.bind(this));
    this.protocolAdaptor.addMessageFilter('tools::Emulation.clearDeviceMetricsOverride', this.clearDeviceMetricsOverride.bind(this));
  }

  private async onCanEmulate(msg: any): Promise<any> {
    const result = {
      result: true,
    };
    this.protocolAdaptor.fireResultToClient(msg.id, result);
    return null;
  }

  private async setUserAgentOverride(msg: any): Promise<any> {
    let params: Protocol.Emulation.SetUserAgentOverrideRequest = msg.params;

    let webkitParams = {
      value: params.userAgent,
    };

    msg.method = 'Emulation.overrideUserAgent';
    msg.params = webkitParams;

    return msg;
  }

  private async setEmulatedMedia(msg: any): Promise<any> {
    msg.method = 'Page.setEmulatedMedia';
    return msg;
  }

  private async setDeviceMetricsOverride(msg: any): Promise<any> {
    let params: Protocol.Emulation.SetDeviceMetricsOverrideRequest = msg.params;

    let webkitParams = {
      width: params.width,
      height: params.height,
    };

    msg.method = 'Page.setScreenSizeOverride';
    msg.params = webkitParams;

    return msg;
  }

  private async clearDeviceMetricsOverride(msg: any): Promise<any> {
    let webkitParams = {
      width: 0,
      height: 0,
    };

    msg.method = 'Page.setScreenSizeOverride';
    msg.params = webkitParams;

    return msg;
  }

  private async setScriptExecutionDisabled(msg: any): Promise<any> {
    let params: Protocol.Emulation.SetScriptExecutionDisabledRequest = msg.params;

    try {
      let webkitResults = await this.protocolAdaptor.makeRequest('Page.overrideSetting', {
        setting: 'ScriptEnabled',
        value: params.value,
      });
      this.protocolAdaptor.fireResultToClient(msg.id, webkitResults);

      return null;
    } catch (err) {
      this.protocolAdaptor.logger.error('setScriptExecutionDisabled.failed');
      return null;
    }
  }

  private async setTouchEmulationEnabled(msg: any): Promise<any> {
    msg.method = 'Page.setTouchEmulationEnabled';
    return msg;
  }
}
