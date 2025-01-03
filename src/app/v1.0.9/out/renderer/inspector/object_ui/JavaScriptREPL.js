// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as SDK from '../sdk/sdk.js';
import * as UI from '../ui/ui.js';
import { RemoteObjectPreviewFormatter } from './RemoteObjectPreviewFormatter.js';
export class JavaScriptREPL {
    /**
     * @param {string} code
     * @return {string}
     */
    static wrapObjectLiteral(code) {
        // Only parenthesize what appears to be an object literal.
        if (!(/^\s*\{/.test(code) && /\}\s*$/.test(code))) {
            return code;
        }
        const parse = (async () => 0).constructor;
        try {
            // Check if the code can be interpreted as an expression.
            parse('return ' + code + ';');
            // No syntax error! Does it work parenthesized?
            const wrappedCode = '(' + code + ')';
            parse(wrappedCode);
            return wrappedCode;
        }
        catch (e) {
            return code;
        }
    }
    /**
     * @param {string} text
     * @return {string}
     */
    static preprocessExpression(text) {
        return JavaScriptREPL.wrapObjectLiteral(text);
    }
    /**
     * @param {string} text
     * @param {boolean} throwOnSideEffect
     * @param {number=} timeout
     * @param {boolean=} allowErrors
     * @param {string=} objectGroup
     * @return {!Promise<!{preview: !DocumentFragment, result: ?SDK.RuntimeModel.EvaluationResult}>}
     */
    static async evaluateAndBuildPreview(text, throwOnSideEffect, timeout, allowErrors, objectGroup) {
        const globalObject = /** @type {?} */ (window);
        const replInstance = globalObject.ObjectUI.JavaScriptREPL;
        const executionContext = UI.Context.Context.instance().flavor(SDK.RuntimeModel.ExecutionContext);
        const maxLength = typeof replInstance._MaxLengthForEvaluation !== 'undefined' ?
            /** @type {number} */ (replInstance._MaxLengthForEvaluation) :
            MaxLengthForEvaluation;
        const isTextLong = text.length > maxLength;
        if (!text || !executionContext || (throwOnSideEffect && isTextLong)) {
            return { preview: document.createDocumentFragment(), result: null };
        }
        const expression = JavaScriptREPL.preprocessExpression(text);
        const options = {
            expression: expression,
            generatePreview: true,
            includeCommandLineAPI: true,
            throwOnSideEffect: throwOnSideEffect,
            timeout: timeout,
            objectGroup: objectGroup,
            disableBreaks: true,
            replMode: true,
            silent: undefined,
            returnByValue: undefined,
            allowUnsafeEvalBlockedByCSP: undefined
        };
        const result = await executionContext.evaluate(options, false /* userGesture */, false /* awaitPromise */);
        const preview = JavaScriptREPL._buildEvaluationPreview(result, allowErrors);
        return { preview, result };
    }
    /**
     * @param {!SDK.RuntimeModel.EvaluationResult} result
     * @param {boolean=} allowErrors
     * @return {!DocumentFragment}
     */
    static _buildEvaluationPreview(result, allowErrors) {
        const fragment = document.createDocumentFragment();
        if ('error' in result) {
            return fragment;
        }
        if (result.exceptionDetails && result.exceptionDetails.exception && result.exceptionDetails.exception.description) {
            const exception = result.exceptionDetails.exception.description;
            if (exception.startsWith('TypeError: ') || allowErrors) {
                fragment.createChild('span').textContent = result.exceptionDetails.text + ' ' + exception;
            }
            return fragment;
        }
        const formatter = new RemoteObjectPreviewFormatter();
        const { preview, type, subtype, className, description } = result.object;
        if (preview && type === 'object' && subtype !== 'node' && subtype !== 'trustedtype') {
            formatter.appendObjectPreview(fragment, preview, false /* isEntry */);
        }
        else {
            const nonObjectPreview = formatter.renderPropertyPreview(type, subtype, className, (description || '').trimEndWithMaxLength(400));
            fragment.appendChild(nonObjectPreview);
        }
        return fragment;
    }
}
/**
 * @const
 * @type {number}
 */
export const MaxLengthForEvaluation = 2000;
//# sourceMappingURL=JavaScriptREPL.js.map