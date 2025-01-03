import _ from 'lodash';
import { App, Target } from './models';

const INACTIVE_APP_CODE = 0;

/*
 * Takes a dictionary from the remote debugger and makes a more manageable
 * dictionary whose keys are understandable
 */
function appInfoFromDict(dict: any): App {
  const id = dict.WIRApplicationIdentifierKey;
  const isProxy = _.isString(dict.WIRIsApplicationProxyKey) ? dict.WIRIsApplicationProxyKey.toLowerCase() === 'true' : dict.WIRIsApplicationProxyKey;

  const entry: App = {
    id,
    isProxy,
    name: dict.WIRApplicationNameKey,
    bundleId: dict.WIRApplicationBundleIdentifierKey,
    hostId: dict.WIRHostApplicationIdentifierKey,
    isActive: dict.WIRIsApplicationActiveKey !== INACTIVE_APP_CODE,
  };

  return entry;
}

/*
 * Take a dictionary from the remote debugger and makes a more manageable
 * dictionary of pages available.
 */
function pageArrayFromDict(pageDict: any, appId: string, deviceId: string): Target[] {
  if (pageDict.id) {
    // the page is already translated, so wrap in an array and pass back
    return [pageDict];
  }
  let newPageArray = [];
  for (const dict of _.values(pageDict)) {
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

export { appInfoFromDict, pageArrayFromDict };
