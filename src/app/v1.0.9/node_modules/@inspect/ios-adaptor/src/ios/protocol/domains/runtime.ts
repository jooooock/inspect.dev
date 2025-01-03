import Protocol from 'devtools-protocol';
import { iOSProtocolAdaptor } from '../iOSProtocolAdapter';

export class Runtime {
  protected lastPageExecutionContextId: number;
  private protocolAdaptor: iOSProtocolAdaptor;
  private lastConsoleMessage: Object;

  // # Chromium APIs:

  // ## No mapping needed
  // Runtime.enable
  // Runtime.disable
  // Runtime.awaitPromise
  // Runtime.releaseObject
  // Runtime.releaseObjectGroup

  // ## Partial support, but needs mapping for 100% compat
  // Runtime.compileScript
  // Runtime.callFunctionOn
  // Runtime.evaluate
  // Runtime.getProperties
  // Event: Runtime.executionContextsCleared

  // ## Mapped
  // Runtime.discardConsoleEntries
  // Runtime.setAsyncCallStackDepth

  // ## Not implemented
  // Runtime.globalLexicalScopeNames
  // Runtime.queryObjects
  // Runtime.runIfWaitingForDebugger
  // Runtime.runScript
  // Runtime.addBinding EXPERIMENTAL
  // Runtime.getHeapUsage EXPERIMENTAL
  // Runtime.getIsolateId EXPERIMENTAL
  // Runtime.removeBinding EXPERIMENTAL
  // Runtime.setCustomObjectFormatterEnabled EXPERIMENTAL
  // Runtime.setMaxCallStackSizeToCapture EXPERIMENTAL
  // Runtime.terminateExecution EXPERIMENTAL

  constructor(protocolAdaptor: iOSProtocolAdaptor) {
    this.protocolAdaptor = protocolAdaptor;
    this.lastConsoleMessage = null;

    // From frontend
    this.protocolAdaptor.addMessageFilter('tools::Runtime.compileScript', this.compileScript.bind(this));
    this.protocolAdaptor.addMessageFilter('tools::Runtime.discardConsoleEntries', this.discardConsoleEntries.bind(this));
    this.protocolAdaptor.addMessageFilter('tools::Runtime.setAsyncCallStackDepth', this.setAsyncCallStackDepth.bind(this));
    this.protocolAdaptor.addMessageFilter('tools::Runtime.evaluate', this.evaluate.bind(this));

    // From target
    this.protocolAdaptor.addMessageFilter('target::Runtime.evaluate', this.evaluateResult.bind(this));
    this.protocolAdaptor.addMessageFilter('target::Runtime.getProperties', this.getPropertiesResult.bind(this));

    // Events
    this.protocolAdaptor.addMessageFilter('target::Runtime.executionContextCreated', this.onExecutionContextCreated.bind(this));
    this.protocolAdaptor.addMessageFilter('target::Console.messageAdded', this.onConsoleMessageAdded.bind(this));
    this.protocolAdaptor.addMessageFilter('target::Console.messageRepeatCountUpdated', this.onMessageRepeatCountUpdated.bind(this));
    this.protocolAdaptor.addMessageFilter('target::Console.messagesCleared', this.onMessagesCleared.bind(this));
    this.protocolAdaptor.addMessageFilter('target::Console.heapSnapshot', this.onHeapSnapshot.bind(this));
    this.protocolAdaptor.addMessageFilter('target::Debugger.globalObjectCleared', this.onGlobalObjectCleared.bind(this));
  }

  private onExecutionContextCreated(msg: any): Promise<any> {
    if (msg.params && msg.params.context) {
      if (!msg.params.context.origin) {
        msg.params.context.origin = msg.params.context.name;
      }

      if (msg.params.context.isPageContext) {
        this.lastPageExecutionContextId = msg.params.context.id;
      }

      if (msg.params.context.frameId) {
        msg.params.context.auxData = {
          frameId: msg.params.context.frameId,
          isDefault: true,
        };
        delete msg.params.context.frameId;
      }
    }

    return Promise.resolve(msg);
  }

  private evaluateResult(msg: any): Promise<Protocol.Runtime.EvaluateResponse> {
    if (msg.result && msg.result.wasThrown) {
      msg.result.result.subtype = 'error';
      msg.result.exceptionDetails = {
        text: msg.result.result.description,
        url: '',
        scriptId: this.protocolAdaptor.globalState.lastScriptEval,
        line: 1,
        column: 0,
        stack: {
          callFrames: [
            {
              functionName: '',
              scriptId: this.protocolAdaptor.globalState.lastScriptEval,
              url: '',
              lineNumber: 1,
              columnNumber: 1,
            },
          ],
        },
      };
    } else if (msg.result && msg.result.result && msg.result.result.preview) {
      msg.result.result.preview.description = msg.result.result.description;
      msg.result.result.preview.type = 'object';
    }

    return Promise.resolve(msg);
  }

  private async compileScript(msg: any): Promise<Protocol.Runtime.CompileScriptResponse> {
    const params = {
      source: msg.params.expression,
    };

    try {
      let webkitResults = await this.protocolAdaptor.makeRequest('Runtime.parse', params);

      if (webkitResults.result) {
        let result: Protocol.Runtime.CompileScriptResponse;
        if (webkitResults.result != 'none') {
          result = {
            exceptionDetails: {
              exceptionId: 0,
              text: webkitResults.message,
              lineNumber: 0,
              columnNumber: 0,
              exception: webkitResults.result,
            },
          };
        } else {
          result = {
            exceptionDetails: null,
          };
        }
        this.protocolAdaptor.fireResultToClient(msg.id, result);
      }
    } catch (err) {
      this.protocolAdaptor.logger.error('compileScript.failed', err);
      this.protocolAdaptor.fireResultToClient(msg.id, {});
    }

    return null;
  }

  private async getPropertiesResult(msg: any): Promise<Protocol.Runtime.GetPropertiesResponse> {
    // Get request params from original request
    let requestParams = this.protocolAdaptor.getParamsFromRequest(msg.id);

    if (requestParams && requestParams.objectId) {
      let result = {};

      if (msg.result) {
        if (msg.result.properties) {
          result['result'] = await this.transformProperties(requestParams.objectId, msg.result.properties);
        }

        if (msg.result.internalProperties) {
          result['internalProperties'] = await this.transformInternalProperties(requestParams.objectId, msg.result.internalProperties);
        }
      }
      msg.result = result;
    }

    return msg;
  }

  private async discardConsoleEntries(msg: any): Promise<any> {
    msg.method = 'Console.clearMessages';
    return msg;
  }

  private async evaluate(msg: any): Promise<any> {
    let params: Protocol.Runtime.EvaluateRequest = msg.params;

    msg.params = {
      expression: params.expression,
      objectGroup: params.objectGroup,
      includeCommandLineAPI: params.includeCommandLineAPI,
      doNotPauseOnExceptionsAndMuteConsole: params.silent,
      contextId: params.contextId,
      generatePreview: params.generatePreview,
      emulateUserGesture: params.userGesture,
      saveResult: true,
      returnByValue: false, // Hardcoded webkit-specific value
    };
    return msg;
  }

  private async setAsyncCallStackDepth(msg: any): Promise<any> {
    msg.method = 'Debugger.setAsyncStackTraceDepth';
    return msg;
  }

  private onConsoleMessageAdded(msg: any): Promise<any> {
    let message = msg.params.message;
    let type;
    if (message.type === 'log') {
      switch (message.level) {
        case 'log':
          type = 'log';
          break;
        case 'info':
          type = 'info';
          break;
        case 'error':
          type = 'error';
          break;
        case 'warning':
          type = 'warning';
          break;
        default:
          type = 'log';
      }
    } else {
      type = message.type;
    }

    if (message.source === 'console-api') {
      let logEntry: Protocol.Runtime.ConsoleAPICalledEvent = {
        type: type,
        stackTrace: this.transformStacktrace(message.stackTrace),
        timestamp: Math.floor(new Date().getTime()),
        executionContextId: 1, // fix?
        args: message.parameters || [],
      };

      this.lastConsoleMessage = logEntry;
      this.protocolAdaptor.fireEventToClient('Runtime.consoleAPICalled', logEntry);
    } else {
      let logEntry: Protocol.Log.LogEntry = {
        source: message.source,
        level: message.level,
        text: message.text,
        timestamp: Math.floor(new Date().getTime()),
        lineNumber: message.line,
        networkRequestId: message.networkRequestId,
        url: message.url,
      };

      if (message.parameters) {
        logEntry.args = message.parameters;
      }

      if (message.stackTrace) {
        logEntry.stackTrace = this.transformStacktrace(message.stackTrace);
      }

      this.protocolAdaptor.fireEventToClient('Log.entryAdded', {
        entry: logEntry,
      });
    }

    return Promise.resolve(null);
  }

  private async onMessageRepeatCountUpdated(msg: any): Promise<any> {
    if (this.lastConsoleMessage) {
      this.protocolAdaptor.fireEventToClient('Runtime.consoleAPICalled', this.lastConsoleMessage);
    }
    return null;
  }

  private async onMessagesCleared(msg: any): Promise<any> {
    return null;
  }

  private async onHeapSnapshot(msg: any): Promise<any> {
    return null;
  }

  private async onGlobalObjectCleared(msg: any): Promise<any> {
    // Fixes https://github.com/inspectdev/inspect-issues/issues/104
    this.protocolAdaptor.fireEventToClient('Runtime.executionContextsCleared', {});

    return Promise.resolve(msg);
  }

  private async resolvePropertyValue(objectId, propertyName) {
    // // from https://github.com/WebKit/WebKit/blob/88278b55563e5ccdc0b3419c6c391c3becc19e40/Source/WebInspectorUI/UserInterface/Base/Utilities.js#L1650
    function inspectedPage_object_getProperty(property) {
      if (typeof property !== 'string' && typeof property !== 'number') throw new Error(`Tried to get property using key is not a string or number: ${property}`);
      return this[property];
    }

    try {
      let functionValue = await this.protocolAdaptor.makeRequest('Runtime.callFunctionOn', {
        objectId: objectId,
        functionDeclaration: inspectedPage_object_getProperty.toString(),
        arguments: [{ value: propertyName }],
        generatePreview: true,
      });

      if (!functionValue.wasThrown) {
        return functionValue.result;
      }
    } catch (err) {
      throw new Error(err);
    }
  }

  private async transformProperties(objectId, properties): Promise<Protocol.Runtime.PropertyDescriptor[]> {
    let transformedProperties = [];

    for (let i = 0; i < properties.length; i++) {
      let property = properties[i];
      if (property.isOwn || property.nativeGetter) {
        property.isOwn = true;
      }

      if (!property.value) {
        try {
          property.value = await this.resolvePropertyValue(objectId, property.name);
        } catch (error) {}
      }

      let transformedProperty: Protocol.Runtime.PropertyDescriptor = {
        name: property.name,
        value: property.value,
        writable: property.writable || false,
        configurable: property.configurable || false,
        enumerable: property.enumerable || false,
        isOwn: property.isOwn || true,
      };

      transformedProperties.push(transformedProperty);
    }

    return transformedProperties;
  }

  private transformStacktrace(stackTrace): Protocol.Runtime.StackTrace {
    if (!stackTrace) {
      return;
    }

    return {
      callFrames: stackTrace.callFrames,
      // Optional
      // description?: string;
      // parent?: StackTrace;
      // parentId?: StackTraceId;
    };
  }

  private async transformInternalProperties(objectId, properties): Promise<Protocol.Runtime.InternalPropertyDescriptor[]> {
    let transformedProperties = [];

    for (let i = 0; i < properties.length; i++) {
      let property = properties[i];

      if (!property.value) {
        try {
          property.value = await this.resolvePropertyValue(objectId, property.name);
        } catch (error) {}
      }

      let transformedProperty: Protocol.Runtime.InternalPropertyDescriptor = {
        name: property.name,
        value: property.value,
      };

      transformedProperties.push(transformedProperty);
    }

    return transformedProperties;
  }
}
