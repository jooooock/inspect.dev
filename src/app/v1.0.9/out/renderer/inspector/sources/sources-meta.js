// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { ls } from '../platform/platform.js';
import * as Root from '../root/root.js';
import * as UI from '../ui/ui.js';
let loadedSourcesModule;
async function loadSourcesModule() {
    if (!loadedSourcesModule) {
        // Side-effect import resources in module.json
        await Root.Runtime.Runtime.instance().loadModulePromise('sources');
        loadedSourcesModule = await import('./sources.js');
    }
    return loadedSourcesModule;
}
UI.ViewManager.registerViewExtension({
    location: "panel" /* PANEL */,
    id: 'sources',
    commandPrompt: 'Show Sources',
    title: ls `Sources`,
    order: 30,
    async loadView() {
        const Sources = await loadSourcesModule();
        return Sources.SourcesPanel.SourcesPanel.instance();
    },
});
UI.ViewManager.registerViewExtension({
    location: "navigator-view" /* NAVIGATOR_VIEW */,
    id: 'navigator-files',
    commandPrompt: 'Show Filesystem',
    title: ls `Filesystem`,
    order: 3,
    persistence: "permanent" /* PERMANENT */,
    async loadView() {
        const Sources = await loadSourcesModule();
        return Sources.SourcesNavigator.FilesNavigatorView.instance();
    },
});
UI.ViewManager.registerViewExtension({
    location: "navigator-view" /* NAVIGATOR_VIEW */,
    id: 'navigator-snippets',
    commandPrompt: 'Show Snippets',
    title: ls `Snippets`,
    order: 6,
    persistence: "permanent" /* PERMANENT */,
    async loadView() {
        const Sources = await loadSourcesModule();
        return Sources.SourcesNavigator.SnippetsNavigatorView.instance();
    },
});
UI.ViewManager.registerViewExtension({
    location: "drawer-view" /* DRAWER_VIEW */,
    id: 'sources.search-sources-tab',
    commandPrompt: 'Show Search',
    title: ls `Search`,
    order: 7,
    persistence: "closeable" /* CLOSEABLE */,
    async loadView() {
        const Sources = await loadSourcesModule();
        return Sources.SearchSourcesView.SearchSourcesView.instance();
    },
});
UI.ViewManager.registerViewExtension({
    location: "navigator-view" /* NAVIGATOR_VIEW */,
    id: 'navigator-recordings',
    commandPrompt: 'Show Recordings',
    title: ls `Recordings`,
    order: 8,
    persistence: "permanent" /* PERMANENT */,
    experiment: 'recorder',
    async loadView() {
        const Sources = await loadSourcesModule();
        return Sources.SourcesNavigator.RecordingsNavigatorView.instance();
    },
});
UI.ViewManager.registerViewExtension({
    location: "drawer-view" /* DRAWER_VIEW */,
    id: 'sources.quick',
    commandPrompt: 'Show Quick source',
    title: ls `Quick source`,
    persistence: "closeable" /* CLOSEABLE */,
    order: 1000,
    async loadView() {
        const Sources = await loadSourcesModule();
        return Sources.SourcesPanel.WrapperView.instance();
    },
});
UI.ViewManager.registerViewExtension({
    id: 'sources.threads',
    commandPrompt: 'Show Threads',
    title: ls `Threads`,
    persistence: "permanent" /* PERMANENT */,
    condition: '!sources.hide_thread_sidebar',
    async loadView() {
        const Sources = await loadSourcesModule();
        return Sources.ThreadsSidebarPane.ThreadsSidebarPane.instance();
    },
});
UI.ViewManager.registerViewExtension({
    id: 'sources.scopeChain',
    commandPrompt: 'Show Scope',
    title: ls `Scope`,
    persistence: "permanent" /* PERMANENT */,
    async loadView() {
        const Sources = await loadSourcesModule();
        return Sources.ScopeChainSidebarPane.ScopeChainSidebarPane.instance();
    },
});
UI.ViewManager.registerViewExtension({
    id: 'sources.watch',
    commandPrompt: 'Show Watch',
    title: ls `Watch`,
    persistence: "permanent" /* PERMANENT */,
    async loadView() {
        const Sources = await loadSourcesModule();
        return Sources.WatchExpressionsSidebarPane.WatchExpressionsSidebarPane.instance();
    },
    hasToolbar: true,
});
UI.ViewManager.registerViewExtension({
    id: 'sources.jsBreakpoints',
    commandPrompt: 'Show Breakpoints',
    title: ls `Breakpoints`,
    persistence: "permanent" /* PERMANENT */,
    async loadView() {
        const Sources = await loadSourcesModule();
        return Sources.JavaScriptBreakpointsSidebarPane.JavaScriptBreakpointsSidebarPane.instance();
    },
});
//# sourceMappingURL=sources-meta.js.map