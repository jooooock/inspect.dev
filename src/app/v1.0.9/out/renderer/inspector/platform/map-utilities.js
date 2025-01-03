// Copyright (c) 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { Multimap } from './utilities.js';
export const inverse = function (map) {
    const result = new Multimap();
    for (const [key, value] of map.entries()) {
        result.set(value, key);
    }
    return result;
};
//# sourceMappingURL=map-utilities.js.map