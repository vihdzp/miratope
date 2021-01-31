import { GraphBase, GraphNodeBase } from "./graphs";
import * as MathJS from "mathjs";

/** Maximum length allowed for a CD. */
const MAX_LEN = 100;

/** Matches a positive integer. */
const numberRegex = /([1-9][0-9]*)/;

/** Matches a valid fraction. */
const fractionRegex = new RegExp(
  "(" + numberRegex.source + "\\/" + numberRegex.source + ")"
);

/** Auxiliary regex for [[`nodeLabels`]]. */
const nodeLabels_ = new RegExp(
  "([a-zA-Zß]|" + fractionRegex.source + "|" + numberRegex.source + ")"
);

/** Matches a valid node label. */
const nodeLabels = new RegExp(
  nodeLabels_.source + "|\\(-?" + nodeLabels_.source + "\\)"
);

/** Auxiliary regex for [[`edgeLabels`]]. */
const edgeLabels_ = new RegExp(
  "((" +
    fractionRegex.source +
    "|" +
    numberRegex.source +
    "|[a-zA-Z]|∞)'?|Ø|\\.\\.\\.+)"
);

/** Matches a valid edge label. */
const edgeLabels = new RegExp(
  edgeLabels_.source + "|\\(" + edgeLabels_.source + "\\)"
);

/** Matches a valid letter virtual node. */
const virtualNodesLetter = /\*-?[a-z]/;

/** Matches a valid number virtual node. */
const virtualNodesNumber = new RegExp(
  "\\*-?[1-9]|\\*\\(-?" + numberRegex.source + "\\)"
);

/**
 * Represents a [[https://en.wikipedia.org/wiki/Coxeter–Dynkin_diagram|Coxeter
 * Diagram]], and contains the necessary methods to parse it.
 *
 * @category Data structures
 */
export default class CD {
  /** A textual representation of the diagram. Uses
   * [[https://bendwavy.org/klitzing/explain/dynkin-notation.htm|
   * Richard Klitzing's notation.]] */
  diagram: string;

  /** The position at which the [[`diagram`]] is being read. */
  pos: number;

  graph: CDGraph;

  /**
   * Constructor for the CD class.
   *
   * @param diagram The CD diagram in text form.
   */
  constructor(diagram: string) {
    this.diagram = diagram;
    this.pos = 0;
    this.graph = this.toGraph();
  }

  /**
   * Tries to match a regex at the current point in the string. If it succeeds,
   * the [[`index`]] is left at the end of the regex.
   *
   * @param regex The regex to match.
   * @returns The matched string if successful, `null` otherwise.
   */
  matchRegex(regex: RegExp): string | null {
    const match = regex.exec(this.diagram.substr(this.pos));

    if (match === null || match.index != 0) return null;

    this.pos += match[0].length - 1;
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
  private toGraph(): CDGraph {
    this.pos = 0;
    const cd = this.diagram;

    // The nodes in the final graph.
    const nodes: CDNode[] = [];

    // The node pairs to link in the final graph.
    const edges: EdgeRef[] = [];

    // The previously read node.
    let prevNodeRef: NodeRef | null = null;

    // Most recently read edge label.
    let edgeLabel = "";

    // Are we reading a node (or an edge)?
    let readingNode = true;

    // Are we about to link nodes?
    let linkNodes = false;

    // The new node to add.
    let newNodeRef: NodeRef | null = null;

    // Reads through the diagram.
    while (this.pos < cd.length) {
      switch (cd[this.pos]) {
        // Skips spaces.
        case " ":
          if (readingNode)
            throw new Error("Expected node label, got space instead.");

          readingNode = true;
          edgeLabel = "";

          break;

        // Skips hyphens in the middle of the string.
        case "-":
          break;

        // Reads virtual node.
        case "*":
          if (!readingNode)
            throw new Error("Expected edge label, got virtual node instead.");

          // The index of the node this virtual node refers to.
          let nodeIndex: number;

          // Tries to read the virtual node as a letter virtual node.
          let virtualNode = this.readVirtualNode(true);
          if (virtualNode !== null) {
            // Hyphen.
            if (virtualNode[1] == "-")
              nodeIndex = 97 - virtualNode.charCodeAt(2) - 1;
            else nodeIndex = virtualNode.charCodeAt(1) - 97;
          }

          // Tries to read the virtual node as a number virtual node.
          else {
            virtualNode = this.readVirtualNode(false);
            // If the node couldn't be read either way.
            if (virtualNode === null) throw new Error("Invalid virtual node.");

            // Parentheses
            if (virtualNode[1] === "(")
              virtualNode = virtualNode.substr(2, virtualNode.length - 3);
            else virtualNode = virtualNode.substr(1);

            // Indexing starts at one.
            nodeIndex = Number(virtualNode) - 1;
          }

          newNodeRef = new NodeRef(nodeIndex, this.pos);
          linkNodes = true;
          break;

        // Does lacing stuff.
        case "&":
          throw new Error("Laces not yet supported.");

        default:
          // Node values.
          if (readingNode) {
            const index = this.pos;
            let newNodeLabel = this.readNode();

            if (newNodeLabel === "") throw new Error("Invalid node symbol.");

            // Removes parentheses.
            if (newNodeLabel[0] === "(")
              newNodeLabel = newNodeLabel.substr(1, newNodeLabel.length - 2);

            if (nodes.length > MAX_LEN) throw new Error("Diagram too big.");

            newNodeRef = new NodeRef(nodes.length, index);
            nodes.push(new CDNode(newNodeLabel));

            // Toggles the flag to link stuff.
            linkNodes = true;
          }

          // Edge values.
          else {
            edgeLabel = this.readNumber();

            if (edgeLabel === "") throw new Error("Invalid edge symbol.");

            if (edgeLabel[0] === "(")
              edgeLabel = edgeLabel.substr(1, edgeLabel.length - 2);

            readingNode = true;
          }

          break;
      }

      // Links two nodes if necessary.
      if (linkNodes) {
        if (newNodeRef && !(prevNodeRef === null || edgeLabel === ""))
          edges.push(new EdgeRef(newNodeRef, prevNodeRef, edgeLabel));

        // Updates variables.
        linkNodes = false;
        prevNodeRef = newNodeRef;
        edgeLabel = "";
        readingNode = false;
      }

      this.pos++;
    }

    // Throws an error if the CD ends in an edge label.
    if (readingNode)
      throw new Error("Node label expected, got string end instead.");

    // Links corresponding nodes.
    for (let i = 0; i < edges.length; i++) {
      const edge = edges[i];

      // Checks if nodes in range.
      for (let j = 0; j <= 1; j++) {
        const vertex = edge.get(j);

        // Configures where the error will appear.
        this.pos = vertex.pos;

        const index = vertex.index;
        if (index >= nodes.length || index < -nodes.length)
          throw new Error("Virtual node out of range.");
      }

      // Attempts to link each pair.
      const node0 = edge.get(0);
      const node1 = edge.get(1);
      if (!(node0 && node1)) throw new Error("Invalid edge.");

      const index0 = node0.index;
      const index1 = node1.index;

      this.pos = Math.max(node0.pos, node1.pos);

      nodes[index0].linkTo(nodes[index1], edge.label);
    }

    // Returns the graph.
    return new CDGraph(nodes);
  }

  schlaflian(): MathJS.Matrix {
    return this.graph.schlaflian();
  }

  circumradius(): number {
    return this.graph.circumradius();
  }
}

/**
 * Stores a node in a Coxeter Diagram.
 */
export class CDNode extends GraphNodeBase<string> {
  /** The value stored in a node. */
  value: string;

  /** The nodes adjacent to this one in the graph. */
  neighbors: CDNode[];

  /** Stores whether a node has been traversed, used in some algorithms. */
  traversed: boolean;

  /** The labels of the edges adjacent to this node. */
  labels: string[];

  /** The index of the node in the corresponding graph. */
  arrayIndex: number | undefined;

  constructor(value: string) {
    super(value);

    this.value = value;
    this.neighbors = [];
    this.traversed = false;
    this.labels = [];
  }

  /**
   * Connects one edge to another. Not meant to be called twice.
   *
   * @param node The node to link `this` to.
   */
  linkTo(node: CDNode, label: string): void {
    this.neighbors.push(node);
    node.neighbors.push(this);

    this.labels.push(label);
    node.labels.push(label);
  }

  /**
   * Gets the connected component of a node in a graph.
   *
   * @returns The connected component of `this`.
   */
  getComponent(reset = true): CDGraph {
    return new CDGraph(this._getComponent(reset) as CDNode[]);
  }

  /** Stores all of the possible node labels and their corresponding values. */
  private static dictionary = {
    o: 0,
    x: 1,
    q: Math.SQRT2,
    f: (1 + Math.sqrt(5)) / 2,
    v: (Math.sqrt(5) - 1) / 2,
    h: Math.sqrt(3),
    k: Math.sqrt(2 + Math.sqrt(2)),
    u: 2,
    w: 1 + Math.sqrt(2),
    F: (3 + Math.sqrt(5)) / 2,
  };

  /**
   * Parses the node's value as a distance from a mirror.
   *
   * @returns The distance corresponding to the node.
   */
  parseNode(): number {
    const node = CDNode.dictionary[this.value];

    if (node !== undefined) return node;
    else
      throw new Error(
        "Node label " + this.value + " could not be recognized as a value."
      );
  }

  /**
   * Gets the numeric value of a given label.
   *
   * @param index The index of the label.
   * @returns The label as a number.
   */
  parseLabel(index: number): number {
    const labelStr = this.labels[index];
    let label: number;

    if (labelStr === "∞") return Infinity;

    const slash = labelStr.indexOf("/");

    // If the label is a single number.
    if (slash === -1) label = Number(labelStr);
    // If the label is a fraction.
    else
      label =
        Number(labelStr.substr(0, slash)) / Number(labelStr.substr(slash + 1));

    if (!isNaN(label)) return label;
    else
      throw new Error(
        "Edge label " + labelStr + " could not be recognized as a value."
      );
  }
}

/**
 * Wrapper for an array of [[CDNode|`CDNodes`]]. An instance of this class is
 * returned by the [[`CD.toGraph`]] method.
 *
 * @category Data structures
 */
export class CDGraph extends GraphBase<string> {
  nodes: CDNode[];

  /**
   * Constructor for Graph class.
   *
   * @param nodes The nodes of the graph.
   */
  constructor(nodes: CDNode[]) {
    super(nodes);

    this.nodes = nodes;

    // Sets the arrayIndex attribute in each node.
    for (let i = 0; i < nodes.length; i++) nodes[i].arrayIndex = i;
  }

  /**
   * Gets the Schläfli matrix of a Coxeter diagram. Each entry (i, j) is
   * proportional to the cosine of the angle between the i-th and j-th mirrors.
   *
   * @returns The Schläfli matrix of the CD.
   */
  schlaflian(): MathJS.Matrix {
    // Basic variables.
    const n = this.size(),
      matrix: number[][] = [];

    // Caches the values for –2cos(π / x).
    const cosines = [NaN, 2, 0, -1, -Math.SQRT2];

    // For every node in the graph:
    for (let i = 0; i < n; i++) {
      matrix.push(new Array(n).fill(0));

      const node = this.nodes[i],
        neighbors = node.neighbors;

      matrix[i][i] = 2;

      //For every neighbor:
      for (let j = 0; j < neighbors.length; j++) {
        const neighbor = neighbors[j],
          label = node.parseLabel(j);

        if (label === null)
          throw new Error("Ø not permitted in circumradius computation.");

        if (neighbor.arrayIndex === undefined)
          throw new Error("Node not declared correctly.");

        // Fills in the matrix entries.
        matrix[i][neighbor.arrayIndex] = cos(label);
      }
    }

    return MathJS.matrix(matrix);

    // Computes –2cos(π / x), relying on the cache for efficiency.
    function cos(x: number): number {
      if (cosines[x] === undefined) cosines[x] = -2 * Math.cos(Math.PI / x);
      return cosines[x];
    }
  }

  /**
   * Calculates the circumradius of the polytope corresponding to the Coxeter
   * Diagram. Can be slow for larger diagrams, so its better to use
   * [[`circumradius`]].
   *
   * @returns The circumradius of the polytope corresponding to the CD.
   */
  private _circumradius(): number {
    const rings: number[] = [];
    let allZero = true;

    // Creates the vector of distances of the point to the mirrors.
    for (let i = 0; i < this.size(); i++) {
      const val = this.nodes[i].parseNode();
      rings.push(val);

      if (val != 0) allZero = false;
    }

    // If all of the distances are zero, the circumradius is zero.
    if (allZero) return 0;

    // Does the actual calculation. Formula found by Wendy Krieger.
    const ringVector = MathJS.transpose(MathJS.matrix([rings]));
    try {
      const stott = MathJS.inv(this.schlaflian());

      return Math.sqrt(
        MathJS.multiply(
          MathJS.transpose(MathJS.multiply(stott, ringVector)),
          ringVector
        ).get([0, 0]) / 2
      );
    } catch (Error) {
      // If the matrix is non-invertible, the circumradius is infinite.
      return Infinity;
    }
  }

  /**
   * Calculates the circumradius of the polytope corresponding to the Coxeter
   * Diagram. Separates the diagram into connected components before calling
   * [[`_circumradius`]] on each component and combining the results.
   *
   * @returns The circumradius of the polytope corresponding to the CD.
   */
  circumradius(): number {
    let res = 0;
    const components = this.getComponents();

    for (let i = 0; i < components.length; i++) {
      const R = components[i]._circumradius();

      // If any of the components' circumradii is Infinity, don't even bother
      // computing the rest.
      if (R === Infinity) return Infinity;

      res += R ** 2;
    }

    res = Math.sqrt(res);
    return isNaN(res) ? Infinity : res;
  }

  getComponents(): CDGraph[] {
    return super.getComponents() as CDGraph[];
  }
}

/**
 * Auxiliary class for [[`CD.toGraph`]]. Stores the index of a node and its
 * position in the diagram, though not the node itself. This way, nodes that
 * come later in the diagram can be referenced even if they haven't been defined
 * yet.
 *
 * @category Data structures
 */
class NodeRef {
  /** The index of a node in the diagram. */
  index: number;

  /** The position of a node in the diagram. */
  pos: number;

  /**
   * Constructor for the `NodeRef` class.
   *
   * @param index The index of a node in the diagram.
   * @param pos The position of a node in the diagram string.
   */
  constructor(index: number, pos: number) {
    this.index = index;
    this.pos = pos;
  }
}

/**
 * Stores the indexes of an edge's nodes and its label.
 *
 * @category Data structures
 */
class EdgeRef {
  index0: NodeRef;
  index1: NodeRef;
  label: string;

  /**
   * Constructor for the `EdgeRef` class.
   *
   * @param index0 The index of the first vertex of the edge in the diagram.
   * @param index1 The index of the second vertex of the edge in the diagram.
   * @param label The label of the edge in the diagram.
   */
  constructor(index0: NodeRef, index1: NodeRef, label: string) {
    this.index0 = index0;
    this.index1 = index1;
    this.label = label;
  }

  /**
   * Gets either of the vertices of the edge by their key.
   *
   * @returns `index0` or `index1`, depending on the value of `key`.
   */
  get(key: number): NodeRef {
    if (key === 0) return this.index0;
    else if (key === 1) return this.index1;
    else throw new Error("Invalid key on EdgeRef.");
  }
}
