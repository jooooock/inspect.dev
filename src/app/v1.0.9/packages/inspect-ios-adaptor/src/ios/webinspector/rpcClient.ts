import RemoteMessages from './remoteMessages';
import _ from 'lodash';
import RpcMessageHandler from './rpcMessageHandler';
import { util } from 'appium-support';
import { services } from 'appium-ios-device';
import net from 'net';
import { LoggerBase } from 'src/lib/logger';

const DATA_LOG_LENGTH = { length: 200 };

export class RpcClient {
  _targets: any;
  _shouldCheckForTarget: boolean;
  connId: any;
  senderId: any;
  msgId: number;
  logAllCommunication: any;
  logAllCommunicationHexDump: any;
  socketChunkSize: any;
  bundleId: any;
  platformVersion: any;
  _contexts: any[];
  connected: any;
  messageHandler: any;
  _isTargetBased: any;
  remoteMessages: any;
  pendingTargetNotification: [any, any];
  service: any;
  udid: any;
  isSimulator: any;
  socketPath: any;
  logger: LoggerBase;
  baseLogger: LoggerBase;

  constructor(opts: any = {}) {
    this._targets = [];
    this._shouldCheckForTarget = false;

    const { bundleId, platformVersion = {}, isSimulator, logAllCommunication = false, logAllCommunicationHexDump = false, socketChunkSize, socketPath, udid } = opts;

    this.isSimulator = isSimulator;

    this.isConnected = false;
    this.connId = util.uuidV4();
    this.senderId = util.uuidV4();
    this.msgId = 0;

    this.logAllCommunication = logAllCommunication;
    this.logAllCommunicationHexDump = logAllCommunicationHexDump;
    this.socketChunkSize = socketChunkSize;

    this.bundleId = bundleId;
    this.platformVersion = platformVersion;
    this.udid = udid;
    this.socketPath = socketPath;

    this.baseLogger = opts.baseLogger;
    this.logger = this.baseLogger.scope('RpcClient');

    this._contexts = [];
    this._targets = {};

    // Initial
    this.remoteMessages = new RemoteMessages(true);
    this.messageHandler = new RpcMessageHandler(true, this.baseLogger);
    this.messageHandler.on('Target.targetCreated', this.addTarget.bind(this));
    this.messageHandler.on('Target.didCommitProvisionalTarget', this.updateTarget.bind(this));
    this.messageHandler.on('Target.targetDestroyed', this.removeTarget.bind(this));

    // Best effort to detect initial protocol
    this.detectTargetProtocol(this.platformVersion, null);
  }

  public detectTargetProtocol(platformVersion: string, pageType?: string) {
    this.logger.debug(`detectTargetProtocol. platformVersion=${platformVersion}, pageType='${pageType}'`);

    if (pageType && pageType === 'WIRTypePage') {
      // On iOS 15+ UIWebViews aren't target based. We can detect them by looking at pageType=WIRTypePage.
      this.isTargetBased = false;
    } else if (pageType && pageType === 'WIRTypeServiceWorker') {
      // On iOS 15+ Service Workers aren't target based.
      this.isTargetBased = false;
    } else if (pageType && pageType === 'WIRTypeJavaScript') {
      // On iOS 15+ JSContexts aren't target based.
      this.isTargetBased = false;
    } else {
      // On iOS 12.2 the messages get sent through the Target domain
      // On iOS 13.0+, WKWebView also needs to follow the Target domain,
      // so here only check the target OS version as the default behaviour.
      const MIN_PLATFORM_FOR_TARGET_BASED = '12.2';
      // `Target.exists` protocol method was removed from WebKit in 13.4
      const MIN_PLATFORM_NO_TARGET_EXISTS = '13.4';

      const isHighVersion = util.compareVersions(platformVersion, '>=', MIN_PLATFORM_FOR_TARGET_BASED);
      this.logger.debug(`Checking which communication style to use (Safari on platform version '${platformVersion}')`);
      this.logger.debug(`Platform version equal or higher than '${MIN_PLATFORM_FOR_TARGET_BASED}': ${isHighVersion}`);
      this.isTargetBased = isHighVersion;
    }

    this.logger.debug(`detectTargetProtocol. isTargetBased=${this.isTargetBased}'`);
  }

  get contexts() {
    return this._contexts;
  }

  get needsTarget() {
    return this.shouldCheckForTarget && this.isTargetBased;
  }

  get targets() {
    return this._targets;
  }

  get shouldCheckForTarget() {
    return this._shouldCheckForTarget;
  }

  set shouldCheckForTarget(shouldCheckForTarget) {
    this._shouldCheckForTarget = !!shouldCheckForTarget;
  }

  get isConnected() {
    return this.connected;
  }

  set isConnected(connected) {
    this.connected = !!connected;
  }

  onAny(listener: any) {
    this.messageHandler.onAny(listener);
    return this;
  }

  on(event: any, listener: any) {
    this.messageHandler.on(event, listener);
    return this;
  }

  once(event: any, listener: any) {
    this.messageHandler.once(event, listener);
    return this;
  }

  off(event: any, listener: any) {
    this.messageHandler.off(event, listener);
    return this;
  }

  removeAllListeners(event: string) {
    this.messageHandler.removeAllListeners(event);
    return this;
  }

  set isTargetBased(isTargetBased) {
    this.logger.warn(`Setting communication protocol: using ${isTargetBased ? 'Target-based' : 'full Web Inspector protocol'} communication`);
    this._isTargetBased = isTargetBased;

    this.remoteMessages.isTargetBased = isTargetBased;
    this.messageHandler.isTargetBased = isTargetBased;
  }

  get isTargetBased() {
    return this._isTargetBased;
  }

  async send(command: string, opts: any = {}, waitForResponse = true): Promise<any> {
    try {
      return await this.sendToDevice(command, opts, waitForResponse);
    } catch (err) {
      this.logger.error(`rpcClient.send failed err=${err}`);
    }
  }

  async sendToDevice(command: any, opts: any = {}, waitForResponse = true) {
    return await new Promise(async (resolve, reject) => {
      const msgId = opts.msgId || this.msgId++;

      let wrapperMsgId = msgId;
      if (this.isTargetBased) {
        // for target-base communication, everything is wrapped up
        wrapperMsgId = msgId;
        // acknowledge wrapper message
        this.messageHandler.on(wrapperMsgId.toString(), function(err: any) {
          if (err) {
            reject(err);
          }
        });
      }

      const appIdKey = opts.appIdKey;
      const pageIdKey = opts.pageIdKey;
      const params = opts.params;
      let targetId = null;

      if (appIdKey && pageIdKey) {
        targetId = this.getTarget(appIdKey, pageIdKey);
      }

      // retrieve the correct command to send
      const fullOpts = _.defaults(
        {
          connId: this.connId,
          senderId: this.senderId,
          targetId,
          id: msgId,
          params: params,
        },
        opts,
      );
      const cmd = this.remoteMessages.getRemoteCommand(command, fullOpts);

      if (cmd.__selector == '_rpc_forwardSocketData:' && this.isTargetBased && !targetId) {
        return reject(`sendToDevice Cancelled. targetId null. targetId=${targetId}, appIdKey=${appIdKey}, pageIdKey=${pageIdKey}`);
      }

      if (cmd?.__argument?.WIRSocketDataKey) {
        // make sure the message being sent has all the information that is needed
        if (_.isNil(cmd.__argument.WIRSocketDataKey.id)) {
          cmd.__argument.WIRSocketDataKey.id = wrapperMsgId;
        }
        cmd.__argument.WIRSocketDataKey = Buffer.from(JSON.stringify(cmd.__argument.WIRSocketDataKey));
      }

      let messageHandled = true;
      if (!waitForResponse) {
        // the promise will be resolved as soon as the socket has been sent
        messageHandled = false;
        // do not log receipts
        this.messageHandler.once(msgId.toString(), function(err: any) {
          if (err) {
            // we are not waiting for this, and if it errors it is most likely
            // a protocol change. Log and check during testing
            this.logger.error(`Received error from send that is not being waited for (id: ${msgId}): '${_.truncate(JSON.stringify(err), DATA_LOG_LENGTH)}'`);
            // reject, though it is very rare that this will be triggered, since
            // the promise is resolved directlty after send. On the off chance,
            // though, it will alert of a protocol change.
            reject(err);
          }
        });
      } else if (this.messageHandler.listeners(cmd.__selector).length) {
        this.messageHandler.prependOnceListener(cmd.__selector, function(err: any, ...args: [unknown]) {
          if (err) {
            return reject(err);
          }
          this.logger.debug(`Received response from send (id: ${msgId}): '${_.truncate(JSON.stringify(args), DATA_LOG_LENGTH)}'`);
          resolve(args);
        });
      } else if (cmd?.__argument?.WIRSocketDataKey) {
        this.messageHandler.once(msgId.toString(), function(err: { code: any; message: any }, value: unknown) {
          if (err) {
            return reject(new Error(`Remote debugger error with code '${err.code}': ${err.message}`));
          }
          this.logger.debug(`Received data response from send (id: ${msgId}): '${_.truncate(JSON.stringify(value), DATA_LOG_LENGTH)}'`);
          resolve(value);
        });
      } else {
        // nothing else is handling things, so just resolve when the message is sent
        messageHandled = false;
      }

      const msg =
        `Sending '${cmd.__selector}' message` +
        (fullOpts.appIdKey ? ` to app '${fullOpts.appIdKey}'` : '') +
        (fullOpts.pageIdKey ? `, page '${fullOpts.pageIdKey}'` : '') +
        (this.needsTarget && targetId ? `, target '${targetId}'` : '') +
        ` (id: ${msgId}): '${command}'`;
      this.logger.debug(msg);
      // this.logger.debug('- command details', cmd);

      try {
        const res = await this.sendMessage(cmd);
        if (!messageHandled) {
          // There are no handlers waiting for a response before resolving,
          // and no errors sending the message over the socket, so resolve
          resolve(res);
        }
      } catch (err) {
        return reject(err);
      }
    });
  }

  async connect() {
    let socket = null;

    if (this.socketPath) {
      // Custom socket is used for iOS Simulators who aren't using usbmuxd
      socket = net.connect(this.socketPath);
    }

    this.service = await services.startWebInspectorService(this.udid, {
      osVersion: this.platformVersion,
      isSimulator: this.isSimulator,
      verbose: this.logAllCommunication,
      verboseHexDump: this.logAllCommunicationHexDump,
      socketChunkSize: this.socketChunkSize,
      socket: socket,
      maxFrameLength: 500 * 1024 * 1024,
    });

    this.service.listenMessage(this.receive.bind(this));
    this.isConnected = true;
  }

  async disconnect() {
    if (!this.isConnected) {
      return;
    }

    this.logger.debug('Disconnecting from remote debugger');
    this.service.close();
    this.isConnected = false;
  }

  async sendMessage(cmd: any) {
    // eslint-disable-line require-await
    this.service.sendMessage(cmd);
  }

  async receive(data: any) {
    if (!this.isConnected) {
      return;
    }
    await this.messageHandler.handleMessage(data);
  }

  addTarget(err: any, app: string | number, targetInfo: { targetId: any; isProvisional: any }) {
    if (_.isNil(targetInfo?.targetId)) {
      this.logger.warn(`Received 'Target.targetCreated' event for app '${app}' with no target. Skipping`);
      return;
    }
    if (_.isEmpty(this.pendingTargetNotification) && !targetInfo.isProvisional) {
      this.logger.warn(`Received 'Target.targetCreated' event for app '${app}' with no pending request: ${JSON.stringify(targetInfo)}`);
      return;
    }

    if (targetInfo.isProvisional) {
      this.logger.debug(`Provisional target created for app '${app}', '${targetInfo.targetId}'. Ignoring until target update event`);
      return;
    }

    const [appIdKey, pageIdKey] = this.pendingTargetNotification;

    this.logger.debug(`Target created for app '${appIdKey}' and page '${pageIdKey}': ${JSON.stringify(targetInfo)}`);
    if (_.has(this.targets[appIdKey], pageIdKey)) {
      this.logger.debug(`There is already a target for this app and page ('${this.targets[appIdKey][pageIdKey]}'). This might cause problems`);
    }
    this.targets[app] = this.targets[app] || {};
    this.targets[appIdKey][pageIdKey] = targetInfo.targetId;
  }

  updateTarget(err: any, app: string | number, oldTargetId: any, newTargetId: any) {
    this.logger.debug(`Target updated for app '${app}'. Old target: '${oldTargetId}', new target: '${newTargetId}'`);
    if (!this.targets[app]) {
      this.logger.warn(`No existing target for app '${app}'. Not sure what to do`);
      return;
    }
    // save this, to be used if/when the existing target is destroyed
    this.targets[app].provisional = {
      oldTargetId,
      newTargetId,
    };
  }

  removeTarget(err: any, app: string | number, targetInfo: { targetId: unknown }) {
    if (_.isNil(targetInfo?.targetId)) {
      this.logger.debug(`Received 'Target.targetDestroyed' event with no target. Skipping`);
      return;
    }

    this.logger.debug(`Target destroyed for app '${app}': ${targetInfo.targetId}`);

    // go through the targets and find the one that has a waiting provisional target
    if (this.targets[app]?.provisional?.oldTargetId === targetInfo.targetId) {
      const { oldTargetId, newTargetId } = this.targets[app].provisional;
      delete this.targets[app].provisional;

      // we do not know the page, so go through and find the existing target
      const targets = this.targets[app];
      for (const [page, targetId] of _.toPairs(targets)) {
        if (targetId === oldTargetId) {
          this.logger.debug(`Found provisional target for app '${app}'. Old target: '${oldTargetId}', new target: '${newTargetId}'. Updating`);
          targets[page] = newTargetId;
          return;
        }
      }
      this.logger.warn(`Provisional target for app '${app}' found, but no suitable existing target found. This may cause problems`);
      this.logger.warn(`Old target: '${oldTargetId}', new target: '${newTargetId}'. Existing targets: ${JSON.stringify(targets)}`);
    }

    // if there is no waiting provisional target, just get rid of the existing one
    const targets = this.targets[app];
    for (const [page, targetId] of _.toPairs(targets)) {
      if (targetId === targetInfo.targetId) {
        delete targets[page];
        return;
      }
    }
    this.logger.debug(`Target '${targetInfo.targetId}' deleted for app '${app}', but no such target exists`);
  }

  getTarget(appIdKey: string | number, pageIdKey: string | number) {
    return (this.targets[appIdKey] || {})[pageIdKey];
  }

  async getListing(appIdKey: any) {
    const sendOpts = {
      appIdKey,
    };

    await this.send('getListing', sendOpts, false);
  }

  async getConnectedApplications() {
    const sendOpts = {};

    await this.send('getConnectedApplications', sendOpts, false);
  }

  async highlightPage(appIdKey: any, pageIdKey: any) {
    const sendOpts = {
      appIdKey,
      pageIdKey,
      enabled: true,
    };
    await this.send('indicateWebView', sendOpts, false);
  }

  async unhighlightPage(appIdKey: any, pageIdKey: any) {
    const sendOpts = {
      appIdKey,
      pageIdKey,
      enabled: false,
    };
    await this.send('indicateWebView', sendOpts, false);
  }

  async selectPage(appIdKey: any, pageIdKey: any, pageType: string) {
    this.pendingTargetNotification = [appIdKey, pageIdKey];
    this.shouldCheckForTarget = false;

    const sendOpts = {
      appIdKey,
      pageIdKey,
    };

    this.detectTargetProtocol(this.platformVersion, pageType);

    await this.send('setSenderKey', sendOpts);
    this.logger.debug('Sender key set');

    if (this.isTargetBased) {
      await this.send('Target.exists', sendOpts, false);
    }

    this.shouldCheckForTarget = true;
  }

  async forwardDidClose(appIdKey: any, pageIdKey: any) {
    const sendOpts = {
      appIdKey,
      pageIdKey,
    };

    await this.send('forwardDidClose', sendOpts);
    this.logger.debug('forwardDidClose');
  }
}
