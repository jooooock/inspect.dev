// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { ls } from '../platform/platform.js';
import * as Root from '../root/root.js';
import * as UI from '../ui/ui.js';
let loadedConsoleModule;
async function loadConsoleModule() {
    if (!loadedConsoleModule) {
        // Side-effect import resources in module.json
        await Root.Runtime.Runtime.instance().loadModulePromise('console');
        loadedConsoleModule = await import('./console.js');
    }
    return loadedConsoleModule;
}
UI.ViewManager.registerViewExtension({
    location: "panel" /* PANEL */,
    id: 'console',
    title: ls `Console`,
    commandPrompt: 'Show Console',
    order: 20,
    async loadView() {
        const Console = await loadConsoleModule();
        return Console.ConsolePanel.ConsolePanel.instance();
    },
});
UI.ViewManager.registerViewExtension({
    location: "drawer-view" /* DRAWER_VIEW */,
    id: 'console-view',
    title: ls `Console`,
    commandPrompt: 'Show Console',
    persistence: "permanent" /* PERMANENT */,
    order: 0,
    async loadView() {
        const Console = await loadConsoleModule();
        return Console.ConsolePanel.WrapperView.instance();
    },
});
//# sourceMappingURL=console-meta.js.map