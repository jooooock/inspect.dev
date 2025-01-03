// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as LitHtml from '../third_party/lit-html/lit-html.js';
export class ElementsPanelLink extends HTMLElement {
    constructor() {
        super(...arguments);
        this.shadow = this.attachShadow({ mode: 'open' });
        this.onElementRevealIconClick = () => { };
        this.onElementRevealIconMouseEnter = () => { };
        this.onElementRevealIconMouseLeave = () => { };
    }
    set data(data) {
        this.onElementRevealIconClick = data.onElementRevealIconClick;
        this.onElementRevealIconMouseEnter = data.onElementRevealIconMouseEnter;
        this.onElementRevealIconMouseLeave = data.onElementRevealIconMouseLeave;
        this.update();
    }
    update() {
        this.render();
    }
    render() {
        // clang-format off
        LitHtml.render(LitHtml.html `
      <style>
        .element-reveal-icon {
          display: inline-block;
          width: 28px;
          height: 24px;
          -webkit-mask-position:-140px 96px;
          -webkit-mask-image: url(Images/largeIcons.svg);
          background-color: rgb(110 110 110);
        }
      </style>
      <span
        class="element-reveal-icon"
        @click=${this.onElementRevealIconClick}
        @mouseenter=${this.onElementRevealIconMouseEnter}
        @mouseleave=${this.onElementRevealIconMouseLeave}></span>
      `, this.shadow);
        // clang-format on
    }
}
customElements.define('devtools-elements-panel-link', ElementsPanelLink);
//# sourceMappingURL=ElementsPanelLink.js.map