import Protocol from 'devtools-protocol';
import { iOSProtocolAdaptor } from '../iOSProtocolAdapter';

declare var MouseEvent: any;
declare var document: any;

export class Input {
  private protocolAdaptor: iOSProtocolAdaptor;

  // # Chromium APIs:
  // https://chromedevtools.github.io/devtools-protocol/1-3/Input/

  // ## No mapping needed

  // ## Partial support, but needs mapping for 100% compat
  // - Input.dispatchMouseEvent
  // - Input.emulateTouchFromMouseEvent

  // ## Mapped

  // ## Not implemented
  // - Input.setIgnoreInputEvents
  // - Input.dispatchKeyEvent
  // - Input.dispatchTouchEvent

  constructor(protocolAdaptor: iOSProtocolAdaptor) {
    this.protocolAdaptor = protocolAdaptor;

    this.protocolAdaptor.addMessageFilter('tools::Input.emulateTouchFromMouseEvent', this.dispatchMouseEvent.bind(this));
    this.protocolAdaptor.addMessageFilter('tools::Input.dispatchMouseEvent', this.dispatchMouseEvent.bind(this));
  }

  private async dispatchMouseEvent(msg: any): Promise<any> {
    let params: Protocol.Input.DispatchMouseEventRequest = msg.params;

    /* tslint:disable */
    function simulate(params: any) {
      const element = document.elementFromPoint(params.x, params.y);
      const e = new MouseEvent(params.type, {
        screenX: params.x,
        screenY: params.y,
        clientX: 0,
        clientY: 0,
        ctrlKey: (params.modifiers & 2) === 2,
        shiftKey: (params.modifiers & 8) === 8,
        altKey: (params.modifiers & 1) === 1,
        metaKey: (params.modifiers & 4) === 4,
        button: params.button,
        bubbles: true,
        cancelable: false,
      });
      element.dispatchEvent(e);
      return element;
    }
    /* tslint:enable */

    switch (msg.params.type) {
      case 'mousePressed':
        msg.params.type = 'mousedown';
        break;
      case 'mouseReleased':
        msg.params.type = 'click';
        break;
      case 'mouseMoved':
        msg.params.type = 'mousemove';
        ``;
        break;
      default:
        this.protocolAdaptor.logger.error(`Unknown emulate mouse event name '${msg.params.type}'`);
        break;
    }

    const exp = `(${simulate.toString()})(${JSON.stringify(msg.params)})`;

    try {
      await this.protocolAdaptor.makeRequest('Runtime.evaluate', {
        expression: exp,
      });

      if (msg.params.type === 'click') {
        msg.params.type = 'mouseup';
        await this.protocolAdaptor.makeRequest('Runtime.evaluate', {
          expression: exp,
        });
      }

      this.protocolAdaptor.fireResultToClient(msg.id, {});

      return null;
    } catch (err) {
      this.protocolAdaptor.logger.error('setScriptExecutionDisabled.failed');
      return null;
    }
  }
}
