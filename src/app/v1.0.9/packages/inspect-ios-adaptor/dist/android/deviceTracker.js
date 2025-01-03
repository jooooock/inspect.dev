"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceTracker = void 0;
const adb_1 = require("./adb");
const models_1 = require("../lib/models");
const trackedMap_1 = require("../lib/trackedMap");
class DeviceTracker extends trackedMap_1.TrackedMap {
    constructor(baseLogger) {
        super();
        this.discoveryInterval = 1000;
        this.deviceList = new Map();
        this.logger = baseLogger.scope('DeviceTracker');
        this.adb = new adb_1.ADB(baseLogger);
    }
    get devices() {
        return this.values;
    }
    async start() {
        this.logger.info('DeviceTracker.start');
        if (this.isListening) {
            throw new Error('DeviceTracker is already listening');
        }
        try {
            // await this.test();
            this.isListening = true;
            this.discoverDevices();
            this.discoveryIntervalRef = setInterval(this.discoverDevices.bind(this), this.discoveryInterval);
        }
        catch (err) {
            this.logger.error(`androidAdaptor.deviceTracker.start.error`, err);
        }
    }
    async stop() {
        this.logger.info('DeviceTracker.stop');
        if (!this.discoveryIntervalRef) {
            return;
        }
        clearInterval(this.discoveryIntervalRef);
        this.isListening = false;
    }
    async discoverDevices() {
        this.logger.info('DeviceTracker.discoverDevices');
        let adbDevices = await this.adb.devices();
        let newDevices = await Promise.all(adbDevices.map(async (adbDevice) => {
            let device = {
                name: adbDevice.device,
                id: adbDevice.serial,
                platformVersion: '0',
                platformType: models_1.PlatformType.Android,
                type: 'device',
                isLocked: false,
                isPaired: true,
            };
            // Get android version
            device.platformVersion = (await this.adb.shell(device.id, 'getprop ro.build.version.release')).replace('\n', '');
            return device;
        }));
        this.updateSet(newDevices);
    }
}
exports.DeviceTracker = DeviceTracker;
//# sourceMappingURL=deviceTracker.js.map