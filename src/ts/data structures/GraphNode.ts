/**
 * Stores a node in a
 * [[https://en.wikipedia.org/wiki/Graph_(discrete_mathematics)|graph]].
 *
 * @typeParam T The type of the value stored in the graph.
 * @category Data structures
 */
export default class GraphNode<T> {
  /** The value stored in a node. */
  value: T;

  /** The nodes adjacent to this one in the graph. */
  neighbors: GraphNode<T>[];

  /** The corresponding labels of all of the edges. Optional. */
  labels: number[];

  /** Stores whether a node has been traversed, used in some algorithms. */
  traversed: boolean;

  /** Constructor for GraphNode. */
  constructor(val: T) {
    this.value = val;
    this.neighbors = [];
    this.labels = [];
    this.traversed = false;
  }

  //Connects two nodes with one another, with an optional edge label
  //(if I implemented this correctly) --Cirro
  //Edge label added if specified.
  //Not meant to be called twice.
  //I could check whether the nodes are already connected, but that's costly.
  connectTo(node: GraphNode<T>, name?: number): void {
    this.neighbors.push(node);
    node.neighbors.push(this);

    if (name) {
      this.labels.push(name);
      node.labels.push(name);
    }
  }

  /**
   * Gets the connected component of a node in a graph.
   *
   * @returns The connected component of `this`.
   */
  getComponent(): Graph<T> {
    const components: GraphNode<T>[] = [];
    _getComponent(this);

    //Resets the traversed variable in all of the nodes.
    for (let i = 0; i < components.length; i++) components[i].traversed = false;

    return new Graph(components);

    //Auxiliary function, actually determines the connected component.
    function _getComponent(node: GraphNode<T>): void {
      components.push(node);
      node.traversed = true;

      for (let i = 0; i < node.neighbors.length; i++)
        if (!node.neighbors[i].traversed) _getComponent(node.neighbors[i]);
    }
  }
}

/**
 * Wrapper for an array of [[GraphNode|`GraphNodes`]].
 *
 * @typeParam T The type of the value stored in the graph.
 * @category Data structure
 */
export class Graph<T> {
  nodes: GraphNode<T>[];

  /**
   * Constructor for Graph class.
   *
   * @param nodes The nodes of the graph.
   */
  constructor(nodes: GraphNode<T>[]) {
    this.nodes = nodes;
  }

  /**
   * Gets the values of the graph's nodes.
   *
   * @returns An array with all of the values of the graph's nodes in order.
   */
  values(): T[] {
    const values: T[] = [];

    for (let i = 0; i < this.nodes.length; i++)
      values.push(this.nodes[i].value);

    return values;
  }
}
