//A class for operations on points
var Space = {}; //Sets Space as an object
	
//Calculates the intersection of a line ab with a line cd (where the letters are the points used)
//Assumes that these lines are coplanar, but not colinear
//Returns null if this does not exist
//Currently only implemented for Euclidean points, in at least 2D
Space.intersect = function(a, b, c, d) {
	
	//Check if points "a" and "b" are in the same dimensional space
	//Check if points "a" and "c" are in the same dimensional space
	//Check if points "a" and "d" are in the same dimensional space
	//If any of these return false, the error "You can't intersect edges with different amounts of dimensions!" is thrown up
	if(a.dimensions() !== b.dimensions() || a.dimensions() !== c.dimensions() || a.dimensions() !== d.dimensions())
		throw new Error("You can't intersect edges with different amounts of dimensions!");
	
	//Now, we calculate the where each line segment coordinates change the most
	//That way, we avoid projecting lines into points when we calculate in 2D (like looking at a pencil straight down the length of it)
	//No need to calculate it in 2D, though
	//Create "ab_MAX", "ab_MAX_indx", "cd_MAX", and "cd_MAX_indx", and set all of them to 0 except for "cd_MAX_indx", which is set to 1
	var ab_MAX = 0, ab_MAX_indx = 0, cd_MAX = 0, cd_MAX_indx = 1;
	
	if(a.dimensions() !== 2) {		
		for(var i = 0; i < a.dimensions(); i++) {                   //For every whole number "i" less than the number of dimensions of "a",
			var ab = Math.abs(a.coordinates[i] - b.coordinates[i]); //"ab" is the absolute value of the differences between the coordinates of "a" and "b"
			var cd = Math.abs(c.coordinates[i] - d.coordinates[i]); //"cd" is the absolute value of the differences between the coordinates of "c" and "d"
			if(ab > ab_MAX){     //If "ab" is greater than "ab_MAX"
				ab_MAX = ab;     //Set "ab_MAX" to "ab"
				ab_MAX_indx = i; //Set "ab_MAX_indx" to "i"
			}                    //At the end, "ab_MAX" is the largest difference between "a" and "b", and "ab_MAX_indx" is the dimension that happens in
			if(cd > cd_MAX){     //If "cd" is greater than "cd_MAX"
				cd_MAX = cd;     //Set "cd_MAX" to "cd"
				cd_MAX_indx = i; //Set "cd_MAX_indx" to "i"
			}                    //At the end, "cd_MAX" is the largest difference between "c" and "d", and "cd_MAX_indx" is the dimension that happens in
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
	    //Set p to the array of ["a".coordinates's element at index "ab_MAX_indx", "a".coordinates's element at index "cd_MAX_indx"]
	var p = [a.coordinates[ab_MAX_indx], a.coordinates[cd_MAX_indx]], 
	    //Set r to the array of ["b".coordinates's element at index "ab_MAX_indx" minus "a".coordinates's element at index "ab_MAX_indx",
        //"b".coordinates's element at index "cd_MAX_indx" minus "a".coordinates's element at index "cd_MAX_indx"]
	    r = [b.coordinates[ab_MAX_indx] - a.coordinates[ab_MAX_indx], b.coordinates[cd_MAX_indx] - a.coordinates[cd_MAX_indx]], 
	    //Set q to the array of ["c".coordinates's element at index "ab_MAX_indx", "d".coordinates's element at index "cd_MAX_indx"]
	    q = [c.coordinates[ab_MAX_indx], c.coordinates[cd_MAX_indx]],
	    //Set s to the array of ["d".coordinates's element at index "ab_MAX_indx" minus "c".coordinates's element at index "ab_MAX_indx",
        //"d".coordinates's element at index "cd_MAX_indx" minus "c".coordinates's element at index "cd_MAX_indx"]
	    s = [d.coordinates[ab_MAX_indx] - c.coordinates[ab_MAX_indx], d.coordinates[cd_MAX_indx] - c.coordinates[cd_MAX_indx]];
	
	//If the two lines' slopes are very similar, do nothing
	//They either not intersect or are too similar for us to care
	if(Space.sameSlope(r[0], r[1], s[0], s[1]))
		return null;
	
	//wow, complicated formulas, I use @ to mean "at ab_MAX_indx" or "at cd_MAX_indx"
	//Set "t" to
	var t = ((p[0] - q[0]) * s[1] - (p[1] - q[1]) * s[0])/ //(a@ab-c@ab)*(d@cd-c@cd)-(a@cd-c@cd)*(d@ab-c@ab) divided by
	        (s[0] * r[1] - s[1] * r[0]),                   //(d@ab-c@ab)*(b@cd-a@cd)-(d@cd-c@cd)*(b@ab-a@ab)
	//Set "u" to
	    u = ((p[0] - q[0]) * r[1] - (p[1] - q[1]) * r[0])/ //(a@ab-c@ab)*(b@cd-a@cd)-(a@cd-c@cd)*(b@ab-a@ab) divided by
	        (s[0] * r[1] - s[1] * r[0]);                   //(d@ab-c@ab)*(b@cd-a@cd)-(d@cd-c@cd)*(b@ab-a@ab)
	
	//The intersection lies outside of the segments, or at infinity
	//Check if "t" or "u" are less than or equal to a small number (epsilon)
	//Check if "t" or "u" are greater than or equal to a 1- a small number (epsilon)
	//If any of those are true, return null
	if(t <= epsilon || t >= 1 - epsilon || u <= epsilon || u >= 1 - epsilon)
		return null;
	
	//Create "pt" and set it to an empty array
	var pt = [];
	for(var i = 0; i < a.dimensions(); i++)                                    //For all whole numbers less than the number of dimensions "a" is in
		pt.push(a.coordinates[i] + (b.coordinates[i] - a.coordinates[i]) * t); //Add the sum of "a"'s "i"th coordinate and "b"'s "i"th coordinate minus "a"'s "i"th coordinate times "t" to the end of "pt"
	return new Point(pt);                                                      //After that's done, Return the result of the function Point with the variable "pt"
};
	
//Calculates the angle between b - a and c - a, and check if it's straight to a given precision
Space.collinear = function(a, b, c) {
	if(Point.equal(a, b) || Point.equal(a, c)) //If "a"="b" or "a"="c",
		return true;                           //Return true
	
	var dot = 0;      //Set "dot" to 0
	var norm0, norm1; //Give "norm0" and "norm1" existance
	var sub0, sub1;   //Give "sub0" and "sub1" existance
	for(var i = 0; i < a.coordinates.length; i++) { //For every whole number "i" less than the number of dimensions of "a",
		sub0 = b.coordinates[i] - a.coordinates[i]; //Set "sub0" to difference of the "i"th coordinate of "b" and the "i"th coordinate of "a"
		sub1 = c.coordinates[i] - a.coordinates[i]; //Set "sub1" to difference of the "i"th coordinate of "c" and the "i"th coordinate of "a"
		dot += sub0 * sub1;   //Add "dot" to the product of "sub0" and "sub1"
		norm0 += sub0 * sub0; //Add "norm0" to the product of "sub0" and "sub0"
		norm1 += sub1 * sub1; //Add "norm1" to the product of "sub1" and "sub1"
	}
    //Return true if the absolute value of "dot" divided by the square root of ("norm0" * "norm1") is less than or equal to a small number
	return 1 - Math.abs(dot / Math.sqrt(norm0 * norm1)) <= epsilon;
};

//Returns whether the line from (0, 0) to (a, b) and the line from (0, 0) to (c, d)
//have the same (neglibly different) slopes
Space.sameSlope = function(a, b, c, d) {
	var s = Math.atan(a / b) - Math.atan(c / d); //Set "s" as the arctangent of "a"/"b" minus the arctangent of "c"/"d"
	return (s + Math.PI + epsilon) % Math.PI < 2 * epsilon; //Return true if "s"+pi+a tiny number (epsilon) modulo pi is less than 2*a tiny number (epsilon)
	                                                        //Return Space.sameSlope as false otherwise
};