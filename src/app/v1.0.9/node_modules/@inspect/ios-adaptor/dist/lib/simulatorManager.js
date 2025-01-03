"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimulatorManager = void 0;
const execa_1 = __importDefault(require("execa"));
const node_simctl_1 = __importDefault(require("node-simctl"));
const lodash_1 = __importDefault(require("lodash"));
const models_1 = require("./models");
class SimulatorManager {
    constructor(logger) {
        this.shouldAbort = false;
        this.simctl = new node_simctl_1.default();
        this.logger = logger.scope('SimulatorManager');
    }
    async getSimulators() {
        if (process.platform !== 'darwin') {
            this.shouldAbort = true;
        }
        if (this.shouldAbort) {
            return [];
        }
        try {
            let devices = await this.simctl.getDevices();
            devices = lodash_1.default.flatten(lodash_1.default.values(devices));
            let runningDevices = lodash_1.default.filter(devices, sim => {
                let state = sim.state.toLowerCase();
                return state === 'booted';
            });
            let mappedDevices = await Promise.all(lodash_1.default.map(runningDevices, async (sim) => {
                let deviceSocket = await this.getSocketForSimulator(sim.udid);
                let device = {
                    id: sim.udid,
                    name: `Simulator (${sim.name})`,
                    platformVersion: sim.sdk,
                    platformType: models_1.PlatformType.iOS,
                    type: 'simulator',
                    socket: deviceSocket,
                    isLocked: false,
                    isPaired: true,
                };
                return device;
            }));
            return mappedDevices;
        }
        catch (err) {
            this.shouldAbort = true;
            this.logger.error(`SimulatorManager.getSimulators.err, err=${err}`);
            return [];
        }
    }
    async getSocketForSimulator(id) {
        try {
            let { stdout } = await (0, execa_1.default)('lsof', ['-aUc', 'launchd_sim']);
            for (let record of stdout.split('com.apple.CoreSimulator.SimDevice.')) {
                if (!record.includes(id)) {
                    continue;
                }
                const match = /\s+(\S+com\.apple\.webinspectord_sim\.socket)/.exec(record);
                if (!match) {
                    return null;
                }
                return match[1];
            }
        }
        catch (err) {
            this.logger.error(`SimulatorManager.getSocketForSimulator.err, err=${err}`);
        }
    }
}
exports.SimulatorManager = SimulatorManager;
//# sourceMappingURL=simulatorManager.js.map