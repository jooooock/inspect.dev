// Copyright (c) 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import './NodeText.js';
import * as Common from '../common/common.js';
import * as ComponentHelpers from '../component_helpers/component_helpers.js';
import * as LitHtml from '../third_party/lit-html/lit-html.js';
const { render, html } = LitHtml;
const ls = Common.ls;
const getStyleSheets = ComponentHelpers.GetStylesheet.getStyleSheets;
const showElementButtonTitle = ls `Show element in the Elements panel`;
export class SettingChangedEvent extends Event {
    constructor(setting, value) {
        super('setting-changed', {});
        this.data = { setting, value };
    }
}
function isEnumSetting(setting) {
    return setting.type === "enum" /* ENUM */;
}
function isBooleanSetting(setting) {
    return setting.type === "boolean" /* BOOLEAN */;
}
export class LayoutPane extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.settings = [];
        this.gridElements = [];
        this.flexContainerElements = [];
        this.shadow.adoptedStyleSheets = [
            ...getStyleSheets('ui/inspectorCommon.css', { enableLegacyPatching: true }),
            ...getStyleSheets('ui/inspectorSyntaxHighlight.css', { enableLegacyPatching: true }),
            ...getStyleSheets('elements/layoutPane.css', { enableLegacyPatching: false }),
        ];
        this.onSummaryKeyDown = this.onSummaryKeyDown.bind(this);
    }
    set data(data) {
        this.settings = data.settings;
        this.gridElements = data.gridElements;
        this.flexContainerElements = data.flexContainerElements;
        this.render();
    }
    onSummaryKeyDown(event) {
        if (!event.target) {
            return;
        }
        const summaryElement = event.target;
        const detailsElement = summaryElement.parentElement;
        if (!detailsElement) {
            throw new Error('<details> element is not found for a <summary> element');
        }
        switch (event.key) {
            case 'ArrowLeft':
                detailsElement.open = false;
                break;
            case 'ArrowRight':
                detailsElement.open = true;
                break;
        }
    }
    render() {
        // Disabled until https://crbug.com/1079231 is fixed.
        // clang-format off
        render(html `
      <details open>
        <summary class="header" @keydown=${this.onSummaryKeyDown}>
          ${ls `Grid`}
        </summary>
        <div class="content-section">
          <h3 class="content-section-title">${ls `Overlay display settings`}</h3>
          <div class="select-settings">
            ${this.getEnumSettings().map(setting => this.renderEnumSetting(setting))}
          </div>
          <div class="checkbox-settings">
            ${this.getBooleanSettings().map(setting => this.renderBooleanSetting(setting))}
          </div>
        </div>
        ${this.gridElements ?
            html `<div class="content-section">
            <h3 class="content-section-title">
              ${this.gridElements.length ? ls `Grid overlays` : ls `No grid layouts found on this page`}
            </h3>
            ${this.gridElements.length ?
                html `<div class="elements">
                ${this.gridElements.map(element => this.renderElement(element))}
              </div>` : ''}
          </div>` : ''}
      </details>
      ${this.flexContainerElements !== undefined ?
            html `
        <details open>
          <summary class="header" @keydown=${this.onSummaryKeyDown}>
            ${ls `Flexbox`}
          </summary>
          ${this.flexContainerElements ?
                html `<div class="content-section">
              <h3 class="content-section-title">
                ${this.flexContainerElements.length ? ls `Flexbox overlays` : ls `No flexbox layouts found on this page`}
              </h3>
              ${this.flexContainerElements.length ?
                    html `<div class="elements">
                  ${this.flexContainerElements.map(element => this.renderElement(element))}
                </div>` : ''}
            </div>` : ''}
        </details>
        `
            : ''}
    `, this.shadow, {
            eventContext: this,
        });
        // clang-format on
    }
    getEnumSettings() {
        return this.settings.filter(isEnumSetting);
    }
    getBooleanSettings() {
        return this.settings.filter(isBooleanSetting);
    }
    onBooleanSettingChange(setting, event) {
        event.preventDefault();
        this.dispatchEvent(new SettingChangedEvent(setting.name, event.target.checked));
    }
    onEnumSettingChange(setting, event) {
        event.preventDefault();
        this.dispatchEvent(new SettingChangedEvent(setting.name, event.target.value));
    }
    onElementToggle(element, event) {
        event.preventDefault();
        element.toggle(event.target.checked);
    }
    onElementClick(element, event) {
        event.preventDefault();
        element.reveal();
    }
    onColorChange(element, event) {
        event.preventDefault();
        element.setColor(event.target.value);
        this.render();
    }
    onElementMouseEnter(element, event) {
        event.preventDefault();
        element.highlight();
    }
    onElementMouseLeave(element, event) {
        event.preventDefault();
        element.hideHighlight();
    }
    renderElement(element) {
        const onElementToggle = this.onElementToggle.bind(this, element);
        const onElementClick = this.onElementClick.bind(this, element);
        const onColorChange = this.onColorChange.bind(this, element);
        const onMouseEnter = this.onElementMouseEnter.bind(this, element);
        const onMouseLeave = this.onElementMouseLeave.bind(this, element);
        const onColorLabelKeyUp = (event) => {
            // Handle Enter and Space events to make the color picker accessible.
            if (event.key !== 'Enter' && event.key !== ' ') {
                return;
            }
            const target = event.target;
            const input = target.querySelector('input');
            input.click();
            event.preventDefault();
        };
        // Disabled until https://crbug.com/1079231 is fixed.
        // clang-format off
        return html `<div class="element">
      <label data-element="true" class="checkbox-label" title=${element.name}>
        <input data-input="true" type="checkbox" .checked=${element.enabled} @change=${onElementToggle} />
        <span class="node-text-container" data-label="true" @mouseenter=${onMouseEnter} @mouseleave=${onMouseLeave}>
          <devtools-node-text .data=${{
            nodeId: element.domId,
            nodeTitle: element.name,
            nodeClasses: element.domClasses,
        }}></devtools-node-text>
        </span>
      </label>
      <label @keyup=${onColorLabelKeyUp} tabindex="0" class="color-picker-label" style="background:${element.color}">
        <input @change=${onColorChange} @input=${onColorChange} class="color-picker" type="color" value=${element.color} />
      </label>
      <button tabindex="0" @click=${onElementClick} title=${showElementButtonTitle} class="show-element"></button>
    </div>`;
        // clang-format on
    }
    renderBooleanSetting(setting) {
        const onBooleanSettingChange = this.onBooleanSettingChange.bind(this, setting);
        return html `<label data-boolean-setting="true" class="checkbox-label" title=${setting.title}>
      <input data-input="true" type="checkbox" .checked=${setting.value} @change=${onBooleanSettingChange} />
      <span data-label="true">${setting.title}</span>
    </label>`;
    }
    renderEnumSetting(setting) {
        const onEnumSettingChange = this.onEnumSettingChange.bind(this, setting);
        return html `<label data-enum-setting="true" class="select-label" title=${setting.title}>
      <select class="chrome-select" data-input="true" @change=${onEnumSettingChange}>
        ${setting.options.map(opt => html `<option value=${opt.value} .selected=${setting.value === opt.value}>${opt.title}</option>`)}
      </select>
    </label>`;
    }
}
customElements.define('devtools-layout-pane', LayoutPane);
//# sourceMappingURL=LayoutPane.js.map