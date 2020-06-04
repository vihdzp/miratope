"use strict";

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
			console.log(lastSimplifier);
			ascendingSimplifiers.push(this.extendSimplifier(lastSimplifier, i));
		}
		//Maps each flag to a representative flag of its subwhatever
		//generated by the first n change facet/ridge/etc operations.
		var descendingSimplifiers = [identitySimplifier];
		for(var i = 0; i < this.dimensions; i++) {
			var lastSimplifier = descendingSimplifiers[descendingSimplifiers.length - 1];
			console.log(lastSimplifier);
			descendingSimplifiers.push(this.extendSimplifier(lastSimplifier, this.dimensions - (i + 1)));
		}
		//Maps each flag to a representative flag of the subwhatever
		//fixing that flag's vertex/edge/etc.
		var elementSimplifiers = [];
		for(var i = 0; i < this.dimensions; i++) {
			var simplifier = this.mergeSimplifiers(ascendingSimplifiers[i], descendingSimplifiers[this.dimensions - (i + 1)])
			console.log(simplifier);
			elementSimplifiers.push(simplifier);
		}
		//Maps each flag to a representative flag of the subwhatever
		//fixing that flag's vertex-edge/edge-face/etc pair.
		var intersectionSimplifiers = [];
		for(var i = 0; i < this.dimensions - 1; i++) {
			var simplifier = this.mergeSimplifiers(ascendingSimplifiers[i], descendingSimplifiers[this.dimensions - (i + 2)])
			console.log(simplifier);
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
		console.log(locations, locationsLengths);
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