// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { ls } from '../platform/platform.js';
import * as Root from '../root/root.js';
import * as UI from '../ui/ui.js';
let loadedAccessibilityModule;
async function loadAccessibilityModule() {
    if (!loadedAccessibilityModule) {
        // Side-effect import resources in module.json
        await Root.Runtime.Runtime.instance().loadModulePromise('accessibility');
        loadedAccessibilityModule = await import('./accessibility.js');
    }
    return loadedAccessibilityModule;
}
UI.ViewManager.registerViewExtension({
    location: "elements-sidebar" /* ELEMENTS_SIDEBAR */,
    id: 'accessibility.view',
    title: ls `Accessibility`,
    commandPrompt: 'Show Accessibility',
    order: 10,
    persistence: "permanent" /* PERMANENT */,
    async loadView() {
        const Accessibility = await loadAccessibilityModule();
        return Accessibility.AccessibilitySidebarView.AccessibilitySidebarView.instance();
    },
});
//# sourceMappingURL=accessibility-meta.js.map