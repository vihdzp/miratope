import * as THREE from 'three';

export class Point {
  coordinates: number[];

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
  constructor(x: (number[] | number)) {
  	//Constructor from the number of dimensions "x", initializes a point at the origin of R^x
  	if(typeof(x) === "number") {
  		this.coordinates = [];
  		for(var i = 0; i < x; i++)
  			this.coordinates[i] = 0;
  	}
  	//Constructor from the coordinates.
  	else
  		this.coordinates = x;
  };

  /**
   * Returns the number of dimensions of the point's space.
   * @returns {number} The number of coordinates of the point.
   */
  dimensions(): number {
  	return this.coordinates.length;
  };

  /**
   * Clones a Point object. Uses a simple shallow copy.
   * @returns {Point} A new Point object with the same coordinates as `this`.
   */
  clone(): Point {
  	let coordinates: number[] = [];
  	for(var i = 0; i < this.coordinates.length; i++)
  		coordinates.push(this.coordinates[i]);
  	return new Point(coordinates);
  };

  /**
   * Projects the point into 3D.
   * For now, just the simplest orthographic projection possible.
   * @returns {Point} The projected point.
   */
  project(): Point {
  	return Point.padRight(this, 3 - this.coordinates.length);
  };

  /**
   * Adds the coordinates of `P` to the coordinates of a point.
   * Both need to have the same amount of dimensions.
   * @returns {Point} The point with the added coordinates.
   * @throws Will throw an error if the added point does not have the same
   * number of dimensions.
   */
  add(P: Point): Point {
  	if(P.dimensions() !== this.dimensions()) //The points need to have the same number of coordinates.
  		throw new Error("You can't add points with different amounts of dimensions!");
  	for(let i = 0; i < P.dimensions(); i++) //Add the respective coordinates.
  		this.coordinates[i] += P.coordinates[i];
  	return this;
  };

  /**
   * Subtracts the coordinates of `P` to the coordinates of a point.
   * Both need to have the same amount of dimensions.
   * @returns {Point} The point with the subtracted coordinates.
   * @throws Will throw an error if the subtracted point does not have the same
   * number of dimensions.
   */
  subtract(P: Point): Point {
  	if(P.dimensions() !== this.dimensions()) //The points need to have the same number of coordinates.
  		throw new Error("You can't add points with different amounts of dimensions!");
  	for(let i = 0; i < P.dimensions(); i++) //Add the respective coordinates.
  		this.coordinates[i] -= P.coordinates[i];
  	return this;
  };

  /**
   * Scales up a point by a factor of `r`.
   * Simple scalar multiplication.
   * @param {number} r The scaling factor.
   */
  scale(r: number): Point {
  	for(let i = 0; i < this.dimensions(); i++)
  		this.coordinates[i] = this.coordinates[i] * r; //Multiplies each of the coordinates of x by r.
    return this;
  };

  /**
   * Takes the Cartesian product of two points.
   * Simply concatenates the coordinates of both points.
   * @param {Point} P The first point to multiply.
   * @param {Point} Q The second point to multiply.
   * @returns {Point} The product of both points.
   */
  static product(P: Point, Q: Point): Point {
  	return new Point(P.coordinates.concat(Q.coordinates)); //Simply concatenates the coordinates of both points.
  };

  /**
   * Pads a point's coordinates with zeros to the left.
   * @param {Point} P The point to be padded.
   * @param {number} n The number of added zeros.
   * @returns {Point} The padded point.
   */
  static padLeft(P: Point, n: number): Point {
  	let coordinates: number[] = [];
  	for(let i = 0; i < n; i++)
  		coordinates.push(0);
  	for(let i = 0; i < P.coordinates.length; i++)
  		coordinates.push(P.coordinates[i]);
  	return new Point(coordinates);
  };

  /**
   * Pads a point's coordinates with zeros to the right.
   * @param {Point} P The point to be padded.
   * @param {number} n The number of added zeros.
   * @returns {Point} The padded point.
   */
  static padRight(P: Point, n: number): Point {
  	let coordinates: number[] = [];
  	for(let i = 0; i < P.coordinates.length; i++)
  		coordinates.push(P.coordinates[i]);
  	for(let i = 0; i < n; i++)
  		coordinates.push(0);
  	return new Point(coordinates);
  };

  /**
   * Adds a given coordinate to the end of the coordinate list.
   * @param {Number} coord The coordinate to be added.
   * @returns {Point} The modified point.
   */
  addCoordinate(coord: number): Point {
  	this.coordinates.push(coord);
  	return this;
  };

  //Converts to the Vector3 class used by three.js
  //Meant only for 3D points.
  //Simply copies the coordinates over.
  toVector3(): THREE.Vector3 {
  	return new THREE.Vector3(this.coordinates[0], this.coordinates[1], this.coordinates[2]);
  };

  //Checks if two points are equal, to a predetermined precision
  //Simply checks whether the respective coordinates are "similar enough" by floating point standards.
  static equal(a: Point, b: Point): boolean {
  	for(var i = 0; i < a.coordinates.length; i++) {
  		if(Math.abs(a.coordinates[i] - b.coordinates[i]) > Math.abs(a.coordinates[i] * globalThis.epsilon))
  			return false;
  	}
  	return true;
  };

  //Returns the distance of a point to the origin.
  magnitude(): number {
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
  /*Point.calculatePermutations = function(pcoords) {
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
  };*/
}
