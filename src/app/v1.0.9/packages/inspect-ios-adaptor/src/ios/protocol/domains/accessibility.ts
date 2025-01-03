import Protocol from 'devtools-protocol';
import { iOSProtocolAdaptor } from '../iOSProtocolAdapter';

export class Accessibility {
  private protocolAdaptor: iOSProtocolAdaptor;

  // # Chromium APIs:
  // https://chromedevtools.github.io/devtools-protocol/tot/Accessibility/

  // ## No mapping needed
  // -

  // ## Mapped
  //  - Accessibility.disable
  //  - Accessibility.enable
  //  - Accessibility.getPartialAXTree EXPERIMENTAL

  // ## Not implemented
  //  - Accessibility.getChildAXNodes EXPERIMENTAL
  //  - Accessibility.getFullAXTree EXPERIMENTAL
  //  - Accessibility.queryAXTree EXPERIMENTAL

  constructor(protocolAdaptor: iOSProtocolAdaptor) {
    this.protocolAdaptor = protocolAdaptor;

    this.protocolAdaptor.addMessageFilter('tools::Accessibility.disable', this.disable.bind(this));
    this.protocolAdaptor.addMessageFilter('tools::Accessibility.enable', this.enable.bind(this));
    this.protocolAdaptor.addMessageFilter('tools::Accessibility.getPartialAXTree', this.getPartialAXTree.bind(this));
  }

  private async disable(msg: any): Promise<any> {
    const result = {
      result: true,
    };
    this.protocolAdaptor.fireResultToClient(msg.id, result);
    return null;
  }

  private async enable(msg: any): Promise<any> {
    const result = {
      result: true,
    };
    this.protocolAdaptor.fireResultToClient(msg.id, result);
    return null;
  }

  private async getPartialAXTree(msg: any): Promise<any> {
    let params: Protocol.Accessibility.GetPartialAXTreeRequest = msg.params;

    try {
      let webkitResults = await this.protocolAdaptor.makeRequest('DOM.getAccessibilityPropertiesForNode', {
        nodeId: params.nodeId,
      });

      let properties = webkitResults.properties;

      let result: Protocol.Accessibility.GetPartialAXTreeResponse = {
        nodes: [],
      };

      this.protocolAdaptor.fireResultToClient(msg.id, result);

      return null;
    } catch (err) {
      this.protocolAdaptor.logger.error('getPartialAXTree.failed');
      return null;
    }
  }

  //   private transformAccessibilityPropertyToAxNode(nodeId, properties): Protocol.Accessibility.AXNode {
  //     return {
  //       // /**
  //       //  * Unique identifier for this node.
  //       //  */
  //       // nodeId: AXNodeId;
  //       // /**
  //       //  * Whether this node is ignored for accessibility
  //       //  */
  //       // ignored: boolean;
  //       // /**
  //       //  * Collection of reasons why this node is hidden.
  //       //  */
  //       // ignoredReasons?: AXProperty[];
  //       // /**
  //       //  * This `Node`'s role, whether explicit or implicit.
  //       //  */
  //       // role?: AXValue;
  //       // /**
  //       //  * The accessible name for this `Node`.
  //       //  */
  //       // name?: AXValue;
  //       // /**
  //       //  * The accessible description for this `Node`.
  //       //  */
  //       // description?: AXValue;
  //       // /**
  //       //  * The value for this `Node`.
  //       //  */
  //       // value?: AXValue;
  //       // /**
  //       //  * All other properties
  //       //  */
  //       // properties?: AXProperty[];
  //       // /**
  //       //  * IDs for each of this node's child nodes.
  //       //  */
  //       // childIds?: AXNodeId[];
  //       // /**
  //       //  * The backend ID for the associated DOM node, if any.
  //       //  */
  //       // backendDOMNodeId?: DOM.BackendNodeId;
  //     };
  //   }
}
