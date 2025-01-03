import { Device } from './lib/models';
import { EventEmitter } from 'events';

import { AndroidAdaptor } from './android/androidAdaptor';
import { IOSAdaptor } from './ios/iosAdaptor';
import { DefaultLogger } from './lib/logger';

type DeviceAdaptorOptions = {
  customLogger?: Object;
};

export class DeviceAdaptor extends EventEmitter {
  androidAdaptor: AndroidAdaptor;
  iosAdaptor: IOSAdaptor;
  baseLogger: any;

  constructor(options?: DeviceAdaptorOptions) {
    super();

    if (options?.customLogger) {
      this.baseLogger = options.customLogger;
    } else {
      this.baseLogger = new DefaultLogger();
    }

    this.androidAdaptor = new AndroidAdaptor({ baseLogger: this.baseLogger });
    this.iosAdaptor = new IOSAdaptor({ baseLogger: this.baseLogger });

    // Map contexts
    this.onMessageFromTarget = this.onMessageFromTarget.bind(this);
    this.onAppChange = this.onAppChange.bind(this);

    // Events
    this.iosAdaptor.on('change', this.onAppChange);
    this.androidAdaptor.on('change', this.onAppChange);

    this.iosAdaptor.on('messageFromTarget', this.onMessageFromTarget);
    this.androidAdaptor.on('messageFromTarget', this.onMessageFromTarget);
  }

  public async getDevices(): Promise<Device[]> {
    let iosDevices = await this.iosAdaptor.getDevices();
    let androidDevices = await this.androidAdaptor.getDevices();

    return [].concat(iosDevices).concat(androidDevices);
  }

  public async unselectTarget(targetId: string) {
    await this.iosAdaptor.unselectTarget(targetId);
    await this.androidAdaptor.unselectTarget(targetId);
  }

  public async unselectActiveTarget() {
    await this.iosAdaptor.unselectActiveTarget();
    await this.androidAdaptor.unselectActiveTarget();
  }

  public async selectTarget(targetId: string) {
    await this.iosAdaptor.selectTarget(targetId);
    await this.androidAdaptor.selectTarget(targetId);
  }

  public async sendToActiveTarget(msg: any) {
    await this.iosAdaptor.sendToActiveTarget(msg);
    await this.androidAdaptor.sendToActiveTarget(msg);
  }

  public async highlightTarget(targetId: string) {
    await this.iosAdaptor.highlightTarget(targetId);
    await this.androidAdaptor.highlightTarget(targetId);
  }

  public async unhighlightTarget(targetId: string) {
    await this.iosAdaptor.unhighlightTarget(targetId);
    await this.androidAdaptor.unhighlightTarget(targetId);
  }

  public refreshTargets() {
    this.iosAdaptor.refreshTargets();
    this.androidAdaptor.refreshTargets();
  }

  public async start() {
    await this.iosAdaptor.start();
    await this.androidAdaptor.start();
  }

  public async stop() {
    await this.iosAdaptor.stop();
    await this.androidAdaptor.stop();
  }

  // Private

  private onAppChange() {
    this.emit('change');
  }

  private onMessageFromTarget(msg: any) {
    this.emit('messageFromTarget', msg);
  }
}
