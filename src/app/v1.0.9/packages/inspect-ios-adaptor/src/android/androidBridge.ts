import portfinder from 'portfinder';
import { request } from 'http';
import { ADB, ForwardedSocket } from './adb';
import { LoggerBase } from '../lib/logger';

export type WebViewType = 'chrome' | 'webview' | 'crosswalk' | 'unknown';

interface Process {
  pid: number;
  name: string;
}

interface Package {
  packageName: string;
  versionName: string;
}

export interface WebView {
  deviceId: string;
  socket: string;
  type: WebViewType;
  packageName?: string;
  versionName?: string;
}

export interface WebViewPage {
  id: string;
  type: string;
  url: string;
  title: string;
  webSocketDebuggerUrl: string;
}

interface Package {
  packageName: string;
  versionName: string;
}

export class AndroidBridge {
  forwardedSockets: Map<String, ForwardedSocket[]>;
  logger: LoggerBase;
  adb: ADB;

  constructor(baseLogger: LoggerBase) {
    this.forwardedSockets = new Map();
    this.logger = baseLogger.scope('AndroidBridge');
    this.adb = new ADB(baseLogger);
  }

  public async test(): Promise<void> {
    this.logger.info('AndroidBridge.test');
    try {
      await this.adb.version();
    } catch (err) {
      this.logger.info('AndroidBridge.test.error', err);
      if ((err as NodeJS.ErrnoException | undefined)?.code === 'ENOENT') {
        throw new Error('Failed to locate ADB executable.');
      }

      throw err;
    }
  }

  async getProcesses(serial: string): Promise<Process[]> {
    this.logger.info('AndroidBridge.getProcesses');
    const output = await this.adb.shell(serial, 'ps');

    /**
     * Parse 'ps' output which on Android looks like this:
     *
     * USER       PID  PPID      VSZ     RSS  WCHAN  ADDR  S  NAME
     * root         1     0    24128    1752  0         0  S  init
     * u0_a100  22100  1307  1959228  128504  0         0  S  com.android.chrome
     */

    const result: Process[] = [];

    for (const line of output.split(/[\r\n]+/g)) {
      const columns = line.split(/\s+/g);
      if (columns.length < 9) {
        continue;
      }

      const pid = parseInt(columns[1], 10);
      if (isNaN(pid)) {
        continue;
      }

      result.push({
        pid: pid,
        name: columns[8],
      });
    }

    return result;
  }

  async getSockets(serial: string): Promise<string[]> {
    this.logger.info('AndroidBridge.getSockets');
    const output = await this.adb.shell(serial, 'cat /proc/net/unix');

    /**
     * Parse 'cat /proc/net/unix' output which on Android looks like this:
     *
     * Num               RefCount Protocol Flags    Type St Inode Path
     * 0000000000000000: 00000002 00000000 00010000 0001 01 27955 /data/fpc/oem
     * 0000000000000000: 00000002 00000000 00010000 0001 01  3072 @chrome_devtools_remote
     *
     * We need to find records with paths starting from '@' (abstract socket)
     * and containing the channel pattern ("_devtools_remote").
     */

    const result: string[] = [];

    for (const line of output.split(/[\r\n]+/g)) {
      const columns = line.split(/\s+/g);
      if (columns.length < 8) {
        continue;
      }

      if (columns[3] !== '00010000' || columns[5] !== '01') {
        continue;
      }

      const colPath = columns[7];
      if (!colPath.startsWith('@') || !colPath.includes('_devtools_remote')) {
        continue;
      }

      result.push(colPath.substr(1));
    }

    return result;
  }

  async getPackages(serial: string): Promise<Package[]> {
    this.logger.info('AndroidBridge.getPackages');
    const output = await this.adb.shell(serial, 'dumpsys package packages');

    /**
     * Parse 'dumpsys package packages' output which on Android looks like this:
     *
     * Packages:
     *   Package [com.android.chrome] (76d4737):
     *     userId=10100
     *     pkg=Package{3e86c27 com.android.chrome}
     *     codePath=/data/app/com.android.chrome-MMpc6mFfM3KpEYJ7RaZaTA==
     *     resourcePath=/data/app/com.android.chrome-MMpc6mFfM3KpEYJ7RaZaTA==
     *     legacyNativeLibraryDir=/data/app/com.android.chrome-MMpc6mFfM3KpEYJ7RaZaTA==/lib
     *     primaryCpuAbi=armeabi-v7a
     *     secondaryCpuAbi=arm64-v8a
     *     versionCode=344009152 minSdk=24 targetSdk=28
     *     versionName=68.0.3440.91
     */

    const result: Package[] = [];

    let packageName: string | undefined;

    for (const line of output.split(/[\r\n]+/g)) {
      const columns = line.trim().split(/\s+/g);

      if (!packageName) {
        if (columns[0] === 'Package') {
          packageName = columns[1].substring(1, columns[1].length - 1);
        }
      } else {
        if (columns[0].startsWith('versionName=')) {
          result.push({
            packageName: packageName,
            versionName: columns[0].substr(12),
          });

          packageName = undefined;
        }
      }
    }

    return result;
  }

  async findWebViews(deviceId: string): Promise<WebView[]> {
    this.logger.info('AndroidBridge.findWebViews');
    // Inspiration: https://source.chromium.org/chromium/chromium/src/+/main:chrome/browser/devtools/device/android_device_info_query.cc?q=_devtools_remote&ss=chromium
    const [sockets, processes, packages] = await Promise.all([this.getSockets(deviceId), this.getProcesses(deviceId), this.getPackages(deviceId)]);

    const result: WebView[] = [];

    for (const socket of sockets) {
      let type: WebViewType;
      let packageName: string | undefined;
      let versionName: string | undefined;

      if (socket === 'chrome_devtools_remote') {
        type = 'chrome';
        packageName = 'Google Chrome';
      } else if (socket.startsWith('webview_devtools_remote_')) {
        type = 'webview';

        const pid = parseInt(socket.substr(24), 10);
        if (!isNaN(pid)) {
          const process = processes.find(el => el.pid === pid);
          if (process) {
            packageName = process.name;
          }
        }
      } else if (socket.endsWith('_devtools_remote')) {
        type = 'crosswalk';
        packageName = socket.substring(0, socket.length - 16) || undefined;
      } else {
        type = 'unknown';
      }

      if (packageName) {
        const aPackage = packages.find(el => el.packageName === packageName);
        if (aPackage) {
          versionName = aPackage.versionName;
        }
      }

      result.push({
        deviceId: deviceId,
        socket: socket,
        type: type,
        packageName: packageName,
        versionName: versionName,
      });
    }

    return result;
  }

  async forwardDebugger(deviceId: string, webViewSocket: string, port?: number): Promise<number> {
    let openDeviceSockets = this.forwardedSockets.get(deviceId) || [];
    const idx = openDeviceSockets.findIndex(el => el.remote === `localabstract:${webViewSocket}`);

    if (idx >= 0) {
      let existingSocket = openDeviceSockets[idx];
      return parseInt(existingSocket.local.substr(4), 10);
    }

    let localPort = await portfinder.getPortPromise({
      port: 4000,
      stopPort: 5000,
    });

    const socket = await this.adb.forward(deviceId, `tcp:${localPort}`, `localabstract:${webViewSocket}`);
    openDeviceSockets.push(socket);

    this.forwardedSockets.set(deviceId, openDeviceSockets);
    return localPort;
  }

  async unforwardAllDebuggers(): Promise<void> {
    const promises: Promise<any>[] = [];
    let openSockets = Array.from(this.forwardedSockets.values());

    openSockets.forEach(sockets => {
      for (const socket of sockets) {
        const promise = this.adb.unforward(socket.local);
        promises.push(
          promise.catch(() => {
            /* Ignore */
          }),
        );
      }
    });

    await Promise.all(promises);
    this.forwardedSockets.clear();
  }

  async unforwardDebuggersForDevice(deviceId: string): Promise<void> {
    const promises: Promise<any>[] = [];

    let openDeviceSockets = this.forwardedSockets.get(deviceId);

    for (const socket of openDeviceSockets) {
      const promise = this.adb.unforward(socket.local);
      promises.push(
        promise.catch(() => {
          /* Ignore */
        }),
      );
    }

    await Promise.all(promises);
    this.forwardedSockets.set(deviceId, []);
  }

  async getWebViewPages(port: number): Promise<WebViewPage[]> {
    return JSON.parse(await get(`http://127.0.0.1:${port}/json/list`)) as WebViewPage[];
  }
}

function get(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    let data = '';
    const req = request(url, res => {
      res.on('data', chunk => {
        data += chunk;
      });
      res.on('error', reject);
      res.on('close', () => resolve(data));
    });
    req.on('error', reject);
    req.end();
  });
}
