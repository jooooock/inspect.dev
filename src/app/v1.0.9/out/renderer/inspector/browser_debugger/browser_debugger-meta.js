// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { ls } from '../platform/platform.js';
import * as Root from '../root/root.js';
import * as UI from '../ui/ui.js';
let loadedBrowserDebuggerModule;
async function loadBrowserDebuggerModule() {
    if (!loadedBrowserDebuggerModule) {
        // Side-effect import resources in module.json
        await Root.Runtime.Runtime.instance().loadModulePromise('browser_debugger');
        loadedBrowserDebuggerModule = await import('./browser_debugger.js');
    }
    return loadedBrowserDebuggerModule;
}
UI.ViewManager.registerViewExtension({
    async loadView() {
        const BrowserDebugger = await loadBrowserDebuggerModule();
        return BrowserDebugger.EventListenerBreakpointsSidebarPane.EventListenerBreakpointsSidebarPane.instance();
    },
    id: 'sources.eventListenerBreakpoints',
    location: "sources.sidebar-bottom" /* SOURCES_SIDEBAR_BOTTOM */,
    commandPrompt: 'Show Elements',
    title: ls `Event Listener Breakpoints`,
    order: 9,
    persistence: "permanent" /* PERMANENT */,
});
UI.ViewManager.registerViewExtension({
    async loadView() {
        const BrowserDebugger = await loadBrowserDebuggerModule();
        return BrowserDebugger.CSPViolationBreakpointsSidebarPane.CSPViolationBreakpointsSidebarPane.instance();
    },
    id: 'sources.cspViolationBreakpoints',
    location: "sources.sidebar-bottom" /* SOURCES_SIDEBAR_BOTTOM */,
    commandPrompt: 'Show CSP Violation Breakpoints',
    title: ls `CSP Violation Breakpoints`,
    order: 10,
    persistence: "permanent" /* PERMANENT */,
});
UI.ViewManager.registerViewExtension({
    async loadView() {
        const BrowserDebugger = await loadBrowserDebuggerModule();
        return BrowserDebugger.XHRBreakpointsSidebarPane.XHRBreakpointsSidebarPane.instance();
    },
    id: 'sources.xhrBreakpoints',
    location: "sources.sidebar-bottom" /* SOURCES_SIDEBAR_BOTTOM */,
    commandPrompt: 'Show XHR/fetch Breakpoints',
    title: ls `XHR/fetch Breakpoints`,
    order: 5,
    persistence: "permanent" /* PERMANENT */,
    hasToolbar: true,
});
UI.ViewManager.registerViewExtension({
    async loadView() {
        const BrowserDebugger = await loadBrowserDebuggerModule();
        return BrowserDebugger.DOMBreakpointsSidebarPane.DOMBreakpointsSidebarPane.instance();
    },
    id: 'sources.domBreakpoints',
    location: "sources.sidebar-bottom" /* SOURCES_SIDEBAR_BOTTOM */,
    commandPrompt: 'Show DOM Breakpoints',
    title: ls `DOM Breakpoints`,
    order: 7,
    persistence: "permanent" /* PERMANENT */,
});
UI.ViewManager.registerViewExtension({
    async loadView() {
        const BrowserDebugger = await loadBrowserDebuggerModule();
        return BrowserDebugger.ObjectEventListenersSidebarPane.ObjectEventListenersSidebarPane.instance();
    },
    id: 'sources.globalListeners',
    location: "sources.sidebar-bottom" /* SOURCES_SIDEBAR_BOTTOM */,
    commandPrompt: 'Show Global Listeners',
    title: ls `Global Listeners`,
    order: 8,
    persistence: "permanent" /* PERMANENT */,
    hasToolbar: true,
});
UI.ViewManager.registerViewExtension({
    async loadView() {
        const BrowserDebugger = await loadBrowserDebuggerModule();
        return BrowserDebugger.DOMBreakpointsSidebarPane.DOMBreakpointsSidebarPane.instance();
    },
    id: 'elements.domBreakpoints',
    location: "elements-sidebar" /* ELEMENTS_SIDEBAR */,
    commandPrompt: 'Show DOM Breakpoints',
    title: ls `DOM Breakpoints`,
    order: 6,
    persistence: "permanent" /* PERMANENT */,
});
//# sourceMappingURL=browser_debugger-meta.js.map