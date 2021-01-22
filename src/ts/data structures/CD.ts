import { LabeledGraph, LabeledGraphNode } from "./graphs";

/** Maximum length allowed for a CD. */
const MAX_LEN = 100;

/** Matches a positive integer. */
const numberRegex = /([1-9][0-9]*)/;

/** Matches a valid fraction. */
const fractionRegex = new RegExp("(" + numberRegex + "\\/" + numberRegex + ")");

/** Auxiliary regex for [[`nodeLabels`]]. */
const nodeLabels_ = new RegExp(
  "([a-zA-Zß]|" + fractionRegex + "|" + numberRegex + ")"
);

/** Matches a valid node label. */
const nodeLabels = new RegExp(nodeLabels_ + "|\\(-?" + nodeLabels_ + "\\)");

/** Auxiliary regex for [[`edgeLabels`]]. */
const edgeLabels_ = new RegExp(
  "(" + fractionRegex + "|" + numberRegex + "|[a-zA-Z]|∞)'?|Ø|\\.\\.\\.+"
);

/** Matches a valid edge label. */
const edgeLabels = new RegExp(
  "(" + edgeLabels_ + ")|\\((" + edgeLabels_ + ")\\)"
);

/** Matches a valid letter virtual node. */
const virtualNodesLetter = /\*-?[a-z]/;

/** Matches a valid number virtual node. */
const virtualNodesNumber = new RegExp(
  "\\*-?[1-9]|\\*\\(-?" + numberRegex + "\\)"
);

/**
 * Represents a [[https://en.wikipedia.org/wiki/Coxeter–Dynkin_diagram|Coxeter
 * Diagram]], and contains the necessary methods to parse it.
 *
 * @category Data structure
 */
export default class CD {
  /** A textual representation of the diagram. Uses
   * [[https://bendwavy.org/klitzing/explain/dynkin-notation.htm|
   * Richard Klitzing's notation.]] */
  diagram: string;

  /** The position at which the [[`diagram`]] is being read. */
  index: number;

  /**
   * Constructor for the CD class.
   *
   * @param diagram The CD diagram in text form.
   */
  constructor(diagram: string) {
    this.diagram = diagram;
    this.index = 0;
  }

  /**
   * Tries to match a regex at the current point in the string. If it succeeds,
   * the [[`index`]] is left at the end of the regex.
   *
   * @param regex The regex to match.
   * @returns The matched string if successful, `null` otherwise.
   */
  matchRegex(regex: RegExp): string | null {
    const match = regex.exec(this.diagram.substr(this.index));

    if (match === null || match.index != 0) return null;

    this.index += match[0].length - 1;
    return match[0];
  }

  /**
   * Reads a node from the CD.
   *
   * @returns Either the next node label, or the empty string if the [[`index`]]
   * isn't just before a valid node label.
   */
  readNode(): string {
    return this.matchRegex(nodeLabels) || "";
  }

  /**
   * Reads a number from the CD.
   *
   * @returns Either the next edge number, or the empty string if the
   * [[`index`]] isn't just before a valid edge number.
   */
  readNumber(): string {
    return this.matchRegex(edgeLabels) || "";
  }

  /**
   * Reads a virtual node from the CD.
   *
   * @param letterType Whether the virtual node to be read is a letter or a
   * number.
   * @returns The read virtual node, or `null` if the [[`index`]] isn't just
   * before a valid virtual node.
   */
  readVirtualNode(letterType: boolean): string | null {
    if (letterType) return this.matchRegex(virtualNodesLetter);
    else return this.matchRegex(virtualNodesNumber);
  }

  /**
   * Converts a textual Coxeter Diagram to a graph.
   *
   * @returns The CD as a labeled graph.
   */
  toGraph(): LabeledGraph<string, string> {
    this.index = 0;
    const cd = this.diagram;

    //The nodes in the final graph.
    const nodes: LabeledGraphNode<string, string>[] = [];

    //The node pairs to link in the final graph.
    const edges: EdgeRef[] = [];

    //The previously read node.
    let prevNodeRef: NodeRef | null = null;

    //Most recently read edge label.
    let edgeLabel = "";

    //Are we reading a node (or an edge)?
    let readingNode = true;

    //Are we about to link nodes?
    let linkNodes = false;

    //The new node to add.
    let newNodeRef: NodeRef | null = null;

    //Reads through the diagram.
    while (this.index < cd.length) {
      switch (cd[this.index]) {
        //Skips spaces.
        case " ":
          if (readingNode)
            throw new Error("Expected node label, got space instead.");

          readingNode = true;
          edgeLabel = "";

          break;

        //Skips hyphens in the middle of the string.
        case "-":
          break;

        //Reads virtual node.
        case "*":
          if (!readingNode)
            throw new Error("Expected edge label, got virtual node instead.");

          //The index of the node this virtual node refers to.
          let nodeIndex: number;

          //Tries to read the virtual node as a letter virtual node.
          let virtualNode = this.readVirtualNode(true);
          if (virtualNode !== null) {
            //Hyphen.
            if (virtualNode[1] == "-")
              nodeIndex = 97 - virtualNode.charCodeAt(2) - 1;
            else nodeIndex = virtualNode.charCodeAt(1) - 97;
          }

          //Tries to read the virtual node as a number virtual node.
          else {
            virtualNode = this.readVirtualNode(false);
            //If the node couldn't be read either way.
            if (virtualNode === null) throw new Error("Invalid virtual node.");

            //Parentheses
            if (virtualNode[1] === "(")
              virtualNode = virtualNode.substr(2, virtualNode.length - 3);
            else virtualNode = virtualNode.substr(1);

            //Indexing starts at one.
            nodeIndex = Number(virtualNode) - 1;
          }

          newNodeRef = new NodeRef(nodeIndex, this.index);
          linkNodes = true;
          break;

        //Does lacing stuff.
        case "&":
          throw new Error("Laces not yet supported.");

        default:
          //Node values.
          if (readingNode) {
            const index = this.index;
            let newNodeLabel = this.readNode();

            if (newNodeLabel === "") throw new Error("Invalid node symbol.");

            //Removes parentheses.
            if (newNodeLabel[0] === "(")
              newNodeLabel = newNodeLabel.substr(1, newNodeLabel.length - 2);

            if (nodes.length > MAX_LEN) throw new Error("Diagram too big.");

            newNodeRef = new NodeRef(nodes.length, index);
            nodes.push(new LabeledGraphNode(newNodeLabel));

            //Toggles the flag to link stuff.
            linkNodes = true;
          }

          //Edge values.
          else {
            let edgeLabel = this.readNumber();

            if (edgeLabel === "") throw new Error("Invalid edge symbol.");

            if (edgeLabel[0] === "(")
              edgeLabel = edgeLabel.substr(1, edgeLabel.length - 2);

            readingNode = true;
          }

          //Links two nodes if necessary.
          if (linkNodes) {
            if (!(prevNodeRef === null || edgeLabel === ""))
              edges.push(new EdgeRef(newNodeRef, prevNodeRef, edgeLabel));

            //Updates variables.
            linkNodes = false;
            prevNodeRef = newNodeRef;
            edgeLabel = "";
            readingNode = false;
          }

          this.index++;
          break;
      }
    }

    //Throws an error if the CD ends in an edge label.
    if (readingNode)
      throw new Error("Node label expected, got string end instead.");

    //Links corresponding nodes.
    for (let i = 0; i < edges.length; i++) {
      const edge = edges[i];

      //Checks if nodes in range.
      for (let i = 0; i <= 1; i++) {
        //Configures where the error will appear.
        this.index = edge[i].pos;

        const index = edge[i].index;
        if (index >= nodes.length || index < -nodes.length)
          throw new Error("Virtual node out of range.");
      }

      //Attempts to link each pair.
      const node0 = edge.get(0),
        node1 = edge.get(1);
      if (!(node0 && node1)) throw new Error("Invalid edge.");

      const pos0 = node0.pos,
        pos1 = node1.pos;

      this.index = Math.max(pos0, pos1);

      nodes[pos0].linkTo(nodes[pos1], edge.label);
    }

    //Returns the graph.
    return new LabeledGraph(nodes);
  }
}

/**
 * Auxiliary class for [[`CD.toGraph`]]. Stores the index of a node and its
 * position in the diagram, though not the node's value itself.
 *
 * @category Data structure
 */
class NodeRef {
  /** The index of a node in the diagram. */
  index: number;

  /** The position of a node in the diagram. */
  pos: number;

  /**
   * Constructor for `NodeRef` class.
   *
   * @param index The index of a node in the diagram.
   * @param pos The position of a node in the diagram.
   */
  constructor(index: number, pos: number) {
    this.index = index;
    this.pos = pos;
  }
}

/**
 * Stores the indexes of an edge's nodes and its label.
 *
 * @category Data structure
 */
class EdgeRef {
  index0: NodeRef | null;
  index1: NodeRef | null;
  label: string;

  constructor(index0: NodeRef | null, index1: NodeRef | null, label: string) {
    this.index0 = index0;
    this.index1 = index1;
    this.label = label;
  }

  get(key: 0 | 1): NodeRef | null {
    return this["index" + key];
  }
}
