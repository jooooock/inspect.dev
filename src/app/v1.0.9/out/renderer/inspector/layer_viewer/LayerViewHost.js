// Copyright 2015 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as Common from '../common/common.js';
import * as i18n from '../i18n/i18n.js';
import * as SDK from '../sdk/sdk.js';
export const UIStrings = {
    /**
    *@description Text in Layer View Host of the Layers panel
    */
    showInternalLayers: 'Show internal layers',
};
const str_ = i18n.i18n.registerUIStrings('layer_viewer/LayerViewHost.js', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
/**
 * @interface
 */
export class LayerView {
    /**
     * @param {?Selection} selection
     */
    hoverObject(selection) {
    }
    /**
     * @param {?Selection} selection
     */
    selectObject(selection) {
    }
    /**
     * @param {?SDK.LayerTreeBase.LayerTreeBase} layerTree
     */
    setLayerTree(layerTree) { }
}
export class Selection {
    /**
     * @param {!Type} type
     * @param {!SDK.LayerTreeBase.Layer} layer
     */
    constructor(type, layer) {
        this._type = type;
        this._layer = layer;
    }
    /**
     * @param {?Selection} a
     * @param {?Selection} b
     * @return {boolean}
     */
    static isEqual(a, b) {
        return a && b ? a._isEqual(b) : a === b;
    }
    /**
     * @return {!Type}
     */
    type() {
        return this._type;
    }
    /**
     * @return {!SDK.LayerTreeBase.Layer}
     */
    layer() {
        return this._layer;
    }
    /**
     * @param {!Selection} other
     * @return {boolean}
     */
    _isEqual(other) {
        return false;
    }
}
/**
 * @enum {symbol}
 */
export const Type = {
    Layer: Symbol('Layer'),
    ScrollRect: Symbol('ScrollRect'),
    Snapshot: Symbol('Snapshot')
};
export class LayerSelection extends Selection {
    /**
     * @param {!SDK.LayerTreeBase.Layer} layer
     */
    constructor(layer) {
        console.assert(Boolean(layer), 'LayerSelection with empty layer');
        super(Type.Layer, layer);
    }
    /**
     * @override
     * @param {!Selection} other
     * @return {boolean}
     */
    _isEqual(other) {
        return other._type === Type.Layer && other.layer().id() === this.layer().id();
    }
}
export class ScrollRectSelection extends Selection {
    /**
     * @param {!SDK.LayerTreeBase.Layer} layer
     * @param {number} scrollRectIndex
     */
    constructor(layer, scrollRectIndex) {
        super(Type.ScrollRect, layer);
        this.scrollRectIndex = scrollRectIndex;
    }
    /**
     * @override
     * @param {!Selection} other
     * @return {boolean}
     */
    _isEqual(other) {
        return other._type === Type.ScrollRect && this.layer().id() === other.layer().id() &&
            this.scrollRectIndex === /** @type {!ScrollRectSelection} */ (other).scrollRectIndex;
    }
}
export class SnapshotSelection extends Selection {
    /**
     * @param {!SDK.LayerTreeBase.Layer} layer
     * @param {!SDK.PaintProfiler.SnapshotWithRect} snapshot
     */
    constructor(layer, snapshot) {
        super(Type.Snapshot, layer);
        this._snapshot = snapshot;
    }
    /**
     * @override
     * @param {!Selection} other
     * @return {boolean}
     */
    _isEqual(other) {
        return other._type === Type.Snapshot && this.layer().id() === other.layer().id() &&
            this._snapshot === /** @type {!SnapshotSelection} */ (other)._snapshot;
    }
    /**
     * @return {!SDK.PaintProfiler.SnapshotWithRect}
     */
    snapshot() {
        return this._snapshot;
    }
}
export class LayerViewHost {
    constructor() {
        /** @type {!Array.<!LayerView>} */
        this._views = [];
        this._selectedObject = null;
        this._hoveredObject = null;
        this._showInternalLayersSetting =
            Common.Settings.Settings.instance().createSetting('layersShowInternalLayers', false);
        /** @type {!Map<!SDK.LayerTreeBase.Layer, !SnapshotSelection>} */
        this._snapshotLayers = new Map();
    }
    /**
     * @param {!LayerView} layerView
     */
    registerView(layerView) {
        this._views.push(layerView);
    }
    /**
     * @param {!Map<!SDK.LayerTreeBase.Layer, !SnapshotSelection>} snapshotLayers
     */
    setLayerSnapshotMap(snapshotLayers) {
        this._snapshotLayers = snapshotLayers;
    }
    /**
     * @return {!Map<!SDK.LayerTreeBase.Layer, !SnapshotSelection>}
     */
    getLayerSnapshotMap() {
        return this._snapshotLayers;
    }
    /**
     * @param {?SDK.LayerTreeBase.LayerTreeBase} layerTree
     */
    setLayerTree(layerTree) {
        if (!layerTree) {
            return;
        }
        this._target = layerTree.target();
        const selectedLayer = this._selectedObject && this._selectedObject.layer();
        if (selectedLayer && (!layerTree || !layerTree.layerById(selectedLayer.id()))) {
            this.selectObject(null);
        }
        const hoveredLayer = this._hoveredObject && this._hoveredObject.layer();
        if (hoveredLayer && (!layerTree || !layerTree.layerById(hoveredLayer.id()))) {
            this.hoverObject(null);
        }
        for (const view of this._views) {
            view.setLayerTree(layerTree);
        }
    }
    /**
     * @param {?Selection} selection
     */
    hoverObject(selection) {
        if (Selection.isEqual(this._hoveredObject, selection)) {
            return;
        }
        this._hoveredObject = selection;
        const layer = selection && selection.layer();
        this._toggleNodeHighlight(layer ? layer.nodeForSelfOrAncestor() : null);
        for (const view of this._views) {
            view.hoverObject(selection);
        }
    }
    /**
     * @param {?Selection} selection
     */
    selectObject(selection) {
        if (Selection.isEqual(this._selectedObject, selection)) {
            return;
        }
        this._selectedObject = selection;
        for (const view of this._views) {
            view.selectObject(selection);
        }
    }
    /**
     * @return {?Selection}
     */
    selection() {
        return this._selectedObject;
    }
    /**
     * @param {!UI.ContextMenu.ContextMenu} contextMenu
     * @param {?Selection} selection
     */
    showContextMenu(contextMenu, selection) {
        contextMenu.defaultSection().appendCheckboxItem(i18nString(UIStrings.showInternalLayers), this._toggleShowInternalLayers.bind(this), this._showInternalLayersSetting.get());
        const node = selection && selection.layer() && selection.layer().nodeForSelfOrAncestor();
        if (node) {
            contextMenu.appendApplicableItems(node);
        }
        contextMenu.show();
    }
    /**
     * @return {!Common.Settings.Setting<*>}
     */
    showInternalLayersSetting() {
        return this._showInternalLayersSetting;
    }
    _toggleShowInternalLayers() {
        this._showInternalLayersSetting.set(!this._showInternalLayersSetting.get());
    }
    /**
     * @param {?SDK.DOMModel.DOMNode} node
     */
    _toggleNodeHighlight(node) {
        if (node) {
            node.highlightForTwoSeconds();
            return;
        }
        SDK.OverlayModel.OverlayModel.hideDOMNodeHighlight();
    }
}
//# sourceMappingURL=LayerViewHost.js.map