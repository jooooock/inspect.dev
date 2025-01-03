"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CSS = void 0;
class CSS {
    constructor(protocolAdaptor) {
        this.protocolAdaptor = protocolAdaptor;
        // # Chromium APIs:
        // https://chromedevtools.github.io/devtools-protocol/tot/CSS/
        // No mapping needed
        // - CSS.enable
        // - CSS.disable
        // - CSS.createStyleSheet
        // - CSS.forcePseudoState
        // - CSS.getComputedStyleForNode
        // - CSS.getStyleSheetText
        // - CSS.setStyleSheetText
        // ## Mapped
        // - CSS.addRule
        // - CSS.setStyleText
        // - CSS.styleSheetAdded
        // - CSS.getInlineStylesForNode
        // - CSS.getMatchedStylesForNode
        // - CSS.setRuleSelector
        // Not implemented
        // - CSS.collectClassNames
        // - CSS.getBackgroundColors
        // - CSS.getMediaQueries
        // - CSS.getPlatformFontsForNode
        // - CSS.setEffectivePropertyValueForNode
        // - CSS.setKeyframeKey
        // - CSS.setMediaText
        // - CSS.startRuleUsageTracking
        // - CSS.stopRuleUsageTracking
        // - CSS.takeCoverageDelta
        // - CSS.setLocalFontsEnabled EXPERIMENTAL
        // - CSS.takeComputedStyleUpdates EXPERIMENTAL
        // - CSS.trackComputedStyleUpdates EXPERIMENTAL
        // Webkit APIs
        // - CSS.getAllStyleSheets
        // - CSS.getStyleSheet
        // - CSS.getSupportedCSSProperties
        // - CSS.getSupportedSystemFontFamilyNames
        this.protocolAdaptor.addMessageFilter('tools::CSS.addRule', this.addRule.bind(this));
        this.protocolAdaptor.addMessageFilter('tools::CSS.setStyleTexts', this.setStyleTexts.bind(this));
        this.protocolAdaptor.addMessageFilter('tools::CSS.setRuleSelector', this.setRuleSelector.bind(this));
        this.protocolAdaptor.addMessageFilter('tools::CSS.getMatchedStylesForNode', this.getMatchedStylesForNode.bind(this));
        this.protocolAdaptor.addMessageFilter('tools::CSS.enable', this.enable.bind(this));
        this.protocolAdaptor.addMessageFilter('target::CSS.getInlineStylesForNode', this.getInlineStylesForNodeResult.bind(this));
        // Events
        this.protocolAdaptor.addMessageFilter('target::CSS.styleSheetAdded', this.onCssStyleSheetAdded.bind(this));
    }
    async enable(msg) {
        // Note: Webkit doesnt automaticlly send StyleSheets on CSS enable, so we have to fetch them.
        // Source: https://github.com/WebKit/WebKit/blob/50eacad0eac07a2b6d54b0e01549a3c2708da972/Source/WebInspectorUI/UserInterface/Controllers/CSSManager.js#L540
        this.getAllStyleSheets();
        return msg;
    }
    async setStyleTexts(msg) {
        // Chromium: https://github.com/ChromeDevTools/devtools-protocol/blob/master/json/browser_protocol.json#L2996
        // Webkit: https://github.com/WebKit/webkit/blob/master/Source/JavaScriptCore/inspector/protocol/CSS.json#L316
        let params = msg.params;
        const originalRequestId = msg.id;
        let allResults = [];
        // Convert all the requests into individual calls to setStyleText
        for (let i = 0; i < params.edits.length; i++) {
            const edit = params.edits[i];
            try {
                const styleId = await this.transformStyleSheetIdToStyleId(edit.styleSheetId, edit.range);
                const requestParams = {
                    styleId: {
                        styleSheetId: styleId.styleSheetId,
                        ordinal: styleId.ordinal,
                    },
                    text: edit.text,
                };
                let setStyleResult = await this.protocolAdaptor.makeRequest('CSS.setStyleText', requestParams);
                let styleResult = this.transformCssStyle(setStyleResult.style);
                this.protocolAdaptor.fireEventToClient('CSS.styleSheetChanged', {
                    styleSheetId: edit.styleSheetId,
                });
                allResults.push(styleResult);
            }
            catch (error) {
                this.protocolAdaptor.logger.error('onCssSetStyleTexts.range.failed', error, edit);
            }
        }
        // Combine all the setStyleText calls into a single result
        const result = {
            styles: allResults,
        };
        this.protocolAdaptor.fireResultToClient(originalRequestId, result);
        return null;
    }
    async setRuleSelector(msg) {
        let params = msg.params;
        let ruleId = await this.transformStyleSheetIdToStyleId(params.styleSheetId, params.range);
        if (!ruleId) {
            this.protocolAdaptor.logger.error('CSSRuleID couldnt be resolved');
        }
        let webkitParams = {
            ruleId: ruleId,
            selector: params.selector,
        };
        msg.params = webkitParams;
        return msg;
    }
    async addRule(msg) {
        let params = msg.params;
        // Convert into an Webkit rule on the current node
        const selector = msg.params.ruleText.trim().replace('{}', '');
        const webkitParams = {
            contextNodeId: this.lastNodeId, // legacy webkit
            styleSheetId: params.styleSheetId,
            selector: selector,
        };
        this.protocolAdaptor
            .makeRequest('CSS.addRule', webkitParams)
            .then(result => {
            result.rule = this.transformCssRule(result.rule);
            this.protocolAdaptor.fireResultToClient(msg.id, result);
        })
            .catch(() => {
            this.protocolAdaptor.logger.error('request failed');
        });
        return null;
    }
    async getInlineStylesForNodeResult(msg) {
        const webkitResult = msg.result;
        if (webkitResult) {
            let result = {
                inlineStyle: this.transformCssStyle(webkitResult.inlineStyle),
                attributesStyle: this.transformCssStyle(webkitResult.attributesStyle),
            };
            msg.result = result;
        }
        return msg;
    }
    async onCssStyleSheetAdded(msg) {
        let webkitHeader = msg.params.header;
        let chromiumHeader = this.transformStyleSheetHeader(webkitHeader);
        msg.params.header = chromiumHeader;
        return msg;
    }
    async getMatchedStylesForNode(msg) {
        // Store the last selected nodeId so we can add new rules to this node
        this.lastNodeId = msg.params.nodeId;
        try {
            const inlineStylesReq = await this.protocolAdaptor.makeRequest('CSS.getInlineStylesForNode', {
                nodeId: msg.params.nodeId,
            });
            const matchedStylesReq = await this.protocolAdaptor.makeRequest('CSS.getMatchedStylesForNode', {
                nodeId: msg.params.nodeId,
                includePseudo: true,
                includeInherited: true,
            });
            let result = {
                inlineStyle: this.transformCssStyle(inlineStylesReq.inlineStyle),
                attributesStyle: this.transformCssStyle(inlineStylesReq.attributesStyle),
                matchedCSSRules: this.transformCssRuleMatchList(matchedStylesReq.matchedCSSRules),
                pseudoElements: this.transformCssPseudoElementMatches(matchedStylesReq.pseudoElements),
                inherited: this.transformCssInheritedStyleEntry(matchedStylesReq.inherited),
            };
            this.protocolAdaptor.fireResultToClient(msg.id, result);
        }
        catch (error) {
            this.protocolAdaptor.fireResultToClient(msg.id, {
                error: error,
            });
        }
        return null;
    }
    async getAllStyleSheets() {
        let allStylesheetHeaders = await this.protocolAdaptor.makeRequest('CSS.getAllStyleSheets', {});
        if (!allStylesheetHeaders) {
            return;
        }
        let mappedHeaders = allStylesheetHeaders.headers.map(this.transformStyleSheetHeader);
        mappedHeaders.forEach(header => {
            this.protocolAdaptor.fireEventToClient('CSS.styleSheetAdded', {
                header: header,
            });
        });
        return null;
    }
    // CSS transform functions
    transformStyleSheetHeader(webkitHeader) {
        // CSSStyleSheetHeader
        // Chromium: https://github.com/ChromeDevTools/devtools-protocol/blob/master/json/browser_protocol.json#L2042
        // Webkit: https://github.com/WebKit/webkit/blob/master/Source/JavaScriptCore/inspector/protocol/CSS.json#L113
        let chromiumHeader = {
            // Webkit
            styleSheetId: webkitHeader.styleSheetId,
            frameId: webkitHeader.frameId,
            sourceURL: webkitHeader.sourceURL,
            origin: ['regular', 'author'].includes(webkitHeader.origin) ? 'regular' : webkitHeader.origin, // handle https://github.com/WebKit/WebKit/commit/b978ad26298d8c746f0bc8a1ec39f052ff4e3a74
            title: webkitHeader.title,
            disabled: webkitHeader.disabled,
            // COMPATIBILITY (iOS 9): The info did not have 'isInline', 'startLine', and 'startColumn', so make false and 0 in these cases.
            isInline: webkitHeader.isInline || false,
            startLine: webkitHeader.startLine || 0,
            startColumn: webkitHeader.startColumn || 0,
            // Mapping
            // hasSourceURL: webkitHeader.sourceURL ? true : false,
            isMutable: ['inspector'].includes(webkitHeader.origin),
            isConstructed: ['inspector'].includes(webkitHeader.origin),
            length: 1000, // TODO: Fix this
            endLine: 0, // TODO: Fix this
            endColumn: 0, // TODO: Fix this
        };
        return chromiumHeader;
    }
    transformCssSelector(cssSelector, sourceRange) {
        if (!cssSelector) {
            return;
        }
        return {
            // Webkit
            text: cssSelector.text,
            // Mapping
            range: sourceRange,
        };
    }
    transformCssSelectorList(selectorList) {
        if (!selectorList) {
            return;
        }
        // Each iOS version needs to map this differently
        let sourceRange = selectorList.range;
        return {
            selectors: selectorList.selectors.map(selector => {
                return this.transformCssSelector(selector, sourceRange);
            }),
            text: selectorList.text,
        };
    }
    mapCssProperty(cssProperty) {
        if (!cssProperty) {
            return;
        }
        return {
            // Webkit
            name: cssProperty.name,
            value: cssProperty.value,
            implicit: cssProperty.implicit,
            text: cssProperty.text,
            parsedOk: cssProperty.parsedOk || true, // Absent implies true per https://github.com/WebKit/webkit/blob/main/Source/JavaScriptCore/inspector/protocol/CSS.json#L220
            // Mapping
            important: !!cssProperty.priority,
            disabled: cssProperty.status === 'disabled',
            range: cssProperty.range,
        };
    }
    transformCssStyle(cssStyle) {
        if (!cssStyle) {
            return;
        }
        let cssProperties = cssStyle.cssProperties.map(this.mapCssProperty);
        const result = {
            // Webkit
            shorthandEntries: cssStyle.shorthandEntries,
            cssText: cssStyle.cssText,
            // Optional
            styleSheetId: this.transformStyleIdToStyleSheetId(cssStyle.styleId),
            range: cssStyle.range,
            // Mapping
            cssProperties: cssProperties,
        };
        return result;
    }
    transformCssRule(cssRule) {
        if (!cssRule) {
            return;
        }
        let result = {
            // Webkit
            origin: cssRule.origin,
            // Mapping
            style: this.transformCssStyle(cssRule.style),
            selectorList: this.transformCssSelectorList(cssRule.selectorList),
        };
        if ('ruleId' in cssRule) {
            result.styleSheetId = cssRule.ruleId.styleSheetId;
        }
        // Transform webkit groupings to Chromium CSSMedia
        if ('groupings' in cssRule) {
            result.media = [];
            cssRule.groupings.forEach((grouping) => {
                result.media.push({
                    text: grouping.text,
                    sourceURL: grouping.sourceURL,
                    source: this.transformGroupingSourceToCSSMediaSource(grouping.type),
                });
            });
        }
        return result;
    }
    transformGroupingSourceToCSSMediaSource(source) {
        if (source == 'media-rule') {
            return 'mediaRule';
        }
        else if (source == 'media-import-rule') {
            return 'importRule';
        }
        else if (source == 'media-style-node') {
            return 'inlineSheet';
        }
        else if (source == 'media-link-node') {
            return 'linkedSheet';
        }
    }
    transformCssRuleMatchList(matchedCSSRules) {
        if (!matchedCSSRules) {
            return [];
        }
        let transformedRuleMatches = matchedCSSRules.map(ruleMatch => {
            return {
                // Webkit
                matchingSelectors: ruleMatch.matchingSelectors,
                // Mapping
                rule: this.transformCssRule(ruleMatch.rule),
            };
        });
        return transformedRuleMatches;
    }
    transformCssPseudoElementMatches(pseudoElements) {
        if (!pseudoElements) {
            return [];
        }
        let transformedPseudoElementMatches = pseudoElements.map(pseudoElementMatch => {
            return {
                // Mapping
                pseudoType: pseudoElementMatch.pseudoId,
                matches: this.transformCssRuleMatchList(pseudoElementMatch.matches),
            };
        });
        return transformedPseudoElementMatches;
    }
    transformCssInheritedStyleEntry(inherited) {
        if (!inherited) {
            return [];
        }
        let transformedPseudoElementMatches = inherited.map(inheritedStyleEntry => {
            return {
                // Mapping
                inlineStyle: this.transformCssStyle(inheritedStyleEntry.inlineStyle),
                matchedCSSRules: this.transformCssRuleMatchList(inheritedStyleEntry.matchedCSSRules),
            };
        });
        return transformedPseudoElementMatches;
    }
    transformStyleIdToStyleSheetId(styleId) {
        return styleId ? `${styleId.styleSheetId}` : null;
    }
    async transformStyleSheetIdToStyleId(styleSheetId, range) {
        // return CSSRuleID: https://github.com/WebKit/webkit/blob/master/Source/JavaScriptCore/inspector/protocol/CSS.json#L27
        // Webkit uses ordinals to map CSSRules to a location in the document. Chromium uses ranges.
        // Fortunately, if we get the style sheet, we can with minimal effort find the existing range that matches the Chromium edit range and return that ordinal in the rules listen
        // We make the assumption that a rule location can only match once and return the first instance.
        this.protocolAdaptor.logger.info('transformStyleSheetToCSSRuleId.start', styleSheetId, range);
        try {
            let allStylesheetHeaders = await this.protocolAdaptor.makeRequest('CSS.getAllStyleSheets', {});
            let doesStylesheetAlreadyExist = allStylesheetHeaders.headers.find(s => s.styleSheetId == styleSheetId);
            if (doesStylesheetAlreadyExist) {
                let styleSheetBody = await this.protocolAdaptor.makeRequest('CSS.getStyleSheet', {
                    styleSheetId: styleSheetId,
                });
                const length = styleSheetBody.styleSheet.rules.length;
                for (let ordinal = 0; ordinal < length; ordinal++) {
                    let rule = styleSheetBody.styleSheet.rules[ordinal];
                    if (this.compareRanges(rule.style.range, range)) {
                        return {
                            styleSheetId: styleSheetId,
                            ordinal: ordinal,
                        };
                    }
                }
            }
            else {
                return {
                    styleSheetId: styleSheetId,
                    ordinal: 0,
                };
            }
        }
        catch (error) {
            return {
                styleSheetId: styleSheetId,
                ordinal: 0,
            };
        }
    }
    // Called on a Chrome range and an iOS range
    compareRanges(rangeLeft, rangeRight) {
        return (rangeLeft.startLine === rangeRight.startLine &&
            rangeLeft.endLine === rangeRight.endLine &&
            rangeLeft.startColumn === rangeRight.startColumn &&
            rangeLeft.endColumn === rangeRight.endColumn);
    }
}
exports.CSS = CSS;
//# sourceMappingURL=css.js.map