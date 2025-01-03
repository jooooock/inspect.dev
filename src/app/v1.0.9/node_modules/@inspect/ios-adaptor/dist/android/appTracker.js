"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppTracker = void 0;
const trackedMap_1 = require("../lib/trackedMap");
class AppTracker extends trackedMap_1.TrackedMap {
    constructor(deviceId, androidBridge, baseLogger) {
        super();
        this.deviceId = deviceId;
        this.androidBridge = androidBridge;
        this.logger = baseLogger.scope('AppTracker');
        this.discoveryInterval = 1000;
    }
    get apps() {
        return this.values;
    }
    async start() {
        this.logger.info('AppTracker.start');
        if (this.isListening) {
            throw new Error('Abort. Already listening');
        }
        try {
            this.isListening = true;
            this.discoverApps();
            this.discoveryIntervalRef = setInterval(this.discoverApps.bind(this), this.discoveryInterval);
        }
        catch (err) {
            this.logger.error(`appTracker.start.error`, err);
        }
    }
    async stop() {
        this.logger.info('AppTracker.stop');
        if (!this.discoveryIntervalRef) {
            return;
        }
        clearInterval(this.discoveryIntervalRef);
        this.isListening = false;
    }
    async discoverApps() {
        this.logger.info('AppTracker.discoverApps');
        let webViews = await this.androidBridge.findWebViews(this.deviceId);
        let apps = webViews.map(webview => {
            let app = {
                id: webview.socket,
                bundleId: webview.socket,
                hostId: webview.socket,
                name: webview.packageName,
                isProxy: false,
                isActive: true,
                targets: [],
                deviceId: this.deviceId,
            };
            return app;
        });
        this.updateSet(apps);
    }
}
exports.AppTracker = AppTracker;
//# sourceMappingURL=appTracker.js.map