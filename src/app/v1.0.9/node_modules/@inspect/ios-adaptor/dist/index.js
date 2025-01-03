"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceAdaptor = void 0;
const events_1 = require("events");
const androidAdaptor_1 = require("./android/androidAdaptor");
const iosAdaptor_1 = require("./ios/iosAdaptor");
const logger_1 = require("./lib/logger");
class DeviceAdaptor extends events_1.EventEmitter {
    constructor(options) {
        super();
        if (options === null || options === void 0 ? void 0 : options.customLogger) {
            this.baseLogger = options.customLogger;
        }
        else {
            this.baseLogger = new logger_1.DefaultLogger();
        }
        this.androidAdaptor = new androidAdaptor_1.AndroidAdaptor({ baseLogger: this.baseLogger });
        this.iosAdaptor = new iosAdaptor_1.IOSAdaptor({ baseLogger: this.baseLogger });
        // Map contexts
        this.onMessageFromTarget = this.onMessageFromTarget.bind(this);
        this.onAppChange = this.onAppChange.bind(this);
        // Events
        this.iosAdaptor.on('change', this.onAppChange);
        this.androidAdaptor.on('change', this.onAppChange);
        this.iosAdaptor.on('messageFromTarget', this.onMessageFromTarget);
        this.androidAdaptor.on('messageFromTarget', this.onMessageFromTarget);
    }
    async getDevices() {
        let iosDevices = await this.iosAdaptor.getDevices();
        let androidDevices = await this.androidAdaptor.getDevices();
        return [].concat(iosDevices).concat(androidDevices);
    }
    async unselectTarget(targetId) {
        await this.iosAdaptor.unselectTarget(targetId);
        await this.androidAdaptor.unselectTarget(targetId);
    }
    async unselectActiveTarget() {
        await this.iosAdaptor.unselectActiveTarget();
        await this.androidAdaptor.unselectActiveTarget();
    }
    async selectTarget(targetId) {
        await this.iosAdaptor.selectTarget(targetId);
        await this.androidAdaptor.selectTarget(targetId);
    }
    async sendToActiveTarget(msg) {
        await this.iosAdaptor.sendToActiveTarget(msg);
        await this.androidAdaptor.sendToActiveTarget(msg);
    }
    async highlightTarget(targetId) {
        await this.iosAdaptor.highlightTarget(targetId);
        await this.androidAdaptor.highlightTarget(targetId);
    }
    async unhighlightTarget(targetId) {
        await this.iosAdaptor.unhighlightTarget(targetId);
        await this.androidAdaptor.unhighlightTarget(targetId);
    }
    refreshTargets() {
        this.iosAdaptor.refreshTargets();
        this.androidAdaptor.refreshTargets();
    }
    async start() {
        await this.iosAdaptor.start();
        await this.androidAdaptor.start();
    }
    async stop() {
        await this.iosAdaptor.stop();
        await this.androidAdaptor.stop();
    }
    // Private
    onAppChange() {
        this.emit('change');
    }
    onMessageFromTarget(msg) {
        this.emit('messageFromTarget', msg);
    }
}
exports.DeviceAdaptor = DeviceAdaptor;
//# sourceMappingURL=index.js.map