// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as LitHtml from '../../third_party/lit-html/lit-html.js';
export const primitiveRenderer = (value) => {
    return LitHtml.html `${value}`;
};
export const codeBlockRenderer = (value) => {
    return LitHtml.html `<code>${value}</code>`;
};
//# sourceMappingURL=DataGridRenderers.js.map