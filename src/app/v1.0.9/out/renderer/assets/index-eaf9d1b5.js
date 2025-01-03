function getDefaultExportFromCjs(x2) {
  return x2 && x2.__esModule && Object.prototype.hasOwnProperty.call(x2, "default") ? x2["default"] : x2;
}
function getAugmentedNamespace(n2) {
  if (n2.__esModule)
    return n2;
  var f2 = n2.default;
  if (typeof f2 == "function") {
    var a = function a2() {
      if (this instanceof a2) {
        return Reflect.construct(f2, arguments, this.constructor);
      }
      return f2.apply(this, arguments);
    };
    a.prototype = f2.prototype;
  } else
    a = {};
  Object.defineProperty(a, "__esModule", { value: true });
  Object.keys(n2).forEach(function(k2) {
    var d = Object.getOwnPropertyDescriptor(n2, k2);
    Object.defineProperty(a, k2, d.get ? d : {
      enumerable: true,
      get: function() {
        return n2[k2];
      }
    });
  });
  return a;
}
var jsxRuntime = { exports: {} };
var reactJsxRuntime_production_min = {};
var react = { exports: {} };
var react_production_min = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var l$1 = Symbol.for("react.element"), n$1 = Symbol.for("react.portal"), p$2 = Symbol.for("react.fragment"), q$2 = Symbol.for("react.strict_mode"), r = Symbol.for("react.profiler"), t = Symbol.for("react.provider"), u = Symbol.for("react.context"), v$2 = Symbol.for("react.forward_ref"), w = Symbol.for("react.suspense"), x$1 = Symbol.for("react.memo"), y$1 = Symbol.for("react.lazy"), z$2 = Symbol.iterator;
function A$3(a) {
  if (null === a || "object" !== typeof a)
    return null;
  a = z$2 && a[z$2] || a["@@iterator"];
  return "function" === typeof a ? a : null;
}
var B$2 = { isMounted: function() {
  return false;
}, enqueueForceUpdate: function() {
}, enqueueReplaceState: function() {
}, enqueueSetState: function() {
} }, C$2 = Object.assign, D$2 = {};
function E$2(a, b, e) {
  this.props = a;
  this.context = b;
  this.refs = D$2;
  this.updater = e || B$2;
}
E$2.prototype.isReactComponent = {};
E$2.prototype.setState = function(a, b) {
  if ("object" !== typeof a && "function" !== typeof a && null != a)
    throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
  this.updater.enqueueSetState(this, a, b, "setState");
};
E$2.prototype.forceUpdate = function(a) {
  this.updater.enqueueForceUpdate(this, a, "forceUpdate");
};
function F$1() {
}
F$1.prototype = E$2.prototype;
function G$2(a, b, e) {
  this.props = a;
  this.context = b;
  this.refs = D$2;
  this.updater = e || B$2;
}
var H$2 = G$2.prototype = new F$1();
H$2.constructor = G$2;
C$2(H$2, E$2.prototype);
H$2.isPureReactComponent = true;
var I$2 = Array.isArray, J$1 = Object.prototype.hasOwnProperty, K$2 = { current: null }, L$2 = { key: true, ref: true, __self: true, __source: true };
function M$2(a, b, e) {
  var d, c = {}, k2 = null, h = null;
  if (null != b)
    for (d in void 0 !== b.ref && (h = b.ref), void 0 !== b.key && (k2 = "" + b.key), b)
      J$1.call(b, d) && !L$2.hasOwnProperty(d) && (c[d] = b[d]);
  var g = arguments.length - 2;
  if (1 === g)
    c.children = e;
  else if (1 < g) {
    for (var f2 = Array(g), m2 = 0; m2 < g; m2++)
      f2[m2] = arguments[m2 + 2];
    c.children = f2;
  }
  if (a && a.defaultProps)
    for (d in g = a.defaultProps, g)
      void 0 === c[d] && (c[d] = g[d]);
  return { $$typeof: l$1, type: a, key: k2, ref: h, props: c, _owner: K$2.current };
}
function N$2(a, b) {
  return { $$typeof: l$1, type: a.type, key: b, ref: a.ref, props: a.props, _owner: a._owner };
}
function O$2(a) {
  return "object" === typeof a && null !== a && a.$$typeof === l$1;
}
function escape(a) {
  var b = { "=": "=0", ":": "=2" };
  return "$" + a.replace(/[=:]/g, function(a2) {
    return b[a2];
  });
}
var P$2 = /\/+/g;
function Q$2(a, b) {
  return "object" === typeof a && null !== a && null != a.key ? escape("" + a.key) : b.toString(36);
}
function R$3(a, b, e, d, c) {
  var k2 = typeof a;
  if ("undefined" === k2 || "boolean" === k2)
    a = null;
  var h = false;
  if (null === a)
    h = true;
  else
    switch (k2) {
      case "string":
      case "number":
        h = true;
        break;
      case "object":
        switch (a.$$typeof) {
          case l$1:
          case n$1:
            h = true;
        }
    }
  if (h)
    return h = a, c = c(h), a = "" === d ? "." + Q$2(h, 0) : d, I$2(c) ? (e = "", null != a && (e = a.replace(P$2, "$&/") + "/"), R$3(c, b, e, "", function(a2) {
      return a2;
    })) : null != c && (O$2(c) && (c = N$2(c, e + (!c.key || h && h.key === c.key ? "" : ("" + c.key).replace(P$2, "$&/") + "/") + a)), b.push(c)), 1;
  h = 0;
  d = "" === d ? "." : d + ":";
  if (I$2(a))
    for (var g = 0; g < a.length; g++) {
      k2 = a[g];
      var f2 = d + Q$2(k2, g);
      h += R$3(k2, b, e, f2, c);
    }
  else if (f2 = A$3(a), "function" === typeof f2)
    for (a = f2.call(a), g = 0; !(k2 = a.next()).done; )
      k2 = k2.value, f2 = d + Q$2(k2, g++), h += R$3(k2, b, e, f2, c);
  else if ("object" === k2)
    throw b = String(a), Error("Objects are not valid as a React child (found: " + ("[object Object]" === b ? "object with keys {" + Object.keys(a).join(", ") + "}" : b) + "). If you meant to render a collection of children, use an array instead.");
  return h;
}
function S$1(a, b, e) {
  if (null == a)
    return a;
  var d = [], c = 0;
  R$3(a, d, "", "", function(a2) {
    return b.call(e, a2, c++);
  });
  return d;
}
function T$2(a) {
  if (-1 === a._status) {
    var b = a._result;
    b = b();
    b.then(function(b2) {
      if (0 === a._status || -1 === a._status)
        a._status = 1, a._result = b2;
    }, function(b2) {
      if (0 === a._status || -1 === a._status)
        a._status = 2, a._result = b2;
    });
    -1 === a._status && (a._status = 0, a._result = b);
  }
  if (1 === a._status)
    return a._result.default;
  throw a._result;
}
var U$2 = { current: null }, V$2 = { transition: null }, W$2 = { ReactCurrentDispatcher: U$2, ReactCurrentBatchConfig: V$2, ReactCurrentOwner: K$2 };
react_production_min.Children = { map: S$1, forEach: function(a, b, e) {
  S$1(a, function() {
    b.apply(this, arguments);
  }, e);
}, count: function(a) {
  var b = 0;
  S$1(a, function() {
    b++;
  });
  return b;
}, toArray: function(a) {
  return S$1(a, function(a2) {
    return a2;
  }) || [];
}, only: function(a) {
  if (!O$2(a))
    throw Error("React.Children.only expected to receive a single React element child.");
  return a;
} };
react_production_min.Component = E$2;
react_production_min.Fragment = p$2;
react_production_min.Profiler = r;
react_production_min.PureComponent = G$2;
react_production_min.StrictMode = q$2;
react_production_min.Suspense = w;
react_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = W$2;
react_production_min.cloneElement = function(a, b, e) {
  if (null === a || void 0 === a)
    throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + a + ".");
  var d = C$2({}, a.props), c = a.key, k2 = a.ref, h = a._owner;
  if (null != b) {
    void 0 !== b.ref && (k2 = b.ref, h = K$2.current);
    void 0 !== b.key && (c = "" + b.key);
    if (a.type && a.type.defaultProps)
      var g = a.type.defaultProps;
    for (f2 in b)
      J$1.call(b, f2) && !L$2.hasOwnProperty(f2) && (d[f2] = void 0 === b[f2] && void 0 !== g ? g[f2] : b[f2]);
  }
  var f2 = arguments.length - 2;
  if (1 === f2)
    d.children = e;
  else if (1 < f2) {
    g = Array(f2);
    for (var m2 = 0; m2 < f2; m2++)
      g[m2] = arguments[m2 + 2];
    d.children = g;
  }
  return { $$typeof: l$1, type: a.type, key: c, ref: k2, props: d, _owner: h };
};
react_production_min.createContext = function(a) {
  a = { $$typeof: u, _currentValue: a, _currentValue2: a, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null };
  a.Provider = { $$typeof: t, _context: a };
  return a.Consumer = a;
};
react_production_min.createElement = M$2;
react_production_min.createFactory = function(a) {
  var b = M$2.bind(null, a);
  b.type = a;
  return b;
};
react_production_min.createRef = function() {
  return { current: null };
};
react_production_min.forwardRef = function(a) {
  return { $$typeof: v$2, render: a };
};
react_production_min.isValidElement = O$2;
react_production_min.lazy = function(a) {
  return { $$typeof: y$1, _payload: { _status: -1, _result: a }, _init: T$2 };
};
react_production_min.memo = function(a, b) {
  return { $$typeof: x$1, type: a, compare: void 0 === b ? null : b };
};
react_production_min.startTransition = function(a) {
  var b = V$2.transition;
  V$2.transition = {};
  try {
    a();
  } finally {
    V$2.transition = b;
  }
};
react_production_min.unstable_act = function() {
  throw Error("act(...) is not supported in production builds of React.");
};
react_production_min.useCallback = function(a, b) {
  return U$2.current.useCallback(a, b);
};
react_production_min.useContext = function(a) {
  return U$2.current.useContext(a);
};
react_production_min.useDebugValue = function() {
};
react_production_min.useDeferredValue = function(a) {
  return U$2.current.useDeferredValue(a);
};
react_production_min.useEffect = function(a, b) {
  return U$2.current.useEffect(a, b);
};
react_production_min.useId = function() {
  return U$2.current.useId();
};
react_production_min.useImperativeHandle = function(a, b, e) {
  return U$2.current.useImperativeHandle(a, b, e);
};
react_production_min.useInsertionEffect = function(a, b) {
  return U$2.current.useInsertionEffect(a, b);
};
react_production_min.useLayoutEffect = function(a, b) {
  return U$2.current.useLayoutEffect(a, b);
};
react_production_min.useMemo = function(a, b) {
  return U$2.current.useMemo(a, b);
};
react_production_min.useReducer = function(a, b, e) {
  return U$2.current.useReducer(a, b, e);
};
react_production_min.useRef = function(a) {
  return U$2.current.useRef(a);
};
react_production_min.useState = function(a) {
  return U$2.current.useState(a);
};
react_production_min.useSyncExternalStore = function(a, b, e) {
  return U$2.current.useSyncExternalStore(a, b, e);
};
react_production_min.useTransition = function() {
  return U$2.current.useTransition();
};
react_production_min.version = "18.2.0";
{
  react.exports = react_production_min;
}
var reactExports = react.exports;
const React = /* @__PURE__ */ getDefaultExportFromCjs(reactExports);
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var f$1 = reactExports, k$1 = Symbol.for("react.element"), l = Symbol.for("react.fragment"), m$1 = Object.prototype.hasOwnProperty, n = f$1.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p$1 = { key: true, ref: true, __self: true, __source: true };
function q$1(c, a, g) {
  var b, d = {}, e = null, h = null;
  void 0 !== g && (e = "" + g);
  void 0 !== a.key && (e = "" + a.key);
  void 0 !== a.ref && (h = a.ref);
  for (b in a)
    m$1.call(a, b) && !p$1.hasOwnProperty(b) && (d[b] = a[b]);
  if (c && c.defaultProps)
    for (b in a = c.defaultProps, a)
      void 0 === d[b] && (d[b] = a[b]);
  return { $$typeof: k$1, type: c, key: e, ref: h, props: d, _owner: n.current };
}
reactJsxRuntime_production_min.Fragment = l;
reactJsxRuntime_production_min.jsx = q$1;
reactJsxRuntime_production_min.jsxs = q$1;
{
  jsxRuntime.exports = reactJsxRuntime_production_min;
}
var jsxRuntimeExports = jsxRuntime.exports;
var reactDom = { exports: {} };
var reactDom_production_min = {};
var scheduler = { exports: {} };
var scheduler_production_min = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
(function(exports) {
  function f2(a, b) {
    var c = a.length;
    a.push(b);
    a:
      for (; 0 < c; ) {
        var d = c - 1 >>> 1, e = a[d];
        if (0 < g(e, b))
          a[d] = b, a[c] = e, c = d;
        else
          break a;
      }
  }
  function h(a) {
    return 0 === a.length ? null : a[0];
  }
  function k2(a) {
    if (0 === a.length)
      return null;
    var b = a[0], c = a.pop();
    if (c !== b) {
      a[0] = c;
      a:
        for (var d = 0, e = a.length, w2 = e >>> 1; d < w2; ) {
          var m2 = 2 * (d + 1) - 1, C2 = a[m2], n2 = m2 + 1, x2 = a[n2];
          if (0 > g(C2, c))
            n2 < e && 0 > g(x2, C2) ? (a[d] = x2, a[n2] = c, d = n2) : (a[d] = C2, a[m2] = c, d = m2);
          else if (n2 < e && 0 > g(x2, c))
            a[d] = x2, a[n2] = c, d = n2;
          else
            break a;
        }
    }
    return b;
  }
  function g(a, b) {
    var c = a.sortIndex - b.sortIndex;
    return 0 !== c ? c : a.id - b.id;
  }
  if ("object" === typeof performance && "function" === typeof performance.now) {
    var l2 = performance;
    exports.unstable_now = function() {
      return l2.now();
    };
  } else {
    var p2 = Date, q2 = p2.now();
    exports.unstable_now = function() {
      return p2.now() - q2;
    };
  }
  var r2 = [], t2 = [], u2 = 1, v2 = null, y2 = 3, z2 = false, A2 = false, B2 = false, D2 = "function" === typeof setTimeout ? setTimeout : null, E2 = "function" === typeof clearTimeout ? clearTimeout : null, F2 = "undefined" !== typeof setImmediate ? setImmediate : null;
  "undefined" !== typeof navigator && void 0 !== navigator.scheduling && void 0 !== navigator.scheduling.isInputPending && navigator.scheduling.isInputPending.bind(navigator.scheduling);
  function G2(a) {
    for (var b = h(t2); null !== b; ) {
      if (null === b.callback)
        k2(t2);
      else if (b.startTime <= a)
        k2(t2), b.sortIndex = b.expirationTime, f2(r2, b);
      else
        break;
      b = h(t2);
    }
  }
  function H2(a) {
    B2 = false;
    G2(a);
    if (!A2)
      if (null !== h(r2))
        A2 = true, I2(J2);
      else {
        var b = h(t2);
        null !== b && K2(H2, b.startTime - a);
      }
  }
  function J2(a, b) {
    A2 = false;
    B2 && (B2 = false, E2(L2), L2 = -1);
    z2 = true;
    var c = y2;
    try {
      G2(b);
      for (v2 = h(r2); null !== v2 && (!(v2.expirationTime > b) || a && !M2()); ) {
        var d = v2.callback;
        if ("function" === typeof d) {
          v2.callback = null;
          y2 = v2.priorityLevel;
          var e = d(v2.expirationTime <= b);
          b = exports.unstable_now();
          "function" === typeof e ? v2.callback = e : v2 === h(r2) && k2(r2);
          G2(b);
        } else
          k2(r2);
        v2 = h(r2);
      }
      if (null !== v2)
        var w2 = true;
      else {
        var m2 = h(t2);
        null !== m2 && K2(H2, m2.startTime - b);
        w2 = false;
      }
      return w2;
    } finally {
      v2 = null, y2 = c, z2 = false;
    }
  }
  var N2 = false, O2 = null, L2 = -1, P2 = 5, Q2 = -1;
  function M2() {
    return exports.unstable_now() - Q2 < P2 ? false : true;
  }
  function R2() {
    if (null !== O2) {
      var a = exports.unstable_now();
      Q2 = a;
      var b = true;
      try {
        b = O2(true, a);
      } finally {
        b ? S2() : (N2 = false, O2 = null);
      }
    } else
      N2 = false;
  }
  var S2;
  if ("function" === typeof F2)
    S2 = function() {
      F2(R2);
    };
  else if ("undefined" !== typeof MessageChannel) {
    var T2 = new MessageChannel(), U2 = T2.port2;
    T2.port1.onmessage = R2;
    S2 = function() {
      U2.postMessage(null);
    };
  } else
    S2 = function() {
      D2(R2, 0);
    };
  function I2(a) {
    O2 = a;
    N2 || (N2 = true, S2());
  }
  function K2(a, b) {
    L2 = D2(function() {
      a(exports.unstable_now());
    }, b);
  }
  exports.unstable_IdlePriority = 5;
  exports.unstable_ImmediatePriority = 1;
  exports.unstable_LowPriority = 4;
  exports.unstable_NormalPriority = 3;
  exports.unstable_Profiling = null;
  exports.unstable_UserBlockingPriority = 2;
  exports.unstable_cancelCallback = function(a) {
    a.callback = null;
  };
  exports.unstable_continueExecution = function() {
    A2 || z2 || (A2 = true, I2(J2));
  };
  exports.unstable_forceFrameRate = function(a) {
    0 > a || 125 < a ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : P2 = 0 < a ? Math.floor(1e3 / a) : 5;
  };
  exports.unstable_getCurrentPriorityLevel = function() {
    return y2;
  };
  exports.unstable_getFirstCallbackNode = function() {
    return h(r2);
  };
  exports.unstable_next = function(a) {
    switch (y2) {
      case 1:
      case 2:
      case 3:
        var b = 3;
        break;
      default:
        b = y2;
    }
    var c = y2;
    y2 = b;
    try {
      return a();
    } finally {
      y2 = c;
    }
  };
  exports.unstable_pauseExecution = function() {
  };
  exports.unstable_requestPaint = function() {
  };
  exports.unstable_runWithPriority = function(a, b) {
    switch (a) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        break;
      default:
        a = 3;
    }
    var c = y2;
    y2 = a;
    try {
      return b();
    } finally {
      y2 = c;
    }
  };
  exports.unstable_scheduleCallback = function(a, b, c) {
    var d = exports.unstable_now();
    "object" === typeof c && null !== c ? (c = c.delay, c = "number" === typeof c && 0 < c ? d + c : d) : c = d;
    switch (a) {
      case 1:
        var e = -1;
        break;
      case 2:
        e = 250;
        break;
      case 5:
        e = 1073741823;
        break;
      case 4:
        e = 1e4;
        break;
      default:
        e = 5e3;
    }
    e = c + e;
    a = { id: u2++, callback: b, priorityLevel: a, startTime: c, expirationTime: e, sortIndex: -1 };
    c > d ? (a.sortIndex = c, f2(t2, a), null === h(r2) && a === h(t2) && (B2 ? (E2(L2), L2 = -1) : B2 = true, K2(H2, c - d))) : (a.sortIndex = e, f2(r2, a), A2 || z2 || (A2 = true, I2(J2)));
    return a;
  };
  exports.unstable_shouldYield = M2;
  exports.unstable_wrapCallback = function(a) {
    var b = y2;
    return function() {
      var c = y2;
      y2 = b;
      try {
        return a.apply(this, arguments);
      } finally {
        y2 = c;
      }
    };
  };
})(scheduler_production_min);
{
  scheduler.exports = scheduler_production_min;
}
var schedulerExports = scheduler.exports;
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var aa = reactExports, ca = schedulerExports;
function p(a) {
  for (var b = "https://reactjs.org/docs/error-decoder.html?invariant=" + a, c = 1; c < arguments.length; c++)
    b += "&args[]=" + encodeURIComponent(arguments[c]);
  return "Minified React error #" + a + "; visit " + b + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
}
var da = /* @__PURE__ */ new Set(), ea = {};
function fa(a, b) {
  ha(a, b);
  ha(a + "Capture", b);
}
function ha(a, b) {
  ea[a] = b;
  for (a = 0; a < b.length; a++)
    da.add(b[a]);
}
var ia = !("undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement), ja = Object.prototype.hasOwnProperty, ka = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, la = {}, ma = {};
function oa(a) {
  if (ja.call(ma, a))
    return true;
  if (ja.call(la, a))
    return false;
  if (ka.test(a))
    return ma[a] = true;
  la[a] = true;
  return false;
}
function pa(a, b, c, d) {
  if (null !== c && 0 === c.type)
    return false;
  switch (typeof b) {
    case "function":
    case "symbol":
      return true;
    case "boolean":
      if (d)
        return false;
      if (null !== c)
        return !c.acceptsBooleans;
      a = a.toLowerCase().slice(0, 5);
      return "data-" !== a && "aria-" !== a;
    default:
      return false;
  }
}
function qa(a, b, c, d) {
  if (null === b || "undefined" === typeof b || pa(a, b, c, d))
    return true;
  if (d)
    return false;
  if (null !== c)
    switch (c.type) {
      case 3:
        return !b;
      case 4:
        return false === b;
      case 5:
        return isNaN(b);
      case 6:
        return isNaN(b) || 1 > b;
    }
  return false;
}
function v$1(a, b, c, d, e, f2, g) {
  this.acceptsBooleans = 2 === b || 3 === b || 4 === b;
  this.attributeName = d;
  this.attributeNamespace = e;
  this.mustUseProperty = c;
  this.propertyName = a;
  this.type = b;
  this.sanitizeURL = f2;
  this.removeEmptyString = g;
}
var z$1 = {};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(a) {
  z$1[a] = new v$1(a, 0, false, a, null, false, false);
});
[["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(a) {
  var b = a[0];
  z$1[b] = new v$1(b, 1, false, a[1], null, false, false);
});
["contentEditable", "draggable", "spellCheck", "value"].forEach(function(a) {
  z$1[a] = new v$1(a, 2, false, a.toLowerCase(), null, false, false);
});
["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(a) {
  z$1[a] = new v$1(a, 2, false, a, null, false, false);
});
"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(a) {
  z$1[a] = new v$1(a, 3, false, a.toLowerCase(), null, false, false);
});
["checked", "multiple", "muted", "selected"].forEach(function(a) {
  z$1[a] = new v$1(a, 3, true, a, null, false, false);
});
["capture", "download"].forEach(function(a) {
  z$1[a] = new v$1(a, 4, false, a, null, false, false);
});
["cols", "rows", "size", "span"].forEach(function(a) {
  z$1[a] = new v$1(a, 6, false, a, null, false, false);
});
["rowSpan", "start"].forEach(function(a) {
  z$1[a] = new v$1(a, 5, false, a.toLowerCase(), null, false, false);
});
var ra = /[\-:]([a-z])/g;
function sa(a) {
  return a[1].toUpperCase();
}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(a) {
  var b = a.replace(
    ra,
    sa
  );
  z$1[b] = new v$1(b, 1, false, a, null, false, false);
});
"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(a) {
  var b = a.replace(ra, sa);
  z$1[b] = new v$1(b, 1, false, a, "http://www.w3.org/1999/xlink", false, false);
});
["xml:base", "xml:lang", "xml:space"].forEach(function(a) {
  var b = a.replace(ra, sa);
  z$1[b] = new v$1(b, 1, false, a, "http://www.w3.org/XML/1998/namespace", false, false);
});
["tabIndex", "crossOrigin"].forEach(function(a) {
  z$1[a] = new v$1(a, 1, false, a.toLowerCase(), null, false, false);
});
z$1.xlinkHref = new v$1("xlinkHref", 1, false, "xlink:href", "http://www.w3.org/1999/xlink", true, false);
["src", "href", "action", "formAction"].forEach(function(a) {
  z$1[a] = new v$1(a, 1, false, a.toLowerCase(), null, true, true);
});
function ta(a, b, c, d) {
  var e = z$1.hasOwnProperty(b) ? z$1[b] : null;
  if (null !== e ? 0 !== e.type : d || !(2 < b.length) || "o" !== b[0] && "O" !== b[0] || "n" !== b[1] && "N" !== b[1])
    qa(b, c, e, d) && (c = null), d || null === e ? oa(b) && (null === c ? a.removeAttribute(b) : a.setAttribute(b, "" + c)) : e.mustUseProperty ? a[e.propertyName] = null === c ? 3 === e.type ? false : "" : c : (b = e.attributeName, d = e.attributeNamespace, null === c ? a.removeAttribute(b) : (e = e.type, c = 3 === e || 4 === e && true === c ? "" : "" + c, d ? a.setAttributeNS(d, b, c) : a.setAttribute(b, c)));
}
var ua = aa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, va = Symbol.for("react.element"), wa = Symbol.for("react.portal"), ya = Symbol.for("react.fragment"), za = Symbol.for("react.strict_mode"), Aa = Symbol.for("react.profiler"), Ba = Symbol.for("react.provider"), Ca = Symbol.for("react.context"), Da = Symbol.for("react.forward_ref"), Ea = Symbol.for("react.suspense"), Fa = Symbol.for("react.suspense_list"), Ga = Symbol.for("react.memo"), Ha = Symbol.for("react.lazy");
var Ia = Symbol.for("react.offscreen");
var Ja = Symbol.iterator;
function Ka(a) {
  if (null === a || "object" !== typeof a)
    return null;
  a = Ja && a[Ja] || a["@@iterator"];
  return "function" === typeof a ? a : null;
}
var A$2 = Object.assign, La;
function Ma(a) {
  if (void 0 === La)
    try {
      throw Error();
    } catch (c) {
      var b = c.stack.trim().match(/\n( *(at )?)/);
      La = b && b[1] || "";
    }
  return "\n" + La + a;
}
var Na = false;
function Oa(a, b) {
  if (!a || Na)
    return "";
  Na = true;
  var c = Error.prepareStackTrace;
  Error.prepareStackTrace = void 0;
  try {
    if (b)
      if (b = function() {
        throw Error();
      }, Object.defineProperty(b.prototype, "props", { set: function() {
        throw Error();
      } }), "object" === typeof Reflect && Reflect.construct) {
        try {
          Reflect.construct(b, []);
        } catch (l2) {
          var d = l2;
        }
        Reflect.construct(a, [], b);
      } else {
        try {
          b.call();
        } catch (l2) {
          d = l2;
        }
        a.call(b.prototype);
      }
    else {
      try {
        throw Error();
      } catch (l2) {
        d = l2;
      }
      a();
    }
  } catch (l2) {
    if (l2 && d && "string" === typeof l2.stack) {
      for (var e = l2.stack.split("\n"), f2 = d.stack.split("\n"), g = e.length - 1, h = f2.length - 1; 1 <= g && 0 <= h && e[g] !== f2[h]; )
        h--;
      for (; 1 <= g && 0 <= h; g--, h--)
        if (e[g] !== f2[h]) {
          if (1 !== g || 1 !== h) {
            do
              if (g--, h--, 0 > h || e[g] !== f2[h]) {
                var k2 = "\n" + e[g].replace(" at new ", " at ");
                a.displayName && k2.includes("<anonymous>") && (k2 = k2.replace("<anonymous>", a.displayName));
                return k2;
              }
            while (1 <= g && 0 <= h);
          }
          break;
        }
    }
  } finally {
    Na = false, Error.prepareStackTrace = c;
  }
  return (a = a ? a.displayName || a.name : "") ? Ma(a) : "";
}
function Pa(a) {
  switch (a.tag) {
    case 5:
      return Ma(a.type);
    case 16:
      return Ma("Lazy");
    case 13:
      return Ma("Suspense");
    case 19:
      return Ma("SuspenseList");
    case 0:
    case 2:
    case 15:
      return a = Oa(a.type, false), a;
    case 11:
      return a = Oa(a.type.render, false), a;
    case 1:
      return a = Oa(a.type, true), a;
    default:
      return "";
  }
}
function Qa(a) {
  if (null == a)
    return null;
  if ("function" === typeof a)
    return a.displayName || a.name || null;
  if ("string" === typeof a)
    return a;
  switch (a) {
    case ya:
      return "Fragment";
    case wa:
      return "Portal";
    case Aa:
      return "Profiler";
    case za:
      return "StrictMode";
    case Ea:
      return "Suspense";
    case Fa:
      return "SuspenseList";
  }
  if ("object" === typeof a)
    switch (a.$$typeof) {
      case Ca:
        return (a.displayName || "Context") + ".Consumer";
      case Ba:
        return (a._context.displayName || "Context") + ".Provider";
      case Da:
        var b = a.render;
        a = a.displayName;
        a || (a = b.displayName || b.name || "", a = "" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
        return a;
      case Ga:
        return b = a.displayName || null, null !== b ? b : Qa(a.type) || "Memo";
      case Ha:
        b = a._payload;
        a = a._init;
        try {
          return Qa(a(b));
        } catch (c) {
        }
    }
  return null;
}
function Ra(a) {
  var b = a.type;
  switch (a.tag) {
    case 24:
      return "Cache";
    case 9:
      return (b.displayName || "Context") + ".Consumer";
    case 10:
      return (b._context.displayName || "Context") + ".Provider";
    case 18:
      return "DehydratedFragment";
    case 11:
      return a = b.render, a = a.displayName || a.name || "", b.displayName || ("" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
    case 7:
      return "Fragment";
    case 5:
      return b;
    case 4:
      return "Portal";
    case 3:
      return "Root";
    case 6:
      return "Text";
    case 16:
      return Qa(b);
    case 8:
      return b === za ? "StrictMode" : "Mode";
    case 22:
      return "Offscreen";
    case 12:
      return "Profiler";
    case 21:
      return "Scope";
    case 13:
      return "Suspense";
    case 19:
      return "SuspenseList";
    case 25:
      return "TracingMarker";
    case 1:
    case 0:
    case 17:
    case 2:
    case 14:
    case 15:
      if ("function" === typeof b)
        return b.displayName || b.name || null;
      if ("string" === typeof b)
        return b;
  }
  return null;
}
function Sa(a) {
  switch (typeof a) {
    case "boolean":
    case "number":
    case "string":
    case "undefined":
      return a;
    case "object":
      return a;
    default:
      return "";
  }
}
function Ta(a) {
  var b = a.type;
  return (a = a.nodeName) && "input" === a.toLowerCase() && ("checkbox" === b || "radio" === b);
}
function Ua(a) {
  var b = Ta(a) ? "checked" : "value", c = Object.getOwnPropertyDescriptor(a.constructor.prototype, b), d = "" + a[b];
  if (!a.hasOwnProperty(b) && "undefined" !== typeof c && "function" === typeof c.get && "function" === typeof c.set) {
    var e = c.get, f2 = c.set;
    Object.defineProperty(a, b, { configurable: true, get: function() {
      return e.call(this);
    }, set: function(a2) {
      d = "" + a2;
      f2.call(this, a2);
    } });
    Object.defineProperty(a, b, { enumerable: c.enumerable });
    return { getValue: function() {
      return d;
    }, setValue: function(a2) {
      d = "" + a2;
    }, stopTracking: function() {
      a._valueTracker = null;
      delete a[b];
    } };
  }
}
function Va(a) {
  a._valueTracker || (a._valueTracker = Ua(a));
}
function Wa(a) {
  if (!a)
    return false;
  var b = a._valueTracker;
  if (!b)
    return true;
  var c = b.getValue();
  var d = "";
  a && (d = Ta(a) ? a.checked ? "true" : "false" : a.value);
  a = d;
  return a !== c ? (b.setValue(a), true) : false;
}
function Xa(a) {
  a = a || ("undefined" !== typeof document ? document : void 0);
  if ("undefined" === typeof a)
    return null;
  try {
    return a.activeElement || a.body;
  } catch (b) {
    return a.body;
  }
}
function Ya(a, b) {
  var c = b.checked;
  return A$2({}, b, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: null != c ? c : a._wrapperState.initialChecked });
}
function Za(a, b) {
  var c = null == b.defaultValue ? "" : b.defaultValue, d = null != b.checked ? b.checked : b.defaultChecked;
  c = Sa(null != b.value ? b.value : c);
  a._wrapperState = { initialChecked: d, initialValue: c, controlled: "checkbox" === b.type || "radio" === b.type ? null != b.checked : null != b.value };
}
function ab(a, b) {
  b = b.checked;
  null != b && ta(a, "checked", b, false);
}
function bb(a, b) {
  ab(a, b);
  var c = Sa(b.value), d = b.type;
  if (null != c)
    if ("number" === d) {
      if (0 === c && "" === a.value || a.value != c)
        a.value = "" + c;
    } else
      a.value !== "" + c && (a.value = "" + c);
  else if ("submit" === d || "reset" === d) {
    a.removeAttribute("value");
    return;
  }
  b.hasOwnProperty("value") ? cb(a, b.type, c) : b.hasOwnProperty("defaultValue") && cb(a, b.type, Sa(b.defaultValue));
  null == b.checked && null != b.defaultChecked && (a.defaultChecked = !!b.defaultChecked);
}
function db(a, b, c) {
  if (b.hasOwnProperty("value") || b.hasOwnProperty("defaultValue")) {
    var d = b.type;
    if (!("submit" !== d && "reset" !== d || void 0 !== b.value && null !== b.value))
      return;
    b = "" + a._wrapperState.initialValue;
    c || b === a.value || (a.value = b);
    a.defaultValue = b;
  }
  c = a.name;
  "" !== c && (a.name = "");
  a.defaultChecked = !!a._wrapperState.initialChecked;
  "" !== c && (a.name = c);
}
function cb(a, b, c) {
  if ("number" !== b || Xa(a.ownerDocument) !== a)
    null == c ? a.defaultValue = "" + a._wrapperState.initialValue : a.defaultValue !== "" + c && (a.defaultValue = "" + c);
}
var eb = Array.isArray;
function fb(a, b, c, d) {
  a = a.options;
  if (b) {
    b = {};
    for (var e = 0; e < c.length; e++)
      b["$" + c[e]] = true;
    for (c = 0; c < a.length; c++)
      e = b.hasOwnProperty("$" + a[c].value), a[c].selected !== e && (a[c].selected = e), e && d && (a[c].defaultSelected = true);
  } else {
    c = "" + Sa(c);
    b = null;
    for (e = 0; e < a.length; e++) {
      if (a[e].value === c) {
        a[e].selected = true;
        d && (a[e].defaultSelected = true);
        return;
      }
      null !== b || a[e].disabled || (b = a[e]);
    }
    null !== b && (b.selected = true);
  }
}
function gb(a, b) {
  if (null != b.dangerouslySetInnerHTML)
    throw Error(p(91));
  return A$2({}, b, { value: void 0, defaultValue: void 0, children: "" + a._wrapperState.initialValue });
}
function hb(a, b) {
  var c = b.value;
  if (null == c) {
    c = b.children;
    b = b.defaultValue;
    if (null != c) {
      if (null != b)
        throw Error(p(92));
      if (eb(c)) {
        if (1 < c.length)
          throw Error(p(93));
        c = c[0];
      }
      b = c;
    }
    null == b && (b = "");
    c = b;
  }
  a._wrapperState = { initialValue: Sa(c) };
}
function ib(a, b) {
  var c = Sa(b.value), d = Sa(b.defaultValue);
  null != c && (c = "" + c, c !== a.value && (a.value = c), null == b.defaultValue && a.defaultValue !== c && (a.defaultValue = c));
  null != d && (a.defaultValue = "" + d);
}
function jb(a) {
  var b = a.textContent;
  b === a._wrapperState.initialValue && "" !== b && null !== b && (a.value = b);
}
function kb(a) {
  switch (a) {
    case "svg":
      return "http://www.w3.org/2000/svg";
    case "math":
      return "http://www.w3.org/1998/Math/MathML";
    default:
      return "http://www.w3.org/1999/xhtml";
  }
}
function lb(a, b) {
  return null == a || "http://www.w3.org/1999/xhtml" === a ? kb(b) : "http://www.w3.org/2000/svg" === a && "foreignObject" === b ? "http://www.w3.org/1999/xhtml" : a;
}
var mb, nb = function(a) {
  return "undefined" !== typeof MSApp && MSApp.execUnsafeLocalFunction ? function(b, c, d, e) {
    MSApp.execUnsafeLocalFunction(function() {
      return a(b, c, d, e);
    });
  } : a;
}(function(a, b) {
  if ("http://www.w3.org/2000/svg" !== a.namespaceURI || "innerHTML" in a)
    a.innerHTML = b;
  else {
    mb = mb || document.createElement("div");
    mb.innerHTML = "<svg>" + b.valueOf().toString() + "</svg>";
    for (b = mb.firstChild; a.firstChild; )
      a.removeChild(a.firstChild);
    for (; b.firstChild; )
      a.appendChild(b.firstChild);
  }
});
function ob(a, b) {
  if (b) {
    var c = a.firstChild;
    if (c && c === a.lastChild && 3 === c.nodeType) {
      c.nodeValue = b;
      return;
    }
  }
  a.textContent = b;
}
var pb = {
  animationIterationCount: true,
  aspectRatio: true,
  borderImageOutset: true,
  borderImageSlice: true,
  borderImageWidth: true,
  boxFlex: true,
  boxFlexGroup: true,
  boxOrdinalGroup: true,
  columnCount: true,
  columns: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  flexOrder: true,
  gridArea: true,
  gridRow: true,
  gridRowEnd: true,
  gridRowSpan: true,
  gridRowStart: true,
  gridColumn: true,
  gridColumnEnd: true,
  gridColumnSpan: true,
  gridColumnStart: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,
  fillOpacity: true,
  floodOpacity: true,
  stopOpacity: true,
  strokeDasharray: true,
  strokeDashoffset: true,
  strokeMiterlimit: true,
  strokeOpacity: true,
  strokeWidth: true
}, qb = ["Webkit", "ms", "Moz", "O"];
Object.keys(pb).forEach(function(a) {
  qb.forEach(function(b) {
    b = b + a.charAt(0).toUpperCase() + a.substring(1);
    pb[b] = pb[a];
  });
});
function rb(a, b, c) {
  return null == b || "boolean" === typeof b || "" === b ? "" : c || "number" !== typeof b || 0 === b || pb.hasOwnProperty(a) && pb[a] ? ("" + b).trim() : b + "px";
}
function sb(a, b) {
  a = a.style;
  for (var c in b)
    if (b.hasOwnProperty(c)) {
      var d = 0 === c.indexOf("--"), e = rb(c, b[c], d);
      "float" === c && (c = "cssFloat");
      d ? a.setProperty(c, e) : a[c] = e;
    }
}
var tb = A$2({ menuitem: true }, { area: true, base: true, br: true, col: true, embed: true, hr: true, img: true, input: true, keygen: true, link: true, meta: true, param: true, source: true, track: true, wbr: true });
function ub(a, b) {
  if (b) {
    if (tb[a] && (null != b.children || null != b.dangerouslySetInnerHTML))
      throw Error(p(137, a));
    if (null != b.dangerouslySetInnerHTML) {
      if (null != b.children)
        throw Error(p(60));
      if ("object" !== typeof b.dangerouslySetInnerHTML || !("__html" in b.dangerouslySetInnerHTML))
        throw Error(p(61));
    }
    if (null != b.style && "object" !== typeof b.style)
      throw Error(p(62));
  }
}
function vb(a, b) {
  if (-1 === a.indexOf("-"))
    return "string" === typeof b.is;
  switch (a) {
    case "annotation-xml":
    case "color-profile":
    case "font-face":
    case "font-face-src":
    case "font-face-uri":
    case "font-face-format":
    case "font-face-name":
    case "missing-glyph":
      return false;
    default:
      return true;
  }
}
var wb = null;
function xb(a) {
  a = a.target || a.srcElement || window;
  a.correspondingUseElement && (a = a.correspondingUseElement);
  return 3 === a.nodeType ? a.parentNode : a;
}
var yb = null, zb = null, Ab = null;
function Bb(a) {
  if (a = Cb(a)) {
    if ("function" !== typeof yb)
      throw Error(p(280));
    var b = a.stateNode;
    b && (b = Db(b), yb(a.stateNode, a.type, b));
  }
}
function Eb(a) {
  zb ? Ab ? Ab.push(a) : Ab = [a] : zb = a;
}
function Fb() {
  if (zb) {
    var a = zb, b = Ab;
    Ab = zb = null;
    Bb(a);
    if (b)
      for (a = 0; a < b.length; a++)
        Bb(b[a]);
  }
}
function Gb(a, b) {
  return a(b);
}
function Hb() {
}
var Ib = false;
function Jb(a, b, c) {
  if (Ib)
    return a(b, c);
  Ib = true;
  try {
    return Gb(a, b, c);
  } finally {
    if (Ib = false, null !== zb || null !== Ab)
      Hb(), Fb();
  }
}
function Kb(a, b) {
  var c = a.stateNode;
  if (null === c)
    return null;
  var d = Db(c);
  if (null === d)
    return null;
  c = d[b];
  a:
    switch (b) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        (d = !d.disabled) || (a = a.type, d = !("button" === a || "input" === a || "select" === a || "textarea" === a));
        a = !d;
        break a;
      default:
        a = false;
    }
  if (a)
    return null;
  if (c && "function" !== typeof c)
    throw Error(p(231, b, typeof c));
  return c;
}
var Lb = false;
if (ia)
  try {
    var Mb = {};
    Object.defineProperty(Mb, "passive", { get: function() {
      Lb = true;
    } });
    window.addEventListener("test", Mb, Mb);
    window.removeEventListener("test", Mb, Mb);
  } catch (a) {
    Lb = false;
  }
function Nb(a, b, c, d, e, f2, g, h, k2) {
  var l2 = Array.prototype.slice.call(arguments, 3);
  try {
    b.apply(c, l2);
  } catch (m2) {
    this.onError(m2);
  }
}
var Ob = false, Pb = null, Qb = false, Rb = null, Sb = { onError: function(a) {
  Ob = true;
  Pb = a;
} };
function Tb(a, b, c, d, e, f2, g, h, k2) {
  Ob = false;
  Pb = null;
  Nb.apply(Sb, arguments);
}
function Ub(a, b, c, d, e, f2, g, h, k2) {
  Tb.apply(this, arguments);
  if (Ob) {
    if (Ob) {
      var l2 = Pb;
      Ob = false;
      Pb = null;
    } else
      throw Error(p(198));
    Qb || (Qb = true, Rb = l2);
  }
}
function Vb(a) {
  var b = a, c = a;
  if (a.alternate)
    for (; b.return; )
      b = b.return;
  else {
    a = b;
    do
      b = a, 0 !== (b.flags & 4098) && (c = b.return), a = b.return;
    while (a);
  }
  return 3 === b.tag ? c : null;
}
function Wb(a) {
  if (13 === a.tag) {
    var b = a.memoizedState;
    null === b && (a = a.alternate, null !== a && (b = a.memoizedState));
    if (null !== b)
      return b.dehydrated;
  }
  return null;
}
function Xb(a) {
  if (Vb(a) !== a)
    throw Error(p(188));
}
function Yb(a) {
  var b = a.alternate;
  if (!b) {
    b = Vb(a);
    if (null === b)
      throw Error(p(188));
    return b !== a ? null : a;
  }
  for (var c = a, d = b; ; ) {
    var e = c.return;
    if (null === e)
      break;
    var f2 = e.alternate;
    if (null === f2) {
      d = e.return;
      if (null !== d) {
        c = d;
        continue;
      }
      break;
    }
    if (e.child === f2.child) {
      for (f2 = e.child; f2; ) {
        if (f2 === c)
          return Xb(e), a;
        if (f2 === d)
          return Xb(e), b;
        f2 = f2.sibling;
      }
      throw Error(p(188));
    }
    if (c.return !== d.return)
      c = e, d = f2;
    else {
      for (var g = false, h = e.child; h; ) {
        if (h === c) {
          g = true;
          c = e;
          d = f2;
          break;
        }
        if (h === d) {
          g = true;
          d = e;
          c = f2;
          break;
        }
        h = h.sibling;
      }
      if (!g) {
        for (h = f2.child; h; ) {
          if (h === c) {
            g = true;
            c = f2;
            d = e;
            break;
          }
          if (h === d) {
            g = true;
            d = f2;
            c = e;
            break;
          }
          h = h.sibling;
        }
        if (!g)
          throw Error(p(189));
      }
    }
    if (c.alternate !== d)
      throw Error(p(190));
  }
  if (3 !== c.tag)
    throw Error(p(188));
  return c.stateNode.current === c ? a : b;
}
function Zb(a) {
  a = Yb(a);
  return null !== a ? $b(a) : null;
}
function $b(a) {
  if (5 === a.tag || 6 === a.tag)
    return a;
  for (a = a.child; null !== a; ) {
    var b = $b(a);
    if (null !== b)
      return b;
    a = a.sibling;
  }
  return null;
}
var ac = ca.unstable_scheduleCallback, bc = ca.unstable_cancelCallback, cc = ca.unstable_shouldYield, dc = ca.unstable_requestPaint, B$1 = ca.unstable_now, ec = ca.unstable_getCurrentPriorityLevel, fc = ca.unstable_ImmediatePriority, gc = ca.unstable_UserBlockingPriority, hc = ca.unstable_NormalPriority, ic = ca.unstable_LowPriority, jc = ca.unstable_IdlePriority, kc = null, lc = null;
function mc(a) {
  if (lc && "function" === typeof lc.onCommitFiberRoot)
    try {
      lc.onCommitFiberRoot(kc, a, void 0, 128 === (a.current.flags & 128));
    } catch (b) {
    }
}
var oc = Math.clz32 ? Math.clz32 : nc, pc = Math.log, qc = Math.LN2;
function nc(a) {
  a >>>= 0;
  return 0 === a ? 32 : 31 - (pc(a) / qc | 0) | 0;
}
var rc = 64, sc = 4194304;
function tc(a) {
  switch (a & -a) {
    case 1:
      return 1;
    case 2:
      return 2;
    case 4:
      return 4;
    case 8:
      return 8;
    case 16:
      return 16;
    case 32:
      return 32;
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return a & 4194240;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return a & 130023424;
    case 134217728:
      return 134217728;
    case 268435456:
      return 268435456;
    case 536870912:
      return 536870912;
    case 1073741824:
      return 1073741824;
    default:
      return a;
  }
}
function uc(a, b) {
  var c = a.pendingLanes;
  if (0 === c)
    return 0;
  var d = 0, e = a.suspendedLanes, f2 = a.pingedLanes, g = c & 268435455;
  if (0 !== g) {
    var h = g & ~e;
    0 !== h ? d = tc(h) : (f2 &= g, 0 !== f2 && (d = tc(f2)));
  } else
    g = c & ~e, 0 !== g ? d = tc(g) : 0 !== f2 && (d = tc(f2));
  if (0 === d)
    return 0;
  if (0 !== b && b !== d && 0 === (b & e) && (e = d & -d, f2 = b & -b, e >= f2 || 16 === e && 0 !== (f2 & 4194240)))
    return b;
  0 !== (d & 4) && (d |= c & 16);
  b = a.entangledLanes;
  if (0 !== b)
    for (a = a.entanglements, b &= d; 0 < b; )
      c = 31 - oc(b), e = 1 << c, d |= a[c], b &= ~e;
  return d;
}
function vc(a, b) {
  switch (a) {
    case 1:
    case 2:
    case 4:
      return b + 250;
    case 8:
    case 16:
    case 32:
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return b + 5e3;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return -1;
    case 134217728:
    case 268435456:
    case 536870912:
    case 1073741824:
      return -1;
    default:
      return -1;
  }
}
function wc(a, b) {
  for (var c = a.suspendedLanes, d = a.pingedLanes, e = a.expirationTimes, f2 = a.pendingLanes; 0 < f2; ) {
    var g = 31 - oc(f2), h = 1 << g, k2 = e[g];
    if (-1 === k2) {
      if (0 === (h & c) || 0 !== (h & d))
        e[g] = vc(h, b);
    } else
      k2 <= b && (a.expiredLanes |= h);
    f2 &= ~h;
  }
}
function xc(a) {
  a = a.pendingLanes & -1073741825;
  return 0 !== a ? a : a & 1073741824 ? 1073741824 : 0;
}
function yc() {
  var a = rc;
  rc <<= 1;
  0 === (rc & 4194240) && (rc = 64);
  return a;
}
function zc(a) {
  for (var b = [], c = 0; 31 > c; c++)
    b.push(a);
  return b;
}
function Ac(a, b, c) {
  a.pendingLanes |= b;
  536870912 !== b && (a.suspendedLanes = 0, a.pingedLanes = 0);
  a = a.eventTimes;
  b = 31 - oc(b);
  a[b] = c;
}
function Bc(a, b) {
  var c = a.pendingLanes & ~b;
  a.pendingLanes = b;
  a.suspendedLanes = 0;
  a.pingedLanes = 0;
  a.expiredLanes &= b;
  a.mutableReadLanes &= b;
  a.entangledLanes &= b;
  b = a.entanglements;
  var d = a.eventTimes;
  for (a = a.expirationTimes; 0 < c; ) {
    var e = 31 - oc(c), f2 = 1 << e;
    b[e] = 0;
    d[e] = -1;
    a[e] = -1;
    c &= ~f2;
  }
}
function Cc(a, b) {
  var c = a.entangledLanes |= b;
  for (a = a.entanglements; c; ) {
    var d = 31 - oc(c), e = 1 << d;
    e & b | a[d] & b && (a[d] |= b);
    c &= ~e;
  }
}
var C$1 = 0;
function Dc(a) {
  a &= -a;
  return 1 < a ? 4 < a ? 0 !== (a & 268435455) ? 16 : 536870912 : 4 : 1;
}
var Ec, Fc, Gc, Hc, Ic, Jc = false, Kc = [], Lc = null, Mc = null, Nc = null, Oc = /* @__PURE__ */ new Map(), Pc = /* @__PURE__ */ new Map(), Qc = [], Rc = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
function Sc(a, b) {
  switch (a) {
    case "focusin":
    case "focusout":
      Lc = null;
      break;
    case "dragenter":
    case "dragleave":
      Mc = null;
      break;
    case "mouseover":
    case "mouseout":
      Nc = null;
      break;
    case "pointerover":
    case "pointerout":
      Oc.delete(b.pointerId);
      break;
    case "gotpointercapture":
    case "lostpointercapture":
      Pc.delete(b.pointerId);
  }
}
function Tc(a, b, c, d, e, f2) {
  if (null === a || a.nativeEvent !== f2)
    return a = { blockedOn: b, domEventName: c, eventSystemFlags: d, nativeEvent: f2, targetContainers: [e] }, null !== b && (b = Cb(b), null !== b && Fc(b)), a;
  a.eventSystemFlags |= d;
  b = a.targetContainers;
  null !== e && -1 === b.indexOf(e) && b.push(e);
  return a;
}
function Uc(a, b, c, d, e) {
  switch (b) {
    case "focusin":
      return Lc = Tc(Lc, a, b, c, d, e), true;
    case "dragenter":
      return Mc = Tc(Mc, a, b, c, d, e), true;
    case "mouseover":
      return Nc = Tc(Nc, a, b, c, d, e), true;
    case "pointerover":
      var f2 = e.pointerId;
      Oc.set(f2, Tc(Oc.get(f2) || null, a, b, c, d, e));
      return true;
    case "gotpointercapture":
      return f2 = e.pointerId, Pc.set(f2, Tc(Pc.get(f2) || null, a, b, c, d, e)), true;
  }
  return false;
}
function Vc(a) {
  var b = Wc(a.target);
  if (null !== b) {
    var c = Vb(b);
    if (null !== c) {
      if (b = c.tag, 13 === b) {
        if (b = Wb(c), null !== b) {
          a.blockedOn = b;
          Ic(a.priority, function() {
            Gc(c);
          });
          return;
        }
      } else if (3 === b && c.stateNode.current.memoizedState.isDehydrated) {
        a.blockedOn = 3 === c.tag ? c.stateNode.containerInfo : null;
        return;
      }
    }
  }
  a.blockedOn = null;
}
function Xc(a) {
  if (null !== a.blockedOn)
    return false;
  for (var b = a.targetContainers; 0 < b.length; ) {
    var c = Yc(a.domEventName, a.eventSystemFlags, b[0], a.nativeEvent);
    if (null === c) {
      c = a.nativeEvent;
      var d = new c.constructor(c.type, c);
      wb = d;
      c.target.dispatchEvent(d);
      wb = null;
    } else
      return b = Cb(c), null !== b && Fc(b), a.blockedOn = c, false;
    b.shift();
  }
  return true;
}
function Zc(a, b, c) {
  Xc(a) && c.delete(b);
}
function $c() {
  Jc = false;
  null !== Lc && Xc(Lc) && (Lc = null);
  null !== Mc && Xc(Mc) && (Mc = null);
  null !== Nc && Xc(Nc) && (Nc = null);
  Oc.forEach(Zc);
  Pc.forEach(Zc);
}
function ad(a, b) {
  a.blockedOn === b && (a.blockedOn = null, Jc || (Jc = true, ca.unstable_scheduleCallback(ca.unstable_NormalPriority, $c)));
}
function bd(a) {
  function b(b2) {
    return ad(b2, a);
  }
  if (0 < Kc.length) {
    ad(Kc[0], a);
    for (var c = 1; c < Kc.length; c++) {
      var d = Kc[c];
      d.blockedOn === a && (d.blockedOn = null);
    }
  }
  null !== Lc && ad(Lc, a);
  null !== Mc && ad(Mc, a);
  null !== Nc && ad(Nc, a);
  Oc.forEach(b);
  Pc.forEach(b);
  for (c = 0; c < Qc.length; c++)
    d = Qc[c], d.blockedOn === a && (d.blockedOn = null);
  for (; 0 < Qc.length && (c = Qc[0], null === c.blockedOn); )
    Vc(c), null === c.blockedOn && Qc.shift();
}
var cd = ua.ReactCurrentBatchConfig, dd = true;
function ed(a, b, c, d) {
  var e = C$1, f2 = cd.transition;
  cd.transition = null;
  try {
    C$1 = 1, fd(a, b, c, d);
  } finally {
    C$1 = e, cd.transition = f2;
  }
}
function gd(a, b, c, d) {
  var e = C$1, f2 = cd.transition;
  cd.transition = null;
  try {
    C$1 = 4, fd(a, b, c, d);
  } finally {
    C$1 = e, cd.transition = f2;
  }
}
function fd(a, b, c, d) {
  if (dd) {
    var e = Yc(a, b, c, d);
    if (null === e)
      hd(a, b, d, id, c), Sc(a, d);
    else if (Uc(e, a, b, c, d))
      d.stopPropagation();
    else if (Sc(a, d), b & 4 && -1 < Rc.indexOf(a)) {
      for (; null !== e; ) {
        var f2 = Cb(e);
        null !== f2 && Ec(f2);
        f2 = Yc(a, b, c, d);
        null === f2 && hd(a, b, d, id, c);
        if (f2 === e)
          break;
        e = f2;
      }
      null !== e && d.stopPropagation();
    } else
      hd(a, b, d, null, c);
  }
}
var id = null;
function Yc(a, b, c, d) {
  id = null;
  a = xb(d);
  a = Wc(a);
  if (null !== a)
    if (b = Vb(a), null === b)
      a = null;
    else if (c = b.tag, 13 === c) {
      a = Wb(b);
      if (null !== a)
        return a;
      a = null;
    } else if (3 === c) {
      if (b.stateNode.current.memoizedState.isDehydrated)
        return 3 === b.tag ? b.stateNode.containerInfo : null;
      a = null;
    } else
      b !== a && (a = null);
  id = a;
  return null;
}
function jd(a) {
  switch (a) {
    case "cancel":
    case "click":
    case "close":
    case "contextmenu":
    case "copy":
    case "cut":
    case "auxclick":
    case "dblclick":
    case "dragend":
    case "dragstart":
    case "drop":
    case "focusin":
    case "focusout":
    case "input":
    case "invalid":
    case "keydown":
    case "keypress":
    case "keyup":
    case "mousedown":
    case "mouseup":
    case "paste":
    case "pause":
    case "play":
    case "pointercancel":
    case "pointerdown":
    case "pointerup":
    case "ratechange":
    case "reset":
    case "resize":
    case "seeked":
    case "submit":
    case "touchcancel":
    case "touchend":
    case "touchstart":
    case "volumechange":
    case "change":
    case "selectionchange":
    case "textInput":
    case "compositionstart":
    case "compositionend":
    case "compositionupdate":
    case "beforeblur":
    case "afterblur":
    case "beforeinput":
    case "blur":
    case "fullscreenchange":
    case "focus":
    case "hashchange":
    case "popstate":
    case "select":
    case "selectstart":
      return 1;
    case "drag":
    case "dragenter":
    case "dragexit":
    case "dragleave":
    case "dragover":
    case "mousemove":
    case "mouseout":
    case "mouseover":
    case "pointermove":
    case "pointerout":
    case "pointerover":
    case "scroll":
    case "toggle":
    case "touchmove":
    case "wheel":
    case "mouseenter":
    case "mouseleave":
    case "pointerenter":
    case "pointerleave":
      return 4;
    case "message":
      switch (ec()) {
        case fc:
          return 1;
        case gc:
          return 4;
        case hc:
        case ic:
          return 16;
        case jc:
          return 536870912;
        default:
          return 16;
      }
    default:
      return 16;
  }
}
var kd = null, ld = null, md = null;
function nd() {
  if (md)
    return md;
  var a, b = ld, c = b.length, d, e = "value" in kd ? kd.value : kd.textContent, f2 = e.length;
  for (a = 0; a < c && b[a] === e[a]; a++)
    ;
  var g = c - a;
  for (d = 1; d <= g && b[c - d] === e[f2 - d]; d++)
    ;
  return md = e.slice(a, 1 < d ? 1 - d : void 0);
}
function od(a) {
  var b = a.keyCode;
  "charCode" in a ? (a = a.charCode, 0 === a && 13 === b && (a = 13)) : a = b;
  10 === a && (a = 13);
  return 32 <= a || 13 === a ? a : 0;
}
function pd() {
  return true;
}
function qd() {
  return false;
}
function rd(a) {
  function b(b2, d, e, f2, g) {
    this._reactName = b2;
    this._targetInst = e;
    this.type = d;
    this.nativeEvent = f2;
    this.target = g;
    this.currentTarget = null;
    for (var c in a)
      a.hasOwnProperty(c) && (b2 = a[c], this[c] = b2 ? b2(f2) : f2[c]);
    this.isDefaultPrevented = (null != f2.defaultPrevented ? f2.defaultPrevented : false === f2.returnValue) ? pd : qd;
    this.isPropagationStopped = qd;
    return this;
  }
  A$2(b.prototype, { preventDefault: function() {
    this.defaultPrevented = true;
    var a2 = this.nativeEvent;
    a2 && (a2.preventDefault ? a2.preventDefault() : "unknown" !== typeof a2.returnValue && (a2.returnValue = false), this.isDefaultPrevented = pd);
  }, stopPropagation: function() {
    var a2 = this.nativeEvent;
    a2 && (a2.stopPropagation ? a2.stopPropagation() : "unknown" !== typeof a2.cancelBubble && (a2.cancelBubble = true), this.isPropagationStopped = pd);
  }, persist: function() {
  }, isPersistent: pd });
  return b;
}
var sd = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(a) {
  return a.timeStamp || Date.now();
}, defaultPrevented: 0, isTrusted: 0 }, td = rd(sd), ud = A$2({}, sd, { view: 0, detail: 0 }), vd = rd(ud), wd, xd, yd, Ad = A$2({}, ud, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: zd, button: 0, buttons: 0, relatedTarget: function(a) {
  return void 0 === a.relatedTarget ? a.fromElement === a.srcElement ? a.toElement : a.fromElement : a.relatedTarget;
}, movementX: function(a) {
  if ("movementX" in a)
    return a.movementX;
  a !== yd && (yd && "mousemove" === a.type ? (wd = a.screenX - yd.screenX, xd = a.screenY - yd.screenY) : xd = wd = 0, yd = a);
  return wd;
}, movementY: function(a) {
  return "movementY" in a ? a.movementY : xd;
} }), Bd = rd(Ad), Cd = A$2({}, Ad, { dataTransfer: 0 }), Dd = rd(Cd), Ed = A$2({}, ud, { relatedTarget: 0 }), Fd = rd(Ed), Gd = A$2({}, sd, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), Hd = rd(Gd), Id = A$2({}, sd, { clipboardData: function(a) {
  return "clipboardData" in a ? a.clipboardData : window.clipboardData;
} }), Jd = rd(Id), Kd = A$2({}, sd, { data: 0 }), Ld = rd(Kd), Md = {
  Esc: "Escape",
  Spacebar: " ",
  Left: "ArrowLeft",
  Up: "ArrowUp",
  Right: "ArrowRight",
  Down: "ArrowDown",
  Del: "Delete",
  Win: "OS",
  Menu: "ContextMenu",
  Apps: "ContextMenu",
  Scroll: "ScrollLock",
  MozPrintableKey: "Unidentified"
}, Nd = {
  8: "Backspace",
  9: "Tab",
  12: "Clear",
  13: "Enter",
  16: "Shift",
  17: "Control",
  18: "Alt",
  19: "Pause",
  20: "CapsLock",
  27: "Escape",
  32: " ",
  33: "PageUp",
  34: "PageDown",
  35: "End",
  36: "Home",
  37: "ArrowLeft",
  38: "ArrowUp",
  39: "ArrowRight",
  40: "ArrowDown",
  45: "Insert",
  46: "Delete",
  112: "F1",
  113: "F2",
  114: "F3",
  115: "F4",
  116: "F5",
  117: "F6",
  118: "F7",
  119: "F8",
  120: "F9",
  121: "F10",
  122: "F11",
  123: "F12",
  144: "NumLock",
  145: "ScrollLock",
  224: "Meta"
}, Od = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
function Pd(a) {
  var b = this.nativeEvent;
  return b.getModifierState ? b.getModifierState(a) : (a = Od[a]) ? !!b[a] : false;
}
function zd() {
  return Pd;
}
var Qd = A$2({}, ud, { key: function(a) {
  if (a.key) {
    var b = Md[a.key] || a.key;
    if ("Unidentified" !== b)
      return b;
  }
  return "keypress" === a.type ? (a = od(a), 13 === a ? "Enter" : String.fromCharCode(a)) : "keydown" === a.type || "keyup" === a.type ? Nd[a.keyCode] || "Unidentified" : "";
}, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: zd, charCode: function(a) {
  return "keypress" === a.type ? od(a) : 0;
}, keyCode: function(a) {
  return "keydown" === a.type || "keyup" === a.type ? a.keyCode : 0;
}, which: function(a) {
  return "keypress" === a.type ? od(a) : "keydown" === a.type || "keyup" === a.type ? a.keyCode : 0;
} }), Rd = rd(Qd), Sd = A$2({}, Ad, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), Td = rd(Sd), Ud = A$2({}, ud, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: zd }), Vd = rd(Ud), Wd = A$2({}, sd, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Xd = rd(Wd), Yd = A$2({}, Ad, {
  deltaX: function(a) {
    return "deltaX" in a ? a.deltaX : "wheelDeltaX" in a ? -a.wheelDeltaX : 0;
  },
  deltaY: function(a) {
    return "deltaY" in a ? a.deltaY : "wheelDeltaY" in a ? -a.wheelDeltaY : "wheelDelta" in a ? -a.wheelDelta : 0;
  },
  deltaZ: 0,
  deltaMode: 0
}), Zd = rd(Yd), $d = [9, 13, 27, 32], ae = ia && "CompositionEvent" in window, be$1 = null;
ia && "documentMode" in document && (be$1 = document.documentMode);
var ce$1 = ia && "TextEvent" in window && !be$1, de$1 = ia && (!ae || be$1 && 8 < be$1 && 11 >= be$1), ee$1 = String.fromCharCode(32), fe$1 = false;
function ge$1(a, b) {
  switch (a) {
    case "keyup":
      return -1 !== $d.indexOf(b.keyCode);
    case "keydown":
      return 229 !== b.keyCode;
    case "keypress":
    case "mousedown":
    case "focusout":
      return true;
    default:
      return false;
  }
}
function he$1(a) {
  a = a.detail;
  return "object" === typeof a && "data" in a ? a.data : null;
}
var ie = false;
function je(a, b) {
  switch (a) {
    case "compositionend":
      return he$1(b);
    case "keypress":
      if (32 !== b.which)
        return null;
      fe$1 = true;
      return ee$1;
    case "textInput":
      return a = b.data, a === ee$1 && fe$1 ? null : a;
    default:
      return null;
  }
}
function ke$1(a, b) {
  if (ie)
    return "compositionend" === a || !ae && ge$1(a, b) ? (a = nd(), md = ld = kd = null, ie = false, a) : null;
  switch (a) {
    case "paste":
      return null;
    case "keypress":
      if (!(b.ctrlKey || b.altKey || b.metaKey) || b.ctrlKey && b.altKey) {
        if (b.char && 1 < b.char.length)
          return b.char;
        if (b.which)
          return String.fromCharCode(b.which);
      }
      return null;
    case "compositionend":
      return de$1 && "ko" !== b.locale ? null : b.data;
    default:
      return null;
  }
}
var le$1 = { color: true, date: true, datetime: true, "datetime-local": true, email: true, month: true, number: true, password: true, range: true, search: true, tel: true, text: true, time: true, url: true, week: true };
function me$1(a) {
  var b = a && a.nodeName && a.nodeName.toLowerCase();
  return "input" === b ? !!le$1[a.type] : "textarea" === b ? true : false;
}
function ne$1(a, b, c, d) {
  Eb(d);
  b = oe$1(b, "onChange");
  0 < b.length && (c = new td("onChange", "change", null, c, d), a.push({ event: c, listeners: b }));
}
var pe$1 = null, qe$1 = null;
function re$1(a) {
  se$1(a, 0);
}
function te$1(a) {
  var b = ue$1(a);
  if (Wa(b))
    return a;
}
function ve$1(a, b) {
  if ("change" === a)
    return b;
}
var we$1 = false;
if (ia) {
  var xe;
  if (ia) {
    var ye$1 = "oninput" in document;
    if (!ye$1) {
      var ze$1 = document.createElement("div");
      ze$1.setAttribute("oninput", "return;");
      ye$1 = "function" === typeof ze$1.oninput;
    }
    xe = ye$1;
  } else
    xe = false;
  we$1 = xe && (!document.documentMode || 9 < document.documentMode);
}
function Ae$1() {
  pe$1 && (pe$1.detachEvent("onpropertychange", Be$1), qe$1 = pe$1 = null);
}
function Be$1(a) {
  if ("value" === a.propertyName && te$1(qe$1)) {
    var b = [];
    ne$1(b, qe$1, a, xb(a));
    Jb(re$1, b);
  }
}
function Ce$1(a, b, c) {
  "focusin" === a ? (Ae$1(), pe$1 = b, qe$1 = c, pe$1.attachEvent("onpropertychange", Be$1)) : "focusout" === a && Ae$1();
}
function De$1(a) {
  if ("selectionchange" === a || "keyup" === a || "keydown" === a)
    return te$1(qe$1);
}
function Ee$1(a, b) {
  if ("click" === a)
    return te$1(b);
}
function Fe(a, b) {
  if ("input" === a || "change" === a)
    return te$1(b);
}
function Ge$1(a, b) {
  return a === b && (0 !== a || 1 / a === 1 / b) || a !== a && b !== b;
}
var He$1 = "function" === typeof Object.is ? Object.is : Ge$1;
function Ie$1(a, b) {
  if (He$1(a, b))
    return true;
  if ("object" !== typeof a || null === a || "object" !== typeof b || null === b)
    return false;
  var c = Object.keys(a), d = Object.keys(b);
  if (c.length !== d.length)
    return false;
  for (d = 0; d < c.length; d++) {
    var e = c[d];
    if (!ja.call(b, e) || !He$1(a[e], b[e]))
      return false;
  }
  return true;
}
function Je(a) {
  for (; a && a.firstChild; )
    a = a.firstChild;
  return a;
}
function Ke$1(a, b) {
  var c = Je(a);
  a = 0;
  for (var d; c; ) {
    if (3 === c.nodeType) {
      d = a + c.textContent.length;
      if (a <= b && d >= b)
        return { node: c, offset: b - a };
      a = d;
    }
    a: {
      for (; c; ) {
        if (c.nextSibling) {
          c = c.nextSibling;
          break a;
        }
        c = c.parentNode;
      }
      c = void 0;
    }
    c = Je(c);
  }
}
function Le$1(a, b) {
  return a && b ? a === b ? true : a && 3 === a.nodeType ? false : b && 3 === b.nodeType ? Le$1(a, b.parentNode) : "contains" in a ? a.contains(b) : a.compareDocumentPosition ? !!(a.compareDocumentPosition(b) & 16) : false : false;
}
function Me$1() {
  for (var a = window, b = Xa(); b instanceof a.HTMLIFrameElement; ) {
    try {
      var c = "string" === typeof b.contentWindow.location.href;
    } catch (d) {
      c = false;
    }
    if (c)
      a = b.contentWindow;
    else
      break;
    b = Xa(a.document);
  }
  return b;
}
function Ne$1(a) {
  var b = a && a.nodeName && a.nodeName.toLowerCase();
  return b && ("input" === b && ("text" === a.type || "search" === a.type || "tel" === a.type || "url" === a.type || "password" === a.type) || "textarea" === b || "true" === a.contentEditable);
}
function Oe$1(a) {
  var b = Me$1(), c = a.focusedElem, d = a.selectionRange;
  if (b !== c && c && c.ownerDocument && Le$1(c.ownerDocument.documentElement, c)) {
    if (null !== d && Ne$1(c)) {
      if (b = d.start, a = d.end, void 0 === a && (a = b), "selectionStart" in c)
        c.selectionStart = b, c.selectionEnd = Math.min(a, c.value.length);
      else if (a = (b = c.ownerDocument || document) && b.defaultView || window, a.getSelection) {
        a = a.getSelection();
        var e = c.textContent.length, f2 = Math.min(d.start, e);
        d = void 0 === d.end ? f2 : Math.min(d.end, e);
        !a.extend && f2 > d && (e = d, d = f2, f2 = e);
        e = Ke$1(c, f2);
        var g = Ke$1(
          c,
          d
        );
        e && g && (1 !== a.rangeCount || a.anchorNode !== e.node || a.anchorOffset !== e.offset || a.focusNode !== g.node || a.focusOffset !== g.offset) && (b = b.createRange(), b.setStart(e.node, e.offset), a.removeAllRanges(), f2 > d ? (a.addRange(b), a.extend(g.node, g.offset)) : (b.setEnd(g.node, g.offset), a.addRange(b)));
      }
    }
    b = [];
    for (a = c; a = a.parentNode; )
      1 === a.nodeType && b.push({ element: a, left: a.scrollLeft, top: a.scrollTop });
    "function" === typeof c.focus && c.focus();
    for (c = 0; c < b.length; c++)
      a = b[c], a.element.scrollLeft = a.left, a.element.scrollTop = a.top;
  }
}
var Pe$1 = ia && "documentMode" in document && 11 >= document.documentMode, Qe$1 = null, Re$1 = null, Se$1 = null, Te$1 = false;
function Ue(a, b, c) {
  var d = c.window === c ? c.document : 9 === c.nodeType ? c : c.ownerDocument;
  Te$1 || null == Qe$1 || Qe$1 !== Xa(d) || (d = Qe$1, "selectionStart" in d && Ne$1(d) ? d = { start: d.selectionStart, end: d.selectionEnd } : (d = (d.ownerDocument && d.ownerDocument.defaultView || window).getSelection(), d = { anchorNode: d.anchorNode, anchorOffset: d.anchorOffset, focusNode: d.focusNode, focusOffset: d.focusOffset }), Se$1 && Ie$1(Se$1, d) || (Se$1 = d, d = oe$1(Re$1, "onSelect"), 0 < d.length && (b = new td("onSelect", "select", null, b, c), a.push({ event: b, listeners: d }), b.target = Qe$1)));
}
function Ve$1(a, b) {
  var c = {};
  c[a.toLowerCase()] = b.toLowerCase();
  c["Webkit" + a] = "webkit" + b;
  c["Moz" + a] = "moz" + b;
  return c;
}
var We$1 = { animationend: Ve$1("Animation", "AnimationEnd"), animationiteration: Ve$1("Animation", "AnimationIteration"), animationstart: Ve$1("Animation", "AnimationStart"), transitionend: Ve$1("Transition", "TransitionEnd") }, Xe = {}, Ye$1 = {};
ia && (Ye$1 = document.createElement("div").style, "AnimationEvent" in window || (delete We$1.animationend.animation, delete We$1.animationiteration.animation, delete We$1.animationstart.animation), "TransitionEvent" in window || delete We$1.transitionend.transition);
function Ze$1(a) {
  if (Xe[a])
    return Xe[a];
  if (!We$1[a])
    return a;
  var b = We$1[a], c;
  for (c in b)
    if (b.hasOwnProperty(c) && c in Ye$1)
      return Xe[a] = b[c];
  return a;
}
var $e$1 = Ze$1("animationend"), af = Ze$1("animationiteration"), bf = Ze$1("animationstart"), cf = Ze$1("transitionend"), df = /* @__PURE__ */ new Map(), ef = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
function ff(a, b) {
  df.set(a, b);
  fa(b, [a]);
}
for (var gf = 0; gf < ef.length; gf++) {
  var hf = ef[gf], jf = hf.toLowerCase(), kf = hf[0].toUpperCase() + hf.slice(1);
  ff(jf, "on" + kf);
}
ff($e$1, "onAnimationEnd");
ff(af, "onAnimationIteration");
ff(bf, "onAnimationStart");
ff("dblclick", "onDoubleClick");
ff("focusin", "onFocus");
ff("focusout", "onBlur");
ff(cf, "onTransitionEnd");
ha("onMouseEnter", ["mouseout", "mouseover"]);
ha("onMouseLeave", ["mouseout", "mouseover"]);
ha("onPointerEnter", ["pointerout", "pointerover"]);
ha("onPointerLeave", ["pointerout", "pointerover"]);
fa("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
fa("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));
fa("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
fa("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
fa("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
fa("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
var lf = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), mf = new Set("cancel close invalid load scroll toggle".split(" ").concat(lf));
function nf(a, b, c) {
  var d = a.type || "unknown-event";
  a.currentTarget = c;
  Ub(d, b, void 0, a);
  a.currentTarget = null;
}
function se$1(a, b) {
  b = 0 !== (b & 4);
  for (var c = 0; c < a.length; c++) {
    var d = a[c], e = d.event;
    d = d.listeners;
    a: {
      var f2 = void 0;
      if (b)
        for (var g = d.length - 1; 0 <= g; g--) {
          var h = d[g], k2 = h.instance, l2 = h.currentTarget;
          h = h.listener;
          if (k2 !== f2 && e.isPropagationStopped())
            break a;
          nf(e, h, l2);
          f2 = k2;
        }
      else
        for (g = 0; g < d.length; g++) {
          h = d[g];
          k2 = h.instance;
          l2 = h.currentTarget;
          h = h.listener;
          if (k2 !== f2 && e.isPropagationStopped())
            break a;
          nf(e, h, l2);
          f2 = k2;
        }
    }
  }
  if (Qb)
    throw a = Rb, Qb = false, Rb = null, a;
}
function D$1(a, b) {
  var c = b[of];
  void 0 === c && (c = b[of] = /* @__PURE__ */ new Set());
  var d = a + "__bubble";
  c.has(d) || (pf(b, a, 2, false), c.add(d));
}
function qf(a, b, c) {
  var d = 0;
  b && (d |= 4);
  pf(c, a, d, b);
}
var rf = "_reactListening" + Math.random().toString(36).slice(2);
function sf(a) {
  if (!a[rf]) {
    a[rf] = true;
    da.forEach(function(b2) {
      "selectionchange" !== b2 && (mf.has(b2) || qf(b2, false, a), qf(b2, true, a));
    });
    var b = 9 === a.nodeType ? a : a.ownerDocument;
    null === b || b[rf] || (b[rf] = true, qf("selectionchange", false, b));
  }
}
function pf(a, b, c, d) {
  switch (jd(b)) {
    case 1:
      var e = ed;
      break;
    case 4:
      e = gd;
      break;
    default:
      e = fd;
  }
  c = e.bind(null, b, c, a);
  e = void 0;
  !Lb || "touchstart" !== b && "touchmove" !== b && "wheel" !== b || (e = true);
  d ? void 0 !== e ? a.addEventListener(b, c, { capture: true, passive: e }) : a.addEventListener(b, c, true) : void 0 !== e ? a.addEventListener(b, c, { passive: e }) : a.addEventListener(b, c, false);
}
function hd(a, b, c, d, e) {
  var f2 = d;
  if (0 === (b & 1) && 0 === (b & 2) && null !== d)
    a:
      for (; ; ) {
        if (null === d)
          return;
        var g = d.tag;
        if (3 === g || 4 === g) {
          var h = d.stateNode.containerInfo;
          if (h === e || 8 === h.nodeType && h.parentNode === e)
            break;
          if (4 === g)
            for (g = d.return; null !== g; ) {
              var k2 = g.tag;
              if (3 === k2 || 4 === k2) {
                if (k2 = g.stateNode.containerInfo, k2 === e || 8 === k2.nodeType && k2.parentNode === e)
                  return;
              }
              g = g.return;
            }
          for (; null !== h; ) {
            g = Wc(h);
            if (null === g)
              return;
            k2 = g.tag;
            if (5 === k2 || 6 === k2) {
              d = f2 = g;
              continue a;
            }
            h = h.parentNode;
          }
        }
        d = d.return;
      }
  Jb(function() {
    var d2 = f2, e2 = xb(c), g2 = [];
    a: {
      var h2 = df.get(a);
      if (void 0 !== h2) {
        var k3 = td, n2 = a;
        switch (a) {
          case "keypress":
            if (0 === od(c))
              break a;
          case "keydown":
          case "keyup":
            k3 = Rd;
            break;
          case "focusin":
            n2 = "focus";
            k3 = Fd;
            break;
          case "focusout":
            n2 = "blur";
            k3 = Fd;
            break;
          case "beforeblur":
          case "afterblur":
            k3 = Fd;
            break;
          case "click":
            if (2 === c.button)
              break a;
          case "auxclick":
          case "dblclick":
          case "mousedown":
          case "mousemove":
          case "mouseup":
          case "mouseout":
          case "mouseover":
          case "contextmenu":
            k3 = Bd;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            k3 = Dd;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            k3 = Vd;
            break;
          case $e$1:
          case af:
          case bf:
            k3 = Hd;
            break;
          case cf:
            k3 = Xd;
            break;
          case "scroll":
            k3 = vd;
            break;
          case "wheel":
            k3 = Zd;
            break;
          case "copy":
          case "cut":
          case "paste":
            k3 = Jd;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            k3 = Td;
        }
        var t2 = 0 !== (b & 4), J2 = !t2 && "scroll" === a, x2 = t2 ? null !== h2 ? h2 + "Capture" : null : h2;
        t2 = [];
        for (var w2 = d2, u2; null !== w2; ) {
          u2 = w2;
          var F2 = u2.stateNode;
          5 === u2.tag && null !== F2 && (u2 = F2, null !== x2 && (F2 = Kb(w2, x2), null != F2 && t2.push(tf(w2, F2, u2))));
          if (J2)
            break;
          w2 = w2.return;
        }
        0 < t2.length && (h2 = new k3(h2, n2, null, c, e2), g2.push({ event: h2, listeners: t2 }));
      }
    }
    if (0 === (b & 7)) {
      a: {
        h2 = "mouseover" === a || "pointerover" === a;
        k3 = "mouseout" === a || "pointerout" === a;
        if (h2 && c !== wb && (n2 = c.relatedTarget || c.fromElement) && (Wc(n2) || n2[uf]))
          break a;
        if (k3 || h2) {
          h2 = e2.window === e2 ? e2 : (h2 = e2.ownerDocument) ? h2.defaultView || h2.parentWindow : window;
          if (k3) {
            if (n2 = c.relatedTarget || c.toElement, k3 = d2, n2 = n2 ? Wc(n2) : null, null !== n2 && (J2 = Vb(n2), n2 !== J2 || 5 !== n2.tag && 6 !== n2.tag))
              n2 = null;
          } else
            k3 = null, n2 = d2;
          if (k3 !== n2) {
            t2 = Bd;
            F2 = "onMouseLeave";
            x2 = "onMouseEnter";
            w2 = "mouse";
            if ("pointerout" === a || "pointerover" === a)
              t2 = Td, F2 = "onPointerLeave", x2 = "onPointerEnter", w2 = "pointer";
            J2 = null == k3 ? h2 : ue$1(k3);
            u2 = null == n2 ? h2 : ue$1(n2);
            h2 = new t2(F2, w2 + "leave", k3, c, e2);
            h2.target = J2;
            h2.relatedTarget = u2;
            F2 = null;
            Wc(e2) === d2 && (t2 = new t2(x2, w2 + "enter", n2, c, e2), t2.target = u2, t2.relatedTarget = J2, F2 = t2);
            J2 = F2;
            if (k3 && n2)
              b: {
                t2 = k3;
                x2 = n2;
                w2 = 0;
                for (u2 = t2; u2; u2 = vf(u2))
                  w2++;
                u2 = 0;
                for (F2 = x2; F2; F2 = vf(F2))
                  u2++;
                for (; 0 < w2 - u2; )
                  t2 = vf(t2), w2--;
                for (; 0 < u2 - w2; )
                  x2 = vf(x2), u2--;
                for (; w2--; ) {
                  if (t2 === x2 || null !== x2 && t2 === x2.alternate)
                    break b;
                  t2 = vf(t2);
                  x2 = vf(x2);
                }
                t2 = null;
              }
            else
              t2 = null;
            null !== k3 && wf(g2, h2, k3, t2, false);
            null !== n2 && null !== J2 && wf(g2, J2, n2, t2, true);
          }
        }
      }
      a: {
        h2 = d2 ? ue$1(d2) : window;
        k3 = h2.nodeName && h2.nodeName.toLowerCase();
        if ("select" === k3 || "input" === k3 && "file" === h2.type)
          var na = ve$1;
        else if (me$1(h2))
          if (we$1)
            na = Fe;
          else {
            na = De$1;
            var xa = Ce$1;
          }
        else
          (k3 = h2.nodeName) && "input" === k3.toLowerCase() && ("checkbox" === h2.type || "radio" === h2.type) && (na = Ee$1);
        if (na && (na = na(a, d2))) {
          ne$1(g2, na, c, e2);
          break a;
        }
        xa && xa(a, h2, d2);
        "focusout" === a && (xa = h2._wrapperState) && xa.controlled && "number" === h2.type && cb(h2, "number", h2.value);
      }
      xa = d2 ? ue$1(d2) : window;
      switch (a) {
        case "focusin":
          if (me$1(xa) || "true" === xa.contentEditable)
            Qe$1 = xa, Re$1 = d2, Se$1 = null;
          break;
        case "focusout":
          Se$1 = Re$1 = Qe$1 = null;
          break;
        case "mousedown":
          Te$1 = true;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          Te$1 = false;
          Ue(g2, c, e2);
          break;
        case "selectionchange":
          if (Pe$1)
            break;
        case "keydown":
        case "keyup":
          Ue(g2, c, e2);
      }
      var $a;
      if (ae)
        b: {
          switch (a) {
            case "compositionstart":
              var ba = "onCompositionStart";
              break b;
            case "compositionend":
              ba = "onCompositionEnd";
              break b;
            case "compositionupdate":
              ba = "onCompositionUpdate";
              break b;
          }
          ba = void 0;
        }
      else
        ie ? ge$1(a, c) && (ba = "onCompositionEnd") : "keydown" === a && 229 === c.keyCode && (ba = "onCompositionStart");
      ba && (de$1 && "ko" !== c.locale && (ie || "onCompositionStart" !== ba ? "onCompositionEnd" === ba && ie && ($a = nd()) : (kd = e2, ld = "value" in kd ? kd.value : kd.textContent, ie = true)), xa = oe$1(d2, ba), 0 < xa.length && (ba = new Ld(ba, a, null, c, e2), g2.push({ event: ba, listeners: xa }), $a ? ba.data = $a : ($a = he$1(c), null !== $a && (ba.data = $a))));
      if ($a = ce$1 ? je(a, c) : ke$1(a, c))
        d2 = oe$1(d2, "onBeforeInput"), 0 < d2.length && (e2 = new Ld("onBeforeInput", "beforeinput", null, c, e2), g2.push({ event: e2, listeners: d2 }), e2.data = $a);
    }
    se$1(g2, b);
  });
}
function tf(a, b, c) {
  return { instance: a, listener: b, currentTarget: c };
}
function oe$1(a, b) {
  for (var c = b + "Capture", d = []; null !== a; ) {
    var e = a, f2 = e.stateNode;
    5 === e.tag && null !== f2 && (e = f2, f2 = Kb(a, c), null != f2 && d.unshift(tf(a, f2, e)), f2 = Kb(a, b), null != f2 && d.push(tf(a, f2, e)));
    a = a.return;
  }
  return d;
}
function vf(a) {
  if (null === a)
    return null;
  do
    a = a.return;
  while (a && 5 !== a.tag);
  return a ? a : null;
}
function wf(a, b, c, d, e) {
  for (var f2 = b._reactName, g = []; null !== c && c !== d; ) {
    var h = c, k2 = h.alternate, l2 = h.stateNode;
    if (null !== k2 && k2 === d)
      break;
    5 === h.tag && null !== l2 && (h = l2, e ? (k2 = Kb(c, f2), null != k2 && g.unshift(tf(c, k2, h))) : e || (k2 = Kb(c, f2), null != k2 && g.push(tf(c, k2, h))));
    c = c.return;
  }
  0 !== g.length && a.push({ event: b, listeners: g });
}
var xf = /\r\n?/g, yf = /\u0000|\uFFFD/g;
function zf(a) {
  return ("string" === typeof a ? a : "" + a).replace(xf, "\n").replace(yf, "");
}
function Af(a, b, c) {
  b = zf(b);
  if (zf(a) !== b && c)
    throw Error(p(425));
}
function Bf() {
}
var Cf = null, Df = null;
function Ef(a, b) {
  return "textarea" === a || "noscript" === a || "string" === typeof b.children || "number" === typeof b.children || "object" === typeof b.dangerouslySetInnerHTML && null !== b.dangerouslySetInnerHTML && null != b.dangerouslySetInnerHTML.__html;
}
var Ff = "function" === typeof setTimeout ? setTimeout : void 0, Gf = "function" === typeof clearTimeout ? clearTimeout : void 0, Hf = "function" === typeof Promise ? Promise : void 0, Jf = "function" === typeof queueMicrotask ? queueMicrotask : "undefined" !== typeof Hf ? function(a) {
  return Hf.resolve(null).then(a).catch(If);
} : Ff;
function If(a) {
  setTimeout(function() {
    throw a;
  });
}
function Kf(a, b) {
  var c = b, d = 0;
  do {
    var e = c.nextSibling;
    a.removeChild(c);
    if (e && 8 === e.nodeType)
      if (c = e.data, "/$" === c) {
        if (0 === d) {
          a.removeChild(e);
          bd(b);
          return;
        }
        d--;
      } else
        "$" !== c && "$?" !== c && "$!" !== c || d++;
    c = e;
  } while (c);
  bd(b);
}
function Lf(a) {
  for (; null != a; a = a.nextSibling) {
    var b = a.nodeType;
    if (1 === b || 3 === b)
      break;
    if (8 === b) {
      b = a.data;
      if ("$" === b || "$!" === b || "$?" === b)
        break;
      if ("/$" === b)
        return null;
    }
  }
  return a;
}
function Mf(a) {
  a = a.previousSibling;
  for (var b = 0; a; ) {
    if (8 === a.nodeType) {
      var c = a.data;
      if ("$" === c || "$!" === c || "$?" === c) {
        if (0 === b)
          return a;
        b--;
      } else
        "/$" === c && b++;
    }
    a = a.previousSibling;
  }
  return null;
}
var Nf = Math.random().toString(36).slice(2), Of = "__reactFiber$" + Nf, Pf = "__reactProps$" + Nf, uf = "__reactContainer$" + Nf, of = "__reactEvents$" + Nf, Qf = "__reactListeners$" + Nf, Rf = "__reactHandles$" + Nf;
function Wc(a) {
  var b = a[Of];
  if (b)
    return b;
  for (var c = a.parentNode; c; ) {
    if (b = c[uf] || c[Of]) {
      c = b.alternate;
      if (null !== b.child || null !== c && null !== c.child)
        for (a = Mf(a); null !== a; ) {
          if (c = a[Of])
            return c;
          a = Mf(a);
        }
      return b;
    }
    a = c;
    c = a.parentNode;
  }
  return null;
}
function Cb(a) {
  a = a[Of] || a[uf];
  return !a || 5 !== a.tag && 6 !== a.tag && 13 !== a.tag && 3 !== a.tag ? null : a;
}
function ue$1(a) {
  if (5 === a.tag || 6 === a.tag)
    return a.stateNode;
  throw Error(p(33));
}
function Db(a) {
  return a[Pf] || null;
}
var Sf = [], Tf = -1;
function Uf(a) {
  return { current: a };
}
function E$1(a) {
  0 > Tf || (a.current = Sf[Tf], Sf[Tf] = null, Tf--);
}
function G$1(a, b) {
  Tf++;
  Sf[Tf] = a.current;
  a.current = b;
}
var Vf = {}, H$1 = Uf(Vf), Wf = Uf(false), Xf = Vf;
function Yf(a, b) {
  var c = a.type.contextTypes;
  if (!c)
    return Vf;
  var d = a.stateNode;
  if (d && d.__reactInternalMemoizedUnmaskedChildContext === b)
    return d.__reactInternalMemoizedMaskedChildContext;
  var e = {}, f2;
  for (f2 in c)
    e[f2] = b[f2];
  d && (a = a.stateNode, a.__reactInternalMemoizedUnmaskedChildContext = b, a.__reactInternalMemoizedMaskedChildContext = e);
  return e;
}
function Zf(a) {
  a = a.childContextTypes;
  return null !== a && void 0 !== a;
}
function $f() {
  E$1(Wf);
  E$1(H$1);
}
function ag(a, b, c) {
  if (H$1.current !== Vf)
    throw Error(p(168));
  G$1(H$1, b);
  G$1(Wf, c);
}
function bg(a, b, c) {
  var d = a.stateNode;
  b = b.childContextTypes;
  if ("function" !== typeof d.getChildContext)
    return c;
  d = d.getChildContext();
  for (var e in d)
    if (!(e in b))
      throw Error(p(108, Ra(a) || "Unknown", e));
  return A$2({}, c, d);
}
function cg(a) {
  a = (a = a.stateNode) && a.__reactInternalMemoizedMergedChildContext || Vf;
  Xf = H$1.current;
  G$1(H$1, a);
  G$1(Wf, Wf.current);
  return true;
}
function dg(a, b, c) {
  var d = a.stateNode;
  if (!d)
    throw Error(p(169));
  c ? (a = bg(a, b, Xf), d.__reactInternalMemoizedMergedChildContext = a, E$1(Wf), E$1(H$1), G$1(H$1, a)) : E$1(Wf);
  G$1(Wf, c);
}
var eg = null, fg = false, gg = false;
function hg(a) {
  null === eg ? eg = [a] : eg.push(a);
}
function ig(a) {
  fg = true;
  hg(a);
}
function jg() {
  if (!gg && null !== eg) {
    gg = true;
    var a = 0, b = C$1;
    try {
      var c = eg;
      for (C$1 = 1; a < c.length; a++) {
        var d = c[a];
        do
          d = d(true);
        while (null !== d);
      }
      eg = null;
      fg = false;
    } catch (e) {
      throw null !== eg && (eg = eg.slice(a + 1)), ac(fc, jg), e;
    } finally {
      C$1 = b, gg = false;
    }
  }
  return null;
}
var kg = [], lg = 0, mg = null, ng = 0, og = [], pg = 0, qg = null, rg = 1, sg = "";
function tg(a, b) {
  kg[lg++] = ng;
  kg[lg++] = mg;
  mg = a;
  ng = b;
}
function ug(a, b, c) {
  og[pg++] = rg;
  og[pg++] = sg;
  og[pg++] = qg;
  qg = a;
  var d = rg;
  a = sg;
  var e = 32 - oc(d) - 1;
  d &= ~(1 << e);
  c += 1;
  var f2 = 32 - oc(b) + e;
  if (30 < f2) {
    var g = e - e % 5;
    f2 = (d & (1 << g) - 1).toString(32);
    d >>= g;
    e -= g;
    rg = 1 << 32 - oc(b) + e | c << e | d;
    sg = f2 + a;
  } else
    rg = 1 << f2 | c << e | d, sg = a;
}
function vg(a) {
  null !== a.return && (tg(a, 1), ug(a, 1, 0));
}
function wg(a) {
  for (; a === mg; )
    mg = kg[--lg], kg[lg] = null, ng = kg[--lg], kg[lg] = null;
  for (; a === qg; )
    qg = og[--pg], og[pg] = null, sg = og[--pg], og[pg] = null, rg = og[--pg], og[pg] = null;
}
var xg = null, yg = null, I$1 = false, zg = null;
function Ag(a, b) {
  var c = Bg(5, null, null, 0);
  c.elementType = "DELETED";
  c.stateNode = b;
  c.return = a;
  b = a.deletions;
  null === b ? (a.deletions = [c], a.flags |= 16) : b.push(c);
}
function Cg(a, b) {
  switch (a.tag) {
    case 5:
      var c = a.type;
      b = 1 !== b.nodeType || c.toLowerCase() !== b.nodeName.toLowerCase() ? null : b;
      return null !== b ? (a.stateNode = b, xg = a, yg = Lf(b.firstChild), true) : false;
    case 6:
      return b = "" === a.pendingProps || 3 !== b.nodeType ? null : b, null !== b ? (a.stateNode = b, xg = a, yg = null, true) : false;
    case 13:
      return b = 8 !== b.nodeType ? null : b, null !== b ? (c = null !== qg ? { id: rg, overflow: sg } : null, a.memoizedState = { dehydrated: b, treeContext: c, retryLane: 1073741824 }, c = Bg(18, null, null, 0), c.stateNode = b, c.return = a, a.child = c, xg = a, yg = null, true) : false;
    default:
      return false;
  }
}
function Dg(a) {
  return 0 !== (a.mode & 1) && 0 === (a.flags & 128);
}
function Eg(a) {
  if (I$1) {
    var b = yg;
    if (b) {
      var c = b;
      if (!Cg(a, b)) {
        if (Dg(a))
          throw Error(p(418));
        b = Lf(c.nextSibling);
        var d = xg;
        b && Cg(a, b) ? Ag(d, c) : (a.flags = a.flags & -4097 | 2, I$1 = false, xg = a);
      }
    } else {
      if (Dg(a))
        throw Error(p(418));
      a.flags = a.flags & -4097 | 2;
      I$1 = false;
      xg = a;
    }
  }
}
function Fg(a) {
  for (a = a.return; null !== a && 5 !== a.tag && 3 !== a.tag && 13 !== a.tag; )
    a = a.return;
  xg = a;
}
function Gg(a) {
  if (a !== xg)
    return false;
  if (!I$1)
    return Fg(a), I$1 = true, false;
  var b;
  (b = 3 !== a.tag) && !(b = 5 !== a.tag) && (b = a.type, b = "head" !== b && "body" !== b && !Ef(a.type, a.memoizedProps));
  if (b && (b = yg)) {
    if (Dg(a))
      throw Hg(), Error(p(418));
    for (; b; )
      Ag(a, b), b = Lf(b.nextSibling);
  }
  Fg(a);
  if (13 === a.tag) {
    a = a.memoizedState;
    a = null !== a ? a.dehydrated : null;
    if (!a)
      throw Error(p(317));
    a: {
      a = a.nextSibling;
      for (b = 0; a; ) {
        if (8 === a.nodeType) {
          var c = a.data;
          if ("/$" === c) {
            if (0 === b) {
              yg = Lf(a.nextSibling);
              break a;
            }
            b--;
          } else
            "$" !== c && "$!" !== c && "$?" !== c || b++;
        }
        a = a.nextSibling;
      }
      yg = null;
    }
  } else
    yg = xg ? Lf(a.stateNode.nextSibling) : null;
  return true;
}
function Hg() {
  for (var a = yg; a; )
    a = Lf(a.nextSibling);
}
function Ig() {
  yg = xg = null;
  I$1 = false;
}
function Jg(a) {
  null === zg ? zg = [a] : zg.push(a);
}
var Kg = ua.ReactCurrentBatchConfig;
function Lg(a, b) {
  if (a && a.defaultProps) {
    b = A$2({}, b);
    a = a.defaultProps;
    for (var c in a)
      void 0 === b[c] && (b[c] = a[c]);
    return b;
  }
  return b;
}
var Mg = Uf(null), Ng = null, Og = null, Pg = null;
function Qg() {
  Pg = Og = Ng = null;
}
function Rg(a) {
  var b = Mg.current;
  E$1(Mg);
  a._currentValue = b;
}
function Sg(a, b, c) {
  for (; null !== a; ) {
    var d = a.alternate;
    (a.childLanes & b) !== b ? (a.childLanes |= b, null !== d && (d.childLanes |= b)) : null !== d && (d.childLanes & b) !== b && (d.childLanes |= b);
    if (a === c)
      break;
    a = a.return;
  }
}
function Tg(a, b) {
  Ng = a;
  Pg = Og = null;
  a = a.dependencies;
  null !== a && null !== a.firstContext && (0 !== (a.lanes & b) && (Ug = true), a.firstContext = null);
}
function Vg(a) {
  var b = a._currentValue;
  if (Pg !== a)
    if (a = { context: a, memoizedValue: b, next: null }, null === Og) {
      if (null === Ng)
        throw Error(p(308));
      Og = a;
      Ng.dependencies = { lanes: 0, firstContext: a };
    } else
      Og = Og.next = a;
  return b;
}
var Wg = null;
function Xg(a) {
  null === Wg ? Wg = [a] : Wg.push(a);
}
function Yg(a, b, c, d) {
  var e = b.interleaved;
  null === e ? (c.next = c, Xg(b)) : (c.next = e.next, e.next = c);
  b.interleaved = c;
  return Zg(a, d);
}
function Zg(a, b) {
  a.lanes |= b;
  var c = a.alternate;
  null !== c && (c.lanes |= b);
  c = a;
  for (a = a.return; null !== a; )
    a.childLanes |= b, c = a.alternate, null !== c && (c.childLanes |= b), c = a, a = a.return;
  return 3 === c.tag ? c.stateNode : null;
}
var $g = false;
function ah(a) {
  a.updateQueue = { baseState: a.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
}
function bh(a, b) {
  a = a.updateQueue;
  b.updateQueue === a && (b.updateQueue = { baseState: a.baseState, firstBaseUpdate: a.firstBaseUpdate, lastBaseUpdate: a.lastBaseUpdate, shared: a.shared, effects: a.effects });
}
function ch(a, b) {
  return { eventTime: a, lane: b, tag: 0, payload: null, callback: null, next: null };
}
function dh(a, b, c) {
  var d = a.updateQueue;
  if (null === d)
    return null;
  d = d.shared;
  if (0 !== (K$1 & 2)) {
    var e = d.pending;
    null === e ? b.next = b : (b.next = e.next, e.next = b);
    d.pending = b;
    return Zg(a, c);
  }
  e = d.interleaved;
  null === e ? (b.next = b, Xg(d)) : (b.next = e.next, e.next = b);
  d.interleaved = b;
  return Zg(a, c);
}
function eh(a, b, c) {
  b = b.updateQueue;
  if (null !== b && (b = b.shared, 0 !== (c & 4194240))) {
    var d = b.lanes;
    d &= a.pendingLanes;
    c |= d;
    b.lanes = c;
    Cc(a, c);
  }
}
function fh(a, b) {
  var c = a.updateQueue, d = a.alternate;
  if (null !== d && (d = d.updateQueue, c === d)) {
    var e = null, f2 = null;
    c = c.firstBaseUpdate;
    if (null !== c) {
      do {
        var g = { eventTime: c.eventTime, lane: c.lane, tag: c.tag, payload: c.payload, callback: c.callback, next: null };
        null === f2 ? e = f2 = g : f2 = f2.next = g;
        c = c.next;
      } while (null !== c);
      null === f2 ? e = f2 = b : f2 = f2.next = b;
    } else
      e = f2 = b;
    c = { baseState: d.baseState, firstBaseUpdate: e, lastBaseUpdate: f2, shared: d.shared, effects: d.effects };
    a.updateQueue = c;
    return;
  }
  a = c.lastBaseUpdate;
  null === a ? c.firstBaseUpdate = b : a.next = b;
  c.lastBaseUpdate = b;
}
function gh(a, b, c, d) {
  var e = a.updateQueue;
  $g = false;
  var f2 = e.firstBaseUpdate, g = e.lastBaseUpdate, h = e.shared.pending;
  if (null !== h) {
    e.shared.pending = null;
    var k2 = h, l2 = k2.next;
    k2.next = null;
    null === g ? f2 = l2 : g.next = l2;
    g = k2;
    var m2 = a.alternate;
    null !== m2 && (m2 = m2.updateQueue, h = m2.lastBaseUpdate, h !== g && (null === h ? m2.firstBaseUpdate = l2 : h.next = l2, m2.lastBaseUpdate = k2));
  }
  if (null !== f2) {
    var q2 = e.baseState;
    g = 0;
    m2 = l2 = k2 = null;
    h = f2;
    do {
      var r2 = h.lane, y2 = h.eventTime;
      if ((d & r2) === r2) {
        null !== m2 && (m2 = m2.next = {
          eventTime: y2,
          lane: 0,
          tag: h.tag,
          payload: h.payload,
          callback: h.callback,
          next: null
        });
        a: {
          var n2 = a, t2 = h;
          r2 = b;
          y2 = c;
          switch (t2.tag) {
            case 1:
              n2 = t2.payload;
              if ("function" === typeof n2) {
                q2 = n2.call(y2, q2, r2);
                break a;
              }
              q2 = n2;
              break a;
            case 3:
              n2.flags = n2.flags & -65537 | 128;
            case 0:
              n2 = t2.payload;
              r2 = "function" === typeof n2 ? n2.call(y2, q2, r2) : n2;
              if (null === r2 || void 0 === r2)
                break a;
              q2 = A$2({}, q2, r2);
              break a;
            case 2:
              $g = true;
          }
        }
        null !== h.callback && 0 !== h.lane && (a.flags |= 64, r2 = e.effects, null === r2 ? e.effects = [h] : r2.push(h));
      } else
        y2 = { eventTime: y2, lane: r2, tag: h.tag, payload: h.payload, callback: h.callback, next: null }, null === m2 ? (l2 = m2 = y2, k2 = q2) : m2 = m2.next = y2, g |= r2;
      h = h.next;
      if (null === h)
        if (h = e.shared.pending, null === h)
          break;
        else
          r2 = h, h = r2.next, r2.next = null, e.lastBaseUpdate = r2, e.shared.pending = null;
    } while (1);
    null === m2 && (k2 = q2);
    e.baseState = k2;
    e.firstBaseUpdate = l2;
    e.lastBaseUpdate = m2;
    b = e.shared.interleaved;
    if (null !== b) {
      e = b;
      do
        g |= e.lane, e = e.next;
      while (e !== b);
    } else
      null === f2 && (e.shared.lanes = 0);
    hh |= g;
    a.lanes = g;
    a.memoizedState = q2;
  }
}
function ih(a, b, c) {
  a = b.effects;
  b.effects = null;
  if (null !== a)
    for (b = 0; b < a.length; b++) {
      var d = a[b], e = d.callback;
      if (null !== e) {
        d.callback = null;
        d = c;
        if ("function" !== typeof e)
          throw Error(p(191, e));
        e.call(d);
      }
    }
}
var jh = new aa.Component().refs;
function kh(a, b, c, d) {
  b = a.memoizedState;
  c = c(d, b);
  c = null === c || void 0 === c ? b : A$2({}, b, c);
  a.memoizedState = c;
  0 === a.lanes && (a.updateQueue.baseState = c);
}
var nh = { isMounted: function(a) {
  return (a = a._reactInternals) ? Vb(a) === a : false;
}, enqueueSetState: function(a, b, c) {
  a = a._reactInternals;
  var d = L$1(), e = lh(a), f2 = ch(d, e);
  f2.payload = b;
  void 0 !== c && null !== c && (f2.callback = c);
  b = dh(a, f2, e);
  null !== b && (mh(b, a, e, d), eh(b, a, e));
}, enqueueReplaceState: function(a, b, c) {
  a = a._reactInternals;
  var d = L$1(), e = lh(a), f2 = ch(d, e);
  f2.tag = 1;
  f2.payload = b;
  void 0 !== c && null !== c && (f2.callback = c);
  b = dh(a, f2, e);
  null !== b && (mh(b, a, e, d), eh(b, a, e));
}, enqueueForceUpdate: function(a, b) {
  a = a._reactInternals;
  var c = L$1(), d = lh(a), e = ch(c, d);
  e.tag = 2;
  void 0 !== b && null !== b && (e.callback = b);
  b = dh(a, e, d);
  null !== b && (mh(b, a, d, c), eh(b, a, d));
} };
function oh(a, b, c, d, e, f2, g) {
  a = a.stateNode;
  return "function" === typeof a.shouldComponentUpdate ? a.shouldComponentUpdate(d, f2, g) : b.prototype && b.prototype.isPureReactComponent ? !Ie$1(c, d) || !Ie$1(e, f2) : true;
}
function ph(a, b, c) {
  var d = false, e = Vf;
  var f2 = b.contextType;
  "object" === typeof f2 && null !== f2 ? f2 = Vg(f2) : (e = Zf(b) ? Xf : H$1.current, d = b.contextTypes, f2 = (d = null !== d && void 0 !== d) ? Yf(a, e) : Vf);
  b = new b(c, f2);
  a.memoizedState = null !== b.state && void 0 !== b.state ? b.state : null;
  b.updater = nh;
  a.stateNode = b;
  b._reactInternals = a;
  d && (a = a.stateNode, a.__reactInternalMemoizedUnmaskedChildContext = e, a.__reactInternalMemoizedMaskedChildContext = f2);
  return b;
}
function qh(a, b, c, d) {
  a = b.state;
  "function" === typeof b.componentWillReceiveProps && b.componentWillReceiveProps(c, d);
  "function" === typeof b.UNSAFE_componentWillReceiveProps && b.UNSAFE_componentWillReceiveProps(c, d);
  b.state !== a && nh.enqueueReplaceState(b, b.state, null);
}
function rh(a, b, c, d) {
  var e = a.stateNode;
  e.props = c;
  e.state = a.memoizedState;
  e.refs = jh;
  ah(a);
  var f2 = b.contextType;
  "object" === typeof f2 && null !== f2 ? e.context = Vg(f2) : (f2 = Zf(b) ? Xf : H$1.current, e.context = Yf(a, f2));
  e.state = a.memoizedState;
  f2 = b.getDerivedStateFromProps;
  "function" === typeof f2 && (kh(a, b, f2, c), e.state = a.memoizedState);
  "function" === typeof b.getDerivedStateFromProps || "function" === typeof e.getSnapshotBeforeUpdate || "function" !== typeof e.UNSAFE_componentWillMount && "function" !== typeof e.componentWillMount || (b = e.state, "function" === typeof e.componentWillMount && e.componentWillMount(), "function" === typeof e.UNSAFE_componentWillMount && e.UNSAFE_componentWillMount(), b !== e.state && nh.enqueueReplaceState(e, e.state, null), gh(a, c, e, d), e.state = a.memoizedState);
  "function" === typeof e.componentDidMount && (a.flags |= 4194308);
}
function sh(a, b, c) {
  a = c.ref;
  if (null !== a && "function" !== typeof a && "object" !== typeof a) {
    if (c._owner) {
      c = c._owner;
      if (c) {
        if (1 !== c.tag)
          throw Error(p(309));
        var d = c.stateNode;
      }
      if (!d)
        throw Error(p(147, a));
      var e = d, f2 = "" + a;
      if (null !== b && null !== b.ref && "function" === typeof b.ref && b.ref._stringRef === f2)
        return b.ref;
      b = function(a2) {
        var b2 = e.refs;
        b2 === jh && (b2 = e.refs = {});
        null === a2 ? delete b2[f2] : b2[f2] = a2;
      };
      b._stringRef = f2;
      return b;
    }
    if ("string" !== typeof a)
      throw Error(p(284));
    if (!c._owner)
      throw Error(p(290, a));
  }
  return a;
}
function th(a, b) {
  a = Object.prototype.toString.call(b);
  throw Error(p(31, "[object Object]" === a ? "object with keys {" + Object.keys(b).join(", ") + "}" : a));
}
function uh(a) {
  var b = a._init;
  return b(a._payload);
}
function vh(a) {
  function b(b2, c2) {
    if (a) {
      var d2 = b2.deletions;
      null === d2 ? (b2.deletions = [c2], b2.flags |= 16) : d2.push(c2);
    }
  }
  function c(c2, d2) {
    if (!a)
      return null;
    for (; null !== d2; )
      b(c2, d2), d2 = d2.sibling;
    return null;
  }
  function d(a2, b2) {
    for (a2 = /* @__PURE__ */ new Map(); null !== b2; )
      null !== b2.key ? a2.set(b2.key, b2) : a2.set(b2.index, b2), b2 = b2.sibling;
    return a2;
  }
  function e(a2, b2) {
    a2 = wh(a2, b2);
    a2.index = 0;
    a2.sibling = null;
    return a2;
  }
  function f2(b2, c2, d2) {
    b2.index = d2;
    if (!a)
      return b2.flags |= 1048576, c2;
    d2 = b2.alternate;
    if (null !== d2)
      return d2 = d2.index, d2 < c2 ? (b2.flags |= 2, c2) : d2;
    b2.flags |= 2;
    return c2;
  }
  function g(b2) {
    a && null === b2.alternate && (b2.flags |= 2);
    return b2;
  }
  function h(a2, b2, c2, d2) {
    if (null === b2 || 6 !== b2.tag)
      return b2 = xh(c2, a2.mode, d2), b2.return = a2, b2;
    b2 = e(b2, c2);
    b2.return = a2;
    return b2;
  }
  function k2(a2, b2, c2, d2) {
    var f3 = c2.type;
    if (f3 === ya)
      return m2(a2, b2, c2.props.children, d2, c2.key);
    if (null !== b2 && (b2.elementType === f3 || "object" === typeof f3 && null !== f3 && f3.$$typeof === Ha && uh(f3) === b2.type))
      return d2 = e(b2, c2.props), d2.ref = sh(a2, b2, c2), d2.return = a2, d2;
    d2 = yh(c2.type, c2.key, c2.props, null, a2.mode, d2);
    d2.ref = sh(a2, b2, c2);
    d2.return = a2;
    return d2;
  }
  function l2(a2, b2, c2, d2) {
    if (null === b2 || 4 !== b2.tag || b2.stateNode.containerInfo !== c2.containerInfo || b2.stateNode.implementation !== c2.implementation)
      return b2 = zh(c2, a2.mode, d2), b2.return = a2, b2;
    b2 = e(b2, c2.children || []);
    b2.return = a2;
    return b2;
  }
  function m2(a2, b2, c2, d2, f3) {
    if (null === b2 || 7 !== b2.tag)
      return b2 = Ah(c2, a2.mode, d2, f3), b2.return = a2, b2;
    b2 = e(b2, c2);
    b2.return = a2;
    return b2;
  }
  function q2(a2, b2, c2) {
    if ("string" === typeof b2 && "" !== b2 || "number" === typeof b2)
      return b2 = xh("" + b2, a2.mode, c2), b2.return = a2, b2;
    if ("object" === typeof b2 && null !== b2) {
      switch (b2.$$typeof) {
        case va:
          return c2 = yh(b2.type, b2.key, b2.props, null, a2.mode, c2), c2.ref = sh(a2, null, b2), c2.return = a2, c2;
        case wa:
          return b2 = zh(b2, a2.mode, c2), b2.return = a2, b2;
        case Ha:
          var d2 = b2._init;
          return q2(a2, d2(b2._payload), c2);
      }
      if (eb(b2) || Ka(b2))
        return b2 = Ah(b2, a2.mode, c2, null), b2.return = a2, b2;
      th(a2, b2);
    }
    return null;
  }
  function r2(a2, b2, c2, d2) {
    var e2 = null !== b2 ? b2.key : null;
    if ("string" === typeof c2 && "" !== c2 || "number" === typeof c2)
      return null !== e2 ? null : h(a2, b2, "" + c2, d2);
    if ("object" === typeof c2 && null !== c2) {
      switch (c2.$$typeof) {
        case va:
          return c2.key === e2 ? k2(a2, b2, c2, d2) : null;
        case wa:
          return c2.key === e2 ? l2(a2, b2, c2, d2) : null;
        case Ha:
          return e2 = c2._init, r2(
            a2,
            b2,
            e2(c2._payload),
            d2
          );
      }
      if (eb(c2) || Ka(c2))
        return null !== e2 ? null : m2(a2, b2, c2, d2, null);
      th(a2, c2);
    }
    return null;
  }
  function y2(a2, b2, c2, d2, e2) {
    if ("string" === typeof d2 && "" !== d2 || "number" === typeof d2)
      return a2 = a2.get(c2) || null, h(b2, a2, "" + d2, e2);
    if ("object" === typeof d2 && null !== d2) {
      switch (d2.$$typeof) {
        case va:
          return a2 = a2.get(null === d2.key ? c2 : d2.key) || null, k2(b2, a2, d2, e2);
        case wa:
          return a2 = a2.get(null === d2.key ? c2 : d2.key) || null, l2(b2, a2, d2, e2);
        case Ha:
          var f3 = d2._init;
          return y2(a2, b2, c2, f3(d2._payload), e2);
      }
      if (eb(d2) || Ka(d2))
        return a2 = a2.get(c2) || null, m2(b2, a2, d2, e2, null);
      th(b2, d2);
    }
    return null;
  }
  function n2(e2, g2, h2, k3) {
    for (var l3 = null, m3 = null, u2 = g2, w2 = g2 = 0, x2 = null; null !== u2 && w2 < h2.length; w2++) {
      u2.index > w2 ? (x2 = u2, u2 = null) : x2 = u2.sibling;
      var n3 = r2(e2, u2, h2[w2], k3);
      if (null === n3) {
        null === u2 && (u2 = x2);
        break;
      }
      a && u2 && null === n3.alternate && b(e2, u2);
      g2 = f2(n3, g2, w2);
      null === m3 ? l3 = n3 : m3.sibling = n3;
      m3 = n3;
      u2 = x2;
    }
    if (w2 === h2.length)
      return c(e2, u2), I$1 && tg(e2, w2), l3;
    if (null === u2) {
      for (; w2 < h2.length; w2++)
        u2 = q2(e2, h2[w2], k3), null !== u2 && (g2 = f2(u2, g2, w2), null === m3 ? l3 = u2 : m3.sibling = u2, m3 = u2);
      I$1 && tg(e2, w2);
      return l3;
    }
    for (u2 = d(e2, u2); w2 < h2.length; w2++)
      x2 = y2(u2, e2, w2, h2[w2], k3), null !== x2 && (a && null !== x2.alternate && u2.delete(null === x2.key ? w2 : x2.key), g2 = f2(x2, g2, w2), null === m3 ? l3 = x2 : m3.sibling = x2, m3 = x2);
    a && u2.forEach(function(a2) {
      return b(e2, a2);
    });
    I$1 && tg(e2, w2);
    return l3;
  }
  function t2(e2, g2, h2, k3) {
    var l3 = Ka(h2);
    if ("function" !== typeof l3)
      throw Error(p(150));
    h2 = l3.call(h2);
    if (null == h2)
      throw Error(p(151));
    for (var u2 = l3 = null, m3 = g2, w2 = g2 = 0, x2 = null, n3 = h2.next(); null !== m3 && !n3.done; w2++, n3 = h2.next()) {
      m3.index > w2 ? (x2 = m3, m3 = null) : x2 = m3.sibling;
      var t3 = r2(e2, m3, n3.value, k3);
      if (null === t3) {
        null === m3 && (m3 = x2);
        break;
      }
      a && m3 && null === t3.alternate && b(e2, m3);
      g2 = f2(t3, g2, w2);
      null === u2 ? l3 = t3 : u2.sibling = t3;
      u2 = t3;
      m3 = x2;
    }
    if (n3.done)
      return c(
        e2,
        m3
      ), I$1 && tg(e2, w2), l3;
    if (null === m3) {
      for (; !n3.done; w2++, n3 = h2.next())
        n3 = q2(e2, n3.value, k3), null !== n3 && (g2 = f2(n3, g2, w2), null === u2 ? l3 = n3 : u2.sibling = n3, u2 = n3);
      I$1 && tg(e2, w2);
      return l3;
    }
    for (m3 = d(e2, m3); !n3.done; w2++, n3 = h2.next())
      n3 = y2(m3, e2, w2, n3.value, k3), null !== n3 && (a && null !== n3.alternate && m3.delete(null === n3.key ? w2 : n3.key), g2 = f2(n3, g2, w2), null === u2 ? l3 = n3 : u2.sibling = n3, u2 = n3);
    a && m3.forEach(function(a2) {
      return b(e2, a2);
    });
    I$1 && tg(e2, w2);
    return l3;
  }
  function J2(a2, d2, f3, h2) {
    "object" === typeof f3 && null !== f3 && f3.type === ya && null === f3.key && (f3 = f3.props.children);
    if ("object" === typeof f3 && null !== f3) {
      switch (f3.$$typeof) {
        case va:
          a: {
            for (var k3 = f3.key, l3 = d2; null !== l3; ) {
              if (l3.key === k3) {
                k3 = f3.type;
                if (k3 === ya) {
                  if (7 === l3.tag) {
                    c(a2, l3.sibling);
                    d2 = e(l3, f3.props.children);
                    d2.return = a2;
                    a2 = d2;
                    break a;
                  }
                } else if (l3.elementType === k3 || "object" === typeof k3 && null !== k3 && k3.$$typeof === Ha && uh(k3) === l3.type) {
                  c(a2, l3.sibling);
                  d2 = e(l3, f3.props);
                  d2.ref = sh(a2, l3, f3);
                  d2.return = a2;
                  a2 = d2;
                  break a;
                }
                c(a2, l3);
                break;
              } else
                b(a2, l3);
              l3 = l3.sibling;
            }
            f3.type === ya ? (d2 = Ah(f3.props.children, a2.mode, h2, f3.key), d2.return = a2, a2 = d2) : (h2 = yh(f3.type, f3.key, f3.props, null, a2.mode, h2), h2.ref = sh(a2, d2, f3), h2.return = a2, a2 = h2);
          }
          return g(a2);
        case wa:
          a: {
            for (l3 = f3.key; null !== d2; ) {
              if (d2.key === l3)
                if (4 === d2.tag && d2.stateNode.containerInfo === f3.containerInfo && d2.stateNode.implementation === f3.implementation) {
                  c(a2, d2.sibling);
                  d2 = e(d2, f3.children || []);
                  d2.return = a2;
                  a2 = d2;
                  break a;
                } else {
                  c(a2, d2);
                  break;
                }
              else
                b(a2, d2);
              d2 = d2.sibling;
            }
            d2 = zh(f3, a2.mode, h2);
            d2.return = a2;
            a2 = d2;
          }
          return g(a2);
        case Ha:
          return l3 = f3._init, J2(a2, d2, l3(f3._payload), h2);
      }
      if (eb(f3))
        return n2(a2, d2, f3, h2);
      if (Ka(f3))
        return t2(a2, d2, f3, h2);
      th(a2, f3);
    }
    return "string" === typeof f3 && "" !== f3 || "number" === typeof f3 ? (f3 = "" + f3, null !== d2 && 6 === d2.tag ? (c(a2, d2.sibling), d2 = e(d2, f3), d2.return = a2, a2 = d2) : (c(a2, d2), d2 = xh(f3, a2.mode, h2), d2.return = a2, a2 = d2), g(a2)) : c(a2, d2);
  }
  return J2;
}
var Bh = vh(true), Ch = vh(false), Dh = {}, Eh = Uf(Dh), Fh = Uf(Dh), Gh = Uf(Dh);
function Hh(a) {
  if (a === Dh)
    throw Error(p(174));
  return a;
}
function Ih(a, b) {
  G$1(Gh, b);
  G$1(Fh, a);
  G$1(Eh, Dh);
  a = b.nodeType;
  switch (a) {
    case 9:
    case 11:
      b = (b = b.documentElement) ? b.namespaceURI : lb(null, "");
      break;
    default:
      a = 8 === a ? b.parentNode : b, b = a.namespaceURI || null, a = a.tagName, b = lb(b, a);
  }
  E$1(Eh);
  G$1(Eh, b);
}
function Jh() {
  E$1(Eh);
  E$1(Fh);
  E$1(Gh);
}
function Kh(a) {
  Hh(Gh.current);
  var b = Hh(Eh.current);
  var c = lb(b, a.type);
  b !== c && (G$1(Fh, a), G$1(Eh, c));
}
function Lh(a) {
  Fh.current === a && (E$1(Eh), E$1(Fh));
}
var M$1 = Uf(0);
function Mh(a) {
  for (var b = a; null !== b; ) {
    if (13 === b.tag) {
      var c = b.memoizedState;
      if (null !== c && (c = c.dehydrated, null === c || "$?" === c.data || "$!" === c.data))
        return b;
    } else if (19 === b.tag && void 0 !== b.memoizedProps.revealOrder) {
      if (0 !== (b.flags & 128))
        return b;
    } else if (null !== b.child) {
      b.child.return = b;
      b = b.child;
      continue;
    }
    if (b === a)
      break;
    for (; null === b.sibling; ) {
      if (null === b.return || b.return === a)
        return null;
      b = b.return;
    }
    b.sibling.return = b.return;
    b = b.sibling;
  }
  return null;
}
var Nh = [];
function Oh() {
  for (var a = 0; a < Nh.length; a++)
    Nh[a]._workInProgressVersionPrimary = null;
  Nh.length = 0;
}
var Ph = ua.ReactCurrentDispatcher, Qh = ua.ReactCurrentBatchConfig, Rh = 0, N$1 = null, O$1 = null, P$1 = null, Sh = false, Th = false, Uh = 0, Vh = 0;
function Q$1() {
  throw Error(p(321));
}
function Wh(a, b) {
  if (null === b)
    return false;
  for (var c = 0; c < b.length && c < a.length; c++)
    if (!He$1(a[c], b[c]))
      return false;
  return true;
}
function Xh(a, b, c, d, e, f2) {
  Rh = f2;
  N$1 = b;
  b.memoizedState = null;
  b.updateQueue = null;
  b.lanes = 0;
  Ph.current = null === a || null === a.memoizedState ? Yh : Zh;
  a = c(d, e);
  if (Th) {
    f2 = 0;
    do {
      Th = false;
      Uh = 0;
      if (25 <= f2)
        throw Error(p(301));
      f2 += 1;
      P$1 = O$1 = null;
      b.updateQueue = null;
      Ph.current = $h;
      a = c(d, e);
    } while (Th);
  }
  Ph.current = ai;
  b = null !== O$1 && null !== O$1.next;
  Rh = 0;
  P$1 = O$1 = N$1 = null;
  Sh = false;
  if (b)
    throw Error(p(300));
  return a;
}
function bi() {
  var a = 0 !== Uh;
  Uh = 0;
  return a;
}
function ci() {
  var a = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
  null === P$1 ? N$1.memoizedState = P$1 = a : P$1 = P$1.next = a;
  return P$1;
}
function di() {
  if (null === O$1) {
    var a = N$1.alternate;
    a = null !== a ? a.memoizedState : null;
  } else
    a = O$1.next;
  var b = null === P$1 ? N$1.memoizedState : P$1.next;
  if (null !== b)
    P$1 = b, O$1 = a;
  else {
    if (null === a)
      throw Error(p(310));
    O$1 = a;
    a = { memoizedState: O$1.memoizedState, baseState: O$1.baseState, baseQueue: O$1.baseQueue, queue: O$1.queue, next: null };
    null === P$1 ? N$1.memoizedState = P$1 = a : P$1 = P$1.next = a;
  }
  return P$1;
}
function ei(a, b) {
  return "function" === typeof b ? b(a) : b;
}
function fi(a) {
  var b = di(), c = b.queue;
  if (null === c)
    throw Error(p(311));
  c.lastRenderedReducer = a;
  var d = O$1, e = d.baseQueue, f2 = c.pending;
  if (null !== f2) {
    if (null !== e) {
      var g = e.next;
      e.next = f2.next;
      f2.next = g;
    }
    d.baseQueue = e = f2;
    c.pending = null;
  }
  if (null !== e) {
    f2 = e.next;
    d = d.baseState;
    var h = g = null, k2 = null, l2 = f2;
    do {
      var m2 = l2.lane;
      if ((Rh & m2) === m2)
        null !== k2 && (k2 = k2.next = { lane: 0, action: l2.action, hasEagerState: l2.hasEagerState, eagerState: l2.eagerState, next: null }), d = l2.hasEagerState ? l2.eagerState : a(d, l2.action);
      else {
        var q2 = {
          lane: m2,
          action: l2.action,
          hasEagerState: l2.hasEagerState,
          eagerState: l2.eagerState,
          next: null
        };
        null === k2 ? (h = k2 = q2, g = d) : k2 = k2.next = q2;
        N$1.lanes |= m2;
        hh |= m2;
      }
      l2 = l2.next;
    } while (null !== l2 && l2 !== f2);
    null === k2 ? g = d : k2.next = h;
    He$1(d, b.memoizedState) || (Ug = true);
    b.memoizedState = d;
    b.baseState = g;
    b.baseQueue = k2;
    c.lastRenderedState = d;
  }
  a = c.interleaved;
  if (null !== a) {
    e = a;
    do
      f2 = e.lane, N$1.lanes |= f2, hh |= f2, e = e.next;
    while (e !== a);
  } else
    null === e && (c.lanes = 0);
  return [b.memoizedState, c.dispatch];
}
function gi(a) {
  var b = di(), c = b.queue;
  if (null === c)
    throw Error(p(311));
  c.lastRenderedReducer = a;
  var d = c.dispatch, e = c.pending, f2 = b.memoizedState;
  if (null !== e) {
    c.pending = null;
    var g = e = e.next;
    do
      f2 = a(f2, g.action), g = g.next;
    while (g !== e);
    He$1(f2, b.memoizedState) || (Ug = true);
    b.memoizedState = f2;
    null === b.baseQueue && (b.baseState = f2);
    c.lastRenderedState = f2;
  }
  return [f2, d];
}
function hi() {
}
function ii(a, b) {
  var c = N$1, d = di(), e = b(), f2 = !He$1(d.memoizedState, e);
  f2 && (d.memoizedState = e, Ug = true);
  d = d.queue;
  ji(ki.bind(null, c, d, a), [a]);
  if (d.getSnapshot !== b || f2 || null !== P$1 && P$1.memoizedState.tag & 1) {
    c.flags |= 2048;
    li(9, mi.bind(null, c, d, e, b), void 0, null);
    if (null === R$2)
      throw Error(p(349));
    0 !== (Rh & 30) || ni(c, b, e);
  }
  return e;
}
function ni(a, b, c) {
  a.flags |= 16384;
  a = { getSnapshot: b, value: c };
  b = N$1.updateQueue;
  null === b ? (b = { lastEffect: null, stores: null }, N$1.updateQueue = b, b.stores = [a]) : (c = b.stores, null === c ? b.stores = [a] : c.push(a));
}
function mi(a, b, c, d) {
  b.value = c;
  b.getSnapshot = d;
  oi(b) && pi(a);
}
function ki(a, b, c) {
  return c(function() {
    oi(b) && pi(a);
  });
}
function oi(a) {
  var b = a.getSnapshot;
  a = a.value;
  try {
    var c = b();
    return !He$1(a, c);
  } catch (d) {
    return true;
  }
}
function pi(a) {
  var b = Zg(a, 1);
  null !== b && mh(b, a, 1, -1);
}
function qi(a) {
  var b = ci();
  "function" === typeof a && (a = a());
  b.memoizedState = b.baseState = a;
  a = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: ei, lastRenderedState: a };
  b.queue = a;
  a = a.dispatch = ri.bind(null, N$1, a);
  return [b.memoizedState, a];
}
function li(a, b, c, d) {
  a = { tag: a, create: b, destroy: c, deps: d, next: null };
  b = N$1.updateQueue;
  null === b ? (b = { lastEffect: null, stores: null }, N$1.updateQueue = b, b.lastEffect = a.next = a) : (c = b.lastEffect, null === c ? b.lastEffect = a.next = a : (d = c.next, c.next = a, a.next = d, b.lastEffect = a));
  return a;
}
function si() {
  return di().memoizedState;
}
function ti(a, b, c, d) {
  var e = ci();
  N$1.flags |= a;
  e.memoizedState = li(1 | b, c, void 0, void 0 === d ? null : d);
}
function ui(a, b, c, d) {
  var e = di();
  d = void 0 === d ? null : d;
  var f2 = void 0;
  if (null !== O$1) {
    var g = O$1.memoizedState;
    f2 = g.destroy;
    if (null !== d && Wh(d, g.deps)) {
      e.memoizedState = li(b, c, f2, d);
      return;
    }
  }
  N$1.flags |= a;
  e.memoizedState = li(1 | b, c, f2, d);
}
function vi(a, b) {
  return ti(8390656, 8, a, b);
}
function ji(a, b) {
  return ui(2048, 8, a, b);
}
function wi(a, b) {
  return ui(4, 2, a, b);
}
function xi(a, b) {
  return ui(4, 4, a, b);
}
function yi(a, b) {
  if ("function" === typeof b)
    return a = a(), b(a), function() {
      b(null);
    };
  if (null !== b && void 0 !== b)
    return a = a(), b.current = a, function() {
      b.current = null;
    };
}
function zi(a, b, c) {
  c = null !== c && void 0 !== c ? c.concat([a]) : null;
  return ui(4, 4, yi.bind(null, b, a), c);
}
function Ai() {
}
function Bi(a, b) {
  var c = di();
  b = void 0 === b ? null : b;
  var d = c.memoizedState;
  if (null !== d && null !== b && Wh(b, d[1]))
    return d[0];
  c.memoizedState = [a, b];
  return a;
}
function Ci(a, b) {
  var c = di();
  b = void 0 === b ? null : b;
  var d = c.memoizedState;
  if (null !== d && null !== b && Wh(b, d[1]))
    return d[0];
  a = a();
  c.memoizedState = [a, b];
  return a;
}
function Di(a, b, c) {
  if (0 === (Rh & 21))
    return a.baseState && (a.baseState = false, Ug = true), a.memoizedState = c;
  He$1(c, b) || (c = yc(), N$1.lanes |= c, hh |= c, a.baseState = true);
  return b;
}
function Ei(a, b) {
  var c = C$1;
  C$1 = 0 !== c && 4 > c ? c : 4;
  a(true);
  var d = Qh.transition;
  Qh.transition = {};
  try {
    a(false), b();
  } finally {
    C$1 = c, Qh.transition = d;
  }
}
function Fi() {
  return di().memoizedState;
}
function Gi(a, b, c) {
  var d = lh(a);
  c = { lane: d, action: c, hasEagerState: false, eagerState: null, next: null };
  if (Hi(a))
    Ii(b, c);
  else if (c = Yg(a, b, c, d), null !== c) {
    var e = L$1();
    mh(c, a, d, e);
    Ji(c, b, d);
  }
}
function ri(a, b, c) {
  var d = lh(a), e = { lane: d, action: c, hasEagerState: false, eagerState: null, next: null };
  if (Hi(a))
    Ii(b, e);
  else {
    var f2 = a.alternate;
    if (0 === a.lanes && (null === f2 || 0 === f2.lanes) && (f2 = b.lastRenderedReducer, null !== f2))
      try {
        var g = b.lastRenderedState, h = f2(g, c);
        e.hasEagerState = true;
        e.eagerState = h;
        if (He$1(h, g)) {
          var k2 = b.interleaved;
          null === k2 ? (e.next = e, Xg(b)) : (e.next = k2.next, k2.next = e);
          b.interleaved = e;
          return;
        }
      } catch (l2) {
      } finally {
      }
    c = Yg(a, b, e, d);
    null !== c && (e = L$1(), mh(c, a, d, e), Ji(c, b, d));
  }
}
function Hi(a) {
  var b = a.alternate;
  return a === N$1 || null !== b && b === N$1;
}
function Ii(a, b) {
  Th = Sh = true;
  var c = a.pending;
  null === c ? b.next = b : (b.next = c.next, c.next = b);
  a.pending = b;
}
function Ji(a, b, c) {
  if (0 !== (c & 4194240)) {
    var d = b.lanes;
    d &= a.pendingLanes;
    c |= d;
    b.lanes = c;
    Cc(a, c);
  }
}
var ai = { readContext: Vg, useCallback: Q$1, useContext: Q$1, useEffect: Q$1, useImperativeHandle: Q$1, useInsertionEffect: Q$1, useLayoutEffect: Q$1, useMemo: Q$1, useReducer: Q$1, useRef: Q$1, useState: Q$1, useDebugValue: Q$1, useDeferredValue: Q$1, useTransition: Q$1, useMutableSource: Q$1, useSyncExternalStore: Q$1, useId: Q$1, unstable_isNewReconciler: false }, Yh = { readContext: Vg, useCallback: function(a, b) {
  ci().memoizedState = [a, void 0 === b ? null : b];
  return a;
}, useContext: Vg, useEffect: vi, useImperativeHandle: function(a, b, c) {
  c = null !== c && void 0 !== c ? c.concat([a]) : null;
  return ti(
    4194308,
    4,
    yi.bind(null, b, a),
    c
  );
}, useLayoutEffect: function(a, b) {
  return ti(4194308, 4, a, b);
}, useInsertionEffect: function(a, b) {
  return ti(4, 2, a, b);
}, useMemo: function(a, b) {
  var c = ci();
  b = void 0 === b ? null : b;
  a = a();
  c.memoizedState = [a, b];
  return a;
}, useReducer: function(a, b, c) {
  var d = ci();
  b = void 0 !== c ? c(b) : b;
  d.memoizedState = d.baseState = b;
  a = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: a, lastRenderedState: b };
  d.queue = a;
  a = a.dispatch = Gi.bind(null, N$1, a);
  return [d.memoizedState, a];
}, useRef: function(a) {
  var b = ci();
  a = { current: a };
  return b.memoizedState = a;
}, useState: qi, useDebugValue: Ai, useDeferredValue: function(a) {
  return ci().memoizedState = a;
}, useTransition: function() {
  var a = qi(false), b = a[0];
  a = Ei.bind(null, a[1]);
  ci().memoizedState = a;
  return [b, a];
}, useMutableSource: function() {
}, useSyncExternalStore: function(a, b, c) {
  var d = N$1, e = ci();
  if (I$1) {
    if (void 0 === c)
      throw Error(p(407));
    c = c();
  } else {
    c = b();
    if (null === R$2)
      throw Error(p(349));
    0 !== (Rh & 30) || ni(d, b, c);
  }
  e.memoizedState = c;
  var f2 = { value: c, getSnapshot: b };
  e.queue = f2;
  vi(ki.bind(
    null,
    d,
    f2,
    a
  ), [a]);
  d.flags |= 2048;
  li(9, mi.bind(null, d, f2, c, b), void 0, null);
  return c;
}, useId: function() {
  var a = ci(), b = R$2.identifierPrefix;
  if (I$1) {
    var c = sg;
    var d = rg;
    c = (d & ~(1 << 32 - oc(d) - 1)).toString(32) + c;
    b = ":" + b + "R" + c;
    c = Uh++;
    0 < c && (b += "H" + c.toString(32));
    b += ":";
  } else
    c = Vh++, b = ":" + b + "r" + c.toString(32) + ":";
  return a.memoizedState = b;
}, unstable_isNewReconciler: false }, Zh = {
  readContext: Vg,
  useCallback: Bi,
  useContext: Vg,
  useEffect: ji,
  useImperativeHandle: zi,
  useInsertionEffect: wi,
  useLayoutEffect: xi,
  useMemo: Ci,
  useReducer: fi,
  useRef: si,
  useState: function() {
    return fi(ei);
  },
  useDebugValue: Ai,
  useDeferredValue: function(a) {
    var b = di();
    return Di(b, O$1.memoizedState, a);
  },
  useTransition: function() {
    var a = fi(ei)[0], b = di().memoizedState;
    return [a, b];
  },
  useMutableSource: hi,
  useSyncExternalStore: ii,
  useId: Fi,
  unstable_isNewReconciler: false
}, $h = { readContext: Vg, useCallback: Bi, useContext: Vg, useEffect: ji, useImperativeHandle: zi, useInsertionEffect: wi, useLayoutEffect: xi, useMemo: Ci, useReducer: gi, useRef: si, useState: function() {
  return gi(ei);
}, useDebugValue: Ai, useDeferredValue: function(a) {
  var b = di();
  return null === O$1 ? b.memoizedState = a : Di(b, O$1.memoizedState, a);
}, useTransition: function() {
  var a = gi(ei)[0], b = di().memoizedState;
  return [a, b];
}, useMutableSource: hi, useSyncExternalStore: ii, useId: Fi, unstable_isNewReconciler: false };
function Ki(a, b) {
  try {
    var c = "", d = b;
    do
      c += Pa(d), d = d.return;
    while (d);
    var e = c;
  } catch (f2) {
    e = "\nError generating stack: " + f2.message + "\n" + f2.stack;
  }
  return { value: a, source: b, stack: e, digest: null };
}
function Li(a, b, c) {
  return { value: a, source: null, stack: null != c ? c : null, digest: null != b ? b : null };
}
function Mi(a, b) {
  try {
    console.error(b.value);
  } catch (c) {
    setTimeout(function() {
      throw c;
    });
  }
}
var Ni = "function" === typeof WeakMap ? WeakMap : Map;
function Oi(a, b, c) {
  c = ch(-1, c);
  c.tag = 3;
  c.payload = { element: null };
  var d = b.value;
  c.callback = function() {
    Pi || (Pi = true, Qi = d);
    Mi(a, b);
  };
  return c;
}
function Ri(a, b, c) {
  c = ch(-1, c);
  c.tag = 3;
  var d = a.type.getDerivedStateFromError;
  if ("function" === typeof d) {
    var e = b.value;
    c.payload = function() {
      return d(e);
    };
    c.callback = function() {
      Mi(a, b);
    };
  }
  var f2 = a.stateNode;
  null !== f2 && "function" === typeof f2.componentDidCatch && (c.callback = function() {
    Mi(a, b);
    "function" !== typeof d && (null === Si ? Si = /* @__PURE__ */ new Set([this]) : Si.add(this));
    var c2 = b.stack;
    this.componentDidCatch(b.value, { componentStack: null !== c2 ? c2 : "" });
  });
  return c;
}
function Ti(a, b, c) {
  var d = a.pingCache;
  if (null === d) {
    d = a.pingCache = new Ni();
    var e = /* @__PURE__ */ new Set();
    d.set(b, e);
  } else
    e = d.get(b), void 0 === e && (e = /* @__PURE__ */ new Set(), d.set(b, e));
  e.has(c) || (e.add(c), a = Ui.bind(null, a, b, c), b.then(a, a));
}
function Vi(a) {
  do {
    var b;
    if (b = 13 === a.tag)
      b = a.memoizedState, b = null !== b ? null !== b.dehydrated ? true : false : true;
    if (b)
      return a;
    a = a.return;
  } while (null !== a);
  return null;
}
function Wi(a, b, c, d, e) {
  if (0 === (a.mode & 1))
    return a === b ? a.flags |= 65536 : (a.flags |= 128, c.flags |= 131072, c.flags &= -52805, 1 === c.tag && (null === c.alternate ? c.tag = 17 : (b = ch(-1, 1), b.tag = 2, dh(c, b, 1))), c.lanes |= 1), a;
  a.flags |= 65536;
  a.lanes = e;
  return a;
}
var Xi = ua.ReactCurrentOwner, Ug = false;
function Yi(a, b, c, d) {
  b.child = null === a ? Ch(b, null, c, d) : Bh(b, a.child, c, d);
}
function Zi(a, b, c, d, e) {
  c = c.render;
  var f2 = b.ref;
  Tg(b, e);
  d = Xh(a, b, c, d, f2, e);
  c = bi();
  if (null !== a && !Ug)
    return b.updateQueue = a.updateQueue, b.flags &= -2053, a.lanes &= ~e, $i(a, b, e);
  I$1 && c && vg(b);
  b.flags |= 1;
  Yi(a, b, d, e);
  return b.child;
}
function aj(a, b, c, d, e) {
  if (null === a) {
    var f2 = c.type;
    if ("function" === typeof f2 && !bj(f2) && void 0 === f2.defaultProps && null === c.compare && void 0 === c.defaultProps)
      return b.tag = 15, b.type = f2, cj(a, b, f2, d, e);
    a = yh(c.type, null, d, b, b.mode, e);
    a.ref = b.ref;
    a.return = b;
    return b.child = a;
  }
  f2 = a.child;
  if (0 === (a.lanes & e)) {
    var g = f2.memoizedProps;
    c = c.compare;
    c = null !== c ? c : Ie$1;
    if (c(g, d) && a.ref === b.ref)
      return $i(a, b, e);
  }
  b.flags |= 1;
  a = wh(f2, d);
  a.ref = b.ref;
  a.return = b;
  return b.child = a;
}
function cj(a, b, c, d, e) {
  if (null !== a) {
    var f2 = a.memoizedProps;
    if (Ie$1(f2, d) && a.ref === b.ref)
      if (Ug = false, b.pendingProps = d = f2, 0 !== (a.lanes & e))
        0 !== (a.flags & 131072) && (Ug = true);
      else
        return b.lanes = a.lanes, $i(a, b, e);
  }
  return dj(a, b, c, d, e);
}
function ej(a, b, c) {
  var d = b.pendingProps, e = d.children, f2 = null !== a ? a.memoizedState : null;
  if ("hidden" === d.mode)
    if (0 === (b.mode & 1))
      b.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, G$1(fj, gj), gj |= c;
    else {
      if (0 === (c & 1073741824))
        return a = null !== f2 ? f2.baseLanes | c : c, b.lanes = b.childLanes = 1073741824, b.memoizedState = { baseLanes: a, cachePool: null, transitions: null }, b.updateQueue = null, G$1(fj, gj), gj |= a, null;
      b.memoizedState = { baseLanes: 0, cachePool: null, transitions: null };
      d = null !== f2 ? f2.baseLanes : c;
      G$1(fj, gj);
      gj |= d;
    }
  else
    null !== f2 ? (d = f2.baseLanes | c, b.memoizedState = null) : d = c, G$1(fj, gj), gj |= d;
  Yi(a, b, e, c);
  return b.child;
}
function hj(a, b) {
  var c = b.ref;
  if (null === a && null !== c || null !== a && a.ref !== c)
    b.flags |= 512, b.flags |= 2097152;
}
function dj(a, b, c, d, e) {
  var f2 = Zf(c) ? Xf : H$1.current;
  f2 = Yf(b, f2);
  Tg(b, e);
  c = Xh(a, b, c, d, f2, e);
  d = bi();
  if (null !== a && !Ug)
    return b.updateQueue = a.updateQueue, b.flags &= -2053, a.lanes &= ~e, $i(a, b, e);
  I$1 && d && vg(b);
  b.flags |= 1;
  Yi(a, b, c, e);
  return b.child;
}
function ij(a, b, c, d, e) {
  if (Zf(c)) {
    var f2 = true;
    cg(b);
  } else
    f2 = false;
  Tg(b, e);
  if (null === b.stateNode)
    jj(a, b), ph(b, c, d), rh(b, c, d, e), d = true;
  else if (null === a) {
    var g = b.stateNode, h = b.memoizedProps;
    g.props = h;
    var k2 = g.context, l2 = c.contextType;
    "object" === typeof l2 && null !== l2 ? l2 = Vg(l2) : (l2 = Zf(c) ? Xf : H$1.current, l2 = Yf(b, l2));
    var m2 = c.getDerivedStateFromProps, q2 = "function" === typeof m2 || "function" === typeof g.getSnapshotBeforeUpdate;
    q2 || "function" !== typeof g.UNSAFE_componentWillReceiveProps && "function" !== typeof g.componentWillReceiveProps || (h !== d || k2 !== l2) && qh(b, g, d, l2);
    $g = false;
    var r2 = b.memoizedState;
    g.state = r2;
    gh(b, d, g, e);
    k2 = b.memoizedState;
    h !== d || r2 !== k2 || Wf.current || $g ? ("function" === typeof m2 && (kh(b, c, m2, d), k2 = b.memoizedState), (h = $g || oh(b, c, h, d, r2, k2, l2)) ? (q2 || "function" !== typeof g.UNSAFE_componentWillMount && "function" !== typeof g.componentWillMount || ("function" === typeof g.componentWillMount && g.componentWillMount(), "function" === typeof g.UNSAFE_componentWillMount && g.UNSAFE_componentWillMount()), "function" === typeof g.componentDidMount && (b.flags |= 4194308)) : ("function" === typeof g.componentDidMount && (b.flags |= 4194308), b.memoizedProps = d, b.memoizedState = k2), g.props = d, g.state = k2, g.context = l2, d = h) : ("function" === typeof g.componentDidMount && (b.flags |= 4194308), d = false);
  } else {
    g = b.stateNode;
    bh(a, b);
    h = b.memoizedProps;
    l2 = b.type === b.elementType ? h : Lg(b.type, h);
    g.props = l2;
    q2 = b.pendingProps;
    r2 = g.context;
    k2 = c.contextType;
    "object" === typeof k2 && null !== k2 ? k2 = Vg(k2) : (k2 = Zf(c) ? Xf : H$1.current, k2 = Yf(b, k2));
    var y2 = c.getDerivedStateFromProps;
    (m2 = "function" === typeof y2 || "function" === typeof g.getSnapshotBeforeUpdate) || "function" !== typeof g.UNSAFE_componentWillReceiveProps && "function" !== typeof g.componentWillReceiveProps || (h !== q2 || r2 !== k2) && qh(b, g, d, k2);
    $g = false;
    r2 = b.memoizedState;
    g.state = r2;
    gh(b, d, g, e);
    var n2 = b.memoizedState;
    h !== q2 || r2 !== n2 || Wf.current || $g ? ("function" === typeof y2 && (kh(b, c, y2, d), n2 = b.memoizedState), (l2 = $g || oh(b, c, l2, d, r2, n2, k2) || false) ? (m2 || "function" !== typeof g.UNSAFE_componentWillUpdate && "function" !== typeof g.componentWillUpdate || ("function" === typeof g.componentWillUpdate && g.componentWillUpdate(d, n2, k2), "function" === typeof g.UNSAFE_componentWillUpdate && g.UNSAFE_componentWillUpdate(d, n2, k2)), "function" === typeof g.componentDidUpdate && (b.flags |= 4), "function" === typeof g.getSnapshotBeforeUpdate && (b.flags |= 1024)) : ("function" !== typeof g.componentDidUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 4), "function" !== typeof g.getSnapshotBeforeUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 1024), b.memoizedProps = d, b.memoizedState = n2), g.props = d, g.state = n2, g.context = k2, d = l2) : ("function" !== typeof g.componentDidUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 4), "function" !== typeof g.getSnapshotBeforeUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 1024), d = false);
  }
  return kj(a, b, c, d, f2, e);
}
function kj(a, b, c, d, e, f2) {
  hj(a, b);
  var g = 0 !== (b.flags & 128);
  if (!d && !g)
    return e && dg(b, c, false), $i(a, b, f2);
  d = b.stateNode;
  Xi.current = b;
  var h = g && "function" !== typeof c.getDerivedStateFromError ? null : d.render();
  b.flags |= 1;
  null !== a && g ? (b.child = Bh(b, a.child, null, f2), b.child = Bh(b, null, h, f2)) : Yi(a, b, h, f2);
  b.memoizedState = d.state;
  e && dg(b, c, true);
  return b.child;
}
function lj(a) {
  var b = a.stateNode;
  b.pendingContext ? ag(a, b.pendingContext, b.pendingContext !== b.context) : b.context && ag(a, b.context, false);
  Ih(a, b.containerInfo);
}
function mj(a, b, c, d, e) {
  Ig();
  Jg(e);
  b.flags |= 256;
  Yi(a, b, c, d);
  return b.child;
}
var nj = { dehydrated: null, treeContext: null, retryLane: 0 };
function oj(a) {
  return { baseLanes: a, cachePool: null, transitions: null };
}
function pj(a, b, c) {
  var d = b.pendingProps, e = M$1.current, f2 = false, g = 0 !== (b.flags & 128), h;
  (h = g) || (h = null !== a && null === a.memoizedState ? false : 0 !== (e & 2));
  if (h)
    f2 = true, b.flags &= -129;
  else if (null === a || null !== a.memoizedState)
    e |= 1;
  G$1(M$1, e & 1);
  if (null === a) {
    Eg(b);
    a = b.memoizedState;
    if (null !== a && (a = a.dehydrated, null !== a))
      return 0 === (b.mode & 1) ? b.lanes = 1 : "$!" === a.data ? b.lanes = 8 : b.lanes = 1073741824, null;
    g = d.children;
    a = d.fallback;
    return f2 ? (d = b.mode, f2 = b.child, g = { mode: "hidden", children: g }, 0 === (d & 1) && null !== f2 ? (f2.childLanes = 0, f2.pendingProps = g) : f2 = qj(g, d, 0, null), a = Ah(a, d, c, null), f2.return = b, a.return = b, f2.sibling = a, b.child = f2, b.child.memoizedState = oj(c), b.memoizedState = nj, a) : rj(b, g);
  }
  e = a.memoizedState;
  if (null !== e && (h = e.dehydrated, null !== h))
    return sj(a, b, g, d, h, e, c);
  if (f2) {
    f2 = d.fallback;
    g = b.mode;
    e = a.child;
    h = e.sibling;
    var k2 = { mode: "hidden", children: d.children };
    0 === (g & 1) && b.child !== e ? (d = b.child, d.childLanes = 0, d.pendingProps = k2, b.deletions = null) : (d = wh(e, k2), d.subtreeFlags = e.subtreeFlags & 14680064);
    null !== h ? f2 = wh(h, f2) : (f2 = Ah(f2, g, c, null), f2.flags |= 2);
    f2.return = b;
    d.return = b;
    d.sibling = f2;
    b.child = d;
    d = f2;
    f2 = b.child;
    g = a.child.memoizedState;
    g = null === g ? oj(c) : { baseLanes: g.baseLanes | c, cachePool: null, transitions: g.transitions };
    f2.memoizedState = g;
    f2.childLanes = a.childLanes & ~c;
    b.memoizedState = nj;
    return d;
  }
  f2 = a.child;
  a = f2.sibling;
  d = wh(f2, { mode: "visible", children: d.children });
  0 === (b.mode & 1) && (d.lanes = c);
  d.return = b;
  d.sibling = null;
  null !== a && (c = b.deletions, null === c ? (b.deletions = [a], b.flags |= 16) : c.push(a));
  b.child = d;
  b.memoizedState = null;
  return d;
}
function rj(a, b) {
  b = qj({ mode: "visible", children: b }, a.mode, 0, null);
  b.return = a;
  return a.child = b;
}
function tj(a, b, c, d) {
  null !== d && Jg(d);
  Bh(b, a.child, null, c);
  a = rj(b, b.pendingProps.children);
  a.flags |= 2;
  b.memoizedState = null;
  return a;
}
function sj(a, b, c, d, e, f2, g) {
  if (c) {
    if (b.flags & 256)
      return b.flags &= -257, d = Li(Error(p(422))), tj(a, b, g, d);
    if (null !== b.memoizedState)
      return b.child = a.child, b.flags |= 128, null;
    f2 = d.fallback;
    e = b.mode;
    d = qj({ mode: "visible", children: d.children }, e, 0, null);
    f2 = Ah(f2, e, g, null);
    f2.flags |= 2;
    d.return = b;
    f2.return = b;
    d.sibling = f2;
    b.child = d;
    0 !== (b.mode & 1) && Bh(b, a.child, null, g);
    b.child.memoizedState = oj(g);
    b.memoizedState = nj;
    return f2;
  }
  if (0 === (b.mode & 1))
    return tj(a, b, g, null);
  if ("$!" === e.data) {
    d = e.nextSibling && e.nextSibling.dataset;
    if (d)
      var h = d.dgst;
    d = h;
    f2 = Error(p(419));
    d = Li(f2, d, void 0);
    return tj(a, b, g, d);
  }
  h = 0 !== (g & a.childLanes);
  if (Ug || h) {
    d = R$2;
    if (null !== d) {
      switch (g & -g) {
        case 4:
          e = 2;
          break;
        case 16:
          e = 8;
          break;
        case 64:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
        case 67108864:
          e = 32;
          break;
        case 536870912:
          e = 268435456;
          break;
        default:
          e = 0;
      }
      e = 0 !== (e & (d.suspendedLanes | g)) ? 0 : e;
      0 !== e && e !== f2.retryLane && (f2.retryLane = e, Zg(a, e), mh(d, a, e, -1));
    }
    uj();
    d = Li(Error(p(421)));
    return tj(a, b, g, d);
  }
  if ("$?" === e.data)
    return b.flags |= 128, b.child = a.child, b = vj.bind(null, a), e._reactRetry = b, null;
  a = f2.treeContext;
  yg = Lf(e.nextSibling);
  xg = b;
  I$1 = true;
  zg = null;
  null !== a && (og[pg++] = rg, og[pg++] = sg, og[pg++] = qg, rg = a.id, sg = a.overflow, qg = b);
  b = rj(b, d.children);
  b.flags |= 4096;
  return b;
}
function wj(a, b, c) {
  a.lanes |= b;
  var d = a.alternate;
  null !== d && (d.lanes |= b);
  Sg(a.return, b, c);
}
function xj(a, b, c, d, e) {
  var f2 = a.memoizedState;
  null === f2 ? a.memoizedState = { isBackwards: b, rendering: null, renderingStartTime: 0, last: d, tail: c, tailMode: e } : (f2.isBackwards = b, f2.rendering = null, f2.renderingStartTime = 0, f2.last = d, f2.tail = c, f2.tailMode = e);
}
function yj(a, b, c) {
  var d = b.pendingProps, e = d.revealOrder, f2 = d.tail;
  Yi(a, b, d.children, c);
  d = M$1.current;
  if (0 !== (d & 2))
    d = d & 1 | 2, b.flags |= 128;
  else {
    if (null !== a && 0 !== (a.flags & 128))
      a:
        for (a = b.child; null !== a; ) {
          if (13 === a.tag)
            null !== a.memoizedState && wj(a, c, b);
          else if (19 === a.tag)
            wj(a, c, b);
          else if (null !== a.child) {
            a.child.return = a;
            a = a.child;
            continue;
          }
          if (a === b)
            break a;
          for (; null === a.sibling; ) {
            if (null === a.return || a.return === b)
              break a;
            a = a.return;
          }
          a.sibling.return = a.return;
          a = a.sibling;
        }
    d &= 1;
  }
  G$1(M$1, d);
  if (0 === (b.mode & 1))
    b.memoizedState = null;
  else
    switch (e) {
      case "forwards":
        c = b.child;
        for (e = null; null !== c; )
          a = c.alternate, null !== a && null === Mh(a) && (e = c), c = c.sibling;
        c = e;
        null === c ? (e = b.child, b.child = null) : (e = c.sibling, c.sibling = null);
        xj(b, false, e, c, f2);
        break;
      case "backwards":
        c = null;
        e = b.child;
        for (b.child = null; null !== e; ) {
          a = e.alternate;
          if (null !== a && null === Mh(a)) {
            b.child = e;
            break;
          }
          a = e.sibling;
          e.sibling = c;
          c = e;
          e = a;
        }
        xj(b, true, c, null, f2);
        break;
      case "together":
        xj(b, false, null, null, void 0);
        break;
      default:
        b.memoizedState = null;
    }
  return b.child;
}
function jj(a, b) {
  0 === (b.mode & 1) && null !== a && (a.alternate = null, b.alternate = null, b.flags |= 2);
}
function $i(a, b, c) {
  null !== a && (b.dependencies = a.dependencies);
  hh |= b.lanes;
  if (0 === (c & b.childLanes))
    return null;
  if (null !== a && b.child !== a.child)
    throw Error(p(153));
  if (null !== b.child) {
    a = b.child;
    c = wh(a, a.pendingProps);
    b.child = c;
    for (c.return = b; null !== a.sibling; )
      a = a.sibling, c = c.sibling = wh(a, a.pendingProps), c.return = b;
    c.sibling = null;
  }
  return b.child;
}
function zj(a, b, c) {
  switch (b.tag) {
    case 3:
      lj(b);
      Ig();
      break;
    case 5:
      Kh(b);
      break;
    case 1:
      Zf(b.type) && cg(b);
      break;
    case 4:
      Ih(b, b.stateNode.containerInfo);
      break;
    case 10:
      var d = b.type._context, e = b.memoizedProps.value;
      G$1(Mg, d._currentValue);
      d._currentValue = e;
      break;
    case 13:
      d = b.memoizedState;
      if (null !== d) {
        if (null !== d.dehydrated)
          return G$1(M$1, M$1.current & 1), b.flags |= 128, null;
        if (0 !== (c & b.child.childLanes))
          return pj(a, b, c);
        G$1(M$1, M$1.current & 1);
        a = $i(a, b, c);
        return null !== a ? a.sibling : null;
      }
      G$1(M$1, M$1.current & 1);
      break;
    case 19:
      d = 0 !== (c & b.childLanes);
      if (0 !== (a.flags & 128)) {
        if (d)
          return yj(a, b, c);
        b.flags |= 128;
      }
      e = b.memoizedState;
      null !== e && (e.rendering = null, e.tail = null, e.lastEffect = null);
      G$1(M$1, M$1.current);
      if (d)
        break;
      else
        return null;
    case 22:
    case 23:
      return b.lanes = 0, ej(a, b, c);
  }
  return $i(a, b, c);
}
var Aj, Bj, Cj, Dj;
Aj = function(a, b) {
  for (var c = b.child; null !== c; ) {
    if (5 === c.tag || 6 === c.tag)
      a.appendChild(c.stateNode);
    else if (4 !== c.tag && null !== c.child) {
      c.child.return = c;
      c = c.child;
      continue;
    }
    if (c === b)
      break;
    for (; null === c.sibling; ) {
      if (null === c.return || c.return === b)
        return;
      c = c.return;
    }
    c.sibling.return = c.return;
    c = c.sibling;
  }
};
Bj = function() {
};
Cj = function(a, b, c, d) {
  var e = a.memoizedProps;
  if (e !== d) {
    a = b.stateNode;
    Hh(Eh.current);
    var f2 = null;
    switch (c) {
      case "input":
        e = Ya(a, e);
        d = Ya(a, d);
        f2 = [];
        break;
      case "select":
        e = A$2({}, e, { value: void 0 });
        d = A$2({}, d, { value: void 0 });
        f2 = [];
        break;
      case "textarea":
        e = gb(a, e);
        d = gb(a, d);
        f2 = [];
        break;
      default:
        "function" !== typeof e.onClick && "function" === typeof d.onClick && (a.onclick = Bf);
    }
    ub(c, d);
    var g;
    c = null;
    for (l2 in e)
      if (!d.hasOwnProperty(l2) && e.hasOwnProperty(l2) && null != e[l2])
        if ("style" === l2) {
          var h = e[l2];
          for (g in h)
            h.hasOwnProperty(g) && (c || (c = {}), c[g] = "");
        } else
          "dangerouslySetInnerHTML" !== l2 && "children" !== l2 && "suppressContentEditableWarning" !== l2 && "suppressHydrationWarning" !== l2 && "autoFocus" !== l2 && (ea.hasOwnProperty(l2) ? f2 || (f2 = []) : (f2 = f2 || []).push(l2, null));
    for (l2 in d) {
      var k2 = d[l2];
      h = null != e ? e[l2] : void 0;
      if (d.hasOwnProperty(l2) && k2 !== h && (null != k2 || null != h))
        if ("style" === l2)
          if (h) {
            for (g in h)
              !h.hasOwnProperty(g) || k2 && k2.hasOwnProperty(g) || (c || (c = {}), c[g] = "");
            for (g in k2)
              k2.hasOwnProperty(g) && h[g] !== k2[g] && (c || (c = {}), c[g] = k2[g]);
          } else
            c || (f2 || (f2 = []), f2.push(
              l2,
              c
            )), c = k2;
        else
          "dangerouslySetInnerHTML" === l2 ? (k2 = k2 ? k2.__html : void 0, h = h ? h.__html : void 0, null != k2 && h !== k2 && (f2 = f2 || []).push(l2, k2)) : "children" === l2 ? "string" !== typeof k2 && "number" !== typeof k2 || (f2 = f2 || []).push(l2, "" + k2) : "suppressContentEditableWarning" !== l2 && "suppressHydrationWarning" !== l2 && (ea.hasOwnProperty(l2) ? (null != k2 && "onScroll" === l2 && D$1("scroll", a), f2 || h === k2 || (f2 = [])) : (f2 = f2 || []).push(l2, k2));
    }
    c && (f2 = f2 || []).push("style", c);
    var l2 = f2;
    if (b.updateQueue = l2)
      b.flags |= 4;
  }
};
Dj = function(a, b, c, d) {
  c !== d && (b.flags |= 4);
};
function Ej(a, b) {
  if (!I$1)
    switch (a.tailMode) {
      case "hidden":
        b = a.tail;
        for (var c = null; null !== b; )
          null !== b.alternate && (c = b), b = b.sibling;
        null === c ? a.tail = null : c.sibling = null;
        break;
      case "collapsed":
        c = a.tail;
        for (var d = null; null !== c; )
          null !== c.alternate && (d = c), c = c.sibling;
        null === d ? b || null === a.tail ? a.tail = null : a.tail.sibling = null : d.sibling = null;
    }
}
function S(a) {
  var b = null !== a.alternate && a.alternate.child === a.child, c = 0, d = 0;
  if (b)
    for (var e = a.child; null !== e; )
      c |= e.lanes | e.childLanes, d |= e.subtreeFlags & 14680064, d |= e.flags & 14680064, e.return = a, e = e.sibling;
  else
    for (e = a.child; null !== e; )
      c |= e.lanes | e.childLanes, d |= e.subtreeFlags, d |= e.flags, e.return = a, e = e.sibling;
  a.subtreeFlags |= d;
  a.childLanes = c;
  return b;
}
function Fj(a, b, c) {
  var d = b.pendingProps;
  wg(b);
  switch (b.tag) {
    case 2:
    case 16:
    case 15:
    case 0:
    case 11:
    case 7:
    case 8:
    case 12:
    case 9:
    case 14:
      return S(b), null;
    case 1:
      return Zf(b.type) && $f(), S(b), null;
    case 3:
      d = b.stateNode;
      Jh();
      E$1(Wf);
      E$1(H$1);
      Oh();
      d.pendingContext && (d.context = d.pendingContext, d.pendingContext = null);
      if (null === a || null === a.child)
        Gg(b) ? b.flags |= 4 : null === a || a.memoizedState.isDehydrated && 0 === (b.flags & 256) || (b.flags |= 1024, null !== zg && (Gj(zg), zg = null));
      Bj(a, b);
      S(b);
      return null;
    case 5:
      Lh(b);
      var e = Hh(Gh.current);
      c = b.type;
      if (null !== a && null != b.stateNode)
        Cj(a, b, c, d, e), a.ref !== b.ref && (b.flags |= 512, b.flags |= 2097152);
      else {
        if (!d) {
          if (null === b.stateNode)
            throw Error(p(166));
          S(b);
          return null;
        }
        a = Hh(Eh.current);
        if (Gg(b)) {
          d = b.stateNode;
          c = b.type;
          var f2 = b.memoizedProps;
          d[Of] = b;
          d[Pf] = f2;
          a = 0 !== (b.mode & 1);
          switch (c) {
            case "dialog":
              D$1("cancel", d);
              D$1("close", d);
              break;
            case "iframe":
            case "object":
            case "embed":
              D$1("load", d);
              break;
            case "video":
            case "audio":
              for (e = 0; e < lf.length; e++)
                D$1(lf[e], d);
              break;
            case "source":
              D$1("error", d);
              break;
            case "img":
            case "image":
            case "link":
              D$1(
                "error",
                d
              );
              D$1("load", d);
              break;
            case "details":
              D$1("toggle", d);
              break;
            case "input":
              Za(d, f2);
              D$1("invalid", d);
              break;
            case "select":
              d._wrapperState = { wasMultiple: !!f2.multiple };
              D$1("invalid", d);
              break;
            case "textarea":
              hb(d, f2), D$1("invalid", d);
          }
          ub(c, f2);
          e = null;
          for (var g in f2)
            if (f2.hasOwnProperty(g)) {
              var h = f2[g];
              "children" === g ? "string" === typeof h ? d.textContent !== h && (true !== f2.suppressHydrationWarning && Af(d.textContent, h, a), e = ["children", h]) : "number" === typeof h && d.textContent !== "" + h && (true !== f2.suppressHydrationWarning && Af(
                d.textContent,
                h,
                a
              ), e = ["children", "" + h]) : ea.hasOwnProperty(g) && null != h && "onScroll" === g && D$1("scroll", d);
            }
          switch (c) {
            case "input":
              Va(d);
              db(d, f2, true);
              break;
            case "textarea":
              Va(d);
              jb(d);
              break;
            case "select":
            case "option":
              break;
            default:
              "function" === typeof f2.onClick && (d.onclick = Bf);
          }
          d = e;
          b.updateQueue = d;
          null !== d && (b.flags |= 4);
        } else {
          g = 9 === e.nodeType ? e : e.ownerDocument;
          "http://www.w3.org/1999/xhtml" === a && (a = kb(c));
          "http://www.w3.org/1999/xhtml" === a ? "script" === c ? (a = g.createElement("div"), a.innerHTML = "<script><\/script>", a = a.removeChild(a.firstChild)) : "string" === typeof d.is ? a = g.createElement(c, { is: d.is }) : (a = g.createElement(c), "select" === c && (g = a, d.multiple ? g.multiple = true : d.size && (g.size = d.size))) : a = g.createElementNS(a, c);
          a[Of] = b;
          a[Pf] = d;
          Aj(a, b, false, false);
          b.stateNode = a;
          a: {
            g = vb(c, d);
            switch (c) {
              case "dialog":
                D$1("cancel", a);
                D$1("close", a);
                e = d;
                break;
              case "iframe":
              case "object":
              case "embed":
                D$1("load", a);
                e = d;
                break;
              case "video":
              case "audio":
                for (e = 0; e < lf.length; e++)
                  D$1(lf[e], a);
                e = d;
                break;
              case "source":
                D$1("error", a);
                e = d;
                break;
              case "img":
              case "image":
              case "link":
                D$1(
                  "error",
                  a
                );
                D$1("load", a);
                e = d;
                break;
              case "details":
                D$1("toggle", a);
                e = d;
                break;
              case "input":
                Za(a, d);
                e = Ya(a, d);
                D$1("invalid", a);
                break;
              case "option":
                e = d;
                break;
              case "select":
                a._wrapperState = { wasMultiple: !!d.multiple };
                e = A$2({}, d, { value: void 0 });
                D$1("invalid", a);
                break;
              case "textarea":
                hb(a, d);
                e = gb(a, d);
                D$1("invalid", a);
                break;
              default:
                e = d;
            }
            ub(c, e);
            h = e;
            for (f2 in h)
              if (h.hasOwnProperty(f2)) {
                var k2 = h[f2];
                "style" === f2 ? sb(a, k2) : "dangerouslySetInnerHTML" === f2 ? (k2 = k2 ? k2.__html : void 0, null != k2 && nb(a, k2)) : "children" === f2 ? "string" === typeof k2 ? ("textarea" !== c || "" !== k2) && ob(a, k2) : "number" === typeof k2 && ob(a, "" + k2) : "suppressContentEditableWarning" !== f2 && "suppressHydrationWarning" !== f2 && "autoFocus" !== f2 && (ea.hasOwnProperty(f2) ? null != k2 && "onScroll" === f2 && D$1("scroll", a) : null != k2 && ta(a, f2, k2, g));
              }
            switch (c) {
              case "input":
                Va(a);
                db(a, d, false);
                break;
              case "textarea":
                Va(a);
                jb(a);
                break;
              case "option":
                null != d.value && a.setAttribute("value", "" + Sa(d.value));
                break;
              case "select":
                a.multiple = !!d.multiple;
                f2 = d.value;
                null != f2 ? fb(a, !!d.multiple, f2, false) : null != d.defaultValue && fb(
                  a,
                  !!d.multiple,
                  d.defaultValue,
                  true
                );
                break;
              default:
                "function" === typeof e.onClick && (a.onclick = Bf);
            }
            switch (c) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                d = !!d.autoFocus;
                break a;
              case "img":
                d = true;
                break a;
              default:
                d = false;
            }
          }
          d && (b.flags |= 4);
        }
        null !== b.ref && (b.flags |= 512, b.flags |= 2097152);
      }
      S(b);
      return null;
    case 6:
      if (a && null != b.stateNode)
        Dj(a, b, a.memoizedProps, d);
      else {
        if ("string" !== typeof d && null === b.stateNode)
          throw Error(p(166));
        c = Hh(Gh.current);
        Hh(Eh.current);
        if (Gg(b)) {
          d = b.stateNode;
          c = b.memoizedProps;
          d[Of] = b;
          if (f2 = d.nodeValue !== c) {
            if (a = xg, null !== a)
              switch (a.tag) {
                case 3:
                  Af(d.nodeValue, c, 0 !== (a.mode & 1));
                  break;
                case 5:
                  true !== a.memoizedProps.suppressHydrationWarning && Af(d.nodeValue, c, 0 !== (a.mode & 1));
              }
          }
          f2 && (b.flags |= 4);
        } else
          d = (9 === c.nodeType ? c : c.ownerDocument).createTextNode(d), d[Of] = b, b.stateNode = d;
      }
      S(b);
      return null;
    case 13:
      E$1(M$1);
      d = b.memoizedState;
      if (null === a || null !== a.memoizedState && null !== a.memoizedState.dehydrated) {
        if (I$1 && null !== yg && 0 !== (b.mode & 1) && 0 === (b.flags & 128))
          Hg(), Ig(), b.flags |= 98560, f2 = false;
        else if (f2 = Gg(b), null !== d && null !== d.dehydrated) {
          if (null === a) {
            if (!f2)
              throw Error(p(318));
            f2 = b.memoizedState;
            f2 = null !== f2 ? f2.dehydrated : null;
            if (!f2)
              throw Error(p(317));
            f2[Of] = b;
          } else
            Ig(), 0 === (b.flags & 128) && (b.memoizedState = null), b.flags |= 4;
          S(b);
          f2 = false;
        } else
          null !== zg && (Gj(zg), zg = null), f2 = true;
        if (!f2)
          return b.flags & 65536 ? b : null;
      }
      if (0 !== (b.flags & 128))
        return b.lanes = c, b;
      d = null !== d;
      d !== (null !== a && null !== a.memoizedState) && d && (b.child.flags |= 8192, 0 !== (b.mode & 1) && (null === a || 0 !== (M$1.current & 1) ? 0 === T$1 && (T$1 = 3) : uj()));
      null !== b.updateQueue && (b.flags |= 4);
      S(b);
      return null;
    case 4:
      return Jh(), Bj(a, b), null === a && sf(b.stateNode.containerInfo), S(b), null;
    case 10:
      return Rg(b.type._context), S(b), null;
    case 17:
      return Zf(b.type) && $f(), S(b), null;
    case 19:
      E$1(M$1);
      f2 = b.memoizedState;
      if (null === f2)
        return S(b), null;
      d = 0 !== (b.flags & 128);
      g = f2.rendering;
      if (null === g)
        if (d)
          Ej(f2, false);
        else {
          if (0 !== T$1 || null !== a && 0 !== (a.flags & 128))
            for (a = b.child; null !== a; ) {
              g = Mh(a);
              if (null !== g) {
                b.flags |= 128;
                Ej(f2, false);
                d = g.updateQueue;
                null !== d && (b.updateQueue = d, b.flags |= 4);
                b.subtreeFlags = 0;
                d = c;
                for (c = b.child; null !== c; )
                  f2 = c, a = d, f2.flags &= 14680066, g = f2.alternate, null === g ? (f2.childLanes = 0, f2.lanes = a, f2.child = null, f2.subtreeFlags = 0, f2.memoizedProps = null, f2.memoizedState = null, f2.updateQueue = null, f2.dependencies = null, f2.stateNode = null) : (f2.childLanes = g.childLanes, f2.lanes = g.lanes, f2.child = g.child, f2.subtreeFlags = 0, f2.deletions = null, f2.memoizedProps = g.memoizedProps, f2.memoizedState = g.memoizedState, f2.updateQueue = g.updateQueue, f2.type = g.type, a = g.dependencies, f2.dependencies = null === a ? null : { lanes: a.lanes, firstContext: a.firstContext }), c = c.sibling;
                G$1(M$1, M$1.current & 1 | 2);
                return b.child;
              }
              a = a.sibling;
            }
          null !== f2.tail && B$1() > Hj && (b.flags |= 128, d = true, Ej(f2, false), b.lanes = 4194304);
        }
      else {
        if (!d)
          if (a = Mh(g), null !== a) {
            if (b.flags |= 128, d = true, c = a.updateQueue, null !== c && (b.updateQueue = c, b.flags |= 4), Ej(f2, true), null === f2.tail && "hidden" === f2.tailMode && !g.alternate && !I$1)
              return S(b), null;
          } else
            2 * B$1() - f2.renderingStartTime > Hj && 1073741824 !== c && (b.flags |= 128, d = true, Ej(f2, false), b.lanes = 4194304);
        f2.isBackwards ? (g.sibling = b.child, b.child = g) : (c = f2.last, null !== c ? c.sibling = g : b.child = g, f2.last = g);
      }
      if (null !== f2.tail)
        return b = f2.tail, f2.rendering = b, f2.tail = b.sibling, f2.renderingStartTime = B$1(), b.sibling = null, c = M$1.current, G$1(M$1, d ? c & 1 | 2 : c & 1), b;
      S(b);
      return null;
    case 22:
    case 23:
      return Ij(), d = null !== b.memoizedState, null !== a && null !== a.memoizedState !== d && (b.flags |= 8192), d && 0 !== (b.mode & 1) ? 0 !== (gj & 1073741824) && (S(b), b.subtreeFlags & 6 && (b.flags |= 8192)) : S(b), null;
    case 24:
      return null;
    case 25:
      return null;
  }
  throw Error(p(156, b.tag));
}
function Jj(a, b) {
  wg(b);
  switch (b.tag) {
    case 1:
      return Zf(b.type) && $f(), a = b.flags, a & 65536 ? (b.flags = a & -65537 | 128, b) : null;
    case 3:
      return Jh(), E$1(Wf), E$1(H$1), Oh(), a = b.flags, 0 !== (a & 65536) && 0 === (a & 128) ? (b.flags = a & -65537 | 128, b) : null;
    case 5:
      return Lh(b), null;
    case 13:
      E$1(M$1);
      a = b.memoizedState;
      if (null !== a && null !== a.dehydrated) {
        if (null === b.alternate)
          throw Error(p(340));
        Ig();
      }
      a = b.flags;
      return a & 65536 ? (b.flags = a & -65537 | 128, b) : null;
    case 19:
      return E$1(M$1), null;
    case 4:
      return Jh(), null;
    case 10:
      return Rg(b.type._context), null;
    case 22:
    case 23:
      return Ij(), null;
    case 24:
      return null;
    default:
      return null;
  }
}
var Kj = false, U$1 = false, Lj = "function" === typeof WeakSet ? WeakSet : Set, V$1 = null;
function Mj(a, b) {
  var c = a.ref;
  if (null !== c)
    if ("function" === typeof c)
      try {
        c(null);
      } catch (d) {
        W$1(a, b, d);
      }
    else
      c.current = null;
}
function Nj(a, b, c) {
  try {
    c();
  } catch (d) {
    W$1(a, b, d);
  }
}
var Oj = false;
function Pj(a, b) {
  Cf = dd;
  a = Me$1();
  if (Ne$1(a)) {
    if ("selectionStart" in a)
      var c = { start: a.selectionStart, end: a.selectionEnd };
    else
      a: {
        c = (c = a.ownerDocument) && c.defaultView || window;
        var d = c.getSelection && c.getSelection();
        if (d && 0 !== d.rangeCount) {
          c = d.anchorNode;
          var e = d.anchorOffset, f2 = d.focusNode;
          d = d.focusOffset;
          try {
            c.nodeType, f2.nodeType;
          } catch (F2) {
            c = null;
            break a;
          }
          var g = 0, h = -1, k2 = -1, l2 = 0, m2 = 0, q2 = a, r2 = null;
          b:
            for (; ; ) {
              for (var y2; ; ) {
                q2 !== c || 0 !== e && 3 !== q2.nodeType || (h = g + e);
                q2 !== f2 || 0 !== d && 3 !== q2.nodeType || (k2 = g + d);
                3 === q2.nodeType && (g += q2.nodeValue.length);
                if (null === (y2 = q2.firstChild))
                  break;
                r2 = q2;
                q2 = y2;
              }
              for (; ; ) {
                if (q2 === a)
                  break b;
                r2 === c && ++l2 === e && (h = g);
                r2 === f2 && ++m2 === d && (k2 = g);
                if (null !== (y2 = q2.nextSibling))
                  break;
                q2 = r2;
                r2 = q2.parentNode;
              }
              q2 = y2;
            }
          c = -1 === h || -1 === k2 ? null : { start: h, end: k2 };
        } else
          c = null;
      }
    c = c || { start: 0, end: 0 };
  } else
    c = null;
  Df = { focusedElem: a, selectionRange: c };
  dd = false;
  for (V$1 = b; null !== V$1; )
    if (b = V$1, a = b.child, 0 !== (b.subtreeFlags & 1028) && null !== a)
      a.return = b, V$1 = a;
    else
      for (; null !== V$1; ) {
        b = V$1;
        try {
          var n2 = b.alternate;
          if (0 !== (b.flags & 1024))
            switch (b.tag) {
              case 0:
              case 11:
              case 15:
                break;
              case 1:
                if (null !== n2) {
                  var t2 = n2.memoizedProps, J2 = n2.memoizedState, x2 = b.stateNode, w2 = x2.getSnapshotBeforeUpdate(b.elementType === b.type ? t2 : Lg(b.type, t2), J2);
                  x2.__reactInternalSnapshotBeforeUpdate = w2;
                }
                break;
              case 3:
                var u2 = b.stateNode.containerInfo;
                1 === u2.nodeType ? u2.textContent = "" : 9 === u2.nodeType && u2.documentElement && u2.removeChild(u2.documentElement);
                break;
              case 5:
              case 6:
              case 4:
              case 17:
                break;
              default:
                throw Error(p(163));
            }
        } catch (F2) {
          W$1(b, b.return, F2);
        }
        a = b.sibling;
        if (null !== a) {
          a.return = b.return;
          V$1 = a;
          break;
        }
        V$1 = b.return;
      }
  n2 = Oj;
  Oj = false;
  return n2;
}
function Qj(a, b, c) {
  var d = b.updateQueue;
  d = null !== d ? d.lastEffect : null;
  if (null !== d) {
    var e = d = d.next;
    do {
      if ((e.tag & a) === a) {
        var f2 = e.destroy;
        e.destroy = void 0;
        void 0 !== f2 && Nj(b, c, f2);
      }
      e = e.next;
    } while (e !== d);
  }
}
function Rj(a, b) {
  b = b.updateQueue;
  b = null !== b ? b.lastEffect : null;
  if (null !== b) {
    var c = b = b.next;
    do {
      if ((c.tag & a) === a) {
        var d = c.create;
        c.destroy = d();
      }
      c = c.next;
    } while (c !== b);
  }
}
function Sj(a) {
  var b = a.ref;
  if (null !== b) {
    var c = a.stateNode;
    switch (a.tag) {
      case 5:
        a = c;
        break;
      default:
        a = c;
    }
    "function" === typeof b ? b(a) : b.current = a;
  }
}
function Tj(a) {
  var b = a.alternate;
  null !== b && (a.alternate = null, Tj(b));
  a.child = null;
  a.deletions = null;
  a.sibling = null;
  5 === a.tag && (b = a.stateNode, null !== b && (delete b[Of], delete b[Pf], delete b[of], delete b[Qf], delete b[Rf]));
  a.stateNode = null;
  a.return = null;
  a.dependencies = null;
  a.memoizedProps = null;
  a.memoizedState = null;
  a.pendingProps = null;
  a.stateNode = null;
  a.updateQueue = null;
}
function Uj(a) {
  return 5 === a.tag || 3 === a.tag || 4 === a.tag;
}
function Vj(a) {
  a:
    for (; ; ) {
      for (; null === a.sibling; ) {
        if (null === a.return || Uj(a.return))
          return null;
        a = a.return;
      }
      a.sibling.return = a.return;
      for (a = a.sibling; 5 !== a.tag && 6 !== a.tag && 18 !== a.tag; ) {
        if (a.flags & 2)
          continue a;
        if (null === a.child || 4 === a.tag)
          continue a;
        else
          a.child.return = a, a = a.child;
      }
      if (!(a.flags & 2))
        return a.stateNode;
    }
}
function Wj(a, b, c) {
  var d = a.tag;
  if (5 === d || 6 === d)
    a = a.stateNode, b ? 8 === c.nodeType ? c.parentNode.insertBefore(a, b) : c.insertBefore(a, b) : (8 === c.nodeType ? (b = c.parentNode, b.insertBefore(a, c)) : (b = c, b.appendChild(a)), c = c._reactRootContainer, null !== c && void 0 !== c || null !== b.onclick || (b.onclick = Bf));
  else if (4 !== d && (a = a.child, null !== a))
    for (Wj(a, b, c), a = a.sibling; null !== a; )
      Wj(a, b, c), a = a.sibling;
}
function Xj(a, b, c) {
  var d = a.tag;
  if (5 === d || 6 === d)
    a = a.stateNode, b ? c.insertBefore(a, b) : c.appendChild(a);
  else if (4 !== d && (a = a.child, null !== a))
    for (Xj(a, b, c), a = a.sibling; null !== a; )
      Xj(a, b, c), a = a.sibling;
}
var X$1 = null, Yj = false;
function Zj(a, b, c) {
  for (c = c.child; null !== c; )
    ak(a, b, c), c = c.sibling;
}
function ak(a, b, c) {
  if (lc && "function" === typeof lc.onCommitFiberUnmount)
    try {
      lc.onCommitFiberUnmount(kc, c);
    } catch (h) {
    }
  switch (c.tag) {
    case 5:
      U$1 || Mj(c, b);
    case 6:
      var d = X$1, e = Yj;
      X$1 = null;
      Zj(a, b, c);
      X$1 = d;
      Yj = e;
      null !== X$1 && (Yj ? (a = X$1, c = c.stateNode, 8 === a.nodeType ? a.parentNode.removeChild(c) : a.removeChild(c)) : X$1.removeChild(c.stateNode));
      break;
    case 18:
      null !== X$1 && (Yj ? (a = X$1, c = c.stateNode, 8 === a.nodeType ? Kf(a.parentNode, c) : 1 === a.nodeType && Kf(a, c), bd(a)) : Kf(X$1, c.stateNode));
      break;
    case 4:
      d = X$1;
      e = Yj;
      X$1 = c.stateNode.containerInfo;
      Yj = true;
      Zj(a, b, c);
      X$1 = d;
      Yj = e;
      break;
    case 0:
    case 11:
    case 14:
    case 15:
      if (!U$1 && (d = c.updateQueue, null !== d && (d = d.lastEffect, null !== d))) {
        e = d = d.next;
        do {
          var f2 = e, g = f2.destroy;
          f2 = f2.tag;
          void 0 !== g && (0 !== (f2 & 2) ? Nj(c, b, g) : 0 !== (f2 & 4) && Nj(c, b, g));
          e = e.next;
        } while (e !== d);
      }
      Zj(a, b, c);
      break;
    case 1:
      if (!U$1 && (Mj(c, b), d = c.stateNode, "function" === typeof d.componentWillUnmount))
        try {
          d.props = c.memoizedProps, d.state = c.memoizedState, d.componentWillUnmount();
        } catch (h) {
          W$1(c, b, h);
        }
      Zj(a, b, c);
      break;
    case 21:
      Zj(a, b, c);
      break;
    case 22:
      c.mode & 1 ? (U$1 = (d = U$1) || null !== c.memoizedState, Zj(a, b, c), U$1 = d) : Zj(a, b, c);
      break;
    default:
      Zj(a, b, c);
  }
}
function bk(a) {
  var b = a.updateQueue;
  if (null !== b) {
    a.updateQueue = null;
    var c = a.stateNode;
    null === c && (c = a.stateNode = new Lj());
    b.forEach(function(b2) {
      var d = ck.bind(null, a, b2);
      c.has(b2) || (c.add(b2), b2.then(d, d));
    });
  }
}
function dk(a, b) {
  var c = b.deletions;
  if (null !== c)
    for (var d = 0; d < c.length; d++) {
      var e = c[d];
      try {
        var f2 = a, g = b, h = g;
        a:
          for (; null !== h; ) {
            switch (h.tag) {
              case 5:
                X$1 = h.stateNode;
                Yj = false;
                break a;
              case 3:
                X$1 = h.stateNode.containerInfo;
                Yj = true;
                break a;
              case 4:
                X$1 = h.stateNode.containerInfo;
                Yj = true;
                break a;
            }
            h = h.return;
          }
        if (null === X$1)
          throw Error(p(160));
        ak(f2, g, e);
        X$1 = null;
        Yj = false;
        var k2 = e.alternate;
        null !== k2 && (k2.return = null);
        e.return = null;
      } catch (l2) {
        W$1(e, b, l2);
      }
    }
  if (b.subtreeFlags & 12854)
    for (b = b.child; null !== b; )
      ek(b, a), b = b.sibling;
}
function ek(a, b) {
  var c = a.alternate, d = a.flags;
  switch (a.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
      dk(b, a);
      fk(a);
      if (d & 4) {
        try {
          Qj(3, a, a.return), Rj(3, a);
        } catch (t2) {
          W$1(a, a.return, t2);
        }
        try {
          Qj(5, a, a.return);
        } catch (t2) {
          W$1(a, a.return, t2);
        }
      }
      break;
    case 1:
      dk(b, a);
      fk(a);
      d & 512 && null !== c && Mj(c, c.return);
      break;
    case 5:
      dk(b, a);
      fk(a);
      d & 512 && null !== c && Mj(c, c.return);
      if (a.flags & 32) {
        var e = a.stateNode;
        try {
          ob(e, "");
        } catch (t2) {
          W$1(a, a.return, t2);
        }
      }
      if (d & 4 && (e = a.stateNode, null != e)) {
        var f2 = a.memoizedProps, g = null !== c ? c.memoizedProps : f2, h = a.type, k2 = a.updateQueue;
        a.updateQueue = null;
        if (null !== k2)
          try {
            "input" === h && "radio" === f2.type && null != f2.name && ab(e, f2);
            vb(h, g);
            var l2 = vb(h, f2);
            for (g = 0; g < k2.length; g += 2) {
              var m2 = k2[g], q2 = k2[g + 1];
              "style" === m2 ? sb(e, q2) : "dangerouslySetInnerHTML" === m2 ? nb(e, q2) : "children" === m2 ? ob(e, q2) : ta(e, m2, q2, l2);
            }
            switch (h) {
              case "input":
                bb(e, f2);
                break;
              case "textarea":
                ib(e, f2);
                break;
              case "select":
                var r2 = e._wrapperState.wasMultiple;
                e._wrapperState.wasMultiple = !!f2.multiple;
                var y2 = f2.value;
                null != y2 ? fb(e, !!f2.multiple, y2, false) : r2 !== !!f2.multiple && (null != f2.defaultValue ? fb(
                  e,
                  !!f2.multiple,
                  f2.defaultValue,
                  true
                ) : fb(e, !!f2.multiple, f2.multiple ? [] : "", false));
            }
            e[Pf] = f2;
          } catch (t2) {
            W$1(a, a.return, t2);
          }
      }
      break;
    case 6:
      dk(b, a);
      fk(a);
      if (d & 4) {
        if (null === a.stateNode)
          throw Error(p(162));
        e = a.stateNode;
        f2 = a.memoizedProps;
        try {
          e.nodeValue = f2;
        } catch (t2) {
          W$1(a, a.return, t2);
        }
      }
      break;
    case 3:
      dk(b, a);
      fk(a);
      if (d & 4 && null !== c && c.memoizedState.isDehydrated)
        try {
          bd(b.containerInfo);
        } catch (t2) {
          W$1(a, a.return, t2);
        }
      break;
    case 4:
      dk(b, a);
      fk(a);
      break;
    case 13:
      dk(b, a);
      fk(a);
      e = a.child;
      e.flags & 8192 && (f2 = null !== e.memoizedState, e.stateNode.isHidden = f2, !f2 || null !== e.alternate && null !== e.alternate.memoizedState || (gk = B$1()));
      d & 4 && bk(a);
      break;
    case 22:
      m2 = null !== c && null !== c.memoizedState;
      a.mode & 1 ? (U$1 = (l2 = U$1) || m2, dk(b, a), U$1 = l2) : dk(b, a);
      fk(a);
      if (d & 8192) {
        l2 = null !== a.memoizedState;
        if ((a.stateNode.isHidden = l2) && !m2 && 0 !== (a.mode & 1))
          for (V$1 = a, m2 = a.child; null !== m2; ) {
            for (q2 = V$1 = m2; null !== V$1; ) {
              r2 = V$1;
              y2 = r2.child;
              switch (r2.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  Qj(4, r2, r2.return);
                  break;
                case 1:
                  Mj(r2, r2.return);
                  var n2 = r2.stateNode;
                  if ("function" === typeof n2.componentWillUnmount) {
                    d = r2;
                    c = r2.return;
                    try {
                      b = d, n2.props = b.memoizedProps, n2.state = b.memoizedState, n2.componentWillUnmount();
                    } catch (t2) {
                      W$1(d, c, t2);
                    }
                  }
                  break;
                case 5:
                  Mj(r2, r2.return);
                  break;
                case 22:
                  if (null !== r2.memoizedState) {
                    hk(q2);
                    continue;
                  }
              }
              null !== y2 ? (y2.return = r2, V$1 = y2) : hk(q2);
            }
            m2 = m2.sibling;
          }
        a:
          for (m2 = null, q2 = a; ; ) {
            if (5 === q2.tag) {
              if (null === m2) {
                m2 = q2;
                try {
                  e = q2.stateNode, l2 ? (f2 = e.style, "function" === typeof f2.setProperty ? f2.setProperty("display", "none", "important") : f2.display = "none") : (h = q2.stateNode, k2 = q2.memoizedProps.style, g = void 0 !== k2 && null !== k2 && k2.hasOwnProperty("display") ? k2.display : null, h.style.display = rb("display", g));
                } catch (t2) {
                  W$1(a, a.return, t2);
                }
              }
            } else if (6 === q2.tag) {
              if (null === m2)
                try {
                  q2.stateNode.nodeValue = l2 ? "" : q2.memoizedProps;
                } catch (t2) {
                  W$1(a, a.return, t2);
                }
            } else if ((22 !== q2.tag && 23 !== q2.tag || null === q2.memoizedState || q2 === a) && null !== q2.child) {
              q2.child.return = q2;
              q2 = q2.child;
              continue;
            }
            if (q2 === a)
              break a;
            for (; null === q2.sibling; ) {
              if (null === q2.return || q2.return === a)
                break a;
              m2 === q2 && (m2 = null);
              q2 = q2.return;
            }
            m2 === q2 && (m2 = null);
            q2.sibling.return = q2.return;
            q2 = q2.sibling;
          }
      }
      break;
    case 19:
      dk(b, a);
      fk(a);
      d & 4 && bk(a);
      break;
    case 21:
      break;
    default:
      dk(
        b,
        a
      ), fk(a);
  }
}
function fk(a) {
  var b = a.flags;
  if (b & 2) {
    try {
      a: {
        for (var c = a.return; null !== c; ) {
          if (Uj(c)) {
            var d = c;
            break a;
          }
          c = c.return;
        }
        throw Error(p(160));
      }
      switch (d.tag) {
        case 5:
          var e = d.stateNode;
          d.flags & 32 && (ob(e, ""), d.flags &= -33);
          var f2 = Vj(a);
          Xj(a, f2, e);
          break;
        case 3:
        case 4:
          var g = d.stateNode.containerInfo, h = Vj(a);
          Wj(a, h, g);
          break;
        default:
          throw Error(p(161));
      }
    } catch (k2) {
      W$1(a, a.return, k2);
    }
    a.flags &= -3;
  }
  b & 4096 && (a.flags &= -4097);
}
function ik(a, b, c) {
  V$1 = a;
  jk(a);
}
function jk(a, b, c) {
  for (var d = 0 !== (a.mode & 1); null !== V$1; ) {
    var e = V$1, f2 = e.child;
    if (22 === e.tag && d) {
      var g = null !== e.memoizedState || Kj;
      if (!g) {
        var h = e.alternate, k2 = null !== h && null !== h.memoizedState || U$1;
        h = Kj;
        var l2 = U$1;
        Kj = g;
        if ((U$1 = k2) && !l2)
          for (V$1 = e; null !== V$1; )
            g = V$1, k2 = g.child, 22 === g.tag && null !== g.memoizedState ? kk(e) : null !== k2 ? (k2.return = g, V$1 = k2) : kk(e);
        for (; null !== f2; )
          V$1 = f2, jk(f2), f2 = f2.sibling;
        V$1 = e;
        Kj = h;
        U$1 = l2;
      }
      lk(a);
    } else
      0 !== (e.subtreeFlags & 8772) && null !== f2 ? (f2.return = e, V$1 = f2) : lk(a);
  }
}
function lk(a) {
  for (; null !== V$1; ) {
    var b = V$1;
    if (0 !== (b.flags & 8772)) {
      var c = b.alternate;
      try {
        if (0 !== (b.flags & 8772))
          switch (b.tag) {
            case 0:
            case 11:
            case 15:
              U$1 || Rj(5, b);
              break;
            case 1:
              var d = b.stateNode;
              if (b.flags & 4 && !U$1)
                if (null === c)
                  d.componentDidMount();
                else {
                  var e = b.elementType === b.type ? c.memoizedProps : Lg(b.type, c.memoizedProps);
                  d.componentDidUpdate(e, c.memoizedState, d.__reactInternalSnapshotBeforeUpdate);
                }
              var f2 = b.updateQueue;
              null !== f2 && ih(b, f2, d);
              break;
            case 3:
              var g = b.updateQueue;
              if (null !== g) {
                c = null;
                if (null !== b.child)
                  switch (b.child.tag) {
                    case 5:
                      c = b.child.stateNode;
                      break;
                    case 1:
                      c = b.child.stateNode;
                  }
                ih(b, g, c);
              }
              break;
            case 5:
              var h = b.stateNode;
              if (null === c && b.flags & 4) {
                c = h;
                var k2 = b.memoizedProps;
                switch (b.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    k2.autoFocus && c.focus();
                    break;
                  case "img":
                    k2.src && (c.src = k2.src);
                }
              }
              break;
            case 6:
              break;
            case 4:
              break;
            case 12:
              break;
            case 13:
              if (null === b.memoizedState) {
                var l2 = b.alternate;
                if (null !== l2) {
                  var m2 = l2.memoizedState;
                  if (null !== m2) {
                    var q2 = m2.dehydrated;
                    null !== q2 && bd(q2);
                  }
                }
              }
              break;
            case 19:
            case 17:
            case 21:
            case 22:
            case 23:
            case 25:
              break;
            default:
              throw Error(p(163));
          }
        U$1 || b.flags & 512 && Sj(b);
      } catch (r2) {
        W$1(b, b.return, r2);
      }
    }
    if (b === a) {
      V$1 = null;
      break;
    }
    c = b.sibling;
    if (null !== c) {
      c.return = b.return;
      V$1 = c;
      break;
    }
    V$1 = b.return;
  }
}
function hk(a) {
  for (; null !== V$1; ) {
    var b = V$1;
    if (b === a) {
      V$1 = null;
      break;
    }
    var c = b.sibling;
    if (null !== c) {
      c.return = b.return;
      V$1 = c;
      break;
    }
    V$1 = b.return;
  }
}
function kk(a) {
  for (; null !== V$1; ) {
    var b = V$1;
    try {
      switch (b.tag) {
        case 0:
        case 11:
        case 15:
          var c = b.return;
          try {
            Rj(4, b);
          } catch (k2) {
            W$1(b, c, k2);
          }
          break;
        case 1:
          var d = b.stateNode;
          if ("function" === typeof d.componentDidMount) {
            var e = b.return;
            try {
              d.componentDidMount();
            } catch (k2) {
              W$1(b, e, k2);
            }
          }
          var f2 = b.return;
          try {
            Sj(b);
          } catch (k2) {
            W$1(b, f2, k2);
          }
          break;
        case 5:
          var g = b.return;
          try {
            Sj(b);
          } catch (k2) {
            W$1(b, g, k2);
          }
      }
    } catch (k2) {
      W$1(b, b.return, k2);
    }
    if (b === a) {
      V$1 = null;
      break;
    }
    var h = b.sibling;
    if (null !== h) {
      h.return = b.return;
      V$1 = h;
      break;
    }
    V$1 = b.return;
  }
}
var mk = Math.ceil, nk = ua.ReactCurrentDispatcher, ok = ua.ReactCurrentOwner, pk = ua.ReactCurrentBatchConfig, K$1 = 0, R$2 = null, Y$1 = null, Z$1 = 0, gj = 0, fj = Uf(0), T$1 = 0, qk = null, hh = 0, rk = 0, sk = 0, tk = null, uk = null, gk = 0, Hj = Infinity, vk = null, Pi = false, Qi = null, Si = null, wk = false, xk = null, yk = 0, zk = 0, Ak = null, Bk = -1, Ck = 0;
function L$1() {
  return 0 !== (K$1 & 6) ? B$1() : -1 !== Bk ? Bk : Bk = B$1();
}
function lh(a) {
  if (0 === (a.mode & 1))
    return 1;
  if (0 !== (K$1 & 2) && 0 !== Z$1)
    return Z$1 & -Z$1;
  if (null !== Kg.transition)
    return 0 === Ck && (Ck = yc()), Ck;
  a = C$1;
  if (0 !== a)
    return a;
  a = window.event;
  a = void 0 === a ? 16 : jd(a.type);
  return a;
}
function mh(a, b, c, d) {
  if (50 < zk)
    throw zk = 0, Ak = null, Error(p(185));
  Ac(a, c, d);
  if (0 === (K$1 & 2) || a !== R$2)
    a === R$2 && (0 === (K$1 & 2) && (rk |= c), 4 === T$1 && Dk(a, Z$1)), Ek(a, d), 1 === c && 0 === K$1 && 0 === (b.mode & 1) && (Hj = B$1() + 500, fg && jg());
}
function Ek(a, b) {
  var c = a.callbackNode;
  wc(a, b);
  var d = uc(a, a === R$2 ? Z$1 : 0);
  if (0 === d)
    null !== c && bc(c), a.callbackNode = null, a.callbackPriority = 0;
  else if (b = d & -d, a.callbackPriority !== b) {
    null != c && bc(c);
    if (1 === b)
      0 === a.tag ? ig(Fk.bind(null, a)) : hg(Fk.bind(null, a)), Jf(function() {
        0 === (K$1 & 6) && jg();
      }), c = null;
    else {
      switch (Dc(d)) {
        case 1:
          c = fc;
          break;
        case 4:
          c = gc;
          break;
        case 16:
          c = hc;
          break;
        case 536870912:
          c = jc;
          break;
        default:
          c = hc;
      }
      c = Gk(c, Hk.bind(null, a));
    }
    a.callbackPriority = b;
    a.callbackNode = c;
  }
}
function Hk(a, b) {
  Bk = -1;
  Ck = 0;
  if (0 !== (K$1 & 6))
    throw Error(p(327));
  var c = a.callbackNode;
  if (Ik() && a.callbackNode !== c)
    return null;
  var d = uc(a, a === R$2 ? Z$1 : 0);
  if (0 === d)
    return null;
  if (0 !== (d & 30) || 0 !== (d & a.expiredLanes) || b)
    b = Jk(a, d);
  else {
    b = d;
    var e = K$1;
    K$1 |= 2;
    var f2 = Kk();
    if (R$2 !== a || Z$1 !== b)
      vk = null, Hj = B$1() + 500, Lk(a, b);
    do
      try {
        Mk();
        break;
      } catch (h) {
        Nk(a, h);
      }
    while (1);
    Qg();
    nk.current = f2;
    K$1 = e;
    null !== Y$1 ? b = 0 : (R$2 = null, Z$1 = 0, b = T$1);
  }
  if (0 !== b) {
    2 === b && (e = xc(a), 0 !== e && (d = e, b = Ok(a, e)));
    if (1 === b)
      throw c = qk, Lk(a, 0), Dk(a, d), Ek(a, B$1()), c;
    if (6 === b)
      Dk(a, d);
    else {
      e = a.current.alternate;
      if (0 === (d & 30) && !Pk(e) && (b = Jk(a, d), 2 === b && (f2 = xc(a), 0 !== f2 && (d = f2, b = Ok(a, f2))), 1 === b))
        throw c = qk, Lk(a, 0), Dk(a, d), Ek(a, B$1()), c;
      a.finishedWork = e;
      a.finishedLanes = d;
      switch (b) {
        case 0:
        case 1:
          throw Error(p(345));
        case 2:
          Qk(a, uk, vk);
          break;
        case 3:
          Dk(a, d);
          if ((d & 130023424) === d && (b = gk + 500 - B$1(), 10 < b)) {
            if (0 !== uc(a, 0))
              break;
            e = a.suspendedLanes;
            if ((e & d) !== d) {
              L$1();
              a.pingedLanes |= a.suspendedLanes & e;
              break;
            }
            a.timeoutHandle = Ff(Qk.bind(null, a, uk, vk), b);
            break;
          }
          Qk(a, uk, vk);
          break;
        case 4:
          Dk(a, d);
          if ((d & 4194240) === d)
            break;
          b = a.eventTimes;
          for (e = -1; 0 < d; ) {
            var g = 31 - oc(d);
            f2 = 1 << g;
            g = b[g];
            g > e && (e = g);
            d &= ~f2;
          }
          d = e;
          d = B$1() - d;
          d = (120 > d ? 120 : 480 > d ? 480 : 1080 > d ? 1080 : 1920 > d ? 1920 : 3e3 > d ? 3e3 : 4320 > d ? 4320 : 1960 * mk(d / 1960)) - d;
          if (10 < d) {
            a.timeoutHandle = Ff(Qk.bind(null, a, uk, vk), d);
            break;
          }
          Qk(a, uk, vk);
          break;
        case 5:
          Qk(a, uk, vk);
          break;
        default:
          throw Error(p(329));
      }
    }
  }
  Ek(a, B$1());
  return a.callbackNode === c ? Hk.bind(null, a) : null;
}
function Ok(a, b) {
  var c = tk;
  a.current.memoizedState.isDehydrated && (Lk(a, b).flags |= 256);
  a = Jk(a, b);
  2 !== a && (b = uk, uk = c, null !== b && Gj(b));
  return a;
}
function Gj(a) {
  null === uk ? uk = a : uk.push.apply(uk, a);
}
function Pk(a) {
  for (var b = a; ; ) {
    if (b.flags & 16384) {
      var c = b.updateQueue;
      if (null !== c && (c = c.stores, null !== c))
        for (var d = 0; d < c.length; d++) {
          var e = c[d], f2 = e.getSnapshot;
          e = e.value;
          try {
            if (!He$1(f2(), e))
              return false;
          } catch (g) {
            return false;
          }
        }
    }
    c = b.child;
    if (b.subtreeFlags & 16384 && null !== c)
      c.return = b, b = c;
    else {
      if (b === a)
        break;
      for (; null === b.sibling; ) {
        if (null === b.return || b.return === a)
          return true;
        b = b.return;
      }
      b.sibling.return = b.return;
      b = b.sibling;
    }
  }
  return true;
}
function Dk(a, b) {
  b &= ~sk;
  b &= ~rk;
  a.suspendedLanes |= b;
  a.pingedLanes &= ~b;
  for (a = a.expirationTimes; 0 < b; ) {
    var c = 31 - oc(b), d = 1 << c;
    a[c] = -1;
    b &= ~d;
  }
}
function Fk(a) {
  if (0 !== (K$1 & 6))
    throw Error(p(327));
  Ik();
  var b = uc(a, 0);
  if (0 === (b & 1))
    return Ek(a, B$1()), null;
  var c = Jk(a, b);
  if (0 !== a.tag && 2 === c) {
    var d = xc(a);
    0 !== d && (b = d, c = Ok(a, d));
  }
  if (1 === c)
    throw c = qk, Lk(a, 0), Dk(a, b), Ek(a, B$1()), c;
  if (6 === c)
    throw Error(p(345));
  a.finishedWork = a.current.alternate;
  a.finishedLanes = b;
  Qk(a, uk, vk);
  Ek(a, B$1());
  return null;
}
function Rk(a, b) {
  var c = K$1;
  K$1 |= 1;
  try {
    return a(b);
  } finally {
    K$1 = c, 0 === K$1 && (Hj = B$1() + 500, fg && jg());
  }
}
function Sk(a) {
  null !== xk && 0 === xk.tag && 0 === (K$1 & 6) && Ik();
  var b = K$1;
  K$1 |= 1;
  var c = pk.transition, d = C$1;
  try {
    if (pk.transition = null, C$1 = 1, a)
      return a();
  } finally {
    C$1 = d, pk.transition = c, K$1 = b, 0 === (K$1 & 6) && jg();
  }
}
function Ij() {
  gj = fj.current;
  E$1(fj);
}
function Lk(a, b) {
  a.finishedWork = null;
  a.finishedLanes = 0;
  var c = a.timeoutHandle;
  -1 !== c && (a.timeoutHandle = -1, Gf(c));
  if (null !== Y$1)
    for (c = Y$1.return; null !== c; ) {
      var d = c;
      wg(d);
      switch (d.tag) {
        case 1:
          d = d.type.childContextTypes;
          null !== d && void 0 !== d && $f();
          break;
        case 3:
          Jh();
          E$1(Wf);
          E$1(H$1);
          Oh();
          break;
        case 5:
          Lh(d);
          break;
        case 4:
          Jh();
          break;
        case 13:
          E$1(M$1);
          break;
        case 19:
          E$1(M$1);
          break;
        case 10:
          Rg(d.type._context);
          break;
        case 22:
        case 23:
          Ij();
      }
      c = c.return;
    }
  R$2 = a;
  Y$1 = a = wh(a.current, null);
  Z$1 = gj = b;
  T$1 = 0;
  qk = null;
  sk = rk = hh = 0;
  uk = tk = null;
  if (null !== Wg) {
    for (b = 0; b < Wg.length; b++)
      if (c = Wg[b], d = c.interleaved, null !== d) {
        c.interleaved = null;
        var e = d.next, f2 = c.pending;
        if (null !== f2) {
          var g = f2.next;
          f2.next = e;
          d.next = g;
        }
        c.pending = d;
      }
    Wg = null;
  }
  return a;
}
function Nk(a, b) {
  do {
    var c = Y$1;
    try {
      Qg();
      Ph.current = ai;
      if (Sh) {
        for (var d = N$1.memoizedState; null !== d; ) {
          var e = d.queue;
          null !== e && (e.pending = null);
          d = d.next;
        }
        Sh = false;
      }
      Rh = 0;
      P$1 = O$1 = N$1 = null;
      Th = false;
      Uh = 0;
      ok.current = null;
      if (null === c || null === c.return) {
        T$1 = 1;
        qk = b;
        Y$1 = null;
        break;
      }
      a: {
        var f2 = a, g = c.return, h = c, k2 = b;
        b = Z$1;
        h.flags |= 32768;
        if (null !== k2 && "object" === typeof k2 && "function" === typeof k2.then) {
          var l2 = k2, m2 = h, q2 = m2.tag;
          if (0 === (m2.mode & 1) && (0 === q2 || 11 === q2 || 15 === q2)) {
            var r2 = m2.alternate;
            r2 ? (m2.updateQueue = r2.updateQueue, m2.memoizedState = r2.memoizedState, m2.lanes = r2.lanes) : (m2.updateQueue = null, m2.memoizedState = null);
          }
          var y2 = Vi(g);
          if (null !== y2) {
            y2.flags &= -257;
            Wi(y2, g, h, f2, b);
            y2.mode & 1 && Ti(f2, l2, b);
            b = y2;
            k2 = l2;
            var n2 = b.updateQueue;
            if (null === n2) {
              var t2 = /* @__PURE__ */ new Set();
              t2.add(k2);
              b.updateQueue = t2;
            } else
              n2.add(k2);
            break a;
          } else {
            if (0 === (b & 1)) {
              Ti(f2, l2, b);
              uj();
              break a;
            }
            k2 = Error(p(426));
          }
        } else if (I$1 && h.mode & 1) {
          var J2 = Vi(g);
          if (null !== J2) {
            0 === (J2.flags & 65536) && (J2.flags |= 256);
            Wi(J2, g, h, f2, b);
            Jg(Ki(k2, h));
            break a;
          }
        }
        f2 = k2 = Ki(k2, h);
        4 !== T$1 && (T$1 = 2);
        null === tk ? tk = [f2] : tk.push(f2);
        f2 = g;
        do {
          switch (f2.tag) {
            case 3:
              f2.flags |= 65536;
              b &= -b;
              f2.lanes |= b;
              var x2 = Oi(f2, k2, b);
              fh(f2, x2);
              break a;
            case 1:
              h = k2;
              var w2 = f2.type, u2 = f2.stateNode;
              if (0 === (f2.flags & 128) && ("function" === typeof w2.getDerivedStateFromError || null !== u2 && "function" === typeof u2.componentDidCatch && (null === Si || !Si.has(u2)))) {
                f2.flags |= 65536;
                b &= -b;
                f2.lanes |= b;
                var F2 = Ri(f2, h, b);
                fh(f2, F2);
                break a;
              }
          }
          f2 = f2.return;
        } while (null !== f2);
      }
      Tk(c);
    } catch (na) {
      b = na;
      Y$1 === c && null !== c && (Y$1 = c = c.return);
      continue;
    }
    break;
  } while (1);
}
function Kk() {
  var a = nk.current;
  nk.current = ai;
  return null === a ? ai : a;
}
function uj() {
  if (0 === T$1 || 3 === T$1 || 2 === T$1)
    T$1 = 4;
  null === R$2 || 0 === (hh & 268435455) && 0 === (rk & 268435455) || Dk(R$2, Z$1);
}
function Jk(a, b) {
  var c = K$1;
  K$1 |= 2;
  var d = Kk();
  if (R$2 !== a || Z$1 !== b)
    vk = null, Lk(a, b);
  do
    try {
      Uk();
      break;
    } catch (e) {
      Nk(a, e);
    }
  while (1);
  Qg();
  K$1 = c;
  nk.current = d;
  if (null !== Y$1)
    throw Error(p(261));
  R$2 = null;
  Z$1 = 0;
  return T$1;
}
function Uk() {
  for (; null !== Y$1; )
    Vk(Y$1);
}
function Mk() {
  for (; null !== Y$1 && !cc(); )
    Vk(Y$1);
}
function Vk(a) {
  var b = Wk(a.alternate, a, gj);
  a.memoizedProps = a.pendingProps;
  null === b ? Tk(a) : Y$1 = b;
  ok.current = null;
}
function Tk(a) {
  var b = a;
  do {
    var c = b.alternate;
    a = b.return;
    if (0 === (b.flags & 32768)) {
      if (c = Fj(c, b, gj), null !== c) {
        Y$1 = c;
        return;
      }
    } else {
      c = Jj(c, b);
      if (null !== c) {
        c.flags &= 32767;
        Y$1 = c;
        return;
      }
      if (null !== a)
        a.flags |= 32768, a.subtreeFlags = 0, a.deletions = null;
      else {
        T$1 = 6;
        Y$1 = null;
        return;
      }
    }
    b = b.sibling;
    if (null !== b) {
      Y$1 = b;
      return;
    }
    Y$1 = b = a;
  } while (null !== b);
  0 === T$1 && (T$1 = 5);
}
function Qk(a, b, c) {
  var d = C$1, e = pk.transition;
  try {
    pk.transition = null, C$1 = 1, Xk(a, b, c, d);
  } finally {
    pk.transition = e, C$1 = d;
  }
  return null;
}
function Xk(a, b, c, d) {
  do
    Ik();
  while (null !== xk);
  if (0 !== (K$1 & 6))
    throw Error(p(327));
  c = a.finishedWork;
  var e = a.finishedLanes;
  if (null === c)
    return null;
  a.finishedWork = null;
  a.finishedLanes = 0;
  if (c === a.current)
    throw Error(p(177));
  a.callbackNode = null;
  a.callbackPriority = 0;
  var f2 = c.lanes | c.childLanes;
  Bc(a, f2);
  a === R$2 && (Y$1 = R$2 = null, Z$1 = 0);
  0 === (c.subtreeFlags & 2064) && 0 === (c.flags & 2064) || wk || (wk = true, Gk(hc, function() {
    Ik();
    return null;
  }));
  f2 = 0 !== (c.flags & 15990);
  if (0 !== (c.subtreeFlags & 15990) || f2) {
    f2 = pk.transition;
    pk.transition = null;
    var g = C$1;
    C$1 = 1;
    var h = K$1;
    K$1 |= 4;
    ok.current = null;
    Pj(a, c);
    ek(c, a);
    Oe$1(Df);
    dd = !!Cf;
    Df = Cf = null;
    a.current = c;
    ik(c);
    dc();
    K$1 = h;
    C$1 = g;
    pk.transition = f2;
  } else
    a.current = c;
  wk && (wk = false, xk = a, yk = e);
  f2 = a.pendingLanes;
  0 === f2 && (Si = null);
  mc(c.stateNode);
  Ek(a, B$1());
  if (null !== b)
    for (d = a.onRecoverableError, c = 0; c < b.length; c++)
      e = b[c], d(e.value, { componentStack: e.stack, digest: e.digest });
  if (Pi)
    throw Pi = false, a = Qi, Qi = null, a;
  0 !== (yk & 1) && 0 !== a.tag && Ik();
  f2 = a.pendingLanes;
  0 !== (f2 & 1) ? a === Ak ? zk++ : (zk = 0, Ak = a) : zk = 0;
  jg();
  return null;
}
function Ik() {
  if (null !== xk) {
    var a = Dc(yk), b = pk.transition, c = C$1;
    try {
      pk.transition = null;
      C$1 = 16 > a ? 16 : a;
      if (null === xk)
        var d = false;
      else {
        a = xk;
        xk = null;
        yk = 0;
        if (0 !== (K$1 & 6))
          throw Error(p(331));
        var e = K$1;
        K$1 |= 4;
        for (V$1 = a.current; null !== V$1; ) {
          var f2 = V$1, g = f2.child;
          if (0 !== (V$1.flags & 16)) {
            var h = f2.deletions;
            if (null !== h) {
              for (var k2 = 0; k2 < h.length; k2++) {
                var l2 = h[k2];
                for (V$1 = l2; null !== V$1; ) {
                  var m2 = V$1;
                  switch (m2.tag) {
                    case 0:
                    case 11:
                    case 15:
                      Qj(8, m2, f2);
                  }
                  var q2 = m2.child;
                  if (null !== q2)
                    q2.return = m2, V$1 = q2;
                  else
                    for (; null !== V$1; ) {
                      m2 = V$1;
                      var r2 = m2.sibling, y2 = m2.return;
                      Tj(m2);
                      if (m2 === l2) {
                        V$1 = null;
                        break;
                      }
                      if (null !== r2) {
                        r2.return = y2;
                        V$1 = r2;
                        break;
                      }
                      V$1 = y2;
                    }
                }
              }
              var n2 = f2.alternate;
              if (null !== n2) {
                var t2 = n2.child;
                if (null !== t2) {
                  n2.child = null;
                  do {
                    var J2 = t2.sibling;
                    t2.sibling = null;
                    t2 = J2;
                  } while (null !== t2);
                }
              }
              V$1 = f2;
            }
          }
          if (0 !== (f2.subtreeFlags & 2064) && null !== g)
            g.return = f2, V$1 = g;
          else
            b:
              for (; null !== V$1; ) {
                f2 = V$1;
                if (0 !== (f2.flags & 2048))
                  switch (f2.tag) {
                    case 0:
                    case 11:
                    case 15:
                      Qj(9, f2, f2.return);
                  }
                var x2 = f2.sibling;
                if (null !== x2) {
                  x2.return = f2.return;
                  V$1 = x2;
                  break b;
                }
                V$1 = f2.return;
              }
        }
        var w2 = a.current;
        for (V$1 = w2; null !== V$1; ) {
          g = V$1;
          var u2 = g.child;
          if (0 !== (g.subtreeFlags & 2064) && null !== u2)
            u2.return = g, V$1 = u2;
          else
            b:
              for (g = w2; null !== V$1; ) {
                h = V$1;
                if (0 !== (h.flags & 2048))
                  try {
                    switch (h.tag) {
                      case 0:
                      case 11:
                      case 15:
                        Rj(9, h);
                    }
                  } catch (na) {
                    W$1(h, h.return, na);
                  }
                if (h === g) {
                  V$1 = null;
                  break b;
                }
                var F2 = h.sibling;
                if (null !== F2) {
                  F2.return = h.return;
                  V$1 = F2;
                  break b;
                }
                V$1 = h.return;
              }
        }
        K$1 = e;
        jg();
        if (lc && "function" === typeof lc.onPostCommitFiberRoot)
          try {
            lc.onPostCommitFiberRoot(kc, a);
          } catch (na) {
          }
        d = true;
      }
      return d;
    } finally {
      C$1 = c, pk.transition = b;
    }
  }
  return false;
}
function Yk(a, b, c) {
  b = Ki(c, b);
  b = Oi(a, b, 1);
  a = dh(a, b, 1);
  b = L$1();
  null !== a && (Ac(a, 1, b), Ek(a, b));
}
function W$1(a, b, c) {
  if (3 === a.tag)
    Yk(a, a, c);
  else
    for (; null !== b; ) {
      if (3 === b.tag) {
        Yk(b, a, c);
        break;
      } else if (1 === b.tag) {
        var d = b.stateNode;
        if ("function" === typeof b.type.getDerivedStateFromError || "function" === typeof d.componentDidCatch && (null === Si || !Si.has(d))) {
          a = Ki(c, a);
          a = Ri(b, a, 1);
          b = dh(b, a, 1);
          a = L$1();
          null !== b && (Ac(b, 1, a), Ek(b, a));
          break;
        }
      }
      b = b.return;
    }
}
function Ui(a, b, c) {
  var d = a.pingCache;
  null !== d && d.delete(b);
  b = L$1();
  a.pingedLanes |= a.suspendedLanes & c;
  R$2 === a && (Z$1 & c) === c && (4 === T$1 || 3 === T$1 && (Z$1 & 130023424) === Z$1 && 500 > B$1() - gk ? Lk(a, 0) : sk |= c);
  Ek(a, b);
}
function Zk(a, b) {
  0 === b && (0 === (a.mode & 1) ? b = 1 : (b = sc, sc <<= 1, 0 === (sc & 130023424) && (sc = 4194304)));
  var c = L$1();
  a = Zg(a, b);
  null !== a && (Ac(a, b, c), Ek(a, c));
}
function vj(a) {
  var b = a.memoizedState, c = 0;
  null !== b && (c = b.retryLane);
  Zk(a, c);
}
function ck(a, b) {
  var c = 0;
  switch (a.tag) {
    case 13:
      var d = a.stateNode;
      var e = a.memoizedState;
      null !== e && (c = e.retryLane);
      break;
    case 19:
      d = a.stateNode;
      break;
    default:
      throw Error(p(314));
  }
  null !== d && d.delete(b);
  Zk(a, c);
}
var Wk;
Wk = function(a, b, c) {
  if (null !== a)
    if (a.memoizedProps !== b.pendingProps || Wf.current)
      Ug = true;
    else {
      if (0 === (a.lanes & c) && 0 === (b.flags & 128))
        return Ug = false, zj(a, b, c);
      Ug = 0 !== (a.flags & 131072) ? true : false;
    }
  else
    Ug = false, I$1 && 0 !== (b.flags & 1048576) && ug(b, ng, b.index);
  b.lanes = 0;
  switch (b.tag) {
    case 2:
      var d = b.type;
      jj(a, b);
      a = b.pendingProps;
      var e = Yf(b, H$1.current);
      Tg(b, c);
      e = Xh(null, b, d, a, e, c);
      var f2 = bi();
      b.flags |= 1;
      "object" === typeof e && null !== e && "function" === typeof e.render && void 0 === e.$$typeof ? (b.tag = 1, b.memoizedState = null, b.updateQueue = null, Zf(d) ? (f2 = true, cg(b)) : f2 = false, b.memoizedState = null !== e.state && void 0 !== e.state ? e.state : null, ah(b), e.updater = nh, b.stateNode = e, e._reactInternals = b, rh(b, d, a, c), b = kj(null, b, d, true, f2, c)) : (b.tag = 0, I$1 && f2 && vg(b), Yi(null, b, e, c), b = b.child);
      return b;
    case 16:
      d = b.elementType;
      a: {
        jj(a, b);
        a = b.pendingProps;
        e = d._init;
        d = e(d._payload);
        b.type = d;
        e = b.tag = $k(d);
        a = Lg(d, a);
        switch (e) {
          case 0:
            b = dj(null, b, d, a, c);
            break a;
          case 1:
            b = ij(null, b, d, a, c);
            break a;
          case 11:
            b = Zi(null, b, d, a, c);
            break a;
          case 14:
            b = aj(null, b, d, Lg(d.type, a), c);
            break a;
        }
        throw Error(p(
          306,
          d,
          ""
        ));
      }
      return b;
    case 0:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Lg(d, e), dj(a, b, d, e, c);
    case 1:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Lg(d, e), ij(a, b, d, e, c);
    case 3:
      a: {
        lj(b);
        if (null === a)
          throw Error(p(387));
        d = b.pendingProps;
        f2 = b.memoizedState;
        e = f2.element;
        bh(a, b);
        gh(b, d, null, c);
        var g = b.memoizedState;
        d = g.element;
        if (f2.isDehydrated)
          if (f2 = { element: d, isDehydrated: false, cache: g.cache, pendingSuspenseBoundaries: g.pendingSuspenseBoundaries, transitions: g.transitions }, b.updateQueue.baseState = f2, b.memoizedState = f2, b.flags & 256) {
            e = Ki(Error(p(423)), b);
            b = mj(a, b, d, c, e);
            break a;
          } else if (d !== e) {
            e = Ki(Error(p(424)), b);
            b = mj(a, b, d, c, e);
            break a;
          } else
            for (yg = Lf(b.stateNode.containerInfo.firstChild), xg = b, I$1 = true, zg = null, c = Ch(b, null, d, c), b.child = c; c; )
              c.flags = c.flags & -3 | 4096, c = c.sibling;
        else {
          Ig();
          if (d === e) {
            b = $i(a, b, c);
            break a;
          }
          Yi(a, b, d, c);
        }
        b = b.child;
      }
      return b;
    case 5:
      return Kh(b), null === a && Eg(b), d = b.type, e = b.pendingProps, f2 = null !== a ? a.memoizedProps : null, g = e.children, Ef(d, e) ? g = null : null !== f2 && Ef(d, f2) && (b.flags |= 32), hj(a, b), Yi(a, b, g, c), b.child;
    case 6:
      return null === a && Eg(b), null;
    case 13:
      return pj(a, b, c);
    case 4:
      return Ih(b, b.stateNode.containerInfo), d = b.pendingProps, null === a ? b.child = Bh(b, null, d, c) : Yi(a, b, d, c), b.child;
    case 11:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Lg(d, e), Zi(a, b, d, e, c);
    case 7:
      return Yi(a, b, b.pendingProps, c), b.child;
    case 8:
      return Yi(a, b, b.pendingProps.children, c), b.child;
    case 12:
      return Yi(a, b, b.pendingProps.children, c), b.child;
    case 10:
      a: {
        d = b.type._context;
        e = b.pendingProps;
        f2 = b.memoizedProps;
        g = e.value;
        G$1(Mg, d._currentValue);
        d._currentValue = g;
        if (null !== f2)
          if (He$1(f2.value, g)) {
            if (f2.children === e.children && !Wf.current) {
              b = $i(a, b, c);
              break a;
            }
          } else
            for (f2 = b.child, null !== f2 && (f2.return = b); null !== f2; ) {
              var h = f2.dependencies;
              if (null !== h) {
                g = f2.child;
                for (var k2 = h.firstContext; null !== k2; ) {
                  if (k2.context === d) {
                    if (1 === f2.tag) {
                      k2 = ch(-1, c & -c);
                      k2.tag = 2;
                      var l2 = f2.updateQueue;
                      if (null !== l2) {
                        l2 = l2.shared;
                        var m2 = l2.pending;
                        null === m2 ? k2.next = k2 : (k2.next = m2.next, m2.next = k2);
                        l2.pending = k2;
                      }
                    }
                    f2.lanes |= c;
                    k2 = f2.alternate;
                    null !== k2 && (k2.lanes |= c);
                    Sg(
                      f2.return,
                      c,
                      b
                    );
                    h.lanes |= c;
                    break;
                  }
                  k2 = k2.next;
                }
              } else if (10 === f2.tag)
                g = f2.type === b.type ? null : f2.child;
              else if (18 === f2.tag) {
                g = f2.return;
                if (null === g)
                  throw Error(p(341));
                g.lanes |= c;
                h = g.alternate;
                null !== h && (h.lanes |= c);
                Sg(g, c, b);
                g = f2.sibling;
              } else
                g = f2.child;
              if (null !== g)
                g.return = f2;
              else
                for (g = f2; null !== g; ) {
                  if (g === b) {
                    g = null;
                    break;
                  }
                  f2 = g.sibling;
                  if (null !== f2) {
                    f2.return = g.return;
                    g = f2;
                    break;
                  }
                  g = g.return;
                }
              f2 = g;
            }
        Yi(a, b, e.children, c);
        b = b.child;
      }
      return b;
    case 9:
      return e = b.type, d = b.pendingProps.children, Tg(b, c), e = Vg(e), d = d(e), b.flags |= 1, Yi(a, b, d, c), b.child;
    case 14:
      return d = b.type, e = Lg(d, b.pendingProps), e = Lg(d.type, e), aj(a, b, d, e, c);
    case 15:
      return cj(a, b, b.type, b.pendingProps, c);
    case 17:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Lg(d, e), jj(a, b), b.tag = 1, Zf(d) ? (a = true, cg(b)) : a = false, Tg(b, c), ph(b, d, e), rh(b, d, e, c), kj(null, b, d, true, a, c);
    case 19:
      return yj(a, b, c);
    case 22:
      return ej(a, b, c);
  }
  throw Error(p(156, b.tag));
};
function Gk(a, b) {
  return ac(a, b);
}
function al(a, b, c, d) {
  this.tag = a;
  this.key = c;
  this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null;
  this.index = 0;
  this.ref = null;
  this.pendingProps = b;
  this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null;
  this.mode = d;
  this.subtreeFlags = this.flags = 0;
  this.deletions = null;
  this.childLanes = this.lanes = 0;
  this.alternate = null;
}
function Bg(a, b, c, d) {
  return new al(a, b, c, d);
}
function bj(a) {
  a = a.prototype;
  return !(!a || !a.isReactComponent);
}
function $k(a) {
  if ("function" === typeof a)
    return bj(a) ? 1 : 0;
  if (void 0 !== a && null !== a) {
    a = a.$$typeof;
    if (a === Da)
      return 11;
    if (a === Ga)
      return 14;
  }
  return 2;
}
function wh(a, b) {
  var c = a.alternate;
  null === c ? (c = Bg(a.tag, b, a.key, a.mode), c.elementType = a.elementType, c.type = a.type, c.stateNode = a.stateNode, c.alternate = a, a.alternate = c) : (c.pendingProps = b, c.type = a.type, c.flags = 0, c.subtreeFlags = 0, c.deletions = null);
  c.flags = a.flags & 14680064;
  c.childLanes = a.childLanes;
  c.lanes = a.lanes;
  c.child = a.child;
  c.memoizedProps = a.memoizedProps;
  c.memoizedState = a.memoizedState;
  c.updateQueue = a.updateQueue;
  b = a.dependencies;
  c.dependencies = null === b ? null : { lanes: b.lanes, firstContext: b.firstContext };
  c.sibling = a.sibling;
  c.index = a.index;
  c.ref = a.ref;
  return c;
}
function yh(a, b, c, d, e, f2) {
  var g = 2;
  d = a;
  if ("function" === typeof a)
    bj(a) && (g = 1);
  else if ("string" === typeof a)
    g = 5;
  else
    a:
      switch (a) {
        case ya:
          return Ah(c.children, e, f2, b);
        case za:
          g = 8;
          e |= 8;
          break;
        case Aa:
          return a = Bg(12, c, b, e | 2), a.elementType = Aa, a.lanes = f2, a;
        case Ea:
          return a = Bg(13, c, b, e), a.elementType = Ea, a.lanes = f2, a;
        case Fa:
          return a = Bg(19, c, b, e), a.elementType = Fa, a.lanes = f2, a;
        case Ia:
          return qj(c, e, f2, b);
        default:
          if ("object" === typeof a && null !== a)
            switch (a.$$typeof) {
              case Ba:
                g = 10;
                break a;
              case Ca:
                g = 9;
                break a;
              case Da:
                g = 11;
                break a;
              case Ga:
                g = 14;
                break a;
              case Ha:
                g = 16;
                d = null;
                break a;
            }
          throw Error(p(130, null == a ? a : typeof a, ""));
      }
  b = Bg(g, c, b, e);
  b.elementType = a;
  b.type = d;
  b.lanes = f2;
  return b;
}
function Ah(a, b, c, d) {
  a = Bg(7, a, d, b);
  a.lanes = c;
  return a;
}
function qj(a, b, c, d) {
  a = Bg(22, a, d, b);
  a.elementType = Ia;
  a.lanes = c;
  a.stateNode = { isHidden: false };
  return a;
}
function xh(a, b, c) {
  a = Bg(6, a, null, b);
  a.lanes = c;
  return a;
}
function zh(a, b, c) {
  b = Bg(4, null !== a.children ? a.children : [], a.key, b);
  b.lanes = c;
  b.stateNode = { containerInfo: a.containerInfo, pendingChildren: null, implementation: a.implementation };
  return b;
}
function bl(a, b, c, d, e) {
  this.tag = b;
  this.containerInfo = a;
  this.finishedWork = this.pingCache = this.current = this.pendingChildren = null;
  this.timeoutHandle = -1;
  this.callbackNode = this.pendingContext = this.context = null;
  this.callbackPriority = 0;
  this.eventTimes = zc(0);
  this.expirationTimes = zc(-1);
  this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0;
  this.entanglements = zc(0);
  this.identifierPrefix = d;
  this.onRecoverableError = e;
  this.mutableSourceEagerHydrationData = null;
}
function cl(a, b, c, d, e, f2, g, h, k2) {
  a = new bl(a, b, c, h, k2);
  1 === b ? (b = 1, true === f2 && (b |= 8)) : b = 0;
  f2 = Bg(3, null, null, b);
  a.current = f2;
  f2.stateNode = a;
  f2.memoizedState = { element: d, isDehydrated: c, cache: null, transitions: null, pendingSuspenseBoundaries: null };
  ah(f2);
  return a;
}
function dl(a, b, c) {
  var d = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
  return { $$typeof: wa, key: null == d ? null : "" + d, children: a, containerInfo: b, implementation: c };
}
function el(a) {
  if (!a)
    return Vf;
  a = a._reactInternals;
  a: {
    if (Vb(a) !== a || 1 !== a.tag)
      throw Error(p(170));
    var b = a;
    do {
      switch (b.tag) {
        case 3:
          b = b.stateNode.context;
          break a;
        case 1:
          if (Zf(b.type)) {
            b = b.stateNode.__reactInternalMemoizedMergedChildContext;
            break a;
          }
      }
      b = b.return;
    } while (null !== b);
    throw Error(p(171));
  }
  if (1 === a.tag) {
    var c = a.type;
    if (Zf(c))
      return bg(a, c, b);
  }
  return b;
}
function fl(a, b, c, d, e, f2, g, h, k2) {
  a = cl(c, d, true, a, e, f2, g, h, k2);
  a.context = el(null);
  c = a.current;
  d = L$1();
  e = lh(c);
  f2 = ch(d, e);
  f2.callback = void 0 !== b && null !== b ? b : null;
  dh(c, f2, e);
  a.current.lanes = e;
  Ac(a, e, d);
  Ek(a, d);
  return a;
}
function gl(a, b, c, d) {
  var e = b.current, f2 = L$1(), g = lh(e);
  c = el(c);
  null === b.context ? b.context = c : b.pendingContext = c;
  b = ch(f2, g);
  b.payload = { element: a };
  d = void 0 === d ? null : d;
  null !== d && (b.callback = d);
  a = dh(e, b, g);
  null !== a && (mh(a, e, g, f2), eh(a, e, g));
  return g;
}
function hl(a) {
  a = a.current;
  if (!a.child)
    return null;
  switch (a.child.tag) {
    case 5:
      return a.child.stateNode;
    default:
      return a.child.stateNode;
  }
}
function il(a, b) {
  a = a.memoizedState;
  if (null !== a && null !== a.dehydrated) {
    var c = a.retryLane;
    a.retryLane = 0 !== c && c < b ? c : b;
  }
}
function jl(a, b) {
  il(a, b);
  (a = a.alternate) && il(a, b);
}
function kl() {
  return null;
}
var ll = "function" === typeof reportError ? reportError : function(a) {
  console.error(a);
};
function ml(a) {
  this._internalRoot = a;
}
nl.prototype.render = ml.prototype.render = function(a) {
  var b = this._internalRoot;
  if (null === b)
    throw Error(p(409));
  gl(a, b, null, null);
};
nl.prototype.unmount = ml.prototype.unmount = function() {
  var a = this._internalRoot;
  if (null !== a) {
    this._internalRoot = null;
    var b = a.containerInfo;
    Sk(function() {
      gl(null, a, null, null);
    });
    b[uf] = null;
  }
};
function nl(a) {
  this._internalRoot = a;
}
nl.prototype.unstable_scheduleHydration = function(a) {
  if (a) {
    var b = Hc();
    a = { blockedOn: null, target: a, priority: b };
    for (var c = 0; c < Qc.length && 0 !== b && b < Qc[c].priority; c++)
      ;
    Qc.splice(c, 0, a);
    0 === c && Vc(a);
  }
};
function ol(a) {
  return !(!a || 1 !== a.nodeType && 9 !== a.nodeType && 11 !== a.nodeType);
}
function pl(a) {
  return !(!a || 1 !== a.nodeType && 9 !== a.nodeType && 11 !== a.nodeType && (8 !== a.nodeType || " react-mount-point-unstable " !== a.nodeValue));
}
function ql() {
}
function rl(a, b, c, d, e) {
  if (e) {
    if ("function" === typeof d) {
      var f2 = d;
      d = function() {
        var a2 = hl(g);
        f2.call(a2);
      };
    }
    var g = fl(b, d, a, 0, null, false, false, "", ql);
    a._reactRootContainer = g;
    a[uf] = g.current;
    sf(8 === a.nodeType ? a.parentNode : a);
    Sk();
    return g;
  }
  for (; e = a.lastChild; )
    a.removeChild(e);
  if ("function" === typeof d) {
    var h = d;
    d = function() {
      var a2 = hl(k2);
      h.call(a2);
    };
  }
  var k2 = cl(a, 0, false, null, null, false, false, "", ql);
  a._reactRootContainer = k2;
  a[uf] = k2.current;
  sf(8 === a.nodeType ? a.parentNode : a);
  Sk(function() {
    gl(b, k2, c, d);
  });
  return k2;
}
function sl(a, b, c, d, e) {
  var f2 = c._reactRootContainer;
  if (f2) {
    var g = f2;
    if ("function" === typeof e) {
      var h = e;
      e = function() {
        var a2 = hl(g);
        h.call(a2);
      };
    }
    gl(b, g, a, e);
  } else
    g = rl(c, b, a, e, d);
  return hl(g);
}
Ec = function(a) {
  switch (a.tag) {
    case 3:
      var b = a.stateNode;
      if (b.current.memoizedState.isDehydrated) {
        var c = tc(b.pendingLanes);
        0 !== c && (Cc(b, c | 1), Ek(b, B$1()), 0 === (K$1 & 6) && (Hj = B$1() + 500, jg()));
      }
      break;
    case 13:
      Sk(function() {
        var b2 = Zg(a, 1);
        if (null !== b2) {
          var c2 = L$1();
          mh(b2, a, 1, c2);
        }
      }), jl(a, 1);
  }
};
Fc = function(a) {
  if (13 === a.tag) {
    var b = Zg(a, 134217728);
    if (null !== b) {
      var c = L$1();
      mh(b, a, 134217728, c);
    }
    jl(a, 134217728);
  }
};
Gc = function(a) {
  if (13 === a.tag) {
    var b = lh(a), c = Zg(a, b);
    if (null !== c) {
      var d = L$1();
      mh(c, a, b, d);
    }
    jl(a, b);
  }
};
Hc = function() {
  return C$1;
};
Ic = function(a, b) {
  var c = C$1;
  try {
    return C$1 = a, b();
  } finally {
    C$1 = c;
  }
};
yb = function(a, b, c) {
  switch (b) {
    case "input":
      bb(a, c);
      b = c.name;
      if ("radio" === c.type && null != b) {
        for (c = a; c.parentNode; )
          c = c.parentNode;
        c = c.querySelectorAll("input[name=" + JSON.stringify("" + b) + '][type="radio"]');
        for (b = 0; b < c.length; b++) {
          var d = c[b];
          if (d !== a && d.form === a.form) {
            var e = Db(d);
            if (!e)
              throw Error(p(90));
            Wa(d);
            bb(d, e);
          }
        }
      }
      break;
    case "textarea":
      ib(a, c);
      break;
    case "select":
      b = c.value, null != b && fb(a, !!c.multiple, b, false);
  }
};
Gb = Rk;
Hb = Sk;
var tl = { usingClientEntryPoint: false, Events: [Cb, ue$1, Db, Eb, Fb, Rk] }, ul = { findFiberByHostInstance: Wc, bundleType: 0, version: "18.2.0", rendererPackageName: "react-dom" };
var vl = { bundleType: ul.bundleType, version: ul.version, rendererPackageName: ul.rendererPackageName, rendererConfig: ul.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: ua.ReactCurrentDispatcher, findHostInstanceByFiber: function(a) {
  a = Zb(a);
  return null === a ? null : a.stateNode;
}, findFiberByHostInstance: ul.findFiberByHostInstance || kl, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.2.0-next-9e3b772b8-20220608" };
if ("undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__) {
  var wl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (!wl.isDisabled && wl.supportsFiber)
    try {
      kc = wl.inject(vl), lc = wl;
    } catch (a) {
    }
}
reactDom_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = tl;
reactDom_production_min.createPortal = function(a, b) {
  var c = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
  if (!ol(b))
    throw Error(p(200));
  return dl(a, b, null, c);
};
reactDom_production_min.createRoot = function(a, b) {
  if (!ol(a))
    throw Error(p(299));
  var c = false, d = "", e = ll;
  null !== b && void 0 !== b && (true === b.unstable_strictMode && (c = true), void 0 !== b.identifierPrefix && (d = b.identifierPrefix), void 0 !== b.onRecoverableError && (e = b.onRecoverableError));
  b = cl(a, 1, false, null, null, c, false, d, e);
  a[uf] = b.current;
  sf(8 === a.nodeType ? a.parentNode : a);
  return new ml(b);
};
reactDom_production_min.findDOMNode = function(a) {
  if (null == a)
    return null;
  if (1 === a.nodeType)
    return a;
  var b = a._reactInternals;
  if (void 0 === b) {
    if ("function" === typeof a.render)
      throw Error(p(188));
    a = Object.keys(a).join(",");
    throw Error(p(268, a));
  }
  a = Zb(b);
  a = null === a ? null : a.stateNode;
  return a;
};
reactDom_production_min.flushSync = function(a) {
  return Sk(a);
};
reactDom_production_min.hydrate = function(a, b, c) {
  if (!pl(b))
    throw Error(p(200));
  return sl(null, a, b, true, c);
};
reactDom_production_min.hydrateRoot = function(a, b, c) {
  if (!ol(a))
    throw Error(p(405));
  var d = null != c && c.hydratedSources || null, e = false, f2 = "", g = ll;
  null !== c && void 0 !== c && (true === c.unstable_strictMode && (e = true), void 0 !== c.identifierPrefix && (f2 = c.identifierPrefix), void 0 !== c.onRecoverableError && (g = c.onRecoverableError));
  b = fl(b, null, a, 1, null != c ? c : null, e, false, f2, g);
  a[uf] = b.current;
  sf(a);
  if (d)
    for (a = 0; a < d.length; a++)
      c = d[a], e = c._getVersion, e = e(c._source), null == b.mutableSourceEagerHydrationData ? b.mutableSourceEagerHydrationData = [c, e] : b.mutableSourceEagerHydrationData.push(
        c,
        e
      );
  return new nl(b);
};
reactDom_production_min.render = function(a, b, c) {
  if (!pl(b))
    throw Error(p(200));
  return sl(null, a, b, false, c);
};
reactDom_production_min.unmountComponentAtNode = function(a) {
  if (!pl(a))
    throw Error(p(40));
  return a._reactRootContainer ? (Sk(function() {
    sl(null, null, a, false, function() {
      a._reactRootContainer = null;
      a[uf] = null;
    });
  }), true) : false;
};
reactDom_production_min.unstable_batchedUpdates = Rk;
reactDom_production_min.unstable_renderSubtreeIntoContainer = function(a, b, c, d) {
  if (!pl(c))
    throw Error(p(200));
  if (null == a || void 0 === a._reactInternals)
    throw Error(p(38));
  return sl(a, b, c, false, d);
};
reactDom_production_min.version = "18.2.0-next-9e3b772b8-20220608";
function checkDCE() {
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") {
    return;
  }
  try {
    __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
  } catch (err) {
    console.error(err);
  }
}
{
  checkDCE();
  reactDom.exports = reactDom_production_min;
}
var reactDomExports = reactDom.exports;
const ReactDOM = /* @__PURE__ */ getDefaultExportFromCjs(reactDomExports);
var createRoot;
var m = reactDomExports;
{
  createRoot = m.createRoot;
  m.hydrateRoot;
}
const app = "";
let AppContext = React.createContext({
  on: (eventName, eventHandler) => {
  },
  off: (eventName, eventHandler) => {
  },
  refresh: () => {
  },
  selectTarget: (targetId) => {
  },
  highlightTarget: (targetId) => {
  },
  unhighlightTarget: (targetId) => {
  },
  sendMessageToTarget: (msg) => {
  },
  getNavWidth: () => 0,
  setNavWidth: () => {
  },
  setLatestSeenChangelogVersion: () => {
  },
  getLatestSeenChangelogVersion: () => "",
  execCommand: () => {
  },
  hasSubscriptionExpired: () => false,
  hasAuthToken: () => false,
  hasFinishedSetup: () => false,
  isDebuggingEnabled: () => true,
  shouldShowDoctor: () => false,
  shouldShowSessionOverview: () => false,
  showContextMenuAtPoint: (msg) => {
  }
});
function _extends$3() {
  _extends$3 = Object.assign || function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends$3.apply(this, arguments);
}
function _objectWithoutPropertiesLoose$1(source, excluded) {
  if (source == null)
    return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0)
      continue;
    target[key] = source[key];
  }
  return target;
}
var isSSR = typeof window === "undefined";
var removeUndefined = function removeUndefined2(obj) {
  Object.keys(obj).forEach(function(key) {
    if (obj[key] && typeof obj[key] === "object")
      removeUndefined2(obj[key]);
    else if (obj[key] === void 0)
      delete obj[key];
  });
  return obj;
};
var IntercomAPI = function IntercomAPI2(method) {
  if (!isSSR && window.Intercom) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }
    return window.Intercom.apply(null, [method].concat(args));
  }
};
var IntercomContext = /* @__PURE__ */ reactExports.createContext(void 0);
var initialize = function initialize2(appId, timeout) {
  if (timeout === void 0) {
    timeout = 0;
  }
  var w2 = window;
  var ic2 = w2.Intercom;
  if (typeof ic2 === "function") {
    ic2("reattach_activator");
    ic2("update", w2.intercomSettings);
  } else {
    var d = document;
    var i = function i2() {
      i2.c(arguments);
    };
    i.q = [];
    i.c = function(args) {
      i.q.push(args);
    };
    w2.Intercom = i;
    var l2 = function l3() {
      setTimeout(function() {
        var s = d.createElement("script");
        s.type = "text/javascript";
        s.async = true;
        s.src = "https://widget.intercom.io/widget/" + appId;
        var x2 = d.getElementsByTagName("script")[0];
        x2.parentNode.insertBefore(s, x2);
      }, timeout);
    };
    if (document.readyState === "complete") {
      l2();
    } else if (w2.attachEvent) {
      w2.attachEvent("onload", l2);
    } else {
      w2.addEventListener("load", l2, false);
    }
  }
};
var mapMessengerAttributesToRawMessengerAttributes = function mapMessengerAttributesToRawMessengerAttributes2(attributes) {
  return {
    custom_launcher_selector: attributes.customLauncherSelector,
    alignment: attributes.alignment,
    vertical_padding: attributes.verticalPadding,
    horizontal_padding: attributes.horizontalPadding,
    hide_default_launcher: attributes.hideDefaultLauncher,
    session_duration: attributes.sessionDuration,
    action_color: attributes.actionColor,
    background_color: attributes.backgroundColor
  };
};
var mapDataAttributesCompanyToRawDataAttributesCompany = function mapDataAttributesCompanyToRawDataAttributesCompany2(attributes) {
  return _extends$3({
    company_id: attributes.companyId,
    name: attributes.name,
    created_at: attributes.createdAt,
    plan: attributes.plan,
    monthly_spend: attributes.monthlySpend,
    user_count: attributes.userCount,
    size: attributes.size,
    website: attributes.website,
    industry: attributes.industry
  }, attributes.customAttributes);
};
var mapDataAttributesAvatarToRawDataAttributesAvatar = function mapDataAttributesAvatarToRawDataAttributesAvatar2(attributes) {
  return {
    type: attributes.type,
    image_url: attributes.imageUrl
  };
};
var mapDataAttributesToRawDataAttributes = function mapDataAttributesToRawDataAttributes2(attributes) {
  var _attributes$companies;
  return _extends$3({
    email: attributes.email,
    user_id: attributes.userId,
    created_at: attributes.createdAt,
    name: attributes.name,
    phone: attributes.phone,
    last_request_at: attributes.lastRequestAt,
    unsubscribed_from_emails: attributes.unsubscribedFromEmails,
    language_override: attributes.languageOverride,
    utm_campaign: attributes.utmCampaign,
    utm_content: attributes.utmContent,
    utm_medium: attributes.utmMedium,
    utm_source: attributes.utmSource,
    utm_term: attributes.utmTerm,
    avatar: attributes.avatar && mapDataAttributesAvatarToRawDataAttributesAvatar(attributes.avatar),
    user_hash: attributes.userHash,
    company: attributes.company && mapDataAttributesCompanyToRawDataAttributesCompany(attributes.company),
    companies: (_attributes$companies = attributes.companies) == null ? void 0 : _attributes$companies.map(mapDataAttributesCompanyToRawDataAttributesCompany)
  }, attributes.customAttributes);
};
var mapIntercomPropsToRawIntercomProps = function mapIntercomPropsToRawIntercomProps2(props) {
  return removeUndefined(_extends$3({}, mapMessengerAttributesToRawMessengerAttributes(props), mapDataAttributesToRawDataAttributes(props)));
};
var IntercomProvider = function IntercomProvider2(_ref) {
  var appId = _ref.appId, _ref$autoBoot = _ref.autoBoot, autoBoot = _ref$autoBoot === void 0 ? false : _ref$autoBoot, autoBootProps = _ref.autoBootProps, children = _ref.children, onHide = _ref.onHide, onShow = _ref.onShow, onUnreadCountChange = _ref.onUnreadCountChange, _ref$shouldInitialize = _ref.shouldInitialize, shouldInitialize = _ref$shouldInitialize === void 0 ? !isSSR : _ref$shouldInitialize, apiBase = _ref.apiBase, initializeDelay = _ref.initializeDelay;
  _objectWithoutPropertiesLoose$1(_ref, ["appId", "autoBoot", "autoBootProps", "children", "onHide", "onShow", "onUnreadCountChange", "shouldInitialize", "apiBase", "initializeDelay"]);
  var isBooted = reactExports.useRef(false);
  var isInitialized = reactExports.useRef(false);
  var boot = reactExports.useCallback(function(props) {
    if (!window.Intercom && !shouldInitialize) {
      return;
    }
    if (isBooted.current) {
      return;
    }
    var metaData = _extends$3({
      app_id: appId
    }, apiBase && {
      api_base: apiBase
    }, props && mapIntercomPropsToRawIntercomProps(props));
    window.intercomSettings = metaData;
    IntercomAPI("boot", metaData);
    isBooted.current = true;
  }, [apiBase, appId, shouldInitialize]);
  if (!isSSR && shouldInitialize && !isInitialized.current) {
    initialize(appId, initializeDelay);
    if (onHide)
      IntercomAPI("onHide", onHide);
    if (onShow)
      IntercomAPI("onShow", onShow);
    if (onUnreadCountChange)
      IntercomAPI("onUnreadCountChange", onUnreadCountChange);
    if (autoBoot) {
      boot(autoBootProps);
    }
    isInitialized.current = true;
  }
  var ensureIntercom = reactExports.useCallback(function(functionName, callback) {
    if (!window.Intercom && !shouldInitialize) {
      return;
    }
    if (!isBooted.current) {
      return;
    }
    return callback();
  }, [shouldInitialize]);
  var shutdown = reactExports.useCallback(function() {
    if (!isBooted.current)
      return;
    IntercomAPI("shutdown");
    isBooted.current = false;
  }, []);
  var hardShutdown = reactExports.useCallback(function() {
    if (!isBooted.current)
      return;
    IntercomAPI("shutdown");
    delete window.Intercom;
    delete window.intercomSettings;
    isBooted.current = false;
  }, []);
  var refresh = reactExports.useCallback(function() {
    ensureIntercom("update", function() {
      var lastRequestedAt = (/* @__PURE__ */ new Date()).getTime();
      IntercomAPI("update", {
        last_requested_at: lastRequestedAt
      });
    });
  }, [ensureIntercom]);
  var update = reactExports.useCallback(function(props) {
    ensureIntercom("update", function() {
      if (!props) {
        refresh();
        return;
      }
      var rawProps = mapIntercomPropsToRawIntercomProps(props);
      window.intercomSettings = _extends$3({}, window.intercomSettings, rawProps);
      IntercomAPI("update", rawProps);
    });
  }, [ensureIntercom, refresh]);
  var hide = reactExports.useCallback(function() {
    ensureIntercom("hide", function() {
      IntercomAPI("hide");
    });
  }, [ensureIntercom]);
  var show = reactExports.useCallback(function() {
    ensureIntercom("show", function() {
      return IntercomAPI("show");
    });
  }, [ensureIntercom]);
  var showMessages = reactExports.useCallback(function() {
    ensureIntercom("showMessages", function() {
      IntercomAPI("showMessages");
    });
  }, [ensureIntercom]);
  var showNewMessages = reactExports.useCallback(function(message) {
    ensureIntercom("showNewMessage", function() {
      if (!message) {
        IntercomAPI("showNewMessage");
      } else {
        IntercomAPI("showNewMessage", message);
      }
    });
  }, [ensureIntercom]);
  var getVisitorId = reactExports.useCallback(function() {
    return ensureIntercom("getVisitorId", function() {
      return IntercomAPI("getVisitorId");
    });
  }, [ensureIntercom]);
  var startTour = reactExports.useCallback(function(tourId) {
    ensureIntercom("startTour", function() {
      IntercomAPI("startTour", tourId);
    });
  }, [ensureIntercom]);
  var trackEvent = reactExports.useCallback(function(event, metaData) {
    ensureIntercom("trackEvent", function() {
      if (metaData) {
        IntercomAPI("trackEvent", event, metaData);
      } else {
        IntercomAPI("trackEvent", event);
      }
    });
  }, [ensureIntercom]);
  var showArticle = reactExports.useCallback(function(articleId) {
    return ensureIntercom("showArticle", function() {
      IntercomAPI("showArticle", articleId);
    });
  }, [ensureIntercom]);
  var providerValue = reactExports.useMemo(function() {
    return {
      boot,
      shutdown,
      hardShutdown,
      update,
      hide,
      show,
      showMessages,
      showNewMessages,
      getVisitorId,
      startTour,
      trackEvent,
      showArticle
    };
  }, [boot, shutdown, hardShutdown, update, hide, show, showMessages, showNewMessages, getVisitorId, startTour, trackEvent, showArticle]);
  return reactExports.createElement(IntercomContext.Provider, {
    value: providerValue
  }, children);
};
var useIntercomContext = function useIntercomContext2() {
  var context = reactExports.useContext(IntercomContext);
  return context;
};
var useIntercom = function useIntercom2() {
  return useIntercomContext();
};
var events = { exports: {} };
var R$1 = typeof Reflect === "object" ? Reflect : null;
var ReflectApply = R$1 && typeof R$1.apply === "function" ? R$1.apply : function ReflectApply2(target, receiver, args) {
  return Function.prototype.apply.call(target, receiver, args);
};
var ReflectOwnKeys;
if (R$1 && typeof R$1.ownKeys === "function") {
  ReflectOwnKeys = R$1.ownKeys;
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys2(target) {
    return Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys2(target) {
    return Object.getOwnPropertyNames(target);
  };
}
function ProcessEmitWarning(warning) {
  if (console && console.warn)
    console.warn(warning);
}
var NumberIsNaN = Number.isNaN || function NumberIsNaN2(value) {
  return value !== value;
};
function EventEmitter() {
  EventEmitter.init.call(this);
}
events.exports = EventEmitter;
events.exports.once = once2;
EventEmitter.EventEmitter = EventEmitter;
EventEmitter.prototype._events = void 0;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = void 0;
var defaultMaxListeners = 10;
function checkListener(listener) {
  if (typeof listener !== "function") {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
}
Object.defineProperty(EventEmitter, "defaultMaxListeners", {
  enumerable: true,
  get: function() {
    return defaultMaxListeners;
  },
  set: function(arg) {
    if (typeof arg !== "number" || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + ".");
    }
    defaultMaxListeners = arg;
  }
});
EventEmitter.init = function() {
  if (this._events === void 0 || this._events === Object.getPrototypeOf(this)._events) {
    this._events = /* @__PURE__ */ Object.create(null);
    this._eventsCount = 0;
  }
  this._maxListeners = this._maxListeners || void 0;
};
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n2) {
  if (typeof n2 !== "number" || n2 < 0 || NumberIsNaN(n2)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n2 + ".");
  }
  this._maxListeners = n2;
  return this;
};
function _getMaxListeners(that) {
  if (that._maxListeners === void 0)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}
EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};
EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++)
    args.push(arguments[i]);
  var doError = type === "error";
  var events2 = this._events;
  if (events2 !== void 0)
    doError = doError && events2.error === void 0;
  else if (!doError)
    return false;
  if (doError) {
    var er;
    if (args.length > 0)
      er = args[0];
    if (er instanceof Error) {
      throw er;
    }
    var err = new Error("Unhandled error." + (er ? " (" + er.message + ")" : ""));
    err.context = er;
    throw err;
  }
  var handler = events2[type];
  if (handler === void 0)
    return false;
  if (typeof handler === "function") {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners2 = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      ReflectApply(listeners2[i], this, args);
  }
  return true;
};
function _addListener(target, type, listener, prepend) {
  var m2;
  var events2;
  var existing;
  checkListener(listener);
  events2 = target._events;
  if (events2 === void 0) {
    events2 = target._events = /* @__PURE__ */ Object.create(null);
    target._eventsCount = 0;
  } else {
    if (events2.newListener !== void 0) {
      target.emit(
        "newListener",
        type,
        listener.listener ? listener.listener : listener
      );
      events2 = target._events;
    }
    existing = events2[type];
  }
  if (existing === void 0) {
    existing = events2[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === "function") {
      existing = events2[type] = prepend ? [listener, existing] : [existing, listener];
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }
    m2 = _getMaxListeners(target);
    if (m2 > 0 && existing.length > m2 && !existing.warned) {
      existing.warned = true;
      var w2 = new Error("Possible EventEmitter memory leak detected. " + existing.length + " " + String(type) + " listeners added. Use emitter.setMaxListeners() to increase limit");
      w2.name = "MaxListenersExceededWarning";
      w2.emitter = target;
      w2.type = type;
      w2.count = existing.length;
      ProcessEmitWarning(w2);
    }
  }
  return target;
}
EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};
EventEmitter.prototype.on = EventEmitter.prototype.addListener;
EventEmitter.prototype.prependListener = function prependListener(type, listener) {
  return _addListener(this, type, listener, true);
};
function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0)
      return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}
function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: void 0, target, type, listener };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}
EventEmitter.prototype.once = function once(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};
EventEmitter.prototype.prependOnceListener = function prependOnceListener(type, listener) {
  checkListener(listener);
  this.prependListener(type, _onceWrap(this, type, listener));
  return this;
};
EventEmitter.prototype.removeListener = function removeListener(type, listener) {
  var list, events2, position2, i, originalListener;
  checkListener(listener);
  events2 = this._events;
  if (events2 === void 0)
    return this;
  list = events2[type];
  if (list === void 0)
    return this;
  if (list === listener || list.listener === listener) {
    if (--this._eventsCount === 0)
      this._events = /* @__PURE__ */ Object.create(null);
    else {
      delete events2[type];
      if (events2.removeListener)
        this.emit("removeListener", type, list.listener || listener);
    }
  } else if (typeof list !== "function") {
    position2 = -1;
    for (i = list.length - 1; i >= 0; i--) {
      if (list[i] === listener || list[i].listener === listener) {
        originalListener = list[i].listener;
        position2 = i;
        break;
      }
    }
    if (position2 < 0)
      return this;
    if (position2 === 0)
      list.shift();
    else {
      spliceOne$1(list, position2);
    }
    if (list.length === 1)
      events2[type] = list[0];
    if (events2.removeListener !== void 0)
      this.emit("removeListener", type, originalListener || listener);
  }
  return this;
};
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.removeAllListeners = function removeAllListeners(type) {
  var listeners2, events2, i;
  events2 = this._events;
  if (events2 === void 0)
    return this;
  if (events2.removeListener === void 0) {
    if (arguments.length === 0) {
      this._events = /* @__PURE__ */ Object.create(null);
      this._eventsCount = 0;
    } else if (events2[type] !== void 0) {
      if (--this._eventsCount === 0)
        this._events = /* @__PURE__ */ Object.create(null);
      else
        delete events2[type];
    }
    return this;
  }
  if (arguments.length === 0) {
    var keys = Object.keys(events2);
    var key;
    for (i = 0; i < keys.length; ++i) {
      key = keys[i];
      if (key === "removeListener")
        continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners("removeListener");
    this._events = /* @__PURE__ */ Object.create(null);
    this._eventsCount = 0;
    return this;
  }
  listeners2 = events2[type];
  if (typeof listeners2 === "function") {
    this.removeListener(type, listeners2);
  } else if (listeners2 !== void 0) {
    for (i = listeners2.length - 1; i >= 0; i--) {
      this.removeListener(type, listeners2[i]);
    }
  }
  return this;
};
function _listeners(target, type, unwrap) {
  var events2 = target._events;
  if (events2 === void 0)
    return [];
  var evlistener = events2[type];
  if (evlistener === void 0)
    return [];
  if (typeof evlistener === "function")
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];
  return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}
EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};
EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};
EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === "function") {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};
EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events2 = this._events;
  if (events2 !== void 0) {
    var evlistener = events2[type];
    if (typeof evlistener === "function") {
      return 1;
    } else if (evlistener !== void 0) {
      return evlistener.length;
    }
  }
  return 0;
}
EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};
function arrayClone(arr, n2) {
  var copy2 = new Array(n2);
  for (var i = 0; i < n2; ++i)
    copy2[i] = arr[i];
  return copy2;
}
function spliceOne$1(list, index) {
  for (; index + 1 < list.length; index++)
    list[index] = list[index + 1];
  list.pop();
}
function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}
function once2(emitter, name) {
  return new Promise(function(resolve, reject) {
    function errorListener(err) {
      emitter.removeListener(name, resolver);
      reject(err);
    }
    function resolver() {
      if (typeof emitter.removeListener === "function") {
        emitter.removeListener("error", errorListener);
      }
      resolve([].slice.call(arguments));
    }
    eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
    if (name !== "error") {
      addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
    }
  });
}
function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
  if (typeof emitter.on === "function") {
    eventTargetAgnosticAddListener(emitter, "error", handler, flags);
  }
}
function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
  if (typeof emitter.on === "function") {
    if (flags.once) {
      emitter.once(name, listener);
    } else {
      emitter.on(name, listener);
    }
  } else if (typeof emitter.addEventListener === "function") {
    emitter.addEventListener(name, function wrapListener(arg) {
      if (flags.once) {
        emitter.removeEventListener(name, wrapListener);
      }
      listener(arg);
    });
  } else {
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
  }
}
var eventsExports = events.exports;
var renderer$1 = { exports: {} };
var scope = scopeFactory$1;
function scopeFactory$1(logger2) {
  return Object.defineProperties(scope2, {
    defaultLabel: { value: "", writable: true },
    labelPadding: { value: true, writable: true },
    maxLabelLength: { value: 0, writable: true },
    labelLength: {
      get() {
        switch (typeof scope2.labelPadding) {
          case "boolean":
            return scope2.labelPadding ? scope2.maxLabelLength : 0;
          case "number":
            return scope2.labelPadding;
          default:
            return 0;
        }
      }
    }
  });
  function scope2(label) {
    scope2.maxLabelLength = Math.max(scope2.maxLabelLength, label.length);
    const newScope = {};
    for (const level of [...logger2.levels, "log"]) {
      newScope[level] = (...d) => logger2.logData(d, { level, scope: label });
    }
    return newScope;
  }
}
const scopeFactory = scope;
class Logger {
  static instances = {};
  errorHandler = null;
  eventLogger = null;
  functions = {};
  hooks = [];
  isDev = false;
  levels = null;
  logId = null;
  scope = null;
  transports = {};
  variables = {};
  constructor({
    allowUnknownLevel = false,
    errorHandler,
    eventLogger,
    initializeFn,
    isDev = false,
    levels = ["error", "warn", "info", "verbose", "debug", "silly"],
    logId,
    transportFactories = {},
    variables
  } = {}) {
    this.addLevel = this.addLevel.bind(this);
    this.create = this.create.bind(this);
    this.logData = this.logData.bind(this);
    this.processMessage = this.processMessage.bind(this);
    this.allowUnknownLevel = allowUnknownLevel;
    this.initializeFn = initializeFn;
    this.isDev = isDev;
    this.levels = levels;
    this.logId = logId;
    this.transportFactories = transportFactories;
    this.variables = variables || {};
    this.scope = scopeFactory(this);
    this.addLevel("log", false);
    for (const name of this.levels) {
      this.addLevel(name, false);
    }
    this.errorHandler = errorHandler;
    errorHandler?.setOptions({ logFn: this.error });
    this.eventLogger = eventLogger;
    eventLogger?.setOptions({ logger: this });
    for (const [name, factory] of Object.entries(transportFactories)) {
      this.transports[name] = factory(this);
    }
    Logger.instances[logId] = this;
  }
  static getInstance({ logId }) {
    return this.instances[logId] || this.instances.default;
  }
  addLevel(level, index = this.levels.length) {
    if (index !== false) {
      this.levels.splice(index, 0, level);
    }
    this[level] = (...args) => this.logData(args, { level });
    this.functions[level] = this[level];
  }
  catchErrors(options) {
    this.processMessage(
      {
        data: ["log.catchErrors is deprecated. Use log.errorHandler instead"],
        level: "warn"
      },
      { transports: ["console"] }
    );
    return this.errorHandler.startCatching(options);
  }
  create(options) {
    if (typeof options === "string") {
      options = { logId: options };
    }
    return new Logger({
      ...options,
      errorHandler: this.errorHandler,
      initializeFn: this.initializeFn,
      isDev: this.isDev,
      transportFactories: this.transportFactories,
      variables: { ...this.variables }
    });
  }
  compareLevels(passLevel, checkLevel, levels = this.levels) {
    const pass = levels.indexOf(passLevel);
    const check = levels.indexOf(checkLevel);
    if (check === -1 || pass === -1) {
      return true;
    }
    return check <= pass;
  }
  initialize(options = {}) {
    this.initializeFn({ logger: this, ...options });
  }
  logData(data, options = {}) {
    this.processMessage({ data, ...options });
  }
  processMessage(message, { transports = this.transports } = {}) {
    if (message.cmd === "errorHandler") {
      this.errorHandler.handle(message.error, {
        errorName: message.errorName,
        processType: "renderer",
        showDialog: Boolean(message.showDialog)
      });
      return;
    }
    let level = message.level;
    if (!this.allowUnknownLevel) {
      level = this.levels.includes(message.level) ? message.level : "info";
    }
    const normalizedMessage = {
      date: /* @__PURE__ */ new Date(),
      ...message,
      level,
      variables: {
        ...this.variables,
        ...message.variables
      }
    };
    for (const [transName, transFn] of this.transportEntries(transports)) {
      if (typeof transFn !== "function" || transFn.level === false) {
        continue;
      }
      if (!this.compareLevels(transFn.level, message.level)) {
        continue;
      }
      try {
        const transformedMsg = this.hooks.reduce((msg, hook) => {
          return msg ? hook(msg, transFn, transName) : msg;
        }, normalizedMessage);
        if (transformedMsg) {
          transFn({ ...transformedMsg, data: [...transformedMsg.data] });
        }
      } catch (e) {
        this.processInternalErrorFn(e);
      }
    }
  }
  processInternalErrorFn(_e2) {
  }
  transportEntries(transports = this.transports) {
    const transportArray = Array.isArray(transports) ? transports : Object.entries(transports);
    return transportArray.map((item) => {
      switch (typeof item) {
        case "string":
          return this.transports[item] ? [item, this.transports[item]] : null;
        case "function":
          return [item.name, item];
        default:
          return Array.isArray(item) ? item : null;
      }
    }).filter(Boolean);
  }
}
var Logger_1 = Logger;
const consoleError = console.error;
class RendererErrorHandler {
  logFn = null;
  onError = null;
  showDialog = false;
  preventDefault = true;
  constructor({ logFn = null } = {}) {
    this.handleError = this.handleError.bind(this);
    this.handleRejection = this.handleRejection.bind(this);
    this.startCatching = this.startCatching.bind(this);
    this.logFn = logFn;
  }
  handle(error, {
    logFn = this.logFn,
    errorName = "",
    onError = this.onError,
    showDialog = this.showDialog
  } = {}) {
    try {
      if (onError?.({ error, errorName, processType: "renderer" }) !== false) {
        logFn({ error, errorName, showDialog });
      }
    } catch {
      consoleError(error);
    }
  }
  setOptions({ logFn, onError, preventDefault, showDialog }) {
    if (typeof logFn === "function") {
      this.logFn = logFn;
    }
    if (typeof onError === "function") {
      this.onError = onError;
    }
    if (typeof preventDefault === "boolean") {
      this.preventDefault = preventDefault;
    }
    if (typeof showDialog === "boolean") {
      this.showDialog = showDialog;
    }
  }
  startCatching({ onError, showDialog } = {}) {
    if (this.isActive) {
      return;
    }
    this.isActive = true;
    this.setOptions({ onError, showDialog });
    window.addEventListener("error", (event) => {
      this.preventDefault && event.preventDefault?.();
      this.handleError(event.error || event);
    });
    window.addEventListener("unhandledrejection", (event) => {
      this.preventDefault && event.preventDefault?.();
      this.handleRejection(event.reason || event);
    });
  }
  handleError(error) {
    this.handle(error, { errorName: "Unhandled" });
  }
  handleRejection(reason) {
    const error = reason instanceof Error ? reason : new Error(JSON.stringify(reason));
    this.handle(error, { errorName: "Unhandled rejection" });
  }
}
var RendererErrorHandler_1 = RendererErrorHandler;
var console_1 = consoleTransportRendererFactory;
const consoleMethods = {
  error: console.error,
  warn: console.warn,
  info: console.info,
  verbose: console.info,
  debug: console.debug,
  silly: console.debug,
  log: console.log
};
function consoleTransportRendererFactory(logger2) {
  return Object.assign(transport, {
    format: "{h}:{i}:{s}.{ms}{scope} › {text}",
    formatDataFn({
      data = [],
      date = /* @__PURE__ */ new Date(),
      format = transport.format,
      logId = logger2.logId,
      scope: scope2 = logger2.scopeName,
      ...message
    }) {
      if (typeof format === "function") {
        return format({ ...message, data, date, logId, scope: scope2 });
      }
      if (typeof format !== "string") {
        return data;
      }
      data.unshift(format);
      if (typeof data[1] === "string" && data[1].match(/%[1cdfiOos]/)) {
        data = [`${data[0]} ${data[1]}`, ...data.slice(2)];
      }
      data[0] = data[0].replace(/\{(\w+)}/g, (substring, name) => {
        switch (name) {
          case "level":
            return message.level;
          case "logId":
            return logId;
          case "scope":
            return scope2 ? ` (${scope2})` : "";
          case "text":
            return "";
          case "y":
            return date.getFullYear().toString(10);
          case "m":
            return (date.getMonth() + 1).toString(10).padStart(2, "0");
          case "d":
            return date.getDate().toString(10).padStart(2, "0");
          case "h":
            return date.getHours().toString(10).padStart(2, "0");
          case "i":
            return date.getMinutes().toString(10).padStart(2, "0");
          case "s":
            return date.getSeconds().toString(10).padStart(2, "0");
          case "ms":
            return date.getMilliseconds().toString(10).padStart(3, "0");
          case "iso":
            return date.toISOString();
          default: {
            return message.variables?.[name] || substring;
          }
        }
      }).trim();
      return data;
    },
    writeFn({ message: { level, data } }) {
      const consoleLogFn = consoleMethods[level] || consoleMethods.info;
      setTimeout(() => consoleLogFn(...data));
    }
  });
  function transport(message) {
    transport.writeFn({
      message: { ...message, data: transport.formatDataFn(message) }
    });
  }
}
var ipc = ipcTransportRendererFactory;
const RESTRICTED_TYPES = /* @__PURE__ */ new Set([Promise, WeakMap, WeakSet]);
function ipcTransportRendererFactory(logger2) {
  return Object.assign(transport, {
    depth: 5,
    serializeFn(data, { depth = 5, seen = /* @__PURE__ */ new WeakSet() } = {}) {
      if (depth < 1) {
        return `[${typeof data}]`;
      }
      if (seen.has(data)) {
        return data;
      }
      if (["function", "symbol"].includes(typeof data)) {
        return data.toString();
      }
      if (Object(data) !== data) {
        return data;
      }
      if (RESTRICTED_TYPES.has(data.constructor)) {
        return `[${data.constructor.name}]`;
      }
      if (Array.isArray(data)) {
        return data.map((item) => transport.serializeFn(
          item,
          { depth: depth - 1, seen }
        ));
      }
      if (data instanceof Error) {
        return data.stack;
      }
      if (data instanceof Map) {
        return new Map(
          Array.from(data).map(([key, value]) => [
            transport.serializeFn(key, { depth: depth - 1, seen }),
            transport.serializeFn(value, { depth: depth - 1, seen })
          ])
        );
      }
      if (data instanceof Set) {
        return new Set(
          Array.from(data).map(
            (val) => transport.serializeFn(val, { depth: depth - 1, seen })
          )
        );
      }
      seen.add(data);
      return Object.fromEntries(
        Object.entries(data).map(
          ([key, value]) => [
            key,
            transport.serializeFn(value, { depth: depth - 1, seen })
          ]
        )
      );
    }
  });
  function transport(message) {
    if (!window.__electronLog) {
      logger2.processMessage(
        {
          data: ["electron-log: logger isn't initialized in the main process"],
          level: "error"
        },
        { transports: ["console"] }
      );
      return;
    }
    try {
      __electronLog.sendToMain(transport.serializeFn(message, {
        depth: transport.depth
      }));
    } catch (e) {
      logger2.transports.console({
        data: ["electronLog.transports.ipc", e, "data:", message.data],
        level: "error"
      });
    }
  }
}
(function(module) {
  const Logger2 = Logger_1;
  const RendererErrorHandler2 = RendererErrorHandler_1;
  const transportConsole = console_1;
  const transportIpc = ipc;
  module.exports = createLogger();
  module.exports.Logger = Logger2;
  module.exports.default = module.exports;
  function createLogger() {
    const logger2 = new Logger2({
      allowUnknownLevel: true,
      errorHandler: new RendererErrorHandler2(),
      initializeFn: () => {
      },
      logId: "default",
      transportFactories: {
        console: transportConsole,
        ipc: transportIpc
      },
      variables: {
        processType: "renderer"
      }
    });
    logger2.errorHandler.setOptions({
      logFn({ error, errorName, showDialog }) {
        logger2.transports.console({
          data: [errorName, error].filter(Boolean),
          level: "error"
        });
        logger2.transports.ipc({
          cmd: "errorHandler",
          error: {
            cause: error?.cause,
            code: error?.code,
            name: error?.name,
            message: error?.message,
            stack: error?.stack
          },
          errorName,
          logId: logger2.logId,
          showDialog
        });
      }
    });
    if (typeof window === "object") {
      window.addEventListener("message", (event) => {
        const { cmd, logId, ...message } = event.data || {};
        const instance = Logger2.getInstance({ logId });
        if (cmd === "message") {
          instance.processMessage(message, { transports: ["console"] });
        }
      });
    }
    return new Proxy(logger2, {
      get(target, prop) {
        if (typeof target[prop] !== "undefined") {
          return target[prop];
        }
        return (...data) => logger2.logData(data, { level: prop });
      }
    });
  }
})(renderer$1);
var rendererExports = renderer$1.exports;
const renderer = rendererExports;
var renderer_1 = renderer;
const logger = /* @__PURE__ */ getDefaultExportFromCjs(renderer_1);
const rendererLogger = logger.scope("renderer");
let ipcRenderer = window.electron.ipcRenderer;
class AppProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTargetId: null,
      devices: [],
      changelog: void 0,
      updateAvailable: false,
      isLoading: false,
      authUser: {
        displayName: "",
        email: ""
      },
      config: {
        navWidth: 0,
        auth: {
          token: "",
          refreshToken: ""
        },
        changelog: {
          latestSeenVersion: ""
        },
        setupFinished: false,
        showDoctor: false,
        showSessionOverview: false
      },
      subscriptionStatus: {
        id: "",
        status: "",
        is_trial: "",
        trial_days_left: "",
        trial_end_date: 0
      },
      sessionTracking: {
        remainingSessionTime: 0,
        hasTotalSessionTimeExpired: false
      }
    };
    this.on = (eventName, eventHandler) => {
      return this.ee.on(eventName, eventHandler);
    };
    this.off = (eventName, eventHandler) => {
      return this.ee.off(eventName, eventHandler);
    };
    this.fetchCriticalData = async () => {
      let authConfig = this.getAuthConfig();
      let token2 = authConfig?.token;
      if (token2) {
        this.setState({
          isLoading: true
        });
        await this.handleAuth();
        await this.handleSubscription();
      }
      this.setState({
        isLoading: false
      });
    };
    this.handleAuth = async () => {
      try {
        if (this.state.authUser?.email) {
          return;
        }
        let authConfig = this.getAuthConfig();
        let token2 = authConfig?.token;
        let authUser = await this.execCommand("inspect:authenticateUser", token2);
        rendererLogger.log("inspect:authenticateUser.success", authUser);
        this.setState({
          authUser
        });
        await this.execCommand("inspect:updateTelemetryMetadata", {
          userId: authUser.localId,
          email: authUser.email,
          name: authUser.displayName
        });
      } catch (response) {
        if (response.error && response.error.code === "INVALID_ID_TOKEN") {
          let authConfig = this.getAuthConfig();
          let refreshToken = authConfig?.refreshToken;
          try {
            let newTokenReq = await this.execCommand("inspect:refreshToken", refreshToken);
            let config = this.state.config;
            this.setState({
              config: {
                ...config,
                auth: {
                  ...config.auth,
                  token: newTokenReq.token,
                  refreshToken: newTokenReq.refreshToken
                }
              }
            });
            await this.saveConfiguration();
            await this.handleAuth();
          } catch (error) {
            rendererLogger.error("inspect:authenticateUser.error.refreshToken", error);
          }
        } else {
          rendererLogger.error("inspect:authenticateUser.error", response.error);
          this.execCommand("inspect:logOut");
        }
      }
    };
    this.handleSubscription = async () => {
      try {
        let authConfig = this.getAuthConfig();
        let token2 = authConfig?.token;
        if (!token2) {
          rendererLogger.log("inspect:subscriptionStatus.abort.noAuthToken");
          return;
        }
        if (!this.state.authUser) {
          rendererLogger.log("inspect:subscriptionStatus.abort.noAuthUser");
          return;
        }
        let subscriptionStatus = await this.execCommand("inspect:subscriptionStatus", token2);
        rendererLogger.log("inspect:subscriptionStatus.success", subscriptionStatus);
        this.setState({
          subscriptionStatus
        });
      } catch (error) {
        rendererLogger.log("handleSubscription.error", error);
      }
    };
    this.refresh = async () => {
      await this.execCommand("inspect:refreshTargets");
    };
    this.loadConfiguration = async () => {
      rendererLogger.log("loadConfiguration");
      ipcRenderer.send("config:load");
    };
    this.loadSession = async () => {
      let activeTargetId = sessionStorage.getItem("activeTargetId") || this.state.activeTargetId;
      this.setState({
        activeTargetId
      });
    };
    this.execCommand = async (commandName, ...args) => {
      rendererLogger.log("execCommand", commandName);
      let result = await ipcRenderer.invoke("client:execCommand", commandName, ...args);
      if (result && result.error) {
        throw result.error;
      } else {
        return result;
      }
    };
    this.saveConfiguration = async () => {
      rendererLogger.log("saveConfiguration", this.state.config);
      ipcRenderer.send("config:save", this.state.config);
    };
    this.selectTarget = async (targetId) => {
      rendererLogger.log("selectTarget", targetId);
      if (this.state.activeTargetId === targetId) {
        await this.execCommand("inspect:unselectActiveTarget");
        this.setState({
          activeTargetId: null
        });
        sessionStorage.setItem("activeTargetId", "");
      } else {
        this.setState(
          {
            activeTargetId: null
          },
          async () => {
            this.setState({
              activeTargetId: targetId
            });
            sessionStorage.setItem("activeTargetId", targetId);
            await this.execCommand("inspect:selectActiveTarget", targetId);
          }
        );
      }
    };
    this.highlightTarget = async (targetId) => {
      await this.execCommand("inspect:highlightTarget", targetId);
    };
    this.unhighlightTarget = async (targetId) => {
      await this.execCommand("inspect:unhighlightTarget", targetId);
    };
    this.sendMessageToTarget = async (msg) => {
      await this.execCommand("inspect:sendMessageToTarget", msg);
    };
    this.getNavWidth = () => {
      let config = this.getConfig();
      return config?.navWidth;
    };
    this.setNavWidth = (newWidth) => {
      let config = this.state.config;
      config.navWidth = newWidth;
      this.setState({
        config
      });
      this.saveConfiguration();
    };
    this.getLatestSeenChangelogVersion = () => {
      let config = this.getConfig();
      if (config?.changelog) {
        return config?.changelog?.latestSeenVersion;
      } else {
        return "";
      }
    };
    this.setLatestSeenChangelogVersion = (version) => {
      let config = this.state.config;
      config.changelog = {
        ...config.changelog,
        latestSeenVersion: version
      };
      this.setState({
        config
      });
      this.saveConfiguration();
    };
    this.hasSubscriptionExpired = () => {
      let sub = this.state.subscriptionStatus;
      if (sub && sub.is_trial) {
        return sub.trial_days_left <= 0;
      } else if (sub && sub.status) {
        return sub.status !== "active";
      }
      return false;
    };
    this.hasFinishedSetup = () => {
      let config = this.getConfig();
      return config && config.setupFinished;
    };
    this.isDebuggingEnabled = () => {
      this.getConfig();
      if (this.state.subscriptionStatus?.status === "active") {
        return true;
      } else if (this.state.sessionTracking.hasTotalSessionTimeExpired) {
        return false;
      }
      return true;
    };
    this.shouldShowDoctor = () => {
      let config = this.getConfig();
      return config && config.showDoctor;
    };
    this.getConfig = () => {
      return this.state.config && this.state.config;
    };
    this.getAuthConfig = () => {
      let config = this.getConfig();
      return config && config.auth;
    };
    this.hasAuthToken = () => {
      let authConfig = this.getAuthConfig();
      if (authConfig) {
        return authConfig && (authConfig.token !== null || authConfig.token !== "");
      }
      return false;
    };
    this.handleActiveTarget = () => {
      let devices = this.state.devices;
      let appsList = devices?.flatMap((device) => device?.apps);
      let targetList = appsList?.flatMap((app2) => app2?.targets);
      let targetIds = targetList?.map((target) => target?.id);
      if (!targetIds.includes(this.state.activeTargetId)) {
        this.setState({
          activeTargetId: null
        });
      }
    };
    this.showContextMenuAtPoint = async (msg) => {
      await this.execCommand("inspect:showContextMenuAtPoint", msg);
    };
    this.getChangelog = async () => {
      let changelogData = await this.execCommand("inspect:getChangelog");
      this.setState({
        changelog: changelogData
      });
    };
    this.ee = new eventsExports.EventEmitter();
    ipcRenderer.on("sessionTracking.totalSessionTimeExpired", () => {
      rendererLogger.log(" -> sessionTracking.totalSessionTimeExpired");
      this.setState({
        sessionTracking: {
          hasTotalSessionTimeExpired: true
        }
      });
    });
    ipcRenderer.on("sessionTracking.sessionTimeUpdated", (e, remainingSessionTime) => {
      rendererLogger.log(" -> sessionTracking.sessionTimeUpdated", remainingSessionTime);
      this.setState({
        sessionTracking: {
          remainingSessionTime
        }
      });
    });
    ipcRenderer.on("devicesChange", (e, devices) => {
      rendererLogger.log("-> devicesChanged", devices);
      this.setState(
        {
          devices
        },
        () => {
          this.handleActiveTarget();
        }
      );
    });
    ipcRenderer.on("messageFromTarget", (e, msg) => {
      this.ee.emit("messageFromTarget", msg);
    });
    ipcRenderer.on("activeTargetOriginChange", (e, msg) => {
      rendererLogger.log("-> activeTargetOriginChange");
      if (this.state.activeTargetId) {
        this.forceRefreshDevTools();
      }
    });
    ipcRenderer.on("configChanged", (e, config) => {
      rendererLogger.log("-> configChanged", config);
      this.setState(
        {
          config
        },
        async () => {
          await this.fetchCriticalData();
        }
      );
    });
    ipcRenderer.on("updateAvailable", (e) => {
      this.setState({
        updateAvailable: true
      });
    });
    ipcRenderer.on("contextMenuItemClicked", (e, menuItemId) => {
      this.ee.emit("contextMenuItemClicked", menuItemId);
    });
    ipcRenderer.on("contextMenuClosed", (e) => {
      this.ee.emit("contextMenuClosed");
    });
  }
  componentDidMount() {
    this.refresh();
    this.loadConfiguration();
    this.loadSession();
    this.getChangelog();
  }
  forceRefreshDevTools() {
    rendererLogger.log("forceRefreshDevTools");
    let storedActiveTargetId = this.state.activeTargetId;
    this.setState(
      {
        activeTargetId: null
      },
      () => {
        this.setState({
          activeTargetId: storedActiveTargetId
        });
      }
    );
  }
  render() {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      AppContext.Provider,
      {
        value: {
          ...this
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(IntercomProvider, { appId: "xmhs2wjx", children: this.props.children })
      }
    );
  }
}
var dist = {};
var bufferPolyfill = {};
var base64Js = {};
base64Js.byteLength = byteLength;
base64Js.toByteArray = toByteArray;
base64Js.fromByteArray = fromByteArray;
var lookup = [];
var revLookup = [];
var Arr = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i];
  revLookup[code.charCodeAt(i)] = i;
}
revLookup["-".charCodeAt(0)] = 62;
revLookup["_".charCodeAt(0)] = 63;
function getLens(b64) {
  var len = b64.length;
  if (len % 4 > 0) {
    throw new Error("Invalid string. Length must be a multiple of 4");
  }
  var validLen = b64.indexOf("=");
  if (validLen === -1)
    validLen = len;
  var placeHoldersLen = validLen === len ? 0 : 4 - validLen % 4;
  return [validLen, placeHoldersLen];
}
function byteLength(b64) {
  var lens = getLens(b64);
  var validLen = lens[0];
  var placeHoldersLen = lens[1];
  return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
}
function _byteLength(b64, validLen, placeHoldersLen) {
  return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
}
function toByteArray(b64) {
  var tmp;
  var lens = getLens(b64);
  var validLen = lens[0];
  var placeHoldersLen = lens[1];
  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
  var curByte = 0;
  var len = placeHoldersLen > 0 ? validLen - 4 : validLen;
  var i;
  for (i = 0; i < len; i += 4) {
    tmp = revLookup[b64.charCodeAt(i)] << 18 | revLookup[b64.charCodeAt(i + 1)] << 12 | revLookup[b64.charCodeAt(i + 2)] << 6 | revLookup[b64.charCodeAt(i + 3)];
    arr[curByte++] = tmp >> 16 & 255;
    arr[curByte++] = tmp >> 8 & 255;
    arr[curByte++] = tmp & 255;
  }
  if (placeHoldersLen === 2) {
    tmp = revLookup[b64.charCodeAt(i)] << 2 | revLookup[b64.charCodeAt(i + 1)] >> 4;
    arr[curByte++] = tmp & 255;
  }
  if (placeHoldersLen === 1) {
    tmp = revLookup[b64.charCodeAt(i)] << 10 | revLookup[b64.charCodeAt(i + 1)] << 4 | revLookup[b64.charCodeAt(i + 2)] >> 2;
    arr[curByte++] = tmp >> 8 & 255;
    arr[curByte++] = tmp & 255;
  }
  return arr;
}
function tripletToBase64(num) {
  return lookup[num >> 18 & 63] + lookup[num >> 12 & 63] + lookup[num >> 6 & 63] + lookup[num & 63];
}
function encodeChunk(uint8, start, end) {
  var tmp;
  var output = [];
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16 & 16711680) + (uint8[i + 1] << 8 & 65280) + (uint8[i + 2] & 255);
    output.push(tripletToBase64(tmp));
  }
  return output.join("");
}
function fromByteArray(uint8) {
  var tmp;
  var len = uint8.length;
  var extraBytes = len % 3;
  var parts = [];
  var maxChunkLength = 16383;
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
  }
  if (extraBytes === 1) {
    tmp = uint8[len - 1];
    parts.push(
      lookup[tmp >> 2] + lookup[tmp << 4 & 63] + "=="
    );
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1];
    parts.push(
      lookup[tmp >> 10] + lookup[tmp >> 4 & 63] + lookup[tmp << 2 & 63] + "="
    );
  }
  return parts.join("");
}
var ieee754 = {};
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
ieee754.read = function(buffer, offset, isLE, mLen, nBytes) {
  var e, m2;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var nBits = -7;
  var i = isLE ? nBytes - 1 : 0;
  var d = isLE ? -1 : 1;
  var s = buffer[offset + i];
  i += d;
  e = s & (1 << -nBits) - 1;
  s >>= -nBits;
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {
  }
  m2 = e & (1 << -nBits) - 1;
  e >>= -nBits;
  nBits += mLen;
  for (; nBits > 0; m2 = m2 * 256 + buffer[offset + i], i += d, nBits -= 8) {
  }
  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m2 ? NaN : (s ? -1 : 1) * Infinity;
  } else {
    m2 = m2 + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m2 * Math.pow(2, e - mLen);
};
ieee754.write = function(buffer, value, offset, isLE, mLen, nBytes) {
  var e, m2, c;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var rt2 = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
  var i = isLE ? 0 : nBytes - 1;
  var d = isLE ? 1 : -1;
  var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
  value = Math.abs(value);
  if (isNaN(value) || value === Infinity) {
    m2 = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt2 / c;
    } else {
      value += rt2 * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }
    if (e + eBias >= eMax) {
      m2 = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m2 = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m2 = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }
  for (; mLen >= 8; buffer[offset + i] = m2 & 255, i += d, m2 /= 256, mLen -= 8) {
  }
  e = e << mLen | m2;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 255, i += d, e /= 256, eLen -= 8) {
  }
  buffer[offset + i - d] |= s * 128;
};
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
(function(exports) {
  const base64 = base64Js;
  const ieee754$1 = ieee754;
  const customInspectSymbol = typeof Symbol === "function" && typeof Symbol["for"] === "function" ? Symbol["for"]("nodejs.util.inspect.custom") : null;
  exports.Buffer = Buffer;
  exports.SlowBuffer = SlowBuffer;
  exports.INSPECT_MAX_BYTES = 50;
  const K_MAX_LENGTH = 2147483647;
  exports.kMaxLength = K_MAX_LENGTH;
  Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport();
  if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== "undefined" && typeof console.error === "function") {
    console.error(
      "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
    );
  }
  function typedArraySupport() {
    try {
      const arr = new Uint8Array(1);
      const proto = { foo: function() {
        return 42;
      } };
      Object.setPrototypeOf(proto, Uint8Array.prototype);
      Object.setPrototypeOf(arr, proto);
      return arr.foo() === 42;
    } catch (e) {
      return false;
    }
  }
  Object.defineProperty(Buffer.prototype, "parent", {
    enumerable: true,
    get: function() {
      if (!Buffer.isBuffer(this))
        return void 0;
      return this.buffer;
    }
  });
  Object.defineProperty(Buffer.prototype, "offset", {
    enumerable: true,
    get: function() {
      if (!Buffer.isBuffer(this))
        return void 0;
      return this.byteOffset;
    }
  });
  function createBuffer(length2) {
    if (length2 > K_MAX_LENGTH) {
      throw new RangeError('The value "' + length2 + '" is invalid for option "size"');
    }
    const buf = new Uint8Array(length2);
    Object.setPrototypeOf(buf, Buffer.prototype);
    return buf;
  }
  function Buffer(arg, encodingOrOffset, length2) {
    if (typeof arg === "number") {
      if (typeof encodingOrOffset === "string") {
        throw new TypeError(
          'The "string" argument must be of type string. Received type number'
        );
      }
      return allocUnsafe(arg);
    }
    return from2(arg, encodingOrOffset, length2);
  }
  Buffer.poolSize = 8192;
  function from2(value, encodingOrOffset, length2) {
    if (typeof value === "string") {
      return fromString(value, encodingOrOffset);
    }
    if (ArrayBuffer.isView(value)) {
      return fromArrayView(value);
    }
    if (value == null) {
      throw new TypeError(
        "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value
      );
    }
    if (isInstance(value, ArrayBuffer) || value && isInstance(value.buffer, ArrayBuffer)) {
      return fromArrayBuffer(value, encodingOrOffset, length2);
    }
    if (typeof SharedArrayBuffer !== "undefined" && (isInstance(value, SharedArrayBuffer) || value && isInstance(value.buffer, SharedArrayBuffer))) {
      return fromArrayBuffer(value, encodingOrOffset, length2);
    }
    if (typeof value === "number") {
      throw new TypeError(
        'The "value" argument must not be of type number. Received type number'
      );
    }
    const valueOf2 = value.valueOf && value.valueOf();
    if (valueOf2 != null && valueOf2 !== value) {
      return Buffer.from(valueOf2, encodingOrOffset, length2);
    }
    const b = fromObject(value);
    if (b)
      return b;
    if (typeof Symbol !== "undefined" && Symbol.toPrimitive != null && typeof value[Symbol.toPrimitive] === "function") {
      return Buffer.from(value[Symbol.toPrimitive]("string"), encodingOrOffset, length2);
    }
    throw new TypeError(
      "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value
    );
  }
  Buffer.from = function(value, encodingOrOffset, length2) {
    return from2(value, encodingOrOffset, length2);
  };
  Object.setPrototypeOf(Buffer.prototype, Uint8Array.prototype);
  Object.setPrototypeOf(Buffer, Uint8Array);
  function assertSize(size2) {
    if (typeof size2 !== "number") {
      throw new TypeError('"size" argument must be of type number');
    } else if (size2 < 0) {
      throw new RangeError('The value "' + size2 + '" is invalid for option "size"');
    }
  }
  function alloc2(size2, fill, encoding) {
    assertSize(size2);
    if (size2 <= 0) {
      return createBuffer(size2);
    }
    if (fill !== void 0) {
      return typeof encoding === "string" ? createBuffer(size2).fill(fill, encoding) : createBuffer(size2).fill(fill);
    }
    return createBuffer(size2);
  }
  Buffer.alloc = function(size2, fill, encoding) {
    return alloc2(size2, fill, encoding);
  };
  function allocUnsafe(size2) {
    assertSize(size2);
    return createBuffer(size2 < 0 ? 0 : checked(size2) | 0);
  }
  Buffer.allocUnsafe = function(size2) {
    return allocUnsafe(size2);
  };
  Buffer.allocUnsafeSlow = function(size2) {
    return allocUnsafe(size2);
  };
  function fromString(string, encoding) {
    if (typeof encoding !== "string" || encoding === "") {
      encoding = "utf8";
    }
    if (!Buffer.isEncoding(encoding)) {
      throw new TypeError("Unknown encoding: " + encoding);
    }
    const length2 = byteLength2(string, encoding) | 0;
    let buf = createBuffer(length2);
    const actual = buf.write(string, encoding);
    if (actual !== length2) {
      buf = buf.slice(0, actual);
    }
    return buf;
  }
  function fromArrayLike(array) {
    const length2 = array.length < 0 ? 0 : checked(array.length) | 0;
    const buf = createBuffer(length2);
    for (let i = 0; i < length2; i += 1) {
      buf[i] = array[i] & 255;
    }
    return buf;
  }
  function fromArrayView(arrayView) {
    if (isInstance(arrayView, Uint8Array)) {
      const copy2 = new Uint8Array(arrayView);
      return fromArrayBuffer(copy2.buffer, copy2.byteOffset, copy2.byteLength);
    }
    return fromArrayLike(arrayView);
  }
  function fromArrayBuffer(array, byteOffset, length2) {
    if (byteOffset < 0 || array.byteLength < byteOffset) {
      throw new RangeError('"offset" is outside of buffer bounds');
    }
    if (array.byteLength < byteOffset + (length2 || 0)) {
      throw new RangeError('"length" is outside of buffer bounds');
    }
    let buf;
    if (byteOffset === void 0 && length2 === void 0) {
      buf = new Uint8Array(array);
    } else if (length2 === void 0) {
      buf = new Uint8Array(array, byteOffset);
    } else {
      buf = new Uint8Array(array, byteOffset, length2);
    }
    Object.setPrototypeOf(buf, Buffer.prototype);
    return buf;
  }
  function fromObject(obj) {
    if (Buffer.isBuffer(obj)) {
      const len = checked(obj.length) | 0;
      const buf = createBuffer(len);
      if (buf.length === 0) {
        return buf;
      }
      obj.copy(buf, 0, 0, len);
      return buf;
    }
    if (obj.length !== void 0) {
      if (typeof obj.length !== "number" || numberIsNaN(obj.length)) {
        return createBuffer(0);
      }
      return fromArrayLike(obj);
    }
    if (obj.type === "Buffer" && Array.isArray(obj.data)) {
      return fromArrayLike(obj.data);
    }
  }
  function checked(length2) {
    if (length2 >= K_MAX_LENGTH) {
      throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + K_MAX_LENGTH.toString(16) + " bytes");
    }
    return length2 | 0;
  }
  function SlowBuffer(length2) {
    if (+length2 != length2) {
      length2 = 0;
    }
    return Buffer.alloc(+length2);
  }
  Buffer.isBuffer = function isBuffer(b) {
    return b != null && b._isBuffer === true && b !== Buffer.prototype;
  };
  Buffer.compare = function compare(a, b) {
    if (isInstance(a, Uint8Array))
      a = Buffer.from(a, a.offset, a.byteLength);
    if (isInstance(b, Uint8Array))
      b = Buffer.from(b, b.offset, b.byteLength);
    if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
      throw new TypeError(
        'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
      );
    }
    if (a === b)
      return 0;
    let x2 = a.length;
    let y2 = b.length;
    for (let i = 0, len = Math.min(x2, y2); i < len; ++i) {
      if (a[i] !== b[i]) {
        x2 = a[i];
        y2 = b[i];
        break;
      }
    }
    if (x2 < y2)
      return -1;
    if (y2 < x2)
      return 1;
    return 0;
  };
  Buffer.isEncoding = function isEncoding(encoding) {
    switch (String(encoding).toLowerCase()) {
      case "hex":
      case "utf8":
      case "utf-8":
      case "ascii":
      case "latin1":
      case "binary":
      case "base64":
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return true;
      default:
        return false;
    }
  };
  Buffer.concat = function concat(list, length2) {
    if (!Array.isArray(list)) {
      throw new TypeError('"list" argument must be an Array of Buffers');
    }
    if (list.length === 0) {
      return Buffer.alloc(0);
    }
    let i;
    if (length2 === void 0) {
      length2 = 0;
      for (i = 0; i < list.length; ++i) {
        length2 += list[i].length;
      }
    }
    const buffer = Buffer.allocUnsafe(length2);
    let pos = 0;
    for (i = 0; i < list.length; ++i) {
      let buf = list[i];
      if (isInstance(buf, Uint8Array)) {
        if (pos + buf.length > buffer.length) {
          if (!Buffer.isBuffer(buf))
            buf = Buffer.from(buf);
          buf.copy(buffer, pos);
        } else {
          Uint8Array.prototype.set.call(
            buffer,
            buf,
            pos
          );
        }
      } else if (!Buffer.isBuffer(buf)) {
        throw new TypeError('"list" argument must be an Array of Buffers');
      } else {
        buf.copy(buffer, pos);
      }
      pos += buf.length;
    }
    return buffer;
  };
  function byteLength2(string, encoding) {
    if (Buffer.isBuffer(string)) {
      return string.length;
    }
    if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
      return string.byteLength;
    }
    if (typeof string !== "string") {
      throw new TypeError(
        'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof string
      );
    }
    const len = string.length;
    const mustMatch = arguments.length > 2 && arguments[2] === true;
    if (!mustMatch && len === 0)
      return 0;
    let loweredCase = false;
    for (; ; ) {
      switch (encoding) {
        case "ascii":
        case "latin1":
        case "binary":
          return len;
        case "utf8":
        case "utf-8":
          return utf8ToBytes(string).length;
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return len * 2;
        case "hex":
          return len >>> 1;
        case "base64":
          return base64ToBytes(string).length;
        default:
          if (loweredCase) {
            return mustMatch ? -1 : utf8ToBytes(string).length;
          }
          encoding = ("" + encoding).toLowerCase();
          loweredCase = true;
      }
    }
  }
  Buffer.byteLength = byteLength2;
  function slowToString(encoding, start, end) {
    let loweredCase = false;
    if (start === void 0 || start < 0) {
      start = 0;
    }
    if (start > this.length) {
      return "";
    }
    if (end === void 0 || end > this.length) {
      end = this.length;
    }
    if (end <= 0) {
      return "";
    }
    end >>>= 0;
    start >>>= 0;
    if (end <= start) {
      return "";
    }
    if (!encoding)
      encoding = "utf8";
    while (true) {
      switch (encoding) {
        case "hex":
          return hexSlice(this, start, end);
        case "utf8":
        case "utf-8":
          return utf8Slice(this, start, end);
        case "ascii":
          return asciiSlice(this, start, end);
        case "latin1":
        case "binary":
          return latin1Slice(this, start, end);
        case "base64":
          return base64Slice(this, start, end);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return utf16leSlice(this, start, end);
        default:
          if (loweredCase)
            throw new TypeError("Unknown encoding: " + encoding);
          encoding = (encoding + "").toLowerCase();
          loweredCase = true;
      }
    }
  }
  Buffer.prototype._isBuffer = true;
  function swap(b, n2, m2) {
    const i = b[n2];
    b[n2] = b[m2];
    b[m2] = i;
  }
  Buffer.prototype.swap16 = function swap16() {
    const len = this.length;
    if (len % 2 !== 0) {
      throw new RangeError("Buffer size must be a multiple of 16-bits");
    }
    for (let i = 0; i < len; i += 2) {
      swap(this, i, i + 1);
    }
    return this;
  };
  Buffer.prototype.swap32 = function swap32() {
    const len = this.length;
    if (len % 4 !== 0) {
      throw new RangeError("Buffer size must be a multiple of 32-bits");
    }
    for (let i = 0; i < len; i += 4) {
      swap(this, i, i + 3);
      swap(this, i + 1, i + 2);
    }
    return this;
  };
  Buffer.prototype.swap64 = function swap64() {
    const len = this.length;
    if (len % 8 !== 0) {
      throw new RangeError("Buffer size must be a multiple of 64-bits");
    }
    for (let i = 0; i < len; i += 8) {
      swap(this, i, i + 7);
      swap(this, i + 1, i + 6);
      swap(this, i + 2, i + 5);
      swap(this, i + 3, i + 4);
    }
    return this;
  };
  Buffer.prototype.toString = function toString() {
    const length2 = this.length;
    if (length2 === 0)
      return "";
    if (arguments.length === 0)
      return utf8Slice(this, 0, length2);
    return slowToString.apply(this, arguments);
  };
  Buffer.prototype.toLocaleString = Buffer.prototype.toString;
  Buffer.prototype.equals = function equals(b) {
    if (!Buffer.isBuffer(b))
      throw new TypeError("Argument must be a Buffer");
    if (this === b)
      return true;
    return Buffer.compare(this, b) === 0;
  };
  Buffer.prototype.inspect = function inspect() {
    let str = "";
    const max = exports.INSPECT_MAX_BYTES;
    str = this.toString("hex", 0, max).replace(/(.{2})/g, "$1 ").trim();
    if (this.length > max)
      str += " ... ";
    return "<Buffer " + str + ">";
  };
  if (customInspectSymbol) {
    Buffer.prototype[customInspectSymbol] = Buffer.prototype.inspect;
  }
  Buffer.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
    if (isInstance(target, Uint8Array)) {
      target = Buffer.from(target, target.offset, target.byteLength);
    }
    if (!Buffer.isBuffer(target)) {
      throw new TypeError(
        'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof target
      );
    }
    if (start === void 0) {
      start = 0;
    }
    if (end === void 0) {
      end = target ? target.length : 0;
    }
    if (thisStart === void 0) {
      thisStart = 0;
    }
    if (thisEnd === void 0) {
      thisEnd = this.length;
    }
    if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
      throw new RangeError("out of range index");
    }
    if (thisStart >= thisEnd && start >= end) {
      return 0;
    }
    if (thisStart >= thisEnd) {
      return -1;
    }
    if (start >= end) {
      return 1;
    }
    start >>>= 0;
    end >>>= 0;
    thisStart >>>= 0;
    thisEnd >>>= 0;
    if (this === target)
      return 0;
    let x2 = thisEnd - thisStart;
    let y2 = end - start;
    const len = Math.min(x2, y2);
    const thisCopy = this.slice(thisStart, thisEnd);
    const targetCopy = target.slice(start, end);
    for (let i = 0; i < len; ++i) {
      if (thisCopy[i] !== targetCopy[i]) {
        x2 = thisCopy[i];
        y2 = targetCopy[i];
        break;
      }
    }
    if (x2 < y2)
      return -1;
    if (y2 < x2)
      return 1;
    return 0;
  };
  function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
    if (buffer.length === 0)
      return -1;
    if (typeof byteOffset === "string") {
      encoding = byteOffset;
      byteOffset = 0;
    } else if (byteOffset > 2147483647) {
      byteOffset = 2147483647;
    } else if (byteOffset < -2147483648) {
      byteOffset = -2147483648;
    }
    byteOffset = +byteOffset;
    if (numberIsNaN(byteOffset)) {
      byteOffset = dir ? 0 : buffer.length - 1;
    }
    if (byteOffset < 0)
      byteOffset = buffer.length + byteOffset;
    if (byteOffset >= buffer.length) {
      if (dir)
        return -1;
      else
        byteOffset = buffer.length - 1;
    } else if (byteOffset < 0) {
      if (dir)
        byteOffset = 0;
      else
        return -1;
    }
    if (typeof val === "string") {
      val = Buffer.from(val, encoding);
    }
    if (Buffer.isBuffer(val)) {
      if (val.length === 0) {
        return -1;
      }
      return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
    } else if (typeof val === "number") {
      val = val & 255;
      if (typeof Uint8Array.prototype.indexOf === "function") {
        if (dir) {
          return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
        } else {
          return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
        }
      }
      return arrayIndexOf(buffer, [val], byteOffset, encoding, dir);
    }
    throw new TypeError("val must be string, number or Buffer");
  }
  function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
    let indexSize = 1;
    let arrLength = arr.length;
    let valLength = val.length;
    if (encoding !== void 0) {
      encoding = String(encoding).toLowerCase();
      if (encoding === "ucs2" || encoding === "ucs-2" || encoding === "utf16le" || encoding === "utf-16le") {
        if (arr.length < 2 || val.length < 2) {
          return -1;
        }
        indexSize = 2;
        arrLength /= 2;
        valLength /= 2;
        byteOffset /= 2;
      }
    }
    function read(buf, i2) {
      if (indexSize === 1) {
        return buf[i2];
      } else {
        return buf.readUInt16BE(i2 * indexSize);
      }
    }
    let i;
    if (dir) {
      let foundIndex = -1;
      for (i = byteOffset; i < arrLength; i++) {
        if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
          if (foundIndex === -1)
            foundIndex = i;
          if (i - foundIndex + 1 === valLength)
            return foundIndex * indexSize;
        } else {
          if (foundIndex !== -1)
            i -= i - foundIndex;
          foundIndex = -1;
        }
      }
    } else {
      if (byteOffset + valLength > arrLength)
        byteOffset = arrLength - valLength;
      for (i = byteOffset; i >= 0; i--) {
        let found = true;
        for (let j2 = 0; j2 < valLength; j2++) {
          if (read(arr, i + j2) !== read(val, j2)) {
            found = false;
            break;
          }
        }
        if (found)
          return i;
      }
    }
    return -1;
  }
  Buffer.prototype.includes = function includes(val, byteOffset, encoding) {
    return this.indexOf(val, byteOffset, encoding) !== -1;
  };
  Buffer.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
    return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
  };
  Buffer.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
    return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
  };
  function hexWrite(buf, string, offset, length2) {
    offset = Number(offset) || 0;
    const remaining = buf.length - offset;
    if (!length2) {
      length2 = remaining;
    } else {
      length2 = Number(length2);
      if (length2 > remaining) {
        length2 = remaining;
      }
    }
    const strLen = string.length;
    if (length2 > strLen / 2) {
      length2 = strLen / 2;
    }
    let i;
    for (i = 0; i < length2; ++i) {
      const parsed = parseInt(string.substr(i * 2, 2), 16);
      if (numberIsNaN(parsed))
        return i;
      buf[offset + i] = parsed;
    }
    return i;
  }
  function utf8Write(buf, string, offset, length2) {
    return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length2);
  }
  function asciiWrite(buf, string, offset, length2) {
    return blitBuffer(asciiToBytes(string), buf, offset, length2);
  }
  function base64Write(buf, string, offset, length2) {
    return blitBuffer(base64ToBytes(string), buf, offset, length2);
  }
  function ucs2Write(buf, string, offset, length2) {
    return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length2);
  }
  Buffer.prototype.write = function write(string, offset, length2, encoding) {
    if (offset === void 0) {
      encoding = "utf8";
      length2 = this.length;
      offset = 0;
    } else if (length2 === void 0 && typeof offset === "string") {
      encoding = offset;
      length2 = this.length;
      offset = 0;
    } else if (isFinite(offset)) {
      offset = offset >>> 0;
      if (isFinite(length2)) {
        length2 = length2 >>> 0;
        if (encoding === void 0)
          encoding = "utf8";
      } else {
        encoding = length2;
        length2 = void 0;
      }
    } else {
      throw new Error(
        "Buffer.write(string, encoding, offset[, length]) is no longer supported"
      );
    }
    const remaining = this.length - offset;
    if (length2 === void 0 || length2 > remaining)
      length2 = remaining;
    if (string.length > 0 && (length2 < 0 || offset < 0) || offset > this.length) {
      throw new RangeError("Attempt to write outside buffer bounds");
    }
    if (!encoding)
      encoding = "utf8";
    let loweredCase = false;
    for (; ; ) {
      switch (encoding) {
        case "hex":
          return hexWrite(this, string, offset, length2);
        case "utf8":
        case "utf-8":
          return utf8Write(this, string, offset, length2);
        case "ascii":
        case "latin1":
        case "binary":
          return asciiWrite(this, string, offset, length2);
        case "base64":
          return base64Write(this, string, offset, length2);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return ucs2Write(this, string, offset, length2);
        default:
          if (loweredCase)
            throw new TypeError("Unknown encoding: " + encoding);
          encoding = ("" + encoding).toLowerCase();
          loweredCase = true;
      }
    }
  };
  Buffer.prototype.toJSON = function toJSON() {
    return {
      type: "Buffer",
      data: Array.prototype.slice.call(this._arr || this, 0)
    };
  };
  function base64Slice(buf, start, end) {
    if (start === 0 && end === buf.length) {
      return base64.fromByteArray(buf);
    } else {
      return base64.fromByteArray(buf.slice(start, end));
    }
  }
  function utf8Slice(buf, start, end) {
    end = Math.min(buf.length, end);
    const res = [];
    let i = start;
    while (i < end) {
      const firstByte = buf[i];
      let codePoint = null;
      let bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
      if (i + bytesPerSequence <= end) {
        let secondByte, thirdByte, fourthByte, tempCodePoint;
        switch (bytesPerSequence) {
          case 1:
            if (firstByte < 128) {
              codePoint = firstByte;
            }
            break;
          case 2:
            secondByte = buf[i + 1];
            if ((secondByte & 192) === 128) {
              tempCodePoint = (firstByte & 31) << 6 | secondByte & 63;
              if (tempCodePoint > 127) {
                codePoint = tempCodePoint;
              }
            }
            break;
          case 3:
            secondByte = buf[i + 1];
            thirdByte = buf[i + 2];
            if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
              tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63;
              if (tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343)) {
                codePoint = tempCodePoint;
              }
            }
            break;
          case 4:
            secondByte = buf[i + 1];
            thirdByte = buf[i + 2];
            fourthByte = buf[i + 3];
            if ((secondByte & 192) === 128 && (thirdByte & 192) === 128 && (fourthByte & 192) === 128) {
              tempCodePoint = (firstByte & 15) << 18 | (secondByte & 63) << 12 | (thirdByte & 63) << 6 | fourthByte & 63;
              if (tempCodePoint > 65535 && tempCodePoint < 1114112) {
                codePoint = tempCodePoint;
              }
            }
        }
      }
      if (codePoint === null) {
        codePoint = 65533;
        bytesPerSequence = 1;
      } else if (codePoint > 65535) {
        codePoint -= 65536;
        res.push(codePoint >>> 10 & 1023 | 55296);
        codePoint = 56320 | codePoint & 1023;
      }
      res.push(codePoint);
      i += bytesPerSequence;
    }
    return decodeCodePointsArray(res);
  }
  const MAX_ARGUMENTS_LENGTH = 4096;
  function decodeCodePointsArray(codePoints) {
    const len = codePoints.length;
    if (len <= MAX_ARGUMENTS_LENGTH) {
      return String.fromCharCode.apply(String, codePoints);
    }
    let res = "";
    let i = 0;
    while (i < len) {
      res += String.fromCharCode.apply(
        String,
        codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
      );
    }
    return res;
  }
  function asciiSlice(buf, start, end) {
    let ret = "";
    end = Math.min(buf.length, end);
    for (let i = start; i < end; ++i) {
      ret += String.fromCharCode(buf[i] & 127);
    }
    return ret;
  }
  function latin1Slice(buf, start, end) {
    let ret = "";
    end = Math.min(buf.length, end);
    for (let i = start; i < end; ++i) {
      ret += String.fromCharCode(buf[i]);
    }
    return ret;
  }
  function hexSlice(buf, start, end) {
    const len = buf.length;
    if (!start || start < 0)
      start = 0;
    if (!end || end < 0 || end > len)
      end = len;
    let out = "";
    for (let i = start; i < end; ++i) {
      out += hexSliceLookupTable[buf[i]];
    }
    return out;
  }
  function utf16leSlice(buf, start, end) {
    const bytes = buf.slice(start, end);
    let res = "";
    for (let i = 0; i < bytes.length - 1; i += 2) {
      res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
    }
    return res;
  }
  Buffer.prototype.slice = function slice2(start, end) {
    const len = this.length;
    start = ~~start;
    end = end === void 0 ? len : ~~end;
    if (start < 0) {
      start += len;
      if (start < 0)
        start = 0;
    } else if (start > len) {
      start = len;
    }
    if (end < 0) {
      end += len;
      if (end < 0)
        end = 0;
    } else if (end > len) {
      end = len;
    }
    if (end < start)
      end = start;
    const newBuf = this.subarray(start, end);
    Object.setPrototypeOf(newBuf, Buffer.prototype);
    return newBuf;
  };
  function checkOffset(offset, ext, length2) {
    if (offset % 1 !== 0 || offset < 0)
      throw new RangeError("offset is not uint");
    if (offset + ext > length2)
      throw new RangeError("Trying to access beyond buffer length");
  }
  Buffer.prototype.readUintLE = Buffer.prototype.readUIntLE = function readUIntLE(offset, byteLength3, noAssert) {
    offset = offset >>> 0;
    byteLength3 = byteLength3 >>> 0;
    if (!noAssert)
      checkOffset(offset, byteLength3, this.length);
    let val = this[offset];
    let mul = 1;
    let i = 0;
    while (++i < byteLength3 && (mul *= 256)) {
      val += this[offset + i] * mul;
    }
    return val;
  };
  Buffer.prototype.readUintBE = Buffer.prototype.readUIntBE = function readUIntBE(offset, byteLength3, noAssert) {
    offset = offset >>> 0;
    byteLength3 = byteLength3 >>> 0;
    if (!noAssert) {
      checkOffset(offset, byteLength3, this.length);
    }
    let val = this[offset + --byteLength3];
    let mul = 1;
    while (byteLength3 > 0 && (mul *= 256)) {
      val += this[offset + --byteLength3] * mul;
    }
    return val;
  };
  Buffer.prototype.readUint8 = Buffer.prototype.readUInt8 = function readUInt8(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 1, this.length);
    return this[offset];
  };
  Buffer.prototype.readUint16LE = Buffer.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 2, this.length);
    return this[offset] | this[offset + 1] << 8;
  };
  Buffer.prototype.readUint16BE = Buffer.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 2, this.length);
    return this[offset] << 8 | this[offset + 1];
  };
  Buffer.prototype.readUint32LE = Buffer.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 4, this.length);
    return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 16777216;
  };
  Buffer.prototype.readUint32BE = Buffer.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 4, this.length);
    return this[offset] * 16777216 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
  };
  Buffer.prototype.readBigUInt64LE = defineBigIntMethod(function readBigUInt64LE(offset) {
    offset = offset >>> 0;
    validateNumber(offset, "offset");
    const first = this[offset];
    const last = this[offset + 7];
    if (first === void 0 || last === void 0) {
      boundsError(offset, this.length - 8);
    }
    const lo = first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24;
    const hi2 = this[++offset] + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + last * 2 ** 24;
    return BigInt(lo) + (BigInt(hi2) << BigInt(32));
  });
  Buffer.prototype.readBigUInt64BE = defineBigIntMethod(function readBigUInt64BE(offset) {
    offset = offset >>> 0;
    validateNumber(offset, "offset");
    const first = this[offset];
    const last = this[offset + 7];
    if (first === void 0 || last === void 0) {
      boundsError(offset, this.length - 8);
    }
    const hi2 = first * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
    const lo = this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last;
    return (BigInt(hi2) << BigInt(32)) + BigInt(lo);
  });
  Buffer.prototype.readIntLE = function readIntLE(offset, byteLength3, noAssert) {
    offset = offset >>> 0;
    byteLength3 = byteLength3 >>> 0;
    if (!noAssert)
      checkOffset(offset, byteLength3, this.length);
    let val = this[offset];
    let mul = 1;
    let i = 0;
    while (++i < byteLength3 && (mul *= 256)) {
      val += this[offset + i] * mul;
    }
    mul *= 128;
    if (val >= mul)
      val -= Math.pow(2, 8 * byteLength3);
    return val;
  };
  Buffer.prototype.readIntBE = function readIntBE(offset, byteLength3, noAssert) {
    offset = offset >>> 0;
    byteLength3 = byteLength3 >>> 0;
    if (!noAssert)
      checkOffset(offset, byteLength3, this.length);
    let i = byteLength3;
    let mul = 1;
    let val = this[offset + --i];
    while (i > 0 && (mul *= 256)) {
      val += this[offset + --i] * mul;
    }
    mul *= 128;
    if (val >= mul)
      val -= Math.pow(2, 8 * byteLength3);
    return val;
  };
  Buffer.prototype.readInt8 = function readInt8(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 1, this.length);
    if (!(this[offset] & 128))
      return this[offset];
    return (255 - this[offset] + 1) * -1;
  };
  Buffer.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 2, this.length);
    const val = this[offset] | this[offset + 1] << 8;
    return val & 32768 ? val | 4294901760 : val;
  };
  Buffer.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 2, this.length);
    const val = this[offset + 1] | this[offset] << 8;
    return val & 32768 ? val | 4294901760 : val;
  };
  Buffer.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 4, this.length);
    return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
  };
  Buffer.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 4, this.length);
    return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
  };
  Buffer.prototype.readBigInt64LE = defineBigIntMethod(function readBigInt64LE(offset) {
    offset = offset >>> 0;
    validateNumber(offset, "offset");
    const first = this[offset];
    const last = this[offset + 7];
    if (first === void 0 || last === void 0) {
      boundsError(offset, this.length - 8);
    }
    const val = this[offset + 4] + this[offset + 5] * 2 ** 8 + this[offset + 6] * 2 ** 16 + (last << 24);
    return (BigInt(val) << BigInt(32)) + BigInt(first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24);
  });
  Buffer.prototype.readBigInt64BE = defineBigIntMethod(function readBigInt64BE(offset) {
    offset = offset >>> 0;
    validateNumber(offset, "offset");
    const first = this[offset];
    const last = this[offset + 7];
    if (first === void 0 || last === void 0) {
      boundsError(offset, this.length - 8);
    }
    const val = (first << 24) + // Overflow
    this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
    return (BigInt(val) << BigInt(32)) + BigInt(this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last);
  });
  Buffer.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 4, this.length);
    return ieee754$1.read(this, offset, true, 23, 4);
  };
  Buffer.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 4, this.length);
    return ieee754$1.read(this, offset, false, 23, 4);
  };
  Buffer.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 8, this.length);
    return ieee754$1.read(this, offset, true, 52, 8);
  };
  Buffer.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
      checkOffset(offset, 8, this.length);
    return ieee754$1.read(this, offset, false, 52, 8);
  };
  function checkInt(buf, value, offset, ext, max, min) {
    if (!Buffer.isBuffer(buf))
      throw new TypeError('"buffer" argument must be a Buffer instance');
    if (value > max || value < min)
      throw new RangeError('"value" argument is out of bounds');
    if (offset + ext > buf.length)
      throw new RangeError("Index out of range");
  }
  Buffer.prototype.writeUintLE = Buffer.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength3, noAssert) {
    value = +value;
    offset = offset >>> 0;
    byteLength3 = byteLength3 >>> 0;
    if (!noAssert) {
      const maxBytes = Math.pow(2, 8 * byteLength3) - 1;
      checkInt(this, value, offset, byteLength3, maxBytes, 0);
    }
    let mul = 1;
    let i = 0;
    this[offset] = value & 255;
    while (++i < byteLength3 && (mul *= 256)) {
      this[offset + i] = value / mul & 255;
    }
    return offset + byteLength3;
  };
  Buffer.prototype.writeUintBE = Buffer.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength3, noAssert) {
    value = +value;
    offset = offset >>> 0;
    byteLength3 = byteLength3 >>> 0;
    if (!noAssert) {
      const maxBytes = Math.pow(2, 8 * byteLength3) - 1;
      checkInt(this, value, offset, byteLength3, maxBytes, 0);
    }
    let i = byteLength3 - 1;
    let mul = 1;
    this[offset + i] = value & 255;
    while (--i >= 0 && (mul *= 256)) {
      this[offset + i] = value / mul & 255;
    }
    return offset + byteLength3;
  };
  Buffer.prototype.writeUint8 = Buffer.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert)
      checkInt(this, value, offset, 1, 255, 0);
    this[offset] = value & 255;
    return offset + 1;
  };
  Buffer.prototype.writeUint16LE = Buffer.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert)
      checkInt(this, value, offset, 2, 65535, 0);
    this[offset] = value & 255;
    this[offset + 1] = value >>> 8;
    return offset + 2;
  };
  Buffer.prototype.writeUint16BE = Buffer.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert)
      checkInt(this, value, offset, 2, 65535, 0);
    this[offset] = value >>> 8;
    this[offset + 1] = value & 255;
    return offset + 2;
  };
  Buffer.prototype.writeUint32LE = Buffer.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert)
      checkInt(this, value, offset, 4, 4294967295, 0);
    this[offset + 3] = value >>> 24;
    this[offset + 2] = value >>> 16;
    this[offset + 1] = value >>> 8;
    this[offset] = value & 255;
    return offset + 4;
  };
  Buffer.prototype.writeUint32BE = Buffer.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert)
      checkInt(this, value, offset, 4, 4294967295, 0);
    this[offset] = value >>> 24;
    this[offset + 1] = value >>> 16;
    this[offset + 2] = value >>> 8;
    this[offset + 3] = value & 255;
    return offset + 4;
  };
  function wrtBigUInt64LE(buf, value, offset, min, max) {
    checkIntBI(value, min, max, buf, offset, 7);
    let lo = Number(value & BigInt(4294967295));
    buf[offset++] = lo;
    lo = lo >> 8;
    buf[offset++] = lo;
    lo = lo >> 8;
    buf[offset++] = lo;
    lo = lo >> 8;
    buf[offset++] = lo;
    let hi2 = Number(value >> BigInt(32) & BigInt(4294967295));
    buf[offset++] = hi2;
    hi2 = hi2 >> 8;
    buf[offset++] = hi2;
    hi2 = hi2 >> 8;
    buf[offset++] = hi2;
    hi2 = hi2 >> 8;
    buf[offset++] = hi2;
    return offset;
  }
  function wrtBigUInt64BE(buf, value, offset, min, max) {
    checkIntBI(value, min, max, buf, offset, 7);
    let lo = Number(value & BigInt(4294967295));
    buf[offset + 7] = lo;
    lo = lo >> 8;
    buf[offset + 6] = lo;
    lo = lo >> 8;
    buf[offset + 5] = lo;
    lo = lo >> 8;
    buf[offset + 4] = lo;
    let hi2 = Number(value >> BigInt(32) & BigInt(4294967295));
    buf[offset + 3] = hi2;
    hi2 = hi2 >> 8;
    buf[offset + 2] = hi2;
    hi2 = hi2 >> 8;
    buf[offset + 1] = hi2;
    hi2 = hi2 >> 8;
    buf[offset] = hi2;
    return offset + 8;
  }
  Buffer.prototype.writeBigUInt64LE = defineBigIntMethod(function writeBigUInt64LE(value, offset = 0) {
    return wrtBigUInt64LE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
  });
  Buffer.prototype.writeBigUInt64BE = defineBigIntMethod(function writeBigUInt64BE(value, offset = 0) {
    return wrtBigUInt64BE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
  });
  Buffer.prototype.writeIntLE = function writeIntLE(value, offset, byteLength3, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) {
      const limit = Math.pow(2, 8 * byteLength3 - 1);
      checkInt(this, value, offset, byteLength3, limit - 1, -limit);
    }
    let i = 0;
    let mul = 1;
    let sub = 0;
    this[offset] = value & 255;
    while (++i < byteLength3 && (mul *= 256)) {
      if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
        sub = 1;
      }
      this[offset + i] = (value / mul >> 0) - sub & 255;
    }
    return offset + byteLength3;
  };
  Buffer.prototype.writeIntBE = function writeIntBE(value, offset, byteLength3, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) {
      const limit = Math.pow(2, 8 * byteLength3 - 1);
      checkInt(this, value, offset, byteLength3, limit - 1, -limit);
    }
    let i = byteLength3 - 1;
    let mul = 1;
    let sub = 0;
    this[offset + i] = value & 255;
    while (--i >= 0 && (mul *= 256)) {
      if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
        sub = 1;
      }
      this[offset + i] = (value / mul >> 0) - sub & 255;
    }
    return offset + byteLength3;
  };
  Buffer.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert)
      checkInt(this, value, offset, 1, 127, -128);
    if (value < 0)
      value = 255 + value + 1;
    this[offset] = value & 255;
    return offset + 1;
  };
  Buffer.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert)
      checkInt(this, value, offset, 2, 32767, -32768);
    this[offset] = value & 255;
    this[offset + 1] = value >>> 8;
    return offset + 2;
  };
  Buffer.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert)
      checkInt(this, value, offset, 2, 32767, -32768);
    this[offset] = value >>> 8;
    this[offset + 1] = value & 255;
    return offset + 2;
  };
  Buffer.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert)
      checkInt(this, value, offset, 4, 2147483647, -2147483648);
    this[offset] = value & 255;
    this[offset + 1] = value >>> 8;
    this[offset + 2] = value >>> 16;
    this[offset + 3] = value >>> 24;
    return offset + 4;
  };
  Buffer.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert)
      checkInt(this, value, offset, 4, 2147483647, -2147483648);
    if (value < 0)
      value = 4294967295 + value + 1;
    this[offset] = value >>> 24;
    this[offset + 1] = value >>> 16;
    this[offset + 2] = value >>> 8;
    this[offset + 3] = value & 255;
    return offset + 4;
  };
  Buffer.prototype.writeBigInt64LE = defineBigIntMethod(function writeBigInt64LE(value, offset = 0) {
    return wrtBigUInt64LE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  });
  Buffer.prototype.writeBigInt64BE = defineBigIntMethod(function writeBigInt64BE(value, offset = 0) {
    return wrtBigUInt64BE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  });
  function checkIEEE754(buf, value, offset, ext, max, min) {
    if (offset + ext > buf.length)
      throw new RangeError("Index out of range");
    if (offset < 0)
      throw new RangeError("Index out of range");
  }
  function writeFloat(buf, value, offset, littleEndian, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) {
      checkIEEE754(buf, value, offset, 4);
    }
    ieee754$1.write(buf, value, offset, littleEndian, 23, 4);
    return offset + 4;
  }
  Buffer.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
    return writeFloat(this, value, offset, true, noAssert);
  };
  Buffer.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
    return writeFloat(this, value, offset, false, noAssert);
  };
  function writeDouble(buf, value, offset, littleEndian, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) {
      checkIEEE754(buf, value, offset, 8);
    }
    ieee754$1.write(buf, value, offset, littleEndian, 52, 8);
    return offset + 8;
  }
  Buffer.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
    return writeDouble(this, value, offset, true, noAssert);
  };
  Buffer.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
    return writeDouble(this, value, offset, false, noAssert);
  };
  Buffer.prototype.copy = function copy2(target, targetStart, start, end) {
    if (!Buffer.isBuffer(target))
      throw new TypeError("argument should be a Buffer");
    if (!start)
      start = 0;
    if (!end && end !== 0)
      end = this.length;
    if (targetStart >= target.length)
      targetStart = target.length;
    if (!targetStart)
      targetStart = 0;
    if (end > 0 && end < start)
      end = start;
    if (end === start)
      return 0;
    if (target.length === 0 || this.length === 0)
      return 0;
    if (targetStart < 0) {
      throw new RangeError("targetStart out of bounds");
    }
    if (start < 0 || start >= this.length)
      throw new RangeError("Index out of range");
    if (end < 0)
      throw new RangeError("sourceEnd out of bounds");
    if (end > this.length)
      end = this.length;
    if (target.length - targetStart < end - start) {
      end = target.length - targetStart + start;
    }
    const len = end - start;
    if (this === target && typeof Uint8Array.prototype.copyWithin === "function") {
      this.copyWithin(targetStart, start, end);
    } else {
      Uint8Array.prototype.set.call(
        target,
        this.subarray(start, end),
        targetStart
      );
    }
    return len;
  };
  Buffer.prototype.fill = function fill(val, start, end, encoding) {
    if (typeof val === "string") {
      if (typeof start === "string") {
        encoding = start;
        start = 0;
        end = this.length;
      } else if (typeof end === "string") {
        encoding = end;
        end = this.length;
      }
      if (encoding !== void 0 && typeof encoding !== "string") {
        throw new TypeError("encoding must be a string");
      }
      if (typeof encoding === "string" && !Buffer.isEncoding(encoding)) {
        throw new TypeError("Unknown encoding: " + encoding);
      }
      if (val.length === 1) {
        const code2 = val.charCodeAt(0);
        if (encoding === "utf8" && code2 < 128 || encoding === "latin1") {
          val = code2;
        }
      }
    } else if (typeof val === "number") {
      val = val & 255;
    } else if (typeof val === "boolean") {
      val = Number(val);
    }
    if (start < 0 || this.length < start || this.length < end) {
      throw new RangeError("Out of range index");
    }
    if (end <= start) {
      return this;
    }
    start = start >>> 0;
    end = end === void 0 ? this.length : end >>> 0;
    if (!val)
      val = 0;
    let i;
    if (typeof val === "number") {
      for (i = start; i < end; ++i) {
        this[i] = val;
      }
    } else {
      const bytes = Buffer.isBuffer(val) ? val : Buffer.from(val, encoding);
      const len = bytes.length;
      if (len === 0) {
        throw new TypeError('The value "' + val + '" is invalid for argument "value"');
      }
      for (i = 0; i < end - start; ++i) {
        this[i + start] = bytes[i % len];
      }
    }
    return this;
  };
  const errors = {};
  function E2(sym, getMessage, Base) {
    errors[sym] = class NodeError extends Base {
      constructor() {
        super();
        Object.defineProperty(this, "message", {
          value: getMessage.apply(this, arguments),
          writable: true,
          configurable: true
        });
        this.name = `${this.name} [${sym}]`;
        this.stack;
        delete this.name;
      }
      get code() {
        return sym;
      }
      set code(value) {
        Object.defineProperty(this, "code", {
          configurable: true,
          enumerable: true,
          value,
          writable: true
        });
      }
      toString() {
        return `${this.name} [${sym}]: ${this.message}`;
      }
    };
  }
  E2(
    "ERR_BUFFER_OUT_OF_BOUNDS",
    function(name) {
      if (name) {
        return `${name} is outside of buffer bounds`;
      }
      return "Attempt to access memory outside buffer bounds";
    },
    RangeError
  );
  E2(
    "ERR_INVALID_ARG_TYPE",
    function(name, actual) {
      return `The "${name}" argument must be of type number. Received type ${typeof actual}`;
    },
    TypeError
  );
  E2(
    "ERR_OUT_OF_RANGE",
    function(str, range, input) {
      let msg = `The value of "${str}" is out of range.`;
      let received = input;
      if (Number.isInteger(input) && Math.abs(input) > 2 ** 32) {
        received = addNumericalSeparator(String(input));
      } else if (typeof input === "bigint") {
        received = String(input);
        if (input > BigInt(2) ** BigInt(32) || input < -(BigInt(2) ** BigInt(32))) {
          received = addNumericalSeparator(received);
        }
        received += "n";
      }
      msg += ` It must be ${range}. Received ${received}`;
      return msg;
    },
    RangeError
  );
  function addNumericalSeparator(val) {
    let res = "";
    let i = val.length;
    const start = val[0] === "-" ? 1 : 0;
    for (; i >= start + 4; i -= 3) {
      res = `_${val.slice(i - 3, i)}${res}`;
    }
    return `${val.slice(0, i)}${res}`;
  }
  function checkBounds(buf, offset, byteLength3) {
    validateNumber(offset, "offset");
    if (buf[offset] === void 0 || buf[offset + byteLength3] === void 0) {
      boundsError(offset, buf.length - (byteLength3 + 1));
    }
  }
  function checkIntBI(value, min, max, buf, offset, byteLength3) {
    if (value > max || value < min) {
      const n2 = typeof min === "bigint" ? "n" : "";
      let range;
      if (byteLength3 > 3) {
        if (min === 0 || min === BigInt(0)) {
          range = `>= 0${n2} and < 2${n2} ** ${(byteLength3 + 1) * 8}${n2}`;
        } else {
          range = `>= -(2${n2} ** ${(byteLength3 + 1) * 8 - 1}${n2}) and < 2 ** ${(byteLength3 + 1) * 8 - 1}${n2}`;
        }
      } else {
        range = `>= ${min}${n2} and <= ${max}${n2}`;
      }
      throw new errors.ERR_OUT_OF_RANGE("value", range, value);
    }
    checkBounds(buf, offset, byteLength3);
  }
  function validateNumber(value, name) {
    if (typeof value !== "number") {
      throw new errors.ERR_INVALID_ARG_TYPE(name, "number", value);
    }
  }
  function boundsError(value, length2, type) {
    if (Math.floor(value) !== value) {
      validateNumber(value, type);
      throw new errors.ERR_OUT_OF_RANGE(type || "offset", "an integer", value);
    }
    if (length2 < 0) {
      throw new errors.ERR_BUFFER_OUT_OF_BOUNDS();
    }
    throw new errors.ERR_OUT_OF_RANGE(
      type || "offset",
      `>= ${type ? 1 : 0} and <= ${length2}`,
      value
    );
  }
  const INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;
  function base64clean(str) {
    str = str.split("=")[0];
    str = str.trim().replace(INVALID_BASE64_RE, "");
    if (str.length < 2)
      return "";
    while (str.length % 4 !== 0) {
      str = str + "=";
    }
    return str;
  }
  function utf8ToBytes(string, units) {
    units = units || Infinity;
    let codePoint;
    const length2 = string.length;
    let leadSurrogate = null;
    const bytes = [];
    for (let i = 0; i < length2; ++i) {
      codePoint = string.charCodeAt(i);
      if (codePoint > 55295 && codePoint < 57344) {
        if (!leadSurrogate) {
          if (codePoint > 56319) {
            if ((units -= 3) > -1)
              bytes.push(239, 191, 189);
            continue;
          } else if (i + 1 === length2) {
            if ((units -= 3) > -1)
              bytes.push(239, 191, 189);
            continue;
          }
          leadSurrogate = codePoint;
          continue;
        }
        if (codePoint < 56320) {
          if ((units -= 3) > -1)
            bytes.push(239, 191, 189);
          leadSurrogate = codePoint;
          continue;
        }
        codePoint = (leadSurrogate - 55296 << 10 | codePoint - 56320) + 65536;
      } else if (leadSurrogate) {
        if ((units -= 3) > -1)
          bytes.push(239, 191, 189);
      }
      leadSurrogate = null;
      if (codePoint < 128) {
        if ((units -= 1) < 0)
          break;
        bytes.push(codePoint);
      } else if (codePoint < 2048) {
        if ((units -= 2) < 0)
          break;
        bytes.push(
          codePoint >> 6 | 192,
          codePoint & 63 | 128
        );
      } else if (codePoint < 65536) {
        if ((units -= 3) < 0)
          break;
        bytes.push(
          codePoint >> 12 | 224,
          codePoint >> 6 & 63 | 128,
          codePoint & 63 | 128
        );
      } else if (codePoint < 1114112) {
        if ((units -= 4) < 0)
          break;
        bytes.push(
          codePoint >> 18 | 240,
          codePoint >> 12 & 63 | 128,
          codePoint >> 6 & 63 | 128,
          codePoint & 63 | 128
        );
      } else {
        throw new Error("Invalid code point");
      }
    }
    return bytes;
  }
  function asciiToBytes(str) {
    const byteArray = [];
    for (let i = 0; i < str.length; ++i) {
      byteArray.push(str.charCodeAt(i) & 255);
    }
    return byteArray;
  }
  function utf16leToBytes(str, units) {
    let c, hi2, lo;
    const byteArray = [];
    for (let i = 0; i < str.length; ++i) {
      if ((units -= 2) < 0)
        break;
      c = str.charCodeAt(i);
      hi2 = c >> 8;
      lo = c % 256;
      byteArray.push(lo);
      byteArray.push(hi2);
    }
    return byteArray;
  }
  function base64ToBytes(str) {
    return base64.toByteArray(base64clean(str));
  }
  function blitBuffer(src, dst, offset, length2) {
    let i;
    for (i = 0; i < length2; ++i) {
      if (i + offset >= dst.length || i >= src.length)
        break;
      dst[i + offset] = src[i];
    }
    return i;
  }
  function isInstance(obj, type) {
    return obj instanceof type || obj != null && obj.constructor != null && obj.constructor.name != null && obj.constructor.name === type.name;
  }
  function numberIsNaN(obj) {
    return obj !== obj;
  }
  const hexSliceLookupTable = function() {
    const alphabet = "0123456789abcdef";
    const table = new Array(256);
    for (let i = 0; i < 16; ++i) {
      const i16 = i * 16;
      for (let j2 = 0; j2 < 16; ++j2) {
        table[i16 + j2] = alphabet[i] + alphabet[j2];
      }
    }
    return table;
  }();
  function defineBigIntMethod(fn) {
    return typeof BigInt === "undefined" ? BufferBigIntNotDefined : fn;
  }
  function BufferBigIntNotDefined() {
    throw new Error("BigInt not supported");
  }
})(bufferPolyfill);
var browser = { exports: {} };
var process = browser.exports = {};
var cachedSetTimeout;
var cachedClearTimeout;
function defaultSetTimout() {
  throw new Error("setTimeout has not been defined");
}
function defaultClearTimeout() {
  throw new Error("clearTimeout has not been defined");
}
(function() {
  try {
    if (typeof setTimeout === "function") {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }
  try {
    if (typeof clearTimeout === "function") {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();
function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    return setTimeout(fun, 0);
  }
  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }
  try {
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e2) {
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}
function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    return clearTimeout(marker);
  }
  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }
  try {
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      return cachedClearTimeout.call(null, marker);
    } catch (e2) {
      return cachedClearTimeout.call(this, marker);
    }
  }
}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;
function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }
  draining = false;
  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }
  if (queue.length) {
    drainQueue();
  }
}
function drainQueue() {
  if (draining) {
    return;
  }
  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;
  while (len) {
    currentQueue = queue;
    queue = [];
    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }
    queueIndex = -1;
    len = queue.length;
  }
  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}
process.nextTick = function(fun) {
  var args = new Array(arguments.length - 1);
  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }
  queue.push(new Item(fun, args));
  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
};
function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}
Item.prototype.run = function() {
  this.fun.apply(null, this.array);
};
process.title = "browser";
process.browser = true;
process.env = {};
process.argv = [];
process.version = "";
process.versions = {};
function noop() {
}
process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;
process.listeners = function(name) {
  return [];
};
process.binding = function(name) {
  throw new Error("process.binding is not supported");
};
process.cwd = function() {
  return "/";
};
process.chdir = function(dir) {
  throw new Error("process.chdir is not supported");
};
process.umask = function() {
  return 0;
};
var browserExports = browser.exports;
(function(exports) {
  Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
  const t2 = bufferPolyfill, r2 = browserExports, o = (e) => e && e.__esModule ? e : { default: e }, l2 = o(r2), u2 = globalThis || void 0 || self;
  Object.defineProperty(exports, "Buffer", { enumerable: true, get: () => t2.Buffer });
  Object.defineProperty(exports, "process", { enumerable: true, get: () => l2.default });
  exports.global = u2;
})(dist);
var __assign$2 = function() {
  __assign$2 = Object.assign || function __assign2(t2) {
    for (var s, i = 1, n2 = arguments.length; i < n2; i++) {
      s = arguments[i];
      for (var p2 in s)
        if (Object.prototype.hasOwnProperty.call(s, p2))
          t2[p2] = s[p2];
    }
    return t2;
  };
  return __assign$2.apply(this, arguments);
};
function __spreadArray(to, from2, pack) {
  if (pack || arguments.length === 2)
    for (var i = 0, l2 = from2.length, ar; i < l2; i++) {
      if (ar || !(i in from2)) {
        if (!ar)
          ar = Array.prototype.slice.call(from2, 0, i);
        ar[i] = from2[i];
      }
    }
  return to.concat(ar || Array.prototype.slice.call(from2));
}
typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};
function memoize(fn) {
  var cache = /* @__PURE__ */ Object.create(null);
  return function(arg) {
    if (cache[arg] === void 0)
      cache[arg] = fn(arg);
    return cache[arg];
  };
}
var reactPropsRegex = /^((children|dangerouslySetInnerHTML|key|ref|autoFocus|defaultValue|defaultChecked|innerHTML|suppressContentEditableWarning|suppressHydrationWarning|valueLink|abbr|accept|acceptCharset|accessKey|action|allow|allowUserMedia|allowPaymentRequest|allowFullScreen|allowTransparency|alt|async|autoComplete|autoPlay|capture|cellPadding|cellSpacing|challenge|charSet|checked|cite|classID|className|cols|colSpan|content|contentEditable|contextMenu|controls|controlsList|coords|crossOrigin|data|dateTime|decoding|default|defer|dir|disabled|disablePictureInPicture|download|draggable|encType|enterKeyHint|form|formAction|formEncType|formMethod|formNoValidate|formTarget|frameBorder|headers|height|hidden|high|href|hrefLang|htmlFor|httpEquiv|id|inputMode|integrity|is|keyParams|keyType|kind|label|lang|list|loading|loop|low|marginHeight|marginWidth|max|maxLength|media|mediaGroup|method|min|minLength|multiple|muted|name|nonce|noValidate|open|optimum|pattern|placeholder|playsInline|poster|preload|profile|radioGroup|readOnly|referrerPolicy|rel|required|reversed|role|rows|rowSpan|sandbox|scope|scoped|scrolling|seamless|selected|shape|size|sizes|slot|span|spellCheck|src|srcDoc|srcLang|srcSet|start|step|style|summary|tabIndex|target|title|translate|type|useMap|value|width|wmode|wrap|about|datatype|inlist|prefix|property|resource|typeof|vocab|autoCapitalize|autoCorrect|autoSave|color|incremental|fallback|inert|itemProp|itemScope|itemType|itemID|itemRef|on|option|results|security|unselectable|accentHeight|accumulate|additive|alignmentBaseline|allowReorder|alphabetic|amplitude|arabicForm|ascent|attributeName|attributeType|autoReverse|azimuth|baseFrequency|baselineShift|baseProfile|bbox|begin|bias|by|calcMode|capHeight|clip|clipPathUnits|clipPath|clipRule|colorInterpolation|colorInterpolationFilters|colorProfile|colorRendering|contentScriptType|contentStyleType|cursor|cx|cy|d|decelerate|descent|diffuseConstant|direction|display|divisor|dominantBaseline|dur|dx|dy|edgeMode|elevation|enableBackground|end|exponent|externalResourcesRequired|fill|fillOpacity|fillRule|filter|filterRes|filterUnits|floodColor|floodOpacity|focusable|fontFamily|fontSize|fontSizeAdjust|fontStretch|fontStyle|fontVariant|fontWeight|format|from|fr|fx|fy|g1|g2|glyphName|glyphOrientationHorizontal|glyphOrientationVertical|glyphRef|gradientTransform|gradientUnits|hanging|horizAdvX|horizOriginX|ideographic|imageRendering|in|in2|intercept|k|k1|k2|k3|k4|kernelMatrix|kernelUnitLength|kerning|keyPoints|keySplines|keyTimes|lengthAdjust|letterSpacing|lightingColor|limitingConeAngle|local|markerEnd|markerMid|markerStart|markerHeight|markerUnits|markerWidth|mask|maskContentUnits|maskUnits|mathematical|mode|numOctaves|offset|opacity|operator|order|orient|orientation|origin|overflow|overlinePosition|overlineThickness|panose1|paintOrder|pathLength|patternContentUnits|patternTransform|patternUnits|pointerEvents|points|pointsAtX|pointsAtY|pointsAtZ|preserveAlpha|preserveAspectRatio|primitiveUnits|r|radius|refX|refY|renderingIntent|repeatCount|repeatDur|requiredExtensions|requiredFeatures|restart|result|rotate|rx|ry|scale|seed|shapeRendering|slope|spacing|specularConstant|specularExponent|speed|spreadMethod|startOffset|stdDeviation|stemh|stemv|stitchTiles|stopColor|stopOpacity|strikethroughPosition|strikethroughThickness|string|stroke|strokeDasharray|strokeDashoffset|strokeLinecap|strokeLinejoin|strokeMiterlimit|strokeOpacity|strokeWidth|surfaceScale|systemLanguage|tableValues|targetX|targetY|textAnchor|textDecoration|textRendering|textLength|to|transform|u1|u2|underlinePosition|underlineThickness|unicode|unicodeBidi|unicodeRange|unitsPerEm|vAlphabetic|vHanging|vIdeographic|vMathematical|values|vectorEffect|version|vertAdvY|vertOriginX|vertOriginY|viewBox|viewTarget|visibility|widths|wordSpacing|writingMode|x|xHeight|x1|x2|xChannelSelector|xlinkActuate|xlinkArcrole|xlinkHref|xlinkRole|xlinkShow|xlinkTitle|xlinkType|xmlBase|xmlns|xmlnsXlink|xmlLang|xmlSpace|y|y1|y2|yChannelSelector|z|zoomAndPan|for|class|autofocus)|(([Dd][Aa][Tt][Aa]|[Aa][Rr][Ii][Aa]|x)-.*))$/;
var isPropValid = /* @__PURE__ */ memoize(
  function(prop) {
    return reactPropsRegex.test(prop) || prop.charCodeAt(0) === 111 && prop.charCodeAt(1) === 110 && prop.charCodeAt(2) < 91;
  }
  /* Z+1 */
);
var MS = "-ms-";
var MOZ = "-moz-";
var WEBKIT = "-webkit-";
var COMMENT = "comm";
var RULESET = "rule";
var DECLARATION = "decl";
var IMPORT = "@import";
var KEYFRAMES = "@keyframes";
var LAYER = "@layer";
var abs = Math.abs;
var from = String.fromCharCode;
var assign = Object.assign;
function hash(value, length2) {
  return charat(value, 0) ^ 45 ? (((length2 << 2 ^ charat(value, 0)) << 2 ^ charat(value, 1)) << 2 ^ charat(value, 2)) << 2 ^ charat(value, 3) : 0;
}
function trim(value) {
  return value.trim();
}
function match(value, pattern) {
  return (value = pattern.exec(value)) ? value[0] : value;
}
function replace(value, pattern, replacement) {
  return value.replace(pattern, replacement);
}
function indexof(value, search) {
  return value.indexOf(search);
}
function charat(value, index) {
  return value.charCodeAt(index) | 0;
}
function substr(value, begin, end) {
  return value.slice(begin, end);
}
function strlen(value) {
  return value.length;
}
function sizeof(value) {
  return value.length;
}
function append(value, array) {
  return array.push(value), value;
}
function combine(array, callback) {
  return array.map(callback).join("");
}
function filter(array, pattern) {
  return array.filter(function(value) {
    return !match(value, pattern);
  });
}
var line = 1;
var column = 1;
var length = 0;
var position = 0;
var character = 0;
var characters = "";
function node(value, root2, parent, type, props, children, length2, siblings3) {
  return { value, root: root2, parent, type, props, children, line, column, length: length2, return: "", siblings: siblings3 };
}
function copy(root2, props) {
  return assign(node("", null, null, "", null, null, 0, root2.siblings), root2, { length: -root2.length }, props);
}
function lift(root2) {
  while (root2.root)
    root2 = copy(root2.root, { children: [root2] });
  append(root2, root2.siblings);
}
function char() {
  return character;
}
function prev() {
  character = position > 0 ? charat(characters, --position) : 0;
  if (column--, character === 10)
    column = 1, line--;
  return character;
}
function next() {
  character = position < length ? charat(characters, position++) : 0;
  if (column++, character === 10)
    column = 1, line++;
  return character;
}
function peek() {
  return charat(characters, position);
}
function caret() {
  return position;
}
function slice(begin, end) {
  return substr(characters, begin, end);
}
function token(type) {
  switch (type) {
    case 0:
    case 9:
    case 10:
    case 13:
    case 32:
      return 5;
    case 33:
    case 43:
    case 44:
    case 47:
    case 62:
    case 64:
    case 126:
    case 59:
    case 123:
    case 125:
      return 4;
    case 58:
      return 3;
    case 34:
    case 39:
    case 40:
    case 91:
      return 2;
    case 41:
    case 93:
      return 1;
  }
  return 0;
}
function alloc(value) {
  return line = column = 1, length = strlen(characters = value), position = 0, [];
}
function dealloc(value) {
  return characters = "", value;
}
function delimit(type) {
  return trim(slice(position - 1, delimiter(type === 91 ? type + 2 : type === 40 ? type + 1 : type)));
}
function whitespace(type) {
  while (character = peek())
    if (character < 33)
      next();
    else
      break;
  return token(type) > 2 || token(character) > 3 ? "" : " ";
}
function escaping(index, count) {
  while (--count && next())
    if (character < 48 || character > 102 || character > 57 && character < 65 || character > 70 && character < 97)
      break;
  return slice(index, caret() + (count < 6 && peek() == 32 && next() == 32));
}
function delimiter(type) {
  while (next())
    switch (character) {
      case type:
        return position;
      case 34:
      case 39:
        if (type !== 34 && type !== 39)
          delimiter(character);
        break;
      case 40:
        if (type === 41)
          delimiter(type);
        break;
      case 92:
        next();
        break;
    }
  return position;
}
function commenter(type, index) {
  while (next())
    if (type + character === 47 + 10)
      break;
    else if (type + character === 42 + 42 && peek() === 47)
      break;
  return "/*" + slice(index, position - 1) + "*" + from(type === 47 ? type : next());
}
function identifier(index) {
  while (!token(peek()))
    next();
  return slice(index, position);
}
function compile(value) {
  return dealloc(parse("", null, null, null, [""], value = alloc(value), 0, [0], value));
}
function parse(value, root2, parent, rule, rules, rulesets, pseudo, points, declarations) {
  var index = 0;
  var offset = 0;
  var length2 = pseudo;
  var atrule = 0;
  var property = 0;
  var previous = 0;
  var variable = 1;
  var scanning = 1;
  var ampersand = 1;
  var character2 = 0;
  var type = "";
  var props = rules;
  var children = rulesets;
  var reference = rule;
  var characters2 = type;
  while (scanning)
    switch (previous = character2, character2 = next()) {
      case 40:
        if (previous != 108 && charat(characters2, length2 - 1) == 58) {
          if (indexof(characters2 += replace(delimit(character2), "&", "&\f"), "&\f") != -1)
            ampersand = -1;
          break;
        }
      case 34:
      case 39:
      case 91:
        characters2 += delimit(character2);
        break;
      case 9:
      case 10:
      case 13:
      case 32:
        characters2 += whitespace(previous);
        break;
      case 92:
        characters2 += escaping(caret() - 1, 7);
        continue;
      case 47:
        switch (peek()) {
          case 42:
          case 47:
            append(comment(commenter(next(), caret()), root2, parent, declarations), declarations);
            break;
          default:
            characters2 += "/";
        }
        break;
      case 123 * variable:
        points[index++] = strlen(characters2) * ampersand;
      case 125 * variable:
      case 59:
      case 0:
        switch (character2) {
          case 0:
          case 125:
            scanning = 0;
          case 59 + offset:
            if (ampersand == -1)
              characters2 = replace(characters2, /\f/g, "");
            if (property > 0 && strlen(characters2) - length2)
              append(property > 32 ? declaration(characters2 + ";", rule, parent, length2 - 1, declarations) : declaration(replace(characters2, " ", "") + ";", rule, parent, length2 - 2, declarations), declarations);
            break;
          case 59:
            characters2 += ";";
          default:
            append(reference = ruleset(characters2, root2, parent, index, offset, rules, points, type, props = [], children = [], length2, rulesets), rulesets);
            if (character2 === 123)
              if (offset === 0)
                parse(characters2, root2, reference, reference, props, rulesets, length2, points, children);
              else
                switch (atrule === 99 && charat(characters2, 3) === 110 ? 100 : atrule) {
                  case 100:
                  case 108:
                  case 109:
                  case 115:
                    parse(value, reference, reference, rule && append(ruleset(value, reference, reference, 0, 0, rules, points, type, rules, props = [], length2, children), children), rules, children, length2, points, rule ? props : children);
                    break;
                  default:
                    parse(characters2, reference, reference, reference, [""], children, 0, points, children);
                }
        }
        index = offset = property = 0, variable = ampersand = 1, type = characters2 = "", length2 = pseudo;
        break;
      case 58:
        length2 = 1 + strlen(characters2), property = previous;
      default:
        if (variable < 1) {
          if (character2 == 123)
            --variable;
          else if (character2 == 125 && variable++ == 0 && prev() == 125)
            continue;
        }
        switch (characters2 += from(character2), character2 * variable) {
          case 38:
            ampersand = offset > 0 ? 1 : (characters2 += "\f", -1);
            break;
          case 44:
            points[index++] = (strlen(characters2) - 1) * ampersand, ampersand = 1;
            break;
          case 64:
            if (peek() === 45)
              characters2 += delimit(next());
            atrule = peek(), offset = length2 = strlen(type = characters2 += identifier(caret())), character2++;
            break;
          case 45:
            if (previous === 45 && strlen(characters2) == 2)
              variable = 0;
        }
    }
  return rulesets;
}
function ruleset(value, root2, parent, index, offset, rules, points, type, props, children, length2, siblings3) {
  var post = offset - 1;
  var rule = offset === 0 ? rules : [""];
  var size2 = sizeof(rule);
  for (var i = 0, j2 = 0, k2 = 0; i < index; ++i)
    for (var x2 = 0, y2 = substr(value, post + 1, post = abs(j2 = points[i])), z2 = value; x2 < size2; ++x2)
      if (z2 = trim(j2 > 0 ? rule[x2] + " " + y2 : replace(y2, /&\f/g, rule[x2])))
        props[k2++] = z2;
  return node(value, root2, parent, offset === 0 ? RULESET : type, props, children, length2, siblings3);
}
function comment(value, root2, parent, siblings3) {
  return node(value, root2, parent, COMMENT, from(char()), substr(value, 2, -2), 0, siblings3);
}
function declaration(value, root2, parent, length2, siblings3) {
  return node(value, root2, parent, DECLARATION, substr(value, 0, length2), substr(value, length2 + 1, -1), length2, siblings3);
}
function prefix$1(value, length2, children) {
  switch (hash(value, length2)) {
    case 5103:
      return WEBKIT + "print-" + value + value;
    case 5737:
    case 4201:
    case 3177:
    case 3433:
    case 1641:
    case 4457:
    case 2921:
    case 5572:
    case 6356:
    case 5844:
    case 3191:
    case 6645:
    case 3005:
    case 6391:
    case 5879:
    case 5623:
    case 6135:
    case 4599:
    case 4855:
    case 4215:
    case 6389:
    case 5109:
    case 5365:
    case 5621:
    case 3829:
      return WEBKIT + value + value;
    case 4789:
      return MOZ + value + value;
    case 5349:
    case 4246:
    case 4810:
    case 6968:
    case 2756:
      return WEBKIT + value + MOZ + value + MS + value + value;
    case 5936:
      switch (charat(value, length2 + 11)) {
        case 114:
          return WEBKIT + value + MS + replace(value, /[svh]\w+-[tblr]{2}/, "tb") + value;
        case 108:
          return WEBKIT + value + MS + replace(value, /[svh]\w+-[tblr]{2}/, "tb-rl") + value;
        case 45:
          return WEBKIT + value + MS + replace(value, /[svh]\w+-[tblr]{2}/, "lr") + value;
      }
    case 6828:
    case 4268:
    case 2903:
      return WEBKIT + value + MS + value + value;
    case 6165:
      return WEBKIT + value + MS + "flex-" + value + value;
    case 5187:
      return WEBKIT + value + replace(value, /(\w+).+(:[^]+)/, WEBKIT + "box-$1$2" + MS + "flex-$1$2") + value;
    case 5443:
      return WEBKIT + value + MS + "flex-item-" + replace(value, /flex-|-self/g, "") + (!match(value, /flex-|baseline/) ? MS + "grid-row-" + replace(value, /flex-|-self/g, "") : "") + value;
    case 4675:
      return WEBKIT + value + MS + "flex-line-pack" + replace(value, /align-content|flex-|-self/g, "") + value;
    case 5548:
      return WEBKIT + value + MS + replace(value, "shrink", "negative") + value;
    case 5292:
      return WEBKIT + value + MS + replace(value, "basis", "preferred-size") + value;
    case 6060:
      return WEBKIT + "box-" + replace(value, "-grow", "") + WEBKIT + value + MS + replace(value, "grow", "positive") + value;
    case 4554:
      return WEBKIT + replace(value, /([^-])(transform)/g, "$1" + WEBKIT + "$2") + value;
    case 6187:
      return replace(replace(replace(value, /(zoom-|grab)/, WEBKIT + "$1"), /(image-set)/, WEBKIT + "$1"), value, "") + value;
    case 5495:
    case 3959:
      return replace(value, /(image-set\([^]*)/, WEBKIT + "$1$`$1");
    case 4968:
      return replace(replace(value, /(.+:)(flex-)?(.*)/, WEBKIT + "box-pack:$3" + MS + "flex-pack:$3"), /s.+-b[^;]+/, "justify") + WEBKIT + value + value;
    case 4200:
      if (!match(value, /flex-|baseline/))
        return MS + "grid-column-align" + substr(value, length2) + value;
      break;
    case 2592:
    case 3360:
      return MS + replace(value, "template-", "") + value;
    case 4384:
    case 3616:
      if (children && children.some(function(element, index) {
        return length2 = index, match(element.props, /grid-\w+-end/);
      })) {
        return ~indexof(value + (children = children[length2].value), "span") ? value : MS + replace(value, "-start", "") + value + MS + "grid-row-span:" + (~indexof(children, "span") ? match(children, /\d+/) : +match(children, /\d+/) - +match(value, /\d+/)) + ";";
      }
      return MS + replace(value, "-start", "") + value;
    case 4896:
    case 4128:
      return children && children.some(function(element) {
        return match(element.props, /grid-\w+-start/);
      }) ? value : MS + replace(replace(value, "-end", "-span"), "span ", "") + value;
    case 4095:
    case 3583:
    case 4068:
    case 2532:
      return replace(value, /(.+)-inline(.+)/, WEBKIT + "$1$2") + value;
    case 8116:
    case 7059:
    case 5753:
    case 5535:
    case 5445:
    case 5701:
    case 4933:
    case 4677:
    case 5533:
    case 5789:
    case 5021:
    case 4765:
      if (strlen(value) - 1 - length2 > 6)
        switch (charat(value, length2 + 1)) {
          case 109:
            if (charat(value, length2 + 4) !== 45)
              break;
          case 102:
            return replace(value, /(.+:)(.+)-([^]+)/, "$1" + WEBKIT + "$2-$3$1" + MOZ + (charat(value, length2 + 3) == 108 ? "$3" : "$2-$3")) + value;
          case 115:
            return ~indexof(value, "stretch") ? prefix$1(replace(value, "stretch", "fill-available"), length2, children) + value : value;
        }
      break;
    case 5152:
    case 5920:
      return replace(value, /(.+?):(\d+)(\s*\/\s*(span)?\s*(\d+))?(.*)/, function(_2, a, b, c, d, e, f2) {
        return MS + a + ":" + b + f2 + (c ? MS + a + "-span:" + (d ? e : +e - +b) + f2 : "") + value;
      });
    case 4949:
      if (charat(value, length2 + 6) === 121)
        return replace(value, ":", ":" + WEBKIT) + value;
      break;
    case 6444:
      switch (charat(value, charat(value, 14) === 45 ? 18 : 11)) {
        case 120:
          return replace(value, /(.+:)([^;\s!]+)(;|(\s+)?!.+)?/, "$1" + WEBKIT + (charat(value, 14) === 45 ? "inline-" : "") + "box$3$1" + WEBKIT + "$2$3$1" + MS + "$2box$3") + value;
        case 100:
          return replace(value, ":", ":" + MS) + value;
      }
      break;
    case 5719:
    case 2647:
    case 2135:
    case 3927:
    case 2391:
      return replace(value, "scroll-", "scroll-snap-") + value;
  }
  return value;
}
function serialize(children, callback) {
  var output = "";
  for (var i = 0; i < children.length; i++)
    output += callback(children[i], i, children, callback) || "";
  return output;
}
function stringify(element, index, children, callback) {
  switch (element.type) {
    case LAYER:
      if (element.children.length)
        break;
    case IMPORT:
    case DECLARATION:
      return element.return = element.return || element.value;
    case COMMENT:
      return "";
    case KEYFRAMES:
      return element.return = element.value + "{" + serialize(element.children, callback) + "}";
    case RULESET:
      if (!strlen(element.value = element.props.join(",")))
        return "";
  }
  return strlen(children = serialize(element.children, callback)) ? element.return = element.value + "{" + children + "}" : "";
}
function middleware(collection) {
  var length2 = sizeof(collection);
  return function(element, index, children, callback) {
    var output = "";
    for (var i = 0; i < length2; i++)
      output += collection[i](element, index, children, callback) || "";
    return output;
  };
}
function rulesheet(callback) {
  return function(element) {
    if (!element.root) {
      if (element = element.return)
        callback(element);
    }
  };
}
function prefixer(element, index, children, callback) {
  if (element.length > -1) {
    if (!element.return)
      switch (element.type) {
        case DECLARATION:
          element.return = prefix$1(element.value, element.length, children);
          return;
        case KEYFRAMES:
          return serialize([copy(element, { value: replace(element.value, "@", "@" + WEBKIT) })], callback);
        case RULESET:
          if (element.length)
            return combine(children = element.props, function(value) {
              switch (match(value, callback = /(::plac\w+|:read-\w+)/)) {
                case ":read-only":
                case ":read-write":
                  lift(copy(element, { props: [replace(value, /:(read-\w+)/, ":" + MOZ + "$1")] }));
                  lift(copy(element, { props: [value] }));
                  assign(element, { props: filter(children, callback) });
                  break;
                case "::placeholder":
                  lift(copy(element, { props: [replace(value, /:(plac\w+)/, ":" + WEBKIT + "input-$1")] }));
                  lift(copy(element, { props: [replace(value, /:(plac\w+)/, ":" + MOZ + "$1")] }));
                  lift(copy(element, { props: [replace(value, /:(plac\w+)/, MS + "input-$1")] }));
                  lift(copy(element, { props: [value] }));
                  assign(element, { props: filter(children, callback) });
                  break;
              }
              return "";
            });
      }
  }
}
var unitlessKeys = {
  animationIterationCount: 1,
  aspectRatio: 1,
  borderImageOutset: 1,
  borderImageSlice: 1,
  borderImageWidth: 1,
  boxFlex: 1,
  boxFlexGroup: 1,
  boxOrdinalGroup: 1,
  columnCount: 1,
  columns: 1,
  flex: 1,
  flexGrow: 1,
  flexPositive: 1,
  flexShrink: 1,
  flexNegative: 1,
  flexOrder: 1,
  gridRow: 1,
  gridRowEnd: 1,
  gridRowSpan: 1,
  gridRowStart: 1,
  gridColumn: 1,
  gridColumnEnd: 1,
  gridColumnSpan: 1,
  gridColumnStart: 1,
  msGridRow: 1,
  msGridRowSpan: 1,
  msGridColumn: 1,
  msGridColumnSpan: 1,
  fontWeight: 1,
  lineHeight: 1,
  opacity: 1,
  order: 1,
  orphans: 1,
  tabSize: 1,
  widows: 1,
  zIndex: 1,
  zoom: 1,
  WebkitLineClamp: 1,
  // SVG-related properties
  fillOpacity: 1,
  floodOpacity: 1,
  stopOpacity: 1,
  strokeDasharray: 1,
  strokeDashoffset: 1,
  strokeMiterlimit: 1,
  strokeOpacity: 1,
  strokeWidth: 1
};
var f = "undefined" != typeof dist.process && void 0 !== dist.process.env && ({}.REACT_APP_SC_ATTR || {}.SC_ATTR) || "data-styled", y = "undefined" != typeof window && "HTMLElement" in window, v = Boolean("boolean" == typeof SC_DISABLE_SPEEDY ? SC_DISABLE_SPEEDY : "undefined" != typeof dist.process && void 0 !== dist.process.env && void 0 !== {}.REACT_APP_SC_DISABLE_SPEEDY && "" !== {}.REACT_APP_SC_DISABLE_SPEEDY ? "false" !== {}.REACT_APP_SC_DISABLE_SPEEDY && {}.REACT_APP_SC_DISABLE_SPEEDY : "undefined" != typeof dist.process && void 0 !== dist.process.env && void 0 !== {}.SC_DISABLE_SPEEDY && "" !== {}.SC_DISABLE_SPEEDY ? "false" !== {}.SC_DISABLE_SPEEDY && {}.SC_DISABLE_SPEEDY : false), E = Object.freeze([]), N = Object.freeze({});
function P(e, t2, n2) {
  return void 0 === n2 && (n2 = N), e.theme !== n2.theme && e.theme || t2 || n2.theme;
}
var _ = /* @__PURE__ */ new Set(["a", "abbr", "address", "area", "article", "aside", "audio", "b", "base", "bdi", "bdo", "big", "blockquote", "body", "br", "button", "canvas", "caption", "cite", "code", "col", "colgroup", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "div", "dl", "dt", "em", "embed", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hgroup", "hr", "html", "i", "iframe", "img", "input", "ins", "kbd", "keygen", "label", "legend", "li", "link", "main", "map", "mark", "menu", "menuitem", "meta", "meter", "nav", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "script", "section", "select", "small", "source", "span", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "u", "ul", "use", "var", "video", "wbr", "circle", "clipPath", "defs", "ellipse", "foreignObject", "g", "image", "line", "linearGradient", "marker", "mask", "path", "pattern", "polygon", "polyline", "radialGradient", "rect", "stop", "svg", "text", "tspan"]), C = /[!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~-]+/g, I = /(^-|-$)/g;
function A$1(e) {
  return e.replace(C, "-").replace(I, "");
}
var O = /(a)(d)/gi, D = function(e) {
  return String.fromCharCode(e + (e > 25 ? 39 : 97));
};
function R(e) {
  var t2, n2 = "";
  for (t2 = Math.abs(e); t2 > 52; t2 = t2 / 52 | 0)
    n2 = D(t2 % 52) + n2;
  return (D(t2 % 52) + n2).replace(O, "$1-$2");
}
var T, k = function(e, t2) {
  for (var n2 = t2.length; n2; )
    e = 33 * e ^ t2.charCodeAt(--n2);
  return e;
}, j = function(e) {
  return k(5381, e);
};
function x(e) {
  return R(j(e) >>> 0);
}
function V(e) {
  return e.displayName || e.name || "Component";
}
function F(e) {
  return "string" == typeof e && true;
}
var M = "function" == typeof Symbol && Symbol.for, $ = M ? Symbol.for("react.memo") : 60115, z = M ? Symbol.for("react.forward_ref") : 60112, B = { childContextTypes: true, contextType: true, contextTypes: true, defaultProps: true, displayName: true, getDefaultProps: true, getDerivedStateFromError: true, getDerivedStateFromProps: true, mixins: true, propTypes: true, type: true }, L = { name: true, length: true, prototype: true, caller: true, callee: true, arguments: true, arity: true }, G = { $$typeof: true, compare: true, defaultProps: true, displayName: true, propTypes: true, type: true }, Y = ((T = {})[z] = { $$typeof: true, render: true, defaultProps: true, displayName: true, propTypes: true }, T[$] = G, T);
function W(e) {
  return ("type" in (t2 = e) && t2.type.$$typeof) === $ ? G : "$$typeof" in e ? Y[e.$$typeof] : B;
  var t2;
}
var q = Object.defineProperty, H = Object.getOwnPropertyNames, U = Object.getOwnPropertySymbols, J = Object.getOwnPropertyDescriptor, X = Object.getPrototypeOf, Z = Object.prototype;
function K(e, t2, n2) {
  if ("string" != typeof t2) {
    if (Z) {
      var o = X(t2);
      o && o !== Z && K(e, o, n2);
    }
    var r2 = H(t2);
    U && (r2 = r2.concat(U(t2)));
    for (var s = W(e), i = W(t2), a = 0; a < r2.length; ++a) {
      var c = r2[a];
      if (!(c in L || n2 && n2[c] || i && c in i || s && c in s)) {
        var l2 = J(t2, c);
        try {
          q(e, c, l2);
        } catch (e2) {
        }
      }
    }
  }
  return e;
}
function Q(e) {
  return "function" == typeof e;
}
function ee(e) {
  return "object" == typeof e && "styledComponentId" in e;
}
function te(e, t2) {
  return e && t2 ? "".concat(e, " ").concat(t2) : e || t2 || "";
}
function ne(e, t2) {
  if (0 === e.length)
    return "";
  for (var n2 = e[0], o = 1; o < e.length; o++)
    n2 += t2 ? t2 + e[o] : e[o];
  return n2;
}
function oe(e) {
  return null !== e && "object" == typeof e && e.constructor.name === Object.name && !("props" in e && e.$$typeof);
}
function re(e, t2, n2) {
  if (void 0 === n2 && (n2 = false), !n2 && !oe(e) && !Array.isArray(e))
    return t2;
  if (Array.isArray(t2))
    for (var o = 0; o < t2.length; o++)
      e[o] = re(e[o], t2[o]);
  else if (oe(t2))
    for (var o in t2)
      e[o] = re(e[o], t2[o]);
  return e;
}
function se(e, t2) {
  Object.defineProperty(e, "toString", { value: t2 });
}
function ce(t2) {
  for (var n2 = [], o = 1; o < arguments.length; o++)
    n2[o - 1] = arguments[o];
  return new Error("An error occurred. See https://github.com/styled-components/styled-components/blob/main/packages/styled-components/src/utils/errors.md#".concat(t2, " for more information.").concat(n2.length > 0 ? " Args: ".concat(n2.join(", ")) : ""));
}
var le = function() {
  function e(e2) {
    this.groupSizes = new Uint32Array(512), this.length = 512, this.tag = e2;
  }
  return e.prototype.indexOfGroup = function(e2) {
    for (var t2 = 0, n2 = 0; n2 < e2; n2++)
      t2 += this.groupSizes[n2];
    return t2;
  }, e.prototype.insertRules = function(e2, t2) {
    if (e2 >= this.groupSizes.length) {
      for (var n2 = this.groupSizes, o = n2.length, r2 = o; e2 >= r2; )
        if ((r2 <<= 1) < 0)
          throw ce(16, "".concat(e2));
      this.groupSizes = new Uint32Array(r2), this.groupSizes.set(n2), this.length = r2;
      for (var s = o; s < r2; s++)
        this.groupSizes[s] = 0;
    }
    for (var i = this.indexOfGroup(e2 + 1), a = (s = 0, t2.length); s < a; s++)
      this.tag.insertRule(i, t2[s]) && (this.groupSizes[e2]++, i++);
  }, e.prototype.clearGroup = function(e2) {
    if (e2 < this.length) {
      var t2 = this.groupSizes[e2], n2 = this.indexOfGroup(e2), o = n2 + t2;
      this.groupSizes[e2] = 0;
      for (var r2 = n2; r2 < o; r2++)
        this.tag.deleteRule(n2);
    }
  }, e.prototype.getGroup = function(e2) {
    var t2 = "";
    if (e2 >= this.length || 0 === this.groupSizes[e2])
      return t2;
    for (var n2 = this.groupSizes[e2], o = this.indexOfGroup(e2), r2 = o + n2, s = o; s < r2; s++)
      t2 += "".concat(this.tag.getRule(s)).concat("/*!sc*/\n");
    return t2;
  }, e;
}(), ue = /* @__PURE__ */ new Map(), pe = /* @__PURE__ */ new Map(), de = 1, he = function(e) {
  if (ue.has(e))
    return ue.get(e);
  for (; pe.has(de); )
    de++;
  var t2 = de++;
  return ue.set(e, t2), pe.set(t2, e), t2;
}, fe = function(e, t2) {
  de = t2 + 1, ue.set(e, t2), pe.set(t2, e);
}, me = "style[".concat(f, "][").concat("data-styled-version", '="').concat("6.1.1", '"]'), ye = new RegExp("^".concat(f, '\\.g(\\d+)\\[id="([\\w\\d-]+)"\\].*?"([^"]*)')), ve = function(e, t2, n2) {
  for (var o, r2 = n2.split(","), s = 0, i = r2.length; s < i; s++)
    (o = r2[s]) && e.registerName(t2, o);
}, ge = function(e, t2) {
  for (var n2, o = (null !== (n2 = t2.textContent) && void 0 !== n2 ? n2 : "").split("/*!sc*/\n"), r2 = [], s = 0, i = o.length; s < i; s++) {
    var a = o[s].trim();
    if (a) {
      var c = a.match(ye);
      if (c) {
        var l2 = 0 | parseInt(c[1], 10), u2 = c[2];
        0 !== l2 && (fe(u2, l2), ve(e, u2, c[3]), e.getTag().insertRules(l2, r2)), r2.length = 0;
      } else
        r2.push(a);
    }
  }
};
function Se() {
  return "undefined" != typeof __webpack_nonce__ ? __webpack_nonce__ : null;
}
var we = function(e) {
  var t2 = document.head, n2 = e || t2, o = document.createElement("style"), r2 = function(e2) {
    var t3 = Array.from(e2.querySelectorAll("style[".concat(f, "]")));
    return t3[t3.length - 1];
  }(n2), s = void 0 !== r2 ? r2.nextSibling : null;
  o.setAttribute(f, "active"), o.setAttribute("data-styled-version", "6.1.1");
  var i = Se();
  return i && o.setAttribute("nonce", i), n2.insertBefore(o, s), o;
}, be = function() {
  function e(e2) {
    this.element = we(e2), this.element.appendChild(document.createTextNode("")), this.sheet = function(e3) {
      if (e3.sheet)
        return e3.sheet;
      for (var t2 = document.styleSheets, n2 = 0, o = t2.length; n2 < o; n2++) {
        var r2 = t2[n2];
        if (r2.ownerNode === e3)
          return r2;
      }
      throw ce(17);
    }(this.element), this.length = 0;
  }
  return e.prototype.insertRule = function(e2, t2) {
    try {
      return this.sheet.insertRule(t2, e2), this.length++, true;
    } catch (e3) {
      return false;
    }
  }, e.prototype.deleteRule = function(e2) {
    this.sheet.deleteRule(e2), this.length--;
  }, e.prototype.getRule = function(e2) {
    var t2 = this.sheet.cssRules[e2];
    return t2 && t2.cssText ? t2.cssText : "";
  }, e;
}(), Ee = function() {
  function e(e2) {
    this.element = we(e2), this.nodes = this.element.childNodes, this.length = 0;
  }
  return e.prototype.insertRule = function(e2, t2) {
    if (e2 <= this.length && e2 >= 0) {
      var n2 = document.createTextNode(t2);
      return this.element.insertBefore(n2, this.nodes[e2] || null), this.length++, true;
    }
    return false;
  }, e.prototype.deleteRule = function(e2) {
    this.element.removeChild(this.nodes[e2]), this.length--;
  }, e.prototype.getRule = function(e2) {
    return e2 < this.length ? this.nodes[e2].textContent : "";
  }, e;
}(), Ne = function() {
  function e(e2) {
    this.rules = [], this.length = 0;
  }
  return e.prototype.insertRule = function(e2, t2) {
    return e2 <= this.length && (this.rules.splice(e2, 0, t2), this.length++, true);
  }, e.prototype.deleteRule = function(e2) {
    this.rules.splice(e2, 1), this.length--;
  }, e.prototype.getRule = function(e2) {
    return e2 < this.length ? this.rules[e2] : "";
  }, e;
}(), Pe = y, _e = { isServer: !y, useCSSOMInjection: !v }, Ce = function() {
  function e(e2, n2, o) {
    void 0 === e2 && (e2 = N), void 0 === n2 && (n2 = {});
    var r2 = this;
    this.options = __assign$2(__assign$2({}, _e), e2), this.gs = n2, this.names = new Map(o), this.server = !!e2.isServer, !this.server && y && Pe && (Pe = false, function(e3) {
      for (var t2 = document.querySelectorAll(me), n3 = 0, o2 = t2.length; n3 < o2; n3++) {
        var r3 = t2[n3];
        r3 && "active" !== r3.getAttribute(f) && (ge(e3, r3), r3.parentNode && r3.parentNode.removeChild(r3));
      }
    }(this)), se(this, function() {
      return function(e3) {
        for (var t2 = e3.getTag(), n3 = t2.length, o2 = "", r3 = function(n4) {
          var r4 = function(e4) {
            return pe.get(e4);
          }(n4);
          if (void 0 === r4)
            return "continue";
          var s2 = e3.names.get(r4), i = t2.getGroup(n4);
          if (void 0 === s2 || 0 === i.length)
            return "continue";
          var a = "".concat(f, ".g").concat(n4, '[id="').concat(r4, '"]'), c = "";
          void 0 !== s2 && s2.forEach(function(e4) {
            e4.length > 0 && (c += "".concat(e4, ","));
          }), o2 += "".concat(i).concat(a, '{content:"').concat(c, '"}').concat("/*!sc*/\n");
        }, s = 0; s < n3; s++)
          r3(s);
        return o2;
      }(r2);
    });
  }
  return e.registerId = function(e2) {
    return he(e2);
  }, e.prototype.reconstructWithOptions = function(n2, o) {
    return void 0 === o && (o = true), new e(__assign$2(__assign$2({}, this.options), n2), this.gs, o && this.names || void 0);
  }, e.prototype.allocateGSInstance = function(e2) {
    return this.gs[e2] = (this.gs[e2] || 0) + 1;
  }, e.prototype.getTag = function() {
    return this.tag || (this.tag = (e2 = function(e3) {
      var t2 = e3.useCSSOMInjection, n2 = e3.target;
      return e3.isServer ? new Ne(n2) : t2 ? new be(n2) : new Ee(n2);
    }(this.options), new le(e2)));
    var e2;
  }, e.prototype.hasNameForId = function(e2, t2) {
    return this.names.has(e2) && this.names.get(e2).has(t2);
  }, e.prototype.registerName = function(e2, t2) {
    if (he(e2), this.names.has(e2))
      this.names.get(e2).add(t2);
    else {
      var n2 = /* @__PURE__ */ new Set();
      n2.add(t2), this.names.set(e2, n2);
    }
  }, e.prototype.insertRules = function(e2, t2, n2) {
    this.registerName(e2, t2), this.getTag().insertRules(he(e2), n2);
  }, e.prototype.clearNames = function(e2) {
    this.names.has(e2) && this.names.get(e2).clear();
  }, e.prototype.clearRules = function(e2) {
    this.getTag().clearGroup(he(e2)), this.clearNames(e2);
  }, e.prototype.clearTag = function() {
    this.tag = void 0;
  }, e;
}(), Ie = /&/g, Ae = /^\s*\/\/.*$/gm;
function Oe(e, t2) {
  return e.map(function(e2) {
    return "rule" === e2.type && (e2.value = "".concat(t2, " ").concat(e2.value), e2.value = e2.value.replaceAll(",", ",".concat(t2, " ")), e2.props = e2.props.map(function(e3) {
      return "".concat(t2, " ").concat(e3);
    })), Array.isArray(e2.children) && "@keyframes" !== e2.type && (e2.children = Oe(e2.children, t2)), e2;
  });
}
function De(e) {
  var t2, n2, o, r2 = void 0 === e ? N : e, s = r2.options, i = void 0 === s ? N : s, a = r2.plugins, c = void 0 === a ? E : a, l2 = function(e2, o2, r3) {
    return r3 === n2 || r3.startsWith(n2) && r3.endsWith(n2) && r3.replaceAll(n2, "").length > 0 ? ".".concat(t2) : e2;
  }, u2 = c.slice();
  u2.push(function(e2) {
    e2.type === RULESET && e2.value.includes("&") && (e2.props[0] = e2.props[0].replace(Ie, n2).replace(o, l2));
  }), i.prefix && u2.push(prefixer), u2.push(stringify);
  var p2 = function(e2, r3, s2, a2) {
    void 0 === r3 && (r3 = ""), void 0 === s2 && (s2 = ""), void 0 === a2 && (a2 = "&"), t2 = a2, n2 = r3, o = new RegExp("\\".concat(n2, "\\b"), "g");
    var c2 = e2.replace(Ae, ""), l3 = compile(s2 || r3 ? "".concat(s2, " ").concat(r3, " { ").concat(c2, " }") : c2);
    i.namespace && (l3 = Oe(l3, i.namespace));
    var p3 = [];
    return serialize(l3, middleware(u2.concat(rulesheet(function(e3) {
      return p3.push(e3);
    })))), p3;
  };
  return p2.hash = c.length ? c.reduce(function(e2, t3) {
    return t3.name || ce(15), k(e2, t3.name);
  }, 5381).toString() : "", p2;
}
var Re = new Ce(), Te = De(), ke = React.createContext({ shouldForwardProp: void 0, styleSheet: Re, stylis: Te });
ke.Consumer;
React.createContext(void 0);
function Ve() {
  return reactExports.useContext(ke);
}
var Me = function() {
  function e(e2, t2) {
    var n2 = this;
    this.inject = function(e3, t3) {
      void 0 === t3 && (t3 = Te);
      var o = n2.name + t3.hash;
      e3.hasNameForId(n2.id, o) || e3.insertRules(n2.id, o, t3(n2.rules, o, "@keyframes"));
    }, this.name = e2, this.id = "sc-keyframes-".concat(e2), this.rules = t2, se(this, function() {
      throw ce(12, String(n2.name));
    });
  }
  return e.prototype.getName = function(e2) {
    return void 0 === e2 && (e2 = Te), this.name + e2.hash;
  }, e;
}(), $e = function(e) {
  return e >= "A" && e <= "Z";
};
function ze(e) {
  for (var t2 = "", n2 = 0; n2 < e.length; n2++) {
    var o = e[n2];
    if (1 === n2 && "-" === o && "-" === e[0])
      return e;
    $e(o) ? t2 += "-" + o.toLowerCase() : t2 += o;
  }
  return t2.startsWith("ms-") ? "-" + t2 : t2;
}
var Be = function(e) {
  return null == e || false === e || "" === e;
}, Le = function(t2) {
  var n2, o, r2 = [];
  for (var s in t2) {
    var i = t2[s];
    t2.hasOwnProperty(s) && !Be(i) && (Array.isArray(i) && i.isCss || Q(i) ? r2.push("".concat(ze(s), ":"), i, ";") : oe(i) ? r2.push.apply(r2, __spreadArray(__spreadArray(["".concat(s, " {")], Le(i), false), ["}"], false)) : r2.push("".concat(ze(s), ": ").concat((n2 = s, null == (o = i) || "boolean" == typeof o || "" === o ? "" : "number" != typeof o || 0 === o || n2 in unitlessKeys || n2.startsWith("--") ? String(o).trim() : "".concat(o, "px")), ";")));
  }
  return r2;
};
function Ge(e, t2, n2, o) {
  if (Be(e))
    return [];
  if (ee(e))
    return [".".concat(e.styledComponentId)];
  if (Q(e)) {
    if (!Q(s = e) || s.prototype && s.prototype.isReactComponent || !t2)
      return [e];
    var r2 = e(t2);
    return Ge(r2, t2, n2, o);
  }
  var s;
  return e instanceof Me ? n2 ? (e.inject(n2, o), [e.getName(o)]) : [e] : oe(e) ? Le(e) : Array.isArray(e) ? Array.prototype.concat.apply(E, e.map(function(e2) {
    return Ge(e2, t2, n2, o);
  })) : [e.toString()];
}
function Ye(e) {
  for (var t2 = 0; t2 < e.length; t2 += 1) {
    var n2 = e[t2];
    if (Q(n2) && !ee(n2))
      return false;
  }
  return true;
}
var We = j("6.1.1"), qe = function() {
  function e(e2, t2, n2) {
    this.rules = e2, this.staticRulesId = "", this.isStatic = (void 0 === n2 || n2.isStatic) && Ye(e2), this.componentId = t2, this.baseHash = k(We, t2), this.baseStyle = n2, Ce.registerId(t2);
  }
  return e.prototype.generateAndInjectStyles = function(e2, t2, n2) {
    var o = this.baseStyle ? this.baseStyle.generateAndInjectStyles(e2, t2, n2) : "";
    if (this.isStatic && !n2.hash)
      if (this.staticRulesId && t2.hasNameForId(this.componentId, this.staticRulesId))
        o = te(o, this.staticRulesId);
      else {
        var r2 = ne(Ge(this.rules, e2, t2, n2)), s = R(k(this.baseHash, r2) >>> 0);
        if (!t2.hasNameForId(this.componentId, s)) {
          var i = n2(r2, ".".concat(s), void 0, this.componentId);
          t2.insertRules(this.componentId, s, i);
        }
        o = te(o, s), this.staticRulesId = s;
      }
    else {
      for (var a = k(this.baseHash, n2.hash), c = "", l2 = 0; l2 < this.rules.length; l2++) {
        var u2 = this.rules[l2];
        if ("string" == typeof u2)
          c += u2;
        else if (u2) {
          var p2 = ne(Ge(u2, e2, t2, n2));
          a = k(a, p2 + l2), c += p2;
        }
      }
      if (c) {
        var d = R(a >>> 0);
        t2.hasNameForId(this.componentId, d) || t2.insertRules(this.componentId, d, n2(c, ".".concat(d), void 0, this.componentId)), o = te(o, d);
      }
    }
    return o;
  }, e;
}(), He = React.createContext(void 0);
He.Consumer;
var Ze = {}, Ke = /* @__PURE__ */ new Set();
function Qe(e, r2, s) {
  var i = ee(e), a = e, c = !F(e), p2 = r2.attrs, d = void 0 === p2 ? E : p2, h = r2.componentId, f2 = void 0 === h ? function(e2, t2) {
    var n2 = "string" != typeof e2 ? "sc" : A$1(e2);
    Ze[n2] = (Ze[n2] || 0) + 1;
    var o = "".concat(n2, "-").concat(x("6.1.1" + n2 + Ze[n2]));
    return t2 ? "".concat(t2, "-").concat(o) : o;
  }(r2.displayName, r2.parentComponentId) : h, m2 = r2.displayName, y2 = void 0 === m2 ? function(e2) {
    return F(e2) ? "styled.".concat(e2) : "Styled(".concat(V(e2), ")");
  }(e) : m2, v2 = r2.displayName && r2.componentId ? "".concat(A$1(r2.displayName), "-").concat(r2.componentId) : r2.componentId || f2, g = i && a.attrs ? a.attrs.concat(d).filter(Boolean) : d, S2 = r2.shouldForwardProp;
  if (i && a.shouldForwardProp) {
    var w2 = a.shouldForwardProp;
    if (r2.shouldForwardProp) {
      var C2 = r2.shouldForwardProp;
      S2 = function(e2, t2) {
        return w2(e2, t2) && C2(e2, t2);
      };
    } else
      S2 = w2;
  }
  var I2 = new qe(s, v2, i ? a.componentStyle : void 0);
  function O2(e2, r3) {
    return function(e3, r4, s2) {
      var i2 = e3.attrs, a2 = e3.componentStyle, c2 = e3.defaultProps, p3 = e3.foldedComponentIds, d2 = e3.styledComponentId, h2 = e3.target, f3 = React.useContext(He), m3 = Ve(), y3 = e3.shouldForwardProp || m3.shouldForwardProp;
      var v3 = function(e4, n2, o) {
        for (var r5, s3 = __assign$2(__assign$2({}, n2), { className: void 0, theme: o }), i3 = 0; i3 < e4.length; i3 += 1) {
          var a3 = Q(r5 = e4[i3]) ? r5(s3) : r5;
          for (var c3 in a3)
            s3[c3] = "className" === c3 ? te(s3[c3], a3[c3]) : "style" === c3 ? __assign$2(__assign$2({}, s3[c3]), a3[c3]) : a3[c3];
        }
        return n2.className && (s3.className = te(s3.className, n2.className)), s3;
      }(i2, r4, P(r4, f3, c2) || N), g2 = v3.as || h2, S3 = {};
      for (var w3 in v3)
        void 0 === v3[w3] || "$" === w3[0] || "as" === w3 || "theme" === w3 || ("forwardedAs" === w3 ? S3.as = v3.forwardedAs : y3 && !y3(w3, g2) || (S3[w3] = v3[w3], y3 || true));
      var b = function(e4, t2) {
        var n2 = Ve(), o = e4.generateAndInjectStyles(t2, n2.styleSheet, n2.stylis);
        return o;
      }(a2, v3);
      var E2 = te(p3, d2);
      return b && (E2 += " " + b), v3.className && (E2 += " " + v3.className), S3[F(g2) && !_.has(g2) ? "class" : "className"] = E2, S3.ref = s2, reactExports.createElement(g2, S3);
    }(D2, e2, r3);
  }
  O2.displayName = y2;
  var D2 = React.forwardRef(O2);
  return D2.attrs = g, D2.componentStyle = I2, D2.displayName = y2, D2.shouldForwardProp = S2, D2.foldedComponentIds = i ? te(a.foldedComponentIds, a.styledComponentId) : "", D2.styledComponentId = v2, D2.target = i ? a.target : e, Object.defineProperty(D2, "defaultProps", { get: function() {
    return this._foldedDefaultProps;
  }, set: function(e2) {
    this._foldedDefaultProps = i ? function(e3) {
      for (var t2 = [], n2 = 1; n2 < arguments.length; n2++)
        t2[n2 - 1] = arguments[n2];
      for (var o = 0, r3 = t2; o < r3.length; o++)
        re(e3, r3[o], true);
      return e3;
    }({}, a.defaultProps, e2) : e2;
  } }), se(D2, function() {
    return ".".concat(D2.styledComponentId);
  }), c && K(D2, e, { attrs: true, componentStyle: true, displayName: true, foldedComponentIds: true, shouldForwardProp: true, styledComponentId: true, target: true }), D2;
}
function et(e, t2) {
  for (var n2 = [e[0]], o = 0, r2 = t2.length; o < r2; o += 1)
    n2.push(t2[o], e[o + 1]);
  return n2;
}
var tt = function(e) {
  return Object.assign(e, { isCss: true });
};
function nt(t2) {
  for (var n2 = [], o = 1; o < arguments.length; o++)
    n2[o - 1] = arguments[o];
  if (Q(t2) || oe(t2)) {
    var r2 = t2;
    return tt(Ge(et(E, __spreadArray([r2], n2, true))));
  }
  var s = t2;
  return 0 === n2.length && 1 === s.length && "string" == typeof s[0] ? Ge(s) : tt(Ge(et(s, n2)));
}
function ot(n2, o, r2) {
  if (void 0 === r2 && (r2 = N), !o)
    throw ce(1, o);
  var s = function(t2) {
    for (var s2 = [], i = 1; i < arguments.length; i++)
      s2[i - 1] = arguments[i];
    return n2(o, r2, nt.apply(void 0, __spreadArray([t2], s2, false)));
  };
  return s.attrs = function(e) {
    return ot(n2, o, __assign$2(__assign$2({}, r2), { attrs: Array.prototype.concat(r2.attrs, e).filter(Boolean) }));
  }, s.withConfig = function(e) {
    return ot(n2, o, __assign$2(__assign$2({}, r2), e));
  }, s;
}
var rt = function(e) {
  return ot(Qe, e);
}, st = rt;
_.forEach(function(e) {
  st[e] = rt(e);
});
function ct(t2) {
  for (var n2 = [], o = 1; o < arguments.length; o++)
    n2[o - 1] = arguments[o];
  var r2 = ne(nt.apply(void 0, __spreadArray([t2], n2, false))), s = x(r2);
  return new Me(s, r2);
}
var __extends$1 = globalThis && globalThis.__extends || function() {
  var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
      d2.__proto__ = b2;
    } || function(d2, b2) {
      for (var p2 in b2)
        if (Object.prototype.hasOwnProperty.call(b2, p2))
          d2[p2] = b2[p2];
    };
    return extendStatics(d, b);
  };
  return function(d, b) {
    extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();
var __assign$1 = globalThis && globalThis.__assign || function() {
  __assign$1 = Object.assign || function(t2) {
    for (var s, i = 1, n2 = arguments.length; i < n2; i++) {
      s = arguments[i];
      for (var p2 in s)
        if (Object.prototype.hasOwnProperty.call(s, p2))
          t2[p2] = s[p2];
    }
    return t2;
  };
  return __assign$1.apply(this, arguments);
};
var rowSizeBase = {
  width: "100%",
  height: "10px",
  top: "0px",
  left: "0px",
  cursor: "row-resize"
};
var colSizeBase = {
  width: "10px",
  height: "100%",
  top: "0px",
  left: "0px",
  cursor: "col-resize"
};
var edgeBase = {
  width: "20px",
  height: "20px",
  position: "absolute"
};
var styles = {
  top: __assign$1(__assign$1({}, rowSizeBase), { top: "-5px" }),
  right: __assign$1(__assign$1({}, colSizeBase), { left: void 0, right: "-5px" }),
  bottom: __assign$1(__assign$1({}, rowSizeBase), { top: void 0, bottom: "-5px" }),
  left: __assign$1(__assign$1({}, colSizeBase), { left: "-5px" }),
  topRight: __assign$1(__assign$1({}, edgeBase), { right: "-10px", top: "-10px", cursor: "ne-resize" }),
  bottomRight: __assign$1(__assign$1({}, edgeBase), { right: "-10px", bottom: "-10px", cursor: "se-resize" }),
  bottomLeft: __assign$1(__assign$1({}, edgeBase), { left: "-10px", bottom: "-10px", cursor: "sw-resize" }),
  topLeft: __assign$1(__assign$1({}, edgeBase), { left: "-10px", top: "-10px", cursor: "nw-resize" })
};
var Resizer = (
  /** @class */
  function(_super) {
    __extends$1(Resizer2, _super);
    function Resizer2() {
      var _this = _super !== null && _super.apply(this, arguments) || this;
      _this.onMouseDown = function(e) {
        _this.props.onResizeStart(e, _this.props.direction);
      };
      _this.onTouchStart = function(e) {
        _this.props.onResizeStart(e, _this.props.direction);
      };
      return _this;
    }
    Resizer2.prototype.render = function() {
      return reactExports.createElement("div", { className: this.props.className || "", style: __assign$1(__assign$1({ position: "absolute", userSelect: "none" }, styles[this.props.direction]), this.props.replaceStyles || {}), onMouseDown: this.onMouseDown, onTouchStart: this.onTouchStart }, this.props.children);
    };
    return Resizer2;
  }(reactExports.PureComponent)
);
var __extends = globalThis && globalThis.__extends || function() {
  var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
      d2.__proto__ = b2;
    } || function(d2, b2) {
      for (var p2 in b2)
        if (Object.prototype.hasOwnProperty.call(b2, p2))
          d2[p2] = b2[p2];
    };
    return extendStatics(d, b);
  };
  return function(d, b) {
    extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();
var __assign = globalThis && globalThis.__assign || function() {
  __assign = Object.assign || function(t2) {
    for (var s, i = 1, n2 = arguments.length; i < n2; i++) {
      s = arguments[i];
      for (var p2 in s)
        if (Object.prototype.hasOwnProperty.call(s, p2))
          t2[p2] = s[p2];
    }
    return t2;
  };
  return __assign.apply(this, arguments);
};
var DEFAULT_SIZE = {
  width: "auto",
  height: "auto"
};
var clamp$1 = function(n2, min, max) {
  return Math.max(Math.min(n2, max), min);
};
var snap = function(n2, size2) {
  return Math.round(n2 / size2) * size2;
};
var hasDirection = function(dir, target) {
  return new RegExp(dir, "i").test(target);
};
var isTouchEvent = function(event) {
  return Boolean(event.touches && event.touches.length);
};
var isMouseEvent = function(event) {
  return Boolean((event.clientX || event.clientX === 0) && (event.clientY || event.clientY === 0));
};
var findClosestSnap = function(n2, snapArray, snapGap) {
  if (snapGap === void 0) {
    snapGap = 0;
  }
  var closestGapIndex = snapArray.reduce(function(prev2, curr, index) {
    return Math.abs(curr - n2) < Math.abs(snapArray[prev2] - n2) ? index : prev2;
  }, 0);
  var gap = Math.abs(snapArray[closestGapIndex] - n2);
  return snapGap === 0 || gap < snapGap ? snapArray[closestGapIndex] : n2;
};
var getStringSize = function(n2) {
  n2 = n2.toString();
  if (n2 === "auto") {
    return n2;
  }
  if (n2.endsWith("px")) {
    return n2;
  }
  if (n2.endsWith("%")) {
    return n2;
  }
  if (n2.endsWith("vh")) {
    return n2;
  }
  if (n2.endsWith("vw")) {
    return n2;
  }
  if (n2.endsWith("vmax")) {
    return n2;
  }
  if (n2.endsWith("vmin")) {
    return n2;
  }
  return n2 + "px";
};
var getPixelSize = function(size2, parentSize, innerWidth, innerHeight) {
  if (size2 && typeof size2 === "string") {
    if (size2.endsWith("px")) {
      return Number(size2.replace("px", ""));
    }
    if (size2.endsWith("%")) {
      var ratio = Number(size2.replace("%", "")) / 100;
      return parentSize * ratio;
    }
    if (size2.endsWith("vw")) {
      var ratio = Number(size2.replace("vw", "")) / 100;
      return innerWidth * ratio;
    }
    if (size2.endsWith("vh")) {
      var ratio = Number(size2.replace("vh", "")) / 100;
      return innerHeight * ratio;
    }
  }
  return size2;
};
var calculateNewMax = function(parentSize, innerWidth, innerHeight, maxWidth, maxHeight, minWidth, minHeight) {
  maxWidth = getPixelSize(maxWidth, parentSize.width, innerWidth, innerHeight);
  maxHeight = getPixelSize(maxHeight, parentSize.height, innerWidth, innerHeight);
  minWidth = getPixelSize(minWidth, parentSize.width, innerWidth, innerHeight);
  minHeight = getPixelSize(minHeight, parentSize.height, innerWidth, innerHeight);
  return {
    maxWidth: typeof maxWidth === "undefined" ? void 0 : Number(maxWidth),
    maxHeight: typeof maxHeight === "undefined" ? void 0 : Number(maxHeight),
    minWidth: typeof minWidth === "undefined" ? void 0 : Number(minWidth),
    minHeight: typeof minHeight === "undefined" ? void 0 : Number(minHeight)
  };
};
var definedProps = [
  "as",
  "style",
  "className",
  "grid",
  "snap",
  "bounds",
  "boundsByDirection",
  "size",
  "defaultSize",
  "minWidth",
  "minHeight",
  "maxWidth",
  "maxHeight",
  "lockAspectRatio",
  "lockAspectRatioExtraWidth",
  "lockAspectRatioExtraHeight",
  "enable",
  "handleStyles",
  "handleClasses",
  "handleWrapperStyle",
  "handleWrapperClass",
  "children",
  "onResizeStart",
  "onResize",
  "onResizeStop",
  "handleComponent",
  "scale",
  "resizeRatio",
  "snapGap"
];
var baseClassName = "__resizable_base__";
var Resizable = (
  /** @class */
  function(_super) {
    __extends(Resizable2, _super);
    function Resizable2(props) {
      var _this = _super.call(this, props) || this;
      _this.ratio = 1;
      _this.resizable = null;
      _this.parentLeft = 0;
      _this.parentTop = 0;
      _this.resizableLeft = 0;
      _this.resizableRight = 0;
      _this.resizableTop = 0;
      _this.resizableBottom = 0;
      _this.targetLeft = 0;
      _this.targetTop = 0;
      _this.appendBase = function() {
        if (!_this.resizable || !_this.window) {
          return null;
        }
        var parent = _this.parentNode;
        if (!parent) {
          return null;
        }
        var element = _this.window.document.createElement("div");
        element.style.width = "100%";
        element.style.height = "100%";
        element.style.position = "absolute";
        element.style.transform = "scale(0, 0)";
        element.style.left = "0";
        element.style.flex = "0 0 100%";
        if (element.classList) {
          element.classList.add(baseClassName);
        } else {
          element.className += baseClassName;
        }
        parent.appendChild(element);
        return element;
      };
      _this.removeBase = function(base) {
        var parent = _this.parentNode;
        if (!parent) {
          return;
        }
        parent.removeChild(base);
      };
      _this.ref = function(c) {
        if (c) {
          _this.resizable = c;
        }
      };
      _this.state = {
        isResizing: false,
        width: typeof (_this.propsSize && _this.propsSize.width) === "undefined" ? "auto" : _this.propsSize && _this.propsSize.width,
        height: typeof (_this.propsSize && _this.propsSize.height) === "undefined" ? "auto" : _this.propsSize && _this.propsSize.height,
        direction: "right",
        original: {
          x: 0,
          y: 0,
          width: 0,
          height: 0
        },
        backgroundStyle: {
          height: "100%",
          width: "100%",
          backgroundColor: "rgba(0,0,0,0)",
          cursor: "auto",
          opacity: 0,
          position: "fixed",
          zIndex: 9999,
          top: "0",
          left: "0",
          bottom: "0",
          right: "0"
        },
        flexBasis: void 0
      };
      _this.onResizeStart = _this.onResizeStart.bind(_this);
      _this.onMouseMove = _this.onMouseMove.bind(_this);
      _this.onMouseUp = _this.onMouseUp.bind(_this);
      return _this;
    }
    Object.defineProperty(Resizable2.prototype, "parentNode", {
      get: function() {
        if (!this.resizable) {
          return null;
        }
        return this.resizable.parentNode;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Resizable2.prototype, "window", {
      get: function() {
        if (!this.resizable) {
          return null;
        }
        if (!this.resizable.ownerDocument) {
          return null;
        }
        return this.resizable.ownerDocument.defaultView;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Resizable2.prototype, "propsSize", {
      get: function() {
        return this.props.size || this.props.defaultSize || DEFAULT_SIZE;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Resizable2.prototype, "size", {
      get: function() {
        var width = 0;
        var height = 0;
        if (this.resizable && this.window) {
          var orgWidth = this.resizable.offsetWidth;
          var orgHeight = this.resizable.offsetHeight;
          var orgPosition = this.resizable.style.position;
          if (orgPosition !== "relative") {
            this.resizable.style.position = "relative";
          }
          width = this.resizable.style.width !== "auto" ? this.resizable.offsetWidth : orgWidth;
          height = this.resizable.style.height !== "auto" ? this.resizable.offsetHeight : orgHeight;
          this.resizable.style.position = orgPosition;
        }
        return { width, height };
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(Resizable2.prototype, "sizeStyle", {
      get: function() {
        var _this = this;
        var size2 = this.props.size;
        var getSize = function(key) {
          if (typeof _this.state[key] === "undefined" || _this.state[key] === "auto") {
            return "auto";
          }
          if (_this.propsSize && _this.propsSize[key] && _this.propsSize[key].toString().endsWith("%")) {
            if (_this.state[key].toString().endsWith("%")) {
              return _this.state[key].toString();
            }
            var parentSize = _this.getParentSize();
            var value = Number(_this.state[key].toString().replace("px", ""));
            var percent = value / parentSize[key] * 100;
            return percent + "%";
          }
          return getStringSize(_this.state[key]);
        };
        var width = size2 && typeof size2.width !== "undefined" && !this.state.isResizing ? getStringSize(size2.width) : getSize("width");
        var height = size2 && typeof size2.height !== "undefined" && !this.state.isResizing ? getStringSize(size2.height) : getSize("height");
        return { width, height };
      },
      enumerable: false,
      configurable: true
    });
    Resizable2.prototype.getParentSize = function() {
      if (!this.parentNode) {
        if (!this.window) {
          return { width: 0, height: 0 };
        }
        return { width: this.window.innerWidth, height: this.window.innerHeight };
      }
      var base = this.appendBase();
      if (!base) {
        return { width: 0, height: 0 };
      }
      var wrapChanged = false;
      var wrap = this.parentNode.style.flexWrap;
      if (wrap !== "wrap") {
        wrapChanged = true;
        this.parentNode.style.flexWrap = "wrap";
      }
      base.style.position = "relative";
      base.style.minWidth = "100%";
      base.style.minHeight = "100%";
      var size2 = {
        width: base.offsetWidth,
        height: base.offsetHeight
      };
      if (wrapChanged) {
        this.parentNode.style.flexWrap = wrap;
      }
      this.removeBase(base);
      return size2;
    };
    Resizable2.prototype.bindEvents = function() {
      if (this.window) {
        this.window.addEventListener("mouseup", this.onMouseUp);
        this.window.addEventListener("mousemove", this.onMouseMove);
        this.window.addEventListener("mouseleave", this.onMouseUp);
        this.window.addEventListener("touchmove", this.onMouseMove, {
          capture: true,
          passive: false
        });
        this.window.addEventListener("touchend", this.onMouseUp);
      }
    };
    Resizable2.prototype.unbindEvents = function() {
      if (this.window) {
        this.window.removeEventListener("mouseup", this.onMouseUp);
        this.window.removeEventListener("mousemove", this.onMouseMove);
        this.window.removeEventListener("mouseleave", this.onMouseUp);
        this.window.removeEventListener("touchmove", this.onMouseMove, true);
        this.window.removeEventListener("touchend", this.onMouseUp);
      }
    };
    Resizable2.prototype.componentDidMount = function() {
      if (!this.resizable || !this.window) {
        return;
      }
      var computedStyle = this.window.getComputedStyle(this.resizable);
      this.setState({
        width: this.state.width || this.size.width,
        height: this.state.height || this.size.height,
        flexBasis: computedStyle.flexBasis !== "auto" ? computedStyle.flexBasis : void 0
      });
    };
    Resizable2.prototype.componentWillUnmount = function() {
      if (this.window) {
        this.unbindEvents();
      }
    };
    Resizable2.prototype.createSizeForCssProperty = function(newSize, kind) {
      var propsSize = this.propsSize && this.propsSize[kind];
      return this.state[kind] === "auto" && this.state.original[kind] === newSize && (typeof propsSize === "undefined" || propsSize === "auto") ? "auto" : newSize;
    };
    Resizable2.prototype.calculateNewMaxFromBoundary = function(maxWidth, maxHeight) {
      var boundsByDirection = this.props.boundsByDirection;
      var direction = this.state.direction;
      var widthByDirection = boundsByDirection && hasDirection("left", direction);
      var heightByDirection = boundsByDirection && hasDirection("top", direction);
      var boundWidth;
      var boundHeight;
      if (this.props.bounds === "parent") {
        var parent_1 = this.parentNode;
        if (parent_1) {
          boundWidth = widthByDirection ? this.resizableRight - this.parentLeft : parent_1.offsetWidth + (this.parentLeft - this.resizableLeft);
          boundHeight = heightByDirection ? this.resizableBottom - this.parentTop : parent_1.offsetHeight + (this.parentTop - this.resizableTop);
        }
      } else if (this.props.bounds === "window") {
        if (this.window) {
          boundWidth = widthByDirection ? this.resizableRight : this.window.innerWidth - this.resizableLeft;
          boundHeight = heightByDirection ? this.resizableBottom : this.window.innerHeight - this.resizableTop;
        }
      } else if (this.props.bounds) {
        boundWidth = widthByDirection ? this.resizableRight - this.targetLeft : this.props.bounds.offsetWidth + (this.targetLeft - this.resizableLeft);
        boundHeight = heightByDirection ? this.resizableBottom - this.targetTop : this.props.bounds.offsetHeight + (this.targetTop - this.resizableTop);
      }
      if (boundWidth && Number.isFinite(boundWidth)) {
        maxWidth = maxWidth && maxWidth < boundWidth ? maxWidth : boundWidth;
      }
      if (boundHeight && Number.isFinite(boundHeight)) {
        maxHeight = maxHeight && maxHeight < boundHeight ? maxHeight : boundHeight;
      }
      return { maxWidth, maxHeight };
    };
    Resizable2.prototype.calculateNewSizeFromDirection = function(clientX, clientY) {
      var scale = this.props.scale || 1;
      var resizeRatio = this.props.resizeRatio || 1;
      var _a = this.state, direction = _a.direction, original = _a.original;
      var _b = this.props, lockAspectRatio = _b.lockAspectRatio, lockAspectRatioExtraHeight = _b.lockAspectRatioExtraHeight, lockAspectRatioExtraWidth = _b.lockAspectRatioExtraWidth;
      var newWidth = original.width;
      var newHeight = original.height;
      var extraHeight = lockAspectRatioExtraHeight || 0;
      var extraWidth = lockAspectRatioExtraWidth || 0;
      if (hasDirection("right", direction)) {
        newWidth = original.width + (clientX - original.x) * resizeRatio / scale;
        if (lockAspectRatio) {
          newHeight = (newWidth - extraWidth) / this.ratio + extraHeight;
        }
      }
      if (hasDirection("left", direction)) {
        newWidth = original.width - (clientX - original.x) * resizeRatio / scale;
        if (lockAspectRatio) {
          newHeight = (newWidth - extraWidth) / this.ratio + extraHeight;
        }
      }
      if (hasDirection("bottom", direction)) {
        newHeight = original.height + (clientY - original.y) * resizeRatio / scale;
        if (lockAspectRatio) {
          newWidth = (newHeight - extraHeight) * this.ratio + extraWidth;
        }
      }
      if (hasDirection("top", direction)) {
        newHeight = original.height - (clientY - original.y) * resizeRatio / scale;
        if (lockAspectRatio) {
          newWidth = (newHeight - extraHeight) * this.ratio + extraWidth;
        }
      }
      return { newWidth, newHeight };
    };
    Resizable2.prototype.calculateNewSizeFromAspectRatio = function(newWidth, newHeight, max, min) {
      var _a = this.props, lockAspectRatio = _a.lockAspectRatio, lockAspectRatioExtraHeight = _a.lockAspectRatioExtraHeight, lockAspectRatioExtraWidth = _a.lockAspectRatioExtraWidth;
      var computedMinWidth = typeof min.width === "undefined" ? 10 : min.width;
      var computedMaxWidth = typeof max.width === "undefined" || max.width < 0 ? newWidth : max.width;
      var computedMinHeight = typeof min.height === "undefined" ? 10 : min.height;
      var computedMaxHeight = typeof max.height === "undefined" || max.height < 0 ? newHeight : max.height;
      var extraHeight = lockAspectRatioExtraHeight || 0;
      var extraWidth = lockAspectRatioExtraWidth || 0;
      if (lockAspectRatio) {
        var extraMinWidth = (computedMinHeight - extraHeight) * this.ratio + extraWidth;
        var extraMaxWidth = (computedMaxHeight - extraHeight) * this.ratio + extraWidth;
        var extraMinHeight = (computedMinWidth - extraWidth) / this.ratio + extraHeight;
        var extraMaxHeight = (computedMaxWidth - extraWidth) / this.ratio + extraHeight;
        var lockedMinWidth = Math.max(computedMinWidth, extraMinWidth);
        var lockedMaxWidth = Math.min(computedMaxWidth, extraMaxWidth);
        var lockedMinHeight = Math.max(computedMinHeight, extraMinHeight);
        var lockedMaxHeight = Math.min(computedMaxHeight, extraMaxHeight);
        newWidth = clamp$1(newWidth, lockedMinWidth, lockedMaxWidth);
        newHeight = clamp$1(newHeight, lockedMinHeight, lockedMaxHeight);
      } else {
        newWidth = clamp$1(newWidth, computedMinWidth, computedMaxWidth);
        newHeight = clamp$1(newHeight, computedMinHeight, computedMaxHeight);
      }
      return { newWidth, newHeight };
    };
    Resizable2.prototype.setBoundingClientRect = function() {
      if (this.props.bounds === "parent") {
        var parent_2 = this.parentNode;
        if (parent_2) {
          var parentRect = parent_2.getBoundingClientRect();
          this.parentLeft = parentRect.left;
          this.parentTop = parentRect.top;
        }
      }
      if (this.props.bounds && typeof this.props.bounds !== "string") {
        var targetRect = this.props.bounds.getBoundingClientRect();
        this.targetLeft = targetRect.left;
        this.targetTop = targetRect.top;
      }
      if (this.resizable) {
        var _a = this.resizable.getBoundingClientRect(), left = _a.left, top_1 = _a.top, right = _a.right, bottom = _a.bottom;
        this.resizableLeft = left;
        this.resizableRight = right;
        this.resizableTop = top_1;
        this.resizableBottom = bottom;
      }
    };
    Resizable2.prototype.onResizeStart = function(event, direction) {
      if (!this.resizable || !this.window) {
        return;
      }
      var clientX = 0;
      var clientY = 0;
      if (event.nativeEvent && isMouseEvent(event.nativeEvent)) {
        clientX = event.nativeEvent.clientX;
        clientY = event.nativeEvent.clientY;
      } else if (event.nativeEvent && isTouchEvent(event.nativeEvent)) {
        clientX = event.nativeEvent.touches[0].clientX;
        clientY = event.nativeEvent.touches[0].clientY;
      }
      if (this.props.onResizeStart) {
        if (this.resizable) {
          var startResize = this.props.onResizeStart(event, direction, this.resizable);
          if (startResize === false) {
            return;
          }
        }
      }
      if (this.props.size) {
        if (typeof this.props.size.height !== "undefined" && this.props.size.height !== this.state.height) {
          this.setState({ height: this.props.size.height });
        }
        if (typeof this.props.size.width !== "undefined" && this.props.size.width !== this.state.width) {
          this.setState({ width: this.props.size.width });
        }
      }
      this.ratio = typeof this.props.lockAspectRatio === "number" ? this.props.lockAspectRatio : this.size.width / this.size.height;
      var flexBasis;
      var computedStyle = this.window.getComputedStyle(this.resizable);
      if (computedStyle.flexBasis !== "auto") {
        var parent_3 = this.parentNode;
        if (parent_3) {
          var dir = this.window.getComputedStyle(parent_3).flexDirection;
          this.flexDir = dir.startsWith("row") ? "row" : "column";
          flexBasis = computedStyle.flexBasis;
        }
      }
      this.setBoundingClientRect();
      this.bindEvents();
      var state = {
        original: {
          x: clientX,
          y: clientY,
          width: this.size.width,
          height: this.size.height
        },
        isResizing: true,
        backgroundStyle: __assign(__assign({}, this.state.backgroundStyle), { cursor: this.window.getComputedStyle(event.target).cursor || "auto" }),
        direction,
        flexBasis
      };
      this.setState(state);
    };
    Resizable2.prototype.onMouseMove = function(event) {
      var _this = this;
      if (!this.state.isResizing || !this.resizable || !this.window) {
        return;
      }
      if (this.window.TouchEvent && isTouchEvent(event)) {
        try {
          event.preventDefault();
          event.stopPropagation();
        } catch (e) {
        }
      }
      var _a = this.props, maxWidth = _a.maxWidth, maxHeight = _a.maxHeight, minWidth = _a.minWidth, minHeight = _a.minHeight;
      var clientX = isTouchEvent(event) ? event.touches[0].clientX : event.clientX;
      var clientY = isTouchEvent(event) ? event.touches[0].clientY : event.clientY;
      var _b = this.state, direction = _b.direction, original = _b.original, width = _b.width, height = _b.height;
      var parentSize = this.getParentSize();
      var max = calculateNewMax(parentSize, this.window.innerWidth, this.window.innerHeight, maxWidth, maxHeight, minWidth, minHeight);
      maxWidth = max.maxWidth;
      maxHeight = max.maxHeight;
      minWidth = max.minWidth;
      minHeight = max.minHeight;
      var _c = this.calculateNewSizeFromDirection(clientX, clientY), newHeight = _c.newHeight, newWidth = _c.newWidth;
      var boundaryMax = this.calculateNewMaxFromBoundary(maxWidth, maxHeight);
      if (this.props.snap && this.props.snap.x) {
        newWidth = findClosestSnap(newWidth, this.props.snap.x, this.props.snapGap);
      }
      if (this.props.snap && this.props.snap.y) {
        newHeight = findClosestSnap(newHeight, this.props.snap.y, this.props.snapGap);
      }
      var newSize = this.calculateNewSizeFromAspectRatio(newWidth, newHeight, { width: boundaryMax.maxWidth, height: boundaryMax.maxHeight }, { width: minWidth, height: minHeight });
      newWidth = newSize.newWidth;
      newHeight = newSize.newHeight;
      if (this.props.grid) {
        var newGridWidth = snap(newWidth, this.props.grid[0]);
        var newGridHeight = snap(newHeight, this.props.grid[1]);
        var gap = this.props.snapGap || 0;
        newWidth = gap === 0 || Math.abs(newGridWidth - newWidth) <= gap ? newGridWidth : newWidth;
        newHeight = gap === 0 || Math.abs(newGridHeight - newHeight) <= gap ? newGridHeight : newHeight;
      }
      var delta = {
        width: newWidth - original.width,
        height: newHeight - original.height
      };
      if (width && typeof width === "string") {
        if (width.endsWith("%")) {
          var percent = newWidth / parentSize.width * 100;
          newWidth = percent + "%";
        } else if (width.endsWith("vw")) {
          var vw = newWidth / this.window.innerWidth * 100;
          newWidth = vw + "vw";
        } else if (width.endsWith("vh")) {
          var vh2 = newWidth / this.window.innerHeight * 100;
          newWidth = vh2 + "vh";
        }
      }
      if (height && typeof height === "string") {
        if (height.endsWith("%")) {
          var percent = newHeight / parentSize.height * 100;
          newHeight = percent + "%";
        } else if (height.endsWith("vw")) {
          var vw = newHeight / this.window.innerWidth * 100;
          newHeight = vw + "vw";
        } else if (height.endsWith("vh")) {
          var vh2 = newHeight / this.window.innerHeight * 100;
          newHeight = vh2 + "vh";
        }
      }
      var newState = {
        width: this.createSizeForCssProperty(newWidth, "width"),
        height: this.createSizeForCssProperty(newHeight, "height")
      };
      if (this.flexDir === "row") {
        newState.flexBasis = newState.width;
      } else if (this.flexDir === "column") {
        newState.flexBasis = newState.height;
      }
      reactDomExports.flushSync(function() {
        _this.setState(newState);
      });
      if (this.props.onResize) {
        this.props.onResize(event, direction, this.resizable, delta);
      }
    };
    Resizable2.prototype.onMouseUp = function(event) {
      var _a = this.state, isResizing = _a.isResizing, direction = _a.direction, original = _a.original;
      if (!isResizing || !this.resizable) {
        return;
      }
      var delta = {
        width: this.size.width - original.width,
        height: this.size.height - original.height
      };
      if (this.props.onResizeStop) {
        this.props.onResizeStop(event, direction, this.resizable, delta);
      }
      if (this.props.size) {
        this.setState(this.props.size);
      }
      this.unbindEvents();
      this.setState({
        isResizing: false,
        backgroundStyle: __assign(__assign({}, this.state.backgroundStyle), { cursor: "auto" })
      });
    };
    Resizable2.prototype.updateSize = function(size2) {
      this.setState({ width: size2.width, height: size2.height });
    };
    Resizable2.prototype.renderResizer = function() {
      var _this = this;
      var _a = this.props, enable = _a.enable, handleStyles = _a.handleStyles, handleClasses = _a.handleClasses, handleWrapperStyle = _a.handleWrapperStyle, handleWrapperClass = _a.handleWrapperClass, handleComponent = _a.handleComponent;
      if (!enable) {
        return null;
      }
      var resizers = Object.keys(enable).map(function(dir) {
        if (enable[dir] !== false) {
          return reactExports.createElement(Resizer, { key: dir, direction: dir, onResizeStart: _this.onResizeStart, replaceStyles: handleStyles && handleStyles[dir], className: handleClasses && handleClasses[dir] }, handleComponent && handleComponent[dir] ? handleComponent[dir] : null);
        }
        return null;
      });
      return reactExports.createElement("div", { className: handleWrapperClass, style: handleWrapperStyle }, resizers);
    };
    Resizable2.prototype.render = function() {
      var _this = this;
      var extendsProps = Object.keys(this.props).reduce(function(acc, key) {
        if (definedProps.indexOf(key) !== -1) {
          return acc;
        }
        acc[key] = _this.props[key];
        return acc;
      }, {});
      var style2 = __assign(__assign(__assign({ position: "relative", userSelect: this.state.isResizing ? "none" : "auto" }, this.props.style), this.sizeStyle), { maxWidth: this.props.maxWidth, maxHeight: this.props.maxHeight, minWidth: this.props.minWidth, minHeight: this.props.minHeight, boxSizing: "border-box", flexShrink: 0 });
      if (this.state.flexBasis) {
        style2.flexBasis = this.state.flexBasis;
      }
      var Wrapper2 = this.props.as || "div";
      return reactExports.createElement(
        Wrapper2,
        __assign({ ref: this.ref, style: style2, className: this.props.className }, extendsProps),
        this.state.isResizing && reactExports.createElement("div", { style: this.state.backgroundStyle }),
        this.props.children,
        this.renderResizer()
      );
    };
    Resizable2.defaultProps = {
      as: "div",
      onResizeStart: function() {
      },
      onResize: function() {
      },
      onResizeStop: function() {
      },
      enable: {
        top: true,
        right: true,
        bottom: true,
        left: true,
        topRight: true,
        bottomRight: true,
        bottomLeft: true,
        topLeft: true
      },
      style: {},
      grid: [1, 1],
      lockAspectRatio: false,
      lockAspectRatioExtraWidth: 0,
      lockAspectRatioExtraHeight: 0,
      scale: 1,
      resizeRatio: 1,
      snapGap: 0
    };
    return Resizable2;
  }(reactExports.PureComponent)
);
const A = st.a`
  &:link {
    color: ${(p2) => p2.neutral ? "currentColor" : "#5e5ce6"};
    text-decoration: none;
  }
`;
const Link = (props) => {
  const context = reactExports.useContext(AppContext);
  const onLinkClicked = (e) => {
    if (props.command) {
      e.preventDefault();
      context.execCommand(props.command);
    } else if (props.href) {
      if (props.href.startsWith("http")) {
        context.execCommand("inspect:openLink", props.href);
        e.preventDefault();
      }
    } else if (props.callback) {
      e.preventDefault();
      props.callback();
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(A, { href: props.href, className: props.className, onClick: onLinkClicked, children: props.children });
};
const ConditionalWrap = ({ condition, children, wrap }) => condition ? React.cloneElement(wrap(children)) : children;
const Img = st.img`
  width: 12px;
  fill: #fff;
  padding-right: 5px;
  margin-left: 10px;
`;
const Box$7 = st.div`
  margin: 5px 0;
  height: 30px;
  line-height: 30px;
  display: flex;
  align-items: center;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  cursor: pointer;
  border-radius: 5px;

  span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    padding: 5px;
  }

  &:hover {
    background: #292d2e;
    color: #fff;
  }

  &.active {
    background: #37373d;
  }

  &.disabled {
    opacity: 0.5;
    cursor: initial;
  }  
`;
const StyledLink$1 = st(Link)`
  text-decoration: none;
`;
class MenuItem extends reactExports.Component {
  render() {
    let className = this.props.isActive ? this.props.className + " active" : this.props.className;
    let isDisabled = this.props.isDisabled;
    if (isDisabled) {
      className = className + " " + (this.props.isDisabled ? "disabled" : "");
    }
    let onMouseLeave = () => {
      if (!isDisabled && this.props.onMouseLeave) {
        this.props.onMouseLeave();
      }
    };
    let onMouseEnter = () => {
      if (!isDisabled && this.props.onMouseEnter) {
        this.props.onMouseEnter();
      }
    };
    let onClick = () => {
      if (!isDisabled && this.props.onClick) {
        this.props.onClick();
      }
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConditionalWrap,
      {
        condition: this.props.link !== null,
        wrap: (children) => /* @__PURE__ */ jsxRuntimeExports.jsx(StyledLink$1, { href: this.props.link, neutral: true, command: this.props.command, children }),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Box$7,
          {
            className,
            title: this.props.title,
            onClick,
            onMouseEnter,
            onMouseLeave,
            children: [
              this.props.src && /* @__PURE__ */ jsxRuntimeExports.jsx(Img, { src: this.props.src }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: this.props.children })
            ]
          }
        )
      }
    );
  }
}
const iconFeedback = "" + new URL("feedback-c2a2e88b.svg", import.meta.url).href;
const iconExclamation = "" + new URL("exclamation-circle-07a78c85.svg", import.meta.url).href;
const iconPhone = "" + new URL("phone-9afb002f.svg", import.meta.url).href;
const iconPage = "" + new URL("file-code-23ae2466.svg", import.meta.url).href;
const iconApp = "" + new URL("window-0edcad16.svg", import.meta.url).href;
const iconAccount = "" + new URL("person-circle-0b6fa742.svg", import.meta.url).href;
const iconSignout = "" + new URL("sign-out-852099ee.svg", import.meta.url).href;
const iconSettings = "" + new URL("settings-gear-dc4ef8b8.svg", import.meta.url).href;
const iconWarning = "" + new URL("warning-ede96af4.svg", import.meta.url).href;
const iconHome = "" + new URL("home-e4255ad7.svg", import.meta.url).href;
function _extends$2() {
  _extends$2 = Object.assign ? Object.assign.bind() : function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends$2.apply(this, arguments);
}
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null)
    return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0)
      continue;
    target[key] = source[key];
  }
  return target;
}
function ownerDocument(node2) {
  return node2 && node2.ownerDocument || document;
}
function activeElement(doc) {
  if (doc === void 0) {
    doc = ownerDocument();
  }
  try {
    var active = doc.activeElement;
    if (!active || !active.nodeName)
      return null;
    return active;
  } catch (e) {
    return doc.body;
  }
}
function contains(context, node2) {
  if (context.contains)
    return context.contains(node2);
  if (context.compareDocumentPosition)
    return context === node2 || !!(context.compareDocumentPosition(node2) & 16);
}
const canUseDOM$1 = !!(typeof window !== "undefined" && window.document && window.document.createElement);
var optionsSupported = false;
var onceSupported = false;
try {
  var options = {
    get passive() {
      return optionsSupported = true;
    },
    get once() {
      return onceSupported = optionsSupported = true;
    }
  };
  if (canUseDOM$1) {
    window.addEventListener("test", options, options);
    window.removeEventListener("test", options, true);
  }
} catch (e) {
}
function addEventListener(node2, eventName, handler, options) {
  if (options && typeof options !== "boolean" && !onceSupported) {
    var once3 = options.once, capture = options.capture;
    var wrappedHandler = handler;
    if (!onceSupported && once3) {
      wrappedHandler = handler.__once || function onceHandler(event) {
        this.removeEventListener(eventName, onceHandler, capture);
        handler.call(this, event);
      };
      handler.__once = wrappedHandler;
    }
    node2.addEventListener(eventName, wrappedHandler, optionsSupported ? options : capture);
  }
  node2.addEventListener(eventName, handler, options);
}
function removeEventListener(node2, eventName, handler, options) {
  var capture = options && typeof options !== "boolean" ? options.capture : options;
  node2.removeEventListener(eventName, handler, capture);
  if (handler.__once) {
    node2.removeEventListener(eventName, handler.__once, capture);
  }
}
function listen(node2, eventName, handler, options) {
  addEventListener(node2, eventName, handler, options);
  return function() {
    removeEventListener(node2, eventName, handler, options);
  };
}
var propTypes$1 = { exports: {} };
var ReactPropTypesSecret$1 = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";
var ReactPropTypesSecret_1 = ReactPropTypesSecret$1;
var ReactPropTypesSecret = ReactPropTypesSecret_1;
function emptyFunction() {
}
function emptyFunctionWithReset() {
}
emptyFunctionWithReset.resetWarningCache = emptyFunction;
var factoryWithThrowingShims = function() {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret) {
      return;
    }
    var err = new Error(
      "Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types"
    );
    err.name = "Invariant Violation";
    throw err;
  }
  shim.isRequired = shim;
  function getShim() {
    return shim;
  }
  var ReactPropTypes = {
    array: shim,
    bigint: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,
    any: shim,
    arrayOf: getShim,
    element: shim,
    elementType: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim,
    exact: getShim,
    checkPropTypes: emptyFunctionWithReset,
    resetWarningCache: emptyFunction
  };
  ReactPropTypes.PropTypes = ReactPropTypes;
  return ReactPropTypes;
};
{
  propTypes$1.exports = factoryWithThrowingShims();
}
var propTypesExports = propTypes$1.exports;
const PropTypes = /* @__PURE__ */ getDefaultExportFromCjs(propTypesExports);
function useMounted() {
  const mounted = reactExports.useRef(true);
  const isMounted = reactExports.useRef(() => mounted.current);
  reactExports.useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  return isMounted.current;
}
function useUpdatedRef(value) {
  const valueRef = reactExports.useRef(value);
  valueRef.current = value;
  return valueRef;
}
function useWillUnmount(fn) {
  const onUnmount = useUpdatedRef(fn);
  reactExports.useEffect(() => () => onUnmount.current(), []);
}
function usePrevious(value) {
  const ref = reactExports.useRef(null);
  reactExports.useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
function useCommittedRef(value) {
  const ref = reactExports.useRef(value);
  reactExports.useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref;
}
function useEventCallback(fn) {
  const ref = useCommittedRef(fn);
  return reactExports.useCallback(function(...args) {
    return ref.current && ref.current(...args);
  }, [ref]);
}
function hasClass(element, className) {
  if (element.classList)
    return !!className && element.classList.contains(className);
  return (" " + (element.className.baseVal || element.className) + " ").indexOf(" " + className + " ") !== -1;
}
function addClass(element, className) {
  if (element.classList)
    element.classList.add(className);
  else if (!hasClass(element, className))
    if (typeof element.className === "string")
      element.className = element.className + " " + className;
    else
      element.setAttribute("class", (element.className && element.className.baseVal || "") + " " + className);
}
function replaceClassName(origClass, classToRemove) {
  return origClass.replace(new RegExp("(^|\\s)" + classToRemove + "(?:\\s|$)", "g"), "$1").replace(/\s+/g, " ").replace(/^\s*|\s*$/g, "");
}
function removeClass(element, className) {
  if (element.classList) {
    element.classList.remove(className);
  } else if (typeof element.className === "string") {
    element.className = replaceClassName(element.className, className);
  } else {
    element.setAttribute("class", replaceClassName(element.className && element.className.baseVal || "", className));
  }
}
function ownerWindow(node2) {
  var doc = ownerDocument(node2);
  return doc && doc.defaultView || window;
}
function getComputedStyle(node2, psuedoElement) {
  return ownerWindow(node2).getComputedStyle(node2, psuedoElement);
}
var rUpper = /([A-Z])/g;
function hyphenate(string) {
  return string.replace(rUpper, "-$1").toLowerCase();
}
var msPattern = /^ms-/;
function hyphenateStyleName(string) {
  return hyphenate(string).replace(msPattern, "-ms-");
}
var supportedTransforms = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i;
function isTransform(value) {
  return !!(value && supportedTransforms.test(value));
}
function style(node2, property) {
  var css = "";
  var transforms = "";
  if (typeof property === "string") {
    return node2.style.getPropertyValue(hyphenateStyleName(property)) || getComputedStyle(node2).getPropertyValue(hyphenateStyleName(property));
  }
  Object.keys(property).forEach(function(key) {
    var value = property[key];
    if (!value && value !== 0) {
      node2.style.removeProperty(hyphenateStyleName(key));
    } else if (isTransform(key)) {
      transforms += key + "(" + value + ") ";
    } else {
      css += hyphenateStyleName(key) + ": " + value + ";";
    }
  });
  if (transforms) {
    css += "transform: " + transforms + ";";
  }
  node2.style.cssText += ";" + css;
}
var size;
function scrollbarSize(recalc) {
  if (!size && size !== 0 || recalc) {
    if (canUseDOM$1) {
      var scrollDiv = document.createElement("div");
      scrollDiv.style.position = "absolute";
      scrollDiv.style.top = "-9999px";
      scrollDiv.style.width = "50px";
      scrollDiv.style.height = "50px";
      scrollDiv.style.overflow = "scroll";
      document.body.appendChild(scrollDiv);
      size = scrollDiv.offsetWidth - scrollDiv.clientWidth;
      document.body.removeChild(scrollDiv);
    }
  }
  return size;
}
function isDocument(element) {
  return "nodeType" in element && element.nodeType === document.DOCUMENT_NODE;
}
function isWindow(node2) {
  if ("window" in node2 && node2.window === node2)
    return node2;
  if (isDocument(node2))
    return node2.defaultView || false;
  return false;
}
function isBody(node2) {
  return node2 && node2.tagName.toLowerCase() === "body";
}
function bodyIsOverflowing(node2) {
  var doc = isWindow(node2) ? ownerDocument() : ownerDocument(node2);
  var win = isWindow(node2) || doc.defaultView;
  return doc.body.clientWidth < win.innerWidth;
}
function isOverflowing(container2) {
  var win = isWindow(container2);
  return win || isBody(container2) ? bodyIsOverflowing(container2) : container2.scrollHeight > container2.clientHeight;
}
var BLACKLIST = ["template", "script", "style"];
var isHidable = function isHidable2(_ref) {
  var nodeType = _ref.nodeType, tagName = _ref.tagName;
  return nodeType === 1 && BLACKLIST.indexOf(tagName.toLowerCase()) === -1;
};
var siblings = function siblings2(container2, exclude, cb2) {
  [].forEach.call(container2.children, function(node2) {
    if (exclude.indexOf(node2) === -1 && isHidable(node2)) {
      cb2(node2);
    }
  });
};
function ariaHidden(hide, node2) {
  if (!node2)
    return;
  if (hide) {
    node2.setAttribute("aria-hidden", "true");
  } else {
    node2.removeAttribute("aria-hidden");
  }
}
function hideSiblings(container2, _ref2) {
  var dialog = _ref2.dialog, backdrop = _ref2.backdrop;
  siblings(container2, [dialog, backdrop], function(node2) {
    return ariaHidden(true, node2);
  });
}
function showSiblings(container2, _ref3) {
  var dialog = _ref3.dialog, backdrop = _ref3.backdrop;
  siblings(container2, [dialog, backdrop], function(node2) {
    return ariaHidden(false, node2);
  });
}
function findIndexOf(arr, cb2) {
  var idx = -1;
  arr.some(function(d, i) {
    if (cb2(d, i)) {
      idx = i;
      return true;
    }
    return false;
  });
  return idx;
}
var ModalManager = /* @__PURE__ */ function() {
  function ModalManager2(_temp) {
    var _ref = _temp === void 0 ? {} : _temp, _ref$hideSiblingNodes = _ref.hideSiblingNodes, hideSiblingNodes = _ref$hideSiblingNodes === void 0 ? true : _ref$hideSiblingNodes, _ref$handleContainerO = _ref.handleContainerOverflow, handleContainerOverflow = _ref$handleContainerO === void 0 ? true : _ref$handleContainerO;
    this.hideSiblingNodes = void 0;
    this.handleContainerOverflow = void 0;
    this.modals = void 0;
    this.containers = void 0;
    this.data = void 0;
    this.scrollbarSize = void 0;
    this.hideSiblingNodes = hideSiblingNodes;
    this.handleContainerOverflow = handleContainerOverflow;
    this.modals = [];
    this.containers = [];
    this.data = [];
    this.scrollbarSize = scrollbarSize();
  }
  var _proto = ModalManager2.prototype;
  _proto.isContainerOverflowing = function isContainerOverflowing(modal) {
    var data = this.data[this.containerIndexFromModal(modal)];
    return data && data.overflowing;
  };
  _proto.containerIndexFromModal = function containerIndexFromModal(modal) {
    return findIndexOf(this.data, function(d) {
      return d.modals.indexOf(modal) !== -1;
    });
  };
  _proto.setContainerStyle = function setContainerStyle(containerState, container2) {
    var style$1 = {
      overflow: "hidden"
    };
    containerState.style = {
      overflow: container2.style.overflow,
      paddingRight: container2.style.paddingRight
    };
    if (containerState.overflowing) {
      style$1.paddingRight = parseInt(style(container2, "paddingRight") || "0", 10) + this.scrollbarSize + "px";
    }
    style(container2, style$1);
  };
  _proto.removeContainerStyle = function removeContainerStyle(containerState, container2) {
    Object.assign(container2.style, containerState.style);
  };
  _proto.add = function add(modal, container2, className) {
    var modalIdx = this.modals.indexOf(modal);
    var containerIdx = this.containers.indexOf(container2);
    if (modalIdx !== -1) {
      return modalIdx;
    }
    modalIdx = this.modals.length;
    this.modals.push(modal);
    if (this.hideSiblingNodes) {
      hideSiblings(container2, modal);
    }
    if (containerIdx !== -1) {
      this.data[containerIdx].modals.push(modal);
      return modalIdx;
    }
    var data = {
      modals: [modal],
      // right now only the first modal of a container will have its classes applied
      classes: className ? className.split(/\s+/) : [],
      overflowing: isOverflowing(container2)
    };
    if (this.handleContainerOverflow) {
      this.setContainerStyle(data, container2);
    }
    data.classes.forEach(addClass.bind(null, container2));
    this.containers.push(container2);
    this.data.push(data);
    return modalIdx;
  };
  _proto.remove = function remove(modal) {
    var modalIdx = this.modals.indexOf(modal);
    if (modalIdx === -1) {
      return;
    }
    var containerIdx = this.containerIndexFromModal(modal);
    var data = this.data[containerIdx];
    var container2 = this.containers[containerIdx];
    data.modals.splice(data.modals.indexOf(modal), 1);
    this.modals.splice(modalIdx, 1);
    if (data.modals.length === 0) {
      data.classes.forEach(removeClass.bind(null, container2));
      if (this.handleContainerOverflow) {
        this.removeContainerStyle(data, container2);
      }
      if (this.hideSiblingNodes) {
        showSiblings(container2, modal);
      }
      this.containers.splice(containerIdx, 1);
      this.data.splice(containerIdx, 1);
    } else if (this.hideSiblingNodes) {
      var _data$modals = data.modals[data.modals.length - 1], backdrop = _data$modals.backdrop, dialog = _data$modals.dialog;
      ariaHidden(false, dialog);
      ariaHidden(false, backdrop);
    }
  };
  _proto.isTopModal = function isTopModal(modal) {
    return !!this.modals.length && this.modals[this.modals.length - 1] === modal;
  };
  return ModalManager2;
}();
const ModalManager$1 = ModalManager;
var resolveContainerRef = function resolveContainerRef2(ref) {
  var _ref;
  if (typeof document === "undefined")
    return null;
  if (ref == null)
    return ownerDocument().body;
  if (typeof ref === "function")
    ref = ref();
  if (ref && "current" in ref)
    ref = ref.current;
  if ((_ref = ref) != null && _ref.nodeType)
    return ref || null;
  return null;
};
function useWaitForDOMRef(ref, onResolved) {
  var _useState = reactExports.useState(function() {
    return resolveContainerRef(ref);
  }), resolvedRef = _useState[0], setRef = _useState[1];
  if (!resolvedRef) {
    var earlyRef = resolveContainerRef(ref);
    if (earlyRef)
      setRef(earlyRef);
  }
  reactExports.useEffect(function() {
    if (onResolved && resolvedRef) {
      onResolved(resolvedRef);
    }
  }, [onResolved, resolvedRef]);
  reactExports.useEffect(function() {
    var nextRef = resolveContainerRef(ref);
    if (nextRef !== resolvedRef) {
      setRef(nextRef);
    }
  }, [ref, resolvedRef]);
  return resolvedRef;
}
var manager;
function getManager() {
  if (!manager)
    manager = new ModalManager$1();
  return manager;
}
function useModalManager(provided) {
  var modalManager = provided || getManager();
  var modal = reactExports.useRef({
    dialog: null,
    backdrop: null
  });
  return Object.assign(modal.current, {
    add: function add(container2, className) {
      return modalManager.add(modal.current, container2, className);
    },
    remove: function remove() {
      return modalManager.remove(modal.current);
    },
    isTopModal: function isTopModal() {
      return modalManager.isTopModal(modal.current);
    },
    setDialogRef: reactExports.useCallback(function(ref) {
      modal.current.dialog = ref;
    }, []),
    setBackdropRef: reactExports.useCallback(function(ref) {
      modal.current.backdrop = ref;
    }, [])
  });
}
var Modal = /* @__PURE__ */ reactExports.forwardRef(function(_ref, ref) {
  var _ref$show = _ref.show, show = _ref$show === void 0 ? false : _ref$show, _ref$role = _ref.role, role = _ref$role === void 0 ? "dialog" : _ref$role, className = _ref.className, style2 = _ref.style, children = _ref.children, _ref$backdrop = _ref.backdrop, backdrop = _ref$backdrop === void 0 ? true : _ref$backdrop, _ref$keyboard = _ref.keyboard, keyboard = _ref$keyboard === void 0 ? true : _ref$keyboard, onBackdropClick = _ref.onBackdropClick, onEscapeKeyDown = _ref.onEscapeKeyDown, transition = _ref.transition, backdropTransition = _ref.backdropTransition, _ref$autoFocus = _ref.autoFocus, autoFocus = _ref$autoFocus === void 0 ? true : _ref$autoFocus, _ref$enforceFocus = _ref.enforceFocus, enforceFocus = _ref$enforceFocus === void 0 ? true : _ref$enforceFocus, _ref$restoreFocus = _ref.restoreFocus, restoreFocus = _ref$restoreFocus === void 0 ? true : _ref$restoreFocus, restoreFocusOptions = _ref.restoreFocusOptions, renderDialog = _ref.renderDialog, _ref$renderBackdrop = _ref.renderBackdrop, renderBackdrop = _ref$renderBackdrop === void 0 ? function(props) {
    return /* @__PURE__ */ React.createElement("div", props);
  } : _ref$renderBackdrop, providedManager = _ref.manager, containerRef = _ref.container, containerClassName = _ref.containerClassName, onShow = _ref.onShow, _ref$onHide = _ref.onHide, onHide = _ref$onHide === void 0 ? function() {
  } : _ref$onHide, onExit = _ref.onExit, onExited = _ref.onExited, onExiting = _ref.onExiting, onEnter = _ref.onEnter, onEntering = _ref.onEntering, onEntered = _ref.onEntered, rest = _objectWithoutPropertiesLoose(_ref, ["show", "role", "className", "style", "children", "backdrop", "keyboard", "onBackdropClick", "onEscapeKeyDown", "transition", "backdropTransition", "autoFocus", "enforceFocus", "restoreFocus", "restoreFocusOptions", "renderDialog", "renderBackdrop", "manager", "container", "containerClassName", "onShow", "onHide", "onExit", "onExited", "onExiting", "onEnter", "onEntering", "onEntered"]);
  var container2 = useWaitForDOMRef(containerRef);
  var modal = useModalManager(providedManager);
  var isMounted = useMounted();
  var prevShow = usePrevious(show);
  var _useState = reactExports.useState(!show), exited = _useState[0], setExited = _useState[1];
  var lastFocusRef = reactExports.useRef(null);
  reactExports.useImperativeHandle(ref, function() {
    return modal;
  }, [modal]);
  if (canUseDOM$1 && !prevShow && show) {
    lastFocusRef.current = activeElement();
  }
  if (!transition && !show && !exited) {
    setExited(true);
  } else if (show && exited) {
    setExited(false);
  }
  var handleShow = useEventCallback(function() {
    modal.add(container2, containerClassName);
    removeKeydownListenerRef.current = listen(document, "keydown", handleDocumentKeyDown);
    removeFocusListenerRef.current = listen(
      document,
      "focus",
      // the timeout is necessary b/c this will run before the new modal is mounted
      // and so steals focus from it
      function() {
        return setTimeout(handleEnforceFocus);
      },
      true
    );
    if (onShow) {
      onShow();
    }
    if (autoFocus) {
      var currentActiveElement = activeElement(document);
      if (modal.dialog && currentActiveElement && !contains(modal.dialog, currentActiveElement)) {
        lastFocusRef.current = currentActiveElement;
        modal.dialog.focus();
      }
    }
  });
  var handleHide = useEventCallback(function() {
    modal.remove();
    removeKeydownListenerRef.current == null ? void 0 : removeKeydownListenerRef.current();
    removeFocusListenerRef.current == null ? void 0 : removeFocusListenerRef.current();
    if (restoreFocus) {
      var _lastFocusRef$current;
      (_lastFocusRef$current = lastFocusRef.current) == null ? void 0 : _lastFocusRef$current.focus == null ? void 0 : _lastFocusRef$current.focus(restoreFocusOptions);
      lastFocusRef.current = null;
    }
  });
  reactExports.useEffect(function() {
    if (!show || !container2)
      return;
    handleShow();
  }, [
    show,
    container2,
    /* should never change: */
    handleShow
  ]);
  reactExports.useEffect(function() {
    if (!exited)
      return;
    handleHide();
  }, [exited, handleHide]);
  useWillUnmount(function() {
    handleHide();
  });
  var handleEnforceFocus = useEventCallback(function() {
    if (!enforceFocus || !isMounted() || !modal.isTopModal()) {
      return;
    }
    var currentActiveElement = activeElement();
    if (modal.dialog && currentActiveElement && !contains(modal.dialog, currentActiveElement)) {
      modal.dialog.focus();
    }
  });
  var handleBackdropClick = useEventCallback(function(e) {
    if (e.target !== e.currentTarget) {
      return;
    }
    onBackdropClick == null ? void 0 : onBackdropClick(e);
    if (backdrop === true) {
      onHide();
    }
  });
  var handleDocumentKeyDown = useEventCallback(function(e) {
    if (keyboard && e.keyCode === 27 && modal.isTopModal()) {
      onEscapeKeyDown == null ? void 0 : onEscapeKeyDown(e);
      if (!e.defaultPrevented) {
        onHide();
      }
    }
  });
  var removeFocusListenerRef = reactExports.useRef();
  var removeKeydownListenerRef = reactExports.useRef();
  var handleHidden = function handleHidden2() {
    setExited(true);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    onExited == null ? void 0 : onExited.apply(void 0, args);
  };
  var Transition = transition;
  if (!container2 || !(show || Transition && !exited)) {
    return null;
  }
  var dialogProps = _extends$2({
    role,
    ref: modal.setDialogRef,
    // apparently only works on the dialog role element
    "aria-modal": role === "dialog" ? true : void 0
  }, rest, {
    style: style2,
    className,
    tabIndex: -1
  });
  var dialog = renderDialog ? renderDialog(dialogProps) : /* @__PURE__ */ React.createElement("div", dialogProps, /* @__PURE__ */ React.cloneElement(children, {
    role: "document"
  }));
  if (Transition) {
    dialog = /* @__PURE__ */ React.createElement(Transition, {
      appear: true,
      unmountOnExit: true,
      "in": !!show,
      onExit,
      onExiting,
      onExited: handleHidden,
      onEnter,
      onEntering,
      onEntered
    }, dialog);
  }
  var backdropElement = null;
  if (backdrop) {
    var BackdropTransition = backdropTransition;
    backdropElement = renderBackdrop({
      ref: modal.setBackdropRef,
      onClick: handleBackdropClick
    });
    if (BackdropTransition) {
      backdropElement = /* @__PURE__ */ React.createElement(BackdropTransition, {
        appear: true,
        "in": !!show
      }, backdropElement);
    }
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ ReactDOM.createPortal(/* @__PURE__ */ React.createElement(React.Fragment, null, backdropElement, dialog), container2));
});
var propTypes = {
  /**
   * Set the visibility of the Modal
   */
  show: PropTypes.bool,
  /**
   * A DOM element, a `ref` to an element, or function that returns either. The Modal is appended to it's `container` element.
   *
   * For the sake of assistive technologies, the container should usually be the document body, so that the rest of the
   * page content can be placed behind a virtual backdrop as well as a visual one.
   */
  container: PropTypes.any,
  /**
   * A callback fired when the Modal is opening.
   */
  onShow: PropTypes.func,
  /**
   * A callback fired when either the backdrop is clicked, or the escape key is pressed.
   *
   * The `onHide` callback only signals intent from the Modal,
   * you must actually set the `show` prop to `false` for the Modal to close.
   */
  onHide: PropTypes.func,
  /**
   * Include a backdrop component.
   */
  backdrop: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf(["static"])]),
  /**
   * A function that returns the dialog component. Useful for custom
   * rendering. **Note:** the component should make sure to apply the provided ref.
   *
   * ```js static
   * renderDialog={props => <MyDialog {...props} />}
   * ```
   */
  renderDialog: PropTypes.func,
  /**
   * A function that returns a backdrop component. Useful for custom
   * backdrop rendering.
   *
   * ```js
   *  renderBackdrop={props => <MyBackdrop {...props} />}
   * ```
   */
  renderBackdrop: PropTypes.func,
  /**
   * A callback fired when the escape key, if specified in `keyboard`, is pressed.
   *
   * If preventDefault() is called on the keyboard event, closing the modal will be cancelled.
   */
  onEscapeKeyDown: PropTypes.func,
  /**
   * A callback fired when the backdrop, if specified, is clicked.
   */
  onBackdropClick: PropTypes.func,
  /**
   * A css class or set of classes applied to the modal container when the modal is open,
   * and removed when it is closed.
   */
  containerClassName: PropTypes.string,
  /**
   * Close the modal when escape key is pressed
   */
  keyboard: PropTypes.bool,
  /**
   * A `react-transition-group@2.0.0` `<Transition/>` component used
   * to control animations for the dialog component.
   */
  transition: PropTypes.elementType,
  /**
   * A `react-transition-group@2.0.0` `<Transition/>` component used
   * to control animations for the backdrop components.
   */
  backdropTransition: PropTypes.elementType,
  /**
   * When `true` The modal will automatically shift focus to itself when it opens, and
   * replace it to the last focused element when it closes. This also
   * works correctly with any Modal children that have the `autoFocus` prop.
   *
   * Generally this should never be set to `false` as it makes the Modal less
   * accessible to assistive technologies, like screen readers.
   */
  autoFocus: PropTypes.bool,
  /**
   * When `true` The modal will prevent focus from leaving the Modal while open.
   *
   * Generally this should never be set to `false` as it makes the Modal less
   * accessible to assistive technologies, like screen readers.
   */
  enforceFocus: PropTypes.bool,
  /**
   * When `true` The modal will restore focus to previously focused element once
   * modal is hidden
   */
  restoreFocus: PropTypes.bool,
  /**
   * Options passed to focus function when `restoreFocus` is set to `true`
   *
   * @link  https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus#Parameters
   */
  restoreFocusOptions: PropTypes.shape({
    preventScroll: PropTypes.bool
  }),
  /**
   * Callback fired before the Modal transitions in
   */
  onEnter: PropTypes.func,
  /**
   * Callback fired as the Modal begins to transition in
   */
  onEntering: PropTypes.func,
  /**
   * Callback fired after the Modal finishes transitioning in
   */
  onEntered: PropTypes.func,
  /**
   * Callback fired right before the Modal transitions out
   */
  onExit: PropTypes.func,
  /**
   * Callback fired as the Modal begins to transition out
   */
  onExiting: PropTypes.func,
  /**
   * Callback fired after the Modal finishes transitioning out
   */
  onExited: PropTypes.func,
  /**
   * A ModalManager instance used to track and manage the state of open
   * Modals. Useful when customizing how modals interact within a container
   */
  manager: PropTypes.instanceOf(ModalManager$1)
};
Modal.displayName = "Modal";
Modal.propTypes = propTypes;
const Modal$1 = Object.assign(Modal, {
  Manager: ModalManager$1
});
const iconIssues = "" + new URL("issues-5fea0ee6.svg", import.meta.url).href;
const iconSmiley = "" + new URL("smiley-7223e748.svg", import.meta.url).href;
const iconBug = "" + new URL("bug-c3c1b5c5.svg", import.meta.url).href;
const iconHelp = "" + new URL("help-2a0484bd.svg", import.meta.url).href;
const iconMail = "" + new URL("mail-a59f98c1.svg", import.meta.url).href;
const Backdrop = st("div")`
  position: fixed;
  z-index: 1040;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;
const Header$7 = st("h1")`
  font-size: 12px;
  font-weight: normal;
  border-bottom: 1px solid #333;
  margin: 0;
  padding-top: 10px;
  padding-bottom: 20px;
  padding-left: 10px;
`;
const BigMenuItem$1 = st(MenuItem)`
  height: 60px;
  line-height: auto;
  align-items: baseline;
  font-size: 12px;

  > img {
    position: relative;
    top: 2px;
  }
`;
const Tip$2 = st("div")`
  color: rgb(138, 143, 152);
  margin-top: -8px;
`;
const PositionedModal = st(Modal$1)`
  position: fixed;
  width: 480px;
  z-index: 1040;
  top: 200px;
  left: 50%;
  background: #252526;
  color: #cccccc;
  border: 1px solid #333;
  padding: 10px;
  box-shadow: rgba(0, 0, 0, 0.5) 0px 16px 100px;
  outline: 0;

  margin-left: -240px;

  :focus {
    outline: 0;
  }
`;
function HelpModal(props) {
  const context = reactExports.useContext(AppContext);
  const { show: showIntercom, boot: bootIntercom } = useIntercom();
  const renderBackdrop = (props2) => /* @__PURE__ */ jsxRuntimeExports.jsx(Backdrop, { ...props2 });
  const onSupportClicked = (event) => {
    let authUser = context.state.authUser;
    bootIntercom({
      hideDefaultLauncher: true,
      email: authUser ? authUser.email : "",
      name: authUser ? authUser.displayName : "",
      userId: authUser ? authUser.localId : ""
    });
    showIntercom();
    onMenuItemClicked();
  };
  const onMenuItemClicked = () => {
    props.onHide && props.onHide();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(PositionedModal, { show: props.show, onHide: props.onHide, renderBackdrop, "aria-labelledby": "modal-label", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header$7, { id: "modal-label", children: "Help and feedback" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(BigMenuItem$1, { src: iconBug, command: "inspect:toggleDoctor", onClick: onMenuItemClicked, children: [
      "Device and target diagnostics",
      /* @__PURE__ */ jsxRuntimeExports.jsx(Tip$2, { children: "Help debug problems with your devices and targets" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(BigMenuItem$1, { src: iconHelp, command: "inspect:openDocumentation", onClick: onMenuItemClicked, children: [
      "Documentation and FAQ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(Tip$2, { children: "Read our documentation and FAQ" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(BigMenuItem$1, { src: iconIssues, command: "inspect:reportIssue", onClick: onMenuItemClicked, children: [
      "Report issue or feature request on GitHub",
      /* @__PURE__ */ jsxRuntimeExports.jsx(Tip$2, { children: "Let us know if something isn't right or Inspect need something" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(BigMenuItem$1, { src: iconSmiley, command: "inspect:openSurvey", onClick: onMenuItemClicked, children: [
      "Help us make Inspect better",
      /* @__PURE__ */ jsxRuntimeExports.jsx(Tip$2, { children: "Got 30sec to provide your feedback on how we can make Inspect better?" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(BigMenuItem$1, { src: iconMail, onClick: onSupportClicked, children: [
      "Contact us",
      /* @__PURE__ */ jsxRuntimeExports.jsx(Tip$2, { children: "Ask us any question regarding Inspect" })
    ] })
  ] }) });
}
const Box$6 = st.div`
  width: 300px;
  position: absolute;
  bottom: 10px;
  right: -310px;
  background: #252526;
  color: #cccccc;

  box-shadow: rgba(0, 0, 0, 0.5) 0px 16px 100px;
  border-radius: 5px;
  overflow: hidden;
`;
const BigMenuItem = st(MenuItem)`
  height: 60px;
  line-height: auto;
  align-items: baseline;
  font-size: 12px;
  text-align: left;
  border-bottom: 1px solid #292d2e;
  border-radius: 0;
  margin: 0;
  padding-left: 10px;

  > img {
    position: relative;
    top: 2px;
  }

  span {
    padding: 7px;
  }

  strong {
    color: #cccccc;
  }
`;
const Tip$1 = st("div")`
  color: rgb(138, 143, 152);
  margin-top: -8px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;
const Header$6 = st("div")`
  padding: 10px 15px;
  text-align: left;
  border-bottom: 1px solid #292d2e;

  a {
    float: right;
  }
`;
const StyledLink = st(Link)`
  text-decoration: none;
`;
function ChangelogPopover(props) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Box$6, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Header$6, { children: [
      "Changelog",
      /* @__PURE__ */ jsxRuntimeExports.jsx(StyledLink, { href: "View all updates", command: "inspect:openChangelog", children: "See all updates" })
    ] }),
    props.changelog && props.changelog.releases.slice(0, 3).map((release) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      BigMenuItem,
      {
        title: release.title,
        link: release.url,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tip$1, { children: release.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: release.title })
        ]
      },
      release.name
    ))
  ] });
}
const NavWrapper = st.div`
  background: #252526;
  color: #cccccc;
  border-right: 1px solid #333;
  display: flex;
  flex-flow: column nowrap;
  width: 100%;
  height: 100%;
  user-select: none;
`;
const Explorer = st.div`
  flex: 1;
  overflow: auto;
  padding: 0;
  margin: 0;
  text-align: left;
`;
const ExplorerTitle = st.div`
  font-size: 11px;
  text-transform: uppercase;
  padding: 10px 5px 10px 15px;
  height: 37px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  margin: 0;
`;
const Devices = st.div`
  font-size: 12px;
  padding: 0 5px;
`;
const Device = st.div`
  display: block;
  cursor: pointer;
`;
const App$1 = st.div`
  display: block;
`;
const Tip = st.div`
  display: block;
  cursor: default;
  font-size: 12px;
  padding: 5px 10px;
  font-style: italic;
  line-height: 22px;
`;
const Help = st.div`
  font-size: 12px;
  padding: 5px 5px;
`;
const Indent = st.div`
  padding: 0 0 0 20px;
`;
const User = st.div`
  font-size: 12px;
  text-align: left;
  padding: 5px 5px;
  border-bottom: 1px solid #333;
`;
const AccountPopOver = st.div`
  width: 240px;
  position: absolute;
  top: 45px;
  left: 5px;
  background: #252526;
  color: #cccccc;

  box-shadow: rgba(0, 0, 0, 0.5) 0px 16px 100px;
`;
const ChangelogMenuItem = st.div`
  display: block;
  position: absolute;
  right: 20px;
  margin-top: -23px;
  float: right;
  width: 8px;
  height: 8px;

  transition-duration: 0.1s;
  transition-property: box-shadow;
  background-color: rgb(48, 50, 54);
  box-shadow: rgb(45, 47, 54) 0px 0px 0px 0px;

  border-radius: 50%;
  cursor: pointer;

  &.active {
    background-color: #5e5ce6;
  }

  &:before {
    position: absolute;
    content: '';
    top: -10px;
    right: -10px;
    left: -10px;
    bottom: -10px;
  }

  &:hover {
    box-shadow: rgb(45, 47, 54) 0px 0px 0px 3px;
  }
`;
st(Link)`
  color: #858585;
  font-size: 12px;
  text-align: center;
  cursor: pointer;
`;
const Nav = () => {
  const context = reactExports.useContext(AppContext);
  const [showHelpModal, setShowHelpModal] = reactExports.useState(false);
  const [showAccountPopover, setShowAccountPopover] = reactExports.useState(false);
  const [showChangelogPopover, setChangelogPopover] = reactExports.useState(false);
  let selectTarget = (targetId) => {
    context.selectTarget(targetId);
  };
  let highlightTarget = (targetId) => {
    context.highlightTarget(targetId);
  };
  let unhighlightTarget = (targetId) => {
    context.unhighlightTarget(targetId);
  };
  const onResized = (event, direction, refToElement, delta) => {
    let currentWidth = refToElement.clientWidth;
    context.setNavWidth(currentWidth);
  };
  const onHelpClicked = () => {
    setShowHelpModal(true);
  };
  const onHelpModalHidden = () => {
    setShowHelpModal(false);
  };
  const toggleAccountPopover = () => {
    setShowAccountPopover(!showAccountPopover);
  };
  const toggleChangelogPopover = () => {
    setChangelogPopover(!showChangelogPopover);
    if (latestSeenChangelogVersion !== latestChangelogReleaseName) {
      context.setLatestSeenChangelogVersion(latestChangelogReleaseName);
    }
  };
  let currentNavWidth = context.getNavWidth() || 250;
  let isActiveSubscription = context.state?.subscriptionStatus?.status == "active";
  let isDebuggingEnabled = context.isDebuggingEnabled();
  let changelog = context.state?.changelog;
  let latestChangelogReleaseName = context.state?.changelog?.releases[0].name;
  let latestSeenChangelogVersion = context.getLatestSeenChangelogVersion();
  let remainingSessionTime = context.state?.sessionTracking?.remainingSessionTime ? Math.ceil(context.state?.sessionTracking?.remainingSessionTime / 1e3 / 60) : 0;
  context.state?.sessionTracking?.hasTotalSessionTimeExpired;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    Resizable,
    {
      minWidth: "200",
      maxWidth: "50%",
      size: {
        width: currentNavWidth,
        height: "auto"
      },
      onResizeStop: onResized,
      enable: {
        top: false,
        right: true,
        bottom: false,
        left: false,
        topRight: false,
        bottomRight: false,
        bottomLeft: false,
        topLeft: false
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(NavWrapper, { children: [
        context.state?.authUser && /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(MenuItem, { src: iconAccount, onClick: () => toggleAccountPopover(), children: [
          context.state.authUser.displayName || context.state.authUser.email || "",
          showAccountPopover && /* @__PURE__ */ jsxRuntimeExports.jsxs(AccountPopOver, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MenuItem, { src: iconSettings, command: "inspect:openAccount", children: "Settings" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(MenuItem, { src: iconSignout, command: "inspect:logOut", children: "Log out" })
          ] })
        ] }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Explorer, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ExplorerTitle, { children: "Available devices" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Devices, { children: [
            !context.state?.devices?.length && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MenuItem, { src: iconExclamation, children: "No devices found." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Indent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tip, { children: [
                "Please connect your devices or start your iOS simulator.",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                  "If this doesn't work, try to to",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { command: "inspect:resetSetup", href: "#", children: "re-run setup" }),
                  "."
                ] })
              ] }) })
            ] }),
            context.state?.devices?.map((device) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Device, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                MenuItem,
                {
                  src: iconPhone,
                  title: `${device.name} (${device.platformType} ${device.platformVersion})`,
                  children: [
                    device.name,
                    " (",
                    device.platformType,
                    " ",
                    device.platformVersion,
                    ")"
                  ]
                },
                device.id
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Indent, { children: device.isLocked || device.isPaired === false || !device.apps?.filter((app2) => app2.isActive === true).length ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                device.isPaired === false && !device.isLocked && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MenuItem, { src: iconExclamation, children: "Device not paired." }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Tip, { children: [
                    "Get help by running",
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { href: "#", command: "inspect:toggleDoctor", children: "device and target diagnostics" }),
                    "."
                  ] })
                ] }),
                device.isLocked && device.isPaired && /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(MenuItem, { src: iconExclamation, children: "Please unlock your device." }) }),
                device.isPaired && !device.isLocked && !device.apps?.filter((app2) => app2.isActive === true).length && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MenuItem, { src: iconExclamation, children: "No debuggable apps found." }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Tip, { children: "Try to start or switch to your app on the device." })
                ] })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: device.apps?.filter((app2) => app2.isActive === true).map((app2) => /* @__PURE__ */ jsxRuntimeExports.jsxs(App$1, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MenuItem, { src: iconApp, title: `${app2.name} (${app2.bundleId})`, children: `${app2.name}` }, app2.id),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Indent, { children: [
                  !app2.targets?.length && /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Tip, { children: "No debuggable targets found." }) }),
                  app2.targets?.map((target) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    MenuItem,
                    {
                      src: iconPage,
                      isDisabled: context.state?.activeTargetId === target.id ? false : !target.isDebuggable,
                      isActive: context.state?.activeTargetId === target.id,
                      title: target.url,
                      onClick: () => selectTarget(target.id),
                      onMouseEnter: () => highlightTarget(target.id),
                      onMouseLeave: () => unhighlightTarget(target.id),
                      children: target.title || target.url
                    },
                    target.id
                  ))
                ] })
              ] }, app2.id)) }) })
            ] }, device.id))
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Help, { children: [
          !isActiveSubscription && remainingSessionTime > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(MenuItem, { src: iconWarning, children: [
            "You have ",
            remainingSessionTime,
            "min of debugging left"
          ] }),
          !isDebuggingEnabled && /* @__PURE__ */ jsxRuntimeExports.jsx(MenuItem, { src: iconWarning, command: "inspect:buyLicense", children: "Debugging exceeded for today." }),
          isActiveSubscription && /* @__PURE__ */ jsxRuntimeExports.jsx(MenuItem, { src: iconHome, command: "inspect:buyLicense", children: "Inspect Pro" }),
          !isActiveSubscription && /* @__PURE__ */ jsxRuntimeExports.jsx(MenuItem, { src: iconHome, command: "inspect:buyLicense", children: "Inspect Core" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(MenuItem, { src: iconFeedback, onClick: onHelpClicked, children: "Help and feedback" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ChangelogMenuItem,
            {
              className: latestSeenChangelogVersion !== latestChangelogReleaseName ? "active" : "",
              onClick: () => toggleChangelogPopover(),
              title: "Changelog"
            }
          ),
          showChangelogPopover && /* @__PURE__ */ jsxRuntimeExports.jsx(ChangelogPopover, { changelog })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(HelpModal, { show: showHelpModal, onHide: onHelpModalHidden })
      ] })
    }
  ) });
};
const imageScale = ct`
  from {
    transform:scale(0)
  }

  to {
    transform:scale(1)
  }
`;
const LoaderBox = st.div`
  display: flex;
  user-select: none;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;
const Image$1 = st.div`
  font-size: 12px;
  animation: ${imageScale} 0.6s cubic-bezier(0.165, 0.84, 0.44, 1) both;
`;
const Loader = () => {
  const context = reactExports.useContext(AppContext);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderBox, { style: { opacity: context.state.isLoading ? "1" : "0", display: context.state.isLoading ? "flex" : "none" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Image$1, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "100px", height: "100px", viewBox: "0 0 100 100", version: "1.1", xmlns: "http://www.w3.org/2000/svg", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("title", { children: "logo" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("g", { id: "Page-1", stroke: "none", strokeWidth: "1", fill: "none", fillRule: "evenodd", children: /* @__PURE__ */ jsxRuntimeExports.jsx("g", { id: "logo", fill: "#151515", fillRule: "nonzero", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "path",
      {
        d: "M30.6666667,92 L11.5,92 C3.83333333,92 0,88.1666667 0,80.5 L0,11.5 C0,3.83333333 3.83333333,0 11.5,0 L80.5,0 C92,0 92,11.2531333 92,11.5 L92,30.6666667 L84.3333333,30.6666667 L84.3333333,7.66666667 L7.66666667,7.66666667 L7.66666667,84.3333333 L30.6666667,84.3333333 L30.6666667,92 Z M100,53.5 L76.75,69 L100,92.25 L92.25,100 L69,76.75 L53.5,100 L38,38 L100,53.5 Z",
        id: "path348"
      }
    ) }) })
  ] }) }) });
};
const logo$1 = "" + new URL("logo-1353e342.svg", import.meta.url).href;
const webInspector = "" + new URL("web_inspector-40c25b00.png", import.meta.url).href;
const imgFinder = "" + new URL("finder-592414ca.png", import.meta.url).href;
const imgWindowsiTunes = "" + new URL("windows_itunes-0b4bf996.png", import.meta.url).href;
const imgWindowsITunesPhone = "" + new URL("windows_itunes_iphone-e81f2c2e.png", import.meta.url).href;
const imgHighFive = "" + new URL("high_five-89287e40.gif", import.meta.url).href;
const Button = st(Link)`
  font-size: 14px;
  line-height: 100%;
  font-weight: 600;
  border-radius: 4px !important;
  padding: 15px 20px;
  color: #fff;
  border: 0;
  text-align: center;
  cursor: pointer;
  width: 100%;
  display: inline-block;
  box-sizing: border-box;

  background: #5e5ce6;
  font-weight: normal;
  color: #fff;

  &:hover {
    background: #5e5ce6;
    color: #fff;
  }
`;
var lib = {};
var createWizardComponent$1 = {};
var renderCallback$1 = {};
Object.defineProperty(renderCallback$1, "__esModule", {
  value: true
});
var renderCallback = function renderCallback2(_ref, wizard) {
  var render = _ref.render, children = _ref.children;
  if (render) {
    return render(wizard);
  } else if (typeof children === "function") {
    return children(wizard);
  }
  return children;
};
renderCallback$1.default = renderCallback;
Object.defineProperty(createWizardComponent$1, "__esModule", {
  value: true
});
var _propTypes$4 = propTypesExports;
var _propTypes2$4 = _interopRequireDefault$5(_propTypes$4);
var _renderCallback$1 = renderCallback$1;
var _renderCallback2$1 = _interopRequireDefault$5(_renderCallback$1);
function _interopRequireDefault$5(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
function _objectWithoutProperties$3(obj, keys) {
  var target = {};
  for (var i in obj) {
    if (keys.indexOf(i) >= 0)
      continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i))
      continue;
    target[i] = obj[i];
  }
  return target;
}
var createWizardComponent = function createWizardComponent2(name) {
  var WizardComponent = function WizardComponent2(props, _ref) {
    var _ref$wizard = _ref.wizard;
    _ref$wizard.init;
    var wizard = _objectWithoutProperties$3(_ref$wizard, ["init"]);
    return (0, _renderCallback2$1.default)(props, wizard);
  };
  WizardComponent.contextTypes = {
    wizard: _propTypes2$4.default.object
  };
  WizardComponent.displayName = name;
  return WizardComponent;
};
createWizardComponent$1.default = createWizardComponent;
var Wizard$2 = {};
function isAbsolute(pathname) {
  return pathname.charAt(0) === "/";
}
function spliceOne(list, index) {
  for (var i = index, k2 = i + 1, n2 = list.length; k2 < n2; i += 1, k2 += 1) {
    list[i] = list[k2];
  }
  list.pop();
}
function resolvePathname(to, from2) {
  if (from2 === void 0)
    from2 = "";
  var toParts = to && to.split("/") || [];
  var fromParts = from2 && from2.split("/") || [];
  var isToAbs = to && isAbsolute(to);
  var isFromAbs = from2 && isAbsolute(from2);
  var mustEndAbs = isToAbs || isFromAbs;
  if (to && isAbsolute(to)) {
    fromParts = toParts;
  } else if (toParts.length) {
    fromParts.pop();
    fromParts = fromParts.concat(toParts);
  }
  if (!fromParts.length)
    return "/";
  var hasTrailingSlash;
  if (fromParts.length) {
    var last = fromParts[fromParts.length - 1];
    hasTrailingSlash = last === "." || last === ".." || last === "";
  } else {
    hasTrailingSlash = false;
  }
  var up = 0;
  for (var i = fromParts.length; i >= 0; i--) {
    var part = fromParts[i];
    if (part === ".") {
      spliceOne(fromParts, i);
    } else if (part === "..") {
      spliceOne(fromParts, i);
      up++;
    } else if (up) {
      spliceOne(fromParts, i);
      up--;
    }
  }
  if (!mustEndAbs)
    for (; up--; up)
      fromParts.unshift("..");
  if (mustEndAbs && fromParts[0] !== "" && (!fromParts[0] || !isAbsolute(fromParts[0])))
    fromParts.unshift("");
  var result = fromParts.join("/");
  if (hasTrailingSlash && result.substr(-1) !== "/")
    result += "/";
  return result;
}
function valueOf(obj) {
  return obj.valueOf ? obj.valueOf() : Object.prototype.valueOf.call(obj);
}
function valueEqual(a, b) {
  if (a === b)
    return true;
  if (a == null || b == null)
    return false;
  if (Array.isArray(a)) {
    return Array.isArray(b) && a.length === b.length && a.every(function(item, index) {
      return valueEqual(item, b[index]);
    });
  }
  if (typeof a === "object" || typeof b === "object") {
    var aValue = valueOf(a);
    var bValue = valueOf(b);
    if (aValue !== a || bValue !== b)
      return valueEqual(aValue, bValue);
    return Object.keys(Object.assign({}, a, b)).every(function(key) {
      return valueEqual(a[key], b[key]);
    });
  }
  return false;
}
var isProduction = true;
var prefix = "Invariant failed";
function invariant(condition, message) {
  if (condition) {
    return;
  }
  if (isProduction) {
    throw new Error(prefix);
  }
  var provided = typeof message === "function" ? message() : message;
  var value = provided ? "".concat(prefix, ": ").concat(provided) : prefix;
  throw new Error(value);
}
function addLeadingSlash(path) {
  return path.charAt(0) === "/" ? path : "/" + path;
}
function stripLeadingSlash(path) {
  return path.charAt(0) === "/" ? path.substr(1) : path;
}
function hasBasename(path, prefix2) {
  return path.toLowerCase().indexOf(prefix2.toLowerCase()) === 0 && "/?#".indexOf(path.charAt(prefix2.length)) !== -1;
}
function stripBasename(path, prefix2) {
  return hasBasename(path, prefix2) ? path.substr(prefix2.length) : path;
}
function stripTrailingSlash(path) {
  return path.charAt(path.length - 1) === "/" ? path.slice(0, -1) : path;
}
function parsePath(path) {
  var pathname = path || "/";
  var search = "";
  var hash2 = "";
  var hashIndex = pathname.indexOf("#");
  if (hashIndex !== -1) {
    hash2 = pathname.substr(hashIndex);
    pathname = pathname.substr(0, hashIndex);
  }
  var searchIndex = pathname.indexOf("?");
  if (searchIndex !== -1) {
    search = pathname.substr(searchIndex);
    pathname = pathname.substr(0, searchIndex);
  }
  return {
    pathname,
    search: search === "?" ? "" : search,
    hash: hash2 === "#" ? "" : hash2
  };
}
function createPath(location) {
  var pathname = location.pathname, search = location.search, hash2 = location.hash;
  var path = pathname || "/";
  if (search && search !== "?")
    path += search.charAt(0) === "?" ? search : "?" + search;
  if (hash2 && hash2 !== "#")
    path += hash2.charAt(0) === "#" ? hash2 : "#" + hash2;
  return path;
}
function createLocation(path, state, key, currentLocation) {
  var location;
  if (typeof path === "string") {
    location = parsePath(path);
    location.state = state;
  } else {
    location = _extends$2({}, path);
    if (location.pathname === void 0)
      location.pathname = "";
    if (location.search) {
      if (location.search.charAt(0) !== "?")
        location.search = "?" + location.search;
    } else {
      location.search = "";
    }
    if (location.hash) {
      if (location.hash.charAt(0) !== "#")
        location.hash = "#" + location.hash;
    } else {
      location.hash = "";
    }
    if (state !== void 0 && location.state === void 0)
      location.state = state;
  }
  try {
    location.pathname = decodeURI(location.pathname);
  } catch (e) {
    if (e instanceof URIError) {
      throw new URIError('Pathname "' + location.pathname + '" could not be decoded. This is likely caused by an invalid percent-encoding.');
    } else {
      throw e;
    }
  }
  if (key)
    location.key = key;
  if (currentLocation) {
    if (!location.pathname) {
      location.pathname = currentLocation.pathname;
    } else if (location.pathname.charAt(0) !== "/") {
      location.pathname = resolvePathname(location.pathname, currentLocation.pathname);
    }
  } else {
    if (!location.pathname) {
      location.pathname = "/";
    }
  }
  return location;
}
function locationsAreEqual(a, b) {
  return a.pathname === b.pathname && a.search === b.search && a.hash === b.hash && a.key === b.key && valueEqual(a.state, b.state);
}
function createTransitionManager() {
  var prompt = null;
  function setPrompt(nextPrompt) {
    prompt = nextPrompt;
    return function() {
      if (prompt === nextPrompt)
        prompt = null;
    };
  }
  function confirmTransitionTo(location, action, getUserConfirmation, callback) {
    if (prompt != null) {
      var result = typeof prompt === "function" ? prompt(location, action) : prompt;
      if (typeof result === "string") {
        if (typeof getUserConfirmation === "function") {
          getUserConfirmation(result, callback);
        } else {
          callback(true);
        }
      } else {
        callback(result !== false);
      }
    } else {
      callback(true);
    }
  }
  var listeners2 = [];
  function appendListener(fn) {
    var isActive = true;
    function listener() {
      if (isActive)
        fn.apply(void 0, arguments);
    }
    listeners2.push(listener);
    return function() {
      isActive = false;
      listeners2 = listeners2.filter(function(item) {
        return item !== listener;
      });
    };
  }
  function notifyListeners() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    listeners2.forEach(function(listener) {
      return listener.apply(void 0, args);
    });
  }
  return {
    setPrompt,
    confirmTransitionTo,
    appendListener,
    notifyListeners
  };
}
var canUseDOM = !!(typeof window !== "undefined" && window.document && window.document.createElement);
function getConfirmation(message, callback) {
  callback(window.confirm(message));
}
function supportsHistory() {
  var ua2 = window.navigator.userAgent;
  if ((ua2.indexOf("Android 2.") !== -1 || ua2.indexOf("Android 4.0") !== -1) && ua2.indexOf("Mobile Safari") !== -1 && ua2.indexOf("Chrome") === -1 && ua2.indexOf("Windows Phone") === -1)
    return false;
  return window.history && "pushState" in window.history;
}
function supportsPopStateOnHashChange() {
  return window.navigator.userAgent.indexOf("Trident") === -1;
}
function supportsGoWithoutReloadUsingHash() {
  return window.navigator.userAgent.indexOf("Firefox") === -1;
}
function isExtraneousPopstateEvent(event) {
  return event.state === void 0 && navigator.userAgent.indexOf("CriOS") === -1;
}
var PopStateEvent = "popstate";
var HashChangeEvent = "hashchange";
function getHistoryState() {
  try {
    return window.history.state || {};
  } catch (e) {
    return {};
  }
}
function createBrowserHistory(props) {
  if (props === void 0) {
    props = {};
  }
  !canUseDOM ? invariant(false) : void 0;
  var globalHistory = window.history;
  var canUseHistory = supportsHistory();
  var needsHashChangeListener = !supportsPopStateOnHashChange();
  var _props = props, _props$forceRefresh = _props.forceRefresh, forceRefresh = _props$forceRefresh === void 0 ? false : _props$forceRefresh, _props$getUserConfirm = _props.getUserConfirmation, getUserConfirmation = _props$getUserConfirm === void 0 ? getConfirmation : _props$getUserConfirm, _props$keyLength = _props.keyLength, keyLength = _props$keyLength === void 0 ? 6 : _props$keyLength;
  var basename = props.basename ? stripTrailingSlash(addLeadingSlash(props.basename)) : "";
  function getDOMLocation(historyState) {
    var _ref = historyState || {}, key = _ref.key, state = _ref.state;
    var _window$location = window.location, pathname = _window$location.pathname, search = _window$location.search, hash2 = _window$location.hash;
    var path = pathname + search + hash2;
    if (basename)
      path = stripBasename(path, basename);
    return createLocation(path, state, key);
  }
  function createKey() {
    return Math.random().toString(36).substr(2, keyLength);
  }
  var transitionManager = createTransitionManager();
  function setState(nextState) {
    _extends$2(history2, nextState);
    history2.length = globalHistory.length;
    transitionManager.notifyListeners(history2.location, history2.action);
  }
  function handlePopState(event) {
    if (isExtraneousPopstateEvent(event))
      return;
    handlePop(getDOMLocation(event.state));
  }
  function handleHashChange() {
    handlePop(getDOMLocation(getHistoryState()));
  }
  var forceNextPop = false;
  function handlePop(location) {
    if (forceNextPop) {
      forceNextPop = false;
      setState();
    } else {
      var action = "POP";
      transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function(ok2) {
        if (ok2) {
          setState({
            action,
            location
          });
        } else {
          revertPop(location);
        }
      });
    }
  }
  function revertPop(fromLocation) {
    var toLocation = history2.location;
    var toIndex = allKeys.indexOf(toLocation.key);
    if (toIndex === -1)
      toIndex = 0;
    var fromIndex = allKeys.indexOf(fromLocation.key);
    if (fromIndex === -1)
      fromIndex = 0;
    var delta = toIndex - fromIndex;
    if (delta) {
      forceNextPop = true;
      go(delta);
    }
  }
  var initialLocation = getDOMLocation(getHistoryState());
  var allKeys = [initialLocation.key];
  function createHref(location) {
    return basename + createPath(location);
  }
  function push(path, state) {
    var action = "PUSH";
    var location = createLocation(path, state, createKey(), history2.location);
    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function(ok2) {
      if (!ok2)
        return;
      var href = createHref(location);
      var key = location.key, state2 = location.state;
      if (canUseHistory) {
        globalHistory.pushState({
          key,
          state: state2
        }, null, href);
        if (forceRefresh) {
          window.location.href = href;
        } else {
          var prevIndex = allKeys.indexOf(history2.location.key);
          var nextKeys = allKeys.slice(0, prevIndex + 1);
          nextKeys.push(location.key);
          allKeys = nextKeys;
          setState({
            action,
            location
          });
        }
      } else {
        window.location.href = href;
      }
    });
  }
  function replace2(path, state) {
    var action = "REPLACE";
    var location = createLocation(path, state, createKey(), history2.location);
    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function(ok2) {
      if (!ok2)
        return;
      var href = createHref(location);
      var key = location.key, state2 = location.state;
      if (canUseHistory) {
        globalHistory.replaceState({
          key,
          state: state2
        }, null, href);
        if (forceRefresh) {
          window.location.replace(href);
        } else {
          var prevIndex = allKeys.indexOf(history2.location.key);
          if (prevIndex !== -1)
            allKeys[prevIndex] = location.key;
          setState({
            action,
            location
          });
        }
      } else {
        window.location.replace(href);
      }
    });
  }
  function go(n2) {
    globalHistory.go(n2);
  }
  function goBack() {
    go(-1);
  }
  function goForward() {
    go(1);
  }
  var listenerCount2 = 0;
  function checkDOMListeners(delta) {
    listenerCount2 += delta;
    if (listenerCount2 === 1 && delta === 1) {
      window.addEventListener(PopStateEvent, handlePopState);
      if (needsHashChangeListener)
        window.addEventListener(HashChangeEvent, handleHashChange);
    } else if (listenerCount2 === 0) {
      window.removeEventListener(PopStateEvent, handlePopState);
      if (needsHashChangeListener)
        window.removeEventListener(HashChangeEvent, handleHashChange);
    }
  }
  var isBlocked = false;
  function block(prompt) {
    if (prompt === void 0) {
      prompt = false;
    }
    var unblock = transitionManager.setPrompt(prompt);
    if (!isBlocked) {
      checkDOMListeners(1);
      isBlocked = true;
    }
    return function() {
      if (isBlocked) {
        isBlocked = false;
        checkDOMListeners(-1);
      }
      return unblock();
    };
  }
  function listen2(listener) {
    var unlisten = transitionManager.appendListener(listener);
    checkDOMListeners(1);
    return function() {
      checkDOMListeners(-1);
      unlisten();
    };
  }
  var history2 = {
    length: globalHistory.length,
    action: "POP",
    location: initialLocation,
    createHref,
    push,
    replace: replace2,
    go,
    goBack,
    goForward,
    block,
    listen: listen2
  };
  return history2;
}
var HashChangeEvent$1 = "hashchange";
var HashPathCoders = {
  hashbang: {
    encodePath: function encodePath(path) {
      return path.charAt(0) === "!" ? path : "!/" + stripLeadingSlash(path);
    },
    decodePath: function decodePath(path) {
      return path.charAt(0) === "!" ? path.substr(1) : path;
    }
  },
  noslash: {
    encodePath: stripLeadingSlash,
    decodePath: addLeadingSlash
  },
  slash: {
    encodePath: addLeadingSlash,
    decodePath: addLeadingSlash
  }
};
function stripHash(url) {
  var hashIndex = url.indexOf("#");
  return hashIndex === -1 ? url : url.slice(0, hashIndex);
}
function getHashPath() {
  var href = window.location.href;
  var hashIndex = href.indexOf("#");
  return hashIndex === -1 ? "" : href.substring(hashIndex + 1);
}
function pushHashPath(path) {
  window.location.hash = path;
}
function replaceHashPath(path) {
  window.location.replace(stripHash(window.location.href) + "#" + path);
}
function createHashHistory(props) {
  if (props === void 0) {
    props = {};
  }
  !canUseDOM ? invariant(false) : void 0;
  var globalHistory = window.history;
  supportsGoWithoutReloadUsingHash();
  var _props = props, _props$getUserConfirm = _props.getUserConfirmation, getUserConfirmation = _props$getUserConfirm === void 0 ? getConfirmation : _props$getUserConfirm, _props$hashType = _props.hashType, hashType = _props$hashType === void 0 ? "slash" : _props$hashType;
  var basename = props.basename ? stripTrailingSlash(addLeadingSlash(props.basename)) : "";
  var _HashPathCoders$hashT = HashPathCoders[hashType], encodePath2 = _HashPathCoders$hashT.encodePath, decodePath2 = _HashPathCoders$hashT.decodePath;
  function getDOMLocation() {
    var path2 = decodePath2(getHashPath());
    if (basename)
      path2 = stripBasename(path2, basename);
    return createLocation(path2);
  }
  var transitionManager = createTransitionManager();
  function setState(nextState) {
    _extends$2(history2, nextState);
    history2.length = globalHistory.length;
    transitionManager.notifyListeners(history2.location, history2.action);
  }
  var forceNextPop = false;
  var ignorePath = null;
  function locationsAreEqual$$1(a, b) {
    return a.pathname === b.pathname && a.search === b.search && a.hash === b.hash;
  }
  function handleHashChange() {
    var path2 = getHashPath();
    var encodedPath2 = encodePath2(path2);
    if (path2 !== encodedPath2) {
      replaceHashPath(encodedPath2);
    } else {
      var location = getDOMLocation();
      var prevLocation = history2.location;
      if (!forceNextPop && locationsAreEqual$$1(prevLocation, location))
        return;
      if (ignorePath === createPath(location))
        return;
      ignorePath = null;
      handlePop(location);
    }
  }
  function handlePop(location) {
    if (forceNextPop) {
      forceNextPop = false;
      setState();
    } else {
      var action = "POP";
      transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function(ok2) {
        if (ok2) {
          setState({
            action,
            location
          });
        } else {
          revertPop(location);
        }
      });
    }
  }
  function revertPop(fromLocation) {
    var toLocation = history2.location;
    var toIndex = allPaths.lastIndexOf(createPath(toLocation));
    if (toIndex === -1)
      toIndex = 0;
    var fromIndex = allPaths.lastIndexOf(createPath(fromLocation));
    if (fromIndex === -1)
      fromIndex = 0;
    var delta = toIndex - fromIndex;
    if (delta) {
      forceNextPop = true;
      go(delta);
    }
  }
  var path = getHashPath();
  var encodedPath = encodePath2(path);
  if (path !== encodedPath)
    replaceHashPath(encodedPath);
  var initialLocation = getDOMLocation();
  var allPaths = [createPath(initialLocation)];
  function createHref(location) {
    var baseTag = document.querySelector("base");
    var href = "";
    if (baseTag && baseTag.getAttribute("href")) {
      href = stripHash(window.location.href);
    }
    return href + "#" + encodePath2(basename + createPath(location));
  }
  function push(path2, state) {
    var action = "PUSH";
    var location = createLocation(path2, void 0, void 0, history2.location);
    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function(ok2) {
      if (!ok2)
        return;
      var path3 = createPath(location);
      var encodedPath2 = encodePath2(basename + path3);
      var hashChanged = getHashPath() !== encodedPath2;
      if (hashChanged) {
        ignorePath = path3;
        pushHashPath(encodedPath2);
        var prevIndex = allPaths.lastIndexOf(createPath(history2.location));
        var nextPaths = allPaths.slice(0, prevIndex + 1);
        nextPaths.push(path3);
        allPaths = nextPaths;
        setState({
          action,
          location
        });
      } else {
        setState();
      }
    });
  }
  function replace2(path2, state) {
    var action = "REPLACE";
    var location = createLocation(path2, void 0, void 0, history2.location);
    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function(ok2) {
      if (!ok2)
        return;
      var path3 = createPath(location);
      var encodedPath2 = encodePath2(basename + path3);
      var hashChanged = getHashPath() !== encodedPath2;
      if (hashChanged) {
        ignorePath = path3;
        replaceHashPath(encodedPath2);
      }
      var prevIndex = allPaths.indexOf(createPath(history2.location));
      if (prevIndex !== -1)
        allPaths[prevIndex] = path3;
      setState({
        action,
        location
      });
    });
  }
  function go(n2) {
    globalHistory.go(n2);
  }
  function goBack() {
    go(-1);
  }
  function goForward() {
    go(1);
  }
  var listenerCount2 = 0;
  function checkDOMListeners(delta) {
    listenerCount2 += delta;
    if (listenerCount2 === 1 && delta === 1) {
      window.addEventListener(HashChangeEvent$1, handleHashChange);
    } else if (listenerCount2 === 0) {
      window.removeEventListener(HashChangeEvent$1, handleHashChange);
    }
  }
  var isBlocked = false;
  function block(prompt) {
    if (prompt === void 0) {
      prompt = false;
    }
    var unblock = transitionManager.setPrompt(prompt);
    if (!isBlocked) {
      checkDOMListeners(1);
      isBlocked = true;
    }
    return function() {
      if (isBlocked) {
        isBlocked = false;
        checkDOMListeners(-1);
      }
      return unblock();
    };
  }
  function listen2(listener) {
    var unlisten = transitionManager.appendListener(listener);
    checkDOMListeners(1);
    return function() {
      checkDOMListeners(-1);
      unlisten();
    };
  }
  var history2 = {
    length: globalHistory.length,
    action: "POP",
    location: initialLocation,
    createHref,
    push,
    replace: replace2,
    go,
    goBack,
    goForward,
    block,
    listen: listen2
  };
  return history2;
}
function clamp(n2, lowerBound, upperBound) {
  return Math.min(Math.max(n2, lowerBound), upperBound);
}
function createMemoryHistory(props) {
  if (props === void 0) {
    props = {};
  }
  var _props = props, getUserConfirmation = _props.getUserConfirmation, _props$initialEntries = _props.initialEntries, initialEntries = _props$initialEntries === void 0 ? ["/"] : _props$initialEntries, _props$initialIndex = _props.initialIndex, initialIndex = _props$initialIndex === void 0 ? 0 : _props$initialIndex, _props$keyLength = _props.keyLength, keyLength = _props$keyLength === void 0 ? 6 : _props$keyLength;
  var transitionManager = createTransitionManager();
  function setState(nextState) {
    _extends$2(history2, nextState);
    history2.length = history2.entries.length;
    transitionManager.notifyListeners(history2.location, history2.action);
  }
  function createKey() {
    return Math.random().toString(36).substr(2, keyLength);
  }
  var index = clamp(initialIndex, 0, initialEntries.length - 1);
  var entries = initialEntries.map(function(entry) {
    return typeof entry === "string" ? createLocation(entry, void 0, createKey()) : createLocation(entry, void 0, entry.key || createKey());
  });
  var createHref = createPath;
  function push(path, state) {
    var action = "PUSH";
    var location = createLocation(path, state, createKey(), history2.location);
    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function(ok2) {
      if (!ok2)
        return;
      var prevIndex = history2.index;
      var nextIndex = prevIndex + 1;
      var nextEntries = history2.entries.slice(0);
      if (nextEntries.length > nextIndex) {
        nextEntries.splice(nextIndex, nextEntries.length - nextIndex, location);
      } else {
        nextEntries.push(location);
      }
      setState({
        action,
        location,
        index: nextIndex,
        entries: nextEntries
      });
    });
  }
  function replace2(path, state) {
    var action = "REPLACE";
    var location = createLocation(path, state, createKey(), history2.location);
    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function(ok2) {
      if (!ok2)
        return;
      history2.entries[history2.index] = location;
      setState({
        action,
        location
      });
    });
  }
  function go(n2) {
    var nextIndex = clamp(history2.index + n2, 0, history2.entries.length - 1);
    var action = "POP";
    var location = history2.entries[nextIndex];
    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function(ok2) {
      if (ok2) {
        setState({
          action,
          location,
          index: nextIndex
        });
      } else {
        setState();
      }
    });
  }
  function goBack() {
    go(-1);
  }
  function goForward() {
    go(1);
  }
  function canGo(n2) {
    var nextIndex = history2.index + n2;
    return nextIndex >= 0 && nextIndex < history2.entries.length;
  }
  function block(prompt) {
    if (prompt === void 0) {
      prompt = false;
    }
    return transitionManager.setPrompt(prompt);
  }
  function listen2(listener) {
    return transitionManager.appendListener(listener);
  }
  var history2 = {
    length: entries.length,
    action: "POP",
    location: entries[index],
    index,
    entries,
    createHref,
    push,
    replace: replace2,
    go,
    goBack,
    goForward,
    canGo,
    block,
    listen: listen2
  };
  return history2;
}
const history = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  createBrowserHistory,
  createHashHistory,
  createLocation,
  createMemoryHistory,
  createPath,
  locationsAreEqual,
  parsePath
}, Symbol.toStringTag, { value: "Module" }));
const require$$2 = /* @__PURE__ */ getAugmentedNamespace(history);
Object.defineProperty(Wizard$2, "__esModule", {
  value: true
});
var _extends$1 = Object.assign || function(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }
  return target;
};
var _slicedToArray$1 = function() {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e2 = void 0;
    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);
        if (i && _arr.length === i)
          break;
      }
    } catch (err) {
      _d = true;
      _e2 = err;
    } finally {
      try {
        if (!_n && _i["return"])
          _i["return"]();
      } finally {
        if (_d)
          throw _e2;
      }
    }
    return _arr;
  }
  return function(arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();
var _createClass$1 = function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor)
        descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps)
      defineProperties(Constructor.prototype, protoProps);
    if (staticProps)
      defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();
var _react$2 = reactExports;
var _propTypes$3 = propTypesExports;
var _propTypes2$3 = _interopRequireDefault$4(_propTypes$3);
var _history = require$$2;
var _renderCallback = renderCallback$1;
var _renderCallback2 = _interopRequireDefault$4(_renderCallback);
function _interopRequireDefault$4(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
function _objectWithoutProperties$2(obj, keys) {
  var target = {};
  for (var i in obj) {
    if (keys.indexOf(i) >= 0)
      continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i))
      continue;
    target[i] = obj[i];
  }
  return target;
}
function _classCallCheck$1(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _possibleConstructorReturn$1(self2, call) {
  if (!self2) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return call && (typeof call === "object" || typeof call === "function") ? call : self2;
}
function _inherits$1(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
  if (superClass)
    Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}
var Wizard$1 = function(_Component) {
  _inherits$1(Wizard2, _Component);
  function Wizard2() {
    var _ref;
    var _temp, _this, _ret;
    _classCallCheck$1(this, Wizard2);
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    return _ret = (_temp = (_this = _possibleConstructorReturn$1(this, (_ref = Wizard2.__proto__ || Object.getPrototypeOf(Wizard2)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      step: {
        id: null
      },
      steps: []
    }, _this.history = _this.props.history || (0, _history.createMemoryHistory)(), _this.steps = [], _this.pathToStep = function(pathname) {
      var id2 = pathname.replace(_this.basename, "");
      var _this$state$steps$fil = _this.state.steps.filter(function(s) {
        return _this.props.exactMatch ? s.id === id2 : id2.startsWith(s.id);
      }), _this$state$steps$fil2 = _slicedToArray$1(_this$state$steps$fil, 1), step = _this$state$steps$fil2[0];
      return step || _this.state.step;
    }, _this.init = function(steps) {
      _this.setState({ steps }, function() {
        var step = _this.pathToStep(_this.history.location.pathname);
        if (step.id) {
          _this.setState({ step });
        } else {
          _this.history.replace("" + _this.basename + _this.ids[0]);
        }
      });
    }, _this.set = function(step) {
      return _this.history.push("" + _this.basename + step);
    }, _this.push = function() {
      var step = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : _this.nextStep;
      return _this.set(step);
    }, _this.replace = function() {
      var step = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : _this.nextStep;
      return _this.history.replace("" + _this.basename + step);
    }, _this.pushPrevious = function() {
      var step = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : _this.previousStep;
      return _this.set(step);
    }, _this.next = function() {
      if (_this.props.onNext) {
        _this.props.onNext(_this.getChildContext().wizard);
      } else {
        _this.push();
      }
    }, _this.previous = function() {
      _this.pushPrevious();
    }, _temp), _possibleConstructorReturn$1(_this, _ret);
  }
  _createClass$1(Wizard2, [{
    key: "getChildContext",
    value: function getChildContext() {
      return {
        wizard: _extends$1({
          go: this.history.go,
          set: this.set,
          history: this.history,
          init: this.init,
          next: this.next,
          previous: this.previous,
          push: this.push,
          replace: this.replace
        }, this.state)
      };
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;
      this.unlisten = this.history.listen(function(_ref2) {
        var pathname = _ref2.pathname;
        return _this2.setState({ step: _this2.pathToStep(pathname) });
      });
      if (this.props.onNext) {
        var _getChildContext$wiza = this.getChildContext().wizard;
        _getChildContext$wiza.init;
        var wizard = _objectWithoutProperties$2(_getChildContext$wiza, ["init"]);
        this.props.onNext(wizard);
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.unlisten();
    }
  }, {
    key: "render",
    value: function render() {
      var _getChildContext$wiza2 = this.getChildContext().wizard;
      _getChildContext$wiza2.init;
      var wizard = _objectWithoutProperties$2(_getChildContext$wiza2, ["init"]);
      return (0, _renderCallback2.default)(this.props, wizard);
    }
  }, {
    key: "basename",
    get: function get() {
      return this.props.basename + "/";
    }
  }, {
    key: "ids",
    get: function get() {
      return this.state.steps.map(function(s) {
        return s.id;
      });
    }
  }, {
    key: "nextStep",
    get: function get() {
      return this.ids[this.ids.indexOf(this.state.step.id) + 1];
    }
  }, {
    key: "previousStep",
    get: function get() {
      return this.ids[this.ids.indexOf(this.state.step.id) - 1];
    }
  }]);
  return Wizard2;
}(_react$2.Component);
Wizard$1.propTypes = {
  basename: _propTypes2$3.default.string,
  history: _propTypes2$3.default.shape({
    entries: _propTypes2$3.default.array,
    go: _propTypes2$3.default.func,
    goBack: _propTypes2$3.default.func,
    listen: _propTypes2$3.default.func,
    location: _propTypes2$3.default.object,
    push: _propTypes2$3.default.func,
    replace: _propTypes2$3.default.func
  }),
  onNext: _propTypes2$3.default.func,
  exactMatch: _propTypes2$3.default.bool
};
Wizard$1.defaultProps = {
  basename: "",
  history: null,
  onNext: null,
  render: null,
  exactMatch: true
};
Wizard$1.childContextTypes = {
  wizard: _propTypes2$3.default.object
};
Wizard$2.default = Wizard$1;
var Steps$2 = {};
Object.defineProperty(Steps$2, "__esModule", {
  value: true
});
var _slicedToArray = function() {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e2 = void 0;
    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);
        if (i && _arr.length === i)
          break;
      }
    } catch (err) {
      _d = true;
      _e2 = err;
    } finally {
      try {
        if (!_n && _i["return"])
          _i["return"]();
      } finally {
        if (_d)
          throw _e2;
      }
    }
    return _arr;
  }
  return function(arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();
var _createClass = function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor)
        descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps)
      defineProperties(Constructor.prototype, protoProps);
    if (staticProps)
      defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();
var _react$1 = reactExports;
var _react2$1 = _interopRequireDefault$3(_react$1);
var _propTypes$2 = propTypesExports;
var _propTypes2$2 = _interopRequireDefault$3(_propTypes$2);
function _interopRequireDefault$3(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
function _objectWithoutProperties$1(obj, keys) {
  var target = {};
  for (var i in obj) {
    if (keys.indexOf(i) >= 0)
      continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i))
      continue;
    target[i] = obj[i];
  }
  return target;
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _possibleConstructorReturn(self2, call) {
  if (!self2) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return call && (typeof call === "object" || typeof call === "function") ? call : self2;
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
  if (superClass)
    Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}
var Steps$1 = function(_Component) {
  _inherits(Steps2, _Component);
  function Steps2() {
    _classCallCheck(this, Steps2);
    return _possibleConstructorReturn(this, (Steps2.__proto__ || Object.getPrototypeOf(Steps2)).apply(this, arguments));
  }
  _createClass(Steps2, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var steps = _react2$1.default.Children.map(this.props.children, function(_ref) {
        var _ref$props = _ref.props;
        _ref$props.children;
        _ref$props.render;
        var config = _objectWithoutProperties$1(_ref$props, ["children", "render"]);
        return config;
      });
      this.context.wizard.init(steps);
    }
  }, {
    key: "render",
    value: function render() {
      var _ref2 = this.props.step || this.context.wizard.step, activeId = _ref2.id;
      var _React$Children$toArr = _react2$1.default.Children.toArray(this.props.children).filter(function(_ref3) {
        var id2 = _ref3.props.id;
        return id2 === activeId;
      }), _React$Children$toArr2 = _slicedToArray(_React$Children$toArr, 1), _React$Children$toArr3 = _React$Children$toArr2[0], child = _React$Children$toArr3 === void 0 ? null : _React$Children$toArr3;
      return child;
    }
  }]);
  return Steps2;
}(_react$1.Component);
Steps$1.propTypes = {
  children: _propTypes2$2.default.node.isRequired,
  step: _propTypes2$2.default.shape({
    id: _propTypes2$2.default.string.isRequired
  })
};
Steps$1.defaultProps = {
  step: null
};
Steps$1.contextTypes = {
  wizard: _propTypes2$2.default.object
};
Steps$2.default = Steps$1;
var withWizard$1 = {};
var REACT_STATICS = {
  childContextTypes: true,
  contextTypes: true,
  defaultProps: true,
  displayName: true,
  getDefaultProps: true,
  getDerivedStateFromProps: true,
  mixins: true,
  propTypes: true,
  type: true
};
var KNOWN_STATICS = {
  name: true,
  length: true,
  prototype: true,
  caller: true,
  callee: true,
  arguments: true,
  arity: true
};
var defineProperty = Object.defineProperty;
var getOwnPropertyNames = Object.getOwnPropertyNames;
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var getPrototypeOf = Object.getPrototypeOf;
var objectPrototype = getPrototypeOf && getPrototypeOf(Object);
function hoistNonReactStatics(targetComponent, sourceComponent, blacklist) {
  if (typeof sourceComponent !== "string") {
    if (objectPrototype) {
      var inheritedComponent = getPrototypeOf(sourceComponent);
      if (inheritedComponent && inheritedComponent !== objectPrototype) {
        hoistNonReactStatics(targetComponent, inheritedComponent, blacklist);
      }
    }
    var keys = getOwnPropertyNames(sourceComponent);
    if (getOwnPropertySymbols) {
      keys = keys.concat(getOwnPropertySymbols(sourceComponent));
    }
    for (var i = 0; i < keys.length; ++i) {
      var key = keys[i];
      if (!REACT_STATICS[key] && !KNOWN_STATICS[key] && (!blacklist || !blacklist[key])) {
        var descriptor = getOwnPropertyDescriptor(sourceComponent, key);
        try {
          defineProperty(targetComponent, key, descriptor);
        } catch (e) {
        }
      }
    }
    return targetComponent;
  }
  return targetComponent;
}
var hoistNonReactStatics_cjs = hoistNonReactStatics;
Object.defineProperty(withWizard$1, "__esModule", {
  value: true
});
var _extends = Object.assign || function(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }
  return target;
};
var _react = reactExports;
var _react2 = _interopRequireDefault$2(_react);
var _propTypes$1 = propTypesExports;
var _propTypes2$1 = _interopRequireDefault$2(_propTypes$1);
var _hoistNonReactStatics = hoistNonReactStatics_cjs;
var _hoistNonReactStatics2 = _interopRequireDefault$2(_hoistNonReactStatics);
function _interopRequireDefault$2(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
function _objectWithoutProperties(obj, keys) {
  var target = {};
  for (var i in obj) {
    if (keys.indexOf(i) >= 0)
      continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i))
      continue;
    target[i] = obj[i];
  }
  return target;
}
var withWizard = function withWizard2(Component) {
  var WithWizard2 = function WithWizard3(props, _ref) {
    var _ref$wizard = _ref.wizard;
    _ref$wizard.init;
    var wizard = _objectWithoutProperties(_ref$wizard, ["init"]);
    return _react2.default.createElement(Component, _extends({
      wizard
    }, props));
  };
  WithWizard2.contextTypes = {
    wizard: _propTypes2$1.default.object
  };
  WithWizard2.displayName = "withWizard(" + (Component.displayName || Component.name) + ")";
  WithWizard2.WrappedComponent = Component;
  return (0, _hoistNonReactStatics2.default)(WithWizard2, Component);
};
withWizard$1.default = withWizard;
var wizardShape = {};
Object.defineProperty(wizardShape, "__esModule", {
  value: true
});
var _propTypes = propTypesExports;
var _propTypes2 = _interopRequireDefault$1(_propTypes);
function _interopRequireDefault$1(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
wizardShape.default = _propTypes2.default.shape({
  go: _propTypes2.default.func.isRequired,
  set: _propTypes2.default.func.isRequired,
  history: _propTypes2.default.object.isRequired,
  next: _propTypes2.default.func.isRequired,
  previous: _propTypes2.default.func.isRequired,
  push: _propTypes2.default.func.isRequired,
  replace: _propTypes2.default.func.isRequired,
  step: _propTypes2.default.shape({
    id: _propTypes2.default.string.isRequired
  }).isRequired,
  steps: _propTypes2.default.arrayOf(_propTypes2.default.shape({
    id: _propTypes2.default.string.isRequired
  }).isRequired).isRequired
});
Object.defineProperty(lib, "__esModule", {
  value: true
});
lib.wizardShape = lib.withWizard = Steps = lib.Steps = Wizard = lib.Wizard = lib.WithWizard = Step_1 = lib.Step = void 0;
var _createWizardComponent = createWizardComponent$1;
var _createWizardComponent2 = _interopRequireDefault(_createWizardComponent);
var _Wizard2 = Wizard$2;
var _Wizard3 = _interopRequireDefault(_Wizard2);
var _Steps2 = Steps$2;
var _Steps3 = _interopRequireDefault(_Steps2);
var _withWizard2 = withWizard$1;
var _withWizard3 = _interopRequireDefault(_withWizard2);
var _wizardShape2 = wizardShape;
var _wizardShape3 = _interopRequireDefault(_wizardShape2);
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
var Step = (0, _createWizardComponent2.default)("Step");
var WithWizard = (0, _createWizardComponent2.default)("WithWizard");
var Step_1 = lib.Step = Step;
lib.WithWizard = WithWizard;
var Wizard = lib.Wizard = _Wizard3.default;
var Steps = lib.Steps = _Steps3.default;
lib.withWizard = _withWizard3.default;
lib.wizardShape = _wizardShape3.default;
const Logo$2 = st.div`
  background: url(${logo$1});
  background-size: cover;
  display: block;
  margin: 0 auto;
  text-align: center;
  width: 100px;
  height: 100px;
  border: 0;
  margin-bottom: 40px;
`;
const Header$5 = st.h1`
  text-align: center;
  color: #858585;
  font-size: 14px;
`;
const Text$4 = st.div`
  color: #858585;
  font-size: 13px;
  margin-bottom: 200px;
  text-align: left;
  max-width: 450px;
  line-height: 150%;

  img {
    width: 100%;
  }
`;
const List$1 = st.ol`
  padding-left: 25px;
  margin-top: 15px;
  margin-bottom: 10px;
`;
const Setup = () => {
  let platform = window.electron.process.platform;
  const skip = (wizard) => {
    switch (wizard.step.id) {
      case "device": {
        if (platform === "darwin") {
          wizard.push("pair");
        } else if (platform === "linux") {
          wizard.push("libimobiledevice");
        } else {
          wizard.push();
        }
        break;
      }
      case "itunes": {
        if (platform !== "linux") {
          wizard.push("pair");
        }
        break;
      }
      default:
        wizard.push();
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Wizard,
    {
      onNext: skip,
      render: ({ step, steps }) => /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Steps, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Step_1,
          {
            id: "welcome",
            render: ({ next: next2 }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Text$4, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Logo$2, {}),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Header$5, { children: "Welcome to Inspect" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "To get going you might need to setup a few things on your local machine and iOS device." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { callback: next2, children: "Get started" })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Step_1,
          {
            id: "device",
            render: ({ next: next2 }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Text$4, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Header$5, { children: "Enable Web Inspector on iOS" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "First, you need to enable Web Inspector on your iOS to allow tools like Inspect to connect to it." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(List$1, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Grab your iOS device." }),
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                  "Open the ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Settings" }),
                  " app"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                  "Go to ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Safari" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                  "Scroll down to ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Advanced" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                  "Enable the ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Web Inspector" }),
                  " toggle"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: webInspector, alt: "Webinspector", height: "352" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { callback: next2, children: "Next" })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Step_1,
          {
            id: "itunes",
            render: ({ next: next2 }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Text$4, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Header$5, { children: "Install and start iTunes" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Since you are on Windows you need to install and start iTunes in order to enable iOS devices to be connected to your machine." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(List$1, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                  "Download for Windows by visiting ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { href: "https://support.apple.com/en-ca/HT210384", children: "Apple" }),
                  "."
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Install iTunes." }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                  "Start iTunes ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "before" }),
                  " continuing."
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: imgWindowsiTunes, alt: "iTunes on Windows", height: "266" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", {}),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { callback: next2, children: "Next" })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Step_1,
          {
            id: "libimobiledevice",
            render: ({ next: next2 }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Text$4, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Header$5, { children: "Install and start libimobiledevice" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Since you are on Linux you need to install and start libimobiledevice in order to enable iOS devices to be connected to your machine." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(List$1, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                "Follow the instructions on ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { href: "https://libimobiledevice.org", children: "https://libimobiledevice.org" }),
                " for your given distro."
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", {}),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { callback: next2, children: "Next" })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Step_1,
          {
            id: "pair",
            render: ({ next: next2 }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Text$4, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Header$5, { children: "Connect your iOS device via cable" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Now it's time for you to connect your iOS device to your computer." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(List$1, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Grab your iOS device." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Connect your physical cable to your device and computer." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Now pair your iOS device by either opening iTunes, libimobiledevice, or Finder." }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                  "You might need to ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "trust this computer" }),
                  ". Read more ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { href: "https://support.apple.com/en-ca/HT202778", children: "here" }),
                  "."
                ] })
              ] }),
              platform === "darwin" && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: imgFinder, alt: "Finder", height: "330" }),
              platform === "win32" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: imgWindowsITunesPhone, alt: "iTunes", height: "266" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", {})
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { callback: next2, children: "Next" })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Step_1,
          {
            id: "targets",
            render: ({ next: next2 }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Text$4, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Header$5, { children: "Inspecting with Inspect" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                "You did it",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { role: "img", "aria-label": "Confetti", children: "🎉" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: imgHighFive, alt: "High five cat", height: "330" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                "Want to learn more?",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { command: "inspect:openDocumentation", href: "#", children: "Read our docs" }),
                " ",
                "for the juicy details."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Happy Inspecting!" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { command: "inspect:finishSetup", href: "#", neutral: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { children: "Done" }) })
            ] })
          }
        )
      ] }) }) })
    }
  );
};
const Box$5 = st.div`
  width: 100%;
  height: 100%;
  background: #1e1e1e;
  color: #ccc;
  padding: 100px 0;
  font-size: 20px;
  display: flex;
  justify-content: center; // horizontally
  align-items: center; // vertically
`;
const Logo$1 = st.div`
  background: url(${logo$1});
  background-size: cover;
  display: block;
  margin: 0 auto;
  text-align: center;
  width: 100px;
  height: 100px;
  border: 0;
  margin-bottom: 40px;
`;
const Text$3 = st.div`
  color: #858585;
  font-size: 16px;
  margin-bottom: 200px;
  text-align: left;
  max-width: 450px;

  img {
    width: 100%;
  }
`;
const Header$4 = st.h1`
  text-align: center;
  color: #858585;
  font-size: 16px;
`;
const SetupLink = st.div`
  color: #858585;
  font-size: 12px;
  text-align: center;
`;
const Welcome = () => {
  const context = React.useContext(AppContext);
  let hasFinishedSetup = context.hasFinishedSetup();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Box$5, { children: hasFinishedSetup ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Text$3, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Logo$1, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header$4, { children: "Welcome to Inspect" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SetupLink, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { href: "#", command: "inspect:resetSetup", children: "Run setup again" }) })
  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Setup, {}) });
};
const iconDevice = "" + new URL("device-a3d99a35.svg", import.meta.url).href;
const iconApple = "" + new URL("apple-4d2e3855.svg", import.meta.url).href;
const iconAndroid = "" + new URL("android-30b6d00f.svg", import.meta.url).href;
const Box$4 = st.div`
  width: 100%;
  height: 100%;
  background: #1e1e1e;
  color: #ccc;
  padding: 100px 0;
  font-size: 20px;
  display: flex;
  justify-content: center; // horizontally
  align-items: center; // vertically
`;
const Text$2 = st.div`
  color: #858585;
  font-size: 13px;
  margin-bottom: 200px;
  text-align: left;
  max-width: 450px;
  line-height: 150%;

  img {
    width: 100%;
  }
`;
const Header$3 = st.h1`
  text-align: center;
  color: #858585;
  font-size: 16px;
  margin-bottom: 20px;
`;
const SubHeader = st.h2`
  text-align: left;
  color: #858585;
  font-size: 14px;
`;
const DeviceIcon = st.div`
  background: url(${iconDevice});
  background-size: cover;
  display: block;
  margin: 0 auto;
  text-align: center;
  width: 100px;
  height: 100px;
  border: 0;
  margin-bottom: 40px;
`;
const AppleIcon = st.div`
  background: url(${iconApple});
  background-size: cover;
  display: block;
  margin: 0 auto;
  text-align: center;
  width: 100px;
  height: 100px;
  border: 0;
  margin-bottom: 40px;
`;
const AndroidIcon = st.div`
  background: url(${iconAndroid});
  background-size: cover;
  display: block;
  margin: 0 auto;
  text-align: center;
  width: 100px;
  height: 100px;
  border: 0;
  margin-bottom: 40px;
`;
st.div`
  color: #858585;
  font-size: 12px;
  text-align: center;
`;
const List = st.ol`
  padding-left: 2px;
  margin-top: 15px;
  margin-bottom: 15px;
  list-style: none;
  line-height: 26px;
`;
const PlatformSelector = st.div`
  display: grid;
  grid-template-columns: 50% 50%;
  grid-gap: 20px;
`;
const IntroText = st.p`
  padding-bottom: 40px;
`;
const Doctor = () => {
  React.useContext(AppContext);
  const [activeView, setActiveView] = reactExports.useState("chooseDeviceType");
  const onAndroidClicked = () => {
    setActiveView("android");
  };
  const oniOSClicked = () => {
    console.log("oniOSClicked");
    setActiveView("ios");
    console.log("activeView", activeView);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Box$4, { children: [
    activeView == "chooseDeviceType" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Text$2, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Header$3, { children: "Device and target diagnostics" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(IntroText, { children: "Having trouble getting doing? Lets try to figure out what’s wrong with Inspect by running device and target diagnostics." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DeviceIcon, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "What kind of device are you trying to debug?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(PlatformSelector, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: onAndroidClicked, children: "Android" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: oniOSClicked, children: "iOS" })
      ] })
    ] }),
    activeView == "ios" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Text$2, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Header$3, { children: "Device and target diagnostics" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(IntroText, { children: "Running diagnostics to help you debug what could be wrong with your Inspect setup..." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AppleIcon, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SubHeader, { children: "Diagnostics results:" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(List, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "✅  Able to connect to iOS driver for device communication" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "✅  Able to connect to WebKit service" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "✅  One or more iOS devices found." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "✅  Device is paired with computer." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "✅  Device is unlocked." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "❌  Debuggable processes found" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "❌  Debuggable targets found" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SubHeader, { children: "Recommendation" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "No issues identified. If you still have problems, please to contact our support, so we can help you debugging" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { children: "Contact Support" })
    ] }),
    activeView == "android" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Text$2, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Header$3, { children: "Device and target diagnostics" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(IntroText, { children: "Running diagnostics to help you debug what could be wrong with your Inspect setup..." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AndroidIcon, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SubHeader, { children: "Diagnostics results:" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(List, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "✅  Able to connect to iOS driver for device communication" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "✅  Able to connect to WebKit service" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "✅  One or more iOS devices found." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "❌  Debuggable processes found" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "❌  Debuggable targets found" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SubHeader, { children: "Recommendation" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "No issues identified. If you still have problems, please to contact our support, so we can help you debugging" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { children: "Contact Support" })
    ] })
  ] });
};
const logo = "" + new URL("logo-1353e342.svg", import.meta.url).href;
const Wrapper = st.div`
  width: 100%;
  height: 100%;
  background: #1e1e1e;
  color: #ccc;
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Box$3 = st.div`
  padding-bottom: 30px;
`;
const Logo = st.div`
  background: url(${logo});
  background-size: cover;
  display: block;
  margin: 0 auto;
  text-align: center;
  width: 100px;
  height: 100px;
  border: 0;
  margin-bottom: 40px;
`;
const Text$1 = st.p`
  color: #858585;
  text-align: center;
  padding-bottom: 10px;
  font-size: 13px;
`;
const Header$2 = st.h1`
  text-align: center;
  color: #858585;
  font-size: 16px;
`;
const Login = () => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Wrapper, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Box$3, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Logo, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header$2, { children: "Welcome to Inspect" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Text$1, { children: "To get started with Inspect, please login with your account." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { command: "inspect:openLogin", children: "Continue on inspect.dev" }) })
  ] }) });
};
const iconUpdate = "" + new URL("update-602cdff6.svg", import.meta.url).href;
const Notification = st.div`
  width: 300px;
  display: flex;
  align-items: start;

  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 100;

  padding: 10px;

  background: #252526;
  border: 1px solid #333;
  color: #cccccc;
  font-size: 12px;
  text-align: left;
`;
const Image = st.img`
  margin-right: 10px;
  margin-top: 8px;
`;
const Content = st.div`
  width: 275px;
`;
const Header$1 = st.h1`
  font-size: 12px;
  font-weight: bold;
`;
const UpdateNotification = () => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Notification, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { src: iconUpdate }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Content, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Header$1, { children: "New version available" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "A new version of Inspect is available. Please restart to update." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { href: "#", command: "inspect:update-install-and-quit", children: "Update now" })
    ] })
  ] });
};
const Box$2 = st.div`
  background: #252526;
  height: calc(100%);
  color: #1e1e1e;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  text-align: center;
`;
const Host = st.iframe`
  width: 100%;
  height: 100%;
  border: 0;
`;
const DevTools = () => {
  const context = React.useContext(AppContext);
  let devtoolsContainer = React.createRef();
  let onMessageFromClient = (e) => {
    let msg = e.data;
    if (msg.type === "sendMessageToBackend") {
      context.sendMessageToTarget(msg.message);
    } else if (msg.type === "showContextMenuAtPoint") {
      context.showContextMenuAtPoint(msg.message);
    } else if (msg.type === "openUrl") {
      context.execCommand("inspect:openUrl", msg.message.url);
    }
  };
  let onMessageFromTarget = (msg) => {
    sendToDevTools({
      type: "dispatchMessage",
      message: msg
    });
  };
  let onContextMenuItemClicked = (menuItemId) => {
    sendToDevTools({
      type: "contextMenuItemSelected",
      message: menuItemId
    });
  };
  let onContextMenuItemClosed = () => {
    sendToDevTools({
      type: "contextMenuCleared",
      message: {}
    });
  };
  let sendToDevTools = (msg) => {
    if (devtoolsContainer.current) {
      if (devtoolsContainer.current.contentWindow) {
        devtoolsContainer.current.contentWindow.postMessage(msg, "*");
      }
    }
  };
  reactExports.useEffect(() => {
    window.addEventListener("message", onMessageFromClient);
    context.on("messageFromTarget", onMessageFromTarget);
    context.on("contextMenuItemClicked", onContextMenuItemClicked);
    context.on("contextMenuItemClosed", onContextMenuItemClosed);
    return () => {
      window.removeEventListener("message", onMessageFromClient);
      context.off("contextMenuItemClicked", onContextMenuItemClicked);
      context.off("contextMenuItemClosed", onContextMenuItemClosed);
      context.off("messageFromTarget", onMessageFromTarget);
    };
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Box$2, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Host, { src: `./inspector/devtools_app.html`, ref: devtoolsContainer }) });
};
const unlock = "" + new URL("warning-ede96af4.svg", import.meta.url).href;
const Box$1 = st.div`
  height: calc(100%);
  width: 100%;
  background: #1e1e1e;
  color: #ccc;
  font-size: 20px;
  display: flex;
  justify-content: center; // horizontally
  align-items: center; // vertically
`;
const UnlockIcon = st.div`
  background: url(${unlock});
  background-size: cover;
  display: block;
  margin: 0 auto;
  text-align: center;
  width: 100px;
  height: 100px;
  border: 0;
  margin-bottom: 40px;
`;
const Header = st.h1`
  text-align: center;
  color: #858585;
  font-size: 16px;
  margin-bottom: 40px;
`;
const Text = st.div`
  color: #858585;
  font-size: 13px;
  text-align: left;
  max-width: 450px;

  img {
    width: 100%;
  }
`;
const Actions = st.div`
  color: #858585;
  text-align: center;
  padding-top: 10px;
`;
const Paragraph = st.p`
  padding-bottom: 10px;
`;
const Upgrade = () => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Box$1, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Text, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(UnlockIcon, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, { children: "Debugging exceeded for today" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Paragraph, { children: "You are currently using the free version of Inspect, which gives you 15 minutes of debugging daily and resets at midnight." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Paragraph, { children: "Need to fix that issue right now?" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Paragraph, { children: "Unlock unlimited debugging by upgrading to Inspect Pro." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Actions, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { command: "inspect:buyLicense", children: "Upgrade to Inspect Pro" }) }) })
  ] }) });
};
const Box = st.div`
  height: calc(100%);
  width: 100%;
`;
const ActiveTarget = () => {
  const context = React.useContext(AppContext);
  let isDebuggingEnabled = context.isDebuggingEnabled();
  let appContent = /* @__PURE__ */ jsxRuntimeExports.jsx(DevTools, {});
  if (isDebuggingEnabled) {
    appContent = /* @__PURE__ */ jsxRuntimeExports.jsx(DevTools, {});
  } else {
    appContent = /* @__PURE__ */ jsxRuntimeExports.jsx(Upgrade, {});
  }
  let content = /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { children: appContent });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: content });
};
const AppContent = st.div`
  flex: 1;
`;
const AppBox = st.div`
  opacity: ${(p2) => p2.$isloading === "true" ? "0" : "1"};
  transition: opacity 120ms;
  text-align: center;
  height: 100%;
  display: flex;
`;
const Inspect = () => {
  const context = reactExports.useContext(AppContext);
  let content;
  if (!context.hasAuthToken()) {
    content = /* @__PURE__ */ jsxRuntimeExports.jsx(Login, {});
  } else {
    let appContent;
    if (context.state?.activeTargetId) {
      appContent = /* @__PURE__ */ jsxRuntimeExports.jsx(ActiveTarget, {});
    } else if (context.shouldShowDoctor()) {
      appContent = /* @__PURE__ */ jsxRuntimeExports.jsx(Doctor, {});
    } else {
      appContent = /* @__PURE__ */ jsxRuntimeExports.jsx(Welcome, {});
    }
    content = /* @__PURE__ */ jsxRuntimeExports.jsxs(AppBox, { $isloading: context.state?.isLoading.toString(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Nav, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AppContent, { children: appContent }),
      context.state?.updateAvailable ? /* @__PURE__ */ jsxRuntimeExports.jsx(UpdateNotification, {}) : ""
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    content,
    /* @__PURE__ */ jsxRuntimeExports.jsx(Loader, {})
  ] });
};
class App extends reactExports.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AppProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Inspect, {}) });
  }
}
const container = document.getElementById("app");
const root = createRoot(container);
root.render(/* @__PURE__ */ jsxRuntimeExports.jsx(App, {}));
