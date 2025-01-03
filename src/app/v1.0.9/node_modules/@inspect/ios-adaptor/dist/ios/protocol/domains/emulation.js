"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Emulation = void 0;
class Emulation {
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
    constructor(protocolAdaptor) {
        this.protocolAdaptor = protocolAdaptor;
        this.protocolAdaptor.addMessageFilter('tools::Emulation.canEmulate', this.onCanEmulate.bind(this));
        this.protocolAdaptor.addMessageFilter('tools::Emulation.setTouchEmulationEnabled', this.setTouchEmulationEnabled.bind(this));
        this.protocolAdaptor.addMessageFilter('tools::Emulation.setScriptExecutionDisabled', this.setScriptExecutionDisabled.bind(this));
        this.protocolAdaptor.addMessageFilter('tools::Emulation.setEmulatedMedia', this.setEmulatedMedia.bind(this));
        this.protocolAdaptor.addMessageFilter('tools::Emulation.setUserAgentOverride', this.setUserAgentOverride.bind(this));
        this.protocolAdaptor.addMessageFilter('tools::Emulation.setDeviceMetricsOverride', this.setDeviceMetricsOverride.bind(this));
        this.protocolAdaptor.addMessageFilter('tools::Emulation.clearDeviceMetricsOverride', this.clearDeviceMetricsOverride.bind(this));
    }
    async onCanEmulate(msg) {
        const result = {
            result: true,
        };
        this.protocolAdaptor.fireResultToClient(msg.id, result);
        return null;
    }
    async setUserAgentOverride(msg) {
        let params = msg.params;
        let webkitParams = {
            value: params.userAgent,
        };
        msg.method = 'Emulation.overrideUserAgent';
        msg.params = webkitParams;
        return msg;
    }
    async setEmulatedMedia(msg) {
        msg.method = 'Page.setEmulatedMedia';
        return msg;
    }
    async setDeviceMetricsOverride(msg) {
        let params = msg.params;
        let webkitParams = {
            width: params.width,
            height: params.height,
        };
        msg.method = 'Page.setScreenSizeOverride';
        msg.params = webkitParams;
        return msg;
    }
    async clearDeviceMetricsOverride(msg) {
        let webkitParams = {
            width: 0,
            height: 0,
        };
        msg.method = 'Page.setScreenSizeOverride';
        msg.params = webkitParams;
        return msg;
    }
    async setScriptExecutionDisabled(msg) {
        let params = msg.params;
        try {
            let webkitResults = await this.protocolAdaptor.makeRequest('Page.overrideSetting', {
                setting: 'ScriptEnabled',
                value: params.value,
            });
            this.protocolAdaptor.fireResultToClient(msg.id, webkitResults);
            return null;
        }
        catch (err) {
            this.protocolAdaptor.logger.error('setScriptExecutionDisabled.failed');
            return null;
        }
    }
    async setTouchEmulationEnabled(msg) {
        msg.method = 'Page.setTouchEmulationEnabled';
        return msg;
    }
}
exports.Emulation = Emulation;
//# sourceMappingURL=emulation.js.map