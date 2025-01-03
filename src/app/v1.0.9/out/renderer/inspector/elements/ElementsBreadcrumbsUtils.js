// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { ls } from '../platform/platform.js';
export const crumbsToRender = (crumbs, selectedNode) => {
    if (!selectedNode) {
        return [];
    }
    return crumbs
        .filter(crumb => {
        return crumb.nodeType !== Node.DOCUMENT_NODE;
    })
        .map(crumb => {
        return {
            title: determineElementTitle(crumb),
            selected: crumb.id === selectedNode.id,
            node: crumb,
            originalNode: crumb.legacyDomNode,
        };
    })
        .reverse();
};
const makeCrumbTitle = (main, extras = {}) => {
    return {
        main,
        extras,
    };
};
export class NodeSelectedEvent extends Event {
    constructor(node) {
        super('node-selected', {});
        this.data = node.legacyDomNode;
    }
}
export const determineElementTitle = (domNode) => {
    switch (domNode.nodeType) {
        case Node.ELEMENT_NODE: {
            if (domNode.pseudoType) {
                return makeCrumbTitle('::' + domNode.pseudoType);
            }
            const crumbTitle = makeCrumbTitle(domNode.nodeNameNicelyCased);
            const id = domNode.getAttribute('id');
            if (id) {
                crumbTitle.extras.id = id;
            }
            const classAttribute = domNode.getAttribute('class');
            if (classAttribute) {
                const classes = new Set(classAttribute.split(/\s+/));
                crumbTitle.extras.classes = Array.from(classes);
            }
            return crumbTitle;
        }
        case Node.TEXT_NODE:
            return makeCrumbTitle(ls `(text)`);
        case Node.COMMENT_NODE:
            return makeCrumbTitle('<!-->');
        case Node.DOCUMENT_TYPE_NODE:
            return makeCrumbTitle('<!doctype>');
        case Node.DOCUMENT_FRAGMENT_NODE:
            return makeCrumbTitle(domNode.shadowRootType ? '#shadow-root' : domNode.nodeNameNicelyCased);
        default:
            return makeCrumbTitle(domNode.nodeNameNicelyCased);
    }
};
//# sourceMappingURL=ElementsBreadcrumbsUtils.js.map