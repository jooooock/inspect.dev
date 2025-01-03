import { App } from '../lib/models';
import { AndroidBridge } from './androidBridge';
import { TrackedMap } from '../lib/trackedMap';
import { LoggerBase } from 'src/lib/logger';

export class AppTracker extends TrackedMap<App> {
  private discoveryInterval: number;
  private discoveryIntervalRef: NodeJS.Timeout;
  private isListening: boolean;
  private deviceId: string;
  private androidBridge: AndroidBridge;
  logger: LoggerBase;

  constructor(deviceId: string, androidBridge: AndroidBridge, baseLogger: LoggerBase) {
    super();
    this.deviceId = deviceId;
    this.androidBridge = androidBridge;
    this.logger = baseLogger.scope('AppTracker');

    this.discoveryInterval = 1000;
  }

  public get apps() {
    return this.values;
  }

  public async start() {
    this.logger.info('AppTracker.start');
    if (this.isListening) {
      throw new Error('Abort. Already listening');
    }

    try {
      this.isListening = true;

      this.discoverApps();
      this.discoveryIntervalRef = setInterval(this.discoverApps.bind(this), this.discoveryInterval);
    } catch (err) {
      this.logger.error(`appTracker.start.error`, err);
    }
  }

  public async stop() {
    this.logger.info('AppTracker.stop');
    if (!this.discoveryIntervalRef) {
      return;
    }
    clearInterval(this.discoveryIntervalRef);
    this.isListening = false;
  }

  private async discoverApps() {
    this.logger.info('AppTracker.discoverApps');
    let webViews = await this.androidBridge.findWebViews(this.deviceId);

    let apps = webViews.map(webview => {
      let app: App = {
        id: webview.socket,
        bundleId: webview.socket,
        hostId: webview.socket,
        name: webview.packageName,
        isProxy: false,
        isActive: true,
        targets: [],
        deviceId: this.deviceId,
      };
      return app;
    });

    this.updateSet(apps);
  }
}
