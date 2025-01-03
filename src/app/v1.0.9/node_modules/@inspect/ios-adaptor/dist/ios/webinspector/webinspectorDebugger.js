"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebinspectorDebugger = void 0;
const events_1 = require("events");
const lodash_1 = __importDefault(require("lodash"));
const async_lock_1 = __importDefault(require("async-lock"));
const rpcClient_1 = require("./rpcClient");
const iOSProtocolAdapter_1 = require("../protocol/iOSProtocolAdapter");
const utils_1 = require("../../lib/utils");
const events = {
    EVENT_PAGE_CHANGE: 'pageChange',
    EVENT_PAGE_DATA: 'messageFromTarget',
    EVENT_APP_CHANGE: 'appChange',
    EVENT_DISCONNECT: 'disconnect',
};
class WebinspectorDebugger extends events_1.EventEmitter {
    constructor(opts) {
        super();
        const { bundleId, platformVersion, socketPath, socketChunkSize, deviceId } = opts;
        this.deviceId = deviceId;
        this.bundleId = bundleId;
        this.platformVersion = platformVersion;
        this.socketPath = socketPath;
        this.socketChunkSize = socketChunkSize;
        this.baseLogger = opts.baseLogger;
        this.logger = this.baseLogger.scope('WebinspectorDebugger');
        this._lock = new async_lock_1.default();
        this.appIdKey = null;
        this.pageIdKey = null;
        this.apps = new Map();
        this.rpcClient = null;
        this.protocolAdaptor = new iOSProtocolAdapter_1.iOSProtocolAdaptor(this.baseLogger);
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
    async sendMessageToTarget(msg) {
        this.protocolAdaptor.onMessageFromClient(msg);
    }
    async sendTranslatedMessageToTarget(msgId, command, params) {
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
        }
        catch (err) {
            this.logger.error(`Error setting connection key: ${err.message}`);
            await this.disconnect();
            throw err;
        }
    }
    async getPages(appIdKey) {
        this.logger.debug(`getPages on app '${appIdKey}'`);
        await this.rpcClient.getListing(appIdKey);
    }
    async selectPage(appIdKey, pageIdKey, pageType) {
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
            }
            finally {
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
    async onPageChange(err, appIdKey, pageDict) {
        if (lodash_1.default.isEmpty(pageDict)) {
            return;
        }
        const pageArray = (0, utils_1.pageArrayFromDict)(pageDict, appIdKey, this.deviceId);
        await this.useAppDictLock((done) => {
            try {
                // save the page dict for this app
                if (this.apps.has(appIdKey)) {
                    if (this.apps.get(appIdKey).targets) {
                        // we have a pre-existing pageDict
                        if (lodash_1.default.isEqual(this.apps.get(appIdKey).targets, pageArray)) {
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
            }
            finally {
                done();
            }
        });
    }
    async onApplicationSentDataParsed(msg) {
        this.logger.debug('deviceDebugger.onApplicationSentDataParsed');
        // Forward to protocol adaptor
        this.protocolAdaptor.onMessageFromTarget(msg);
    }
    async onConnectedApplicationList(err, apps) {
        this.logger.debug(`Received connected applications list: ${lodash_1.default.keys(apps).join(', ')}`);
        let newAppMap = new Map();
        for (const dict of lodash_1.default.values(apps)) {
            const app = (0, utils_1.appInfoFromDict)(dict);
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
            }
            finally {
                done();
            }
        });
    }
    async onApplicationConnected(err, dict) {
        const appIdKey = dict.WIRApplicationIdentifierKey;
        this.logger.debug(`Notified that new application '${appIdKey}' has connected`);
        await this.useAppDictLock(done => {
            try {
                this.updateAppsWithDict(dict);
                // Fetch pages for the given app
                this.getPages(appIdKey);
            }
            finally {
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
        this.rpcClient = new rpcClient_1.RpcClient({
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
        let app = (0, utils_1.appInfoFromDict)(dict);
        let id = app.id;
        if (this.apps.has(id)) {
            // preserve the page dictionary for this entry
            app.targets = this.apps.get(id).targets;
        }
        this.apps.set(id, app);
        // add a promise to get the page dictionary
        if (lodash_1.default.isUndefined(app.targets)) {
            app.targets = [];
        }
        this.emit(events.EVENT_APP_CHANGE, this.apps);
    }
    get isConnected() {
        var _a;
        return !!((_a = this.rpcClient) === null || _a === void 0 ? void 0 : _a.isConnected);
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
exports.WebinspectorDebugger = WebinspectorDebugger;
//# sourceMappingURL=webinspectorDebugger.js.map