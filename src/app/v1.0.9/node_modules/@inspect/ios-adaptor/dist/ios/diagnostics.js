"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = __importDefault(require("fs/promises"));
const net_1 = __importDefault(require("net"));
const pTimeout_1 = __importDefault(require("../lib/pTimeout"));
const os_1 = __importDefault(require("os"));
const DEFAULT_USBMUXD_SOCKET = '/var/run/usbmuxd';
const DEFAULT_USBMUXD_PORT = 27015;
const DEFAULT_USBMUXD_HOST = '127.0.0.1';
class Diagnostics {
    constructor() { }
    async runDiagnostics() {
        let canConnectToUsbmuxd = await this.canConnectToUsbmuxd();
        let canDetectDevices = await this.canDetectDevices();
        let canDetectTargets = await this.canDetectTargets();
        return {
            canConnectToSimulator: false,
            canConnectToUsbmuxd: canConnectToUsbmuxd,
            canDetectDevices: canDetectDevices,
            canDetectTargets: canDetectTargets,
        };
    }
    async canConnectToUsbmuxd() {
        let socket;
        if (await promises_1.default.stat(DEFAULT_USBMUXD_SOCKET)) {
            socket = net_1.default.createConnection(DEFAULT_USBMUXD_SOCKET);
        }
        else if (process.platform === 'win32' || (process.platform === 'linux' && /microsoft/i.test(os_1.default.release()))) {
            socket = net_1.default.createConnection(DEFAULT_USBMUXD_PORT, DEFAULT_USBMUXD_HOST);
        }
        else {
            return false;
        }
        return await (0, pTimeout_1.default)(new Promise((resolve, reject) => {
            socket.once('error', reject.bind(null, false));
            socket.once('connect', () => resolve(true));
        }), {
            milliseconds: 5000,
        });
    }
    async canDetectDevices() {
        // Implement code to get battery level
        return false;
    }
    async canDetectTargets() {
        // Implement code to take a screenshot
        return false;
    }
}
//# sourceMappingURL=diagnostics.js.map