/**
 * A base class for [[https://en.wikipedia.org/wiki/Graph_(discrete_mathematics)
 * |graph]] nodes.
 *
 * @typeParam T The type of the value stored in the node.
 * @category Data structures
 */
export class GraphNodeBase<T> {
  /** The value stored in a node. */
  value: T;

  /** The nodes adjacent to this one in the graph. */
  neighbors: GraphNodeBase<T>[];

  /** Stores whether a node has been traversed, used in some algorithms. */
  traversed: boolean;

  /**
   * Constructor for `GraphNodeBase`.
   *
   * @param value The value of the node.
   */
  constructor(value: T) {
    this.value = value;
    this.neighbors = [];
    this.traversed = false;
  }

  /**
   * Gets the connected component of a node in a graph. When called from a child
   * class, the return type of this function will always match whatever the type
   * of [[`neighbors`]] is.
   *
   * This function shouldn't be called directly: use [[`getComponent`]] instead.
   *
   * @returns The connected component of `this`.
   */
  _getComponent(): GraphNodeBase<T>[] {
    const components: GraphNodeBase<T>[] = [];
    DFS(this);

    return components;

    // Auxiliary function, actually determines the connected component by
    // performing a DFS.
    function DFS(node: GraphNodeBase<T>): void {
      components.push(node);
      node.traversed = true;

      for (let i = 0; i < node.neighbors.length; i++)
        if (!node.neighbors[i].traversed) DFS(node.neighbors[i]);
    }
  }

  /**
   * Gets the connected component of a node in a graph. When inherited, this
   * method should have the return type of the associated graph class.
   *
   * @returns The connected component of `this`.
   */
  getComponent(): GraphBase<T> {
    return new GraphBase(this._getComponent());
  }
}

/**
 * Wrapper for an array of [[GraphNodeBase|`GraphNodeBases`]].
 *
 * @typeParam T The type of the value stored in the graph.
 * @category Data structures
 */
export class GraphBase<T> {
  nodes: GraphNodeBase<T>[];

  /**
   * Constructor for `Graph` class.
   *
   * @param nodes The nodes of the graph.
   */
  constructor(nodes: GraphNodeBase<T>[]) {
    this.nodes = nodes;
  }

  /**
   * Gets the values of the graph's nodes.
   *
   * @returns An array with all of the values of the graph's nodes in order.
   */
  values(): T[] {
    const values: T[] = [];

    for (let i = 0; i < this.nodes.length; i++) {
      values.push(this.nodes[i].value);
    }

    return values;
  }

  /**
   * Returns the number of nodes in the graph.
   *
   * @returns The size of the graph.
   */
  size(): number {
    return this.nodes.length;
  }

  /**
   * Gets the connected components of the graph.
   *
   * @returns An array with all of the connected components of the graph.
   */
  getComponents(): GraphBase<T>[] {
    const components: GraphBase<T>[] = [];
    const size = this.size();

    // Puts the connected components in an array.
    for (let i = 0; i < size; i++) {
      const node = this.nodes[i];
      if (!node.traversed) components.push(node.getComponent());
    }

    // Resets visited attribute.
    for (let i = 0; i < size; i++) this.nodes[i].traversed = false;

    return components;
  }
}

/**
 * Stores a node in a graph.
 *
 * @typeParam T The type of the value stored in the graph.
 * @category Data structures
 */
export class GraphNode<T> extends GraphNodeBase<T> {
  /** The value stored in a node. */
  value: T;

  /** The nodes adjacent to this one in the graph. */
  neighbors: GraphNode<T>[];

  /** Stores whether a node has been traversed, used in some algorithms. */
  traversed: boolean;

  /** Constructor for GraphNode. */
  constructor(value: T) {
    super(value);

    this.value = value;
    this.neighbors = [];
    this.traversed = false;
  }

  /**
   * Connects one edge to another. Not meant to be called twice.
   *
   * @param node The node to link `this` to.
   */
  linkTo(node: GraphNode<T>): void {
    this.neighbors.push(node);
    node.neighbors.push(this);
  }

  /**
   * Gets the connected component of a node in a graph.
   *
   * @returns The connected component of `this`.
   */
  getComponent(): Graph<T> {
    return new Graph(this._getComponent() as GraphNode<T>[]);
  }
}

/**
 * Wrapper for an array of [[GraphNode|`GraphNodes`]].
 *
 * @typeParam T The type of the value stored in the graph.
 * @category Data structures
 */
export class Graph<T> extends GraphBase<T> {
  nodes: GraphNode<T>[];

  /**
   * Constructor for Graph class.
   *
   * @param nodes The nodes of the graph.
   */
  constructor(nodes: GraphNode<T>[]) {
    super(nodes);

    this.nodes = nodes;
  }
}
