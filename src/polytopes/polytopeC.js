"use strict";

/**
 * The constructor for the PolytopeC class.
 * @constructor
 * @param {ConstructionNode} construction The constructionNode representing how the polytope was built.
 * @classDesc Represents a polytope as a list of elements, in ascending order of dimensions,
 * similarly (but not identically) to an OFF file.
 * Subelements are stored as indices.
 * All points are assumed to be of the same dimension.
 * @todo Coming soon to theaters near you: A PolytopeV class!
 * PolytopeV would represent a polytope as a convex hull.
 * Or, we could make that into "another" constructor for PolytopeC.
 * We'll probably embed QHull to make that work.
 */
function PolytopeC(elementList, constructionRoot) {
	this.dimensions = elementList.length - 1; //The rank of the polytope.
	if(!constructionRoot) //The construction defaults to just the polytope itself.
	constructionRoot = new ConstructionNode(ConstructionNodeType.Plain,
		[
			elementList[elementList.length - 2].length,
			this.dimensions
		]);
	Polytope.call(this, constructionRoot);
	this.elementList = elementList;
	if(this.elementList[0])
		this.spaceDimensions = this.elementList[0][0].dimensions();
	else
		this.spaceDimensions = -1; //The almighty nullitope (aka nothing)
};

PolytopeC.prototype = Polytope.prototype;

/**
 * Calculates the centroid of a polytope.
 * @returns {Point} The centroid of the polytope.
 */
PolytopeC.prototype.gravicenter = function() {
	var d = this.spaceDimensions,
	res = [],
	i, j;

	for(j = 0; j < d; j++)
		res.push(0);

	for(i = 0; i < this.elementList[0].length; i++)
		for(j = 0; j < d; j++)
			res[j] += this.elementList[0][i].coordinates[j];

	for(j = 0; j < d; j++)
		res[j] /= this.elementList[0].length;

	return new Point(res);
};

/**
 * Makes every vertex have a set number of coordinates either by adding zeros or removing numbers.
 * @param {number} dim The new number of coordinates for each vertex.
 */
PolytopeC.prototype.setSpaceDimensions = function(dim) {
	for(var i = 0; i < this.elementList[0].length; i++) {
		if(this.elementList[0][i].coordinates.length > dim)
			this.elementList[0].coordinates = this.elementList[0].coordinates.slice(0, dim);
		else if(this.elementList[0][i].coordinates.length < dim)
			for(var j = 0; j < dim - this.elementList[0][i].coordinates.length; j++)
				this.elementList[0][i].coordinates.push(0);
	}
	this.spaceDimensions = dim;
};

/**
 * Converts the edge representation of the i-th face to an ordered array of vertices.
 * @param {number} i The selected face.
 * @returns {number[]} An array with the indices of the vertices of the i-th face in order.
 */
PolytopeC.prototype.faceToVertices = function(i) {
	//Enumerates the vertices in order.
	//A doubly linked list does the job easily.
	var vertexDLL = [];
	for(var j = 0; j < this.elementList[2][i].length; j++) {
		var edge = this.elementList[1][this.elementList[2][i][j]];
		if(vertexDLL[edge[0]] === undefined)
			vertexDLL[edge[0]] = new LinkedListNode(edge[0]);
		if(vertexDLL[edge[1]] === undefined)
			vertexDLL[edge[1]] = new LinkedListNode(edge[1]);

		vertexDLL[edge[0]].linkTo(vertexDLL[edge[1]]);
	}

	//Cycle of vertex indices.
	//"this.elementList[1][this.elementList[2][i][0]][0]" is just some vertex index.
	return vertexDLL[this.elementList[1][this.elementList[2][i][0]][0]].getCycle();
};

/**
 * Places the gravicenter of the polytope at the origin.
 * @returns {PolytopeC} The recentered polytope.
 */
PolytopeC.prototype.recenter = function() {
	return this.moveNeg(this.gravicenter());
};

/**
 * Ensures that we can always correctly call toPolytopeC on a polytope.
 * @returns {PolytopeC} The polytope, unchanged.
 */
PolytopeC.prototype.toPolytopeC = function() {
	return this;
};
