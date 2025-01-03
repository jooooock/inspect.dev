// Copyright 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as Common from '../common/common.js';
import * as DataGrid from '../data_grid/data_grid.js';
import * as Host from '../host/host.js';
import * as SDK from '../sdk/sdk.js';
import * as UI from '../ui/ui.js';
export class EventSourceMessagesView extends UI.Widget.VBox {
    /**
     * @param {!SDK.NetworkRequest.NetworkRequest} request
     */
    constructor(request) {
        super();
        this.registerRequiredCSS('network/eventSourceMessagesView.css', { enableLegacyPatching: false });
        this.element.classList.add('event-source-messages-view');
        this._request = request;
        const columns = /** @type {!Array<!DataGrid.DataGrid.ColumnDescriptor>} */ ([
            { id: 'id', title: Common.UIString.UIString('Id'), sortable: true, weight: 8 },
            { id: 'type', title: Common.UIString.UIString('Type'), sortable: true, weight: 8 },
            { id: 'data', title: Common.UIString.UIString('Data'), sortable: false, weight: 88 },
            { id: 'time', title: Common.UIString.UIString('Time'), sortable: true, weight: 8 }
        ]);
        this._dataGrid = new DataGrid.SortableDataGrid.SortableDataGrid({
            displayName: ls `Event Source`,
            columns,
            editCallback: undefined,
            deleteCallback: undefined,
            refreshCallback: undefined
        });
        this._dataGrid.setStriped(true);
        this._dataGrid.setStickToBottom(true);
        this._dataGrid.setRowContextMenuCallback(this._onRowContextMenu.bind(this));
        this._dataGrid.markColumnAsSortedBy('time', DataGrid.DataGrid.Order.Ascending);
        this._sortItems();
        this._dataGrid.addEventListener(DataGrid.DataGrid.Events.SortingChanged, this._sortItems, this);
        this._dataGrid.setName('EventSourceMessagesView');
        this._dataGrid.asWidget().show(this.element);
    }
    /**
     * @override
     */
    wasShown() {
        this._dataGrid.rootNode().removeChildren();
        const messages = this._request.eventSourceMessages();
        for (let i = 0; i < messages.length; ++i) {
            this._dataGrid.insertChild(new EventSourceMessageNode(messages[i]));
        }
        this._request.addEventListener(SDK.NetworkRequest.Events.EventSourceMessageAdded, this._messageAdded, this);
    }
    /**
     * @override
     */
    willHide() {
        this._request.removeEventListener(SDK.NetworkRequest.Events.EventSourceMessageAdded, this._messageAdded, this);
    }
    /**
     * @param {!Common.EventTarget.EventTargetEvent} event
     */
    _messageAdded(event) {
        const message = /** @type {!SDK.NetworkRequest.EventSourceMessage} */ (event.data);
        this._dataGrid.insertChild(new EventSourceMessageNode(message));
    }
    _sortItems() {
        const sortColumnId = this._dataGrid.sortColumnId();
        if (!sortColumnId) {
            return;
        }
        const comparator = 
        /** @type {undefined|function(!DataGrid.SortableDataGrid.SortableDataGridNode<!EventSourceMessageNode>, !DataGrid.SortableDataGrid.SortableDataGridNode<!EventSourceMessageNode>):number} */
        (Comparators[sortColumnId]);
        if (!comparator) {
            return;
        }
        this._dataGrid.sortNodes(comparator, !this._dataGrid.isSortOrderAscending());
    }
    /**
     * @param {!UI.ContextMenu.ContextMenu} contextMenu
     * @param {!DataGrid.DataGrid.DataGridNode<!DataGrid.ViewportDataGrid.ViewportDataGridNode<!DataGrid.SortableDataGrid.SortableDataGridNode<!EventSourceMessageNode>>>} node
     */
    _onRowContextMenu(contextMenu, node) {
        contextMenu.clipboardSection().appendItem(Common.UIString.UIString('Copy message'), Host.InspectorFrontendHost.InspectorFrontendHostInstance.copyText.bind(Host.InspectorFrontendHost.InspectorFrontendHostInstance, node.data.data));
    }
}
/**
 * @extends {DataGrid.SortableDataGrid.SortableDataGridNode<EventSourceMessageNode>}
 */
export class EventSourceMessageNode extends DataGrid.SortableDataGrid.SortableDataGridNode {
    /**
     * @param {!SDK.NetworkRequest.EventSourceMessage} message
     */
    constructor(message) {
        const time = new Date(message.time * 1000);
        const timeText = ('0' + time.getHours()).substr(-2) + ':' + ('0' + time.getMinutes()).substr(-2) + ':' +
            ('0' + time.getSeconds()).substr(-2) + '.' + ('00' + time.getMilliseconds()).substr(-3);
        const timeNode = document.createElement('div');
        UI.UIUtils.createTextChild(timeNode, timeText);
        UI.Tooltip.Tooltip.install(timeNode, time.toLocaleString());
        super({ id: message.eventId, type: message.eventName, data: message.data, time: timeNode });
        this._message = message;
    }
}
/**
 * @param {function(!SDK.NetworkRequest.EventSourceMessage):(number|string)} fieldGetter
 * @param {!EventSourceMessageNode} a
 * @param {!EventSourceMessageNode} b
 * @return {number}
 */
export function EventSourceMessageNodeComparator(fieldGetter, a, b) {
    const aValue = fieldGetter(a._message);
    const bValue = fieldGetter(b._message);
    return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
}
/** @type {!Object.<string, function(!EventSourceMessageNode, !EventSourceMessageNode):number>} */
export const Comparators = {
    'id': EventSourceMessageNodeComparator.bind(null, message => message.eventId),
    'type': EventSourceMessageNodeComparator.bind(null, message => message.eventName),
    'time': EventSourceMessageNodeComparator.bind(null, message => message.time)
};
//# sourceMappingURL=EventSourceMessagesView.js.map