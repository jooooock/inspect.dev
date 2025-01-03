"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const express_1 = __importDefault(require("express"));
const ws_1 = __importDefault(require("ws"));
const http_1 = __importDefault(require("http"));
const index_1 = require("./index");
const logger_1 = require("./lib/logger");
const lodash_1 = __importDefault(require("lodash"));
class Server {
    async run() {
        this.port = 9222;
        this.app = (0, express_1.default)();
        this.httpServer = http_1.default.createServer(this.app);
        this.logger = new logger_1.DefaultLogger();
        this.websocketServer = new ws_1.default.Server({
            server: this.httpServer,
        });
        this.deviceAdaptor = new index_1.DeviceAdaptor();
        this.deviceAdaptor.start();
        this.websocketServer.on('connection', async (socket, req) => {
            const url = req.url;
            let params = new RegExp(/\/devtools\/page\/(.*)/).exec(url);
            if (!params) {
                return;
            }
            let targetId = params[1];
            this.logger.info(`new WS connection for target id ${targetId}`);
            await this.deviceAdaptor.selectTarget(targetId);
            // onMessageFromTarget
            this.deviceAdaptor.on('messageFromTarget', (msg) => {
                if (!msg) {
                    return;
                }
                this.logger.info('WS: device to client ->', msg.id);
                socket.send(JSON.stringify(msg));
            });
            // onMessageFromClient
            socket.on('message', msg => {
                let request = JSON.parse(msg);
                this.logger.info('WS: client to device <-', request.id, request.method);
                this.deviceAdaptor.sendToActiveTarget(request);
            });
            // Client disconnect
            socket.on('close', msg => {
                this.logger.info('SOCKET CLOSE');
                if (targetId) {
                    this.deviceAdaptor.unselectTarget(targetId);
                }
            });
        });
        this.app.get('/', function (req, res) {
            res.json({
                msg: 'Hello from inspect-ios-adaptor',
            });
        });
        this.app.get('/json/list', async (req, res) => {
            res.json(await this.getTargets());
        });
        this.app.get('/json', async (req, res) => {
            res.json(await this.getTargets());
        });
        // Start server and return the port num ber
        this.httpServer.listen(this.port);
        this.logger.info('inspect-ios-adaptor is listening on http://localhost:9222/json/list');
    }
    async getTargets() {
        let devicesList = await this.deviceAdaptor.getDevices();
        let targetsList = devicesList.map(device => {
            var _a;
            return (_a = device.apps) === null || _a === void 0 ? void 0 : _a.filter(app => app.isActive === true).map(app => {
                var _a;
                return (_a = app.targets) === null || _a === void 0 ? void 0 : _a.map(target => {
                    let targetTitle = `${target.title} (${app.bundleId})`;
                    let wsUrl = `localhost:${this.port}/devtools/page/${target.id}`;
                    return {
                        id: target.id,
                        title: targetTitle,
                        type: target.type,
                        targetType: target.type,
                        url: target.url,
                        devtoolsFrontendUrl: `/devtools/inspector.html?ws=${wsUrl}`,
                        webSocketDebuggerUrl: `ws://${wsUrl}`,
                    };
                });
            });
        });
        let filteredTargets = lodash_1.default.compact(lodash_1.default.flattenDeep(targetsList));
        return filteredTargets;
    }
}
exports.Server = Server;
//# sourceMappingURL=server.js.map