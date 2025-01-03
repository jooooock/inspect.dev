import express from 'express';
import WebSocket from 'ws';
import http from 'http';
import { DeviceAdaptor } from './index';
import { DefaultLogger } from './lib/logger';
import _ from 'lodash';

export class Server {
  port: number;
  app: any;
  websocketServer: any;
  httpServer: http.Server;
  deviceAdaptor: DeviceAdaptor;
  logger: DefaultLogger;

  public async run() {
    this.port = 9222;
    this.app = express();
    this.httpServer = http.createServer(this.app);
    this.logger = new DefaultLogger();

    this.websocketServer = new WebSocket.Server({
      server: this.httpServer,
    });

    this.deviceAdaptor = new DeviceAdaptor();
    this.deviceAdaptor.start();

    this.websocketServer.on('connection', async (socket: any, req: any) => {
      const url = req.url;

      let params = new RegExp(/\/devtools\/page\/(.*)/).exec(url);

      if (!params) {
        return;
      }

      let targetId = params[1];

      this.logger.info(`new WS connection for target id ${targetId}`);
      await this.deviceAdaptor.selectTarget(targetId);

      // onMessageFromTarget
      this.deviceAdaptor.on('messageFromTarget', (msg: any) => {
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

    this.app.get('/', function(req, res) {
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
      return device.apps
        ?.filter(app => app.isActive === true)
        .map(app => {
          return app.targets?.map(target => {
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

    let filteredTargets = _.compact(_.flattenDeep(targetsList));

    return filteredTargets;
  }
}
