import Protocol from 'devtools-protocol';
import { iOSProtocolAdaptor } from '../../iOSProtocolAdapter';
const interval = require('interval-promise');

export class ScreencastSession {
  private adaptor: iOSProtocolAdaptor;
  private frameId: number;
  private framesAcked: boolean[];
  private isLoopRunning: boolean;
  private shouldExitLoop: boolean;
  private frameInterval: number = 63; // 1000ms/16 = 62.5 ~ 63ms
  private maxWidth: number;
  private maxHeight: number;
  private deviceWidth: number;
  private deviceHeight: number;
  private offsetTop: number;
  private scrollOffsetX: number;
  private scrollOffsetY: number;
  perfObserver: any;

  constructor(adaptor: iOSProtocolAdaptor, maxWidth?: number, maxHeight?: number) {
    this.adaptor = adaptor;
    this.maxHeight = maxHeight || 1024;
    this.maxWidth = maxWidth || 1024;
    this.isLoopRunning = false;
  }

  public async start(): Promise<void> {
    this.framesAcked = new Array();
    this.frameId = 1;

    let evaluateReq = await this.adaptor.makeRequest('Runtime.evaluate', {
      expression: '(window.innerWidth > 0 ? window.innerWidth : screen.width) + "," + (window.innerHeight > 0 ? window.innerHeight : screen.height)',
    });

    if (!evaluateReq) {
      return;
    }

    if (!evaluateReq.result) {
      return;
    }

    const parts = evaluateReq.result.value.split(',');
    this.deviceWidth = parseInt(parts[0], 10);
    this.deviceHeight = parseInt(parts[1], 10);

    this.startLoop();
  }

  public stop(): void {
    this.shouldExitLoop = true;
  }

  public ackFrame(frameNumber: number): void {
    this.framesAcked[frameNumber] = true;
  }

  private startLoop() {
    if (this.isLoopRunning) {
      return;
    }

    this.isLoopRunning = true;
    this.shouldExitLoop = false;

    interval(async (iteration, stop) => {
      if (this.shouldExitLoop) {
        stop();
        this.isLoopRunning = false;
        this.shouldExitLoop = false;
      }
      await this.generateFrame();
    }, this.frameInterval);
  }

  private async getViewportOffsets(): Promise<void> {
    let offsetsReq: any = await this.adaptor.makeRequest('Runtime.evaluate', {
      expression: 'window.document.body.offsetTop + "," + window.pageXOffset + "," + window.pageYOffset',
    });

    if (!offsetsReq) {
      return Promise.reject('Runtime.evaluate failed.');
    }

    if (!offsetsReq.result) {
      return Promise.reject('Runtime.evaluate failed. No results');
    }

    const parts = offsetsReq.result.value.split(',');
    this.offsetTop = parseInt(parts[0], 10);
    this.scrollOffsetX = parseInt(parts[1], 10);
    this.scrollOffsetY = parseInt(parts[2], 10);
  }

  private async grabScreenframe(): Promise<string> {
    try {
      // performance.mark('grabScreenframe.start');

      let snapshotReq: any = await this.adaptor.makeRequest('Page.snapshotRect', {
        x: 0,
        y: 0,
        width: this.deviceWidth,
        height: this.deviceHeight,
        coordinateSystem: 'Viewport',
      });

      if (!snapshotReq) {
        return Promise.reject('Page.snapshotRect failed');
      }

      const prefix = 'data:image/png;base64,';
      let imageBuffer = Buffer.from(snapshotReq.dataURL.substr(prefix.length), 'base64');

      // Resize image to fix max dimensions (expensive operation)
      let resizedImageBuffer = imageBuffer;

      return resizedImageBuffer.toString('base64');
    } catch (error) {
      this.adaptor.logger.info('grabScreenframe.failed', error);
    }
  }

  private async generateFrame(): Promise<void> {
    this.adaptor.logger.info('generateFrame', '');
    const currentFrame = this.frameId;

    // if (currentFrame > 1 && !this.framesAcked[currentFrame - 1]) {
    //   return;
    // }

    this.frameId++;

    try {
      let [resizedBase64Image] = await Promise.all([this.grabScreenframe(), this.getViewportOffsets()]);

      // Send frame
      const frame: Protocol.Page.ScreencastFrameEvent = {
        data: resizedBase64Image,
        metadata: {
          pageScaleFactor: 1,
          offsetTop: this.offsetTop,
          deviceWidth: this.deviceWidth,
          deviceHeight: this.deviceHeight,
          scrollOffsetX: this.scrollOffsetX,
          scrollOffsetY: this.scrollOffsetY,
          timestamp: Math.floor(+new Date() / 1000),
        },
        sessionId: currentFrame,
      };

      this.adaptor.fireEventToClient('Page.screencastFrame', frame);
    } catch (error) {
      this.adaptor.logger.error('ScreencastSession.generateFrame.error', error);
    }
  }
}
