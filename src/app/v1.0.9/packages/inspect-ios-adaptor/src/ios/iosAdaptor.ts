import { WebinspectorDebugger } from './webinspector/webinspectorDebugger';
import { App, Device, PlatformType, Target } from '../lib/models';
import { utilities } from 'appium-ios-device';
import { EventEmitter } from 'events';
import { SimulatorManager } from '../lib/simulatorManager';
import _ from 'lodash';
import { URL } from 'url';
import { LoggerBase } from 'src/lib/logger';

type IOSAdaptorOptions = {
  baseLogger: LoggerBase;
};

class IOSAdaptor extends EventEmitter {
  private deviceList: Map<string, Device>;
  private deviceDebuggers: Map<string, WebinspectorDebugger>;
  private discoveryIntervalRef: NodeJS.Timeout;
  private discoveryInterval: number;
  private simulatorManager: SimulatorManager;
  private logger: LoggerBase;
  private baseLogger: LoggerBase;
  activeTargetId: string;
  activeTargetOrigin: string;
  isListening: boolean;

  constructor(options: IOSAdaptorOptions) {
    super();
    this.baseLogger = options.baseLogger;
    this.logger = options.baseLogger.scope('IOSAdaptor');

    this.deviceList = new Map();
    this.deviceDebuggers = new Map();
    this.simulatorManager = new SimulatorManager(this.baseLogger);
    this.activeTargetId = null;
    this.activeTargetOrigin = null;
    this.isListening = false;
    this.discoveryInterval = 5000;
    this.onMessageFromTarget = this.onMessageFromTarget.bind(this);
  }

  public async getDevices(): Promise<Device[]> {
    let devices = Array.from(this.deviceList.values());

    devices.forEach(device => {
      let deviceDebugger = this.deviceDebuggers.get(device.id);
      if (deviceDebugger) {
        device.apps = Array.from(deviceDebugger.apps.values());
      }
    });

    return Promise.resolve(devices);
  }

  public async unselectTarget(targetId: string) {
    let [device, app, page] = await this.getTargetById(targetId);
    if (!device || !app || !page) {
      return;
    }

    let deviceDebugger = this.deviceDebuggers.get(device.id);
    await deviceDebugger?.unselectPage(app.id, page.pageId);
  }

  public async unselectActiveTarget() {
    if (this.activeTargetId) {
      await this.unselectTarget(this.activeTargetId);
      this.activeTargetId = null;
      this.activeTargetOrigin = null;
    }
  }

  public async selectTarget(targetId: string) {
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
      this.activeTargetOrigin = new URL(page.url).origin;
    }

    let deviceDebugger = this.deviceDebuggers.get(device.id);
    await deviceDebugger.selectPage(app.id, page.pageId, page.type);
  }

  public async sendToActiveTarget(msg: any) {
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

  public async highlightTarget(targetId: string) {
    let [device, app, page] = await this.getTargetById(targetId);
    if (!device || !app || !page) {
      return;
    }

    let deviceDebugger = this.deviceDebuggers.get(device.id);
    return await deviceDebugger.highlight(app.id, page.pageId);
  }

  public async unhighlightTarget(targetId: string) {
    let [device, app, page] = await this.getTargetById(targetId);
    if (!device || !app || !page) {
      return;
    }

    let deviceDebugger = this.deviceDebuggers.get(device.id);
    return await deviceDebugger.unhighlight(app.id, page.pageId);
  }

  public refreshTargets() {
    this.emit('change');
  }

  public async start() {
    if (this.isListening) {
      throw new Error('IOSAdaptor is already listening');
    }

    this.isListening = true;

    this.discoverTargets();
    this.startTargetDiscovery();
  }

  public async stop() {
    this.stopTargetDiscovery();
    this.isListening = false;
  }

  public async getTargetById(targetId: string): Promise<[Device, App, Target]> {
    let [deviceId, appId, pageId] = targetId.split('|');

    let devices = await this.getDevices();
    let device = _.findLast(devices, { id: deviceId });
    if (device) {
      let app = _.findLast(device.apps, { id: appId });
      if (app) {
        let page = _.findLast(app.targets, { pageId: Number(pageId) });
        if (page) {
          return [device, app, page];
        }
      }
    }

    return [null, null, null];
  }

  private async startTargetDiscovery() {
    this.discoveryIntervalRef = setInterval(this.discoverTargets.bind(this), this.discoveryInterval);
  }

  private async stopTargetDiscovery() {
    if (!this.discoveryIntervalRef) {
      return;
    }
    clearInterval(this.discoveryIntervalRef);
  }

  private async discoverTargets() {
    // Simulators
    let simulatorDevices = await this.simulatorManager.getSimulators();
    this.handleSimulators(simulatorDevices);

    // Devices
    let deviceIds = await utilities.getConnectedDevices();
    await this.handleDevices(deviceIds);
  }

  private async handleSimulators(simulatorDevices: Device[]) {
    if (!simulatorDevices || !simulatorDevices.length) {
      this.cleanUpOldSimulators(simulatorDevices);
      return;
    }

    for (const simulatorDevice of simulatorDevices) {
      if (this.deviceDebuggers.has(simulatorDevice.id)) {
        continue;
      }

      let simulatorDebugger = new WebinspectorDebugger({
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

  private async handleDevices(deviceIds: any) {
    for (const deviceId of deviceIds) {
      // TODO: Optimize this into one lockdoen session instead of multiple
      let deviceName = await utilities.getDeviceName(deviceId);
      let OSVersion = await utilities.getOSVersion(deviceId);
      let isPasswordProtected = false;
      let isPaired = false;

      try {
        const lockdown = await utilities.startLockdownSession(deviceId);
        isPasswordProtected = await lockdown.getValue({ Key: 'PasswordProtected' });
        isPaired = true;
      } catch (error) {
        if (error.message.indexOf('Could not find a pair record') > -1) {
          isPaired = false;
        }
      }

      let device = {
        type: 'device',
        id: deviceId,
        name: deviceName,
        platformVersion: OSVersion,
        platformType: PlatformType.iOS,
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

      let deviceDebugger = new WebinspectorDebugger({
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

  private cleanUpOldDevices(devicesList: any) {
    this.deviceList.forEach(device => {
      if (device.type === 'device') {
        if (!devicesList.includes(device.id)) {
          this.deviceList.delete(device.id);
          this.deviceDebuggers.delete(device.id);
        }
      }
    });
  }

  private cleanUpOldSimulators(simulatorDevices: Device[]) {
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

  private async onPageChange() {
    this.emit('change');

    if (this.activeTargetId) {
      let [device, app, newActiveTarget] = await this.getTargetById(this.activeTargetId);

      if (newActiveTarget.url) {
        // Some targets like webviews don't have urls;
        let newOrigin = new URL(newActiveTarget.url).origin;

        if (this.activeTargetOrigin !== newOrigin) {
          this.emit('activeTargetOriginChange');
        }
      }

      this.selectTarget(this.activeTargetId);
    }
  }

  private onAppChange() {
    this.emit('change');
  }

  private onMessageFromTarget(msg: any) {
    this.emit('messageFromTarget', msg);
  }
}

export { IOSAdaptor };
