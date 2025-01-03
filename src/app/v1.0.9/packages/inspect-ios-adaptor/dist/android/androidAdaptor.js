"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AndroidAdaptor = void 0;
const events_1 = require("events");
const lodash_1 = __importDefault(require("lodash"));
const ws_1 = __importDefault(require("ws"));
const androidBridge_1 = require("./androidBridge");
const deviceTracker_1 = require("./deviceTracker");
const appTracker_1 = require("./appTracker");
const targetTracker_1 = require("./targetTracker");
class AndroidAdaptor extends events_1.EventEmitter {
    constructor(options) {
        super();
        this.baseLogger = options.baseLogger;
        this.logger = options.baseLogger.scope('AndroidAdaptor');
        this.androidBridge = new androidBridge_1.AndroidBridge(this.baseLogger);
        this.deviceTracker = new deviceTracker_1.DeviceTracker(this.baseLogger);
        this.activeWebSocket = null;
        this.appTrackers = new Map();
        this.targetTrackers = new Map();
        this.deviceTracker.on('add', this.onDeviceAdded.bind(this));
        this.deviceTracker.on('remove', this.onDeviceRemoved.bind(this));
        this.deviceTracker.on('change', this.onDeviceChanged.bind(this));
        this.onAppAdded = this.onAppAdded.bind(this);
        this.onAppRemoved = this.onAppRemoved.bind(this);
        this.onAppChanged = this.onAppChanged.bind(this);
        this.onTargetAdded = this.onTargetAdded.bind(this);
        this.onTargetRemoved = this.onTargetRemoved.bind(this);
        this.onTargetChanged = this.onTargetChanged.bind(this);
    }
    async getDevices() {
        // Creates a snapshot of the devices with apps and targets
        let formattedDevices = Array.from(this.deviceTracker.devices).map(device => {
            let snapshotDevice = lodash_1.default.clone(device);
            let deviceTracker = this.appTrackers.get(snapshotDevice.id);
            if (deviceTracker) {
                snapshotDevice.apps = Array.from(deviceTracker.apps).map(app => {
                    let snapshotApp = lodash_1.default.clone(app);
                    let targetTracker = this.targetTrackers.get(snapshotApp.id);
                    if (targetTracker) {
                        snapshotApp.targets = Array.from(targetTracker.values);
                    }
                    return snapshotApp;
                });
            }
            return snapshotDevice;
        });
        return Promise.resolve(formattedDevices);
    }
    async selectTarget(targetId) {
        this.logger.info('AndroidAdaptor.selectTarget', targetId);
        try {
            let [device, app, target] = await this.getTargetById(targetId);
            this.activeTargetId = targetId;
            this.connectToTarget(this.activeTargetId);
        }
        catch (err) {
            this.logger.error('AndroidAdaptor.selectTarget.error', err);
        }
    }
    async unselectActiveTarget() {
        var _a;
        if (!this.activeTargetId) {
            return;
        }
        this.activeTargetId = null;
        (_a = this.activeWebSocket) === null || _a === void 0 ? void 0 : _a.close();
        this.activeWebSocket = null;
    }
    async sendToActiveTarget(msg) {
        var _a;
        (_a = this.activeWebSocket) === null || _a === void 0 ? void 0 : _a.send(JSON.stringify(msg));
    }
    async unselectTarget(targetId) {
        // TODO
    }
    async highlightTarget(targetId) {
        // Not supported on Android
        return true;
    }
    async unhighlightTarget(targetId) {
        // Not supported on Android
        return true;
    }
    refreshTargets() {
        this.emit('change');
    }
    async start() {
        this.logger.info('AndroidAdaptor.start', '');
        try {
            await this.test();
            this.deviceTracker.start();
        }
        catch (error) {
            this.logger.error('AndroidAdaptor.start.error', error);
        }
    }
    async stop() {
        // Debuggers
        this.androidBridge.unforwardAllDebuggers();
        // Devices
        this.deviceTracker.stop();
        // Apps
        this.appTrackers.forEach(appTracker => {
            appTracker.stop();
        });
        this.appTrackers.clear();
        // Targets
        this.targetTrackers.forEach(targetTracker => {
            targetTracker.stop();
        });
        this.targetTrackers.clear();
    }
    async test() {
        this.logger.info('AndroidAdaptor.test');
        await this.androidBridge.test();
    }
    async getTargetById(targetId) {
        let [deviceId, appId, pageId] = targetId.split('|');
        let devices = await this.getDevices();
        let device = lodash_1.default.findLast(devices, { id: deviceId });
        if (device) {
            let app = lodash_1.default.findLast(device.apps, { id: appId });
            if (app) {
                let page = lodash_1.default.findLast(app.targets, { pageId: Number(pageId) });
                if (page) {
                    return [device, app, page];
                }
            }
        }
        return [null, null, null];
    }
    async onDeviceAdded(device) {
        this.logger.info('AndroidAdaptor.onDeviceAdded', device);
        // Start app tracker for device
        let appTracker = new appTracker_1.AppTracker(device.id, this.androidBridge, this.baseLogger);
        appTracker.on('add', this.onAppAdded.bind(this));
        appTracker.on('remove', this.onAppRemoved.bind(this));
        appTracker.on('change', this.onAppChanged.bind(this));
        appTracker.start();
        this.appTrackers.set(device.id, appTracker);
        this.emit('change');
    }
    async onDeviceRemoved(device) {
        this.logger.info('AndroidAdaptor.onDeviceRemoved', device);
        // Stop apps fetcher for device
        let tracker = this.appTrackers.get(device.id);
        if (tracker) {
            tracker.stop();
            this.appTrackers.delete(device.id);
        }
        this.emit('change');
    }
    async onDeviceChanged(device) {
        this.logger.info('AndroidAdaptor.onDeviceChanged', device);
        this.emit('change');
    }
    async onAppAdded(app) {
        this.logger.info('AndroidAdaptor.onAppAdded', app);
        // Start target tracker for app
        let targetTracker = new targetTracker_1.TargetTracker(app.deviceId, app.id, this.androidBridge, this.baseLogger);
        targetTracker.on('add', this.onTargetAdded.bind(this));
        targetTracker.on('remove', this.onTargetRemoved.bind(this));
        targetTracker.on('change', this.onTargetChanged.bind(this));
        targetTracker.start();
        this.targetTrackers.set(app.id, targetTracker);
        this.emit('change');
    }
    async onAppRemoved(app) {
        this.logger.info('AndroidAdaptor.onAppRemoved', app);
        // Stop tracker for app
        let tracker = this.targetTrackers.get(app.id);
        if (tracker) {
            tracker.stop();
            this.targetTrackers.delete(app.id);
        }
        this.emit('change');
    }
    async onAppChanged(oldApp, newApp) {
        this.logger.info('AndroidAdaptor.onAppChanged', newApp);
        this.emit('change');
    }
    async onTargetAdded(target) {
        this.logger.info('AndroidAdaptor.onTargetAdded', target);
        this.emit('change');
    }
    async onTargetChanged(oldTarget, newTarget) {
        this.logger.info('AndroidAdaptor.onTargetChanged', newTarget);
        this.emit('change');
    }
    async onTargetRemoved(target) {
        this.logger.info('AndroidAdaptor.onTargetRemoved', target);
        this.emit('change');
    }
    async connectToTarget(targetId) {
        this.logger.info('AndroidAdaptor.connectToActiveTarget', targetId);
        try {
            let [device, app, target] = await this.getTargetById(targetId);
            this.activeWebSocket = new ws_1.default(target.socket);
            this.activeWebSocket.on('message', data => {
                this.emit('messageFromTarget', JSON.parse(data));
            });
            this.activeWebSocket.on('error', err => {
                this.logger.error('AndroidAdaptor.connectToActiveTarget.activeWebSocket.error', err);
            });
        }
        catch (err) {
            this.logger.error('AndroidAdaptor.connectToActiveTarget.error', err);
        }
    }
}
exports.AndroidAdaptor = AndroidAdaptor;
//# sourceMappingURL=androidAdaptor.js.map