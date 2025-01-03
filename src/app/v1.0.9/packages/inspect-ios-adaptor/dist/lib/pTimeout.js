"use strict";
// From https://github.com/sindresorhus/p-timeout
// Inlined due to vite bundling errors
// All credits goes to https://github.com/sindresorhus
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbortError = exports.TimeoutError = void 0;
class TimeoutError extends Error {
    constructor(message) {
        super(message);
        this.name = 'TimeoutError';
    }
}
exports.TimeoutError = TimeoutError;
/**
An error to be thrown when the request is aborted by AbortController.
DOMException is thrown instead of this Error when DOMException is available.
*/
class AbortError extends Error {
    constructor(message) {
        super();
        this.name = 'AbortError';
        this.message = message;
    }
}
exports.AbortError = AbortError;
function pTimeout(promise, options) {
    const { milliseconds, fallback, message, customTimers = { setTimeout, clearTimeout } } = options;
    let timer;
    const wrappedPromise = new Promise((resolve, reject) => {
        if (typeof milliseconds !== 'number' || Math.sign(milliseconds) !== 1) {
            throw new TypeError(`Expected \`milliseconds\` to be a positive number, got \`${milliseconds}\``);
        }
        if (milliseconds === Number.POSITIVE_INFINITY) {
            promise.then(resolve, reject);
            return;
        }
        // We create the error outside of `setTimeout` to preserve the stack trace.
        const timeoutError = new TimeoutError('message');
        timer = customTimers.setTimeout.call(undefined, () => {
            if (fallback) {
                try {
                    resolve(fallback());
                }
                catch (error) {
                    reject(error);
                }
                return;
            }
            if (typeof promise.cancel === 'function') {
                promise.cancel();
            }
            if (message === false) {
                resolve();
            }
            else if (message instanceof Error) {
                reject(message);
            }
            else {
                timeoutError.message = message !== null && message !== void 0 ? message : `Promise timed out after ${milliseconds} milliseconds`;
                reject(timeoutError);
            }
        }, milliseconds);
        (async () => {
            try {
                resolve(await promise);
            }
            catch (error) {
                reject(error);
            }
        })();
    });
    const cancelablePromise = wrappedPromise.finally(() => {
        cancelablePromise.clear();
    });
    cancelablePromise.clear = () => {
        customTimers.clearTimeout.call(undefined, timer);
        timer = undefined;
    };
    return cancelablePromise;
}
exports.default = pTimeout;
//# sourceMappingURL=pTimeout.js.map