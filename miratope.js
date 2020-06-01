"use strict";

//A general class for polytopes.
//Most of its procedures need to be defined in its inherited classes.
class Polytope {
	constructor() {
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

//Represents a polytope as a list of elements, in ascending order of dimensions, similar to (but not the same as) an OFF file.
//We don't only store the facets, because we don't want to deal with O(2^n) code.
//Subelements stored as indices.
class PolytopeC extends Polytope {
	constructor(elementList, dimensions) {
		super();
		this.elementList = elementList;
		this.dimensions = dimensions;
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
		//i^j is used instead of j to ensure that facets of els
		//are generated before the corresponding element.
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
	
	//Calculates the centroid as the average of the vertices.
	centroid() {		
		var res = this.elementList[0][0].clone();
		for(var i = 1; i < this.elementList[0].length; i++)
			res.add(this.elementList[0][i]);
		res.divideBy(this.elementList[0].length);
		return res;
	}
	
	//Made with 3D polyhedra in mind.
	//Will probably have to implement other more complicated stuff for other dimensions.
	//Implements Bentley-Ottmann, combined with the simplification algorithm at
	//https://web.archive.org/web/20100805164131if_/http://www.cis.southalabama.edu/~hain/general/Theses/Subramaniam_thesis.pdf	
	//to triangulate general polygons.
	//NOT YET FULLY IMPLEMENTED!
	renderTo(scene) {
		//For each face:
		for(var i = 0; i < this.elementList[2].length; i++){
			//Enumerates the vertices in order.
			//A doubly linked list does the job easily.
			var vertexDLL = [];
			for(var j = 0; j < this.elementList[2][i].length; j++) {
				var edge = this.elementList[1][this.elementList[2][i][j]];
				if(vertexDLL[edge[0]] === undefined)
					vertexDLL[edge[0]] = new DLLNode(edge[0]);
				if(vertexDLL[edge[1]] === undefined)
					vertexDLL[edge[1]] = new DLLNode(edge[1]);
				
				vertexDLL[edge[0]].linkTo(vertexDLL[edge[1]]);				
			}			
			
			//Cycle of vertex indices.
			//"this.elementList[1][this.elementList[2][i][0]][0]" is just some vertex index.
			var cycle = vertexDLL[this.elementList[1][this.elementList[2][i][0]][0]].getCycle();
			
			//Vertices in order.
			var vertices = [];
			for(var j = 0; j < cycle.length; j++)
				vertices[j] = this.elementList[0][j]; //I can add .clone() if I want to edit these vertices.
			
			//Directed edges.
			var edges = [[vertices.length - 1, 0]];
			for(var j = 0; j < vertices.length - 1; j++)
				edges.push([j, j + 1]);
			
			//Event queue for Bentley-Ottmann, in format [vertex, edgeIndex1, edgeIndex2].
			var EQ = [[vertices[vertices.length - 1], 0, vertices.length - 1]];
			for(var j = 0; j < cycle.length - 1; j++)
				EQ.push([vertices[j], j, j + 1]);
			
			//Sorts EQ by a lexicographic order.
			Sorts.quickSort(EQ, 0, EQ.length - 1, function(a,b){return Point.lexicographic(a[0], b[0]);});
			
			//Sweep line for Bentley-Ottmann, implemented as an AVL tree.
			var SL = new AvlTree();
			
			//Intersection list for Bentley-Ottman.
			var IL = [];
		}		
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
		super();
		this.symmetries = symmetries;
		this.flagClasses = flagClasses;
		this.vertices = vertices;
		this.dimensions = dimensions;
	}

	//Generates a hypercube as a PolytopeS.
	//Will probably replace the old hypercube code once PolytopeS is fully functional.
	static hypercube(dimensions) {
		var symmetries = ConcreteGroup.BC(dimensions);
		var flagClasses = [];
		for(var i = 0; i < dimensions; i++) {
			flagClasses.push([[0, [i]]]);
		}
		var vertex = [];
		for(var i = 0; i < dimensions; i++) {
			vertex.push(0.5);
		}
		var vertices = {0:new Point(vertex)};
		return new PolytopeS(symmetries, flagClasses, vertices, dimensions);
	}

	//Generates an orthoplex as a PolytopeS.
	//Will probably replace the old orthoplex code once PolytopeS is fully functional.
	static cross(dimensions) {
		var symmetries = ConcreteGroup.BC(dimensions);
		var flagClasses = [];
		for(var i = 0; i < dimensions; i++) {
			flagClasses.push([[0, [dimensions - (i + 1)]]]);
		}
		var vertex = [];
		for(var i = 1; i < dimensions; i++) {
			vertex.push(0);
		}
		vertex.push(Math.SQRT1_2);
		var vertices = {0:new Point(vertex)};
		return new PolytopeS(symmetries, flagClasses, vertices, dimensions);
	}

	//Generates a rectified orthoplex as a PolytopeS.
	//Will probably get replaced once more general methods for generating from CDs are added.
	static recticross(dimensions) {
		var symmetries = ConcreteGroup.BC(dimensions);
		var flagClasses = [];
		for(var i = 0; i < dimensions; i++) {
			var row = [];
			//i is change, j is flagclass
			for(var j = 0; j < dimensions - 1; j++) {
				if(j >= i)
					row.push([j, [dimensions - (i + 2)]]);
				else if(j == 0 && i == 1)
					row.push([0, [dimensions - 1]]);
				else if(i == j + 1)
					row.push([j - 1, []]);
				else if(i == j + 2)
					row.push([j + 1, []]);
				else
					row.push([j, [dimensions - (i + 1)]]);
			}
			flagClasses.push(row);
		}
		var vertex = [];
		for(var i = 2; i < dimensions; i++) {
			vertex.push(0);
		}
		vertex.push(Math.SQRT1_2);
		vertex.push(Math.SQRT1_2);
		var vertices = {0:new Point(vertex)};
		return new PolytopeS(symmetries, flagClasses, vertices, dimensions);
	}

	//The centroid is the centroid of the original vertices,
	//weighted by the inverse of the number of domains each vertex appears in,
	//projected onto the intersection of the eigenspaces of the generators
	//with eigenvalues 1.
	centroid() {
		throw new Error("PolytopeS.centroid is not yet implemented");
	}

	//Apply a flag-change operation to a flag.
	//Operators numbered from vertex to facet.
	moveFlag(flag, generator) {
		var flagClass = flag[0];
		var flagDomain = flag[1];
		var effects = this.flagClasses[generator][flagClass];
		var newFlagClass = effects[0];
		var newFlagDomain = flagDomain;
		for(var i = 0; i < effects[1].length; i++) {
			newFlagDomain = this.symmetries.multiply(newFlagDomain, this.symmetries.generators[effects[1][i]]);
		}
		return [newFlagClass, newFlagDomain];
	}

	compareFlags(flag1, flag2) {
		if(flag1[0] < flag2[0])
			return -1
		if(flag1[0] > flag2[0])
			return 1
		return this.symmetries.compare(flag1[1], flag2[1])
	}

	//Utility function for toPolytopeC.
	//Modifies a simplifier to use another generator.
	//Almost identical to the merge function but I don't really care rn.
	extendSimplifier(simplifier, generator) {
		var newSimplifier = {};
		for(var i in simplifier) {
			newSimplifier[i] = simplifier[i];
		}
		for(var i in simplifier) {
			var oldLeftElem = [0, this.symmetries.identity()];
			var leftElem = simplifier[i];
			var oldRightElem = this.moveFlag(oldLeftElem, generator);
			var rightElem = this.moveFlag(leftElem, generator);
			while(oldLeftElem[0]!=leftElem[0]||!this.symmetries.equal(oldLeftElem[1],leftElem[1])) {
				oldLeftElem = leftElem;
				leftElem = newSimplifier[leftElem];
			}
			while(oldRightElem[0]!=rightElem[0]||!this.symmetries.equal(oldRightElem[1],rightElem[1])) {
				oldRightElem = rightElem;
				rightElem = newSimplifier[rightElem];
			}
			var order = this.compareFlags(leftElem, rightElem);
			if(order == 0)
				continue;
			if(order == -1)
				newSimplifier[rightElem] = leftElem;
			if(order == 1)
				newSimplifier[leftElem] = rightElem;
		}
		var betterSimplifier = {};
		for(var i in newSimplifier) {
			var oldElem = [0, this.symmetries.identity()];
			var elem = newSimplifier[i];
			while(this.compareFlags(oldElem, elem)) {
				oldElem = elem;
				elem = newSimplifier[elem];
			}
			betterSimplifier[i] = elem;
		}
		return betterSimplifier;
	}

	//Utility function for toPolytopeC.
	//Merges two simplifiers.
	mergeSimplifiers(simplifier1, simplifier2) {
		var newSimplifier = {};
		for(var i in simplifier1) {
			newSimplifier[i] = simplifier1[i];
		}
		for(var i in simplifier1) {
			var oldLeftElem = [0, this.symmetries.identity()];
			var leftElem = simplifier1[i];
			var oldRightElem = [0, this.symmetries.identity()];
			var rightElem = simplifier2[i];
			while(oldLeftElem[0]!=leftElem[0]||!this.symmetries.equal(oldLeftElem[1],leftElem[1])) {
				oldLeftElem = leftElem;
				leftElem = newSimplifier[leftElem];
			}
			while(oldRightElem[0]!=rightElem[0]||!this.symmetries.equal(oldRightElem[1],rightElem[1])) {
				oldRightElem = rightElem;
				rightElem = newSimplifier[rightElem];
			}
			var order = this.compareFlags(leftElem, rightElem);
			if(order == 0)
				continue;
			if(order == -1)
				newSimplifier[rightElem] = leftElem;
			if(order == 1)
				newSimplifier[leftElem] = rightElem;
		}
		var betterSimplifier = {};
		for(var i in newSimplifier) {
			var oldElem = [0, this.symmetries.identity()];
			var elem = newSimplifier[i];
			while(this.compareFlags(oldElem, elem)) {
				oldElem = elem;
				elem = newSimplifier[elem];
			}
			betterSimplifier[i] = elem;
		}
		return betterSimplifier;
	}

	//Count a simplifier's cosets. Not needed except for debugging.
	simplifierCosets(simplifier){
		var count = 0;
		for(var i in simplifier) {
			if(i == simplifier[i].toString()){
				count++;
			}
		}
		return count;
	}

	//This is basically the algorithm from the Grünbaumian thing,
	//but modified to work for higher dimensions and calculate incidences.
	toPolytopeC(maxDomains) {
		if(!maxDomains)
			//Change to Infinity if you dare
			maxDomains = 500;
		var domains = this.symmetries.enumerateElements(maxDomains);
		//Maps each flag to itself. Used as a base for the later simplifiers.
		var identitySimplifier = {};
		for(var i = 0; i < domains.length; i++) {
			for(var j = 0; j < this.flagClasses[0].length; j++) {
				identitySimplifier[j + "," + domains[i]] = [j, domains[i]];
			}
		}
		//Maps each flag to a representative flag of its subwhatever
		//generated by the first n change vertex/face/etc operations.
		var ascendingSimplifiers = [identitySimplifier];
		console.log("Ascending simplifiers")
		for(var i = 0; i < this.dimensions; i++) {
			var lastSimplifier = ascendingSimplifiers[ascendingSimplifiers.length - 1];
			console.log(lastSimplifier, this.simplifierCosets(lastSimplifier));
			ascendingSimplifiers.push(this.extendSimplifier(lastSimplifier, i));
		}
		//Maps each flag to a representative flag of its subwhatever
		//generated by the first n change facet/ridge/etc operations.
		var descendingSimplifiers = [identitySimplifier];
		console.log("Descending simplifiers")
		for(var i = 0; i < this.dimensions; i++) {
			var lastSimplifier = descendingSimplifiers[descendingSimplifiers.length - 1];
			console.log(lastSimplifier, this.simplifierCosets(lastSimplifier));
			descendingSimplifiers.push(this.extendSimplifier(lastSimplifier, this.dimensions - (i + 1)));
		}
		//Maps each flag to a representative flag of the subwhatever
		//fixing that flag's vertex/edge/etc.
		var elementSimplifiers = [];
		console.log("Element simplifiers")
		for(var i = 0; i < this.dimensions; i++) {
			var simplifier = this.mergeSimplifiers(ascendingSimplifiers[i], descendingSimplifiers[this.dimensions - (i + 1)])
			console.log(simplifier, this.simplifierCosets(simplifier));
			elementSimplifiers.push(simplifier);
		}
		//Maps each flag to a representative flag of the subwhatever
		//fixing that flag's vertex-edge/edge-face/etc pair.
		var intersectionSimplifiers = [];
		console.log("Intersection simplifiers")
		for(var i = 0; i < this.dimensions - 1; i++) {
			var simplifier = this.mergeSimplifiers(ascendingSimplifiers[i], descendingSimplifiers[this.dimensions - (i + 2)])
			console.log(simplifier, this.simplifierCosets(simplifier));
			intersectionSimplifiers.push(simplifier);
		}
		//Vertices are inherently different from other elements, so compute them separately.
		var vertices = [];
		for(var i = 0; i < domains.length; i++) {
			for(var j = 0; j < this.flagClasses[0].length; j++) {
				var flag = [j, domains[i]];
				//Skip flags that aren't vertex representatives
				if(this.compareFlags(flag, elementSimplifiers[0][flag])) {
					continue;
				}
				var vertex = flag[1][1].movePoint(this.vertices[flag[0]]);
				vertices.push(vertex);
			}
		}
		console.log("Vertices")
		console.log(vertices);
		//Map representatives to IDs.
		var locations = [];
		var locationsLengths = [];
		for(var i = 0; i < this.dimensions; i++) {
			var locationsRow = {};
			var nextID = 0;
			for(var j = 0; j < domains.length; j++) {
				for(var k = 0; k < this.flagClasses[0].length; k++) {
					var flag = [k, domains[j]];
					if(this.compareFlags(flag, elementSimplifiers[i][flag])) {
						continue;
					}
					locationsRow[flag] = nextID++;
				}
			}
			locations.push(locationsRow);
			locationsLengths.push(nextID);
		}
		console.log("Locations")
		console.log(locations, locationsLengths);
		console.log("Higher elements")
		var elems = [vertices];
		for(var i = 1; i < this.dimensions; i++) {
			//TODO rename this to something better
			var someElems = [];
			for(var j = 0; j < locationsLengths[i]; j++)
				someElems.push([]);
			for(var j = 0; j < domains.length; j++) {
				for(var k = 0; k < this.flagClasses[0].length; k++) {
					var flag = [k, domains[j]];
					if(this.compareFlags(flag, intersectionSimplifiers[i - 1][flag])) {
						continue;
					}
					var leftFlag = elementSimplifiers[i - 1][flag];
					var rightFlag = elementSimplifiers[i][flag];
					var leftID = locations[i - 1][leftFlag];
					var rightID = locations[i][rightFlag];
					someElems[rightID].push(leftID);
				}
			}
			console.log(someElems);
			elems.push(someElems);
		}
		return new PolytopeC(elems, this.dimensions);
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
		if(t <= 0 || t >= 1 || isNaN(t))
			return null;
		return Point.multiplyBy(Point.add(a,Point.subtract(b, a)), t);
	}
	
	//Orders two points in lexicographic order of the coordinates.
	//Returns a negative number if a < b, 0 if a == b, and a positive number if a > b.
	//For use in sorting functions.
	static lexicographic(a, b) {
		if(a.dimensions() !== b.dimensions())			
			throw new Error("You can't compare points with different amounts of dimensions!");
		
		for(var i = 0; i < a.dimensions(); i++) {
			var x = a.coordinates[i] - b.coordinates[i];
			if(x !== 0)
				return x;
		}
		
		return 0;
	}
}

//Class for drawing objects to the scene more efficiently. 
class Scene {
	constructor(scene) {
		if(scene !== undefined)
			this.scene = scene;
		else
			this.scene = new THREE.Scene();
	}

	renderTriangle(a,b,c) {
		var geometry = new THREE.BufferGeometry();
		var vertices = new Float32Array(a.project().concat(b.project().concat(c.project())));
		
		//Computes the normal as a cross product.
		var x = [vertices[3] - vertices[0], vertices[4] - vertices[1], vertices[5] - vertices[2]];
		var y = [vertices[6] - vertices[0], vertices[7] - vertices[1], vertices[8] - vertices[2]];
		var n = [x[1] * y[2] - x[2] * y[1], x[2] * y[0] - x[0] * y[2], x[0] * y[1] - x[1] * y[0]];
		var N = Math.sqrt(n[0] * n[0] + n[1] * n[1] + n[2] * n[2]);
		var normals = new Float32Array([n[0]/N, n[1]/N, n[2]/N, n[0]/N, n[1]/N, n[2]/N, n[0]/N, n[1]/N, n[2]/N]);
		geometry.setAttribute('position',new THREE.BufferAttribute(vertices, 3));
		geometry.setAttribute('normal',new THREE.BufferAttribute(normals, 3));
		geometry.setIndex([0,1,2]);
		var triangle = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial({color: 0xffffff, side: THREE.DoubleSide, flatShading: true}));
		this.scene.add( triangle );  
	}
	
	add(object) {
		this.scene.add(object);
	}
	
	reset() {
		this.scene = new THREE.Scene();
	}
}