// Copyright (c) 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as Common from '../common/common.js';
import * as LitHtml from '../third_party/lit-html/lit-html.js';
import { format, isNumber, isValidMode, valueTypeModeToLocalizedString, valueTypeToLocalizedString } from './ValueInterpreterDisplayUtils.js';
var ls = Common.ls;
const { render, html } = LitHtml;
const DEFAULT_MODE_MAPPING = new Map([
    ["Integer 8-bit" /* Int8 */, "dec" /* Decimal */],
    ["Integer 16-bit" /* Int16 */, "dec" /* Decimal */],
    ["Integer 32-bit" /* Int32 */, "dec" /* Decimal */],
    ["Integer 64-bit" /* Int64 */, "dec" /* Decimal */],
    ["Float 32-bit" /* Float32 */, "dec" /* Decimal */],
    ["Float 64-bit" /* Float64 */, "dec" /* Decimal */],
    ["String" /* String */, "none" /* None */],
]);
const SORTED_VALUE_TYPES = Array.from(DEFAULT_MODE_MAPPING.keys());
export class ValueInterpreterDisplay extends HTMLElement {
    constructor() {
        super(...arguments);
        this.shadow = this.attachShadow({ mode: 'open' });
        this.endianness = "Little Endian" /* Little */;
        this.buffer = new ArrayBuffer(0);
        this.valueTypes = new Set();
        this.valueTypeModeConfig = DEFAULT_MODE_MAPPING;
    }
    set data(data) {
        this.buffer = data.buffer;
        this.endianness = data.endianness;
        this.valueTypes = data.valueTypes;
        this.valueTypeModeConfig = DEFAULT_MODE_MAPPING;
        if (data.valueTypeModes) {
            data.valueTypeModes.forEach((mode, valueType) => {
                if (isValidMode(valueType, mode)) {
                    this.valueTypeModeConfig.set(valueType, mode);
                }
            });
        }
        this.render();
    }
    render() {
        // Disabled until https://crbug.com/1079231 is fixed.
        // clang-format off
        render(html `
      <style>
        :host {
          flex: auto;
          display: flex;
        }

        .mode-type {
          color: var(--text-highlight-color);
        }

        .value-types {
          width: 100%;
          display: grid;
          grid-template-columns: auto auto 1fr;
          grid-column-gap: 24px;
          grid-row-gap: 4px;
          overflow: hidden;
          padding-left: 12px;
          padding-right: 12px;
        }

        .value-type-cell-multiple-values {
          gap: 5px;
        }

        .value-type-cell {
          height: 21px;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          display: flex;
        }

        .value-type-cell-no-mode {
          grid-column: grid-column: 1 / 3;
        }

      </style>
      <div class="value-types">
        ${SORTED_VALUE_TYPES.map(type => this.valueTypes.has(type) ? this.showValue(type) : '')}
      </div>
    `, this.shadow, { eventContext: this });
        // clang-format on
    }
    showValue(type) {
        const mode = this.valueTypeModeConfig.get(type);
        if (!mode) {
            throw new Error(`No mode found for type ${type}`);
        }
        const localizedType = valueTypeToLocalizedString(type);
        const localizedMode = valueTypeModeToLocalizedString(mode);
        const unsignedValue = this.parse({ type, signed: false });
        const signedValue = this.parse({ type, signed: true });
        const showSignedAndUnsigned = signedValue !== unsignedValue;
        // Disabled until https://crbug.com/1079231 is fixed.
        // clang-format off
        return html `
      ${isNumber(type) ?
            html `
          <span class="value-type-cell">${localizedType}</span>
          <span class="mode-type value-type-cell">${localizedMode}</span>` :
            html `
          <span class="value-type-cell-no-mode value-type-cell">${localizedType}</span>`}

        ${showSignedAndUnsigned ?
            html `
          <div class="value-type-cell-multiple-values value-type-cell">
            <span data-value="true" title=${ls `Unsigned value`}>${unsignedValue}</span>
            <span>/<span>
            <span data-value="true" title=${ls `Signed value`}>${signedValue}</span>
          </div>` :
            html `
          <span class="value-type-cell" data-value="true">${unsignedValue}</span>`}
    `;
        // clang-format on
    }
    parse(data) {
        const mode = this.valueTypeModeConfig.get(data.type);
        if (!mode) {
            console.error(`No known way of showing value for ${data.type}`);
            return 'N/A';
        }
        return format({ buffer: this.buffer, type: data.type, endianness: this.endianness, signed: data.signed || false, mode });
    }
}
customElements.define('devtools-linear-memory-inspector-interpreter-display', ValueInterpreterDisplay);
//# sourceMappingURL=ValueInterpreterDisplay.js.map