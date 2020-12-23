"use strict";
/**
 * @license
 * Copyright Daniel Imms <http://www.growingwiththeweb.com>
 * Modified by the Miratope authors.
 * Released under MIT license. See LICENSE in the project root for details.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvlTree = void 0;
/**
 * Represents how balanced an {@link AvlNode}'s left and right children are.
 * @enum {number}
 * @namespace BalanceState
 */
var BalanceState;
(function (BalanceState) {
    /** Has a height difference of 2 to the right. */
    BalanceState[BalanceState["UNBALANCED_RIGHT"] = -2] = "UNBALANCED_RIGHT";
    /** Has a height difference of 1 to the right. */
    BalanceState[BalanceState["SLIGHTLY_UNBALANCED_RIGHT"] = -1] = "SLIGHTLY_UNBALANCED_RIGHT";
    /** The children are balanced. */
    BalanceState[BalanceState["BALANCED"] = 0] = "BALANCED";
    /** Has a height difference of 1 to the left. */
    BalanceState[BalanceState["SLIGHTLY_UNBALANCED_LEFT"] = 1] = "SLIGHTLY_UNBALANCED_LEFT";
    /** Has a height difference of 2 to the left. */
    BalanceState[BalanceState["UNBALANCED_LEFT"] = 2] = "UNBALANCED_LEFT";
})(BalanceState || (BalanceState = {}));
class AvlTree {
    /**
     * Creates a new AVL Tree.
     * @classdesc
     * Implements the {@link https://en.wikipedia.org/wiki/AVL_tree|AVL Tree data structure}
     * for fast insertion and sorting.
     * @constructor
     * @param {function} [customCompare] An optional custom compare function.
     * Overrides [AVLTree.prototype.compare]{@link AVLTree#compare}, and has to
     * work similarly.
     */
    constructor(customCompare) {
        this._insertedNode = null;
        /** The root of the tree.
         * @private */
        this._root = null;
        /** The size of the tree.
         * @private */
        this._size = 0;
        if (customCompare)
            /** The compare function for the AVL tree. */
            this._compare = customCompare;
    }
    ;
    /**
     * The default compare function. Can be overwritten in the constructor.
     *
     * @private
     * @param {T} a The first key to compare.
     * @param {T} b The second key to compare.
     * @return {number} -1, 0 or 1 depending on whether `a` is smaller, equal or
     * larger than `b`, respectively.
     */
    _compare(a, b) {
        if (a > b)
            return 1;
        if (a < b)
            return -1;
        return 0;
    }
    ;
    /**
     * Inserts a new node with a specific key into the tree.
     *
     * @param {T} key The key being inserted.
     */
    insert(key) {
        this._root = this._insert(key, this._root);
        this._size++;
        return this._insertedNode;
    }
    ;
    /**
     * Inserts a new node with a specific key into the tree.
     *
     * @private
     * @param {T} key The key being inserted.
     * @param {AvlNode<T> | null} root The root of the tree to insert in.
     * @return {AvlNode<T>} The new tree root.
     */
    _insert(key, root) {
        // Perform regular BST insertion
        if (!root) {
            this._insertedNode = new AvlNode(key);
            return this._insertedNode;
        }
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
        var balanceState = AvlTree.getBalanceState(root);
        if (balanceState === BalanceState.UNBALANCED_LEFT) {
            //If the node is unbalanced to the left, it must have a left node.
            if (this._compare(key, root.left.key) < 0) {
                // Left left case
                root = root.rotateRight();
            }
            else {
                // Left right case
                root.linkLeft(root.left.rotateLeft());
                return root.rotateRight();
            }
        }
        if (balanceState === BalanceState.UNBALANCED_RIGHT) {
            //If the node is unbalanced to the right, it must have a right node.
            if (this._compare(key, root.right.key) > 0) {
                // Right right case
                root = root.rotateLeft();
            }
            else {
                // Right left case
                root.linkRight(root.right.rotateRight());
                return root.rotateLeft();
            }
        }
        return root;
    }
    ;
    /**
     * Finds the next node in the tree.
     *
     * @private
     * @param {AvlNode<T>} node The current node in the tree.
     * @return {AvlNode<T> | null} The next node in the tree.
     */
    next(node) {
        if (node.right) {
            node = node.right;
            while (node.left)
                node = node.left;
            return node;
        }
        while (node.parent) {
            if (node.parent.right === node)
                node = node.parent;
            else
                return node.parent;
        }
        return null;
    }
    /**
     * Finds the previous node in the tree.
     *
     * @private
     * @param {AvlNode<T>} node The current node in the tree.
     * @return {AvlNode<T> | null} The previous node in the tree.
     */
    prev(node) {
        if (node.left) {
            node = node.left;
            while (node.right)
                node = node.right;
            return node;
        }
        while (node.parent) {
            if (node.parent.left === node)
                node = node.parent;
            else
                return node.parent;
        }
        return null;
    }
    /**
     * Deletes a node with a specific key from the tree.
     *
     * @param {T} key The key being deleted.
     */
    delete(key) {
        this._root = this._delete(key, this._root);
        this._size--;
    }
    ;
    /**
     * Deletes a node with a specific key from the tree.
     *
     * @private
     * @param {T} key The key being deleted.
     * @param {AvlNode<T>} root The root of the tree to delete from.
     * @return {AvlNode<T>} The new tree root.
     */
    _delete(key, root) {
        // Perform regular BST deletion
        if (!root) {
            this._size++;
            return root;
        }
        var compare = this._compare(key, root.key);
        if (compare < 0) {
            // The key to be deleted is in the left sub-tree
            root.linkLeft(this._delete(key, root.left));
        }
        else if (compare > 0) {
            // The key to be deleted is in the right sub-tree
            root.linkRight(this._delete(key, root.right));
        }
        else {
            // root is the node to be deleted
            if (!root.left) {
                if (!root.right)
                    root = null;
                else {
                    root = root.right;
                    root.parent = null;
                }
            }
            else if (root.left) {
                if (!root.right) {
                    root = root.left;
                    root.parent = null;
                }
                else {
                    // Node has 2 children, get the in-order successor
                    var inOrderSuccessor = AvlTree.minValueNode(root.right);
                    root.key = inOrderSuccessor.key;
                    root.linkRight(this._delete(inOrderSuccessor.key, root.right));
                }
            }
        }
        if (!root)
            return null;
        // Update height and rebalance tree
        root.height = Math.max(root.leftHeight(), root.rightHeight()) + 1;
        var balanceState = AvlTree.getBalanceState(root);
        if (balanceState === BalanceState.UNBALANCED_LEFT) {
            // Left left case
            //If the node is unbalanced to the left, it must have a left node.
            if (AvlTree.getBalanceState(root.left) === BalanceState.BALANCED ||
                AvlTree.getBalanceState(root.left) === BalanceState.SLIGHTLY_UNBALANCED_LEFT) {
                return root.rotateRight();
            }
            // Left right case
            if (AvlTree.getBalanceState(root.left) === BalanceState.SLIGHTLY_UNBALANCED_RIGHT) {
                root.linkLeft(root.left.rotateLeft());
                return root.rotateRight();
            }
        }
        if (balanceState === BalanceState.UNBALANCED_RIGHT) {
            // Right right case
            //If the node is unbalanced to the right, it must have a right node.
            if (AvlTree.getBalanceState(root.right) === BalanceState.BALANCED ||
                AvlTree.getBalanceState(root.right) === BalanceState.SLIGHTLY_UNBALANCED_RIGHT) {
                return root.rotateLeft();
            }
            // Right left case
            if (AvlTree.getBalanceState(root.right) === BalanceState.SLIGHTLY_UNBALANCED_LEFT) {
                root.linkRight(root.right.rotateRight());
                return root.rotateLeft();
            }
        }
        return root;
    }
    ;
    /**
     * Gets the node within the tree with a specific key.
     *
     * @param {T} key The key being searched for.
     * @return {AvlNode<T> | null} The node or null if it doesn't exist.
     */
    getNode(key) {
        if (!this._root)
            return null;
        return this._get(key, this._root);
    }
    ;
    /**
     * Gets a node within the tree with a specific key.
     *
     * @private
     * @param {T} key The key being searched for.
     * @param {AvlNode<T>} root The root of the tree to search in.
     * @return {AvlNode<T> | null} The node or null if it doesn't exist.
     */
    _get(key, root) {
        let result = this._compare(key, root.key);
        if (result === 0)
            return root;
        if (result < 0) {
            if (!root.left)
                return null;
            return this._get(key, root.left);
        }
        if (!root.right)
            return null;
        return this._get(key, root.right);
    }
    ;
    /**
     * Gets whether a node with a specific key is within the tree.
     *
     * @param {T} key The key being searched for.
     * @return {boolean} Whether a node with the key exists.
     */
    contains(key) {
        if (this._root === null)
            return false;
        return !!this._get(key, this._root);
    }
    ;
    /**
     * @return {Object} The minimum key in the tree.
     */
    findMinimum() {
        if (!this._root)
            return null;
        return AvlTree.minValueNode(this._root).key;
    }
    ;
    /**
     * @return {Object} The minimum node in the tree.
     */
    findMinimumNode() {
        if (!this._root)
            return null;
        return AvlTree.minValueNode(this._root);
    }
    ;
    /**
     * Gets the minimum value node, rooted in a particular node.
     *
     * @private
     * @param {AvlNode<T>} root The node to search.
     * @return {AvlNode<T>} The node with the minimum key in the tree.
     */
    static minValueNode(root) {
        let current = root;
        while (current.left)
            current = current.left;
        return current;
    }
    ;
    /**
     * @return {AvlTree<T> | null } The maximum key in the tree.
     */
    findMaximum() {
        if (!this._root)
            return null;
        return AvlTree.maxValueNode(this._root).key;
    }
    ;
    /**
     * @return {AvlNode<T>} The maximum node in the tree.
     */
    findMaximumNode() {
        if (!this._root)
            return null;
        return AvlTree.maxValueNode(this._root);
    }
    ;
    /**
     * Gets the maximum value node, rooted in a particular node.
     *
     * @private
     * @param {AvlNode} root The node to search.
     * @return {AvlNode} The node with the maximum key in the tree.
     */
    static maxValueNode(root) {
        var current = root;
        while (current.right)
            current = current.right;
        return current;
    }
    ;
    /**
     * @return {number} The size of the tree.
     */
    size() {
        return this._size;
    }
    ;
    /**
     * @return {boolean} Whether the tree is empty.
     */
    isEmpty() {
        return this._size === 0;
    }
    ;
    //TO DELETE
    toString() {
        if (this.isEmpty())
            return "";
        let res = "", x = 0;
        let node = this.findMinimumNode();
        while (node !== null && x++ < 100) {
            res += node.key + "\n";
            node = this.next(node);
        }
        return res;
    }
    ;
    //TO DELETE
    checkSorted() {
        if (!this._root)
            return true;
        let node = this.findMinimumNode();
        let next = this.next(node);
        while (next) {
            if (this._compare(node.key, next.key) >= 0 || isNaN(this._compare(node.key, next.key))) {
                console.log(node.key + ", " + next.key + " out of order!");
                return false;
            }
            node = next;
            next = this.next(next);
        }
        return true;
    }
    ;
    /**
     * Gets the balance state of a node, indicating whether the left or right
     * sub-trees are unbalanced.
     * @param {AvlNode} node The node to get the difference from.
     * @return {BalanceState} The BalanceState of the node.
     */
    static getBalanceState(node) {
        return (node.leftHeight() - node.rightHeight());
    }
}
exports.AvlTree = AvlTree;
class AvlNode {
    /**
     * Creates a new AVL Tree node.
     * @constructor
     * @classdesc A node in an [AVL tree]{@link AvlTree}.
     * @param {Object} key The key of the new node.
     */
    constructor(key) {
        this.left = null;
        this.right = null;
        this.parent = null;
        this.height = 0;
        this.key = key;
    }
    ;
    /**
     * Performs a right rotate on this node.
     *```
     *       b                           a
     *      / \                         / \
     *     a   e -> b.rotateRight() -> c   b
     *    / \                             / \
     *   c   d                           d   e
     *```
     * @return {AvlNode} The root of the sub-tree, the node where this node used to be.
     */
    rotateRight() {
        let other = this.left;
        this.linkLeft(other.right);
        other.linkRight(this);
        this.height = Math.max(this.leftHeight(), this.rightHeight()) + 1;
        other.height = Math.max(other.leftHeight(), this.height) + 1;
        return other;
    }
    ;
    /**
     * Performs a left rotate on this node.
     *```
     *     a                              b
     *    / \                            / \
     *   c   b   -> a.rotateLeft() ->   a   e
     *      / \                        / \
     *     d   e                      c   d
     *```
     * @return {AvlNode} The root of the sub-tree, the node where this node used to be.
     */
    rotateLeft() {
        let other = this.right;
        this.linkRight(other.left);
        other.linkLeft(this);
        this.height = Math.max(this.leftHeight(), this.rightHeight()) + 1;
        other.height = Math.max(other.rightHeight(), this.height) + 1;
        return other;
    }
    ;
    /**
     * Convenience function to get the height of the left child of the node,
     * returning -1 if the node is null.
     *
     * @return {number} The height of the left child, or -1 if it doesn't exist.
     */
    leftHeight() {
        if (!this.left)
            return -1;
        return this.left.height;
    }
    ;
    /**
     * Convenience function to get the height of the right child of the node,
     * returning -1 if the node is null.
     *
     * @return {number} The height of the right child, or -1 if it doesn't exist.
     */
    rightHeight() {
        if (!this.right)
            return -1;
        return this.right.height;
    }
    ;
    /**
     * Links a node to the left.
     *
     * @param {AvlNode<T> | null} node The node to be linked.
     */
    linkLeft(node) {
        if (this.left && this.left.parent === this)
            this.left.parent = null;
        this.left = node;
        if (node)
            node.parent = this;
    }
    ;
    /**
     * Links a node to the right.
     *
     * @param {Object} node The node to be linked.
     */
    linkRight(node) {
        if (this.right && this.right.parent === this)
            this.right.parent = null;
        this.right = node;
        if (node)
            node.parent = this;
    }
    ;
}
//# sourceMappingURL=avl-tree.js.map