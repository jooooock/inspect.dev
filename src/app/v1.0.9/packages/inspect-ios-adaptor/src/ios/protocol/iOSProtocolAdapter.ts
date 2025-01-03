import { Browser } from './domains/browser';
import { CSS } from './domains/css';
import { Debugger } from './domains/debugger';
import { DOM } from './domains/dom';
import { DOMDebugger } from './domains/domDebugger';
import { Emulation } from './domains/emulation';
import { Input } from './domains/input';
import { IO } from './domains/io';
import { Log } from './domains/log';
import { Network } from './domains/network';
import { Overlay } from './domains/overlay';
import { Page } from './domains/page';
import { Runtime } from './domains/runtime';
import { Accessibility } from './domains/accessibility';
import { ProtocolAdapter } from './protocolAdaptor';
import { LoggerBase } from 'src/lib/logger';

export class iOSProtocolAdaptor extends ProtocolAdapter {
  // Global state storage for cross-domain variables
  public globalState: {
    lastScriptEval: string | undefined;
    IOcache: Map<string, any>;
  };

  constructor(baseLogger: LoggerBase) {
    super(baseLogger);

    this.globalState = {
      lastScriptEval: null,
      IOcache: new Map(),
    };

    // Initialize protocol domains
    new Accessibility(this);
    new Browser(this);
    new CSS(this);
    new Debugger(this);
    new DOM(this);
    new DOMDebugger(this);
    new Emulation(this);
    new Input(this);
    new IO(this);
    new Log(this);
    new Network(this);
    new Overlay(this);
    new Page(this);
    new Runtime(this);
  }
}
