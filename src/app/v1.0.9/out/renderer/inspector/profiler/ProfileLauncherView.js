/*
 * Copyright (C) 2011 Google Inc. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Google Inc. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
import * as Common from '../common/common.js';
import * as UI from '../ui/ui.js';
import { IsolateSelector } from './IsolateSelector.js';
export class ProfileLauncherView extends UI.Widget.VBox {
    /**
     * @param {!ProfilesPanel} profilesPanel
     */
    constructor(profilesPanel) {
        super();
        this.registerRequiredCSS('profiler/profileLauncherView.css', { enableLegacyPatching: true });
        this._panel = profilesPanel;
        this.element.classList.add('profile-launcher-view');
        this._contentElement = this.element.createChild('div', 'profile-launcher-view-content vbox');
        const profileTypeSelectorElement = this._contentElement.createChild('div', 'vbox');
        this._selectedProfileTypeSetting = Common.Settings.Settings.instance().createSetting('selectedProfileType', 'CPU');
        this._profileTypeHeaderElement = profileTypeSelectorElement.createChild('h1');
        this._profileTypeSelectorForm = profileTypeSelectorElement.createChild('form');
        UI.ARIAUtils.markAsRadioGroup(this._profileTypeSelectorForm);
        const isolateSelectorElement = this._contentElement.createChild('div', 'vbox profile-isolate-selector-block');
        isolateSelectorElement.createChild('h1').textContent = ls `Select JavaScript VM instance`;
        const isolateSelector = new IsolateSelector();
        isolateSelector.show(isolateSelectorElement.createChild('div', 'vbox profile-launcher-target-list'));
        isolateSelectorElement.appendChild(isolateSelector.totalMemoryElement());
        const buttonsDiv = this._contentElement.createChild('div', 'hbox profile-launcher-buttons');
        this._controlButton =
            UI.UIUtils.createTextButton('', this._controlButtonClicked.bind(this), '', /* primary */ true);
        this._loadButton = UI.UIUtils.createTextButton(ls `Load`, this._loadButtonClicked.bind(this), '');
        buttonsDiv.appendChild(this._controlButton);
        buttonsDiv.appendChild(this._loadButton);
        this._recordButtonEnabled = true;
        /** @type {!Map<string, {optionElement: !HTMLInputElement, profileType: !ProfileType}>} */
        this._typeIdToOptionElementAndProfileType = new Map();
    }
    _loadButtonClicked() {
        this._panel.showLoadFromFileDialog();
    }
    _updateControls() {
        if (this._isEnabled && this._recordButtonEnabled) {
            this._controlButton.removeAttribute('disabled');
        }
        else {
            this._controlButton.setAttribute('disabled', '');
        }
        UI.Tooltip.Tooltip.install(this._controlButton, this._recordButtonEnabled ? '' : UI.UIUtils.anotherProfilerActiveLabel());
        if (this._isInstantProfile) {
            this._controlButton.classList.remove('running');
            this._controlButton.classList.add('primary-button');
            this._controlButton.textContent = Common.UIString.UIString('Take snapshot');
        }
        else if (this._isProfiling) {
            this._controlButton.classList.add('running');
            this._controlButton.classList.remove('primary-button');
            this._controlButton.textContent = Common.UIString.UIString('Stop');
        }
        else {
            this._controlButton.classList.remove('running');
            this._controlButton.classList.add('primary-button');
            this._controlButton.textContent = Common.UIString.UIString('Start');
        }
        for (const { optionElement } of this._typeIdToOptionElementAndProfileType.values()) {
            optionElement.disabled = Boolean(this._isProfiling);
        }
    }
    profileStarted() {
        this._isProfiling = true;
        this._updateControls();
    }
    profileFinished() {
        this._isProfiling = false;
        this._updateControls();
    }
    /**
     * @param {!ProfileType} profileType
     * @param {boolean} recordButtonEnabled
     */
    updateProfileType(profileType, recordButtonEnabled) {
        this._isInstantProfile = profileType.isInstantProfile();
        this._recordButtonEnabled = recordButtonEnabled;
        this._isEnabled = profileType.isEnabled();
        this._updateControls();
    }
    /**
     * @param {!ProfileType} profileType
     */
    addProfileType(profileType) {
        const labelElement = UI.UIUtils.createRadioLabel('profile-type', profileType.name);
        this._profileTypeSelectorForm.appendChild(labelElement);
        const optionElement = labelElement.radioElement;
        this._typeIdToOptionElementAndProfileType.set(profileType.id, { optionElement, profileType });
        optionElement.addEventListener('change', this._profileTypeChanged.bind(this, profileType), false);
        const descriptionElement = this._profileTypeSelectorForm.createChild('p');
        descriptionElement.textContent = profileType.description;
        UI.ARIAUtils.setDescription(optionElement, profileType.description);
        const customContent = profileType.customContent();
        if (customContent) {
            this._profileTypeSelectorForm.createChild('p').appendChild(customContent);
            profileType.setCustomContentEnabled(false);
        }
        const headerText = this._typeIdToOptionElementAndProfileType.size > 1 ? ls `Select profiling type` : profileType.name;
        this._profileTypeHeaderElement.textContent = headerText;
        UI.ARIAUtils.setAccessibleName(this._profileTypeSelectorForm, headerText);
    }
    restoreSelectedProfileType() {
        let typeId = this._selectedProfileTypeSetting.get();
        if (!this._typeIdToOptionElementAndProfileType.has(typeId)) {
            typeId = this._typeIdToOptionElementAndProfileType.keys().next().value;
            this._selectedProfileTypeSetting.set(typeId);
        }
        const optionElementAndProfileType = 
        /** @type {!{optionElement: !HTMLInputElement, profileType: !ProfileType}} */ (this._typeIdToOptionElementAndProfileType.get(typeId));
        optionElementAndProfileType.optionElement.checked = true;
        const type = optionElementAndProfileType.profileType;
        for (const [id, { profileType }] of this._typeIdToOptionElementAndProfileType) {
            const enabled = (id === typeId);
            profileType.setCustomContentEnabled(enabled);
        }
        this.dispatchEventToListeners(Events.ProfileTypeSelected, type);
    }
    _controlButtonClicked() {
        this._panel.toggleRecord();
    }
    /**
     * @param {!ProfileType} profileType
     */
    _profileTypeChanged(profileType) {
        const typeId = this._selectedProfileTypeSetting.get();
        const type = /** @type {!{optionElement: !HTMLInputElement, profileType: !ProfileType}} */ (this._typeIdToOptionElementAndProfileType.get(typeId))
            .profileType;
        type.setCustomContentEnabled(false);
        profileType.setCustomContentEnabled(true);
        this.dispatchEventToListeners(Events.ProfileTypeSelected, profileType);
        this._isInstantProfile = profileType.isInstantProfile();
        this._isEnabled = profileType.isEnabled();
        this._updateControls();
        this._selectedProfileTypeSetting.set(profileType.id);
    }
}
/** @enum {symbol} */
export const Events = {
    ProfileTypeSelected: Symbol('ProfileTypeSelected')
};
//# sourceMappingURL=ProfileLauncherView.js.map