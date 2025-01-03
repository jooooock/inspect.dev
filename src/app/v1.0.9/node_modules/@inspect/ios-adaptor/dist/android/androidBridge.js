"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AndroidBridge = void 0;
const portfinder_1 = __importDefault(require("portfinder"));
const http_1 = require("http");
const adb_1 = require("./adb");
class AndroidBridge {
    constructor(baseLogger) {
        this.forwardedSockets = new Map();
        this.logger = baseLogger.scope('AndroidBridge');
        this.adb = new adb_1.ADB(baseLogger);
    }
    async test() {
        this.logger.info('AndroidBridge.test');
        try {
            await this.adb.version();
        }
        catch (err) {
            this.logger.info('AndroidBridge.test.error', err);
            if ((err === null || err === void 0 ? void 0 : err.code) === 'ENOENT') {
                throw new Error('Failed to locate ADB executable.');
            }
            throw err;
        }
    }
    async getProcesses(serial) {
        this.logger.info('AndroidBridge.getProcesses');
        const output = await this.adb.shell(serial, 'ps');
        /**
         * Parse 'ps' output which on Android looks like this:
         *
         * USER       PID  PPID      VSZ     RSS  WCHAN  ADDR  S  NAME
         * root         1     0    24128    1752  0         0  S  init
         * u0_a100  22100  1307  1959228  128504  0         0  S  com.android.chrome
         */
        const result = [];
        for (const line of output.split(/[\r\n]+/g)) {
            const columns = line.split(/\s+/g);
            if (columns.length < 9) {
                continue;
            }
            const pid = parseInt(columns[1], 10);
            if (isNaN(pid)) {
                continue;
            }
            result.push({
                pid: pid,
                name: columns[8],
            });
        }
        return result;
    }
    async getSockets(serial) {
        this.logger.info('AndroidBridge.getSockets');
        const output = await this.adb.shell(serial, 'cat /proc/net/unix');
        /**
         * Parse 'cat /proc/net/unix' output which on Android looks like this:
         *
         * Num               RefCount Protocol Flags    Type St Inode Path
         * 0000000000000000: 00000002 00000000 00010000 0001 01 27955 /data/fpc/oem
         * 0000000000000000: 00000002 00000000 00010000 0001 01  3072 @chrome_devtools_remote
         *
         * We need to find records with paths starting from '@' (abstract socket)
         * and containing the channel pattern ("_devtools_remote").
         */
        const result = [];
        for (const line of output.split(/[\r\n]+/g)) {
            const columns = line.split(/\s+/g);
            if (columns.length < 8) {
                continue;
            }
            if (columns[3] !== '00010000' || columns[5] !== '01') {
                continue;
            }
            const colPath = columns[7];
            if (!colPath.startsWith('@') || !colPath.includes('_devtools_remote')) {
                continue;
            }
            result.push(colPath.substr(1));
        }
        return result;
    }
    async getPackages(serial) {
        this.logger.info('AndroidBridge.getPackages');
        const output = await this.adb.shell(serial, 'dumpsys package packages');
        /**
         * Parse 'dumpsys package packages' output which on Android looks like this:
         *
         * Packages:
         *   Package [com.android.chrome] (76d4737):
         *     userId=10100
         *     pkg=Package{3e86c27 com.android.chrome}
         *     codePath=/data/app/com.android.chrome-MMpc6mFfM3KpEYJ7RaZaTA==
         *     resourcePath=/data/app/com.android.chrome-MMpc6mFfM3KpEYJ7RaZaTA==
         *     legacyNativeLibraryDir=/data/app/com.android.chrome-MMpc6mFfM3KpEYJ7RaZaTA==/lib
         *     primaryCpuAbi=armeabi-v7a
         *     secondaryCpuAbi=arm64-v8a
         *     versionCode=344009152 minSdk=24 targetSdk=28
         *     versionName=68.0.3440.91
         */
        const result = [];
        let packageName;
        for (const line of output.split(/[\r\n]+/g)) {
            const columns = line.trim().split(/\s+/g);
            if (!packageName) {
                if (columns[0] === 'Package') {
                    packageName = columns[1].substring(1, columns[1].length - 1);
                }
            }
            else {
                if (columns[0].startsWith('versionName=')) {
                    result.push({
                        packageName: packageName,
                        versionName: columns[0].substr(12),
                    });
                    packageName = undefined;
                }
            }
        }
        return result;
    }
    async findWebViews(deviceId) {
        this.logger.info('AndroidBridge.findWebViews');
        // Inspiration: https://source.chromium.org/chromium/chromium/src/+/main:chrome/browser/devtools/device/android_device_info_query.cc?q=_devtools_remote&ss=chromium
        const [sockets, processes, packages] = await Promise.all([this.getSockets(deviceId), this.getProcesses(deviceId), this.getPackages(deviceId)]);
        const result = [];
        for (const socket of sockets) {
            let type;
            let packageName;
            let versionName;
            if (socket === 'chrome_devtools_remote') {
                type = 'chrome';
                packageName = 'Google Chrome';
            }
            else if (socket.startsWith('webview_devtools_remote_')) {
                type = 'webview';
                const pid = parseInt(socket.substr(24), 10);
                if (!isNaN(pid)) {
                    const process = processes.find(el => el.pid === pid);
                    if (process) {
                        packageName = process.name;
                    }
                }
            }
            else if (socket.endsWith('_devtools_remote')) {
                type = 'crosswalk';
                packageName = socket.substring(0, socket.length - 16) || undefined;
            }
            else {
                type = 'unknown';
            }
            if (packageName) {
                const aPackage = packages.find(el => el.packageName === packageName);
                if (aPackage) {
                    versionName = aPackage.versionName;
                }
            }
            result.push({
                deviceId: deviceId,
                socket: socket,
                type: type,
                packageName: packageName,
                versionName: versionName,
            });
        }
        return result;
    }
    async forwardDebugger(deviceId, webViewSocket, port) {
        let openDeviceSockets = this.forwardedSockets.get(deviceId) || [];
        const idx = openDeviceSockets.findIndex(el => el.remote === `localabstract:${webViewSocket}`);
        if (idx >= 0) {
            let existingSocket = openDeviceSockets[idx];
            return parseInt(existingSocket.local.substr(4), 10);
        }
        let localPort = await portfinder_1.default.getPortPromise({
            port: 4000,
            stopPort: 5000,
        });
        const socket = await this.adb.forward(deviceId, `tcp:${localPort}`, `localabstract:${webViewSocket}`);
        openDeviceSockets.push(socket);
        this.forwardedSockets.set(deviceId, openDeviceSockets);
        return localPort;
    }
    async unforwardAllDebuggers() {
        const promises = [];
        let openSockets = Array.from(this.forwardedSockets.values());
        openSockets.forEach(sockets => {
            for (const socket of sockets) {
                const promise = this.adb.unforward(socket.local);
                promises.push(promise.catch(() => {
                    /* Ignore */
                }));
            }
        });
        await Promise.all(promises);
        this.forwardedSockets.clear();
    }
    async unforwardDebuggersForDevice(deviceId) {
        const promises = [];
        let openDeviceSockets = this.forwardedSockets.get(deviceId);
        for (const socket of openDeviceSockets) {
            const promise = this.adb.unforward(socket.local);
            promises.push(promise.catch(() => {
                /* Ignore */
            }));
        }
        await Promise.all(promises);
        this.forwardedSockets.set(deviceId, []);
    }
    async getWebViewPages(port) {
        return JSON.parse(await get(`http://127.0.0.1:${port}/json/list`));
    }
}
exports.AndroidBridge = AndroidBridge;
function get(url) {
    return new Promise((resolve, reject) => {
        let data = '';
        const req = (0, http_1.request)(url, res => {
            res.on('data', chunk => {
                data += chunk;
            });
            res.on('error', reject);
            res.on('close', () => resolve(data));
        });
        req.on('error', reject);
        req.end();
    });
}
//# sourceMappingURL=androidBridge.js.map