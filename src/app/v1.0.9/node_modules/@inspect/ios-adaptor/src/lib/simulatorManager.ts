import exec from 'execa';
import { LoggerBase } from './logger';
import Simctl from 'node-simctl';
import _ from 'lodash';
import { Device, PlatformType } from './models';

export class SimulatorManager {
  private shouldAbort: boolean;
  private simctl: Simctl;
  logger: LoggerBase;

  constructor(logger: LoggerBase) {
    this.shouldAbort = false;
    this.simctl = new Simctl();
    this.logger = logger.scope('SimulatorManager');
  }

  async getSimulators(): Promise<Device[]> {
    if (process.platform !== 'darwin') {
      this.shouldAbort = true;
    }

    if (this.shouldAbort) {
      return [];
    }

    try {
      let devices = await this.simctl.getDevices();
      devices = _.flatten(_.values(devices));

      let runningDevices = _.filter(devices, sim => {
        let state = sim.state.toLowerCase();
        return state === 'booted';
      });

      let mappedDevices = await Promise.all(
        _.map(runningDevices, async sim => {
          let deviceSocket = await this.getSocketForSimulator(sim.udid);
          let device: Device = {
            id: sim.udid,
            name: `Simulator (${sim.name})`,
            platformVersion: sim.sdk,
            platformType: PlatformType.iOS,
            type: 'simulator',
            socket: deviceSocket,
            isLocked: false,
            isPaired: true,
          };

          return device;
        }),
      );

      return mappedDevices;
    } catch (err) {
      this.shouldAbort = true;
      this.logger.error(`SimulatorManager.getSimulators.err, err=${err}`);
      return [];
    }
  }

  private async getSocketForSimulator(id: string): Promise<string> {
    try {
      let { stdout } = await exec('lsof', ['-aUc', 'launchd_sim']);

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
    } catch (err) {
      this.logger.error(`SimulatorManager.getSocketForSimulator.err, err=${err}`);
    }
  }
}
