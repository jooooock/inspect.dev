// Copyright 2017 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as i18n from '../i18n/i18n.js';
import * as UI from '../ui/ui.js';
import { EditFileSystemView } from './EditFileSystemView.js';
import { IsolatedFileSystem } from './IsolatedFileSystem.js';
import { Events, IsolatedFileSystemManager } from './IsolatedFileSystemManager.js';
import { NetworkPersistenceManager } from './NetworkPersistenceManager.js';
export const UIStrings = {
    /**
    *@description Text of a DOM element in Workspace Settings Tab of the Workspace settings in Settings
    */
    workspace: 'Workspace',
    /**
    *@description Text of a DOM element in Workspace Settings Tab of the Workspace settings in Settings
    */
    mappingsAreInferredAutomatically: 'Mappings are inferred automatically.',
    /**
    *@description Text of the add button in Workspace Settings Tab of the Workspace settings in Settings
    */
    addFolder: 'Add folder…',
    /**
    *@description Label element text content in Workspace Settings Tab of the Workspace settings in Settings
    */
    folderExcludePattern: 'Folder exclude pattern',
    /**
    *@description Label for an item to remove something
    */
    remove: 'Remove',
};
const str_ = i18n.i18n.registerUIStrings('persistence/WorkspaceSettingsTab.js', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class WorkspaceSettingsTab extends UI.Widget.VBox {
    constructor() {
        super();
        this.registerRequiredCSS('persistence/workspaceSettingsTab.css', { enableLegacyPatching: true });
        const header = this.element.createChild('header');
        UI.UIUtils.createTextChild(header.createChild('h1'), i18nString(UIStrings.workspace));
        this.containerElement = this.element.createChild('div', 'settings-container-wrapper')
            .createChild('div', 'settings-tab settings-content settings-container');
        IsolatedFileSystemManager.instance().addEventListener(Events.FileSystemAdded, event => this._fileSystemAdded(/** @type {!PlatformFileSystem} */ (event.data)), this);
        IsolatedFileSystemManager.instance().addEventListener(Events.FileSystemRemoved, event => this._fileSystemRemoved(/** @type {!PlatformFileSystem} */ (event.data)), this);
        const folderExcludePatternInput = this._createFolderExcludePatternInput();
        folderExcludePatternInput.classList.add('folder-exclude-pattern');
        this.containerElement.appendChild(folderExcludePatternInput);
        const div = this.containerElement.createChild('div', 'settings-info-message');
        UI.UIUtils.createTextChild(div, i18nString(UIStrings.mappingsAreInferredAutomatically));
        this._fileSystemsListContainer = this.containerElement.createChild('div', '');
        const addButton = UI.UIUtils.createTextButton(i18nString(UIStrings.addFolder), this._addFileSystemClicked.bind(this));
        this.containerElement.appendChild(addButton);
        this.setDefaultFocusedElement(addButton);
        /** @type {!Map<string, !Element>} */
        this._elementByPath = new Map();
        /** @type {!Map<string, !EditFileSystemView>} */
        this._mappingViewByPath = new Map();
        const fileSystems = IsolatedFileSystemManager.instance().fileSystems();
        for (let i = 0; i < fileSystems.length; ++i) {
            this._addItem(fileSystems[i]);
        }
    }
    /**
     * @return {!Element}
     */
    _createFolderExcludePatternInput() {
        const p = document.createElement('p');
        const labelElement = p.createChild('label');
        labelElement.textContent = i18nString(UIStrings.folderExcludePattern);
        const inputElement = UI.UIUtils.createInput('', 'text');
        UI.ARIAUtils.bindLabelToControl(labelElement, inputElement);
        p.appendChild(inputElement);
        inputElement.style.width = '270px';
        const folderExcludeSetting = IsolatedFileSystemManager.instance().workspaceFolderExcludePatternSetting();
        const setValue = UI.UIUtils.bindInput(inputElement, folderExcludeSetting.set.bind(folderExcludeSetting), regexValidator, false);
        folderExcludeSetting.addChangeListener(() => setValue.call(null, folderExcludeSetting.get()));
        setValue(folderExcludeSetting.get());
        return p;
        /**
         * @param {string} value
         * @return {{valid: boolean, errorMessage: (string|undefined)}}
         */
        function regexValidator(value) {
            let regex;
            try {
                regex = new RegExp(value);
            }
            catch (e) {
            }
            const valid = Boolean(regex);
            return { valid, errorMessage: undefined };
        }
    }
    /**
     * @param {!PlatformFileSystem} fileSystem
     */
    _addItem(fileSystem) {
        // Support managing only instances of IsolatedFileSystem.
        if (!(fileSystem instanceof IsolatedFileSystem)) {
            return;
        }
        const networkPersistenceProject = NetworkPersistenceManager.instance().project();
        if (networkPersistenceProject &&
            IsolatedFileSystemManager.instance().fileSystem(
            /** @type {!FileSystem} */ (networkPersistenceProject).fileSystemPath()) === fileSystem) {
            return;
        }
        const element = this._renderFileSystem(fileSystem);
        this._elementByPath.set(fileSystem.path(), element);
        this._fileSystemsListContainer.appendChild(element);
        const mappingView = new EditFileSystemView(fileSystem.path());
        this._mappingViewByPath.set(fileSystem.path(), mappingView);
        mappingView.element.classList.add('file-system-mapping-view');
        mappingView.show(element);
    }
    /**
     * @param {!PlatformFileSystem} fileSystem
     * @return {!Element}
     */
    _renderFileSystem(fileSystem) {
        const fileSystemPath = fileSystem.path();
        const lastIndexOfSlash = fileSystemPath.lastIndexOf('/');
        const folderName = fileSystemPath.substr(lastIndexOfSlash + 1);
        const element = document.createElement('div');
        element.classList.add('file-system-container');
        const header = element.createChild('div', 'file-system-header');
        const nameElement = header.createChild('div', 'file-system-name');
        nameElement.textContent = folderName;
        UI.ARIAUtils.markAsHeading(nameElement, 2);
        const path = header.createChild('div', 'file-system-path');
        path.textContent = fileSystemPath;
        UI.Tooltip.Tooltip.install(path, fileSystemPath);
        const toolbar = new UI.Toolbar.Toolbar('');
        const button = new UI.Toolbar.ToolbarButton(i18nString(UIStrings.remove), 'largeicon-delete');
        button.addEventListener(UI.Toolbar.ToolbarButton.Events.Click, this._removeFileSystemClicked.bind(this, fileSystem));
        toolbar.appendToolbarItem(button);
        header.appendChild(toolbar.element);
        return element;
    }
    /**
     * @param {!PlatformFileSystem} fileSystem
     */
    _removeFileSystemClicked(fileSystem) {
        IsolatedFileSystemManager.instance().removeFileSystem(fileSystem);
    }
    _addFileSystemClicked() {
        IsolatedFileSystemManager.instance().addFileSystem();
    }
    /**
     * @param {!PlatformFileSystem} fileSystem
     */
    _fileSystemAdded(fileSystem) {
        this._addItem(fileSystem);
    }
    /**
     * @param {!PlatformFileSystem} fileSystem
     */
    _fileSystemRemoved(fileSystem) {
        const mappingView = this._mappingViewByPath.get(fileSystem.path());
        if (mappingView) {
            mappingView.dispose();
            this._mappingViewByPath.delete(fileSystem.path());
        }
        const element = this._elementByPath.get(fileSystem.path());
        if (element) {
            this._elementByPath.delete(fileSystem.path());
            element.remove();
        }
    }
}
//# sourceMappingURL=WorkspaceSettingsTab.js.map