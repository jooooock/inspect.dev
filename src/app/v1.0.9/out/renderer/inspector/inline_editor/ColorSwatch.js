// Copyright (c) 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as Common from '../common/common.js';
import * as ComponentHelpers from '../component_helpers/component_helpers.js';
import * as LitHtml from '../third_party/lit-html/lit-html.js';
const ls = Common.ls;
const getStyleSheets = ComponentHelpers.GetStylesheet.getStyleSheets;
export class FormatChangedEvent extends Event {
    constructor(format, text) {
        super('format-changed', {});
        this.data = { format, text };
    }
}
export class ColorSwatch extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.tooltip = ls `Shift-click to change color format`;
        this.text = null;
        this._color = null;
        this._format = null;
        this.shadow.adoptedStyleSheets = [
            ...getStyleSheets('inline_editor/colorSwatch.css', { enableLegacyPatching: false }),
        ];
    }
    static isColorSwatch(element) {
        return element.localName === 'devtools-color-swatch';
    }
    get color() {
        return this._color;
    }
    get format() {
        return this._format;
    }
    get anchorBox() {
        const swatch = this.shadow.querySelector('.color-swatch');
        return swatch ? swatch.boxInWindow() : null;
    }
    /**
     * Render this swatch given a color object or text to be parsed as a color.
     * @param color The color object or string to use for this swatch.
     * @param formatOrUseUserSetting Either the format to be used as a string, or true to auto-detect the user-set format.
     * @param tooltip The tooltip to use on the swatch.
     */
    renderColor(color, formatOrUseUserSetting, tooltip) {
        if (typeof color === 'string') {
            this._color = Common.Color.Color.parse(color);
            this.text = color;
            if (!this._color) {
                this.renderTextOnly();
                return;
            }
        }
        else {
            this._color = color;
        }
        if (typeof formatOrUseUserSetting === 'boolean' && formatOrUseUserSetting) {
            this._format = Common.Settings.detectColorFormat(this._color);
        }
        else if (typeof formatOrUseUserSetting === 'string') {
            this._format = formatOrUseUserSetting;
        }
        else {
            this._format = this._color.format();
        }
        this.text = this._color.asString(this._format);
        if (tooltip) {
            this.tooltip = tooltip;
        }
        this.render();
    }
    renderTextOnly() {
        // Non-color values can be passed to the component (like 'none' from border style).
        LitHtml.render(this.text, this.shadow, { eventContext: this });
    }
    render() {
        // Disabled until https://crbug.com/1079231 is fixed.
        // clang-format off
        // Note that we use a <slot> with a default value here to display the color text. Consumers of this component are
        // free to append any content to replace what is being shown here.
        // Note also that whitespace between nodes is removed on purpose to avoid pushing these elements apart. Do not
        // re-format the HTML code.
        LitHtml.render(LitHtml.html `<span class="color-swatch" title="${this.tooltip}"><span class="color-swatch-inner"
        style="background-color:${this.text};"
        @click=${this.onClick}
        @mousedown=${this.consume}
        @dblclick=${this.consume}></span></span><slot><span>${this.text}</span></slot>`, this.shadow, { eventContext: this });
        // clang-format on
    }
    onClick(e) {
        e.stopPropagation();
        if (e.shiftKey) {
            this.toggleNextFormat();
            return;
        }
        this.dispatchEvent(new Event('swatch-click'));
    }
    consume(e) {
        e.stopPropagation();
    }
    toggleNextFormat() {
        if (!this._color || !this._format) {
            return;
        }
        let currentValue;
        do {
            this._format = nextColorFormat(this._color, this._format);
            currentValue = this._color.asString(this._format);
        } while (currentValue === this.text);
        if (currentValue) {
            this.text = currentValue;
            this.render();
            this.dispatchEvent(new FormatChangedEvent(this._format, this.text));
        }
    }
}
if (!customElements.get('devtools-color-swatch')) {
    customElements.define('devtools-color-swatch', ColorSwatch);
}
function nextColorFormat(color, curFormat) {
    // The format loop is as follows:
    // * original
    // * rgb(a)
    // * hsl(a)
    // * nickname (if the color has a nickname)
    // * shorthex (if has short hex)
    // * hex
    const cf = Common.Color.Format;
    switch (curFormat) {
        case cf.Original:
            return !color.hasAlpha() ? cf.RGB : cf.RGBA;
        case cf.RGB:
        case cf.RGBA:
            return !color.hasAlpha() ? cf.HSL : cf.HSLA;
        case cf.HSL:
        case cf.HSLA:
            if (color.nickname()) {
                return cf.Nickname;
            }
            return color.detectHEXFormat();
        case cf.ShortHEX:
            return cf.HEX;
        case cf.ShortHEXA:
            return cf.HEXA;
        case cf.HEXA:
        case cf.HEX:
            return cf.Original;
        case cf.Nickname:
            return color.detectHEXFormat();
        default:
            return cf.RGBA;
    }
}
//# sourceMappingURL=ColorSwatch.js.map