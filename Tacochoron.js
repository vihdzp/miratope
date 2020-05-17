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

//Represents a polytope in a way that takes advantage of symmetry.
//Obviously, this requires a representation of the symmetry group.
//The other components are a description of how the flags (tuples of vertex/edge/face...) 
//within a single domain connect to each other under "change vertex/edge/..." operations,
//matrices describing how the symmetry group affects the physical representation of the polytope,
//and positions of each class of vertices.
class PolytopeS extends Polytope {

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
	//Positioned in the standard orientation with edge length 1.
	hypercube: function(dimensions) {
		var elements = [];
		for(var i = 0; i <= dimensions; i++)
			elements.push([]);
		//Mapping from pairs of the indices below to indices of the corresponding elements.
		var locations = {}
		//i and i^j are the indices of the vertices of the current subelement.
		//i^j is used instead of j to ensure that facets of elements are generated before the corresponding element.
		for(var i = 0; i < 2**dimensions; i++) {
			for(var j = 0; j < 2**dimensions; j++) {
				//If the indices are the same, this is a vertex
				if(i == 0) {
					var coordinates = [];
					for(var k = 1; k <= dimensions; k++) 
						coordinates.push(j % (2 ** k) < 2 ** (k - 1) ? 1/2 : -1/2);
					locations[j] = {0:elements[0].length};
					elements[0].push(new Point(coordinates));
					continue;
				}
				//To avoid redundancy, i^j should be >=i using the obvious partial ordering on bitstrings.
				//This is equivalent to i and j being disjoint
				if((j & i) != 0)
					continue;
				//Everything else is a higher-dimensional element
				var elementDimension = 0;
				var difference = i;
				var differences = [];
				while(difference > 0) {
					elementDimension++;
					differences.push(difference & ~(difference - 1));
					difference = difference & (difference - 1);
				}
				var facets = [];
				//facets connected to i
				for(var k = 0; k < differences.length; k++)
					facets.push(locations[j][i ^ differences[k]]);
				//facets connected to i^j
				for(var k = 0; k < differences.length; k++)
					facets.push(locations[j ^ differences[k]][i ^ differences[k]]);
				locations[j][i] = elements[elementDimension].length;
				elements[elementDimension].push(facets);
			}
		}

		return new PolytopeC(elements, dimensions);
	},
	
	//Builds a simplex in the specified amount of dimensions.
	//Implements the more complicated coordinates in the space of the same dimension.
	simplex: function(dimensions) {
		var vertices = [];
		var aux = [Infinity]; //Memoizes some square roots, tiny optimization.
		for(var j = 1; j <= dimensions; j++) 
			aux.push(1/Math.sqrt(2 * j * (j + 1)));
		
		for(var i = 1; i <= dimensions + 1; i++) {
			var coordinates = [];
			for(var j = 1; j <= dimensions; j++) 
				coordinates.push(j >= i ? -aux[j] : j*aux[j]);
			vertices.push(new Point(coordinates));
		}

		var elements = [vertices];
		for(var i = 1; i <= dimensions; i++)
			elements.push([]);
		var locations = {}
		for(var i = 0; i < dimensions + 1; i++)
			locations[2 ** i] = i
		for(var i = 1; i < 2**(dimensions + 1); i++) {
			//Vertices were generated earlier
			if (!(i & (i - 1)))
				continue;
			var elementDimension = -1;
			var t = i;
			var elemVertices = [];
			while(t > 0) {
				elementDimension++;
				elemVertices.push(t & ~(t - 1));
				t = t & (t - 1);
			}
			var facets = [];
			for(var k = 0; k < elemVertices.length; k++)
				facets.push(locations[i ^ elemVertices[k]]);
			locations[i] = elements[elementDimension].length;
			elements[elementDimension].push(facets);
		}
		
		return new PolytopeC(elements, dimensions);
	},
	
	//Builds a cross-polytope in the specified amount of dimensions.
	//Positioned in the standard orientation with edge length 1.
	cross: function(dimensions) {
		/*var vertices = [];
		for(var i = 0; i < dimensions; i++) {
			var coordinates = [];
			for(var j = 0; j < dimensions; j++) 
				coordinates.push(j == i ? -Math.SQRT1_2 : 0);
			vertices.push(new Point(coordinates));
			
			coordinates = [];
			for(var j = 0; j < dimensions; j++) 
				coordinates.push(j == i ? Math.SQRT1_2 : 0);
			vertices.push(new Point(coordinates));
		}*/

		//i is the set of nonzero dimensions, j is the set of negative dimensions
		var elements = [];
		for(var i = 0; i <= dimensions; i++)
			elements.push([]);
		var locations = {}
		//The full polytope is best handled separately
		for(var i = 1; i < 2**dimensions; i++) {
			for(var j = 0; j < 2**dimensions; j++) {
				//No negative zero dimensions
				if((i & j) != j)
					continue;
				if(!j)
					locations[i] = {};
				if(!(i & (i - 1))) {
					var coordinates = [];
					var sign = j ? -1 : 1;
					for(var k = 0; k < dimensions; k++) 
						coordinates.push((2 ** k) == i ? sign * Math.SQRT1_2 : 0);
					locations[i][j] = elements[0].length;
					elements[0].push(new Point(coordinates));
					continue;
				}
				var elementDimension = -1;
				var t = i;
				var elemVertices = [];
				while(t > 0) {
					elementDimension++;
					elemVertices.push(t & ~(t - 1));
					t = t & (t - 1);
				}
				var facets = [];
				for(var k = 0; k < elemVertices.length; k++)
					facets.push(locations[i ^ elemVertices[k]][j & ~elemVertices[k]]);
				locations[i][j] = elements[elementDimension].length;
				elements[elementDimension].push(facets);
			}
		}
		console.log(locations)
		var facets = [];
		for(var i = 0; i < elements[dimensions - 1].length; i++) {
			facets.push(i)
		}
		elements[dimensions].push(facets)
		
		return new PolytopeC(elements, dimensions);
	}
};