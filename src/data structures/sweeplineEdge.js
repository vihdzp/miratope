"use strict";

/**
 * Constructor for SweeplineEdge.
 * @constructor
 * @classdesc
 * Helper class for [Polytope.prototype.renderTo]{@link Polytope#renderTo}, used in the sweep line
 * for Bentley-Ottmann. This format is useful because an edge on the sweep line
 * can only be cut to the right. That way, we don't need to modify the SL objects
 * after the division process:only the nodes' connections change.<br />
 * &emsp;The constructor precomputes the slope and gives each edge a unique,
 * immutable ID. These two properties permit consistent ordering of collinear
 * or otherwise identical edges.
 * @param {Point} leftVertex The leftmost vertex of the edge.
 * @param {number} rightVertexIndex The index of the rightmost vertex of the edge,
 * relative to `leftVertex`.
 */
function SweeplineEdge(leftVertex, rightVertexIndex) {
	this.leftVertex = leftVertex;
	this.rightVertexIndex = rightVertexIndex;
	var rightVertex = this.rightVertex();

	//Calculates the slope.
	//This won't change even if the edge gets cut down to zero length, thus making the ordering consistent.
	this.slope = (leftVertex.value.coordinates[window.index1] - rightVertex.value.coordinates[window.index1])
	/ (leftVertex.value.coordinates[window.index0] - rightVertex.value.coordinates[window.index0]);

	//Gives the edge an immutable ID in terms of its vertices.
	//Uses the redirect table (read below).
	var x = leftVertex.id;
	var y = rightVertex.id;
	var newID = (x + y) * (x + y + 1) / 2 + y;
	this.id = (SweeplineEdge.redirectTable[newID] === undefined ? newID : SweeplineEdge.redirectTable[newID]);
};

/**
 * The rightmost vertex of the edge, as determined by `this.rightVertexIndex`.
 * @returns {Point} The rightmost vertex of the edge.
 */
SweeplineEdge.prototype.rightVertex = function() {
	return this.leftVertex.getNode(this.rightVertexIndex);
};

/**
 * An edge's ID must be immutable, even if the vertices themselves change, so
 * that sorting can occur consistently. At the same time, it needs to be
 * uniquely identified from the vertices, so searches can be made. To be able to
 * do both things simultaneously, we use a "redirect table". If the leftmost
 * vertex of an edge changes, we "redirect" the new calculated ID to the old
 * one.<br />&emsp;The redirect table is filled out as necesary by the
 * [SweeplineEdge.prototype.updateRedirectTable]{@link SweeplineEdge#updateRedirectTable} function.
 */
SweeplineEdge.redirectTable = [];

/**
 * Updates the {@link SweeplineEdge.redirectTable|redirect table} so that the
 * ID of the edge remains consisten even if the `leftVertex` changes.
 */
SweeplineEdge.prototype.updateRedirectTable = function() {
	var x = this.leftVertex.id;
	var y = this.rightVertex().id;
	var newID = (x + y) * (x + y + 1) / 2 + y;
	SweeplineEdge.redirectTable[newID] = this.id;
};

//TO DELETE
//Used for debugging purposes
SweeplineEdge.prototype.toString = function(){
	return "([" + this.leftVertex.value.coordinates.toString() +"], ["+this.rightVertex().value.coordinates.toString()+"])";
};
