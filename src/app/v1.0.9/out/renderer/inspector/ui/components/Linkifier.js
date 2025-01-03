// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as LitHtml from '../../third_party/lit-html/lit-html.js';
import * as LinkifierUtils from './LinkifierUtils.js';
export class LinkifierClick extends Event {
    constructor(data) {
        super('linkifier-activated', {
            bubbles: true,
            composed: true,
        });
        this.data = data;
    }
}
export class Linkifier extends HTMLElement {
    constructor() {
        super(...arguments);
        this.shadow = this.attachShadow({ mode: 'open' });
        this.url = '';
    }
    set data(data) {
        this.url = data.url;
        this.lineNumber = data.lineNumber;
        this.columnNumber = data.columnNumber;
        this.render();
    }
    onLinkActivation(event) {
        event.preventDefault();
        const linkifierClickEvent = new LinkifierClick({
            url: this.url,
            lineNumber: this.lineNumber,
            columnNumber: this.columnNumber,
        });
        this.dispatchEvent(linkifierClickEvent);
    }
    render() {
        if (!this.url) {
            throw new Error('Cannot construct a Linkifier without providing a valid string URL.');
        }
        // Disabled until https://crbug.com/1079231 is fixed.
        // clang-format off
        return LitHtml.render(LitHtml.html `
      <style>
         .link:link, .link:visited {
            color: var(--color-link);
            text-decoration: underline;
            cursor: pointer;
         }
      </style>
      <a class="link" href=${this.url} @click=${this.onLinkActivation}>${LinkifierUtils.linkText(this.url, this.lineNumber)}</a>
    `, this.shadow, { eventContext: this });
        // clang-format on
    }
}
customElements.define('devtools-linkifier', Linkifier);
//# sourceMappingURL=Linkifier.js.map