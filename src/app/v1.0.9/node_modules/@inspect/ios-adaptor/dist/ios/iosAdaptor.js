"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IOSAdaptor = void 0;
const webinspectorDebugger_1 = require("./webinspector/webinspectorDebugger");
const models_1 = require("../lib/models");
const appium_ios_device_1 = require("appium-ios-device");
const events_1 = require("events");
const simulatorManager_1 = require("../lib/simulatorManager");
const lodash_1 = __importDefault(require("lodash"));
const url_1 = require("url");
class IOSAdaptor extends events_1.EventEmitter {
    constructor(options) {
        super();
        this.baseLogger = options.baseLogger;
        this.logger = options.baseLogger.scope('IOSAdaptor');
        this.deviceList = new Map();
        this.deviceDebuggers = new Map();
        this.simulatorManager = new simulatorManager_1.SimulatorManager(this.baseLogger);
        this.activeTargetId = null;
        this.activeTargetOrigin = null;
        this.isListening = false;
        this.discoveryInterval = 5000;
        this.onMessageFromTarget = this.onMessageFromTarget.bind(this);
    }
    async getDevices() {
        let devices = Array.from(this.deviceList.values());
        devices.forEach(device => {
            let deviceDebugger = this.deviceDebuggers.get(device.id);
            if (deviceDebugger) {
                device.apps = Array.from(deviceDebugger.apps.values());
            }
        });
        return Promise.resolve(devices);
    }
    async unselectTarget(targetId) {
        let [device, app, page] = await this.getTargetById(targetId);
        if (!device || !app || !page) {
            return;
        }
        let deviceDebugger = this.deviceDebuggers.get(device.id);
        await (deviceDebugger === null || deviceDebugger === void 0 ? void 0 : deviceDebugger.unselectPage(app.id, page.pageId));
    }
    async unselectActiveTarget() {
        if (this.activeTargetId) {
            await this.unselectTarget(this.activeTargetId);
            this.activeTargetId = null;
            this.activeTargetOrigin = null;
        }
    }
    async selectTarget(targetId) {
        this.logger.info('IOSAdaptor.selectTarget', targetId);
        if (this.activeTargetId && this.activeTargetId === targetId) {
            //  Don't try to select active target again
            return;
        }
        let [device, app, page] = await this.getTargetById(targetId);
        if (!device || !app || !page) {
            return;
        }
        await this.unselectActiveTarget();
        this.activeTargetId = page.id;
        if (page.url) {
            // Some targets like webviews don't have urls;
            this.activeTargetOrigin = new url_1.URL(page.url).origin;
        }
        let deviceDebugger = this.deviceDebuggers.get(device.id);
        await deviceDebugger.selectPage(app.id, page.pageId, page.type);
    }
    async sendToActiveTarget(msg) {
        if (!this.activeTargetId) {
            return;
        }
        let [device, app, page] = await this.getTargetById(this.activeTargetId);
        if (!device) {
            return;
        }
        let deviceDebugger = this.deviceDebuggers.get(device.id);
        deviceDebugger.sendMessageToTarget(msg);
    }
    async highlightTarget(targetId) {
        let [device, app, page] = await this.getTargetById(targetId);
        if (!device || !app || !page) {
            return;
        }
        let deviceDebugger = this.deviceDebuggers.get(device.id);
        return await deviceDebugger.highlight(app.id, page.pageId);
    }
    async unhighlightTarget(targetId) {
        let [device, app, page] = await this.getTargetById(targetId);
        if (!device || !app || !page) {
            return;
        }
        let deviceDebugger = this.deviceDebuggers.get(device.id);
        return await deviceDebugger.unhighlight(app.id, page.pageId);
    }
    refreshTargets() {
        this.emit('change');
    }
    async start() {
        if (this.isListening) {
            throw new Error('IOSAdaptor is already listening');
        }
        this.isListening = true;
        this.discoverTargets();
        this.startTargetDiscovery();
    }
    async stop() {
        this.stopTargetDiscovery();
        this.isListening = false;
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
    async startTargetDiscovery() {
        this.discoveryIntervalRef = setInterval(this.discoverTargets.bind(this), this.discoveryInterval);
    }
    async stopTargetDiscovery() {
        if (!this.discoveryIntervalRef) {
            return;
        }
        clearInterval(this.discoveryIntervalRef);
    }
    async discoverTargets() {
        // Simulators
        let simulatorDevices = await this.simulatorManager.getSimulators();
        this.handleSimulators(simulatorDevices);
        // Devices
        let deviceIds = await appium_ios_device_1.utilities.getConnectedDevices();
        await this.handleDevices(deviceIds);
    }
    async handleSimulators(simulatorDevices) {
        if (!simulatorDevices || !simulatorDevices.length) {
            this.cleanUpOldSimulators(simulatorDevices);
            return;
        }
        for (const simulatorDevice of simulatorDevices) {
            if (this.deviceDebuggers.has(simulatorDevice.id)) {
                continue;
            }
            let simulatorDebugger = new webinspectorDebugger_1.WebinspectorDebugger({
                baseLogger: this.baseLogger,
                deviceId: simulatorDevice.id,
                socketPath: simulatorDevice.socket,
                platformVersion: simulatorDevice.platformVersion,
            });
            this.deviceDebuggers.set(simulatorDevice.id, simulatorDebugger);
            this.deviceList.set(simulatorDevice.id, simulatorDevice);
            await simulatorDebugger.connect();
            await simulatorDebugger.getConnectedApplications();
            simulatorDebugger.on('appChange', this.onAppChange.bind(this));
            simulatorDebugger.on('pageChange', this.onPageChange.bind(this));
            simulatorDebugger.on('messageFromTarget', this.onMessageFromTarget.bind(this));
        }
        this.cleanUpOldSimulators(simulatorDevices);
    }
    async handleDevices(deviceIds) {
        for (const deviceId of deviceIds) {
            // TODO: Optimize this into one lockdoen session instead of multiple
            let deviceName = await appium_ios_device_1.utilities.getDeviceName(deviceId);
            let OSVersion = await appium_ios_device_1.utilities.getOSVersion(deviceId);
            let isPasswordProtected = false;
            let isPaired = false;
            try {
                const lockdown = await appium_ios_device_1.utilities.startLockdownSession(deviceId);
                isPasswordProtected = await lockdown.getValue({ Key: 'PasswordProtected' });
                isPaired = true;
            }
            catch (error) {
                if (error.message.indexOf('Could not find a pair record') > -1) {
                    isPaired = false;
                }
            }
            let device = {
                type: 'device',
                id: deviceId,
                name: deviceName,
                platformVersion: OSVersion,
                platformType: models_1.PlatformType.iOS,
                isLocked: isPasswordProtected,
                isPaired: isPaired,
            };
            this.deviceList.set(deviceId, device);
            this.cleanUpOldDevices(deviceIds);
            this.refreshTargets();
            if (device.isPaired === false) {
                // Don't try to setup WebinspectorDebugger if device isn't parired.
                continue;
            }
            if (this.deviceDebuggers.has(device.id)) {
                // Bail if WebinspectorDebugger is already there
                continue;
            }
            let deviceDebugger = new webinspectorDebugger_1.WebinspectorDebugger({
                deviceId: device.id,
                platformVersion: OSVersion,
                baseLogger: this.baseLogger,
            });
            this.deviceDebuggers.set(deviceId, deviceDebugger);
            await deviceDebugger.connect();
            await deviceDebugger.getConnectedApplications();
            deviceDebugger.on('appChange', this.onAppChange.bind(this));
            deviceDebugger.on('pageChange', this.onPageChange.bind(this));
            deviceDebugger.on('messageFromTarget', this.onMessageFromTarget.bind(this));
        }
    }
    cleanUpOldDevices(devicesList) {
        this.deviceList.forEach(device => {
            if (device.type === 'device') {
                if (!devicesList.includes(device.id)) {
                    this.deviceList.delete(device.id);
                    this.deviceDebuggers.delete(device.id);
                }
            }
        });
    }
    cleanUpOldSimulators(simulatorDevices) {
        let simulatorIds = simulatorDevices.map(device => {
            return device.id;
        });
        this.deviceList.forEach(device => {
            if (device.type === 'simulator') {
                if (!simulatorIds.includes(device.id)) {
                    this.deviceList.delete(device.id);
                    this.deviceDebuggers.delete(device.id);
                }
            }
        });
    }
    async onPageChange() {
        this.emit('change');
        if (this.activeTargetId) {
            let [device, app, newActiveTarget] = await this.getTargetById(this.activeTargetId);
            if (newActiveTarget.url) {
                // Some targets like webviews don't have urls;
                let newOrigin = new url_1.URL(newActiveTarget.url).origin;
                if (this.activeTargetOrigin !== newOrigin) {
                    this.emit('activeTargetOriginChange');
                }
            }
            this.selectTarget(this.activeTargetId);
        }
    }
    onAppChange() {
        this.emit('change');
    }
    onMessageFromTarget(msg) {
        this.emit('messageFromTarget', msg);
    }
}
exports.IOSAdaptor = IOSAdaptor;
//# sourceMappingURL=iosAdaptor.js.map