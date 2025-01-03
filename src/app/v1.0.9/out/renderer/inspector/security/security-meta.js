// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { ls } from '../platform/platform.js';
import * as Root from '../root/root.js';
import * as UI from '../ui/ui.js';
let loadedSecurityModule;
async function loadSecurityModule() {
    if (!loadedSecurityModule) {
        // Side-effect import resources in module.json
        await Root.Runtime.Runtime.instance().loadModulePromise('security');
        loadedSecurityModule = await import('./security.js');
    }
    return loadedSecurityModule;
}
UI.ViewManager.registerViewExtension({
    location: "panel" /* PANEL */,
    id: 'security',
    title: ls `Security`,
    commandPrompt: 'Show Security',
    order: 80,
    persistence: "closeable" /* CLOSEABLE */,
    async loadView() {
        const Security = await loadSecurityModule();
        return Security.SecurityPanel.SecurityPanel.instance();
    },
});
//# sourceMappingURL=security-meta.js.map