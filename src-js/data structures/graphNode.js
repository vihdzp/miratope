"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphNode = void 0;
class GraphNode {
    //Class for nodes in a graph.
    //Not to be confused with the more common Node.js
    //Also not to be confused for the LinkedListNode class for doubly-linked lists
    constructor(val) {
        this.value = val; //The value of a node, can be any object.
        this.neighbors = []; //Contains neighboring graph nodes.
        this.labels = []; //Labels for edges, optional.
        this.traversed = false; //Used for functions to tell if they have already processed a node
    }
    ;
    //Resets the traversed variable for an array of nodes
    //Should be helpful sometime else.
    clearTraversed(nodes) {
        for (var i = 0; i < nodes.length; i++)
            nodes[i].traversed = false;
    }
    ;
    //Connects two nodes with one another, with an optional edge label (if I implemented this correctly)
    //Edge label added if specified.
    //Not meant to be called twice.
    //I could check whether the nodes are already connected, but that's costly.
    connectTo(node, name) {
        this.neighbors.push(node);
        node.neighbors.push(this);
        if (name) {
            this.labels.push(name);
            node.labels.push(name);
        }
    }
    ;
    //Gets the values of all nodes that are "attached" is some way
    //Also not meant to be called twice.
    getComponent() {
        GraphNode._components = [];
        this._getComponent();
        return GraphNode._components;
    }
    ;
    //Private function does the hard work of getComponent().
    _getComponent() {
        GraphNode._components.push(this.value);
        this.traversed = true;
        for (var i = 0; i < this.neighbors.length; i++)
            if (!this.neighbors[i].traversed)
                this.neighbors[i]._getComponent();
    }
    ;
}
exports.GraphNode = GraphNode;
//# sourceMappingURL=graphNode.js.map