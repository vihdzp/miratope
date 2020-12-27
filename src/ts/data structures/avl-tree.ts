/**
 * @license
 * Copyright Daniel Imms <http://www.growingwiththeweb.com>
 * Modified by the Miratope authors.
 * Released under MIT license. See LICENSE in the project root for details.
 */

/**
 * Represents how balanced an [[`AvlNode`]]'s left and right children are.
 */
enum BalanceState {
  /** Has a height difference of 2 to the right. */
  UNBALANCED_RIGHT = -2,
  /** Has a height difference of 1 to the right. */
  SLIGHTLY_UNBALANCED_RIGHT = -1,
  /** The children are balanced. */
  BALANCED = 0,
  /** Has a height difference of 1 to the left. */
  SLIGHTLY_UNBALANCED_LEFT = 1,
  /** Has a height difference of 2 to the left. */
  UNBALANCED_LEFT = 2,
}

/**
 * Implements the
 * [[https://en.wikipedia.org/wiki/AVL_tree|AVL Tree data structure]]
 * for fast insertion and sorting.
 */
export default class AvlTree<T> {
  /** The root of the AVL tree. */
  private _root: AvlNode<T> | null;
  /** The element count of the AVL tree. */
  private _size: number;
  /** Temporary variable for [[`insert`]]. Stores the new inserted node. */
  private _insertedNode: AvlNode<T> | null;

  /**
   * Class constructor.
   *
   * @param customCompare An optional custom compare function.
   * Overrides [[`_compare`]], and has to work similarly.
   */
  constructor(customCompare: ((a: T, b: T) => number) | null) {
    this._root = null;
    this._size = 0;
    this._insertedNode = null;

    if (customCompare) this._compare = customCompare;
  }

  /**
   * The default compare function. Can be overwritten in the [[`constructor`]].
   *
   * @param a The first key to compare.
   * @param b The second key to compare.
   * @return -1, 0 or 1 depending on whether `a` is smaller, equal or larger
   * than `b`, respectively.
   */
  private _compare(a: T, b: T): number {
    if (a > b) return 1;
    if (a < b) return -1;
    return 0;
  }

  /**
   * Inserts a new node with a specific key into the tree.
   *
   * @param key The key being inserted.
   * @return The inserted node.
   */
  insert(key: T): AvlNode<T> {
    this._root = this._insert(key, this._root);
    this._size++;
    if (!this._insertedNode) throw new Error("AVL insertion failed!");
    return this._insertedNode;
  }

  /**
   * Inserts a new node with a specific key into the tree.
   *
   * @param key The key being inserted.
   * @param root The root of the tree to insert in.
   * @return The new tree root.
   */
  private _insert(key: T, root: AvlNode<T> | null): AvlNode<T> {
    // Perform regular BST insertion
    if (!root) return (this._insertedNode = new AvlNode(key));

    if (this._compare(key, root.key) < 0)
      root.linkLeft(this._insert(key, root.left));
    else if (this._compare(key, root.key) > 0)
      root.linkRight(this._insert(key, root.right));
    else {
      // It's a duplicate so insertion failed, decrement size to make up for it
      this._size--;
      return root;
    }

    // Update height and rebalance tree
    root.height = Math.max(root.leftHeight(), root.rightHeight()) + 1;
    const balanceState = AvlTree.getBalanceState(root);

    if (balanceState === BalanceState.UNBALANCED_LEFT && root.left) {
      //If the node is unbalanced to the left, it must have a left node.
      if (this._compare(key, root.left.key) < 0) {
        // Left left case
        root = root.rotateRight();
      } else {
        // Left right case
        root.linkLeft(root.left.rotateLeft());
        return root.rotateRight();
      }
    }

    if (balanceState === BalanceState.UNBALANCED_RIGHT && root.right) {
      //If the node is unbalanced to the right, it must have a right node.
      if (this._compare(key, root.right.key) > 0) {
        // Right right case
        root = root.rotateLeft();
      } else {
        // Right left case
        root.linkRight(root.right.rotateRight());
        return root.rotateLeft();
      }
    }

    return root;
  }

  /**
   * Finds the next node in the tree.
   *
   * @param node The current node in the tree.
   * @return The next node in the tree.
   */
  next(node: AvlNode<T>): AvlNode<T> | null {
    if (node.right) {
      node = node.right;
      while (node.left) node = node.left;
      return node;
    }

    while (node.parent) {
      if (node.parent.right === node) node = node.parent;
      else return node.parent;
    }
    return null;
  }

  /**
   * Finds the previous node in the tree.
   *
   * @param node The current node in the tree.
   * @return The previous node in the tree.
   */
  prev(node: AvlNode<T>): AvlNode<T> | null {
    if (node.left) {
      node = node.left;
      while (node.right) node = node.right;
      return node;
    }

    while (node.parent) {
      if (node.parent.left === node) node = node.parent;
      else return node.parent;
    }
    return null;
  }

  /**
   * Deletes a node with a specific key from the tree.
   *
   * @param key The key being deleted.
   */
  delete(key: T): void {
    this._root = this._delete(key, this._root);
    this._size--;
  }

  /**
   * Deletes a node with a specific key from the tree.
   *
   * @param key The key being deleted.
   * @param root The root of the tree to delete from.
   * @return The new tree root.
   */
  private _delete(key: T, root: AvlNode<T> | null): AvlNode<T> | null {
    // Perform regular BST deletion
    if (!root) {
      this._size++;
      return root;
    }

    const compare = this._compare(key, root.key);
    if (compare < 0) {
      // The key to be deleted is in the left sub-tree
      root.linkLeft(this._delete(key, root.left));
    } else if (compare > 0) {
      // The key to be deleted is in the right sub-tree
      root.linkRight(this._delete(key, root.right));
    } else {
      // root is the node to be deleted
      if (!root.left) {
        if (!root.right) root = null;
        else {
          root = root.right;
          root.parent = null;
        }
      } else if (root.left) {
        if (!root.right) {
          root = root.left;
          root.parent = null;
        } else {
          // Node has 2 children, get the in-order successor
          const inOrderSuccessor = AvlTree._minValueNode(root.right);
          root.key = inOrderSuccessor.key;
          root.linkRight(this._delete(inOrderSuccessor.key, root.right));
        }
      }
    }

    if (!root) return null;

    // Update height and rebalance tree
    root.height = Math.max(root.leftHeight(), root.rightHeight()) + 1;
    const balanceState = AvlTree.getBalanceState(root);

    if (balanceState === BalanceState.UNBALANCED_LEFT && root.left) {
      // Left left case
      //If the node is unbalanced to the left, it must have a left node.
      if (
        AvlTree.getBalanceState(root.left) === BalanceState.BALANCED ||
        AvlTree.getBalanceState(root.left) ===
          BalanceState.SLIGHTLY_UNBALANCED_LEFT
      )
        return root.rotateRight();

      // Left right case
      if (
        AvlTree.getBalanceState(root.left) ===
        BalanceState.SLIGHTLY_UNBALANCED_RIGHT
      ) {
        root.linkLeft(root.left.rotateLeft());
        return root.rotateRight();
      }
    }

    if (balanceState === BalanceState.UNBALANCED_RIGHT && root.right) {
      // Right right case
      //If the node is unbalanced to the right, it must have a right node.
      if (
        AvlTree.getBalanceState(root.right) === BalanceState.BALANCED ||
        AvlTree.getBalanceState(root.right) ===
          BalanceState.SLIGHTLY_UNBALANCED_RIGHT
      )
        return root.rotateLeft();

      // Right left case
      if (
        AvlTree.getBalanceState(root.right) ===
        BalanceState.SLIGHTLY_UNBALANCED_LEFT
      ) {
        root.linkRight(root.right.rotateRight());
        return root.rotateLeft();
      }
    }

    return root;
  }

  /**
   * Gets the node within the tree with a specific key.
   *
   * @param key The key being searched for.
   * @return The node or null if it doesn't exist.
   */
  getNode(key: T): AvlNode<T> | null {
    if (!this._root) return null;

    return this._get(key, this._root);
  }

  /**
   * Gets a node within the tree with a specific key.
   *
   * @param key The key being searched for.
   * @param root The root of the tree to search in.
   * @return The node or null if it doesn't exist.
   */
  private _get(key: T, root: AvlNode<T>): AvlNode<T> | null {
    const result = this._compare(key, root.key);

    if (result === 0) return root;

    if (result < 0) {
      if (!root.left) return null;
      return this._get(key, root.left);
    }

    if (!root.right) return null;
    return this._get(key, root.right);
  }

  /**
   * Gets whether a node with a specific key is within the tree.
   *
   * @param key The key being searched for.
   * @return Whether a node with the key exists.
   */
  contains(key: T): boolean {
    if (this._root === null) return false;
    return !!this._get(key, this._root);
  }

  /**
   * @return The minimum key in the tree.
   */
  findMinimum(): T | null {
    const min = this.findMinimumNode();
    return min ? min.key : null;
  }

  /**
   * @return The minimum node in the tree.
   */
  findMinimumNode(): AvlNode<T> | null {
    if (!this._root) return null;
    return AvlTree._minValueNode(this._root);
  }

  /**
   * Gets the minimum value node, rooted in a particular node.
   *
   * @param root The node to search.
   * @return The node with the minimum key in the tree.
   */
  private static _minValueNode<T>(root: AvlNode<T>): AvlNode<T> {
    let current = root;
    while (current.left) current = current.left;
    return current;
  }

  /**
   * @return The maximum key in the tree.
   */
  findMaximum(): T | null {
    const max = this.findMaximumNode();
    return max ? max.key : null;
  }

  /**
   * @return The maximum node in the tree.
   */
  findMaximumNode(): AvlNode<T> | null {
    if (!this._root) return null;
    return AvlTree._maxValueNode(this._root);
  }

  /**
   * Gets the maximum value node, rooted in a particular node.
   *
   * @param root The node to search.
   * @return The node with the maximum key in the tree.
   */
  private static _maxValueNode<T>(root: AvlNode<T>): AvlNode<T> {
    let current = root;
    while (current.right) current = current.right;
    return current;
  }

  /**
   * @return The size of the tree.
   */
  size(): number {
    return this._size;
  }

  /**
   * @return Whether the tree is empty.
   */
  isEmpty(): boolean {
    return this._size === 0;
  }

  /**
   * Converts the AVL tree into a string.
   * Debug function, will be deleted.
   *
   * @internal
   * @return The AVL tree as a string.
   */
  toString(): string {
    if (this.isEmpty()) return "";
    let res = "",
      x = 0;
    let node = this.findMinimumNode();
    while (node && x++ < 100) {
      res += node.key + "\n";
      node = this.next(node);
    }
    return res;
  }

  /**
   * Checks whether the AVL tree is sorted.
   * If the code worked correctly, it would always return `true`.
   * Debug function, will be deleted.
   *
   * @internal
   * @return Whether the tree is sorted or not.
   */
  checkSorted(): boolean {
    if (!this._root) return true;
    let node = this.findMinimumNode() as AvlNode<T>;
    let next = this.next(node);

    while (next) {
      if (!(this._compare(node.key, next.key) < 0)) {
        console.log(node.key + ", " + next.key + " out of order!");
        return false;
      }
      node = next;
      next = this.next(next);
    }

    return true;
  }

  /**
   * Gets the balance state of a node, indicating whether the left or right
   * sub-trees are unbalanced.
   *
   * @param node The node to get the difference from.
   * @return The BalanceState of the node.
   */
  static getBalanceState<T>(node: AvlNode<T>): BalanceState {
    return (node.leftHeight() - node.rightHeight()) as BalanceState;
  }
}

/**
 * A node in an [[`AvlTree`]].
 */
class AvlNode<T> {
  /** The left child of the node. */
  left: AvlNode<T> | null;
  /** The right child of the node. */
  right: AvlNode<T> | null;
  /** The parent of the node. */
  parent: AvlNode<T> | null;
  /** The height of the node in the tree. */
  height: number;
  /**
   * The node's identifier, used both to store a value and to compare it with
   * others.
   */
  key: T;

  /**
   * Class constructor.
   *
   * @param key The [[`key`]] of the node.
   */
  constructor(key: T) {
    this.left = null;
    this.right = null;
    this.parent = null;
    this.height = 0;
    this.key = key;
  }

  /**
   * Performs a right rotate on this node.
   *```Markdown
   *        b                           a
   *       / \                         / \
   *      a   e -> b.rotateRight() -> c   b
   *     / \                             / \
   *    c   d                           d   e
   *```
   *
   * @return The root of the sub-tree, the node where this node used to be.
   */
  rotateRight(): AvlNode<T> {
    const other = this.left as AvlNode<T>;
    this.linkLeft(other.right);
    other.linkRight(this);
    this.height = Math.max(this.leftHeight(), this.rightHeight()) + 1;
    other.height = Math.max(other.leftHeight(), this.height) + 1;
    return other;
  }

  /**
   * Performs a left rotate on this node.
   *```Markdown
   *      a                           b
   *     / \                         / \
   *    c   b  -> a.rotateLeft() -> a   e
   *       / \                         / \
   *      d   e                       c   d
   *```
   *
   * @return The root of the sub-tree, the node where this node used
   * to be.
   */
  rotateLeft(): AvlNode<T> {
    const other = this.right as AvlNode<T>;
    this.linkRight(other.left);
    other.linkLeft(this);
    this.height = Math.max(this.leftHeight(), this.rightHeight()) + 1;
    other.height = Math.max(other.rightHeight(), this.height) + 1;
    return other;
  }

  /**
   * Convenience function to get the height of the left child of the node,
   * returning -1 if the node is null.
   *
   * @return The height of the left child, or -1 if it doesn't exist.
   */
  leftHeight(): number {
    if (!this.left) return -1;
    return this.left.height;
  }

  /**
   * Convenience function to get the height of the right child of the node,
   * returning -1 if the node is null.
   *
   * @return The height of the right child, or -1 if it doesn't exist.
   */
  rightHeight(): number {
    if (!this.right) return -1;
    return this.right.height;
  }

  /**
   * Links a node to the left.
   *
   * @param {AvlNode<T> | null} node The node to be linked.
   */
  linkLeft(node: AvlNode<T> | null): void {
    if (this.left && this.left.parent === this) this.left.parent = null;
    this.left = node;
    if (node) node.parent = this;
  }

  /**
   * Links a node to the right.
   *
   * @param node The node to be linked.
   */
  linkRight(node: AvlNode<T> | null): void {
    if (this.right && this.right.parent === this) this.right.parent = null;
    this.right = node;
    if (node) node.parent = this;
  }
}
