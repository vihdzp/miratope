"use strict";

//A general class for polytopes.
//Most of its procedures need to be defined in its inherited classes.
class Polytope {
	constructor() {
	}
	
	//Builds a hypercube in the specified amount of dimensions.
	//Positioned in the standard orientation with edge length 1.
	static hypercube(dimensions) {
		var els = []; //Elements is a reserved word.
		for(var i = 0; i <= dimensions; i++)
			els.push([]);
		//Mapping from pairs of the indices below to indices of the corresponding els.
		var locations = {};
		//i and i^j are the indices of the vertices of the current subelement.
		//i^j is used instead of j to ensure that facets of els are generated before the corresponding element.
		for(var i = 0; i < 2 ** dimensions; i++) {
			for(var j = 0; j < 2 ** dimensions; j++) {
				//If the indices are the same, this is a vertex
				if(i == 0) {
					var coordinates = [];
					for(var k = 1; k <= dimensions; k++) 
						coordinates.push(j % (2 ** k) < 2 ** (k - 1) ? 0.5 : -0.5);
					locations[j] = {0:els[0].length};
					els[0].push(new Point(coordinates));
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
				locations[j][i] = els[elementDimension].length;
				els[elementDimension].push(facets);
			}
		}

		return new PolytopeC(els, dimensions);
	}
	
	//Builds a simplex in the specified amount of dimensions.
	//Implements the more complicated coordinates in the space of the same dimension.
	static simplex(dimensions) {
		var vertices = [];
		var aux = [Infinity]; //Memoizes some square roots, tiny optimization.
		for(var i = 1; i <= dimensions; i++) 
			aux.push(1/Math.sqrt(2 * i * (i + 1)));
		
		for(var i = 0; i <= dimensions ; i++) {
			var coordinates = [];
			for(var j = 1; j <= dimensions; j++) {
				if(j > i)
					coordinates.push(-aux[j]);
				else if(j === i)
					coordinates.push(j*aux[j]);
				else
					coordinates.push(0);
			}
			vertices.push(new Point(coordinates));
		}

		var els = [vertices];
		for(var i = 1; i <= dimensions; i++)
			els.push([]);
		var locations = {};
		for(var i = 0; i < dimensions + 1; i++)
			locations[2 ** i] = i;
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
			locations[i] = els[elementDimension].length;
			els[elementDimension].push(facets);
		}
		
		return new PolytopeC(els, dimensions);
	}
	
	//Builds a cross-polytope in the specified amount of dimensions.
	//Positioned in the standard orientation with edge length 1.
	static cross(dimensions) {
		//i is the set of nonzero dimensions, j is the set of negative dimensions
		var els = [];
		for(var i = 0; i <= dimensions; i++)
			els.push([]);
		var locations = {};
		//The full polytope is best handled separately
		for(var i = 1; i < 2 ** dimensions; i++) {
			for(var j = 0; j < 2 ** dimensions; j++) {
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
					locations[i][j] = els[0].length;
					els[0].push(new Point(coordinates));
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
				locations[i][j] = els[elementDimension].length;
				els[elementDimension].push(facets);
			}
		}
		var facets = [];
		for(var i = 0; i < els[dimensions - 1].length; i++) {
			facets.push(i);
		}
		els[dimensions].push(facets);
		
		return new PolytopeC(els, dimensions);
	}
}

//Represents a polytope as a convex hull.
//Will be merged with PolytopeC.
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
//Subelements stored as indices.
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
	
	render() {
		for(var i = 0; i < this.elementList[2].length; i++){
			var e1=this.elementList[1][this.elementList[2][i][0]];
			var e2=this.elementList[1][this.elementList[2][i][1]];
			var e3=this.elementList[1][this.elementList[2][i][2]];
			var f=PolytopeC.uniq(e1.concat(e2.concat(e3)));
			Scene.renderTriangle(this.elementList[0][f[0]],this.elementList[0][f[1]],this.elementList[0][f[2]]);
		}
	}
	
	//https://stackoverflow.com/a/9229821/12419072
	static uniq(a) {
		var seen = {};
		return a.filter(function(item) {
			return seen.hasOwnProperty(item) ? false : (seen[item] = true);
		});
	}
}

//Represents a polytope in a way that takes advantage of symmetry.
//Obviously, this requires a representation of the symmetry group.
//The other components are a description of how the flags (tuples of vertex/edge/face...) 
//within a single domain connect to each other under "change vertex/edge/..." operations,
//matrices describing how the symmetry group affects the physical representation of the polytope,
//and positions of each class of vertices.
//In this implementation the symmetry group and its physical effects are bundled.
class PolytopeS extends Polytope {
	constructor(symmetries, flagClasses, vertices, dimensions) {
		this.symmetries = symmetries;
		this.flagClasses = flagClasses;
		this.vertices = vertices;
		this.dimensions = dimensions;
	}

	//The centroid is the centroid of the original vertices,
	//projected onto the intersection of the eigenspaces of the generators
	//with eigenvalues 1.
	centroid() {
		throw new Error("PolytopeS.centroid is not yet implemented");
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
	
	//Projects the point into 3D.
	//For now, just the simplest orthographic projection possible.
	project() {
		return [this.coordinates[0] === undefined ? 0 : this.coordinates[0],
		this.coordinates[1] === undefined ? 0 : this.coordinates[1],
		this.coordinates[2] === undefined ? 0 : this.coordinates[2]];
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

//Class for drawing objects to the scene more efficiently. 
class Scene {
	static renderTriangle(a,b,c) {
		var geometry = new THREE.BufferGeometry();
		var vertices = new Float32Array(a.project().concat(b.project().concat(c.project())));
		var x = [vertices[3]-vertices[0], vertices[4]-vertices[1], vertices[5]-vertices[2]];
		var y = [vertices[6]-vertices[0], vertices[7]-vertices[1], vertices[8]-vertices[2]];
		var n = [x[1]*y[2]-x[2]*y[1],x[2]*y[0]-x[0]*y[2],x[0]*y[1]-x[1]*y[0]];
		var N = Math.sqrt(n[0]*n[0]+n[1]*n[1]+n[2]*n[2]);
		var normals = new Float32Array([n[0]/N,n[1]/N,n[2]/N,n[0]/N,n[1]/N,n[2]/N,n[0]/N,n[1]/N,n[2]/N]);
		geometry.setAttribute('position',new THREE.BufferAttribute(vertices, 3));
		geometry.setAttribute('normal',new THREE.BufferAttribute(normals, 3));
		geometry.setIndex([0,1,2]);
		var triangle = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial({color: 0xffffff, side: THREE.DoubleSide, flatShading: true}));
		scene.add( triangle ); 
	}
	
	static reset() {
		scene = new THREE.Scene();
	}
}