/**
 * A node, for usage in a (doubly) linked list. Each `LinkedListNode` is linked
 * to two other nodes: linkage should be reflexive.
 *
 * `LinkedListNodes` don't *necessarily* have a notion of a "previous" and a
 * "next" node. But when these are required, by convention, [[`node0`]] is the
 * next node, and [[`node1`]] is the previous.
 *
 * @typeParam T The type of the value stored in the node.
 * @category Data structures
 */
export default class LinkedListNode<T> {
  /** A value stored in the node. */
  value: T;

  /** One of the nodes adjacent to `this`. When the graph has a given direction,
   * this is taken to be the "next" node. */
  private node0: LinkedListNode<T> | undefined;

  /** One of the nodes adjacent to `this`. When the graph has a given direction,
   * this is taken to be the "previous" node. */
  private node1: LinkedListNode<T> | undefined;

  /** Whether the node has been traversed. Useful for certain algorithms. */
  traversed: boolean;

  /** A unique, immutable identifier for the node. */
  private ID: number;

  /** Represents the number of existing nodes. Used to distinguish between
   * identical elements consistently. */
  private static idCounter = 0;

  /**
   * Constructor for `LinkedListNode`.
   *
   * @param value The value stored in the node.
   */
  constructor(value: T) {
    this.value = value;
    this.traversed = false;
    this.ID = LinkedListNode.idCounter++;
  }

  /**
   * Links two nodes together.
   *
   * @param node The node to be linked with `this`.
   */
  linkTo(node: LinkedListNode<T>): void {
    // Links this to node.
    this._linkTo(node);

    // Links node to this.
    node._linkTo(this);
  }

  /**
   * Links one node to another, in a single direction. Should only ever be
   * called during [[`linkTo`]].
   *
   * @param node The node to be linked with `this`.
   */
  private _linkTo(node: LinkedListNode<T>): void {
    if (!this.node0) this.node0 = node;
    else if (!this.node1) this.node1 = node;
    else {
      throw new Error(
        "A LinkedListNode can only be linked to two other nodes!"
      );
    }
  }

  linkToNext(node: LinkedListNode<T>): void {
    this.node0 = node;
    node.node1 = this;
  }

  linkToPrev(node: LinkedListNode<T>): void {
    this.node1 = node;
    node.node0 = this;
  }

  // Traverses all nodes, while avoiding backtracking.
  getCycle(): T[] {
    const cycle = [this.value];
    if (!this.node0) return cycle;
    let node: LinkedListNode<T> | undefined = this.node0;
    this.traversed = true;

    while (node && !node.traversed) {
      node.traversed = true;
      cycle.push(node.value);
      if (node.node1 && node.node1.traversed) node = node.node0;
      else node = node.node1;
    }

    return cycle;
  }

  // Traverses all nodes quicker than getCycle, assuming that node0 is always the
  // "next" node.
  getOrderedCycle(): T[] {
    const cycle = [this.value];
    if (!this.node0) return cycle;
    let node: LinkedListNode<T> | undefined = this.node0;
    this.traversed = true;

    while (node && !node.traversed) {
      node.traversed = true;
      cycle.push(node.value);
      node = node.node0;
    }

    return cycle;
  }

  getNode(i: number): LinkedListNode<T> | undefined {
    return i === 0 ? this.node0 : this.node1;
  }

  /**
   * Retrieves the node's [[`ID`]].
   *
   * @returns The node's ID.
   */
  getId(): number {
    return this.ID;
  }
}
