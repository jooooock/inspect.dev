import { EventEmitter } from 'events';
import { App, Device, Target } from '../lib/models';
import _ from 'lodash';
import WebSocket from 'ws';

import { AndroidBridge } from './androidBridge';
import { DeviceTracker } from './deviceTracker';
import { AppTracker } from './appTracker';
import { TargetTracker } from './targetTracker';
import { LoggerBase } from 'src/lib/logger';

type AndroidAdaptorOptions = {
  baseLogger: LoggerBase;
};

export class AndroidAdaptor extends EventEmitter {
  private deviceTracker: DeviceTracker;
  activeTargetId: string;
  activeWebSocket: WebSocket;
  androidBridge: AndroidBridge;
  appTrackers: Map<string, AppTracker>;
  targetTrackers: Map<string, TargetTracker>;
  baseLogger: LoggerBase;
  logger: LoggerBase;

  constructor(options: AndroidAdaptorOptions) {
    super();
    this.baseLogger = options.baseLogger;
    this.logger = options.baseLogger.scope('AndroidAdaptor');

    this.androidBridge = new AndroidBridge(this.baseLogger);
    this.deviceTracker = new DeviceTracker(this.baseLogger);
    this.activeWebSocket = null;
    this.appTrackers = new Map();
    this.targetTrackers = new Map();

    this.deviceTracker.on('add', this.onDeviceAdded.bind(this));
    this.deviceTracker.on('remove', this.onDeviceRemoved.bind(this));
    this.deviceTracker.on('change', this.onDeviceChanged.bind(this));

    this.onAppAdded = this.onAppAdded.bind(this);
    this.onAppRemoved = this.onAppRemoved.bind(this);
    this.onAppChanged = this.onAppChanged.bind(this);

    this.onTargetAdded = this.onTargetAdded.bind(this);
    this.onTargetRemoved = this.onTargetRemoved.bind(this);
    this.onTargetChanged = this.onTargetChanged.bind(this);
  }

  public async getDevices(): Promise<Device[]> {
    // Creates a snapshot of the devices with apps and targets

    let formattedDevices = Array.from(this.deviceTracker.devices).map(device => {
      let snapshotDevice = _.clone(device);

      let deviceTracker = this.appTrackers.get(snapshotDevice.id);
      if (deviceTracker) {
        snapshotDevice.apps = Array.from(deviceTracker.apps).map(app => {
          let snapshotApp = _.clone(app);

          let targetTracker = this.targetTrackers.get(snapshotApp.id);
          if (targetTracker) {
            snapshotApp.targets = Array.from(targetTracker.values);
          }
          return snapshotApp;
        });
      }
      return snapshotDevice;
    });

    return Promise.resolve(formattedDevices);
  }

  public async selectTarget(targetId: string) {
    this.logger.info('AndroidAdaptor.selectTarget', targetId);

    try {
      let [device, app, target] = await this.getTargetById(targetId);
      this.activeTargetId = targetId;
      this.connectToTarget(this.activeTargetId);
    } catch (err) {
      this.logger.error('AndroidAdaptor.selectTarget.error', err);
    }
  }

  public async unselectActiveTarget() {
    if (!this.activeTargetId) {
      return;
    }

    this.activeTargetId = null;
    this.activeWebSocket?.close();
    this.activeWebSocket = null;
  }

  public async sendToActiveTarget(msg: any) {
    this.activeWebSocket?.send(JSON.stringify(msg));
  }

  public async unselectTarget(targetId: string) {
    // TODO
  }

  public async highlightTarget(targetId: string) {
    // Not supported on Android
    return true;
  }

  public async unhighlightTarget(targetId: string) {
    // Not supported on Android
    return true;
  }

  public refreshTargets() {
    this.emit('change');
  }

  public async start() {
    this.logger.info('AndroidAdaptor.start', '');
    try {
      await this.test();
      this.deviceTracker.start();
    } catch (error) {
      this.logger.error('AndroidAdaptor.start.error', error);
    }
  }

  public async stop() {
    // Debuggers
    this.androidBridge.unforwardAllDebuggers();

    // Devices
    this.deviceTracker.stop();

    // Apps
    this.appTrackers.forEach(appTracker => {
      appTracker.stop();
    });
    this.appTrackers.clear();

    // Targets
    this.targetTrackers.forEach(targetTracker => {
      targetTracker.stop();
    });
    this.targetTrackers.clear();
  }

  public async test(): Promise<void> {
    this.logger.info('AndroidAdaptor.test');
    await this.androidBridge.test();
  }

  private async getTargetById(targetId: string): Promise<[Device, App, Target]> {
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

  private async onDeviceAdded(device: Device) {
    this.logger.info('AndroidAdaptor.onDeviceAdded', device);
    // Start app tracker for device
    let appTracker = new AppTracker(device.id, this.androidBridge, this.baseLogger);
    appTracker.on('add', this.onAppAdded.bind(this));
    appTracker.on('remove', this.onAppRemoved.bind(this));
    appTracker.on('change', this.onAppChanged.bind(this));
    appTracker.start();

    this.appTrackers.set(device.id, appTracker);

    this.emit('change');
  }

  private async onDeviceRemoved(device: Device) {
    this.logger.info('AndroidAdaptor.onDeviceRemoved', device);
    // Stop apps fetcher for device
    let tracker = this.appTrackers.get(device.id);
    if (tracker) {
      tracker.stop();
      this.appTrackers.delete(device.id);
    }

    this.emit('change');
  }

  private async onDeviceChanged(device: Device) {
    this.logger.info('AndroidAdaptor.onDeviceChanged', device);
    this.emit('change');
  }

  private async onAppAdded(app: App) {
    this.logger.info('AndroidAdaptor.onAppAdded', app);
    // Start target tracker for app
    let targetTracker = new TargetTracker(app.deviceId, app.id, this.androidBridge, this.baseLogger);
    targetTracker.on('add', this.onTargetAdded.bind(this));
    targetTracker.on('remove', this.onTargetRemoved.bind(this));
    targetTracker.on('change', this.onTargetChanged.bind(this));
    targetTracker.start();
    this.targetTrackers.set(app.id, targetTracker);
    this.emit('change');
  }

  private async onAppRemoved(app: App) {
    this.logger.info('AndroidAdaptor.onAppRemoved', app);
    // Stop tracker for app
    let tracker = this.targetTrackers.get(app.id);
    if (tracker) {
      tracker.stop();
      this.targetTrackers.delete(app.id);
    }

    this.emit('change');
  }

  private async onAppChanged(oldApp: App, newApp: App) {
    this.logger.info('AndroidAdaptor.onAppChanged', newApp);
    this.emit('change');
  }

  private async onTargetAdded(target) {
    this.logger.info('AndroidAdaptor.onTargetAdded', target);
    this.emit('change');
  }

  private async onTargetChanged(oldTarget: Target, newTarget: Target) {
    this.logger.info('AndroidAdaptor.onTargetChanged', newTarget);
    this.emit('change');
  }

  private async onTargetRemoved(target) {
    this.logger.info('AndroidAdaptor.onTargetRemoved', target);
    this.emit('change');
  }

  private async connectToTarget(targetId: string) {
    this.logger.info('AndroidAdaptor.connectToActiveTarget', targetId);
    try {
      let [device, app, target] = await this.getTargetById(targetId);
      this.activeWebSocket = new WebSocket(target.socket);

      this.activeWebSocket.on('message', data => {
        this.emit('messageFromTarget', JSON.parse(data));
      });

      this.activeWebSocket.on('error', err => {
        this.logger.error('AndroidAdaptor.connectToActiveTarget.activeWebSocket.error', err);
      });
    } catch (err) {
      this.logger.error('AndroidAdaptor.connectToActiveTarget.error', err);
    }
  }
}
