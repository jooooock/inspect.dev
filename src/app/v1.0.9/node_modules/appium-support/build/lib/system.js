"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.arch = arch;
exports.isLinux = isLinux;
exports.isMac = isMac;
exports.isOSWin64 = isOSWin64;
exports.isWindows = isWindows;
exports.macOsxVersion = macOsxVersion;

require("source-map-support/register");

var _teen_process = require("teen_process");

var _lodash = _interopRequireDefault(require("lodash"));

var _os = _interopRequireDefault(require("os"));

const VERSION_PATTERN = /^(\d+\.\d+)/m;

function isWindows() {
  return _os.default.type() === 'Windows_NT';
}

function isMac() {
  return _os.default.type() === 'Darwin';
}

function isLinux() {
  return !isWindows() && !isMac();
}

function isOSWin64() {
  return process.arch === 'x64' || _lodash.default.has(process.env, 'PROCESSOR_ARCHITEW6432');
}

async function arch() {
  if (isLinux() || isMac()) {
    let {
      stdout
    } = await (0, _teen_process.exec)('uname', ['-m']);
    return stdout.trim() === 'i686' ? '32' : '64';
  } else if (isWindows()) {
    let is64 = this.isOSWin64();
    return is64 ? '64' : '32';
  }
}

async function macOsxVersion() {
  let stdout;

  try {
    stdout = (await (0, _teen_process.exec)('sw_vers', ['-productVersion'])).stdout.trim();
  } catch (err) {
    throw new Error(`Could not detect Mac OS X Version: ${err}`);
  }

  const versionMatch = VERSION_PATTERN.exec(stdout);

  if (!versionMatch) {
    throw new Error(`Could not detect Mac OS X Version from sw_vers output: '${stdout}'`);
  }

  return versionMatch[1];
}require('source-map-support').install();


//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9zeXN0ZW0uanMiXSwibmFtZXMiOlsiVkVSU0lPTl9QQVRURVJOIiwiaXNXaW5kb3dzIiwib3MiLCJ0eXBlIiwiaXNNYWMiLCJpc0xpbnV4IiwiaXNPU1dpbjY0IiwicHJvY2VzcyIsImFyY2giLCJfIiwiaGFzIiwiZW52Iiwic3Rkb3V0IiwidHJpbSIsImlzNjQiLCJtYWNPc3hWZXJzaW9uIiwiZXJyIiwiRXJyb3IiLCJ2ZXJzaW9uTWF0Y2giLCJleGVjIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBRUEsTUFBTUEsZUFBZSxHQUFHLGNBQXhCOztBQUVBLFNBQVNDLFNBQVQsR0FBc0I7QUFDcEIsU0FBT0MsWUFBR0MsSUFBSCxPQUFjLFlBQXJCO0FBQ0Q7O0FBRUQsU0FBU0MsS0FBVCxHQUFrQjtBQUNoQixTQUFPRixZQUFHQyxJQUFILE9BQWMsUUFBckI7QUFDRDs7QUFFRCxTQUFTRSxPQUFULEdBQW9CO0FBQ2xCLFNBQU8sQ0FBQ0osU0FBUyxFQUFWLElBQWdCLENBQUNHLEtBQUssRUFBN0I7QUFDRDs7QUFFRCxTQUFTRSxTQUFULEdBQXNCO0FBQ3BCLFNBQU9DLE9BQU8sQ0FBQ0MsSUFBUixLQUFpQixLQUFqQixJQUEwQkMsZ0JBQUVDLEdBQUYsQ0FBTUgsT0FBTyxDQUFDSSxHQUFkLEVBQW1CLHdCQUFuQixDQUFqQztBQUNEOztBQUVELGVBQWVILElBQWYsR0FBdUI7QUFDckIsTUFBSUgsT0FBTyxNQUFNRCxLQUFLLEVBQXRCLEVBQTBCO0FBQ3hCLFFBQUk7QUFBQ1EsTUFBQUE7QUFBRCxRQUFXLE1BQU0sd0JBQUssT0FBTCxFQUFjLENBQUMsSUFBRCxDQUFkLENBQXJCO0FBQ0EsV0FBT0EsTUFBTSxDQUFDQyxJQUFQLE9BQWtCLE1BQWxCLEdBQTJCLElBQTNCLEdBQWtDLElBQXpDO0FBQ0QsR0FIRCxNQUdPLElBQUlaLFNBQVMsRUFBYixFQUFpQjtBQUN0QixRQUFJYSxJQUFJLEdBQUcsS0FBS1IsU0FBTCxFQUFYO0FBQ0EsV0FBT1EsSUFBSSxHQUFHLElBQUgsR0FBVSxJQUFyQjtBQUNEO0FBQ0Y7O0FBRUQsZUFBZUMsYUFBZixHQUFnQztBQUM5QixNQUFJSCxNQUFKOztBQUNBLE1BQUk7QUFDRkEsSUFBQUEsTUFBTSxHQUFHLENBQUMsTUFBTSx3QkFBSyxTQUFMLEVBQWdCLENBQUMsaUJBQUQsQ0FBaEIsQ0FBUCxFQUE2Q0EsTUFBN0MsQ0FBb0RDLElBQXBELEVBQVQ7QUFDRCxHQUZELENBRUUsT0FBT0csR0FBUCxFQUFZO0FBQ1osVUFBTSxJQUFJQyxLQUFKLENBQVcsc0NBQXFDRCxHQUFJLEVBQXBELENBQU47QUFDRDs7QUFFRCxRQUFNRSxZQUFZLEdBQUdsQixlQUFlLENBQUNtQixJQUFoQixDQUFxQlAsTUFBckIsQ0FBckI7O0FBQ0EsTUFBSSxDQUFDTSxZQUFMLEVBQW1CO0FBQ2pCLFVBQU0sSUFBSUQsS0FBSixDQUFXLDJEQUEwREwsTUFBTyxHQUE1RSxDQUFOO0FBQ0Q7O0FBQ0QsU0FBT00sWUFBWSxDQUFDLENBQUQsQ0FBbkI7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGV4ZWMgfSBmcm9tICd0ZWVuX3Byb2Nlc3MnO1xuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBvcyBmcm9tICdvcyc7XG5cbmNvbnN0IFZFUlNJT05fUEFUVEVSTiA9IC9eKFxcZCtcXC5cXGQrKS9tO1xuXG5mdW5jdGlvbiBpc1dpbmRvd3MgKCkge1xuICByZXR1cm4gb3MudHlwZSgpID09PSAnV2luZG93c19OVCc7XG59XG5cbmZ1bmN0aW9uIGlzTWFjICgpIHtcbiAgcmV0dXJuIG9zLnR5cGUoKSA9PT0gJ0Rhcndpbic7XG59XG5cbmZ1bmN0aW9uIGlzTGludXggKCkge1xuICByZXR1cm4gIWlzV2luZG93cygpICYmICFpc01hYygpO1xufVxuXG5mdW5jdGlvbiBpc09TV2luNjQgKCkge1xuICByZXR1cm4gcHJvY2Vzcy5hcmNoID09PSAneDY0JyB8fCBfLmhhcyhwcm9jZXNzLmVudiwgJ1BST0NFU1NPUl9BUkNISVRFVzY0MzInKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gYXJjaCAoKSB7XG4gIGlmIChpc0xpbnV4KCkgfHwgaXNNYWMoKSkge1xuICAgIGxldCB7c3Rkb3V0fSA9IGF3YWl0IGV4ZWMoJ3VuYW1lJywgWyctbSddKTtcbiAgICByZXR1cm4gc3Rkb3V0LnRyaW0oKSA9PT0gJ2k2ODYnID8gJzMyJyA6ICc2NCc7XG4gIH0gZWxzZSBpZiAoaXNXaW5kb3dzKCkpIHtcbiAgICBsZXQgaXM2NCA9IHRoaXMuaXNPU1dpbjY0KCk7XG4gICAgcmV0dXJuIGlzNjQgPyAnNjQnIDogJzMyJztcbiAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBtYWNPc3hWZXJzaW9uICgpIHtcbiAgbGV0IHN0ZG91dDtcbiAgdHJ5IHtcbiAgICBzdGRvdXQgPSAoYXdhaXQgZXhlYygnc3dfdmVycycsIFsnLXByb2R1Y3RWZXJzaW9uJ10pKS5zdGRvdXQudHJpbSgpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBkZXRlY3QgTWFjIE9TIFggVmVyc2lvbjogJHtlcnJ9YCk7XG4gIH1cblxuICBjb25zdCB2ZXJzaW9uTWF0Y2ggPSBWRVJTSU9OX1BBVFRFUk4uZXhlYyhzdGRvdXQpO1xuICBpZiAoIXZlcnNpb25NYXRjaCkge1xuICAgIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IGRldGVjdCBNYWMgT1MgWCBWZXJzaW9uIGZyb20gc3dfdmVycyBvdXRwdXQ6ICcke3N0ZG91dH0nYCk7XG4gIH1cbiAgcmV0dXJuIHZlcnNpb25NYXRjaFsxXTtcbn1cblxuZXhwb3J0IHsgaXNXaW5kb3dzLCBpc01hYywgaXNMaW51eCwgaXNPU1dpbjY0LCBhcmNoLCBtYWNPc3hWZXJzaW9uIH07XG4iXSwiZmlsZSI6ImxpYi9zeXN0ZW0uanMiLCJzb3VyY2VSb290IjoiLi4vLi4ifQ==
