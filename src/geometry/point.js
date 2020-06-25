"use strict";

//Class for points in any amount of dimensions.
//Meant for Euclidean space, idk what we can do with hyperbolics.
function Point(x) {
	//Constructor from the number of dimensions, initializes in the origin.
	if(typeof(x) === "number") {
		this.coordinates = [];
		for(var i = 0; i < x; i++) 
			this.coordinates[i] = 0;
	}
			
	//Constructor from the coordinates.
	else if(typeof(x) === "object") 
		this.coordinates = x;
};
	
//Returns the number of dimensions of the point's space.
Point.prototype.dimensions = function() {
	return this.coordinates.length;
};
	
//Makes a Point object with the same base attributes.
Point.prototype.clone = function() {
	var coordinates = [];
	for(var i = 0; i < this.coordinates.length; i++)
		coordinates.push(this.coordinates[i]);
	return new Point(coordinates);
};
	
//Projects the point into 3D.
//For now, just the simplest orthographic projection possible.
Point.prototype.project = function() {
	return [this.coordinates[0] === undefined ? 0 : this.coordinates[0],
	this.coordinates[1] === undefined ? 0 : this.coordinates[1],
	this.coordinates[2] === undefined ? 0 : this.coordinates[2]];
};
	
//Adds the coordinates of x to the coordinates of y.
//Both need to have the same amount of dimensions.
Point.add = function(x, y) {
	if(x.dimensions() !== y.dimensions())
		throw new Error("You can't add points with different amounts of dimensions!");
	var coordinates = [];
	for(var i = 0; i < x.dimensions(); i++)
		coordinates[i] = x.coordinates[i] + y.coordinates[i];
	return new Point(coordinates);
};
	
//Subtracts the coordinates of y from the coordinates of x.
//Both need to have the same amount of dimensions.
Point.subtract = function(x, y) {
	if(x.dimensions() !== y.dimensions())
		throw new Error("You can't add points with different amounts of dimensions!");
	var coordinates = [];
	for(var i = 0; i < x.dimensions(); i++)
		coordinates[i] = x.coordinates[i] - y.coordinates[i];
	return new Point(coordinates);
};
	
//Scales up the point x by a factor of t.
Point.multiplyBy = function(x, t) {
	var coordinates = [];
	for(var i = 0; i < x.dimensions(); i++)
		coordinates[i] = x.coordinates[i] * t;
	return new Point(coordinates);
};
	
//Scales up the point x by a factor of 1/t.
Point.divideBy = function(x, t) {
	var coordinates = [];
	for(var i = 0; i < x.dimensions(); i++)
		coordinates[i] = x.coordinates[i] / t;
	return new Point(coordinates);
};
	
Point.product = function(p, q) {
	var coordinates = [], i;
	for(i = 0; i < p.coordinates.length; i++)
		coordinates.push(p.coordinates[i]);
	for(i = 0; i < q.coordinates.length; i++)
		coordinates.push(q.coordinates[i]);
	return new Point(coordinates);
};
	
//Converts to the Vector3 class used by three.js.
//Meant only for 3D points.
Point.prototype.toVector3 = function() {
	return new THREE.Vector3([this.coordinates[0], this.coordinates[1], this.coordinates[2]]);
};
	
//Checks if two points are equal, to a predetermined precision.
Point.equal = function(a, b) {
	var eps = 0.0000001;
	for(var i = 0; i < a.coordinates.length; i++) {
		if(Math.abs(a.coordinates[i] - b.coordinates[i]) > Math.abs(a.coordinates[i] * eps))
			return false;
	}
	
	return true;
};
	
//Calculates the specified permutations of a point in a given format.
//The string needs to start with the coordinates of the point in parentheses, separated by commas.
//These are followed by permutation and sign "modifiers", such as allPerms(0, 1) for all permutations of the first and second coordinates,
//or evenSignChanges(all) for even sign changes in all coordinates.
Point.calculatePermutations = function(line) {
	throw new Error("Not yet implemented!");
	line = line.replace(" ", "");
	var coords = []; //Coordinates of point.
	var c = 1; //Caret for reading the line – skips first character (assumed to be a left parenthesis)
	var leftP = 0, rightP = 0; //Counts parentheses, to detect when the point ends.
	
	var coord = ""; //A single coordinate
	while(rightP <= leftP) {
		switch(line[c]) {
			case "(":
				leftP++;
				break;
			case ")":
				rightP++;
				break;
			case ",":				
				coords.push(coord);
				coord = "";
				break;
			default:
				coord += line[c];
				break;
		}
		c++;
	}
};