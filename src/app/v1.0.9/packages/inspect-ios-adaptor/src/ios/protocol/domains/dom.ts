import Protocol from 'devtools-protocol';
import { iOSProtocolAdaptor } from '../iOSProtocolAdapter';
import getBoxQuards from './utils/getBoxQuards';

export class DOM {
  private protocolAdaptor: iOSProtocolAdaptor;

  constructor(protocolAdaptor: iOSProtocolAdaptor) {
    this.protocolAdaptor = protocolAdaptor;

    // # Chromium APIs:
    // ## No mapping needed
    // - DOM.disable
    // - DOM.querySelector
    // - DOM.querySelectorAll
    // - DOM.setNodeName
    // - DOM.setNodeValue
    // - DOM.removeNode
    // - DOM.setAttributeValue
    // - DOM.setAttributesAsText
    // - DOM.removeAttribute
    // - DOM.setOuterHTML
    // - DOM.getSearchResults EXPERIMENTAL
    // - DOM.discardSearchResults EXPERIMENTAL
    // - DOM.requestNode
    // - DOM.pushNodeByPathToFrontend EXPERIMENTAL
    // - DOM.getAttributes
    // - DOM.moveTo
    // - DOM.undo EXPERIMENTAL
    // - DOM.redo EXPERIMENTAL
    // - DOM.markUndoableState EXPERIMENTAL
    // - DOM.setInspectedNode EXPERIMENTAL
    // - DOM.hideHighlight
    // - DOM.highlightNode
    // - DOM.highlightRect

    // ## Partial support, but needs mapping for 100% compat
    // - DOM.getDocument
    // - DOM.requestChildNodes
    // - DOM.getOuterHTML
    // - DOM.performSearch
    // - DOM.resolveNode
    // - DOM.focus

    // ## Mapped
    // - DOM.enable
    // - DOM.pushNodesByBackendIdsToFrontend EXPERIMENTAL
    // - DOM.getBoxModel
    // - DOM.getNodeForLocation
    // - DOM.performSearch

    // ## Not implemented
    // DOM.describeNode
    // DOM.setFileInputFiles
    // DOM.getFlattenedDocument DEPRECATED
    // DOM.collectClassNamesFromSubtree EXPERIMENTAL
    // DOM.copyTo EXPERIMENTAL
    // DOM.getContentQuads EXPERIMENTAL
    // DOM.getFileInfo EXPERIMENTAL
    // DOM.getFrameOwner EXPERIMENTAL
    // DOM.getNodesForSubtreeByStyle EXPERIMENTAL
    // DOM.getNodeStackTraces EXPERIMENTAL
    // DOM.getRelayoutBoundary EXPERIMENTAL
    // DOM.scrollIntoViewIfNeeded EXPERIMENTAL
    // DOM.setNodeStackTracesEnabled EXPERIMENTAL

    // ## Webkit APIs
    // getSupportedEventNames
    // getDataBindingsForNode
    // getAssociatedDataForNode
    // getEventListenersForNode
    // setEventListenerDisabled
    // setBreakpointForEventListener
    // removeBreakpointForEventListener
    // getAccessibilityPropertiesForNode
    // insertAdjacentHTML
    // setInspectModeEnabled
    // setAllowEditingUserAgentShadowTrees
    // pushNodeByPathToFrontend

    this.protocolAdaptor.addMessageFilter('tools::DOM.enable', this.enable.bind(this));
    this.protocolAdaptor.addMessageFilter('tools::DOM.pushNodesByBackendIdsToFrontend', this.pushNodesByBackendIdsToFrontend.bind(this));
    this.protocolAdaptor.addMessageFilter('tools::DOM.getBoxModel', this.getBoxModel.bind(this));
    this.protocolAdaptor.addMessageFilter('tools::DOM.getNodeForLocation', this.getNodeForLocation.bind(this));
    this.protocolAdaptor.addMessageFilter('tools::DOM.performSearch', this.performSearch.bind(this));
  }

  private async pushNodesByBackendIdsToFrontend(msg: any): Promise<any> {
    const params: Protocol.DOM.PushNodesByBackendIdsToFrontendRequest = msg.params;
    let resolvedNodeIds = [];

    try {
      for (const backendNodeId of params.backendNodeIds) {
        let params = {
          backendNodeId: backendNodeId,
        };
        const nodeId = await this.protocolAdaptor.makeRequest('DOM.pushNodeByBackendIdToFrontend', params);
        resolvedNodeIds.push(nodeId);
      }
    } catch (err) {
      // Command removed in https://github.com/WebKit/WebKit/commit/d3cb38e6f59b6e4bdd148e839158132a78d9b8e3, so fall through and assume frontend have all the ids, so return the requested ones
      resolvedNodeIds = params.backendNodeIds;
      this.protocolAdaptor.logger.info('pushNodesByBackendIdsToFrontend.failed', err);
    }

    const result = {
      nodeIds: resolvedNodeIds,
    };

    this.protocolAdaptor.fireResultToClient(msg.id, result);
    return null;
  }

  private async enable(msg: any): Promise<any> {
    this.protocolAdaptor.fireResultToClient(msg.id, {});
    return null;
  }

  private async getBoxModel(msg: any): Promise<any> {
    const params: Protocol.DOM.GetBoxModelRequest = msg.params;

    // let findStyle = (computedStyles: [], propertyName) => {
    //   let property: { value: string; name: string } = computedStyles.find((s: any) => s.name == propertyName);
    //   if (property) {
    //     return property.value;
    //   }

    //   return null;
    // };

    // let findStylePx = (computedStyles: [], propertyName) => {
    //   let value = findStyle(computedStyles, propertyName);
    //   if (!value) return 0;
    //   return Number(value.replace(/px$/, '') || 0);
    // };

    let runtimePropertiesToObject = array => {
      const initialValue = {};
      return array.reduce((obj, item) => {
        let value = item.value;
        if (item.type === 'number') {
          value = Number(item.value.replace(/px$/, '') || 0);
        }

        return {
          ...obj,
          [item.name]: value,
        };
      }, initialValue);
    };

    function inspect_getBoundingClientRect() {
      return this.getBoundingClientRect();
    }

    try {
      const objectReq = await this.protocolAdaptor.makeRequest('DOM.resolveNode', {
        nodeId: params.nodeId,
      });

      let boundingClientRectReq = await this.protocolAdaptor.makeRequest('Runtime.callFunctionOn', {
        objectId: objectReq.object.objectId,
        functionDeclaration: inspect_getBoundingClientRect.toString(),
        generatePreview: true,
      });

      let boundingClientRect = runtimePropertiesToObject(boundingClientRectReq.result.preview.properties);

      const computedStylesReq = await this.protocolAdaptor.makeRequest('CSS.getComputedStyleForNode', {
        nodeId: params.nodeId,
      });

      let computedStyles = runtimePropertiesToObject(computedStylesReq.computedStyle);

      let quards = getBoxQuards(boundingClientRect, computedStyles);

      let result: Protocol.DOM.GetBoxModelResponse = {
        model: {
          border: quards.border,
          content: quards.content,
          margin: quards.margin,
          padding: quards.padding,
          height: quards.height,
          width: quards.width,
        },
      };

      this.protocolAdaptor.fireResultToClient(msg.id, result);
    } catch (error) {
      this.protocolAdaptor.logger.error('getBoxModel.failed');
      this.protocolAdaptor.fireResultToClient(msg.id, {
        error: 'Could not compute BoxModel',
      });
    }

    return null;
  }

  private async getNodeForLocation(msg: any): Promise<any> {
    try {
      let obj = await this.protocolAdaptor.makeRequest('Runtime.evaluate', {
        expression: 'document.elementFromPoint(' + msg.params.x + ',' + msg.params.y + ')',
      });

      let result = await this.protocolAdaptor.makeRequest('DOM.requestNode', {
        objectId: obj.result.objectId,
      });

      this.protocolAdaptor.fireResultToClient(msg.id, {
        nodeId: result.nodeId,
      });
    } catch (err) {
      this.protocolAdaptor.logger.error('getNodeForLocation.failed', err);
    }

    return null;
  }

  private performSearch(msg: any): Promise<any> {
    let params: Protocol.DOM.PerformSearchRequest = msg.params;

    msg.params = {
      query: params.query,
      caseSensitive: true,
    };

    return msg;
  }
}
