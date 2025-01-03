// Copyright (c) 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as LitHtml from '../../third_party/lit-html/lit-html.js';
const isString = (value) => value !== undefined;
export class Icon extends HTMLElement {
    constructor() {
        super(...arguments);
        this.shadow = this.attachShadow({ mode: 'open' });
        this.iconPath = '';
        this.color = 'rgb(110 110 110)';
        this.width = '100%';
        this.height = '100%';
    }
    set data(data) {
        const { width, height } = data;
        this.color = data.color;
        this.width = isString(width) ? width : (isString(height) ? height : this.width);
        this.height = isString(height) ? height : (isString(width) ? width : this.height);
        this.iconPath = 'iconPath' in data ? data.iconPath : `Images/${data.iconName}.svg`;
        if ('iconName' in data) {
            this.iconName = data.iconName;
        }
        this.render();
    }
    get data() {
        const commonData = {
            color: this.color,
            width: this.width,
            height: this.height,
        };
        if (this.iconName) {
            return {
                ...commonData,
                iconName: this.iconName,
            };
        }
        return {
            ...commonData,
            iconPath: this.iconPath,
        };
    }
    getStyles() {
        const { iconPath, width, height, color } = this;
        const commonStyles = {
            width,
            height,
            display: 'inline-block',
        };
        if (color) {
            return {
                ...commonStyles,
                webkitMaskImage: `url(${iconPath})`,
                webkitMaskPosition: 'center',
                webkitMaskRepeat: 'no-repeat',
                webkitMaskSize: '100%',
                backgroundColor: `var(--icon-color, ${color})`,
            };
        }
        return {
            ...commonStyles,
            backgroundImage: `url(${iconPath})`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100%',
        };
    }
    render() {
        // clang-format off
        LitHtml.render(LitHtml.html `
      <style>
        :host {
          display: inline-block;
          white-space: nowrap;
        }
      </style>
      <span class="icon-basic" style=${LitHtml.Directives.styleMap(this.getStyles())}></span>
    `, this.shadow);
        // clang-format on
    }
}
if (!customElements.get('devtools-icon')) {
    customElements.define('devtools-icon', Icon);
}
//# sourceMappingURL=Icon.js.map