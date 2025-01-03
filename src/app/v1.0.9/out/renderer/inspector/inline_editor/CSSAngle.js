// Copyright (c) 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import './CSSAngleEditor.js';
import './CSSAngleSwatch.js';
import * as LitHtml from '../third_party/lit-html/lit-html.js';
import { convertAngleUnit, getNewAngleFromEvent, getNextUnit, parseText, roundAngleByUnit } from './CSSAngleUtils.js';
const { render, html } = LitHtml;
const styleMap = LitHtml.Directives.styleMap;
const ContextAwareProperties = new Set(['color', 'background', 'background-color']);
export class PopoverToggledEvent extends Event {
    constructor(open) {
        super('popover-toggled', {});
        this.data = { open };
    }
}
export class ValueChangedEvent extends Event {
    constructor(value) {
        super('value-changed', {});
        this.data = { value };
    }
}
export class UnitChangedEvent extends Event {
    constructor(value) {
        super('unit-changed', {});
        this.data = { value };
    }
}
const DefaultAngle = {
    value: 0,
    unit: "rad" /* Rad */,
};
export class CSSAngle extends HTMLElement {
    constructor() {
        super(...arguments);
        this.shadow = this.attachShadow({ mode: 'open' });
        this.angle = DefaultAngle;
        this.displayedAngle = DefaultAngle;
        this.propertyName = '';
        this.propertyValue = '';
        this.angleElement = null;
        this.swatchElement = null;
        this.popoverOpen = false;
        this.popoverStyleTop = '';
        this.onMinifyingAction = this.minify.bind(this);
        this.onAngleUpdate = this.updateAngle.bind(this);
    }
    set data(data) {
        const parsedResult = parseText(data.angleText);
        if (!parsedResult) {
            return;
        }
        this.angle = parsedResult;
        this.displayedAngle = { ...parsedResult };
        this.propertyName = data.propertyName;
        this.propertyValue = data.propertyValue;
        this.containingPane = data.containingPane;
        this.render();
    }
    disconnectedCallback() {
        this.unbindMinifyingAction();
    }
    // We bind and unbind mouse event listeners upon popping over and minifying,
    // because we anticipate most of the time this widget is minified even when
    // it's attached to the DOM tree.
    popover() {
        if (!this.containingPane) {
            return;
        }
        if (!this.angleElement) {
            this.angleElement = this.shadow.querySelector('.css-angle');
        }
        if (!this.swatchElement) {
            this.swatchElement = this.shadow.querySelector('devtools-css-angle-swatch');
        }
        if (!this.angleElement || !this.swatchElement) {
            return;
        }
        this.dispatchEvent(new PopoverToggledEvent(true));
        this.bindMinifyingAction();
        const miniIconBottom = this.swatchElement.getBoundingClientRect().bottom;
        if (miniIconBottom) {
            // We offset mini icon's Y position with the containing styles pane's Y position
            // because DevTools' root SplitWidget's insertion-point-sidebar slot,
            // where most of the DevTools content lives, has an offset of Y position,
            // which makes all of its children's DOMRect Y positions to have this offset.
            const topElementOffset = this.containingPane.getBoundingClientRect().top;
            this.popoverStyleTop = `${miniIconBottom - topElementOffset}px`;
        }
        this.popoverOpen = true;
        this.render();
        this.angleElement.focus();
    }
    minify() {
        if (this.popoverOpen === false) {
            return;
        }
        this.popoverOpen = false;
        this.dispatchEvent(new PopoverToggledEvent(false));
        this.unbindMinifyingAction();
        this.render();
    }
    updateProperty(name, value) {
        this.propertyName = name;
        this.propertyValue = value;
        this.render();
    }
    updateAngle(angle) {
        this.displayedAngle = roundAngleByUnit(convertAngleUnit(angle, this.displayedAngle.unit));
        this.angle = this.displayedAngle;
        this.dispatchEvent(new ValueChangedEvent(`${this.angle.value}${this.angle.unit}`));
    }
    displayNextUnit() {
        const nextUnit = getNextUnit(this.displayedAngle.unit);
        this.displayedAngle = roundAngleByUnit(convertAngleUnit(this.angle, nextUnit));
        this.dispatchEvent(new UnitChangedEvent(`${this.displayedAngle.value}${this.displayedAngle.unit}`));
    }
    bindMinifyingAction() {
        document.addEventListener('mousedown', this.onMinifyingAction);
        if (this.containingPane) {
            this.containingPane.addEventListener('scroll', this.onMinifyingAction);
        }
    }
    unbindMinifyingAction() {
        document.removeEventListener('mousedown', this.onMinifyingAction);
        if (this.containingPane) {
            this.containingPane.removeEventListener('scroll', this.onMinifyingAction);
        }
    }
    onMiniIconClick(event) {
        event.stopPropagation();
        if (event.shiftKey && !this.popoverOpen) {
            this.displayNextUnit();
            return;
        }
        this.popoverOpen ? this.minify() : this.popover();
    }
    // Fix that the previous text will be selected when double-clicking the angle icon
    consume(event) {
        event.stopPropagation();
    }
    onKeydown(event) {
        if (!this.popoverOpen) {
            return;
        }
        switch (event.key) {
            case 'Escape':
                event.stopPropagation();
                this.minify();
                this.blur();
                break;
            case 'ArrowUp':
            case 'ArrowDown': {
                const newAngle = getNewAngleFromEvent(this.angle, event);
                if (newAngle) {
                    this.updateAngle(newAngle);
                }
                event.preventDefault();
                break;
            }
        }
    }
    render() {
        // Disabled until https://crbug.com/1079231 is fixed.
        // clang-format off
        render(html `
      <style>
        .css-angle {
          display: inline-block;
          position: relative;
          outline: none;
        }

        devtools-css-angle-swatch {
          display: inline-block;
          margin-right: 2px;
          user-select: none;
        }

        devtools-css-angle-editor {
          --dial-color: #a3a3a3;
          --border-color: var(--toolbar-bg-color);
          position: fixed;
          z-index: 2;
        }
      </style>

      <div class="css-angle" @keydown=${this.onKeydown} tabindex="-1">
        <div class="preview">
          <devtools-css-angle-swatch
            @click=${this.onMiniIconClick}
            @mousedown=${this.consume}
            @dblclick=${this.consume}
            .data=${{
            angle: this.angle,
        }}>
          </devtools-css-angle-swatch><slot></slot>
        </div>
        ${this.popoverOpen ? this.renderPopover() : null}
      </div>
    `, this.shadow, {
            eventContext: this,
        });
        // clang-format on
    }
    renderPopover() {
        let contextualBackground = '';
        // TODO(crbug.com/1143010): for now we ignore values with "url"; when we refactor
        // CSS value parsing we should properly apply atomic contextual background.
        if (ContextAwareProperties.has(this.propertyName) && !this.propertyValue.match(/url\(.*\)/i)) {
            contextualBackground = this.propertyValue;
        }
        // Disabled until https://crbug.com/1079231 is fixed.
        // clang-format off
        return html `
    <devtools-css-angle-editor
      class="popover popover-css-angle"
      style=${styleMap({ top: this.popoverStyleTop })}
      .data=${{
            angle: this.angle,
            onAngleUpdate: this.onAngleUpdate,
            background: contextualBackground,
        }}
    ></devtools-css-angle-editor>
    `;
        // clang-format on
    }
}
if (!customElements.get('devtools-css-angle')) {
    customElements.define('devtools-css-angle', CSSAngle);
}
//# sourceMappingURL=CSSAngle.js.map