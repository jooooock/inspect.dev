// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { ls } from '../platform/platform.js';
import * as Root from '../root/root.js';
import * as UI from '../ui/ui.js';
let loadedCSSOverviewModule;
async function loadCSSOverviewModule() {
    if (!loadedCSSOverviewModule) {
        // Side-effect import resources in module.json
        await Root.Runtime.Runtime.instance().loadModulePromise('css_overview');
        loadedCSSOverviewModule = await import('./css_overview.js');
    }
    return loadedCSSOverviewModule;
}
UI.ViewManager.registerViewExtension({
    location: "panel" /* PANEL */,
    id: 'cssoverview',
    commandPrompt: 'Show CSS Overview',
    title: ls `CSS Overview`,
    order: 95,
    async loadView() {
        const CSSOverview = await loadCSSOverviewModule();
        return CSSOverview.CSSOverviewPanel.CSSOverviewPanel.instance();
    },
    experiment: Root.Runtime.ExperimentName.CSS_OVERVIEW,
});
//# sourceMappingURL=css_overview-meta.js.map