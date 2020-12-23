"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkedListNode = void 0;
//A node, for usage in a doubly linked list
//Each LinkedListNode is linked to two other nodes: linkage should be reflexive.
//LinkedListNodes don't *necessarily* have a notion of a "previous" and a "next" node.
//But when they do, node0 is the next node, and node1 is the previous.
class LinkedListNode {
    constructor(value) {
        this.value = value;
        this.traversed = false;
        this.id = LinkedListNode.idCounter++;
    }
    ;
    linkTo(node) {
        //Links this to node.
        if (!this.node0)
            this.node0 = node;
        else if (!this.node1)
            this.node1 = node;
        else
            throw new Error("A LinkedListNode can only be linked to two other nodes!");
        //Links node to this.
        if (!node.node0)
            node.node0 = this;
        else if (!node.node1)
            node.node1 = this;
        else
            throw new Error("A LinkedListNode can only be linked to two other nodes!");
    }
    ;
    linkToNext(node) {
        this.node0 = node;
        node.node1 = this;
    }
    ;
    linkToPrev(node) {
        this.node1 = node;
        node.node0 = this;
    }
    ;
    //Traverses all nodes, while avoiding backtracking.
    getCycle() {
        let cycle = [this.value];
        if (!this.node0)
            return cycle;
        let node = this.node0;
        this.traversed = true;
        while (node && !node.traversed) {
            node.traversed = true;
            cycle.push(node.value);
            if (node.node1 && node.node1.traversed)
                node = node.node0;
            else
                node = node.node1;
        }
        return cycle;
    }
    ;
    //Traverses all nodes quicker than getCycle, assuming that node0 is always the "next" node.
    getOrderedCycle() {
        let cycle = [this.value];
        if (!this.node0)
            return cycle;
        let node = this.node0;
        this.traversed = true;
        while (node && !node.traversed) {
            node.traversed = true;
            cycle.push(node.value);
            node = node.node0;
        }
        return cycle;
    }
    ;
    getNode(i) {
        if (i === 0)
            return this.node0;
        return this.node1;
    }
    ;
}
exports.LinkedListNode = LinkedListNode;
//Represents the number of existing nodes.
//Used to distinguish between identical elements consistently.
LinkedListNode.idCounter = 0;
//# sourceMappingURL=linkedListNode.js.map