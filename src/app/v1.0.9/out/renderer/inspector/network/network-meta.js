// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as Common from '../common/common.js';
import { ls } from '../platform/platform.js';
import * as Root from '../root/root.js';
import * as UI from '../ui/ui.js';
let loadedNetworkModule;
async function loadNetworkModule() {
    if (!loadedNetworkModule) {
        // Side-effect import resources in module.json
        await Root.Runtime.Runtime.instance().loadModulePromise('network');
        loadedNetworkModule = await import('./network.js');
    }
    return loadedNetworkModule;
}
function maybeRetrieveContextTypes(getClassCallBack) {
    if (loadedNetworkModule === undefined) {
        return [];
    }
    return getClassCallBack(loadedNetworkModule);
}
UI.ViewManager.registerViewExtension({
    location: "panel" /* PANEL */,
    id: 'network',
    commandPrompt: 'Show Network',
    title: ls `Network`,
    order: 40,
    async loadView() {
        const Network = await loadNetworkModule();
        return Network.NetworkPanel.NetworkPanel.instance();
    },
});
UI.ViewManager.registerViewExtension({
    location: "drawer-view" /* DRAWER_VIEW */,
    id: 'network.blocked-urls',
    commandPrompt: 'Show Network request blocking',
    title: ls `Network request blocking`,
    persistence: "closeable" /* CLOSEABLE */,
    order: 60,
    async loadView() {
        const Network = await loadNetworkModule();
        return Network.BlockedURLsPane.BlockedURLsPane.instance();
    },
});
UI.ViewManager.registerViewExtension({
    location: "drawer-view" /* DRAWER_VIEW */,
    id: 'network.config',
    commandPrompt: 'Show Network conditions',
    title: ls `Network conditions`,
    persistence: "closeable" /* CLOSEABLE */,
    order: 40,
    tags: [ls `disk cache`, ls `network throttling`, ls `useragent`, ls `user agent`, ls `user-agent`],
    async loadView() {
        const Network = await loadNetworkModule();
        return Network.NetworkConfigView.NetworkConfigView.instance();
    },
});
UI.ViewManager.registerViewExtension({
    location: "network-sidebar" /* NETWORK_SIDEBAR */,
    id: 'network.search-network-tab',
    commandPrompt: 'Show Search',
    title: ls `Search`,
    persistence: "permanent" /* PERMANENT */,
    async loadView() {
        const Network = await loadNetworkModule();
        return Network.NetworkPanel.SearchNetworkView.instance();
    },
});
UI.ActionRegistration.registerActionExtension({
    actionId: 'network.toggle-recording',
    category: UI.ActionRegistration.ActionCategory.NETWORK,
    iconClass: "largeicon-start-recording" /* LARGEICON_START_RECORDING */,
    toggleable: true,
    toggledIconClass: "largeicon-stop-recording" /* LARGEICON_STOP_RECORDING */,
    toggleWithRedColor: true,
    contextTypes() {
        return maybeRetrieveContextTypes(Network => [Network.NetworkPanel.NetworkPanel]);
    },
    async loadActionDelegate() {
        const Network = await loadNetworkModule();
        return Network.NetworkPanel.ActionDelegate.instance();
    },
    options: [
        {
            value: true,
            title: ls `Record network log`,
        },
        {
            value: false,
            title: ls `Stop recording network log`,
        },
    ],
    bindings: [
        {
            shortcut: 'Ctrl+E',
            platform: "windows,linux" /* WindowsLinux */,
        },
        {
            shortcut: 'Meta+E',
            platform: "mac" /* Mac */,
        },
    ],
});
UI.ActionRegistration.registerActionExtension({
    actionId: 'network.hide-request-details',
    category: UI.ActionRegistration.ActionCategory.NETWORK,
    title: ls `Hide request details`,
    contextTypes() {
        return maybeRetrieveContextTypes(Network => [Network.NetworkPanel.NetworkPanel]);
    },
    async loadActionDelegate() {
        const Network = await loadNetworkModule();
        return Network.NetworkPanel.ActionDelegate.instance();
    },
    bindings: [
        {
            shortcut: 'Esc',
        },
    ],
});
UI.ActionRegistration.registerActionExtension({
    actionId: 'network.search',
    category: UI.ActionRegistration.ActionCategory.NETWORK,
    title: ls `Search`,
    contextTypes() {
        return maybeRetrieveContextTypes(Network => [Network.NetworkPanel.NetworkPanel]);
    },
    async loadActionDelegate() {
        const Network = await loadNetworkModule();
        return Network.NetworkPanel.ActionDelegate.instance();
    },
    bindings: [
        {
            platform: "mac" /* Mac */,
            shortcut: 'Meta+F',
            keybindSets: [
                "devToolsDefault" /* DEVTOOLS_DEFAULT */,
                "vsCode" /* VS_CODE */,
            ],
        },
        {
            platform: "windows,linux" /* WindowsLinux */,
            shortcut: 'Ctrl+F',
            keybindSets: [
                "devToolsDefault" /* DEVTOOLS_DEFAULT */,
                "vsCode" /* VS_CODE */,
            ],
        },
    ],
});
Common.Settings.registerSettingExtension({
    category: Common.Settings.SettingCategoryObject.NETWORK,
    title: ls `Color-code resource types`,
    settingName: 'networkColorCodeResourceTypes',
    settingType: Common.Settings.SettingTypeObject.BOOLEAN,
    defaultValue: false,
    tags: [ls `color code`, ls `resource type`],
    options: [
        {
            value: true,
            title: ls `Color code by resource type`,
        },
        {
            value: false,
            title: ls `Use default colors`,
        },
    ],
});
Common.Settings.registerSettingExtension({
    category: Common.Settings.SettingCategoryObject.NETWORK,
    title: ls `Group network log by frame`,
    settingName: 'network.group-by-frame',
    settingType: Common.Settings.SettingTypeObject.BOOLEAN,
    defaultValue: false,
    tags: [ls `network`, ls `frame`, ls `group`],
    options: [
        {
            value: true,
            title: ls `Group network log items by frame`,
        },
        {
            value: false,
            title: ls `Don't group network log items by frame`,
        },
    ],
});
//# sourceMappingURL=network-meta.js.map