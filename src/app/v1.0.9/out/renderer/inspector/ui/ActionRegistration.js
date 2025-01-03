// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as Common from '../common/common.js';
import { ls } from '../platform/platform.js';
import * as Root from '../root/root.js';
import { Context } from './Context.js';
class ActionRuntimeExtensionDescriptor extends Root.Runtime.RuntimeExtensionDescriptor {
    constructor() {
        super();
    }
}
export class LegacyActionRegistration extends Common.ObjectWrapper.ObjectWrapper {
    constructor(extension) {
        super();
        this._extension = extension;
        this._enabled = true;
        this._toggled = false;
    }
    id() {
        return this.actionDescriptor().actionId || '';
    }
    extension() {
        return this._extension;
    }
    async execute() {
        if (!this._extension.canInstantiate()) {
            return false;
        }
        const delegate = await this._extension.instance();
        const actionId = this.id();
        return delegate.handleAction(Context.instance(), actionId);
    }
    icon() {
        return this.actionDescriptor().iconClass || '';
    }
    toggledIcon() {
        return this.actionDescriptor().toggledIconClass || '';
    }
    toggleWithRedColor() {
        return Boolean(this.actionDescriptor().toggleWithRedColor);
    }
    setEnabled(enabled) {
        if (this._enabled === enabled) {
            return;
        }
        this._enabled = enabled;
        this.dispatchEventToListeners(Events.Enabled, enabled);
    }
    enabled() {
        return this._enabled;
    }
    category() {
        return ls `${this.actionDescriptor().category || ''}`;
    }
    tags() {
        const keys = this.actionDescriptor().tags || '';
        // Get localized keys and separate by null character to prevent fuzzy matching from matching across them.
        const keyList = keys.split(',');
        let key = '';
        keyList.forEach(k => {
            key += (ls(k.trim()) + '\0');
        });
        return key;
    }
    toggleable() {
        return Boolean(this.actionDescriptor().toggleable);
    }
    title() {
        let title = this._extension.title() || '';
        const options = this.actionDescriptor().options;
        if (options) {
            for (const pair of options) {
                if (pair.value !== this._toggled) {
                    title = ls `${pair.title}`;
                }
            }
        }
        return title;
    }
    toggled() {
        return this._toggled;
    }
    setToggled(toggled) {
        console.assert(this.toggleable(), 'Shouldn\'t be toggling an untoggleable action', this.id());
        if (this._toggled === toggled) {
            return;
        }
        this._toggled = toggled;
        this.dispatchEventToListeners(Events.Toggled, toggled);
    }
    actionDescriptor() {
        return this._extension.descriptor();
    }
}
export class PreRegisteredAction extends Common.ObjectWrapper.ObjectWrapper {
    constructor(actionRegistration) {
        super();
        this._enabled = true;
        this._toggled = false;
        this.actionRegistration = actionRegistration;
    }
    id() {
        return this.actionRegistration.actionId;
    }
    async execute() {
        if (!this.actionRegistration.loadActionDelegate) {
            return false;
        }
        const delegate = await this.actionRegistration.loadActionDelegate();
        const actionId = this.id();
        return delegate.handleAction(Context.instance(), actionId);
    }
    icon() {
        return this.actionRegistration.iconClass;
    }
    toggledIcon() {
        return this.actionRegistration.toggledIconClass;
    }
    toggleWithRedColor() {
        return Boolean(this.actionRegistration.toggleWithRedColor);
    }
    setEnabled(enabled) {
        if (this._enabled === enabled) {
            return;
        }
        this._enabled = enabled;
        this.dispatchEventToListeners(Events.Enabled, enabled);
    }
    enabled() {
        return this._enabled;
    }
    category() {
        return this.actionRegistration.category;
    }
    tags() {
        if (this.actionRegistration.tags) {
            // Get localized keys and separate by null character to prevent fuzzy matching from matching across them.
            return this.actionRegistration.tags.join('\0');
        }
    }
    toggleable() {
        return Boolean(this.actionRegistration.toggleable);
    }
    title() {
        let title = this.actionRegistration.title || '';
        const options = this.actionRegistration.options;
        if (options) {
            // Actions with an 'options' property don't have a title field. Instead, the displayed
            // title is taken from the 'title' property of the option that is not active. Only one of the
            // two options can be active at a given moment and the 'toggled' property of the action along
            // with the 'value' of the options are used to determine which one it is.
            for (const pair of options) {
                if (pair.value !== this._toggled) {
                    title = pair.title;
                }
            }
        }
        return title;
    }
    toggled() {
        return this._toggled;
    }
    setToggled(toggled) {
        console.assert(this.toggleable(), 'Shouldn\'t be toggling an untoggleable action', this.id());
        if (this._toggled === toggled) {
            return;
        }
        this._toggled = toggled;
        this.dispatchEventToListeners(Events.Toggled, toggled);
    }
    options() {
        return this.actionRegistration.options;
    }
    contextTypes() {
        if (this.actionRegistration.contextTypes) {
            return this.actionRegistration.contextTypes();
        }
        return undefined;
    }
    canInstantiate() {
        return Boolean(this.actionRegistration.loadActionDelegate);
    }
    bindings() {
        return this.actionRegistration.bindings;
    }
    experiment() {
        return this.actionRegistration.experiment;
    }
    condition() {
        return this.actionRegistration.condition;
    }
}
const registeredActionExtensions = [];
const actionIdSet = new Set();
export function registerActionExtension(registration) {
    const actionId = registration.actionId;
    if (actionIdSet.has(actionId)) {
        throw new Error(`Duplicate Action id '${actionId}': ${new Error().stack}`);
    }
    actionIdSet.add(actionId);
    registeredActionExtensions.push(new PreRegisteredAction(registration));
}
export function getRegisteredActionExtensions() {
    return registeredActionExtensions.filter(action => Root.Runtime.Runtime.isDescriptorEnabled({ experiment: action.experiment(), condition: action.condition() }));
}
export const Events = {
    Enabled: Symbol('Enabled'),
    Toggled: Symbol('Toggled'),
};
export const ActionCategory = {
    ELEMENTS: ls `Elements`,
    SCREENSHOT: ls `Screenshot`,
    NETWORK: ls `Network`,
    MEMORY: ls `Memory`,
    JAVASCRIPT_PROFILER: ls `JavaScript Profiler`,
};
//# sourceMappingURL=ActionRegistration.js.map