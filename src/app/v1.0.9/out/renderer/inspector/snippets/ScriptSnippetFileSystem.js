// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as Common from '../common/common.js';
import * as i18n from '../i18n/i18n.js';
import * as Persistence from '../persistence/persistence.js';
import * as SDK from '../sdk/sdk.js';
import * as UI from '../ui/ui.js';
import * as Workspace from '../workspace/workspace.js';
export const UIStrings = {
    /**
    *@description Default snippet name when a new snippet is created in the Sources panel
    *@example {1} PH1
    */
    scriptSnippet: 'Script snippet #{PH1}',
    /**
    *@description Text to show something is linked to another
    *@example {example.url} PH1
    */
    linkedTo: 'Linked to {PH1}',
};
const str_ = i18n.i18n.registerUIStrings('snippets/ScriptSnippetFileSystem.js', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
/**
 * @param {string} name
 * @return {string}
 */
function escapeSnippetName(name) {
    return escape(name);
}
/**
 * @param {string} name
 * @return {string}
 */
function unescapeSnippetName(name) {
    return unescape(name);
}
export class SnippetFileSystem extends Persistence.PlatformFileSystem.PlatformFileSystem {
    constructor() {
        super('snippet://', 'snippets');
        this._lastSnippetIdentifierSetting =
            Common.Settings.Settings.instance().createSetting('scriptSnippets_lastIdentifier', 0);
        this._snippetsSetting = Common.Settings.Settings.instance().createSetting('scriptSnippets', []);
    }
    /**
     * @override
     * @return {!Array<string>}
     */
    initialFilePaths() {
        /** @type {!Array<!Snippet>} */
        const savedSnippets = this._snippetsSetting.get();
        return savedSnippets.map(snippet => escapeSnippetName(snippet.name));
    }
    /**
     * @override
     * @param {string} path
     * @param {?string} name
     * @return {!Promise<?string>}
     */
    async createFile(path, name) {
        const nextId = this._lastSnippetIdentifierSetting.get() + 1;
        this._lastSnippetIdentifierSetting.set(nextId);
        const snippetName = i18nString(UIStrings.scriptSnippet, { PH1: nextId });
        const snippets = this._snippetsSetting.get();
        snippets.push({ name: snippetName, content: '' });
        this._snippetsSetting.set(snippets);
        return escapeSnippetName(snippetName);
    }
    /**
     * @override
     * @param {string} path
     * @return {!Promise<boolean>}
     */
    async deleteFile(path) {
        const name = unescapeSnippetName(path.substring(1));
        /** @type {!Array<!Snippet>} */
        const allSnippets = this._snippetsSetting.get();
        const snippets = allSnippets.filter(snippet => snippet.name !== name);
        if (allSnippets.length !== snippets.length) {
            this._snippetsSetting.set(snippets);
            return true;
        }
        return false;
    }
    /**
     * @override
     * @param {string} path
     * @returns {!Promise<!TextUtils.ContentProvider.DeferredContent>}
     */
    async requestFileContent(path) {
        const name = unescapeSnippetName(path.substring(1));
        /** @type {!Array<!Snippet>} */
        const snippets = this._snippetsSetting.get();
        const snippet = snippets.find(snippet => snippet.name === name);
        if (snippet) {
            return { content: snippet.content, isEncoded: false };
        }
        return { content: null, isEncoded: false, error: `A snippet with name '${name}' was not found` };
    }
    /**
     * @override
     * @param {string} path
     * @param {string} content
     * @param {boolean} isBase64
     */
    async setFileContent(path, content, isBase64) {
        const name = unescapeSnippetName(path.substring(1));
        /** @type {!Array<!Snippet>} */
        const snippets = this._snippetsSetting.get();
        const snippet = snippets.find(snippet => snippet.name === name);
        if (snippet) {
            snippet.content = content;
            this._snippetsSetting.set(snippets);
            return true;
        }
        return false;
    }
    /**
     * @override
     * @param {string} path
     * @param {string} newName
     * @param {function(boolean, string=):void} callback
     */
    renameFile(path, newName, callback) {
        const name = unescapeSnippetName(path.substring(1));
        /** @type {!Array<!Snippet>} */
        const snippets = this._snippetsSetting.get();
        const snippet = snippets.find(snippet => snippet.name === name);
        newName = newName.trim();
        if (!snippet || newName.length === 0 || snippets.find(snippet => snippet.name === newName)) {
            callback(false);
            return;
        }
        snippet.name = newName;
        this._snippetsSetting.set(snippets);
        callback(true, newName);
    }
    /**
     * @override
     * @param {string} query
     * @param {!Common.Progress.Progress} progress
     * @return {!Promise<!Array<string>>}
     */
    async searchInPath(query, progress) {
        const re = new RegExp(query.escapeForRegExp(), 'i');
        /** @type {!Array<!Snippet>} */
        const allSnippets = this._snippetsSetting.get();
        const matchedSnippets = allSnippets.filter(snippet => snippet.content.match(re));
        return matchedSnippets.map(snippet => `snippet:///${escapeSnippetName(snippet.name)}`);
    }
    /**
     * @override
     * @param {string} path
     * @return {string}
     */
    mimeFromPath(path) {
        return 'text/javascript';
    }
    /**
     * @override
     * @param {string} path
     * @return {!Common.ResourceType.ResourceType}
     */
    contentType(path) {
        return Common.ResourceType.resourceTypes.Script;
    }
    /**
     * @override
     * @param {string} url
     * @return {string}
     */
    tooltipForURL(url) {
        return i18nString(UIStrings.linkedTo, { PH1: unescapeSnippetName(url.substring(this.path().length)) });
    }
    /**
     * @override
     * @return {boolean}
     */
    supportsAutomapping() {
        return true;
    }
}
/**
 * @param {!Workspace.UISourceCode.UISourceCode} uiSourceCode
 */
export async function evaluateScriptSnippet(uiSourceCode) {
    if (!uiSourceCode.url().startsWith('snippet://')) {
        return;
    }
    const executionContext = UI.Context.Context.instance().flavor(SDK.RuntimeModel.ExecutionContext);
    if (!executionContext) {
        return;
    }
    const runtimeModel = executionContext.runtimeModel;
    await uiSourceCode.requestContent();
    uiSourceCode.commitWorkingCopy();
    const expression = uiSourceCode.workingCopy();
    Common.Console.Console.instance().show();
    const url = uiSourceCode.url();
    const result = await executionContext.evaluate(
    /** @type {!SDK.RuntimeModel.EvaluationOptions} */ ({
        expression: `${expression}\n//# sourceURL=${url}`,
        objectGroup: 'console',
        silent: false,
        includeCommandLineAPI: true,
        returnByValue: false,
        generatePreview: true,
        replMode: true,
    }), 
    /* userGesture */ false, 
    /* awaitPromise */ true);
    if ('exceptionDetails' in result && result.exceptionDetails) {
        SDK.ConsoleModel.ConsoleModel.instance().addMessage(SDK.ConsoleModel.ConsoleMessage.fromException(runtimeModel, result.exceptionDetails, /* messageType */ undefined, /* timestamp */ undefined, url));
        return;
    }
    if (!('object' in result) || !result.object) {
        return;
    }
    const scripts = executionContext.debuggerModel.scriptsForSourceURL(url);
    if (scripts.length < 1) {
        return;
    }
    const scriptId = scripts[scripts.length - 1].scriptId;
    SDK.ConsoleModel.ConsoleModel.instance().addMessage(new SDK.ConsoleModel.ConsoleMessage(runtimeModel, SDK.ConsoleModel.MessageSource.Javascript, SDK.ConsoleModel.MessageLevel.Info, '', SDK.ConsoleModel.MessageType.Result, url, undefined, undefined, [result.object], undefined, undefined, executionContext.id, scriptId));
}
/**
 * @param {!Workspace.UISourceCode.UISourceCode} uiSourceCode
 * @return {boolean}
 */
export function isSnippetsUISourceCode(uiSourceCode) {
    return uiSourceCode.url().startsWith('snippet://');
}
/**
 * @param {!Workspace.Workspace.Project} project
 * @return {boolean}
 */
export function isSnippetsProject(project) {
    return project.type() === Workspace.Workspace.projectTypes.FileSystem &&
        Persistence.FileSystemWorkspaceBinding.FileSystemWorkspaceBinding.fileSystemType(project) === 'snippets';
}
/**
 * @return {!Workspace.Workspace.Project}
 */
export function findSnippetsProject() {
    const workspaceProject = Workspace.Workspace.WorkspaceImpl.instance()
        .projectsForType(Workspace.Workspace.projectTypes.FileSystem)
        .find(project => Persistence.FileSystemWorkspaceBinding.FileSystemWorkspaceBinding.fileSystemType(project) ===
        'snippets');
    if (!workspaceProject) {
        throw new Error('Unable to find workspace project for the snippets file system');
    }
    return workspaceProject;
}
/**
* @typedef {{
  * name:string,
  * content:string,
  * }}
  */
// @ts-ignore typedef
export let Snippet;
//# sourceMappingURL=ScriptSnippetFileSystem.js.map