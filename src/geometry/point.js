"use strict";

//Class for points in any amount of dimensions.
//Meant for Euclidean space, idk what we can do with hyperbolics.
class Point {
	constructor(x) {
		//Constructor from the number of dimensions, initializes in the origin.
		if(typeof(x) === "number") {
			this.coordinates = [];
			for(var i = 0; i < x; i++) 
				this.coordinates[i] = 0;
		}
				
		//Constructor from the coordinates.
		else if(typeof(x) === "object") 
			this.coordinates = x;
	}
	
	//Returns the number of dimensions of the point's space.
	dimensions() {
		return this.coordinates.length;
	}
	
	//Makes a Point object with the same base attributes.
	clone() {
		return new Point([...this.coordinates]);
	}
	
	//Projects the point into 3D.
	//For now, just the simplest orthographic projection possible.
	project() {
		return [this.coordinates[0] === undefined ? 0 : this.coordinates[0],
		this.coordinates[1] === undefined ? 0 : this.coordinates[1],
		this.coordinates[2] === undefined ? 0 : this.coordinates[2]];
	}
	
	//Adds the coordinates of x to the coordinates of y.
	//Both need to have the same amount of dimensions.
	static add(x, y) {
		if(x.dimensions() !== y.dimensions())
			throw new Error("You can't add points with different amounts of dimensions!");
		var coordinates = [];
		for(var i = 0; i < x.dimensions(); i++)
			coordinates[i] = x.coordinates[i] + y.coordinates[i];
		return new Point(coordinates);
	}
	
	//Subtracts the coordinates of y from the coordinates of x.
	//Both need to have the same amount of dimensions.
	static subtract(x, y) {
		if(x.dimensions() !== y.dimensions())
			throw new Error("You can't add points with different amounts of dimensions!");
		var coordinates = [];
		for(var i = 0; i < x.dimensions(); i++)
			coordinates[i] = x.coordinates[i] - y.coordinates[i];
		return new Point(coordinates);
	}
	
	//Scales up the point x by a factor of t.
	static multiplyBy(x, t) {
		var coordinates = [];
		for(var i = 0; i < x.dimensions(); i++)
			coordinates[i] = x.coordinates[i] * t;
		return new Point(coordinates);
	}
	
	//Scales up the point x by a factor of 1/t.
	static divideBy(x, t) {
		var coordinates = [];
		for(var i = 0; i < x.dimensions(); i++)
			coordinates[i] = x.coordinates[i] / t;
		return new Point(coordinates);
	}
	
	//Converts to the Vector3 class used by three.js.
	//Meant only for 3D point.
	toVector3() {
		return new THREE.Vector3(...this.coordinates);
	}
	
	//Calculates the intersection of ab with cd.
	//Assumes that all points lie on the same plane, but not on the same line.
	//Returns null if this does not exist.
	//Currently only implemented for Euclidean points, in at least 2D.
	static intersect(a, b, c, d) {
		if(a.dimensions() !== b.dimensions() || a.dimensions() !== c.dimensions() || a.dimensions() !== d.dimensions())
			throw new Error("You can't intersect edges with different amounts of dimensions!");
		
		//First, we calculate the coordinates in which each line segment coordinates change the most.
		//That way, we avoid projecting lines into points.
		//No need to do it in 2D, though.
		var ab_MAX = 0, ab_MAX_indx = 0, cd_MAX = 0, cd_MAX_indx = 1;
		if(a.dimensions() !== 2) {
			
			for(var i = 0; i < a.dimensions(); i++) {
				var ab = Math.abs(a.coordinates[i] - b.coordinates[i]);
				var cd = Math.abs(c.coordinates[i] - d.coordinates[i]);
				if(ab > ab_MAX){
					ab_MAX = ab;
					ab_MAX_indx = i;
				}
				if(cd > cd_MAX){
					cd_MAX = cd;
					cd_MAX_indx = i;
				}
			}
			
			//If both indices are the same, we can take the second one to be anything different.
			if(ab_MAX_indx === cd_MAX_indx) {
				if(cd_MAX_indx === 0)
					cd_MAX_indx = 1;
				else
					cd_MAX_indx = 0;
			}
		}
		
		//Projects a, b - a, c, d - c onto the a plane.
		//Then, adapts the method from https://stackoverflow.com/a/565282/12419072
		var p = [a.coordinates[ab_MAX_indx], a.coordinates[cd_MAX_indx]];
		var r = [b.coordinates[ab_MAX_indx] - a.coordinates[ab_MAX_indx], b.coordinates[cd_MAX_indx] - a.coordinates[cd_MAX_indx]];
		var q = [c.coordinates[ab_MAX_indx], c.coordinates[cd_MAX_indx]];
		var s = [d.coordinates[ab_MAX_indx] - c.coordinates[ab_MAX_indx], d.coordinates[cd_MAX_indx] - c.coordinates[cd_MAX_indx]];
		
		var t = ((p[0] - q[0]) * s[1] - (p[1] - q[1]) * s[0])/(r[1] * s[0] - r[0] * s[1]);
		var u = ((p[0] - q[0]) * r[1] - (p[1] - q[1]) * r[0])/(r[1] * s[0] - r[0] * s[1]);
		if(t <= 0 || t >= 1 || u <= 0 || u >= 1 || isNaN(t) || isNaN(u))
			return null;
		return Point.add(a, Point.multiplyBy(Point.subtract(b, a), t));
	}
	
	//Orders two points in lexicographic order of the coordinates.
	//Returns a negative number if a < b, 0 if a == b, and a positive number if a > b.
	//For use in sorting functions.
	static lexicographic(a, b) {
		for(var i = 0; i < a.dimensions(); i++) {
			var x = a.coordinates[i] - b.coordinates[i];
			if(x !== 0)
				return x;
		}
		
		return 0;
	}
	
	//Orders two arrays in lexicographic order of the coordinates.
	//Returns a negative number if a < b, 0 if a == b, and a positive number if a > b.
	//For use in sorting functions.
	static lexicographicArray(a, b) {
		for(var i = 0; i < a.length; i++) {
			var x = a[i] - b[i];
			if(x !== 0)
				return x;
		}
		
		return 0;
	}
	
	//Compares the intersections of the line from a[0] to a[1] and the line from b[0] to b[1]
	//with the x = a hyperplane lexicographically.
	//Used in the Bentley-Ottmann algorithm.
	static lineCompare(l1, l2, a) {
		var lambda = (a - l1[1].coordinates[0])/(l1[0].coordinates[0] - l1[1].coordinates[0]);
		var pt1 = [];
		for(var i = 1; i < l1.length; i++)
			pt1.push(l1[0].coordinates[i] * lambda + l1[1].coordinates[i] * (1 - lambda));
		
		lambda = (a - l2[1].coordinates[0])/(l2[0].coordinates[0] - l2[1].coordinates[0])
		var pt2 = [];
		for(var i = 1; i < l1.length; i++)
			pt2.push(l2[0].coordinates[i] * lambda + l2[1].coordinates[i] * (1 - lambda));
		return Point.lexicographicArray(pt1, pt2);
	}
}