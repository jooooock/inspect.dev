import exec from 'execa';
import { LoggerBase } from 'src/lib/logger';

export type DeviceState = 'device' | 'connecting' | 'offline' | 'unknown' | 'bootloader' | 'recovery' | 'download' | 'unauthorized' | 'host' | 'no permissions';

export interface Device {
  serial: string;
  state: DeviceState;
  usb?: string;
  product?: string;
  model?: string;
  device?: string;
  features?: string;
  transportId?: string;
}

export interface ForwardedSocket {
  local: string;
  remote: string;
}

export class ADB {
  logger: LoggerBase;

  constructor(baseLogger: LoggerBase) {
    this.logger = baseLogger.scope('ADB');
  }

  async run(...args: string[]): Promise<string> {
    try {
      let { stdout } = await exec('adb', [...args]);
      return stdout;
    } catch (error) {
      this.logger.info('adb.error', error);
      throw error;
    }
  }

  async version(): Promise<string> {
    return await this.run('version');
  }

  async devices(): Promise<Device[]> {
    const output = await this.run('devices', '-l');

    this.logger.info('adb.devices.output', output);

    const result: Device[] = [];

    const regex = /^([a-zA-Z0-9_-]+(?:\s?[\.a-zA-Z0-9_-]+)?(?:\:\d{1,})?)\s+(device|connecting|offline|unknown|bootloader|recovery|download|unauthorized|host|no permissions)(?:\s+usb:([^:]+))?(?:\s+product:([^:]+))?(?:\s+model\:([\S]+))?(?:\s+device\:([\S]+))?(?:\s+features:([^:]+))?(?:\s+transport_id:([^:]+))?$/gim;
    let match;
    while ((match = regex.exec(output)) !== null) {
      result.push({
        serial: match[1],
        state: match[2] as DeviceState,
        usb: match[3],
        product: match[4],
        model: match[5],
        device: match[6],
        features: match[7],
        transportId: match[8],
      });
    }

    return result;
  }

  async shell(serial: string, command: string): Promise<string> {
    return await this.run('-s', serial, 'shell', command);
  }

  async forward(serial: string, local: string, remote: string): Promise<ForwardedSocket> {
    const output = await this.run('-s', serial, 'forward', local, remote);

    if (local === 'tcp:0') {
      return {
        local: `tcp:${parseInt(output.trim(), 10)}`,
        remote: remote,
      };
    } else {
      return {
        local: local,
        remote: remote,
      };
    }
  }

  async unforward(local: string): Promise<void> {
    await this.run('forward', '--remove', local);
  }
}
