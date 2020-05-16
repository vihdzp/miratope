//A general class for polytopes.
//Most of its procedures need to be defined in its inherited classes.
//Not sure if we even need it, but we might.
class Polytope {
	constructor() {
	}
}

//Represents a polytope as a convex hull.
class PolytopeV extends Polytope {
	constructor(vertices, dimensions) {
		super();
		this.vertices = vertices;
		this.dimensions = dimensions; //Is not necessarily the number of dimensions of the vertices!
	}
	
	//Calculates the centroid as the average of the vertices.
	centroid() {		
		var res = this.vertices[0].clone();
		for(var i = 1; i < this.vertices.length; i++)
			res.add(this.vertices[i]);
		res.divideBy(this.vertices.length);
		return res;
	}
}

//Represents a polytope as a list of elements, in ascending order of dimensions, similar to an OFF file.
//We don't store only the facets, because we don't want to deal with O(2^n) code.
//(Should we store indexes or references?)
class PolytopeC extends Polytope {
	constructor(elementList, dimensions) {
		super();
		this.elementList = elementList;
		this.dimensions=dimensions;
	}
	
	//Calculates the centroid as the average of the vertices.
	centroid() {		
		var res = this.elementList[0][0].clone();
		for(var i = 1; i < this.elementList[0].length; i++)
			res.add(this.elementList[0][i]);
		res.divideBy(this.elementList[0].length);
		return res;
	}
}

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
		return new Point(this.coordinates);
	}
	
	//Adds the coordinates of x to the coordinates of the point.
	//Both need to have the same amount of dimensions.
	add(x) {
		if(x.dimensions() !== this.dimensions())
			throw new Error("You can't add points with different amounts of dimensions!");
		for(var i = 0; i < this.dimensions(); i++)
			this.coordinates[i] += x.coordinates[i];
	}
	
	//Scales up the point by a factor of x.
	multiplyBy(x) {
		for(var i = 0; i < this.dimensions(); i++)
			this.coordinates[i] *= x;
	}
	
	//Scales up the point by a factor of 1/x.
	divideBy(x) {
		this.multiplyBy(1/x);
	}
}

//A namespace for functions that build polytopes.
var BuildPolytope = {
	//Builds a hypercube in the specified amount of dimensions.
	//Essentially just generates all possible sequences of ±1/2.
	hypercube: function(dimensions) {
		var vertices = [];
		for(var i = 0; i < 2**dimensions; i++) {
			var coordinates = [];
			for(var j = 1; j <= dimensions; j++) 
				coordinates.push(i % (2 ** j) < 2 ** (j - 1) ? 1/2 : -1/2);
			vertices.push(new Point(coordinates));
		}
		
		return new PolytopeV(vertices, dimensions);
	},
	
	//Builds a simplex in the specified amount of dimensions.
	//Implements the more complicated coordinates in the space of the same dimension.
	simplex: function(dimensions) {
		var vertices = [];
		var aux = []; //Memoizes some square roots, tiny optimization.
		for(var j = 1; j <= dimensions; j++) 
			aux[j]=1/Math.sqrt(2 * j * (j + 1));
		
		for(var i = 1; i <= dimensions + 1; i++) {
			var coordinates = [];
			for(var j = 1; j <= dimensions; j++) 
				coordinates.push(j >= i ? -aux[j] : j*aux[j]);
			vertices.push(new Point(coordinates));
		}
		
		return new PolytopeV(vertices, dimensions);
	},
	
	//Builds a cross-polytope in the specified amount of dimensions.
	//Just generates ±√2/2 in each coordinate.
	cross: function(dimensions) {
		var vertices = [];
		var r2 = 1/Math.sqrt(2); //Miniscule code optimization.
		for(var i = 0; i < dimensions; i++) {
			var coordinates = [];
			for(var j = 0; j < dimensions; j++) 
				coordinates.push(j == i ? -r2 : 0);
			vertices.push(new Point(coordinates));
			
			coordinates = [];
			for(var j = 0; j < dimensions; j++) 
				coordinates.push(j == i ? r2 : 0);
			vertices.push(new Point(coordinates));
		}
		
		return new PolytopeV(vertices, dimensions);
	}
};