import { Target } from '../lib/models';
import { AndroidBridge } from './androidBridge';
import { TrackedMap } from '../lib/trackedMap';
import { LoggerBase } from 'src/lib/logger';

export class TargetTracker extends TrackedMap<Target> {
  private discoveryInterval: number;
  private discoveryIntervalRef: NodeJS.Timeout;
  private isListening: boolean;
  private deviceId: string;
  private appId: string;
  private androidBridge: AndroidBridge;
  logger: LoggerBase;

  constructor(deviceId: string, appId: string, androidBridge: AndroidBridge, baseLogger: LoggerBase) {
    super();
    this.deviceId = deviceId;
    this.appId = appId;
    this.androidBridge = androidBridge;
    this.logger = baseLogger.scope('TargetTracker');

    this.discoveryInterval = 1000;
  }

  public get apps() {
    return this.values;
  }

  public async start() {
    this.logger.info('TargetTracker.start');

    if (this.isListening) {
      throw new Error('Abort. Already listening');
    }

    try {
      this.isListening = true;

      this.discoverTargets();
      this.discoveryIntervalRef = setInterval(this.discoverTargets.bind(this), this.discoveryInterval);
    } catch (err) {
      this.logger.error(`targetTracker.start.error`, err);
    }
  }

  public async stop() {
    this.logger.info('TargetTracker.stop');
    if (!this.discoveryIntervalRef) {
      return;
    }
    clearInterval(this.discoveryIntervalRef);
    this.androidBridge.unforwardDebuggersForDevice(this.deviceId);
    this.isListening = false;
  }

  private async discoverTargets() {
    this.logger.info('TargetTracker.discoverTargets');
    let port = await this.androidBridge.forwardDebugger(this.deviceId, this.appId);
    let pageTargets = await this.androidBridge.getWebViewPages(port);

    let targets = pageTargets.map(page => {
      let pageTarget: Target = {
        id: `${this.deviceId}|${this.appId}|${page.id}`,
        appId: this.appId,
        deviceId: this.deviceId,
        pageId: Number(page.id),
        title: page.title || 'untitled',
        url: page.url,
        type: page.type,
        socket: page.webSocketDebuggerUrl,
        isDebuggable: page.webSocketDebuggerUrl ? true : false,
      };
      return pageTarget;
    });

    this.updateSet(targets);
  }
}
