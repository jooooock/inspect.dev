// Copyright 2017 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as Common from '../common/common.js';
import * as DataGrid from '../data_grid/data_grid.js';
import * as UI from '../ui/ui.js';
import { Category, IsLong } from './TimelineFilters.js';
import { TimelineSelection } from './TimelinePanel.js'; // eslint-disable-line no-unused-vars
import { TimelineTreeView } from './TimelineTreeView.js';
import { TimelineUIUtils } from './TimelineUIUtils.js';
export class EventsTimelineTreeView extends TimelineTreeView {
    /**
     * @param {!TimelineModeViewDelegate} delegate
     */
    constructor(delegate) {
        super();
        this._filtersControl = new Filters();
        this._filtersControl.addEventListener(Filters.Events.FilterChanged, this._onFilterChanged, this);
        this.init();
        this._delegate = delegate;
        this.dataGrid.markColumnAsSortedBy('startTime', DataGrid.DataGrid.Order.Ascending);
        this.splitWidget.showBoth();
        /** @type {!TimelineModel.TimelineProfileTree.Node} */
        this._currentTree;
    }
    /**
     * @override
     * @protected
     * @return {!Array<!TimelineModel.TimelineModelFilter.TimelineModelFilter>}
     */
    filters() {
        return [...super.filters(), ...this._filtersControl.filters()];
    }
    /**
     * @override
     * @param {!TimelineSelection} selection
     */
    updateContents(selection) {
        super.updateContents(selection);
        if (selection.type() === TimelineSelection.Type.TraceEvent) {
            const event = /** @type {!SDK.TracingModel.Event} */ (selection.object());
            this._selectEvent(event, true);
        }
    }
    /**
     * @override
     * @return {string}
     */
    getToolbarInputAccessiblePlaceHolder() {
        return ls `Filter event log`;
    }
    /**
     * @override
     * @return {!TimelineModel.TimelineProfileTree.Node}
     */
    _buildTree() {
        this._currentTree = this.buildTopDownTree(true, null);
        return this._currentTree;
    }
    _onFilterChanged() {
        const lastSelectedNode = this.lastSelectedNode();
        const selectedEvent = lastSelectedNode && lastSelectedNode.event;
        this.refreshTree();
        if (selectedEvent) {
            this._selectEvent(selectedEvent, false);
        }
    }
    /**
     * @param {!SDK.TracingModel.Event} event
     * @return {?TimelineModel.TimelineProfileTree.Node}
     */
    _findNodeWithEvent(event) {
        const iterators = [this._currentTree.children().values()];
        while (iterators.length) {
            // @ts-ignore crbug.com/1011811 there is no common iterator type between Closure and TypeScript
            const iterator = iterators.peekLast().next();
            if (iterator.done) {
                iterators.pop();
                continue;
            }
            const child = /** @type {!TimelineModel.TimelineProfileTree.Node} */ (iterator.value);
            if (child.event === event) {
                return child;
            }
            iterators.push(child.children().values());
        }
        return null;
    }
    /**
     * @param {!SDK.TracingModel.Event} event
     * @param {boolean=} expand
     */
    _selectEvent(event, expand) {
        const node = this._findNodeWithEvent(event);
        if (!node) {
            return;
        }
        this.selectProfileNode(node, false);
        if (expand) {
            const dataGridNode = this.dataGridNodeForTreeNode(node);
            if (dataGridNode) {
                dataGridNode.expand();
            }
        }
    }
    /**
     * @override
     * @param {!Array<!DataGrid.DataGrid.ColumnDescriptor>} columns
     */
    populateColumns(columns) {
        columns.push(/** @type {!DataGrid.DataGrid.ColumnDescriptor} */ ({
            id: 'startTime',
            title: Common.UIString.UIString('Start Time'),
            width: '80px',
            fixedWidth: true,
            sortable: true,
        }));
        super.populateColumns(columns);
        columns.filter(c => c.fixedWidth).forEach(c => {
            c.width = '80px';
        });
    }
    /**
     * @override
     * @param {!UI.Toolbar.Toolbar} toolbar
     */
    populateToolbar(toolbar) {
        super.populateToolbar(toolbar);
        this._filtersControl.populateToolbar(toolbar);
    }
    /**
     * @override
     * @param {!TimelineModel.TimelineProfileTree.Node} node
     * @return {boolean}
     */
    _showDetailsForNode(node) {
        const traceEvent = node.event;
        if (!traceEvent) {
            return false;
        }
        const model = this.model();
        if (!model) {
            return false;
        }
        TimelineUIUtils.buildTraceEventDetails(traceEvent, model.timelineModel(), this.linkifier, false)
            .then(fragment => this.detailsView.element.appendChild(fragment));
        return true;
    }
    /**
     * @override
     * @param {?TimelineModel.TimelineProfileTree.Node} node
     */
    _onHover(node) {
        this._delegate.highlightEvent(node && node.event);
    }
}
export class Filters extends Common.ObjectWrapper.ObjectWrapper {
    constructor() {
        super();
        this._categoryFilter = new Category();
        this._durationFilter = new IsLong();
        this._filters = [this._categoryFilter, this._durationFilter];
    }
    /**
     * @return {!Array<!TimelineModel.TimelineModelFilter.TimelineModelFilter>}
     */
    filters() {
        return this._filters;
    }
    /**
     * @param {!UI.Toolbar.Toolbar} toolbar
     */
    populateToolbar(toolbar) {
        const durationFilterUI = new UI.Toolbar.ToolbarComboBox(durationFilterChanged.bind(this), ls `Duration filter`);
        for (const durationMs of Filters._durationFilterPresetsMs) {
            durationFilterUI.addOption(durationFilterUI.createOption(durationMs ? Common.UIString.UIString('\u2265 %d\xa0ms', durationMs) : Common.UIString.UIString('All'), String(durationMs)));
        }
        toolbar.appendToolbarItem(durationFilterUI);
        /** @type {!Map<string, !UI.Toolbar.ToolbarCheckbox>} */
        const categoryFiltersUI = new Map();
        const categories = TimelineUIUtils.categories();
        for (const categoryName in categories) {
            const category = categories[categoryName];
            if (!category.visible) {
                continue;
            }
            const checkbox = new UI.Toolbar.ToolbarCheckbox(category.title, undefined, categoriesFilterChanged.bind(this, categoryName));
            checkbox.setChecked(true);
            checkbox.inputElement.style.backgroundColor = category.color;
            categoryFiltersUI.set(category.name, checkbox);
            toolbar.appendToolbarItem(checkbox);
        }
        /**
         * @this {Filters}
         */
        function durationFilterChanged() {
            const duration = /** @type {!HTMLOptionElement} */ (durationFilterUI.selectedOption()).value;
            const minimumRecordDuration = parseInt(duration, 10);
            this._durationFilter.setMinimumRecordDuration(minimumRecordDuration);
            this._notifyFiltersChanged();
        }
        /**
         * @param {string} name
         * @this {Filters}
         */
        function categoriesFilterChanged(name) {
            const categories = TimelineUIUtils.categories();
            const checkBox = categoryFiltersUI.get(name);
            categories[name].hidden = !checkBox || !checkBox.checked();
            this._notifyFiltersChanged();
        }
    }
    _notifyFiltersChanged() {
        this.dispatchEventToListeners(Filters.Events.FilterChanged);
    }
}
Filters._durationFilterPresetsMs = [0, 1, 15];
/** @enum {symbol} */
Filters.Events = {
    FilterChanged: Symbol('FilterChanged')
};
//# sourceMappingURL=EventsTimelineTreeView.js.map