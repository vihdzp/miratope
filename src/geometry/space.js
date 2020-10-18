//A class for operations on points
var Space = {}; //Sets Space as an object

//Uses functions from point.js

//Calculates the intersection of a line ab with a line cd (where the letters are the points used)
//Assumes that these lines are coplanar, but not colinear
//Returns null if this does not exist
//Currently only implemented for Euclidean points, in at least 2D
Space.intersect = function(a, b, c, d) {
	
	//Checks if any of the points are in different dimensional spaces
	if(a.dimensions() !== b.dimensions() || a.dimensions() !== c.dimensions() || a.dimensions() !== d.dimensions())
		throw new Error("You can't intersect edges with different amounts of dimensions!");
	
	//Now, we calculate the where each line segment coordinates change the most
	//That way, we avoid projecting lines into points when we calculate in 2D (like looking at a pencil straight down the length of it)
	//No need to calculate it in 2D, though.
	var ab_MAX = 0, ab_MAX_indx = 0, cd_MAX = 0, cd_MAX_indx = 1;
	
	if(a.dimensions() !== 2) {		
		for(var i = 0; i < a.dimensions(); i++) {
			var ab = Math.abs(a.coordinates[i] - b.coordinates[i]); //Change in the segment ab in the i direction.
			var cd = Math.abs(c.coordinates[i] - d.coordinates[i]); //Change in the segment cd in the i direction.
			if(ab > ab_MAX){
				ab_MAX = ab;
				ab_MAX_indx = i;
			}
			if(cd > cd_MAX){
				cd_MAX = cd;
				cd_MAX_indx = i;
			}
			//At the end, "ab_MAX" is the largest difference between "a" and "b", and "ab_MAX_indx" is the dimension that happens in.
			//"cd_MAX" and "cd_MAX_indx" are analogous.
		}
		
		//If both indices are the same (if the largest differences happen in the same dimension for both lines), we can take the second one to be anything different
		//This if statement makes sure that "ab_MAX_indx" and "cd_MAX_indx" have different values
		if(ab_MAX_indx === cd_MAX_indx) {
			if(cd_MAX_indx === 0)
				cd_MAX_indx = 1;
			else
				cd_MAX_indx = 0;
		}
	}
		
	//This projects a, b-a, c, d-c onto the a plane
	//Then, adapts the method from https://stackoverflow.com/a/565282 (by Gareth Rees)
	var p = [a.coordinates[ab_MAX_indx], a.coordinates[cd_MAX_indx]], 
	    
	    r = [b.coordinates[ab_MAX_indx] - a.coordinates[ab_MAX_indx], b.coordinates[cd_MAX_indx] - a.coordinates[cd_MAX_indx]], 
	    
	    q = [c.coordinates[ab_MAX_indx], c.coordinates[cd_MAX_indx]],
	    
	    s = [d.coordinates[ab_MAX_indx] - c.coordinates[ab_MAX_indx], d.coordinates[cd_MAX_indx] - c.coordinates[cd_MAX_indx]];
	
	//If the two lines' slopes are very similar, do nothing.
	//They either not intersect or are too similar for us to care.
	if(Space.sameSlope(r[0], r[1], s[0], s[1]))
		return null;
	
	//Wow, complicated formulas, @ is used to mean "at ab_MAX_indx" or "at cd_MAX_indx"
	var t = ((p[0] - q[0]) * s[1] - (p[1] - q[1]) * s[0])/ //(a@ab-c@ab)*(d@cd-c@cd)-(a@cd-c@cd)*(d@ab-c@ab) divided by
	        (s[0] * r[1] - s[1] * r[0]),                   //(d@ab-c@ab)*(b@cd-a@cd)-(d@cd-c@cd)*(b@ab-a@ab)
	
	    u = ((p[0] - q[0]) * r[1] - (p[1] - q[1]) * r[0])/ //(a@ab-c@ab)*(b@cd-a@cd)-(a@cd-c@cd)*(b@ab-a@ab) divided by
	        (s[0] * r[1] - s[1] * r[0]);                   //(d@ab-c@ab)*(b@cd-a@cd)-(d@cd-c@cd)*(b@ab-a@ab)
	
	//The intersection lies outside of the segments, or at infinity
	//Makes sure that "t" and "u" are both inbetween epsilon and 1
	if(t <= epsilon || t >= 1 - epsilon || u <= epsilon || u >= 1 - epsilon)
		return null;
	
	//Returns the point a + t * (b - a).
	var pt = [];
	for(var i = 0; i < a.dimensions(); i++)
		pt.push(a.coordinates[i] + (b.coordinates[i] - a.coordinates[i]) * t);
	return new Point(pt);
};
	
//Checks if the angle between b - a and c - a is straight to a given precision
Space.collinear = function(a, b, c) {
	if(Point.equal(a, b) || Point.equal(a, c)) //If "a" is the same as "b" or "c"
		return true;
	
	//Calculates (b - a) . (c - a), |b - a|, |c - a|.
	//This will be used to calculate the angle between them.
	var dot = 0;
	var norm0, norm1;
	var sub0, sub1;
	for(var i = 0; i < a.coordinates.length; i++) {
		sub0 = b.coordinates[i] - a.coordinates[i];
		sub1 = c.coordinates[i] - a.coordinates[i];
		dot += sub0 * sub1;
		norm0 += sub0 * sub0;
		norm1 += sub1 * sub1;
	}
	
    //Returns true iff the cosine of the angle between b - a and c - a is at a distance epsilon from 1 or -1.
	return 1 - Math.abs(dot / Math.sqrt(norm0 * norm1)) <= epsilon;
};

//Calculates the Euclidean distance between a and b.
//Nothing clever here.
Space.distance = function(a, b) {
	var res = 0;
	for(var i = 0; i < a.coordinates().length; i++) {
		var t = a.cooordinates[i] - b.coordinates[i];
		res += t * t;
	}
	return Math.sqrt(res);
};

//Calculates the squared Euclidean distance between a and b.
//For when you don't need that last square root.
//Again, nothing clever here.
Space.distanceSq = function(a, b) {
	var res = 0;
	for(var i = 0; i < a.coordinates().length; i++) {
		var t = a.cooordinates[i] - b.coordinates[i];
		res += t * t;
	}
	return res;
};

//Returns whether the line from (0, 0) to (a, b) and the line from (0, 0) to (c, d)
//have the same (neglibly different) slopes
Space.sameSlope = function(a, b, c, d) {
	var s = Math.atan(a / b) - Math.atan(c / d); //s is the difference between the angles.
	return (s + Math.PI + epsilon) % Math.PI < 2 * epsilon; //Returns true if the angles (mod pi) are different by less than epsilon.
};