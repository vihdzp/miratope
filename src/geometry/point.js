"use strict";

//Class for points in arbitary amounts of dimension, works with number of dimensions or with objects
//Meant for Euclidean space, idk what we can do with hyperbolics
function Point(x) {
	//Constructor from the number of dimensions "x", initializes in the origin
	if(typeof(x) === "number") {     //If "x" is a number,
		this.coordinates = [];       //Set Point.coordinates to an empty array
		for(var i = 0; i < x; i++)   //For every whole number "i" less than "x"
			this.coordinates[i] = 0; //Set the "i"th element in Point.coordinates to 0
			                         //Example: if "x" is 3, Point.coordinates will be [0,0,0]
	}
	//Constructor from the coordinates
	else if(typeof(x) === "object") { //Otherwise, if "x" is an object (more precisely, an array),
		this.coordinates = x;        //Set Point.coordinates to "x"
	}
};
	
//Returns the number of dimensions of the point's space
Point.prototype.dimensions = function() {
	return this.coordinates.length; //Set Point.dimensions to the length of Point.coordinates
};
	
//Makes a Point object with the same base attributes
Point.prototype.clone = function() {
	var coordinates = [];                            //Set "coordinates" to an empty array
	for(var i = 0; i < this.coordinates.length; i++) //For every whole number "i" less than the length of Point.coordinates,
		coordinates.push(this.coordinates[i]);       //Add the "i"th element in Point.coordinates to the end of "coordinates"
	return new Point(coordinates);                   //Set Point.clone to the result of Point("coordinates")
};
	
//Projects the point into 3D
//For now, just the simplest orthographic projection possible
Point.prototype.project = function() {
	//Set Point.project to an array,based on this:
	return [
	this.coordinates[0] === undefined ? 0 : this.coordinates[0],         //If the first element in Point.coordinates is undefined,
                                                                         //Set the first element of this array to 0, otherwise set it to the first element of Point.coordinates
	this.coordinates[1] === undefined ? 0 : this.coordinates[1],         //If the second element in Point.coordinates is undefined,
                                                                         //Set the second element of this array to 0, otherwise set it to the second element of Point.coordinates
	this.coordinates[2] === undefined ? 0 : this.coordinates[2]          //If the third element in Point.coordinates is undefined,
           ]                                                             //Set the third element of this array to 0, otherwise set it to the third element of Point.coordinates
};
	
//Adds the coordinates of "x" to the coordinates of "y"
//Both need to have the same amount of dimensions
Point.add = function(x, y) {
	if(x.dimensions() !== y.dimensions())                                              //If the number of dimensions of "x" does not equal the number of dimensions of "y",
		throw new Error("You can't add points with different amounts of dimensions!"); //Throw up the error "You can't add point with different amounts of dimensions!"
	var coordinates = [];                                                              //Set "coordinates" to an empty array
	for(var i = 0; i < x.dimensions(); i++)                                            //For every whole number "i" less than the number of dimensions of "x",
		coordinates[i] = x.coordinates[i] + y.coordinates[i];                          //Set the "i"th element in Point.coordinates to the sum of "i"th element of "x" and of "y"
	return new Point(coordinates);                                                     //Set Point.add to result of Point("coordinates")
};
	
//Subtracts the coordinates of "y" from the coordinates of "x"
//Both need to have the same amount of dimensions
Point.subtract = function(x, y) {
	if(x.dimensions() !== y.dimensions())                                              //If the number of dimensions of "x" does not equal the number of dimensions of "y",
		throw new Error("You can't add points with different amounts of dimensions!"); //Throw up the error "You can't add point with different amounts of dimensions!"
	var coordinates = [];                                                              //Set "coordinates" to an empty array
	for(var i = 0; i < x.dimensions(); i++)                                            //For every whole number "i" less than the number of dimensions of "x",
		coordinates[i] = x.coordinates[i] - y.coordinates[i];                          //Set the "i"th element in Point.coordinates to the sum of "i"th element of "x" and of "y"
	return new Point(coordinates);                                                     //Set Point.add to result of Point("coordinates")
};
	
//Scales up the point "x" by a factor of "t"
Point.multiplyBy = function(x, t) {
	var coordinates = [];                      //Set "coordinates" to an empty array
	for(var i = 0; i < x.dimensions(); i++)    //For every whole number "i" less than the number of dimensions of "x",
		coordinates[i] = x.coordinates[i] * t; //Set the "i"th element in Point.coordinates to the product of "i"th element of "x" and "t"
	return new Point(coordinates);             //Set Point.multiplyBy to the result of Point("coordinates")
};
	
//Scales up the point x by a factor of 1/t.
Point.divideBy = function(x, t) {
	var coordinates = [];                      //Set "coordinates" to an empty array
	for(var i = 0; i < x.dimensions(); i++)    //For every whole number "i" less than the number of dimensions of "x",
		coordinates[i] = x.coordinates[i] / t; //Set the "i"th element in Point.coordinates to the quotient of "i"th element of "x" and "t"
	return new Point(coordinates);             //Set Point.multiplyBy to the result of Point("coordinates")
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
	this.coordinates.push(coord); //Add "coord" to the end of Point.coordinates
	return this; //Set Point.addCoordinate to Point
};
	
//Converts to the Vector3 class used by three.js
//Meant only for 3D points
Point.prototype.toVector3 = function() {
	return new THREE.Vector3([this.coordinates[0], this.coordinates[1], this.coordinates[2]]);
	//Set Point.toVector3 to the result of THREE.Vector3(the first element of Point.coordinates, the second element of Point.coordinates, the third element of Point.coordinates)
};
	
//Checks if two points are equal, to a predetermined precision
Point.equal = function(a, b) {
	for(var i = 0; i < a.coordinates.length; i++) {                                              //For every whole number "i" less than the length of a.coordinates,
		if(Math.abs(a.coordinates[i] - b.coordinates[i]) > Math.abs(a.coordinates[i] * epsilon)) //If the absolute value of the difference of the "i"th element of a.coordinates and of b.coordinates
		                                                                                         //Is greater than the absolute value of the product of the "i"th element of a.coordinates and a small number (epsilon)
																								 //This essentailly asks "is the difference between a and b more than a little bit of 'a'?"
			return false;                                                                        //Set Point.equal to false
	}                                                                                            //Otherwise,
	return true;                                                                                 //Set Point.equal to true
};

//TODO: work on this, make it its own class
//This will eventually become a JS port of OFFBuilder.

//Calculates the specified permutations of a point in a given format
//The string needs to start with the coordinates of the point in parentheses, separated by commas
//These are followed by permutation and sign "modifiers", such as allPerms(0, 1) for all permutations of the first and second coordinates,
//or evenSignChanges(all) for even sign changes in all coordinates
Point.calculatePermutations = function(line) {
	throw new Error("Not yet implemented!"); //Throws up error, this method hasn't been implemented yet
	line = line.replace(" ", "");            //Get rid of all the spaces in "line", and set the result to "line"
	var coords = [];                         //Set "coordinates" to an empty array (Coordinates of point)
	var c = 1;                               //Caret (pointer) for reading the line – skips first character (assumed to be a left parenthesis)
	var leftP = 0, rightP = 0;               //Counts parentheses, to detect when the point ends.
	
	var coord = "";                          //A single coordinate, not to be confused with "coords"
	while(rightP <= leftP) {        //While "rightP" is less than or equal to "leftP"
		switch(line[c]) {           //Run certain code based on what the "c"th element in "line" is:
			case "(":               //If it is a "("
				leftP++;            //Increment "leftP" by 1
				break;              //And leave the switch loop
			case ")":               //If it is a ")"
				rightP++;           //Increment "rightP" by 1
				break;              //And leave the switch loop
			case ",":		   		//If it is a ","
				coords.push(coord); //Add "coord" to the end of "coords"
				coord = "";         //Set "coord: to an empty string
				break;              //And leave the switch loop
			default:                //If all else fails,
				coord += line[c];   //Add "coord" and the "c"th element of "line" and set that to "coord"
				break;              //And leave the switch loop
		}
		c++;                        //Increment "c" by 1
	}
};