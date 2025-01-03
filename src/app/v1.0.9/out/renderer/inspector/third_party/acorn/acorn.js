// Copyright (c) 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as acorn from './package/dist/acorn.mjs.js';
export let Token;
export let Comment;
export const tokTypes = acorn.tokTypes;
export const Parser = acorn.Parser;
export const tokenizer = acorn.Parser.tokenizer.bind(acorn.Parser);
export const parse = acorn.Parser.parse.bind(acorn.Parser);
//# sourceMappingURL=acorn.js.map
