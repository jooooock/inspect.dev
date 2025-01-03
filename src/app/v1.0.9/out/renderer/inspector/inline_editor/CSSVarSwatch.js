// Copyright (c) 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as Common from '../common/common.js';
import * as LitHtml from '../third_party/lit-html/lit-html.js';
const { render, html, Directives } = LitHtml;
const ls = Common.ls;
const VARIABLE_FUNCTION_REGEX = /(var\()(\s*--[^,)]+)(.*)/;
export class CSSVarSwatch extends HTMLElement {
    constructor() {
        super(...arguments);
        this.shadow = this.attachShadow({ mode: 'open' });
        this.text = '';
        this.computedValue = null;
        this.fromFallback = false;
        this.onLinkClick = () => undefined;
    }
    set data(data) {
        this.text = data.text;
        this.computedValue = data.computedValue;
        this.fromFallback = data.fromFallback;
        this.onLinkClick = data.onLinkClick;
        this.render();
    }
    parseVariableFunctionParts() {
        // When the value of CSS var() is greater than two spaces, only one is
        // always displayed, and the actual number of spaces is displayed when
        // editing is clicked.
        const result = this.text.replace(/\s{2,}/g, ' ').match(VARIABLE_FUNCTION_REGEX);
        if (!result) {
            return null;
        }
        return {
            pre: result[1],
            name: result[2],
            post: result[3],
        };
    }
    get variableName() {
        const match = this.text.match(/--[^,)]+/);
        if (match) {
            return match[0];
        }
        return '';
    }
    renderLink(variableName) {
        const isDefined = this.computedValue && !this.fromFallback;
        const classes = Directives.classMap({
            'css-var-link': true,
            'undefined': !isDefined,
        });
        const title = isDefined ? ls `Jump to definition` : ls `${variableName} is not defined`;
        // The this.variableName's space must be removed, otherwise it cannot be triggered when clicked.
        const onClick = isDefined ? this.onLinkClick.bind(this, this.variableName.trim()) : null;
        return html `<span class="${classes}" title="${title}" @mousedown=${onClick} role="link" tabindex="-1">${variableName}</span>`;
    }
    render() {
        const functionParts = this.parseVariableFunctionParts();
        if (!functionParts) {
            render('', this.shadow, { eventContext: this });
            return;
        }
        const link = this.renderLink(functionParts.name);
        // Disabled until https://crbug.com/1079231 is fixed.
        // clang-format off
        render(html `<style>
      .css-var-link:not(.undefined) {
        cursor: pointer;
        text-decoration: underline;
        text-underline-position: under;
      }

      .css-var-link:focus:not(:focus-visible) {
        outline: none;
      }
      </style><span title="${this.computedValue || ''}">${functionParts.pre}${link}${functionParts.post}</span>`, this.shadow, { eventContext: this });
        // clang-format on
    }
}
if (!customElements.get('devtools-css-var-swatch')) {
    customElements.define('devtools-css-var-swatch', CSSVarSwatch);
}
//# sourceMappingURL=CSSVarSwatch.js.map