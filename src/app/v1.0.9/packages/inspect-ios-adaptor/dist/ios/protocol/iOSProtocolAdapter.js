"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iOSProtocolAdaptor = void 0;
const browser_1 = require("./domains/browser");
const css_1 = require("./domains/css");
const debugger_1 = require("./domains/debugger");
const dom_1 = require("./domains/dom");
const domDebugger_1 = require("./domains/domDebugger");
const emulation_1 = require("./domains/emulation");
const input_1 = require("./domains/input");
const io_1 = require("./domains/io");
const log_1 = require("./domains/log");
const network_1 = require("./domains/network");
const overlay_1 = require("./domains/overlay");
const page_1 = require("./domains/page");
const runtime_1 = require("./domains/runtime");
const accessibility_1 = require("./domains/accessibility");
const protocolAdaptor_1 = require("./protocolAdaptor");
class iOSProtocolAdaptor extends protocolAdaptor_1.ProtocolAdapter {
    constructor(baseLogger) {
        super(baseLogger);
        this.globalState = {
            lastScriptEval: null,
            IOcache: new Map(),
        };
        // Initialize protocol domains
        new accessibility_1.Accessibility(this);
        new browser_1.Browser(this);
        new css_1.CSS(this);
        new debugger_1.Debugger(this);
        new dom_1.DOM(this);
        new domDebugger_1.DOMDebugger(this);
        new emulation_1.Emulation(this);
        new input_1.Input(this);
        new io_1.IO(this);
        new log_1.Log(this);
        new network_1.Network(this);
        new overlay_1.Overlay(this);
        new page_1.Page(this);
        new runtime_1.Runtime(this);
    }
}
exports.iOSProtocolAdaptor = iOSProtocolAdaptor;
//# sourceMappingURL=iOSProtocolAdapter.js.map