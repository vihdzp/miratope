"use strict";

//Class for points in arbitary amounts of dimension, works with number of dimensions or with objects

//Meant for Euclidean space, idk what we can do with hyperbolics
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

//Returns the number of dimensions of the point's space.
Point.prototype.dimensions = function() {
	return this.coordinates.length;
};

//Makes a Point object with the same coordinates.
//Simple shallow copy.
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

//Scales up the point by a factor of "r"
Point.prototype.scale = function(r) {
	for(var i = 0; i < this.dimensions(); i++)
		this.coordinates[i] = this.coordinates[i] * r; //Multiplies each of the coordinates of x by r.
};

//Takes the Cartesian product of two points
Point.product = function(p, q) {
	return new Point(p.coordinates.concat(q.coordinates)); //Simply concatenates the coordinates of both points.
};

//Adds n zeros to the left of the point's coordinates
Point.padLeft = function(point, n) {
	var coordinates = [], i;                      //Set "coordinates" to an empty array, and declare "i".
	for(i = 0; i < n; i++)                        //Adds the required amount of zeros to the left.
		coordinates.push(0);
	for(i = 0; i < point.coordinates.length; i++) //Fills out the rest of the coordinates.
		coordinates.push(point.coordinates[i]);
	return new Point(coordinates);                //Returns the padded set of coordinates.
};

//Adds n zeros to the right of the point's coordinates
Point.padRight = function(point, n) {
	var coordinates = [], i;                      //Set "coordinates" to an empty array, and declare "i".
	for(i = 0; i < point.coordinates.length; i++) //Fills out the coordinates.
		coordinates.push(point.coordinates[i]);
	for(i = 0; i < n; i++)                        //Adds the required amount of zeros to the right.
		coordinates.push(0);
	return new Point(coordinates);                //Returns the padded set of coordinates.
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
