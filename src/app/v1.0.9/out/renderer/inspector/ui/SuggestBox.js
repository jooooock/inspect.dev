/*
 * Copyright (C) 2013 Google Inc. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Google Inc. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
import * as ARIAUtils from './ARIAUtils.js';
import { Size } from './Geometry.js';
import { AnchorBehavior, GlassPane } from './GlassPane.js';
import { Icon } from './Icon.js';
import { ListControl, ListMode } from './ListControl.js'; // eslint-disable-line no-unused-vars
import { ListModel } from './ListModel.js';
import { measurePreferredSize } from './UIUtils.js';
import { createShadowRootWithCoreStyles } from './utils/create-shadow-root-with-core-styles.js';
import { measuredScrollbarWidth } from './utils/measured-scrollbar-width.js';
/**
 * @interface
 */
export class SuggestBoxDelegate {
    /**
     * @param {?Suggestion} suggestion
     * @param {boolean=} isIntermediateSuggestion
     */
    applySuggestion(suggestion, isIntermediateSuggestion) {
    }
    /**
     * acceptSuggestion will be always called after call to applySuggestion with isIntermediateSuggestion being equal to false.
     */
    acceptSuggestion() {
    }
}
/**
 * @implements {ListDelegate<!Suggestion>}
 */
export class SuggestBox {
    /**
     * @param {!SuggestBoxDelegate} suggestBoxDelegate
     * @param {number=} maxItemsHeight
     */
    constructor(suggestBoxDelegate, maxItemsHeight) {
        this._suggestBoxDelegate = suggestBoxDelegate;
        this._maxItemsHeight = maxItemsHeight;
        this._rowHeight = 17;
        this._userEnteredText = '';
        this._defaultSelectionIsDimmed = false;
        /** @type {?Suggestion} */
        this._onlyCompletion = null;
        /** @type {!ListModel<!Suggestion>} */
        this._items = new ListModel();
        /** @type {!ListControl<!Suggestion>} */
        this._list = new ListControl(this._items, this, ListMode.EqualHeightItems);
        this._element = this._list.element;
        this._element.classList.add('suggest-box');
        this._element.addEventListener('mousedown', event => event.preventDefault(), true);
        this._element.addEventListener('click', this._onClick.bind(this), false);
        this._glassPane = new GlassPane();
        this._glassPane.setAnchorBehavior(AnchorBehavior.PreferBottom);
        this._glassPane.setOutsideClickCallback(this.hide.bind(this));
        const shadowRoot = createShadowRootWithCoreStyles(this._glassPane.contentElement, { cssFile: 'ui/suggestBox.css', enableLegacyPatching: true, delegatesFocus: undefined });
        shadowRoot.appendChild(this._element);
    }
    /**
     * @return {boolean}
     */
    visible() {
        return this._glassPane.isShowing();
    }
    /**
     * @param {!AnchorBox} anchorBox
     */
    setPosition(anchorBox) {
        this._glassPane.setContentAnchorBox(anchorBox);
    }
    /**
     * @param {!AnchorBehavior} behavior
     */
    setAnchorBehavior(behavior) {
        this._glassPane.setAnchorBehavior(behavior);
    }
    /**
     * @param {!Suggestions} items
     */
    _updateMaxSize(items) {
        const maxWidth = this._maxWidth(items);
        const length = this._maxItemsHeight ? Math.min(this._maxItemsHeight, items.length) : items.length;
        const maxHeight = length * this._rowHeight;
        this._glassPane.setMaxContentSize(new Size(maxWidth, maxHeight));
    }
    /**
     * @param {!Suggestions} items
     * @return {number}
     */
    _maxWidth(items) {
        const kMaxWidth = 300;
        if (!items.length) {
            return kMaxWidth;
        }
        let maxItem;
        let maxLength = -Infinity;
        for (let i = 0; i < items.length; i++) {
            const length = (items[i].title || items[i].text).length + (items[i].subtitle || '').length;
            if (length > maxLength) {
                maxLength = length;
                maxItem = items[i];
            }
        }
        const element = this.createElementForItem(/** @type {!Suggestion} */ (maxItem));
        const preferredWidth = measurePreferredSize(element, this._element).width + measuredScrollbarWidth(this._element.ownerDocument);
        return Math.min(kMaxWidth, preferredWidth);
    }
    _show() {
        if (this.visible()) {
            return;
        }
        // TODO(dgozman): take document as a parameter.
        this._glassPane.show(document);
        const suggestion = /** @type {!Suggestion} */ ({ text: '1', subtitle: '12' });
        this._rowHeight = measurePreferredSize(this.createElementForItem(suggestion), this._element).height;
    }
    hide() {
        if (!this.visible()) {
            return;
        }
        this._glassPane.hide();
    }
    /**
     * @param {boolean=} isIntermediateSuggestion
     * @return {boolean}
     */
    _applySuggestion(isIntermediateSuggestion) {
        if (this._onlyCompletion) {
            ARIAUtils.alert(ls `${this._onlyCompletion.text}, suggestion ${this._list.selectedIndex() + 1} of ${this._items.length}`, this._element);
            this._suggestBoxDelegate.applySuggestion(this._onlyCompletion, isIntermediateSuggestion);
            return true;
        }
        const suggestion = this._list.selectedItem();
        if (suggestion && suggestion.text) {
            ARIAUtils.alert(ls `${suggestion.title || suggestion.text}, suggestion ${this._list.selectedIndex() + 1} of ${this._items.length}`, this._element);
        }
        this._suggestBoxDelegate.applySuggestion(suggestion, isIntermediateSuggestion);
        return this.visible() && Boolean(suggestion);
    }
    /**
     * @return {boolean}
     */
    acceptSuggestion() {
        const result = this._applySuggestion();
        this.hide();
        if (!result) {
            return false;
        }
        this._suggestBoxDelegate.acceptSuggestion();
        return true;
    }
    /**
     * @override
     * @param {!Suggestion} item
     * @return {!Element}
     */
    createElementForItem(item) {
        const query = this._userEnteredText;
        const element = document.createElement('div');
        element.classList.add('suggest-box-content-item');
        element.classList.add('source-code');
        if (item.iconType) {
            const icon = Icon.create(item.iconType, 'suggestion-icon');
            element.appendChild(icon);
        }
        if (item.isSecondary) {
            element.classList.add('secondary');
        }
        element.tabIndex = -1;
        const maxTextLength = 50 + query.length;
        const displayText = (item.title || item.text).trim().trimEndWithMaxLength(maxTextLength).replace(/\n/g, '\u21B5');
        const titleElement = element.createChild('span', 'suggestion-title');
        const index = displayText.toLowerCase().indexOf(query.toLowerCase());
        if (index > 0) {
            titleElement.createChild('span').textContent = displayText.substring(0, index);
        }
        if (index > -1) {
            titleElement.createChild('span', 'query').textContent = displayText.substring(index, index + query.length);
        }
        titleElement.createChild('span').textContent = displayText.substring(index > -1 ? index + query.length : 0);
        titleElement.createChild('span', 'spacer');
        if (item.subtitleRenderer) {
            const subtitleElement = /** @type {!HTMLElement} */ (item.subtitleRenderer.call(null));
            subtitleElement.classList.add('suggestion-subtitle');
            element.appendChild(subtitleElement);
        }
        else if (item.subtitle) {
            const subtitleElement = element.createChild('span', 'suggestion-subtitle');
            subtitleElement.textContent = item.subtitle.trimEndWithMaxLength(maxTextLength - displayText.length);
        }
        if (item.iconElement) {
            element.appendChild(item.iconElement);
        }
        return element;
    }
    /**
     * @override
     * @param {!Suggestion} item
     * @return {number}
     */
    heightForItem(item) {
        return this._rowHeight;
    }
    /**
     * @override
     * @param {!Suggestion} item
     * @return {boolean}
     */
    isItemSelectable(item) {
        return true;
    }
    /**
     * @override
     * @param {?Suggestion} from
     * @param {?Suggestion} to
     * @param {?Element} fromElement
     * @param {?Element} toElement
     */
    selectedItemChanged(from, to, fromElement, toElement) {
        if (fromElement) {
            fromElement.classList.remove('selected', 'force-white-icons');
        }
        if (toElement) {
            toElement.classList.add('selected');
            toElement.classList.add('force-white-icons');
        }
        this._applySuggestion(true);
    }
    /**
     * @override
     * @param {?Element} fromElement
     * @param {?Element} toElement
     * @return {boolean}
     */
    updateSelectedItemARIA(fromElement, toElement) {
        return false;
    }
    /**
     * @param {!Event} event
     */
    _onClick(event) {
        const item = this._list.itemForNode(/** @type {?Node} */ (event.target));
        if (!item) {
            return;
        }
        this._list.selectItem(item);
        this.acceptSuggestion();
        event.consume(true);
    }
    /**
     * @param {!Suggestions} completions
     * @param {?Suggestion} highestPriorityItem
     * @param {boolean} canShowForSingleItem
     * @param {string} userEnteredText
     * @return {boolean}
     */
    _canShowBox(completions, highestPriorityItem, canShowForSingleItem, userEnteredText) {
        if (!completions || !completions.length) {
            return false;
        }
        if (completions.length > 1) {
            return true;
        }
        if (!highestPriorityItem || highestPriorityItem.isSecondary ||
            !highestPriorityItem.text.startsWith(userEnteredText)) {
            return true;
        }
        // Do not show a single suggestion if it is the same as user-entered query, even if allowed to show single-item suggest boxes.
        return canShowForSingleItem && highestPriorityItem.text !== userEnteredText;
    }
    /**
     * @param {!AnchorBox} anchorBox
     * @param {!Suggestions} completions
     * @param {boolean} selectHighestPriority
     * @param {boolean} canShowForSingleItem
     * @param {string} userEnteredText
     */
    updateSuggestions(anchorBox, completions, selectHighestPriority, canShowForSingleItem, userEnteredText) {
        this._onlyCompletion = null;
        const highestPriorityItem = selectHighestPriority ? completions.reduce((a, b) => (a.priority || 0) >= (b.priority || 0) ? a : b) : null;
        if (this._canShowBox(completions, highestPriorityItem, canShowForSingleItem, userEnteredText)) {
            this._userEnteredText = userEnteredText;
            this._show();
            this._updateMaxSize(completions);
            this._glassPane.setContentAnchorBox(anchorBox);
            this._list.invalidateItemHeight();
            this._items.replaceAll(completions);
            if (highestPriorityItem && !highestPriorityItem.isSecondary) {
                this._list.selectItem(highestPriorityItem, true);
            }
            else {
                this._list.selectItem(null);
            }
        }
        else {
            if (completions.length === 1) {
                this._onlyCompletion = completions[0];
                this._applySuggestion(true);
            }
            this.hide();
        }
    }
    /**
     * @param {!KeyboardEvent} event
     * @return {boolean}
     */
    keyPressed(event) {
        switch (event.key) {
            case 'Enter':
                return this.enterKeyPressed();
            case 'ArrowUp':
                return this._list.selectPreviousItem(true, false);
            case 'ArrowDown':
                return this._list.selectNextItem(true, false);
            case 'PageUp':
                return this._list.selectItemPreviousPage(false);
            case 'PageDown':
                return this._list.selectItemNextPage(false);
        }
        return false;
    }
    /**
     * @return {boolean}
     */
    enterKeyPressed() {
        const hasSelectedItem = Boolean(this._list.selectedItem()) || Boolean(this._onlyCompletion);
        this.acceptSuggestion();
        // Report the event as non-handled if there is no selected item,
        // to commit the input or handle it otherwise.
        return hasSelectedItem;
    }
}
/**
 * @typedef {{
  *      text: string,
  *      title: (string|undefined),
  *      subtitle: (string|undefined),
  *      iconType: (string|undefined),
  *      priority: (number|undefined),
  *      isSecondary: (boolean|undefined),
  *      subtitleRenderer: ((function():!Element)|undefined),
  *      selectionRange: ({startColumn: number, endColumn: number}|undefined),
  *      hideGhostText: (boolean|undefined),
  *      iconElement: (!HTMLElement|undefined),
  * }}
  */
// @ts-ignore typedef
export let Suggestion;
/**
  * @typedef {!Array<!Suggestion>}
  */
// @ts-ignore typedef
export let Suggestions;
/**
  * @typedef {{
    *     substituteRangeCallback: ((function(number, number):?TextUtils.TextRange.TextRange)|undefined),
    *     tooltipCallback: ((function(number, number):!Promise<?Element>)|undefined),
    *     suggestionsCallback: ((function(!TextUtils.TextRange.TextRange, !TextUtils.TextRange.TextRange, boolean=):?Promise.<!Suggestions>)|undefined),
    *     isWordChar: ((function(string):boolean)|undefined),
    *     anchorBehavior: (AnchorBehavior|undefined)
    * }}
    */
// @ts-ignore typedef
export let AutocompleteConfig;
//# sourceMappingURL=SuggestBox.js.map