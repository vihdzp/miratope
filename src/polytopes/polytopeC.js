"use strict";

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
	//Implements Bentley-Ottmann, based on the implementation at
	//http://geomalgorithms.com/a09-_intersect-3.html#Bentley-Ottmann-Algorithm
	//combined with the simplification algorithm at
	//https://web.archive.org/web/20100805164131if_/http://www.cis.southalabama.edu/~hain/general/Theses/Subramaniam_thesis.pdf	
	//to triangulate general polygons.
	//Uses arraya for EQ and SL, but AVL Trees or something similar would be much more efficient.
	//Also, the code might be made more readable if we made classes for stuff like edges and events.
	//NOT YET FULLY IMPLEMENTED!
	renderTo(scene) {
		//"Cuts" edgeA and edgeB at the intersection point, adds the new directed edges according to the simplification algorithm.
		//Edges are in format [[vertexIndex1, vertexIndex2], edgeIndex].
		function divide(edgeA, edgeB) {
			//No point in doing anything if any of the arguments doesn't exist.
			if(edgeA === undefined || edgeB === undefined) 
				return;
			//No point in doing anything if the intersection is already its own point.
			if(edgeA[0][0] === edgeB[0][0] || edgeA[0][0] === edgeB[0][1] || edgeA[0][1] === edgeB[0][0] || edgeA[0][1] === edgeB[0][1])
				return;
			//No point in doing anything if the intersection is non-existent.
			var inter = Point.intersect(vertices[edgeA[0][0]], vertices[edgeA[0][1]], vertices[edgeB[0][0]], vertices[edgeB[0][1]]);
			if(inter === null) 
				return;
			//Add the intersection and a point at "infinitesimal distance" to the vertex list.
			vertices.push(inter); 
			var interClone = inter.clone(); interClone.coordinates[0] += eps;
			vertices.push(interClone);
										
			//If edgeA goes left to right:
			if(Space.lexicographic(vertices[edgeA[0][0]], vertices[edgeA[0][1]]) < 0) {
				edges.push([vertices.length - 1, edgeA[0][1]]);
				edgeA[0][1] = vertices.length - 2;
				//If edgeB goes left to right:
				if(Space.lexicographic(vertices[edgeB[0][0]], vertices[edgeB[0][1]]) < 0) {
					edges.push([vertices.length - 2, edgeB[0][1]]);
					edgeB[0][1] = vertices.length - 1;
					Sorts.binaryInsert(EQ, [inter, edges.length - 1, edgeA[1]], function(a,b){return -Space.lexicographic(a[0], b[0]);});
					Sorts.binaryInsert(EQ, [interClone, edges.length - 2, edgeB[1]], function(a,b){return -Space.lexicographic(a[0], b[0]);});
				}
				//If edgeB goes right to left:
				else {
					edges.push([edgeB[0][0], vertices.length - 1]);
					edgeB[0][0] = vertices.length - 2;
					Sorts.binaryInsert(EQ, [inter, edgeB[1], edgeA[1]], function(a,b){return -Space.lexicographic(a[0], b[0]);});
					Sorts.binaryInsert(EQ, [interClone, edges.length - 2, edges.length - 1], function(a,b){return -Space.lexicographic(a[0], b[0]);});
				}
			}
			//If edgeA goes right to left:
			else {
				edges.push([edgeA[0][0], vertices.length - 2]);
				edgeA[0][0] = vertices.length - 1;
				//If edgeB goes left to right:
				if(Space.lexicographic(vertices[edgeB[0][0]], vertices[edgeB[0][1]]) < 0) {
					edges.push([vertices.length - 2, edgeB[0][1]]);
					edgeB[0][1] = vertices.length - 1;
					Sorts.binaryInsert(EQ, [inter, edges.length - 1, edges.length - 2], function(a,b){return -Space.lexicographic(a[0], b[0]);});
					Sorts.binaryInsert(EQ, [interClone, edgeA[1], edgeB[1]], function(a,b){return -Space.lexicographic(a[0], b[0]);});
				}
				//If edgeB goes right to left:
				else {
					edges.push([edgeB[0][0], vertices.length - 1]);
					edgeB[0][0] = vertices.length - 2;
					Sorts.binaryInsert(EQ, [inter, edgeB[1], edges.length - 2], function(a,b){return -Space.lexicographic(a[0], b[0]);});
					Sorts.binaryInsert(EQ, [interClone, edgeA[1], edges.length - 1], function(a,b){return -Space.lexicographic(a[0], b[0]);});
				}
			}
		}
							
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
				vertices.push(this.elementList[0][cycle[j]]); //I can add .clone() if I want to edit these vertices.
			
			//Directed edges.
			var edges = [[vertices.length - 1, 0]];
			for(var j = 0; j < vertices.length - 1; j++)
				edges.push([j, j + 1]);
			
			//Event queue for Bentley-Ottmann, in format [vertex, edgeIndex1, edgeIndex2].
			//The first edge has the vertex in its first position, the second edge has it in its last position.
			var EQ = [[vertices[vertices.length - 1], 0, vertices.length - 1]];
			for(var j = 0; j < cycle.length - 1; j++)
				EQ.push([vertices[j], j + 1, j]);
			
			//Sorts EQ by inverse lexicographic order of the vertices.
			Sorts.quickSort(EQ, 0, EQ.length - 1, function(a,b){return -Space.lexicographic(a[0], b[0]);});
			
			//Sweep line for Bentley-Ottmann, in format [[vertexIndex1, vertexIndex2], edgeIndex].
			var SL = [];
			
			//Bentley-Ottmann:
			while(EQ.length !== 0) {
				var E = EQ.pop(); //The next "event" in the event queue.
				
				//Runs this code on both edges adjacent to E's vertex.
				for(var j = 1; j <= 2; j++) {
					var edgeE = edges[E[j]];
					//E is a left endpoint of edgeE:
					if((Space.lexicographic(vertices[edgeE[0]], vertices[edgeE[1]]) > 0) !== (j == 1)) {
						edgeE = [edgeE, E[j]];
						var pos = Sorts.binaryInsert(SL, edgeE, function(a,b){if(a[0][0] === b[0][0] || a[0][0] === b[0][1] || a[0][1] === b[0][0] || a[0][1] === b[0][1])
				return 0; return Space.lineCompare([vertices[a[0][0]],vertices[a[0][1]]],[vertices[b[0][0]],vertices[b[0][1]]],E[0].coordinates[0] + eps);});
												
						divide(edgeE, SL[pos - 1]); //Checks for an intersection with the edge below edgeE.
						divide(edgeE, SL[pos + 1]); //Checks for an intersection with the edge above edgeE.
					}
					//E is a right endpoint of edgeE:
					else {
						var pos = Sorts.binarySearch(SL, [edgeE, E[j]], function(a,b){if(a[0][0] === b[0][0] || a[0][0] === b[0][1] || a[0][1] === b[0][0] || a[0][1] === b[0][1])
				return 0; return Space.lineCompare([vertices[a[0][0]],vertices[a[0][1]]],[vertices[b[0][0]],vertices[b[0][1]]],E[0].coordinates[0] - eps);});
						SL.splice(pos, 1); //Deletes edgeE from the sweep line.
						divide(SL[pos], SL[pos - 1]); //Checks for an intersection between the edges below and above edgeE.
					}
				}
			}
			
			//Retrieves polygonal paths from edges.
			//Could be optimized somewhat, I think, but I first need to check that it works in concept.
			
			//Polygons as ordered sets of vertices.
			var polygons = [];
			//Linked list encoding the directed edges.
			var vertexLL = [];
			
			for(var j = 0; j < edges.length; j++) {
				var edge = edges[j];
				if(vertexLL[edge[0]] === undefined)
					vertexLL[edge[0]] = new LLNode(vertices[edge[0]]);
				if(vertexLL[edge[1]] === undefined)
					vertexLL[edge[1]] = new LLNode(vertices[edge[0]]);
				
				vertexLL[edge[0]].linkTo(vertexLL[edge[1]]);		
			}
			
			for(var j = 0; j < vertexLL.length; j++) {
				if(vertexLL[j] !== undefined && !vertexLL[j].traversed)
					polygons.push(vertexLL[j].getCycle());
			}
			console.log(polygons);
		}		
	}
}
