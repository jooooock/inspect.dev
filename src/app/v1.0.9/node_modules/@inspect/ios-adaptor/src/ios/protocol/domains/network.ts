import Protocol from 'devtools-protocol';
import { iOSProtocolAdaptor } from '../iOSProtocolAdapter';
import crypto from 'crypto';

export class Network {
  private protocolAdaptor: iOSProtocolAdaptor;

  // # Chromium APIs:
  // https://chromedevtools.github.io/devtools-protocol/1-3/Network/

  // ## No mapping needed
  // - Network.getAllCookies
  // - Network.getCookies
  // - Network.disable
  // - Network.enable
  // - Network.setExtraHTTPHeaders
  // - Network.getResponseBody

  // ## Partial support, but needs mapping for 100% compat

  // ## Mapped
  // - Network.setCookie
  // - Network.deleteCookies
  // - Network.setUserAgentOverride
  // - Network.setCookies
  // - Network.setCacheDisabled
  // - Network.loadNetworkResource

  // ## Mapped events
  // - Network.loadingFinished
  // - Network.requestWillBeSent
  // - Network.requestWillBeSentExtraInfo
  // - Network.responseReceived
  // - Network.responseReceived
  // - Network.loadingFailed
  // - Network.requestServedFromCache

  // ## Not implemented
  // - Network.emulateNetworkConditions
  // - Network.clearBrowserCache
  // - Network.getRequestPostData

  constructor(protocolAdaptor: iOSProtocolAdaptor) {
    this.protocolAdaptor = protocolAdaptor;

    this.protocolAdaptor.addMessageFilter('tools::Network.getCookies', this.getCookies.bind(this));
    this.protocolAdaptor.addMessageFilter('tools::Network.getAllCookies', this.getAllCookies.bind(this));
    this.protocolAdaptor.addMessageFilter('tools::Network.deleteCookies', this.deleteCookies.bind(this));
    this.protocolAdaptor.addMessageFilter('tools::Network.setCookie', this.setCookie.bind(this));
    this.protocolAdaptor.addMessageFilter('tools::Network.setCookies', this.setCookies.bind(this));
    this.protocolAdaptor.addMessageFilter('tools::Network.setMonitoringXHREnabled', this.setMonitoringXHREnabled.bind(this));
    this.protocolAdaptor.addMessageFilter('tools::Network.canEmulateNetworkConditions', this.canEmulateNetworkConditions.bind(this));
    this.protocolAdaptor.addMessageFilter('tools::Network.clearBrowserCookies', this.clearBrowserCookies.bind(this));
    this.protocolAdaptor.addMessageFilter('tools::Network.setUserAgentOverride', this.setUserAgentOverride.bind(this));
    this.protocolAdaptor.addMessageFilter('tools::Network.setCacheDisabled', this.setCacheDisabled.bind(this));
    this.protocolAdaptor.addMessageFilter('tools::Network.loadNetworkResource', this.loadNetworkResource.bind(this));

    // Events
    this.protocolAdaptor.addMessageFilter('target::Network.loadingFinished', this.onLoadingFinished.bind(this));
    this.protocolAdaptor.addMessageFilter('target::Network.requestWillBeSent', this.onRequestWillBeSent.bind(this));
    this.protocolAdaptor.addMessageFilter('target::Network.responseReceived', this.onResponseReceived.bind(this));
    this.protocolAdaptor.addMessageFilter('target::Network.loadingFailed', this.onLoadingFailed.bind(this));
    this.protocolAdaptor.addMessageFilter('target::Network.requestServedFromMemoryCache', this.onRequestServedFromMemoryCache.bind(this));
  }

  private async canEmulateNetworkConditions(msg: any): Promise<any> {
    const result = {
      result: false,
    };
    this.protocolAdaptor.fireResultToClient(msg.id, result);
    return null;
  }

  private async getCookies(msg: any): Promise<any> {
    msg.method = 'Page.getCookies';
    return msg;
  }

  private async getAllCookies(msg: any): Promise<any> {
    msg.method = 'Page.getCookies';
    return msg;
  }

  private async setCookie(msg: any): Promise<any> {
    let params: Protocol.Network.SetCookieRequest = msg.params;

    msg.method = 'Page.setCookie';
    msg.params = {
      cookie: {
        name: params.name,
        value: params.value,
        domain: params.domain,
        path: params.path,
        expires: params.expires,
        session: false,
        httpOnly: params.httpOnly,
        secure: params.secure,
        sameSite: params.sameSite,
      },
    };
    return msg;
  }

  private async setCookies(msg: any): Promise<any> {
    let params: Protocol.Network.SetCookiesRequest = msg.params;

    for (const cookie of params.cookies) {
      await this.protocolAdaptor.makeRequest('Page.setCookie', {
        cookie: cookie,
      });
    }

    this.protocolAdaptor.fireResultToClient(msg.id, {});
    return null;
  }

  private async deleteCookies(msg: any): Promise<any> {
    let params: Protocol.Network.DeleteCookiesRequest = msg.params;

    msg.method = 'Page.deleteCookie';
    msg.params = {
      cookieName: params.name,
      url: 'https://' + params.domain + params.path,
    };

    // TODO: Find a way to make non-https deletion work
    // TODO: Call Network.getCookies to find Cookie, and check for secure flag.
    // TODO: https://github.com/WebKit/WebKit/blob/f3fd5fee12c21859fd04dc14d0caa3a5f06a6140/Source/WebCore/platform/network/curl/NetworkStorageSessionCurl.cpp#L157
    // TODO: String url = makeString(cookie.secure ? "https"_s : "http"_s, "://"_s, cookie.domain, cookie.path);
    return msg;
  }

  private async setMonitoringXHREnabled(msg: any): Promise<any> {
    msg.method = 'Console.setMonitoringXHREnabled';
    return msg;
  }

  private async clearBrowserCookies(msg: any): Promise<any> {
    try {
      let cookies = await this.protocolAdaptor.makeRequest('Network.getCookies', {});

      if (cookies) {
        cookies.forEach(async cookie => {
          await this.protocolAdaptor.makeRequest('Network.deleteCookie', {
            cookieName: cookie.name,
            url: cookie.domain + cookie.path,
          });
        });
      }
      this.protocolAdaptor.fireResultToClient(msg.id, {});
    } catch (error) {}

    return null;
  }

  private async setUserAgentOverride(msg: any): Promise<any> {
    let params: Protocol.Network.SetUserAgentOverrideRequest = msg.params;

    let webkitParams = {
      value: params.userAgent,
    };

    msg.method = 'Emulation.overrideUserAgent';
    msg.params = webkitParams;

    return msg;
  }

  private async setCacheDisabled(msg: any): Promise<any> {
    let params: Protocol.Network.SetCacheDisabledRequest = msg.params;

    let webkitParams = {
      disabled: params.cacheDisabled,
    };

    msg.method = 'Network.setResourceCachingDisabled';
    msg.params = webkitParams;

    return msg;
  }

  private async loadNetworkResource(msg: any): Promise<any> {
    let params: Protocol.Network.LoadNetworkResourceRequest = msg.params;

    let networkReq = await this.protocolAdaptor.makeRequest('Network.loadResource', {
      frameId: params.frameId,
      url: params.url,
    });

    if (networkReq) {
      let isSuccess = networkReq.content && networkReq.status === 200;
      let handle = null;

      if (isSuccess) {
        handle = crypto
          .createHash('sha256')
          .update(`${params.frameId}-${params.url}`)
          .digest('base64');

        this.protocolAdaptor.globalState.IOcache.set(handle, networkReq.content);
      }

      let response: Protocol.Network.LoadNetworkResourceResponse = {
        resource: {
          success: isSuccess,
          httpStatusCode: networkReq.status,
          stream: handle,
        },
      };

      this.protocolAdaptor.fireResultToClient(msg.id, response);
    } else {
      let response = {
        error: {
          message: 'Webkit failed to download resource',
        },
      };
      this.protocolAdaptor.fireResultToClient(msg.id, response);
    }

    return null;
  }

  private async onRequestWillBeSent(msg: any): Promise<any> {
    let webkitParams = msg.params;

    let result: Protocol.Network.RequestWillBeSentEvent = {
      requestId: webkitParams.requestId,
      loaderId: webkitParams.loaderId,
      documentURL: webkitParams.documentURL,
      request: this.transformRequest(webkitParams.request),
      timestamp: webkitParams.timestamp,
      wallTime: webkitParams.walltime,
      initiator: webkitParams.initiator,
      redirectResponse: webkitParams.redirectResponse,
      type: this.translateResourceType(webkitParams.type),
      frameId: webkitParams.frameId,
      hasUserGesture: false,
      redirectHasExtraInfo: false,
    };

    msg.params = result;

    return msg;
  }

  private async onResponseReceived(msg: any): Promise<any> {
    let webkitParams = msg.params;

    let result: Protocol.Network.ResponseReceivedEvent = {
      requestId: webkitParams.requestId,
      loaderId: webkitParams.loaderId,
      response: this.transformResponse(webkitParams.response),
      timestamp: webkitParams.timestamp,
      type: this.translateResourceType(webkitParams.type),
      hasExtraInfo: false,
      // Optional
      frameId: webkitParams.frameId,
    };

    if (webkitParams.response && webkitParams.response.source === 'memory-cache') {
      let requestServedFromCacheEvent: Protocol.Network.RequestServedFromCacheEvent = {
        requestId: result.requestId,
      };

      setTimeout(() => {
        this.protocolAdaptor.fireEventToClient('Network.requestServedFromCache', requestServedFromCacheEvent);
      }, 10);
    }

    msg.params = result;

    return msg;
  }

  private async onLoadingFailed(msg: any): Promise<any> {
    let webkitParams = msg.params;
    let result: Protocol.Network.LoadingFailedEvent = {
      requestId: webkitParams.requestId,
      timestamp: webkitParams.timestamp,
      errorText: webkitParams.errorText,
      canceled: webkitParams.canceled,
      type: 'Document', // TODO Find a way to map this correctly
      blockedReason: null,
      corsErrorStatus: null,
    };

    msg.params = result;

    return msg;
  }

  private async onLoadingFinished(msg: any): Promise<any> {
    let webkitParams = msg.params;

    let result: Protocol.Network.LoadingFinishedEvent = {
      requestId: webkitParams.requestId,
      timestamp: webkitParams.timestamp,
      encodedDataLength: 0,
      shouldReportCorbBlocking: false,
    };

    if (webkitParams.metrics.responseBodyBytesReceived) {
      // Transfer size
      result.encodedDataLength = webkitParams.metrics.responseBodyBytesReceived;
    }

    if (webkitParams.metrics.requestHeaders) {
      // Recently added event in CDP that is required.
      let requestWillBeSentExtraInfoEvent: Protocol.Network.RequestWillBeSentExtraInfoEvent = {
        requestId: result.requestId,
        associatedCookies: [],
        headers: this.transformHeaders(webkitParams.metrics.requestHeaders),
        connectTiming: {
          requestTime: 0,
        },
      };

      this.protocolAdaptor.fireEventToClient('Network.requestWillBeSentExtraInfo', requestWillBeSentExtraInfoEvent);
    }

    msg.params = result;

    return msg;
  }

  private async onRequestServedFromMemoryCache(msg: any): Promise<any> {
    let webkitParams = msg.params;

    let requestServedFromCacheEvent: Protocol.Network.RequestServedFromCacheEvent = {
      requestId: webkitParams.requestId,
    };

    this.protocolAdaptor.fireEventToClient('Network.requestServedFromCache', requestServedFromCacheEvent);

    return null;
  }

  private transformRequest(request): Protocol.Network.Request {
    if (!request) {
      return;
    }

    return {
      url: request.url,
      method: request.method,
      headers: this.transformHeaders(request.headers),
      postData: request.postData,
      initialPriority: 'Medium',
      referrerPolicy: 'origin',
      // Optional
      hasPostData: request.postData !== null,
      // urlFragment: null,
      // postDataEntries: [],
      // mixedContentType: null,
      // isLinkPreload: null,
      // trustTokenParams: null,
    };
  }

  private transformResponse(response): Protocol.Network.Response {
    if (!response) {
      return;
    }

    let headers = this.transformHeaders(response.headers);
    let encodedDataLength = 0;
    if (headers['content-length']) {
      // Based on https://github.com/WebKit/WebKit/blob/894b83e3959a9745ffb44b6df824820feb948db1/Source/WebInspectorUI/UserInterface/Models/Resource.js#L552
      encodedDataLength = Number(headers['content-length']);
    }

    return {
      url: response.url,
      status: response.status,
      headers: headers,
      statusText: response.statusText,
      mimeType: response.mimeType,
      requestHeaders: response.requestHeaders,
      timing: this.transformResourceTiming(response.timing),
      securityState: response.security,
      connectionReused: false,
      connectionId: 0,
      encodedDataLength: encodedDataLength,
      fromDiskCache: response.source === 'disk-cache',
      fromServiceWorker: response.source === 'service-worker',

      // Optional
      //  headersText?: string,
      //  requestHeadersText?: stringm
      //  remoteIPAddress?: string;
      //  remotePort?: integer;
      //  fromPrefetchCache?: boolean;
      //  serviceWorkerResponseSource?: ServiceWorkerResponseSource;
      //  responseTime?: TimeSinceEpoch;
      //  cacheStorageCacheName?: string;
      //  protocol?: string;
      //  securityDetails?: SecurityDetails;
    };
  }

  private transformResourceTiming(resourceTiming): Protocol.Network.ResourceTiming {
    if (!resourceTiming) {
      return;
    }

    return {
      requestTime: resourceTiming.startTime,
      proxyStart: 0,
      proxyEnd: 0,
      dnsStart: resourceTiming.domainLookupStart,
      dnsEnd: resourceTiming.domainLookupEnd,
      connectStart: resourceTiming.connectStart,
      connectEnd: resourceTiming.connectEnd,
      sslStart: resourceTiming.secureConnectionStart,
      sslEnd: 0,
      workerStart: 0,
      workerReady: 0,
      workerFetchStart: 0,
      workerRespondWithSettled: 0,
      sendStart: resourceTiming.requestStart,
      sendEnd: resourceTiming.responseEnd,
      pushStart: 0,
      pushEnd: 0,
      receiveHeadersEnd: 0,
    };
  }

  private transformHeaders(headers): Protocol.Network.Headers {
    const formattedHeaders = Object.fromEntries(Object.entries(headers).map(([k, v]) => [k.toLowerCase(), String(v)]));

    return formattedHeaders;
  }

  private translateResourceType(resourceType): Protocol.Network.ResourceType {
    switch (resourceType) {
      case 'Document':
        return 'Document';
      case 'StyleSheet':
        return 'Stylesheet';
      case 'Image':
        return 'Image';
      case 'Font':
        return 'Font';
      case 'Script':
        return 'Script';
      case 'XHR':
        return 'XHR';
      case 'Fetch':
        return 'Fetch';
      case 'Ping':
        return 'Ping';
      case 'WebSocket':
        return 'WebSocket';
      default:
        return 'Other';
    }
  }
}
