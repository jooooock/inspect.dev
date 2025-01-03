// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as Common from '../common/common.js';
/**
 * @interface
 */
export class MarkerDecorator {
    /**
     * @param {!SDK.DOMModel.DOMNode} node
     * @return {?{title: string, color: string}}
     */
    decorate(node) {
        throw new Error('Not implemented yet');
    }
}
/**
 * @implements {MarkerDecorator}
 */
export class GenericDecorator {
    /**
     * @param {!Root.Runtime.Extension} extension
     */
    constructor(extension) {
        this._title = Common.UIString.UIString(extension.title());
        this._color = /** @type {string} */ (extension.descriptor()['color']);
    }
    /**
     * @override
     * @param {!SDK.DOMModel.DOMNode} node
     * @return {?{title: string, color: string}}
     */
    decorate(node) {
        return { title: this._title, color: this._color };
    }
}
//# sourceMappingURL=MarkerDecorator.js.map