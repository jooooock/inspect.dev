"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SubProcess = exports.spawn = exports.exec = void 0;

require("source-map-support/register");

var cp = _interopRequireWildcard(require("child_process"));

var spIndex = _interopRequireWildcard(require("./lib/subprocess"));

var execIndex = _interopRequireWildcard(require("./lib/exec"));

const {
  spawn
} = cp;
exports.spawn = spawn;
const {
  SubProcess
} = spIndex;
exports.SubProcess = SubProcess;
const {
  exec
} = execIndex;
exports.exec = exec;require('source-map-support').install();


//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbInNwYXduIiwiY3AiLCJTdWJQcm9jZXNzIiwic3BJbmRleCIsImV4ZWMiLCJleGVjSW5kZXgiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBR0EsTUFBTTtBQUFFQSxFQUFBQTtBQUFGLElBQVlDLEVBQWxCOztBQUNBLE1BQU07QUFBRUMsRUFBQUE7QUFBRixJQUFpQkMsT0FBdkI7O0FBQ0EsTUFBTTtBQUFFQyxFQUFBQTtBQUFGLElBQVdDLFNBQWpCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gdHJhbnNwaWxlOm1haW5cbmltcG9ydCAqIGFzIGNwIGZyb20gJ2NoaWxkX3Byb2Nlc3MnO1xuaW1wb3J0ICogYXMgc3BJbmRleCBmcm9tICcuL2xpYi9zdWJwcm9jZXNzJztcbmltcG9ydCAqIGFzIGV4ZWNJbmRleCBmcm9tICcuL2xpYi9leGVjJztcblxuXG5jb25zdCB7IHNwYXduIH0gPSBjcDtcbmNvbnN0IHsgU3ViUHJvY2VzcyB9ID0gc3BJbmRleDtcbmNvbnN0IHsgZXhlYyB9ID0gZXhlY0luZGV4O1xuXG5leHBvcnQgeyBleGVjLCBzcGF3biwgU3ViUHJvY2VzcyB9O1xuIl0sImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZVJvb3QiOiIuLiJ9
