export default class GraphNode<T> {
  value: T;
  neighbors: GraphNode<T>[];
  labels: number[];
  traversed: boolean;
  private static components: unknown[];

  //Class for nodes in a graph.
  //Not to be confused with the more common Node.js
  //Also not to be confused for the LinkedListNode class for doubly-linked lists

  constructor(val: T) {
    //The value of a node, can be any object.
    this.value = val;
    //Contains neighboring graph nodes.
    this.neighbors = [];
    //Labels for edges, optional.
    this.labels = [];
    //Used for functions to tell if they have already processed a node
    this.traversed = false;
  }

  //Resets the traversed variable for an array of nodes
  //Should be helpful sometime else.
  clearTraversed(nodes: GraphNode<T>[]): void {
    for (let i = 0; i < nodes.length; i++) nodes[i].traversed = false;
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

  //Gets the values of all nodes that are "attached" is some way
  //Also not meant to be called twice.
  getComponent(): T[] {
    GraphNode.components = [];
    this._getComponent();
    return GraphNode.components as T[];
  }

  //Private function does the hard work of getComponent().
  private _getComponent(): void {
    GraphNode.components.push(this.value);
    this.traversed = true;
    for (let i = 0; i < this.neighbors.length; i++)
      if (!this.neighbors[i].traversed) this.neighbors[i]._getComponent();
  }
}
