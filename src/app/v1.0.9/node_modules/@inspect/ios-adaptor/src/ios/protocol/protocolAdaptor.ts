import { EventEmitter } from 'stream';
import pTimeout from '../../lib/pTimeout';
import { LoggerBase } from 'src/lib/logger';

export class ProtocolAdapter extends EventEmitter {
  private messageFilters: Map<string, ((msg: any) => Promise<any>)[]>;
  private clientRequestMap: Map<number, string>;
  private clientRequestParamsMap: Map<number, object>;
  private adapterRequestMap: Map<number, { resolve: (any) => void; reject: (any) => void }>;
  private lastMsgId: number;
  baseLogger: LoggerBase;
  logger: LoggerBase;

  constructor(baseLogger: LoggerBase) {
    super();
    this.onMessageFromTarget = this.onMessageFromTarget.bind(this);
    this.onMessageFromClient = this.onMessageFromClient.bind(this);

    this.messageFilters = new Map<string, ((msg: any) => Promise<any>)[]>();
    this.clientRequestMap = new Map<number, string>();
    this.clientRequestParamsMap = new Map<number, object>();
    this.adapterRequestMap = new Map<number, { resolve: (any) => void; reject: (any) => void }>();
    this.lastMsgId = 10000;
    this.baseLogger = baseLogger;
    this.logger = this.baseLogger.scope('ProtocolAdapter');
  }

  public onMessageFromTarget(msg: any) {
    if ('id' in msg) {
      this.logger.info('onMessageFromTarget', msg.id);
      if (this.clientRequestMap.has(msg.id)) {
        // Resolve method name from request ID via clientRequestMap
        let eventName = `target::${this.clientRequestMap.get(msg.id)}`;

        this.clientRequestMap.delete(msg.id);

        if (this.messageFilters.has(eventName)) {
          try {
            let sequence = Promise.resolve(msg);

            this.messageFilters.get(eventName).forEach(filter => {
              sequence = sequence.then(filteredMessage => {
                return filter(filteredMessage);
              });
            });

            sequence.then(filteredMessage => {
              this.sendToFrontend(filteredMessage);
              this.clientRequestParamsMap.delete(msg.id);
            });
          } catch (err) {
            this.logger.error('onMessageFromTarget.filtering.failed', err);
          }
        } else {
          // Pass it on to the tools
          this.sendToFrontend(msg);
        }
      } else if (this.adapterRequestMap.has(msg.id)) {
        this.logger.info('onMessageFromTarget.adapterRequestMap', msg.id);
        // Reply to adapter request
        const resultPromise = this.adapterRequestMap.get(msg.id);
        this.adapterRequestMap.delete(msg.id);

        if ('result' in msg) {
          resultPromise.resolve(msg.result);
        } else if ('error' in msg) {
          this.logger.error('msg', msg);
          resultPromise.reject(msg.error.message);
        } else {
          resultPromise.reject(msg);
          this.logger.error(`Unhandled type of request message from target`, `msg=${msg}`);
        }
      } else {
        this.logger.debug('Request not made by client, but forward anyway', `id=${msg.id}`);
        this.sendToFrontend(msg);
      }
    } else {
      const eventName = `target::${msg.method}`;

      if (this.messageFilters.has(eventName)) {
        try {
          let sequence = Promise.resolve(msg);

          this.messageFilters.get(eventName).forEach(filter => {
            sequence = sequence.then(filteredMessage => {
              return filter(filteredMessage);
            });
          });

          sequence.then(filteredMessage => {
            this.sendToFrontend(filteredMessage);
          });
        } catch (err) {
          this.logger.error('onMessageFromTarget.filtering.failed', err);
        }
      } else {
        this.sendToFrontend(msg);
      }
    }
  }

  public onMessageFromClient(msg: any) {
    const eventName = `tools::${msg.method}`;

    // this.lastMsgId = Math.max(this.lastMsgId, msg.id);

    // Store request in map
    this.clientRequestMap.set(msg.id, msg.method);
    this.clientRequestParamsMap.set(msg.id, msg.params);

    if (this.messageFilters.has(eventName)) {
      try {
        let sequence = Promise.resolve(msg);

        this.messageFilters.get(eventName).forEach(filter => {
          sequence = sequence.then(filteredMessage => {
            return filter(filteredMessage);
          });
        });

        sequence.then(filteredMessage => {
          // Only send on the message if it wasn't completely filtered out
          if (filteredMessage) {
            this.sendToTarget(filteredMessage);
          }
        });
      } catch (err) {
        this.logger.error('onMessageFromClient.filtering.failed', err);
      }
    } else {
      this.sendToTarget(msg);
    }
  }

  public getParamsFromRequest(msgId: number): any {
    if (this.clientRequestParamsMap.has(msgId)) {
      return this.clientRequestParamsMap.get(msgId);
    } else {
      return null;
    }
  }

  public addMessageFilter(method: string, filter: (msg: any) => Promise<any>): void {
    if (!this.messageFilters.has(method)) {
      this.messageFilters.set(method, []);
    }

    this.messageFilters.get(method).push(filter);
  }

  public makeRequest(method: string, params: any): Promise<any> {
    return pTimeout(
      new Promise((resolve, reject) => {
        let reqId = ++this.lastMsgId;

        const msg = {
          id: reqId,
          method: method,
          params: params,
        };

        this.logger.info('makeRequest', msg);

        this.adapterRequestMap.set(msg.id, { resolve: resolve, reject: reject });

        this.sendToTarget(msg);
      }),
      {
        milliseconds: 1000,
      },
    ).catch((err: any) => {
      // TODO: Clean up this.adapterRequestMap, so requests dont hang round.
    });
  }

  public fireEventToClient(method: string, params: any): void {
    const response = {
      method: method,
      params: params,
    };

    this.sendToFrontend(response);
  }

  public fireResultToClient(id: number, params: any): void {
    const response = {
      id: id,
      result: params,
    };

    this.sendToFrontend(response);
  }

  public replyWithEmpty(msg: any): Promise<any> {
    this.fireResultToClient(msg.id, {});
    return Promise.resolve(null);
  }

  private sendToTarget(msg: any): void {
    let { id, method } = msg;
    this.logger.debug('protocolAdaptor.sendToTarget', `id=${id} method=${method}`);

    this.emit('toTarget', msg);
  }

  private sendToFrontend(msg: any) {
    if (!msg) {
      return;
    }

    let { id } = msg;
    this.logger.debug('protocolAdaptor.sendToFrontend', `id=${id}`);
    this.emit('toFrontend', msg);
  }
}
