"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultLogger = void 0;
class DefaultLogger {
    error(...params) {
        console.error(...params);
    }
    warn(...params) {
        console.warn(...params);
    }
    info(...params) {
        console.info(...params);
    }
    debug(...params) {
        console.debug(...params);
    }
    log(...params) {
        console.log(...params);
    }
    scope(name) {
        // TODO: Actually implement scoping
        return new DefaultLogger();
    }
}
exports.DefaultLogger = DefaultLogger;
//# sourceMappingURL=logger.js.map