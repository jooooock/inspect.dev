"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ADB = void 0;
const execa_1 = __importDefault(require("execa"));
class ADB {
    constructor(baseLogger) {
        this.logger = baseLogger.scope('ADB');
    }
    async run(...args) {
        try {
            let { stdout } = await (0, execa_1.default)('adb', [...args]);
            return stdout;
        }
        catch (error) {
            this.logger.info('adb.error', error);
            throw error;
        }
    }
    async version() {
        return await this.run('version');
    }
    async devices() {
        const output = await this.run('devices', '-l');
        this.logger.info('adb.devices.output', output);
        const result = [];
        const regex = /^([a-zA-Z0-9_-]+(?:\s?[\.a-zA-Z0-9_-]+)?(?:\:\d{1,})?)\s+(device|connecting|offline|unknown|bootloader|recovery|download|unauthorized|host|no permissions)(?:\s+usb:([^:]+))?(?:\s+product:([^:]+))?(?:\s+model\:([\S]+))?(?:\s+device\:([\S]+))?(?:\s+features:([^:]+))?(?:\s+transport_id:([^:]+))?$/gim;
        let match;
        while ((match = regex.exec(output)) !== null) {
            result.push({
                serial: match[1],
                state: match[2],
                usb: match[3],
                product: match[4],
                model: match[5],
                device: match[6],
                features: match[7],
                transportId: match[8],
            });
        }
        return result;
    }
    async shell(serial, command) {
        return await this.run('-s', serial, 'shell', command);
    }
    async forward(serial, local, remote) {
        const output = await this.run('-s', serial, 'forward', local, remote);
        if (local === 'tcp:0') {
            return {
                local: `tcp:${parseInt(output.trim(), 10)}`,
                remote: remote,
            };
        }
        else {
            return {
                local: local,
                remote: remote,
            };
        }
    }
    async unforward(local) {
        await this.run('forward', '--remove', local);
    }
}
exports.ADB = ADB;
//# sourceMappingURL=adb.js.map