"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pageArrayFromDict = exports.appInfoFromDict = void 0;
const lodash_1 = __importDefault(require("lodash"));
const INACTIVE_APP_CODE = 0;
/*
 * Takes a dictionary from the remote debugger and makes a more manageable
 * dictionary whose keys are understandable
 */
function appInfoFromDict(dict) {
    const id = dict.WIRApplicationIdentifierKey;
    const isProxy = lodash_1.default.isString(dict.WIRIsApplicationProxyKey) ? dict.WIRIsApplicationProxyKey.toLowerCase() === 'true' : dict.WIRIsApplicationProxyKey;
    const entry = {
        id,
        isProxy,
        name: dict.WIRApplicationNameKey,
        bundleId: dict.WIRApplicationBundleIdentifierKey,
        hostId: dict.WIRHostApplicationIdentifierKey,
        isActive: dict.WIRIsApplicationActiveKey !== INACTIVE_APP_CODE,
    };
    return entry;
}
exports.appInfoFromDict = appInfoFromDict;
/*
 * Take a dictionary from the remote debugger and makes a more manageable
 * dictionary of pages available.
 */
function pageArrayFromDict(pageDict, appId, deviceId) {
    if (pageDict.id) {
        // the page is already translated, so wrap in an array and pass back
        return [pageDict];
    }
    let newPageArray = [];
    for (const dict of lodash_1.default.values(pageDict)) {
        newPageArray.push({
            id: `${deviceId}|${appId}|${dict.WIRPageIdentifierKey}`,
            appId: appId,
            deviceId: deviceId,
            pageId: dict.WIRPageIdentifierKey,
            title: dict.WIRTitleKey,
            url: dict.WIRURLKey,
            type: dict.WIRTypeKey,
            isDebuggable: typeof dict.WIRConnectionIdentifierKey === 'undefined',
        });
    }
    return newPageArray;
}
exports.pageArrayFromDict = pageArrayFromDict;
//# sourceMappingURL=utils.js.map