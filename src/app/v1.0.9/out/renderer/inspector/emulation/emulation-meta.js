// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { ls } from '../platform/platform.js';
import * as Root from '../root/root.js';
import * as UI from '../ui/ui.js';
let loadedEmulationModule;
async function loadEmulationModule() {
    if (!loadedEmulationModule) {
        // Side-effect import resources in module.json
        await Root.Runtime.Runtime.instance().loadModulePromise('emulation');
        loadedEmulationModule = await import('./emulation.js');
    }
    return loadedEmulationModule;
}
UI.ViewManager.registerViewExtension({
    location: "settings-view" /* SETTINGS_VIEW */,
    commandPrompt: 'Show Devices',
    title: ls `Devices`,
    order: 30,
    async loadView() {
        const Emulation = await loadEmulationModule();
        return Emulation.DevicesSettingsTab.DevicesSettingsTab.instance();
    },
    id: 'devices',
    settings: [
        'standardEmulatedDeviceList',
        'customEmulatedDeviceList',
    ],
});
UI.ViewManager.registerViewExtension({
    location: "drawer-view" /* DRAWER_VIEW */,
    commandPrompt: 'Show Sensors',
    title: ls `Sensors`,
    id: 'sensors',
    persistence: "closeable" /* CLOSEABLE */,
    order: 100,
    async loadView() {
        const Emulation = await loadEmulationModule();
        return Emulation.SensorsView.SensorsView.instance();
    },
    tags: [
        ls `geolocation`,
        ls `timezones`,
        ls `locale`,
        ls `locales`,
        ls `accelerometer`,
        ls `device orientation`,
    ],
});
UI.ViewManager.registerViewExtension({
    location: "settings-view" /* SETTINGS_VIEW */,
    id: 'emulation-locations',
    commandPrompt: 'Show Locations',
    title: ls `Locations`,
    order: 40,
    async loadView() {
        const Emulation = await loadEmulationModule();
        return Emulation.LocationsSettingsTab.LocationsSettingsTab.instance();
    },
    settings: [
        'emulation.locations',
    ],
});
//# sourceMappingURL=emulation-meta.js.map