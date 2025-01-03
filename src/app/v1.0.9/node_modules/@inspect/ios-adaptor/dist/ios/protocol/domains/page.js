"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Page = void 0;
const screencastSession_1 = require("./utils/screencastSession");
class Page {
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
    constructor(protocolAdaptor) {
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
    async disable(msg) {
        if (this._screencastSession) {
            this._screencastSession.stop();
            this._screencastSession = null;
        }
        return msg;
    }
    async startScreencast(msg) {
        const format = msg.params.format;
        const quality = msg.params.quality;
        const maxWidth = msg.params.maxWidth;
        const maxHeight = msg.params.maxHeight;
        if (!this._screencastSession) {
            this._screencastSession = new screencastSession_1.ScreencastSession(this.protocolAdaptor, maxWidth, maxHeight);
        }
        this._screencastSession.start();
        this.protocolAdaptor.fireResultToClient(msg.id, {});
        return null;
    }
    async onCaptureScreenshot(msg) {
        let params = msg.params;
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
        let snapshotReq = await this.protocolAdaptor.makeRequest('Page.snapshotRect', {
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
        let result = {
            data: imageBuffer.toString('base64'),
        };
        this.protocolAdaptor.fireResultToClient(msg.id, result);
        return null;
    }
    async stopScreencast(msg) {
        if (this._screencastSession) {
            this._screencastSession.stop();
        }
        this.protocolAdaptor.fireResultToClient(msg.id, {});
        return null;
    }
    async onScreencastFrameAck(msg) {
        if (this._screencastSession) {
            const frameNumber = msg.params.sessionId;
            this._screencastSession.ackFrame(frameNumber);
        }
        this.protocolAdaptor.fireResultToClient(msg.id, {});
        return null;
    }
    async getNavigationHistory(msg) {
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
            let result = {
                currentIndex: 0,
                entries: [{ id: 0, url: locationHref, userTypedURL: locationHref, title: windowTitle, transitionType: 'link' }],
            };
            this.protocolAdaptor.fireResultToClient(msg.id, result);
            return null;
        }
        catch (err) {
            this.protocolAdaptor.logger.debug('getNavigationHistory.failed', err);
            return null;
        }
    }
}
exports.Page = Page;
//# sourceMappingURL=page.js.map