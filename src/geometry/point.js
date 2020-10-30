"use strict";

/**
 * Creates a new Point.
 * @constructor
 * @classdesc
 * A class for points in arbitary dimensions.
 * Meant for Euclidean space, though hyperbolic space may be eventually
 * implemented.
 * @param {(number[]|number)} x The coordinates of the point, or its number of
 * dimensions.
 */
function Point(x) {
	//Constructor from the number of dimensions "x", initializes a point at the origin of R^x
	if(typeof(x) === "number") {
		this.coordinates = [];
		for(var i = 0; i < x; i++)
			this.coordinates[i] = 0;
	}
	//Constructor from the coordinates
	else if(typeof(x) === "object") //Otherwise, if "x" is an object (more precisely, an array),
		this.coordinates = x;       //Set Point.coordinates to "x"
};

/**
 * Returns the number of dimensions of the point's space.
 * @returns {number} The number of coordinates of the point.
 */
Point.prototype.dimensions = function() {
	return this.coordinates.length;
};

/**
 * Clones a Point object. Uses a simple shallow copy.
 * @returns {Point} A new Point object with the same coordinates as `this`.
 */
Point.prototype.clone = function() {
	var coordinates = [];
	for(var i = 0; i < this.coordinates.length; i++)
		coordinates.push(this.coordinates[i]);
	return new Point(coordinates);
};

//Projects the point into 3D
//For now, just the simplest orthographic projection possible.
Point.prototype.project = function() {
	return Point.padRight(this, 3 - this.coordinates.length);
};

//Adds the coordinates of "x" to the coordinates of a point.
//Both need to have the same amount of dimensions.
Point.prototype.add = function(x) {
	if(x.dimensions() !== this.dimensions()) //The points need to have the same number of coordinates.
		throw new Error("You can't add points with different amounts of dimensions!");
	var coordinates = [];
	for(var i = 0; i < x.dimensions(); i++) //Add the respective coordinates.
		this.coordinates[i] += x.coordinates[i];
	return this;
};

//Substracts the coordinates of "x" from the coordinates of a point.
//Both need to have the same amount of dimensions.
Point.prototype.subtract = function(x) {
	if(x.dimensions() !== this.dimensions()) //The points need to have the same number of coordinates.
		throw new Error("You can't add points with different amounts of dimensions!");
	var coordinates = [];
	for(var i = 0; i < x.dimensions(); i++) //Add the respective coordinates.
		this.coordinates[i] -= x.coordinates[i];
	return this;
};

/**
 * Scales up a point by a factor of `r`.
 * Simple scalar multiplication.
 * @param {number} r The scaling factor.
 */
Point.prototype.scale = function(r) {
	for(var i = 0; i < this.dimensions(); i++)
		this.coordinates[i] = this.coordinates[i] * r; //Multiplies each of the coordinates of x by r.
};

/**
 * Takes the Cartesian product of two points.
 * Simply concatenates the coordinates of both points.
 * @param {Point} P The first point to multiply.
 * @param {Point} Q The second point to multiply.
 * @returns {Point} The product of both points.
 */
 Point.product = function(P, Q) {
	return new Point(P.coordinates.concat(Q.coordinates)); //Simply concatenates the coordinates of both points.
};

//Adds n zeros to the left of the point's coordinates
Point.padLeft = function(P, n) {
	var coordinates = [], i;
	for(i = 0; i < n; i++)
		coordinates.push(0);
	for(i = 0; i < P.coordinates.length; i++)
		coordinates.push(P.coordinates[i]);
	return new Point(coordinates);
};

//Adds n zeros to the right of the point's coordinates
Point.padRight = function(P, n) {
	var coordinates = [], i;
	for(i = 0; i < P.coordinates.length; i++)
		coordinates.push(P.coordinates[i]);
	for(i = 0; i < n; i++)
		coordinates.push(0);
	return new Point(coordinates);
};

//Adds the given coordinate at the end of the coordinate list
Point.prototype.addCoordinate = function(coord) {
	this.coordinates.push(coord);
	return this;
};

//Converts to the Vector3 class used by three.js
//Meant only for 3D points.
//Simply copies the coordinates over.
Point.prototype.toVector3 = function() {
	return new THREE.Vector3([this.coordinates[0], this.coordinates[1], this.coordinates[2]]);
};

//Checks if two points are equal, to a predetermined precision
//Simply checks whether the respective coordinates are "similar enough" by floating point standards.
Point.equal = function(a, b) {
	for(var i = 0; i < a.coordinates.length; i++) {
		if(Math.abs(a.coordinates[i] - b.coordinates[i]) > Math.abs(a.coordinates[i] * epsilon))
			return false;
	}
	return true;
};

//Returns the distance of a point to the origin.
Point.prototype.magnitude = function() {
	var res = 0;
	for(var i = 0; i < this.coordinates.length; i++) {
		var t = this.coordinates[i];
		res += t * t;
	}
	return Math.sqrt(res);
};

//TODO: work on this, make it its own class
//This will eventually become a JS port of OFFBuilder.

//Calculates the specified permutations of a point in a given format
//The string needs to start with the coordinates of the point in parentheses, separated by commas
//These are followed by permutation and sign "modifiers", such as allPerms(0, 1) for all permutations of the first and second coordinates,
//or evenSignChanges(all) for even sign changes in all coordinates
Point.calculatePermutations = function(pcoords) {
	throw new Error("Not yet implemented!");
	pcoords = pcoords.replace(" ", "");            //Removes all spaces from input
	var coords = [];                         //Coordinates of point
	var c = 1;                               //Caret (pointer) for reading the pcoords – skips first character (assumed to be a left parenthesis)
	var leftP = 0, rightP = 0;               //Counts parentheses, to detect when the point ends.

	var coord = "";                          //A single coordinate, not to be confused with "coords"
	while(rightP <= leftP) {         //While "rightP" is less than or equal to "leftP"
		switch(pcoords[c]) {
			case "(":                //Increment leftP count when "("
				leftP++;
				break;
			case ")":                //Increment rightP count when "("
				rightP++;
				break;
			case ",":		   		 //In this case it's the end of a coordinate
				coords.push(coord);  //Add "coord" to the array and reset the coord
				coord = "";
				break
			default:                 //In this case it's the start of a new coordinate
				coord += pcoords[c]; //Add the character at the caret to "coord"
				break;
		}
		c++; //Increment caret
	}
};
