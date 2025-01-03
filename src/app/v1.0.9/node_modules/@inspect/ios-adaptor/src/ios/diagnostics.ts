import fs from 'fs/promises';
import net from 'net';
import pTimeout from '../lib/pTimeout';
import os from 'os';

const DEFAULT_USBMUXD_SOCKET = '/var/run/usbmuxd';
const DEFAULT_USBMUXD_PORT = 27015;
const DEFAULT_USBMUXD_HOST = '127.0.0.1';

class Diagnostics {
  constructor() {}

  public async runDiagnostics(): Promise<Object> {
    let canConnectToUsbmuxd = await this.canConnectToUsbmuxd();
    let canDetectDevices = await this.canDetectDevices();
    let canDetectTargets = await this.canDetectTargets();

    return {
      canConnectToSimulator: false,
      canConnectToUsbmuxd: canConnectToUsbmuxd,
      canDetectDevices: canDetectDevices,
      canDetectTargets: canDetectTargets,
    };
  }

  async canConnectToUsbmuxd(): Promise<boolean> {
    let socket: NodeJS.Socket;

    if (await fs.stat(DEFAULT_USBMUXD_SOCKET)) {
      socket = net.createConnection(DEFAULT_USBMUXD_SOCKET);
    } else if (process.platform === 'win32' || (process.platform === 'linux' && /microsoft/i.test(os.release()))) {
      socket = net.createConnection(DEFAULT_USBMUXD_PORT, DEFAULT_USBMUXD_HOST);
    } else {
      return false;
    }

    return await pTimeout(
      new Promise((resolve, reject) => {
        socket.once('error', reject.bind(null, false));
        socket.once('connect', () => resolve(true));
      }),
      {
        milliseconds: 5000,
      },
    );
  }

  async canDetectDevices(): Promise<boolean> {
    // Implement code to get battery level

    return false;
  }

  async canDetectTargets(): Promise<boolean> {
    // Implement code to take a screenshot

    return false;
  }
}
