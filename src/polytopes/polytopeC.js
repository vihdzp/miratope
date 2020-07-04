"use strict";

//TBA: A polytopeV class.
//It would represent a polytope as a convex hull.
//Alternatively, we could make that into "another" constructor for PolytopeC.

//Represents a polytope as a list of elements, in ascending order of dimensions, similar to (but not the same as) an OFF file.
//We don't only store the facets, because we don't want to deal with O(2^n) code.
//Subelements stored as indices.
//All points assumed to be of the same dimension.
function PolytopeC(elementList, constructionRoot) {
	Polytope.call(this, constructionRoot);
	this.elementList = elementList;
	this.dimensions = elementList.length - 1; //The combinatorial dimension.
	if(this.elementList[0])
		this.spaceDimensions = this.elementList[0][0].dimensions(); //The space's dimension.
	else
		this.spaceDimensions = -1; //Nullitope.
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
			vertexDLL[edge[0]] = new DLLNode(edge[0]);
		if(vertexDLL[edge[1]] === undefined)
			vertexDLL[edge[1]] = new DLLNode(edge[1]);
		
		vertexDLL[edge[0]].linkTo(vertexDLL[edge[1]]);				
	}			
	
	//Cycle of vertex indices.
	//"this.elementList[1][this.elementList[2][i][0]][0]" is just some vertex index.
	return vertexDLL[this.elementList[1][this.elementList[2][i][0]][0]].getCycle();
};

//Ensures that we can always correctly call toPolytopeC on a polytope.
PolytopeC.prototype.toPolytopeC = function() {
	return this;
}