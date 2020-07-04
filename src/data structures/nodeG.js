"use strict";

//Class for nodes in a graph.
//Not to be confused by the more common Node.js.
//Also not to be confused for the NodeD class for doubly-linked lists.

function NodeG(val) {
	this.value = val;
	this.neighbors = [];
	this.traversed = false;
};

//Connects two nodes with one another.
//Not meant to be called twice.
//I could check whether the nodes are already connected, but that's costly.
NodeG.prototype.connectTo = function(node) {
	this.neighbors.push(node);
	node.neighbors.push(this);
};

//Gets the values of the nodes in the same component.
//Also not meant to be called twice, as it ignores traversed nodes.
NodeG.prototype.getComponent = function() {
	Node.components = [];
	if(!this.traversed) {
		this._getComponent();
		return Node.components;
	}
};

NodeG.prototype._getComponent = function() {
	Node.components.push(this.value);
	this.traversed = true;
	for(var i = 0; i < this.neighbors.length; i++)
		if(!this.neighbors[i].traversed)
			this.neighbors[i]._getComponent();
}