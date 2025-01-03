import {
  pageArrayFromDict,
  appInfoFromDict,
  getDebuggerAppKey,
} from "../../src/lib/utils";

import _ from "lodash";

describe("utils", function () {
  describe("appInfoFromDict", function () {
    test("should return the id and entry for a dict", function () {
      let dict = {
        WIRApplicationIdentifierKey: "42",
        WIRApplicationNameKey: "App Name",
        WIRApplicationBundleIdentifierKey: "app.name",
        WIRIsApplicationProxyKey: "false",
        WIRHostApplicationIdentifierKey: "43",
      };
      let [id, entry] = appInfoFromDict(dict);

      expect(id).toBe(dict.WIRApplicationIdentifierKey);
      expect(entry.id).toBe(dict.WIRApplicationIdentifierKey);
      expect(entry.name).toBe(dict.WIRApplicationNameKey);
      expect(entry.bundleId).toBe(dict.WIRApplicationBundleIdentifierKey);
      expect(entry.isProxy).toBe(dict.WIRIsApplicationProxyKey === "true");
      expect(entry.hostId).toBe(dict.WIRHostApplicationIdentifierKey);
    });
  });

  describe("getDebuggerAppKey", function () {
    test("should return the app key for the bundle", function () {
      let appDict = {
        ["42"]: {
          bundleId: "io.appium.bundle",
        },
      };

      expect(getDebuggerAppKey("io.appium.bundle", appDict)).toBe("42");
    });

    test("should return the app key for the bundle when proxied", function () {
      let appDict = {
        ["42"]: {
          bundleId: "io.appium.bundle",
          isProxy: false,
        },
        ["43"]: {
          bundleId: "io.appium.proxied.bundle",
          isProxy: true,
          hostId: "42",
        },
      };
      expect(getDebuggerAppKey("io.appium.bundle", appDict)).toBe("43");
    });

    test("should return undefined when there is no appropriate app", function () {
      expect(getDebuggerAppKey("io.appium.bundle", {})).toBeFalsy();
    });
  });

  describe("pageArrayFromDict", function () {
    let basePageDict = {
      1: {
        WIRTitleKey: "Appium/welcome",
        WIRTypeKey: "WIRTypeWeb",
        WIRURLKey: "http://127.0.0.1:4723/welcome",
        WIRPageIdentifierKey: 1,
        WIRConnectionIdentifierKey: "e777f792-c41e-4e5d-8722-68393af663b2",
      },
    };

    test("should return a valid page array", function () {
      let pageArray = pageArrayFromDict(basePageDict);
      expect(pageArray.length).toBe(1);
    });

    test("should return a valid page array with 13.4-style type key", function () {
      const pageDict = _.defaults(
        {
          2: {
            WIRTypeKey: "WIRTypeWebPage",
          },
        },
        basePageDict
      );
      const pageArray = pageArrayFromDict(pageDict);
      expect(pageArray.length).toBe(2);
    });

    test("should not count WIRTypeWeb entries", function () {
      let pageDict = _.defaults(
        {
          2: {
            WIRTypeKey: "WIRTypeJavaScript",
          },
        },
        basePageDict
      );
      let pageArray = pageArrayFromDict(pageDict);
      expect(pageArray.length).toBe(1);
    });
  });
});
