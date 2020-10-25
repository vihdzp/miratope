"use strict";

//Class for nodes in a graph.
//Not to be confused with the more common Node.js
//Also not to be confused for the LinkedListNode class for doubly-linked lists

function GraphNode(val) {
	this.value = val; //Can be a number, a label, whatever
	this.neighbors = []; //Contains neighboring graph nodes with optional labels (Format: [[neighborA, labelA], [neighborB, labelB], [neighborC, labelC], [neighborD, labelD]])
	this.traversed = false; //Used for functions to tell if they have already processed a node
};

//Resets the traversed variable for an array of nodes
//Should be helpful sometime else
GraphNode.clearTraversed = function(nodes) {
	for(i = 0, i < nodes.length; i++)
		nodes[i].traversed = false
}

//Connects two nodes with one another, with an optional edge label (if I implemented this correctly)
//Edge label defaults to "" if left undefined
//Not meant to be called twice.
//I could check whether the nodes are already connected, but that's costly.
GraphNode.prototype.connectTo = function(node, name = "") {
	this.neighbors.push([node, name]);
	node.neighbors.push([this, name]);
};

//Gets the values of all nodes that are "attached" is some way
//Also not meant to be called twice, as it ignores traversed nodes.
GraphNode.prototype.getComponent = function() {
	Node.components = [];
	if(!this.traversed) {
		this._getComponent();
		return Node.components;
	}
};

//Private function does the hard work
GraphNode.prototype._getComponent = function() {
	Node.components.push(this.value);
	this.traversed = true;
	for(var i = 0; i < this.neighbors.length; i++)
		if(!this.neighbors[i][0].traversed)
			this.neighbors[i][0]._getComponent();
}
