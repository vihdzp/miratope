"use strict";

//Coming soon to theaters near you: A polytopeV class
//PolytopeV would represent a polytope as a convex hull
//Or, we could make that into "another" constructor for PolytopeC

//Represents a polytope as a list of elements, in ascending order of dimensions, similar (but not identical) to an OFF file
//We don't only store the facets, because we don't want to deal with O(2^n) code
//Subelements are stored as indices
//All points are assumed to be of the same dimension
function PolytopeC(elementList, constructionRoot) {
	Polytope.call(this, constructionRoot);                          //Calls the Polytope constructor function using PolytopeC as the object and "constructionRoot" as the parameter "construction"
	this.elementList = elementList;
	this.dimensions = elementList.length - 1;                       //The combinatorial dimension (the polytope's dimension)
	if(this.elementList[0])
		this.spaceDimensions = this.elementList[0][0].dimensions(); //The space's dimension
	else
		this.spaceDimensions = -1;                                  //The almighty nullitope (aka nothing)
};

PolytopeC.prototype = new Polytope();

//Calculates the centroid as the average of the vertices.
//Could be made more efficient replacing the add method with direct calculations with arrays.
PolytopeC.prototype.centroid = function() {
	var res = this.elementList[0][0].clone();
	for(var i = 1; i < this.elementList[0].length; i++)
		res.add(this.elementList[0][i]);
	res.divideBy(this.elementList[0].length);
	return res;
};

//Makes every vertex have dim coordinates either by adding zeros or removing numbers.
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

//Converts the edge representation of the i-th face to an ordered array of vertices.
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

//Returns the center of mass of the polytope.
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

//Places the gravicenter of the polytope at the origin.
PolytopeC.prototype.recenter = function() {
	this.moveNeg(this.gravicenter());
};

//Ensures that we can always correctly call toPolytopeC on a polytope.
PolytopeC.prototype.toPolytopeC = function() {
	return this;
}
