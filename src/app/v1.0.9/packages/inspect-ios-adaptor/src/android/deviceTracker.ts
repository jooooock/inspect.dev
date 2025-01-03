import { ADB } from './adb';
import { Device, PlatformType } from '../lib/models';
import { TrackedMap } from '../lib/trackedMap';
import { LoggerBase } from 'src/lib/logger';

export class DeviceTracker extends TrackedMap<Device> {
  private deviceList: Map<string, Device>;
  private discoveryInterval: number;
  private discoveryIntervalRef: NodeJS.Timeout;
  private isListening: boolean;
  logger: LoggerBase;
  adb: ADB;

  constructor(baseLogger: LoggerBase) {
    super();
    this.discoveryInterval = 1000;
    this.deviceList = new Map();
    this.logger = baseLogger.scope('DeviceTracker');
    this.adb = new ADB(baseLogger);
  }

  public get devices() {
    return this.values;
  }

  public async start() {
    this.logger.info('DeviceTracker.start');

    if (this.isListening) {
      throw new Error('DeviceTracker is already listening');
    }

    try {
      // await this.test();
      this.isListening = true;

      this.discoverDevices();
      this.discoveryIntervalRef = setInterval(this.discoverDevices.bind(this), this.discoveryInterval);
    } catch (err) {
      this.logger.error(`androidAdaptor.deviceTracker.start.error`, err);
    }
  }

  public async stop() {
    this.logger.info('DeviceTracker.stop');
    if (!this.discoveryIntervalRef) {
      return;
    }
    clearInterval(this.discoveryIntervalRef);

    this.isListening = false;
  }

  private async discoverDevices() {
    this.logger.info('DeviceTracker.discoverDevices');
    let adbDevices = await this.adb.devices();

    let newDevices = await Promise.all(
      adbDevices.map(async adbDevice => {
        let device: Device = {
          name: adbDevice.device,
          id: adbDevice.serial,
          platformVersion: '0',
          platformType: PlatformType.Android,
          type: 'device',
          isLocked: false,
          isPaired: true,
        };

        // Get android version
        device.platformVersion = (await this.adb.shell(device.id, 'getprop ro.build.version.release')).replace('\n', '');

        return device;
      }),
    );

    this.updateSet(newDevices);
  }
}
