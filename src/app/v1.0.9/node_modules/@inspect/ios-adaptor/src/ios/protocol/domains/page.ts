import Protocol from 'devtools-protocol';
import { ScreencastSession } from './utils/screencastSession';

import { iOSProtocolAdaptor } from '../iOSProtocolAdapter';

export class Page {
  private protocolAdaptor: iOSProtocolAdaptor;
  protected _screencastSession: ScreencastSession;

  // # Chromium APIs:
  // https://chromedevtools.github.io/devtools-protocol/1-3/Page/

  // ## No mapping needed
  // - Page.disable
  // - Page.enable
  // - Page.reload
  // - Page.navigate
  // - Page.captureScreenshot

  // ## Partial support, but limited see notes
  // - Page.getNavigationHistory

  // ## Mapped

  // ## Not implemented
  // - Page.navigateToHistoryEntry
  // - Page.printToPDF
  // - Page.removeScriptToEvaluateOnNewDocument
  // - Page.resetNavigationHistory
  // - Page.setDocumentContent
  // - Page.stopLoading
  // - Page.addScriptToEvaluateOnNewDocument
  // - Page.bringToFront
  // - Page.createIsolatedWorld
  // - Page.getAppManifest
  // - Page.getFrameTree
  // - Page.getLayoutMetrics
  // - Page.handleJavaScriptDialog

  constructor(protocolAdaptor: iOSProtocolAdaptor) {
    this.protocolAdaptor = protocolAdaptor;

    // Page
    this.protocolAdaptor.addMessageFilter('tools::Page.disable', this.disable.bind(this));
    this.protocolAdaptor.addMessageFilter('tools::Page.startScreencast', this.startScreencast.bind(this));
    this.protocolAdaptor.addMessageFilter('tools::Page.stopScreencast', this.stopScreencast.bind(this));
    this.protocolAdaptor.addMessageFilter('tools::Page.getNavigationHistory', this.getNavigationHistory.bind(this));
    this.protocolAdaptor.addMessageFilter('tools::Page.screencastFrameAck', this.onScreencastFrameAck.bind(this));
    this.protocolAdaptor.addMessageFilter('tools:: Page.captureScreenshot', this.onCaptureScreenshot.bind(this));
    // Events
  }

  private async disable(msg: any): Promise<any> {
    if (this._screencastSession) {
      this._screencastSession.stop();
      this._screencastSession = null;
    }
    return msg;
  }

  private async startScreencast(msg: any): Promise<any> {
    const format: string = msg.params.format;
    const quality: number = msg.params.quality;
    const maxWidth: number = msg.params.maxWidth;
    const maxHeight: number = msg.params.maxHeight;

    if (!this._screencastSession) {
      this._screencastSession = new ScreencastSession(this.protocolAdaptor, maxWidth, maxHeight);
    }

    this._screencastSession.start();
    this.protocolAdaptor.fireResultToClient(msg.id, {});
    return null;
  }

  private async onCaptureScreenshot(msg: any): Promise<any> {
    let params: Protocol.Page.CaptureScreenshotRequest = msg.params;

    let height = params.clip.height || null;
    let width = params.clip.width || null;
    let x = params.clip.x || 0;
    let y = params.clip.y || 0;

    if (!height || !width) {
      let evaluateReq = await this.protocolAdaptor.makeRequest('Runtime.evaluate', {
        expression: '(window.innerWidth > 0 ? window.innerWidth : screen.width) + "," + (window.innerHeight > 0 ? window.innerHeight : screen.height)',
      });

      if (!evaluateReq) {
        return;
      }

      if (!evaluateReq.result) {
        return Promise.reject('Page.snapshotRect failed to get dimensions');
      }

      const parts = evaluateReq.result.value.split(',');
      width = parseInt(parts[0], 10);
      height = parseInt(parts[1], 10);
    }

    let snapshotReq: any = await this.protocolAdaptor.makeRequest('Page.snapshotRect', {
      x: x,
      y: y,
      width: width,
      height: height,
      coordinateSystem: 'Viewport',
    });

    if (!snapshotReq) {
      return Promise.reject('Page.snapshotRect failed to grab screenshot');
    }

    const prefix = 'data:image/png;base64,';
    let imageBuffer = Buffer.from(snapshotReq.dataURL.substr(prefix.length), 'base64');

    let result: Protocol.Page.CaptureScreenshotResponse = {
      data: imageBuffer.toString('base64'),
    };

    this.protocolAdaptor.fireResultToClient(msg.id, result);

    return null;
  }

  private async stopScreencast(msg: any): Promise<any> {
    if (this._screencastSession) {
      this._screencastSession.stop();
    }

    this.protocolAdaptor.fireResultToClient(msg.id, {});
    return null;
  }

  private async onScreencastFrameAck(msg: any): Promise<any> {
    if (this._screencastSession) {
      const frameNumber: number = msg.params.sessionId;
      this._screencastSession.ackFrame(frameNumber);
    }

    this.protocolAdaptor.fireResultToClient(msg.id, {});
    return null;
  }

  private async getNavigationHistory(msg: any): Promise<any> {
    // Note: It's not possible to get the full page history, as window.history doesnt expose state for security reasons and haven't been able to find a matching webkit API for this.
    try {
      let historyRequest = await this.protocolAdaptor.makeRequest('Runtime.evaluate', {
        expression: 'window.location.href + "," + window.title',
      });

      if (!historyRequest || !historyRequest.result) {
        return null;
      }

      const parts = historyRequest.result.value.split(',');
      let locationHref = parts[0];
      let windowTitle = parts[1];

      let result: Protocol.Page.GetNavigationHistoryResponse = {
        currentIndex: 0,
        entries: [{ id: 0, url: locationHref, userTypedURL: locationHref, title: windowTitle, transitionType: 'link' }],
      };

      this.protocolAdaptor.fireResultToClient(msg.id, result);

      return null;
    } catch (err) {
      this.protocolAdaptor.logger.debug('getNavigationHistory.failed', err);
      return null;
    }
  }
}
