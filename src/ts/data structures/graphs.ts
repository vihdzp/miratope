/**
 * A base class for [[https://en.wikipedia.org/wiki/Graph_(discrete_mathematics)
 * |graph]] nodes.
 *
 * @typeParam T The type of the value stored in the node.
 * @category Data structure
 */
class GraphNodeBase<T> {
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
   * Gets the connected component of a node in a graph.
   *
   * @returns The connected component of `this`.
   */
  getComponent(): GraphBase<T> {
    const components: GraphNodeBase<T>[] = [];
    _getComponent(this);

    //Resets the traversed variable in all of the nodes.
    for (let i = 0; i < components.length; i++) components[i].traversed = false;

    return new GraphBase(components);

    //Auxiliary function, actually determines the connected component.
    function _getComponent(node: GraphNodeBase<T>): void {
      components.push(node);
      node.traversed = true;

      for (let i = 0; i < node.neighbors.length; i++)
        if (!node.neighbors[i].traversed) _getComponent(node.neighbors[i]);
    }
  }
}

/**
 * Wrapper for an array of [[GraphNodeBase|`GraphNodeBases`]].
 *
 * @typeParam T The type of the value stored in the graph.
 * @category Data structure
 */
class GraphBase<T> {
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

    for (let i = 0; i < this.nodes.length; i++)
      values.push(this.nodes[i].value);

    return values;
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
    return super.getComponent() as Graph<T>;
  }
}

/**
 * Wrapper for an array of [[GraphNode|`GraphNodes`]].
 *
 * @typeParam T The type of the value stored in the graph.
 * @category Data structure
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

/**
 * Stores a node in a labeled graph.
 *
 * @typeParam T The type of the value stored in the graph.
 * @typeParam U The type of the edge labels.
 * @category Data structures
 */
export class LabeledGraphNode<T, U> extends GraphNodeBase<T> {
  /** The value stored in a node. */
  value: T;

  /** The nodes adjacent to this one in the graph. */
  neighbors: LabeledGraphNode<T, U>[];

  /** Stores whether a node has been traversed, used in some algorithms. */
  traversed: boolean;

  /** The labels of the edges adjacent to this node. */
  labels: U[];

  constructor(value: T) {
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
  linkTo(node: LabeledGraphNode<T, U>, label: U): void {
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
  getComponent(): LabeledGraph<T, U> {
    return super.getComponent() as LabeledGraph<T, U>;
  }
}

/**
 * Wrapper for an array of [[LabeledGraphNode|`LabeledGraphNodes`]].
 *
 * @typeParam T The type of the value stored in the graph.
 * @category Data structure
 */
export class LabeledGraph<T, U> extends GraphBase<T> {
  nodes: LabeledGraphNode<T, U>[];

  /**
   * Constructor for Graph class.
   *
   * @param nodes The nodes of the graph.
   */
  constructor(nodes: LabeledGraphNode<T, U>[]) {
    super(nodes);

    this.nodes = nodes;
  }
}
