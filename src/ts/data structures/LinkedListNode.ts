/**
 * A node, for usage in a (doubly) linked list. Each LinkedListNode is linked to
 * two other nodes: linkage should be reflexive. LinkedListNodes don't
 * *necessarily* have a notion of a "previous" and a "next" node. But when they
 * do, [[`node0`]] is the next node, and [[`node1`]] is the previous.
 */
export default class LinkedListNode<T> {
  value: T;
  private node0: LinkedListNode<T> | undefined;
  private node1: LinkedListNode<T> | undefined;
  traversed: boolean;
  private id: number;
  //Represents the number of existing nodes.
  //Used to distinguish between identical elements consistently.
  private static idCounter = 0;

  constructor(value: T) {
    this.value = value;
    this.traversed = false;
    this.id = LinkedListNode.idCounter++;
  }

  linkTo(node: LinkedListNode<T>): void {
    //Links this to node.
    if (!this.node0) this.node0 = node;
    else if (!this.node1) this.node1 = node;
    else
      throw new Error(
        "A LinkedListNode can only be linked to two other nodes!"
      );

    //Links node to this.
    if (!node.node0) node.node0 = this;
    else if (!node.node1) node.node1 = this;
    else
      throw new Error(
        "A LinkedListNode can only be linked to two other nodes!"
      );
  }

  linkToNext(node: LinkedListNode<T>): void {
    this.node0 = node;
    node.node1 = this;
  }

  linkToPrev(node: LinkedListNode<T>): void {
    this.node1 = node;
    node.node0 = this;
  }

  //Traverses all nodes, while avoiding backtracking.
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

  //Traverses all nodes quicker than getCycle, assuming that node0 is always the
  //"next" node.
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

  /** Retrieves the LinkedListNode's [[`id` | ID]]. */
  getId(): number {
    return this.id;
  }
}
