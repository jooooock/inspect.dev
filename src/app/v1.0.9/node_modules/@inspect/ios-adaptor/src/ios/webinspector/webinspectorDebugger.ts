import { EventEmitter } from 'events';
import { LoggerBase } from '../../lib/logger';
import _ from 'lodash';
import AsyncLock from 'async-lock';
import { RpcClient } from './rpcClient';
import { iOSProtocolAdaptor } from '../protocol/iOSProtocolAdapter';
import { pageArrayFromDict, appInfoFromDict } from '../../lib/utils';
import { App } from '../../lib/models';

const events = {
  EVENT_PAGE_CHANGE: 'pageChange',
  EVENT_PAGE_DATA: 'messageFromTarget',
  EVENT_APP_CHANGE: 'appChange',
  EVENT_DISCONNECT: 'disconnect',
};

export class WebinspectorDebugger extends EventEmitter {
  deviceId: any;
  bundleId: any;
  platformVersion: any;
  socketPath: any;
  socketChunkSize: any;
  _lock: AsyncLock;
  apps: Map<string, App>;
  appIdKey: string | null;
  pageIdKey: string | null;
  rpcClient: any;
  _skippedApps: any[];
  logger: LoggerBase;
  baseLogger: LoggerBase;

  private protocolAdaptor: iOSProtocolAdaptor;

  constructor(opts: any) {
    super();

    const { bundleId, platformVersion, socketPath, socketChunkSize, deviceId } = opts;

    this.deviceId = deviceId;
    this.bundleId = bundleId;
    this.platformVersion = platformVersion;
    this.socketPath = socketPath;
    this.socketChunkSize = socketChunkSize;
    this.baseLogger = opts.baseLogger;
    this.logger = this.baseLogger.scope('WebinspectorDebugger');

    this._lock = new AsyncLock();

    this.appIdKey = null;
    this.pageIdKey = null;

    this.apps = new Map();
    this.rpcClient = null;
    this.protocolAdaptor = new iOSProtocolAdaptor(this.baseLogger);
    this._skippedApps = ['lockdownd'];

    this.protocolAdaptor.on('toTarget', msg => {
      let { id, method, params } = msg;
      this.sendTranslatedMessageToTarget(id, method, params);
    });

    this.protocolAdaptor.on('toFrontend', msg => {
      this.emit(events.EVENT_PAGE_DATA, msg);
    });
  }

  async setConnectionKey() {
    this.logger.debug('Sending connection key request');
    // send but only wait to make sure the socket worked
    // as response from Web Inspector can take a long time
    await this.rpcClient.send('setConnectionKey', {}, false);
  }

  async sendMessageToTarget(msg: any) {
    this.protocolAdaptor.onMessageFromClient(msg);
  }

  async sendTranslatedMessageToTarget(msgId: string, command: string, params?: any) {
    this.logger.debug(`Sending command ${command}`);

    if (!this.appIdKey || !this.pageIdKey) {
      this.logger.debug(` -> Sending ${command} aborted. pageIdKey=${this.pageIdKey}`);
      return;
    }

    const sendOpts = {
      params: params,
      msgId: msgId,
      appIdKey: this.appIdKey,
      pageIdKey: this.pageIdKey,
    };

    await this.rpcClient.send(command, sendOpts, false);
  }

  async connect() {
    // initialize the rpc client
    this.initRpcClient();

    // listen for basic debugger-level events
    this.rpcClient.on('_rpc_reportSetup:', data => {
      this.logger.info('reportSetup', data);
    });

    this.rpcClient.on('_rpc_reportConnectedApplicationList:', this.onConnectedApplicationList.bind(this));
    this.rpcClient.on('_rpc_applicationConnected:', this.onApplicationConnected.bind(this));
    this.rpcClient.on('_rpc_applicationDisconnected:', this.onAppDisconnect.bind(this));
    this.rpcClient.on('_rpc_applicationSentListing:', this.onPageChange.bind(this));
    this.rpcClient.on('_rpc_applicationUpdated:', this.onAppUpdate.bind(this));
    this.rpcClient.on('_rpc_reportConnectedDriverList:', this.onConnectedDriverList.bind(this));
    this.rpcClient.on('_rpc_reportCurrentState:', this.onReportCurrentState.bind(this));
    this.rpcClient.on('_rpc_applicationSentDataParsed:', this.onApplicationSentDataParsed.bind(this));

    await this.rpcClient.connect();

    // get the connection information about the app
    try {
      await this.setConnectionKey();
    } catch (err) {
      this.logger.error(`Error setting connection key: ${err.message}`);
      await this.disconnect();
      throw err;
    }
  }

  async getPages(appIdKey) {
    this.logger.debug(`getPages on app '${appIdKey}'`);

    await this.rpcClient.getListing(appIdKey);
  }

  async selectPage(appIdKey, pageIdKey, pageType: string) {
    this.logger.debug(`Selecting page '${pageIdKey}' on app '${appIdKey}' with type '${pageType}' and forwarding socket setup`);

    this.appIdKey = `${appIdKey}`;
    this.pageIdKey = pageIdKey;

    await this.rpcClient.selectPage(this.appIdKey, this.pageIdKey, pageType);

    this.logger.debug(`Selected page this.appIdKey=${this.appIdKey} pageIdKey=${this.pageIdKey} pageType=${pageType}`);
  }

  async unselectPage(appIdKey, pageIdKey) {
    this.logger.debug(`unselectPage '${pageIdKey}' on app '${this.appIdKey}' `);

    this.appIdKey = `${appIdKey}`;
    this.pageIdKey = pageIdKey;

    await this.rpcClient.forwardDidClose(this.appIdKey, this.pageIdKey);
  }

  async highlight(appIdKey, pageIdKey) {
    this.logger.debug(`Highlighting page '${pageIdKey}' on app '${this.appIdKey}'`);

    await this.rpcClient.highlightPage(appIdKey, pageIdKey);
  }

  async unhighlight(appIdKey, pageIdKey) {
    this.logger.debug(`Unhighlighting page '${pageIdKey}' on app '${this.appIdKey}'`);

    await this.rpcClient.unhighlightPage(appIdKey, pageIdKey);
  }

  async getConnectedApplications() {
    this.logger.debug(`deviceDebugger.getConnectedApplications'`);

    await this.rpcClient.getConnectedApplications();
  }

  async disconnect() {
    if (this.rpcClient) {
      await this.rpcClient.disconnect();
    }
    this.emit(events.EVENT_DISCONNECT, true);
    this.teardown();
  }

  teardown() {
    this.logger.info('deviceDebugger.teardown');

    this.apps = new Map();
    this.appIdKey = null;
    this.pageIdKey = null;
    this.rpcClient = null;
  }

  // Event handlers

  async onAppUpdate(err, dict) {
    await this.useAppDictLock(done => {
      try {
        this.updateAppsWithDict(dict);
      } finally {
        done();
      }
    });
  }

  async onAppDisconnect(err, dict) {
    const appIdKey = dict.WIRApplicationIdentifierKey;
    this.logger.debug(`Application '${appIdKey}' disconnected. Removing from app dictionary.`);
    this.logger.debug(`Current app is '${this.appIdKey}'`);

    // get rid of the entry in our app dictionary,
    // since it is no longer available
    this.apps.delete(appIdKey);

    this.emit(events.EVENT_APP_CHANGE, this.apps);
  }

  async onPageChange(err: any, appIdKey: any, pageDict: any) {
    if (_.isEmpty(pageDict)) {
      return;
    }

    const pageArray = pageArrayFromDict(pageDict, appIdKey, this.deviceId);

    await this.useAppDictLock((done: () => void) => {
      try {
        // save the page dict for this app
        if (this.apps.has(appIdKey)) {
          if (this.apps.get(appIdKey).targets) {
            // we have a pre-existing pageDict
            if (_.isEqual(this.apps.get(appIdKey).targets, pageArray)) {
              this.logger.debug(`Received page change notice for app '${appIdKey}' ` + `but the listing has not changed. Ignoring.`);
              return done();
            }
          }
          // keep track of the page dictionary
          let app = this.apps.get(appIdKey);

          app.targets = pageArray;

          this.logger.debug(`Page changed: ${JSON.stringify(pageArray)}`);

          this.emit(events.EVENT_PAGE_CHANGE, {
            appIdKey: appIdKey,
            pageArray,
          });
        }
      } finally {
        done();
      }
    });
  }

  async onApplicationSentDataParsed(msg: any) {
    this.logger.debug('deviceDebugger.onApplicationSentDataParsed');
    // Forward to protocol adaptor
    this.protocolAdaptor.onMessageFromTarget(msg);
  }

  async onConnectedApplicationList(err, apps) {
    this.logger.debug(`Received connected applications list: ${_.keys(apps).join(', ')}`);

    let newAppMap = new Map();
    for (const dict of _.values(apps)) {
      const app = appInfoFromDict(dict);
      if (this.skippedApps.includes(app.name)) {
        continue;
      }
      // Fetch pages for the given app
      this.getPages(app.id);
      newAppMap.set(app.id, app);
    }

    await this.useAppDictLock(done => {
      try {
        this.apps = newAppMap;
        this.emit(events.EVENT_APP_CHANGE, this.apps);
      } finally {
        done();
      }
    });
  }

  async onApplicationConnected(err: any, dict) {
    const appIdKey = dict.WIRApplicationIdentifierKey;
    this.logger.debug(`Notified that new application '${appIdKey}' has connected`);
    await this.useAppDictLock(done => {
      try {
        this.updateAppsWithDict(dict);
        // Fetch pages for the given app
        this.getPages(appIdKey);
      } finally {
        done();
      }
    });
  }

  onConnectedDriverList(err, drivers) {
    // this.connectedDrivers = drivers.WIRDriverDictionaryKey;
    this.logger.debug(`Received connected driver list: ${JSON.stringify(drivers)}`);
  }

  onReportCurrentState(err, state) {
    this.logger.debug(`ReceivedReportCurrentState: ${JSON.stringify(state)}`);
  }

  initRpcClient() {
    this.rpcClient = new RpcClient({
      bundleId: this.bundleId,
      platformVersion: this.platformVersion,
      socketPath: this.socketPath,
      logAllCommunication: false,
      logAllCommunicationHexDump: false,
      socketChunkSize: this.socketChunkSize,
      udid: this.deviceId,
      shouldCheckForTarget: false,
      baseLogger: this.baseLogger,
    });
  }

  updateAppsWithDict(dict) {
    let app = appInfoFromDict(dict);
    let id = app.id;
    if (this.apps.has(id)) {
      // preserve the page dictionary for this entry
      app.targets = this.apps.get(id).targets;
    }
    this.apps.set(id, app);

    // add a promise to get the page dictionary
    if (_.isUndefined(app.targets)) {
      app.targets = [];
    }

    this.emit(events.EVENT_APP_CHANGE, this.apps);
  }

  get isConnected() {
    return !!this.rpcClient?.isConnected;
  }

  async useAppDictLock(fn) {
    return await this._lock.acquire('appDict', fn);
  }

  get skippedApps() {
    return this._skippedApps || [];
  }

  async launchSafari() {
    const SAFARI_BUNDLE_ID = 'com.apple.mobilesafari';
    await this.rpcClient.send('launchApplication', {
      bundleId: SAFARI_BUNDLE_ID,
    });
  }
}
