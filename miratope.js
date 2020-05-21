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

		return new PolytopeC(els, dimensions, true);
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
		
		return new PolytopeC(els, dimensions, true);
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
		
		return new PolytopeC(els, dimensions, true);
	}

	//Generates a hypercube as a PolytopeS.
	//Will probably replace the old hypercube code once PolytopeS is fully functional.
	static hypercubeS(dimensions) {
		var symmetries = ConcreteGroup.BC(dimensions);
		var flagClasses = [];
		for(var i = 0; i < dimensions; i++) {
			flagClasses.push([[0, [i]]]);
		}
		var vertex = [];
		for(var i = 0; i < dimensions; i++) {
			vertex.push(0.5);
		}
		var vertices = [new Point(vertex)];
		return new PolytopeS(symmetries, flagClasses, vertices, dimensions);
	}

	//Generates an orthoplex as a PolytopeS.
	//Will probably replace the old orthoplex code once PolytopeS is fully functional.
	static crossS(dimensions) {
		var symmetries = ConcreteGroup.BC(dimensions);
		var flagClasses = [];
		for(var i = 0; i < dimensions; i++) {
			flagClasses.push([[0, [i]]]);
		}
		var vertex = [Math.SQRT1_2];
		for(var i = 1; i < dimensions; i++) {
			vertex.push(0);
		}
		var vertices = [new Point(vertex)];
		return new PolytopeS(symmetries, flagClasses, vertices, dimensions);
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
	constructor(elementList, dimensions, convex) {
		super();
		this.elementList = elementList;
		this.dimensions = dimensions;
		this.convex = (convex !== undefined);
	}
	
	//Calculates the centroid as the average of the vertices.
	centroid() {		
		var res = this.elementList[0][0].clone();
		for(var i = 1; i < this.elementList[0].length; i++)
			res.add(this.elementList[0][i]);
		res.divideBy(this.elementList[0].length);
		return res;
	}
	
	renderTo(scene) {
		//Renders as a single PolyhedronBufferGeometry.
		if(this.convex && this.dimensions === 3) {
			var vertices = [];
			var faces = [];
			
			//Adds vertices.
			for(var i = 0; i < this.elementList[0].length; i++)
				vertices.push(...this.elementList[0][i].coordinates);
			
			//Adds faces.
			//Only works for triangles at the moment.
			for(var i = 0; i < this.elementList[2].length; i++){
				var edge1=this.elementList[1][this.elementList[2][i][0]];
				var edge2=this.elementList[1][this.elementList[2][i][1]];
				var edge3=this.elementList[1][this.elementList[2][i][2]];
				var vertexIndices=PolytopeC.uniq(edge1.concat(edge2.concat(edge3)));
				faces.push(...vertexIndices);
			}
			
			var geometry = new THREE.PolyhedronBufferGeometry( vertices, faces );
			scene.add(new THREE.Mesh( geometry, new THREE.MeshLambertMaterial({color: 0xffffff, side: THREE.DoubleSide, flatShading: true})));			
		}
		
		//Renders each triangle individually.
		else {
			for(var i = 0; i < this.elementList[2].length; i++){
				var edge1=this.elementList[1][this.elementList[2][i][0]];
				var edge2=this.elementList[1][this.elementList[2][i][1]];
				var edge3=this.elementList[1][this.elementList[2][i][2]];
				var vertexIndices=PolytopeC.uniq(edge1.concat(edge2.concat(edge3)));
				scene.renderTriangle(this.elementList[0][vertexIndices[0]],this.elementList[0][vertexIndices[1]],this.elementList[0][vertexIndices[2]]);
			}
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
		super();
		this.symmetries = symmetries;
		this.flagClasses = flagClasses;
		this.vertices = vertices;
		this.dimensions = dimensions;
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
		for(var i = 0; i < this.dimensions; i++) {
			var lastSimplifier = ascendingSimplifiers[ascendingSimplifiers.length - 1];
			//console.log(lastSimplifier)
			ascendingSimplifiers.push(this.extendSimplifier(lastSimplifier, i));
		}
		//Maps each flag to a representative flag of its subwhatever
		//generated by the first n change facet/ridge/etc operations.
		var descendingSimplifiers = [identitySimplifier];
		for(var i = 0; i < this.dimensions; i++) {
			var lastSimplifier = descendingSimplifiers[descendingSimplifiers.length - 1];
			//console.log(lastSimplifier)
			descendingSimplifiers.push(this.extendSimplifier(lastSimplifier, this.dimensions - (i + 1)));
		}
		//Maps each flag to a representative flag of the subwhatever
		//fixing that flag's vertex/edge/etc.
		var elementSimplifiers = [];
		for(var i = 0; i < this.dimensions; i++) {
			var simplifier = this.mergeSimplifiers(ascendingSimplifiers[i], descendingSimplifiers[this.dimensions - (i + 1)])
			//console.log(simplifier)
			elementSimplifiers.push(simplifier);
		}
		//Maps each flag to a representative flag of the subwhatever
		//fixing that flag's vertex-edge/edge-face/etc pair.
		var intersectionSimplifiers = [];
		for(var i = 0; i < this.dimensions - 1; i++) {
			var simplifier = this.mergeSimplifiers(ascendingSimplifiers[i], descendingSimplifiers[this.dimensions - (i + 2)])
			//console.log(simplifier)
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
				for(var k = 0; k < this.vertices.length; k++) {
					vertices.push(domains[i][1].movePoint(this.vertices[k]));
				}
			}
		}
		//console.log(vertices)
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
		//console.log(locations, locationsLengths);
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
			//console.log(someElems);
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
	
	//Converts to the Vector3 class used by three.js.
	//Meant only for 3D point.
	toVector3() {
		return new THREE.Vector3(...this.coordinates);
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