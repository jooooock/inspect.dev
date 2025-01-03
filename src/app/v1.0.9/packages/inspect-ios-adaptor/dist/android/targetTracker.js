"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TargetTracker = void 0;
const trackedMap_1 = require("../lib/trackedMap");
class TargetTracker extends trackedMap_1.TrackedMap {
    constructor(deviceId, appId, androidBridge, baseLogger) {
        super();
        this.deviceId = deviceId;
        this.appId = appId;
        this.androidBridge = androidBridge;
        this.logger = baseLogger.scope('TargetTracker');
        this.discoveryInterval = 1000;
    }
    get apps() {
        return this.values;
    }
    async start() {
        this.logger.info('TargetTracker.start');
        if (this.isListening) {
            throw new Error('Abort. Already listening');
        }
        try {
            this.isListening = true;
            this.discoverTargets();
            this.discoveryIntervalRef = setInterval(this.discoverTargets.bind(this), this.discoveryInterval);
        }
        catch (err) {
            this.logger.error(`targetTracker.start.error`, err);
        }
    }
    async stop() {
        this.logger.info('TargetTracker.stop');
        if (!this.discoveryIntervalRef) {
            return;
        }
        clearInterval(this.discoveryIntervalRef);
        this.androidBridge.unforwardDebuggersForDevice(this.deviceId);
        this.isListening = false;
    }
    async discoverTargets() {
        this.logger.info('TargetTracker.discoverTargets');
        let port = await this.androidBridge.forwardDebugger(this.deviceId, this.appId);
        let pageTargets = await this.androidBridge.getWebViewPages(port);
        let targets = pageTargets.map(page => {
            let pageTarget = {
                id: `${this.deviceId}|${this.appId}|${page.id}`,
                appId: this.appId,
                deviceId: this.deviceId,
                pageId: Number(page.id),
                title: page.title || 'untitled',
                url: page.url,
                type: page.type,
                socket: page.webSocketDebuggerUrl,
                isDebuggable: page.webSocketDebuggerUrl ? true : false,
            };
            return pageTarget;
        });
        this.updateSet(targets);
    }
}
exports.TargetTracker = TargetTracker;
//# sourceMappingURL=targetTracker.js.map