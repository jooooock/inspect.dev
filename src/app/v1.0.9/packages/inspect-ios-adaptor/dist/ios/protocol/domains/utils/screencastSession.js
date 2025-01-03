"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScreencastSession = void 0;
const interval = require('interval-promise');
class ScreencastSession {
    constructor(adaptor, maxWidth, maxHeight) {
        this.frameInterval = 63; // 1000ms/16 = 62.5 ~ 63ms
        this.adaptor = adaptor;
        this.maxHeight = maxHeight || 1024;
        this.maxWidth = maxWidth || 1024;
        this.isLoopRunning = false;
    }
    async start() {
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
    stop() {
        this.shouldExitLoop = true;
    }
    ackFrame(frameNumber) {
        this.framesAcked[frameNumber] = true;
    }
    startLoop() {
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
    async getViewportOffsets() {
        let offsetsReq = await this.adaptor.makeRequest('Runtime.evaluate', {
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
    async grabScreenframe() {
        try {
            // performance.mark('grabScreenframe.start');
            let snapshotReq = await this.adaptor.makeRequest('Page.snapshotRect', {
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
        }
        catch (error) {
            this.adaptor.logger.info('grabScreenframe.failed', error);
        }
    }
    async generateFrame() {
        this.adaptor.logger.info('generateFrame', '');
        const currentFrame = this.frameId;
        // if (currentFrame > 1 && !this.framesAcked[currentFrame - 1]) {
        //   return;
        // }
        this.frameId++;
        try {
            let [resizedBase64Image] = await Promise.all([this.grabScreenframe(), this.getViewportOffsets()]);
            // Send frame
            const frame = {
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
        }
        catch (error) {
            this.adaptor.logger.error('ScreencastSession.generateFrame.error', error);
        }
    }
}
exports.ScreencastSession = ScreencastSession;
//# sourceMappingURL=screencastSession.js.map