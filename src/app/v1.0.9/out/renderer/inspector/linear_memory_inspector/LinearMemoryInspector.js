// Copyright (c) 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import './LinearMemoryNavigator.js';
import './LinearMemoryValueInterpreter.js';
import './LinearMemoryViewer.js';
import * as Common from '../common/common.js';
import * as LitHtml from '../third_party/lit-html/lit-html.js';
const ls = Common.ls;
const { render, html } = LitHtml;
import { VALUE_INTEPRETER_MAX_NUM_BYTES } from './ValueInterpreterDisplayUtils.js';
import { formatAddress, parseAddress } from './LinearMemoryInspectorUtils.js';
class AddressHistoryEntry {
    constructor(address, callback) {
        this.address = 0;
        if (address < 0) {
            throw new Error('Address should be a greater or equal to zero');
        }
        this.address = address;
        this.callback = callback;
    }
    valid() {
        return true;
    }
    reveal() {
        this.callback(this.address);
    }
}
export class MemoryRequestEvent extends Event {
    constructor(start, end, address) {
        super('memory-request');
        this.data = { start, end, address };
    }
}
export class AddressChangedEvent extends Event {
    constructor(address) {
        super('address-changed');
        this.data = address;
    }
}
export class LinearMemoryInspector extends HTMLElement {
    constructor() {
        super(...arguments);
        this.shadow = this.attachShadow({ mode: 'open' });
        this.history = new Common.SimpleHistoryManager.SimpleHistoryManager(10);
        this.memory = new Uint8Array();
        this.memoryOffset = 0;
        this.outerMemoryLength = 0;
        this.address = 0;
        this.currentNavigatorMode = "Submitted" /* Submitted */;
        this.currentNavigatorAddressLine = `${this.address}`;
        this.numBytesPerPage = 4;
        this.valueTypes = new Set(["Integer 8-bit" /* Int8 */, "Float 32-bit" /* Float32 */]);
        this.endianness = "Little Endian" /* Little */;
    }
    set data(data) {
        if (data.address < data.memoryOffset || data.address > data.memoryOffset + data.memory.length || data.address < 0) {
            throw new Error('Address is out of bounds.');
        }
        if (data.memoryOffset < 0) {
            throw new Error('Memory offset has to be greater or equal to zero.');
        }
        this.memory = data.memory;
        this.address = data.address;
        this.memoryOffset = data.memoryOffset;
        this.outerMemoryLength = data.outerMemoryLength;
        this.dispatchEvent(new AddressChangedEvent(this.address));
        this.render();
    }
    render() {
        const { start, end } = this.getPageRangeForAddress(this.address, this.numBytesPerPage);
        const navigatorAddressToShow = this.currentNavigatorMode === "Submitted" /* Submitted */ ? formatAddress(this.address) : this.currentNavigatorAddressLine;
        const navigatorAddressIsValid = this.isValidAddress(navigatorAddressToShow);
        const invalidAddressMsg = ls `Address has to be a number between ${formatAddress(0)} and ${formatAddress(this.outerMemoryLength)}`;
        const errorMsg = navigatorAddressIsValid ? undefined : invalidAddressMsg;
        // Disabled until https://crbug.com/1079231 is fixed.
        // clang-format off
        render(html `
      <style>
        :host {
          flex: auto;
          display: flex;
        }

        .view {
          width: 100%;
          display: flex;
          flex: 1;
          flex-direction: column;
          font-family: monospace;
          padding: 9px 12px 9px 7px;
        }

        devtools-linear-memory-inspector-navigator + devtools-linear-memory-inspector-viewer {
          margin-top: 12px;
        }

        .value-interpreter {
          display: flex;
        }
      </style>
      <div class="view">
        <devtools-linear-memory-inspector-navigator
          .data=${{ address: navigatorAddressToShow, valid: navigatorAddressIsValid, mode: this.currentNavigatorMode, error: errorMsg }}
          @refresh-requested=${this.onRefreshRequest}
          @address-input-changed=${this.onAddressChange}
          @page-navigation=${this.navigatePage}
          @history-navigation=${this.navigateHistory}></devtools-linear-memory-inspector-navigator>
        <devtools-linear-memory-inspector-viewer
          .data=${{ memory: this.memory.slice(start - this.memoryOffset, end - this.memoryOffset), address: this.address, memoryOffset: start, focus: this.currentNavigatorMode === "Submitted" /* Submitted */ }}
          @byte-selected=${this.onByteSelected}
          @resize=${this.resize}>
        </devtools-linear-memory-inspector-viewer>
      </div>
      <div class="value-interpreter">
        <devtools-linear-memory-inspector-interpreter
          .data=${{
            value: this.memory.slice(this.address - this.memoryOffset, this.address + VALUE_INTEPRETER_MAX_NUM_BYTES).buffer,
            valueTypes: this.valueTypes,
            endianness: this.endianness
        }}
          @value-type-toggled=${this.onValueTypeToggled}
          @endianness-changed=${this.onEndiannessChanged}>
        </devtools-linear-memory-inspector-interpreter/>
      </div>
      `, this.shadow, {
            eventContext: this,
        });
        // clang-format on
    }
    onRefreshRequest() {
        const { start, end } = this.getPageRangeForAddress(this.address, this.numBytesPerPage);
        this.dispatchEvent(new MemoryRequestEvent(start, end, this.address));
    }
    onByteSelected(e) {
        this.currentNavigatorMode = "Submitted" /* Submitted */;
        const addressInRange = Math.max(0, Math.min(e.data, this.outerMemoryLength - 1));
        this.jumpToAddress(addressInRange);
    }
    onEndiannessChanged(e) {
        this.endianness = e.data;
        this.render();
    }
    isValidAddress(address) {
        const newAddress = parseAddress(address);
        return newAddress !== undefined && newAddress >= 0 && newAddress < this.outerMemoryLength;
    }
    onAddressChange(e) {
        const { address, mode } = e.data;
        const isValid = this.isValidAddress(address);
        const newAddress = parseAddress(address);
        this.currentNavigatorAddressLine = address;
        if (newAddress !== undefined && isValid) {
            this.currentNavigatorMode = mode;
            this.jumpToAddress(newAddress);
            return;
        }
        if (mode === "Submitted" /* Submitted */ && !isValid) {
            this.currentNavigatorMode = "InvalidSubmit" /* InvalidSubmit */;
        }
        else {
            this.currentNavigatorMode = "Edit" /* Edit */;
        }
        this.render();
    }
    onValueTypeToggled(e) {
        const { type, checked } = e.data;
        if (checked) {
            this.valueTypes.add(type);
        }
        else {
            this.valueTypes.delete(type);
        }
        this.render();
    }
    navigateHistory(e) {
        return e.data === "Forward" /* Forward */ ? this.history.rollover() : this.history.rollback();
    }
    navigatePage(e) {
        const newAddress = e.data === "Forward" /* Forward */ ? this.address + this.numBytesPerPage : this.address - this.numBytesPerPage;
        const addressInRange = Math.max(0, Math.min(newAddress, this.outerMemoryLength - 1));
        this.jumpToAddress(addressInRange);
    }
    jumpToAddress(address) {
        if (address < 0 || address >= this.outerMemoryLength) {
            console.warn(`Specified address is out of bounds: ${address}`);
            return;
        }
        const historyEntry = new AddressHistoryEntry(address, () => this.jumpToAddress(address));
        this.history.push(historyEntry);
        this.address = address;
        this.dispatchEvent(new AddressChangedEvent(this.address));
        this.update();
    }
    getPageRangeForAddress(address, numBytesPerPage) {
        const pageNumber = Math.floor(address / numBytesPerPage);
        const pageStartAddress = pageNumber * numBytesPerPage;
        const pageEndAddress = Math.min(pageStartAddress + numBytesPerPage, this.outerMemoryLength);
        return { start: pageStartAddress, end: pageEndAddress };
    }
    resize(event) {
        this.numBytesPerPage = event.data;
        this.update();
    }
    update() {
        const { start, end } = this.getPageRangeForAddress(this.address, this.numBytesPerPage);
        if (start < this.memoryOffset || end > this.memoryOffset + this.memory.length) {
            this.dispatchEvent(new MemoryRequestEvent(start, end, this.address));
        }
        else {
            this.render();
        }
    }
}
customElements.define('devtools-linear-memory-inspector-inspector', LinearMemoryInspector);
//# sourceMappingURL=LinearMemoryInspector.js.map