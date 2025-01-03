export enum PlatformType {
  iOS = 'iOS',
  Android = 'Android',
}

export interface Device {
  id: string;
  name: string;
  platformVersion: string;
  platformType: PlatformType;
  type: string;
  socket?: string;
  apps?: App[];
  isLocked?: boolean;
  isPaired?: boolean;
}

export interface App {
  id: string;
  bundleId: string;
  hostId: string;
  name: string;
  isProxy: boolean;
  isActive: boolean;
  targets?: Target[];
  deviceId?: string;
}

export interface Target {
  id: string;
  pageId: number;
  appId: string;
  deviceId: string;
  title: string;
  url: string;
  type: string;
  socket?: string;
  isDebuggable?: boolean;
}
