"use strict";

//TBA: A polytopeV class.
//It would represent a polytope as a convex hull.
//Alternatively, we could make that into "another" constructor for PolytopeC.

//Represents a polytope as a list of elements, in ascending order of dimensions, similar to (but not the same as) an OFF file.
//We don't only store the facets, because we don't want to deal with O(2^n) code.
//Subelements stored as indices.
//All points assumed to be of the same dimension.
function PolytopeC(elementList, name) {
	this.elementList = elementList;
	this.dimensions = elementList.length - 1; //The combinatorial dimension.
	this.spaceDimensions = this.elementList[0][0].dimensions(); //The space's dimension.
	this.name = (name === undefined ? Names.plain(elementList[elementList.length - 1].length, this.dimensions) : name); //If no name is given, uses simply the plain name constructor.
};
	
//Builds a hypercube in the specified amount of dimensions.
//Positioned in the standard orientation with edge length 1.
PolytopeC.hypercube = function(dimensions) {
	var els = []; //Elements is a reserved word.
	for(var i = 0; i <= dimensions; i++)
		els.push([]);
	//Mapping from pairs of the indices below to indices of the corresponding els.
	var locations = {};
	//i and i^j are the indices of the vertices of the current subelement.
	//i^j is used instead of j to ensure that facets of els
	//are generated before the corresponding element.
	for(var i = 0; i < Math.pow(2, dimensions); i++) {
		for(var j = 0; j < Math.pow(2, dimensions); j++) {
			//If the indices are the same, this is a vertex
			if(i == 0) {
				var coordinates = [];
				for(var k = 1; k <= dimensions; k++) 
					coordinates.push(j % (Math.pow(2, k)) < Math.pow(2, k - 1) ? 0.5 : -0.5);
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

	return new PolytopeC(els);
};
	
//Builds a simplex in the specified amount of dimensions.
//Implements the more complicated coordinates in the space of the same dimension.
PolytopeC.simplex = function(dimensions) {
	var vertices = [];
	var aux = [Infinity]; //Memoizes some square roots, tiny optimization.
	for(var i = 1; i <= dimensions; i++) 
		aux.push(1 / Math.sqrt(2 * i * (i + 1)));
	
	for(var i = 0; i <= dimensions ; i++) {
		var coordinates = [];
		for(var j = 1; j <= dimensions; j++) {
			if(j > i)
				coordinates.push(-aux[j]);
			else if(j === i)
				coordinates.push(j * aux[j]);
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
		locations[Math.pow(2, i)] = i;
	for(var i = 1; i < Math.pow(2, dimensions + 1); i++) {
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
	
	return new PolytopeC(els);
};

//Builds a cross-polytope in the specified amount of dimensions.
//Positioned in the standard orientation with edge length 1.
PolytopeC.cross = function(dimensions) {
	//i is the set of nonzero dimensions, j is the set of negative dimensions
	var els = [];
	for(var i = 0; i <= dimensions; i++)
		els.push([]);
	var locations = {};
	//The full polytope is best handled separately
	for(var i = 1; i < Math.pow(2, dimensions); i++) {
		for(var j = 0; j < Math.pow(2, dimensions); j++) {
			//No negative zero dimensions
			if((i & j) != j)
				continue;
			if(!j)
				locations[i] = {};
			if(!(i & (i - 1))) {
				var coordinates = [];
				var sign = j ? -1 : 1;
				for(var k = 0; k < dimensions; k++) 
					coordinates.push((Math.pow(2, k)) == i ? sign * Math.SQRT1_2 : 0);
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
	
	return new PolytopeC(els);
};
	
//Calculates the centroid as the average of the vertices.
//Could be made more efficient replacing the add method with direct calculations with arrays.
PolytopeC.prototype.centroid = function() {		
	var res = this.elementList[0][0].clone();
	for(var i = 1; i < this.elementList[0].length; i++)
		res.add(this.elementList[0][i]);
	res.divideBy(this.elementList[0].length);
	return res;
};

//Builds a n/d star.
//If n and d are not coprime, a regular polygon compound is made instead.
PolytopeC.regularPolygon = function(n, d) {
	var gcd;
	if(d === undefined) {
		d = 1;
		gcd = 1;
	}
	else
		gcd = PolytopeC._gcd(n, d);
	
	var els = [[], [], []],
	n_gcd = n / gcd,
	counter = 0,
	comp,
	i, j, x = 0, y = d;
	
	for(i = 0; i < n; i++) {
		var angle = 2 * Math.PI * i / n;
		els[0].push(new Point([Math.cos(angle), Math.sin(angle)])); //Vertices
	}
	
	//i is the component number.
	for(i = 0; i < gcd; i++) {
		//x and y keep track of the vertices that are being connected.
		comp = [];
		//j is the edge.
		for(j = 0; j < n_gcd; j++) {
			els[1].push([x, y]); //Edges
			x = y;
			y += d;
			if(y >= n)
				y -= n;
			comp.push(counter++); //Components
		}
		els[2].push(comp);
		x++; y++;
	}
	
	return new PolytopeC(els, Names.regularPolygonName(n, d));
};

//Helper function for star.
//Just the most basic form of the Euclidean algorithm.
PolytopeC._gcd = function(n, d) {
	var t;
	while (d !== 0) {
		t = d;
		d = n % d;
		n = t;
	}
	return n;
};	

//Builds a Grünbaumian n/d star.
PolytopeC.regularPolygonG = function(n, d) {
	if(d === undefined)
		d = 1;
	
	var els = [[], [], [[]]],
	i;
	
	for(i = 0; i < n; i++) {
		var angle = 2 * Math.PI * i * d / n;
		els[0].push(new Point([Math.cos(angle), Math.sin(angle)])); //Vertices
		els[2][0].push(i); //Face.
	}
	
	for(i = 0; i < n - 1; i++)
		els[1].push([i, i + 1]); //Edges
	els[1].push([els[0].length - 1, 0]);
	
	return new PolytopeC(els, Names.regularPolygonName(n, d));
};
	
//Calculates the prism product, or rather Cartesian product, of P and Q.
//Q can be excluded if P is instead the array of polytopes to multiply.
//Vertices are the products of vertices, edges are the products of vertices with edges or viceversa, and so on.
PolytopeC.prismProduct = function(P, Q) {
	if(Q === undefined) {
		if(P.length === 1)
			return P[0];
		return PolytopeC.prismProduct(P.pop(), PolytopeC.prismProduct(P));
	}

	if(P.dimensions === 0)
		return Q;
	if(Q.dimensions === 0)
		return P;
	
	var i, j, k, m, n, d, els, name,
	newElementList = [[]],
	memoizer = [];
	
	//Adds vertices.
	for(i = 0; i < P.elementList[0].length; i++) 
		for(j = 0; j < Q.elementList[0].length; j++) 
			newElementList[0].push(Point.product(P.elementList[0][i], Q.elementList[0][j]));
	
	//Fills up newElementList.
	for(d = 1; d <= P.dimensions + Q.dimensions; d++) 
		newElementList.push([]);
	
	//We take products of 0-elements * m-elements, 1-elements * (m-1)-elements, ..., in order.
	//The dimensions of the subelements we're multiplying.
	for (m = 0; m <= P.dimensions; m++) {
		for (n = (m === 0 ? 1 : 0); n <= Q.dimensions; n++) {
			//The indices of the elements we're multiplying.
			for(i = 0; i < P.elementList[m].length; i++) {
				for(j = 0; j < Q.elementList[n].length; j++) {
					//Adds the Cartesian product of the ith m-element and the j-th n-element to the newElementList.
					//The elements of this product are the products of each of the first polytope's ridges with the other polytope, and viceversa.
					els = [];
					
					//Vertices don't have ridges!
					if(m !== 0)
						for(k = 0; k < P.elementList[m][i].length; k++)
							els.push(PolytopeC._getIndexOfProduct(m - 1, P.elementList[m][i][k], n, j, P, Q, memoizer));
					if(n !== 0)
						for(k = 0; k < Q.elementList[n][j].length; k++)
							els.push(PolytopeC._getIndexOfProduct(m, i, n - 1, Q.elementList[n][j][k], P, Q, memoizer));

					newElementList[m + n].push(els);
				}
			}
		}
	}
	
	//Dyad * dyad = rectangle.
	if(P.dimensions === 1 && Q.dimensions === 1)
		name = "Rectangle";
	else {
		//Polytope * dyad = Polytope prism.
		if(P.dimensions === 1)
			name = Names.toAdjective(Q.name) + " prism";
		else if(Q.dimensions === 1)
			name = Names.toAdjective(P.name) + " prism";
		//TBA if an m-prism and an n-prism are multiplied together, the result should be an (m + n)-prism!
		else {
			name = Names.toAdjective(P.name) + "-" + Names.firstToLower(Names.toAdjective(Q.name)) + " duoprism";
		}
	}
	return new PolytopeC(newElementList, name);
};

//Helper function for prismProduct.
//Gets the index of the product of the ith m-element and the jth n-element in the new polytope.
//Takes into account the order in which the elements are calculated and added.
PolytopeC._getIndexOfProduct = function(m, i, n, j, P, Q, memoizer) {
	//Recall that the elements of a single dimension are added in order vertex * facet, edge * ridge, ...
	//memoizer[m][n] counts the number of such elements that we have to skip before we reach the multiplication we actually care about.
	//This number is found recursively, so we memoize to calculate it more efficiently.
	//offset calculates the index of our product within the products of elements of the same dimensions,
	//simply by recalling this last ordering is lexicographic.
	var offset = (i * Q.elementList[n].length) + j;
	
	if(memoizer[m]) {
		if(memoizer[m][n])
			return memoizer[m][n] + offset;
	}
	else 
		memoizer[m] = [];
	
	if(m === 0 || n === Q.elementList.length - 1)
		memoizer[m][n] = 0;
	else
		memoizer[m][n] = memoizer[m - 1][n + 1] + P.elementList[m - 1].length * Q.elementList[n + 1].length;
	return memoizer[m][n] + offset;
};

//Makes every vertex have dim coordinates either by adding zeros or removing numbers.
PolytopeC.prototype.setSpaceDimensions = function(dim) {
	for(var i = 0; i < this.elementList[0].length; i++) {
		if(this.elementList[0][i].coordinates.length > dim)
			this.elementList[0].coordinates = this.elementList[0].coordinates.slice(0, dim);
		else if(this.elementList[0][i].coordinates.length < dim)
			for(var j = 0; j < dim - this.elementList[0][i].coordinates.length; j++)
				this.elementList[0][i].coordinates.push(0);
	}
	this.spaceDimensions = dim;
};
	
//Converts the edge representation of the i-th face to an ordered array of vertices.
PolytopeC.prototype.faceToVertices = function(i) {
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
	return vertexDLL[this.elementList[1][this.elementList[2][i][0]][0]].getCycle();
};
	
//Extrudes a polytope to a pyramid with an apex at the specified point.
//Constructs pyramids out of elements recursively.
//The ith n-element in the original polytope gets extruded to the 
//(i+[(n+1)-elements in the original polytope])th element in the new polytope.
PolytopeC.prototype.extrudeToPyramid = function(apex) {
	var els, i;
	this.dimensions++;
	this.elementList.push([]);
	
	var oldElNumbers = [];
	for(i = 0; i <= this.dimensions; i++)
		oldElNumbers.push(this.elementList[i].length);
	
	//Adds apex.
	this.elementList[0].push(apex);		
	this.setSpaceDimensions(Math.max(apex.dimensions(), this.spaceDimensions));
	
	//Adds edges.
	for(i = 0; i < oldElNumbers[0]; i++)
		this.elementList[1].push([i, oldElNumbers[0]]);
	
	//Adds remaining elements.
	for(var d = 2; d <= this.dimensions; d++) {
		for(i = 0; i < oldElNumbers[d - 1]; i++) {
			els = [i];
			for(var j = 0; j < this.elementList[d - 1][i].length; j++)
				els.push(this.elementList[d - 1][i][j] + oldElNumbers[d - 1]);
			this.elementList[d].push(els);
		}
	}
	
	this.name = Names.toAdjective(this.name) + " pyramid";
	return this;
};

PolytopeC.prototype.extrudeToPrism = function(height) {
	return PolytopeC.prismProduct(this, PolytopeC.dyad(height));
};

//Creates a dyad of the given length.
PolytopeC.dyad = function(length) {
	return new PolytopeC([[new Point([-length / 2]), new Point([length / 2])], [[0, 1]]], "Dyad");
};
	
//Saves the current polytope as an OFF file.
//If comments, the OFF file will contain comments dividing the different element types.
PolytopeC.prototype.saveAsOFF = function(comments) {
	var i, j, coord, vertices;
	
	if(this.spaceDimensions > this.dimensions) {
		//Maybe automatically project the polytope?
		alert("The OFF format does not support polytopes in spaces with more dimensions than themselves.");
		return;
	}
	//The contexts of the OFF file, as an array of plaintext strings.
	var data = [];
	
	//Writes the element counts, and optionally, leaves a comment listing their names in order.
	switch(this.dimensions) {
		case 0: //LOL
			data.push("0OFF");
			break;
		case 1: //Also LOL
			data.push("1OFF\n");
			if(comments)
				data.push("# Vertices\n");
			data.push(this.elementList[0].length + "\n");
			break;
		case 2:
			data.push("2OFF\n");
			if(comments)
				data.push("# Vertices, Edges\n");
			data.push(this.elementList[0].length + " ");
			data.push(this.elementList[1].length + "\n");
			break;
		case 3:
			data.push("OFF\n"); //For compatibility.
			if(comments)
				data.push("# Vertices, Faces, Edges\n");
			data.push(this.elementList[0].length + " ");
			data.push(this.elementList[2].length + " ");
			data.push(this.elementList[1].length + "\n");
			break;
		default:
			data.push(this.dimensions);
			data.push("OFF\n");
			if(comments) {
				data.push("# Vertices, Faces, Edges, Cells");
				for(i = 4; i < this.dimensions; i++)
					data.push(", " + Names.elementName(i, PLURAL ^ UPPERCASE));
				data.push("\n");
			}
			data.push(this.elementList[0].length + " ");
			data.push(this.elementList[2].length + " ");
			data.push(this.elementList[1].length + " ");
			for(i = 3; i < this.dimensions - 1; i++)					
				data.push(this.elementList[i].length + " ");
			data.push(this.elementList[this.dimensions - 1].length + "\n");
	}
	
	//Adds vertices. Fills in zeros if spaceDimensions < dimensions.
	if(this.dimensions === 1 || this.dimensions >= 3) {
		if(comments)
			data.push("\n# Vertices\n");
		for(i = 0; i < this.elementList[0].length; i++) {
			for(j = 0; j < this.dimensions - 1; j++) {
				coord = this.elementList[0][i].coordinates[j];
				if(coord === undefined)
					data.push("0 ");
				else
					data.push(coord + " ");
			}
			coord = this.elementList[0][i].coordinates[this.dimensions - 1];
			if(coord === undefined)
				data.push("0\n");
			else
				data.push(coord + "\n");
		}
	}
	
	//In this special case, the vertices need to be in order.
	else if(this.dimensions === 2) {
		vertices = this.faceToVertices(0);
		if(comments)
			data.push("\n# Vertices\n");
		for(i = 0; i < this.elementList[0].length; i++) {
			coord = this.elementList[0][vertices[i]].coordinates[0];
			if(coord === undefined)
				data.push("0 ");
			else
				data.push(coord + " ");
			
			coord = this.elementList[0][vertices[i]].coordinates[1];
			if(coord === undefined)
				data.push("0\n");
			else
				data.push(coord + "\n");
		}
	}
	
	//Adds faces.
	if(this.dimensions >= 3) {
		if(comments)
			data.push("\n# Faces\n");
		for(i = 0; i < this.elementList[2].length; i++) {
			vertices = this.faceToVertices(i);
			data.push(this.elementList[2][i].length);
			for(j = 0; j < this.elementList[2][i].length; j++)
				data.push(" " + vertices[j]);
			data.push("\n");
		}
	}
		
	//Adds the rest of the elements.
	for(var d = 3; d < this.dimensions; d++) {
		if(comments) {
			data.push("\n# ");
			data.push(Names.elementName(d, PLURAL ^ UPPERCASE));
			data.push("\n");
		}
		for(i = 0; i < this.elementList[d].length; i++) {
			data.push(this.elementList[d][i].length);
			for(j = 0; j < this.elementList[d][i].length; j++)
				data.push(" " + this.elementList[d][i][j]);
			data.push("\n");
		}
	}
	
	PolytopeC._saveFile(data, "text/plain", this.name + ".off");
};

//Saves the file with the given data, the given MIME type, and the given extension.
//Adapted from https://stackoverflow.com/a/45120037/ (by Thomas Praxl),
//and from https://stackoverflow.com/a/46233123/12419072 (by Jaromanda X)
//to deal with the IE case.
PolytopeC._saveFile = function(data, type, fileName) {
	var blob;
	try {
		blob = new Blob(data, {type: type});
	}
	//Old browser!
	catch(e) {
		window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;
		if (window.BlobBuilder) {
		   var bb = new BlobBuilder();
		   bb.append(data);
		   blob = bb.getBlob(type);
		}
	}
	
	fileName = fileName.replace("/", "_");
	
	//Old browser again!
	if(navigator.msSaveOrOpenBlob)
		navigator.msSaveOrOpenBlob(blob, fileName);
	else {
		var a = document.getElementById("download");
		a.href = window.URL.createObjectURL(blob);
		a.download = fileName;
		a.click();
		window.URL.revokeObjectURL(a.href);
	}
};
	
//Made with 3D polyhedra in mind.
//Will probably have to implement other more complicated stuff for other dimensions.
//Implements Bentley-Ottmann, based on the implementation at
//http://geomalgorithms.com/a09-_intersect-3.html#Bentley-Ottmann-Algorithm
//combined with the simplification algorithm at
//https://web.archive.org/web/20100805164131if_/http://www.cis.southalabama.edu/~hain/general/Theses/Subramaniam_thesis.pdf	
//to triangulate general polygons.
//NOT YET FULLY IMPLEMENTED!
PolytopeC.prototype.renderTo = function(scene) {
	function debug() {
		var x = 0;
		console.log(E.value.coordinates[indx0].toString());
		console.log(SL.toString());
	}
	
	//Orders two points lexicographically based on the coordinates on indices 0 and 1.
	//Uses the IDs of the vertices to order them consistently if their coordinates are identical.
	function order(a, b) {
		var c = a.value.coordinates[indx0] - b.value.coordinates[indx0];
		if(c === 0) {
			c = a.value.coordinates[indx1] - b.value.coordinates[indx1];
			if(c === 0)
				return a.id - b.id;
		}
		return c;
	}
	
	//SL is sorted by the height of the edges' intersections with the sweepline.
	//If these are equal, the lines are sorted by slope.
	//If both are equal, the lines are consistently ordered by their IDs (unique, immutable identifiers).
	function SLSort(x, y){
		//This is the only case where the function should return 0:
		if(x.leftVertex === y.leftVertex && x.rightVertex() === y.rightVertex())
			return 0;
		
		var a = x.leftVertex.value,
		b = x.rightVertex().value,
		c = y.leftVertex.value,
		d = y.rightVertex().value,
		k = E.value.coordinates[indx0], slopeMod;
		
		//Calculates where in the segments the intersection with the sweepline lies.
		var lambda0 = (k - b.coordinates[indx0])/(a.coordinates[indx0] - b.coordinates[indx0]);		
		var lambda1 = (k - d.coordinates[indx0])/(c.coordinates[indx0] - d.coordinates[indx0]);
		
		//The height difference between the intersections.
		var res = (a.coordinates[indx1] * lambda0 + b.coordinates[indx1] * (1 - lambda0)) - (c.coordinates[indx1] * lambda1 + d.coordinates[indx1] * (1 - lambda1));
		
		//If the intersections are the same:
		//Maybe we should replace this by "if res is close to zero", and the lambdas to "is close to 0 or 1"?
		if (res === 0) {	
			//If the first edge starts at a point, and the second ends at that point, the former gets sorted after the latter.
			if(lambda0 === 1 && lambda1 === 0)
				return 1;
			//And viceversa.
			if(lambda0 === 0 && lambda1 === 1)
				return -1;
			
			//If both edges start at the same point, sort by increasing slope.
			if(lambda0 === 1)
				slopeMod = 1;				
			//If both edges end at the same point, sort by decreasing slope.
			else
				slopeMod = -1;
			
			//lambda0, lambda1 are recycled as slopes.
			//These shouldn't be NaNs, that case is handled separately in the main code.
			lambda0 = (a.coordinates[indx1] - b.coordinates[indx1])/(a.coordinates[indx0] - b.coordinates[indx0]);
			lambda1 = (c.coordinates[indx1] - d.coordinates[indx1])/(c.coordinates[indx0] - d.coordinates[indx0]);
			
			//The difference between the slopes.
			res = slopeMod * (lambda0 - lambda1);
			
			//If both lines are the same, might as well compare using indices.
			if(res === 0)
				return x.id - y.id;
		}
		return res;
	};
		
	var j, k;
	
	//For each face:
	faceLoop:
	for(var i = 0; i < this.elementList[2].length; i++){
		//Enumerates the vertices in order.
		var cycle = this.faceToVertices(i);
		
		//Makes a doubly-linked list vertexDLL for the polygon's vertices and the new vertices created.
		//node0 is always the "next" vertex.
		var vertexDLL = [new DLLNode(this.elementList[0][cycle[0]])];
		for(j = 0; j < cycle.length - 1; j++) {
			vertexDLL[j + 1] = new DLLNode(this.elementList[0][cycle[j + 1]]);			
			vertexDLL[j].linkToNext(vertexDLL[j + 1]);
		}						
		vertexDLL[vertexDLL.length - 1].linkToNext(vertexDLL[0]);
		
		//Tries to find two non-equal points. If all points are the same, doesn't render the face.
		var a = 1;
		while(Point.equal(vertexDLL[0].value, vertexDLL[a].value))
			if(a++ >= vertexDLL.length)
				continue faceLoop;
		
		//Tries to find three non-collinear points. If all points are collinear, doesn't render the face.
		var b = (a == 1 ? 2 : 1);
		while(Space.collinear(vertexDLL[0].value, vertexDLL[a].value, vertexDLL[b].value))
			if(b++ >= vertexDLL.length)
				continue faceLoop;
		
		//Calculates the coordinates such that the projection of our three non-collinear points onto their 2D plane has the highest area.
		//Uses the shoelace formula.
		//Stores such coordinates' indices in indx0, indx1.
		var maxArea = 0, indx0 = 0, indx1 = 1;
		for(j = 0; j < vertexDLL[0].value.dimensions(); j++) {
			for(k = j + 1; k < vertexDLL[0].value.dimensions(); k++) {
				if(vertexDLL[0].value.coordinates[j] * (vertexDLL[a].value.coordinates[k] - vertexDLL[b].value.coordinates[k])
				+ vertexDLL[a].value.coordinates[j] * (vertexDLL[b].value.coordinates[k] - vertexDLL[0].value.coordinates[k])
				+ vertexDLL[b].value.coordinates[j] * (vertexDLL[0].value.coordinates[k] - vertexDLL[a].value.coordinates[k])
				> maxArea) {
					indx0 = j;
					indx1 = k;
				}						
			}
		}
		
		//Event queue for Bentley-Ottmann, stores vertices.
		//Sorts EQ by lexicographic order of the vertices (EQ is read backwards at the moment).
		
		var EQ = new AvlTree(order);
		for(j = 0; j < vertexDLL.length; j++)
			EQ.insert(vertexDLL[j]);

		//Sweep line for Bentley-Ottmann, as an object with properties leftVertex and rightVertexIndex.
		//rightVertexIndex should be 0 if leftVertex.node0.value is to the right of leftVertex.value, 1 if leftVertex.node1.value is.
		//This format is useful because an edge on the sweep line can only be cut to the right.
		//That way, we don't need to modify the SL objects after the division process: only the nodes' connections change.
		
		var SL = new AvlTree(SLSort);

		//Bentley-Ottmann:
		while(!EQ.isEmpty()) {				
			var E = EQ.findMinimum(); //The next "event" in the event queue.
			EQ.delete(E);
			
			//Runs this code on both edges adjacent to E's vertex.
			for(j = 0; j <= 1; j++) {
				var edge; //E's edge in the SL format.
				var ord = E.value.coordinates[indx0] - E.getNode(j).value.coordinates[indx0];
				var pos = 0;
				var node, prevNode, nextNode;
				
				//Vertex E is a left endpoint of the edge:
				if(ord < 0) {
					edge = new SLEdge(E, j);
					node = SL.insert(edge);
					if(!node) {
						console.log("SL insertion failed! This isn't supposed to happen!");
						console.log("Edge searched for: "+edge.toString());
						console.log("Debug stuff:");
						debug();
					}
					prevNode = SL.prev(node);
					nextNode = SL.next(node);
					
					if(prevNode)
						PolytopeC._divide(edge, prevNode.key, vertexDLL, EQ); //Checks for an intersection with the edge below edgeE.
					if(nextNode)
						PolytopeC._divide(edge, nextNode.key, vertexDLL, EQ); //Checks for an intersection with the edge above edgeE.
				}
				//Vertex E is a right endpoint of the edge:
				else if (ord > 0) {
					edge = new SLEdge(E.getNode(j), 1 - j);
					
					//Deletes edge from the sweep line.
					node = SL.getNode(edge);
					if(!node) {
						console.log("SL retrieval failed! This isn't supposed to happen!");
						console.log("Edge searched for: "+edge.toString());
						console.log("Debug stuff:");
						debug();
					}
					prevNode = SL.prev(node);
					nextNode = SL.next(node);
					
					if(prevNode && nextNode)
						PolytopeC._divide(prevNode.key, nextNode.key, vertexDLL, EQ); //Checks for an intersection between the edges below and above edgeE.
					SL.delete(edge);
				}
				//The edge is perpendicular to the first coordinate's axis:
				//Runs only once per such an edge.
				else if(E.value.coordinates[indx1] > E.getNode(j).value.coordinates[indx1]) {
					edge = new SLEdge(E, j);
				
					//I really should only check intersections with segments at the "correct height".
					node = SL.findMinimumNode();
					while(node) {
						PolytopeC._divide(edge, node.key, vertexDLL, EQ);
						node = SL.next(node);
					}
				}
			}
		}			
		
		//Polygons as ordered sets of vertices.
		var polygons = [];
		
		//Retrieves polygonal paths from edges.
		//Could be optimized somewhat, I think (do we need to traverse the list twice?), but I first need to check that it works in concept.
		for(j = 0; j < vertexDLL.length; j++) {
			if(!vertexDLL[j].traversed)
				polygons.push(vertexDLL[j].getCycle());
		}
		console.log(polygons);
	}		
};
	
//renderTo helper function.
//"Cuts" edgeA and edgeB at the intersection point, adds the new directed edges according to the simplification algorithm.
//Edges are in the SL format.
PolytopeC._divide = function(edgeA, edgeB, vertexDLL, EQ) {
	//No point in doing anything if the intersection has already been dealt with.
	//...what happens if two different vertices take the same location?
	if(edgeA.leftVertex.value === edgeB.leftVertex.value || edgeA.leftVertex.value === edgeB.rightVertex().value ||
	edgeA.rightVertex().value === edgeB.leftVertex.value || edgeA.rightVertex().value === edgeB.rightVertex().value)
		return;
	
	//Converts edges from the SL format to the [vertex1, vertex2] directed edge format.
	var edgeADir, edgeBDir;
	if(edgeA.rightVertexIndex === 0)
		edgeADir = [edgeA.leftVertex, edgeA.leftVertex.node0];
	else
		edgeADir = [edgeA.leftVertex.node1, edgeA.leftVertex];		
	if(edgeB.rightVertexIndex === 0)
		edgeBDir = [edgeB.leftVertex, edgeB.leftVertex.node0];
	else
		edgeBDir = [edgeB.leftVertex.node1, edgeB.leftVertex];		
	
	//No point in doing anything if the intersection is non-existent.
	var inter = Space.intersect(edgeADir[0].value, edgeADir[1].value, edgeBDir[0].value, edgeBDir[1].value);
	if(inter === null) 
		return;
	
	//Add the intersection and a point at "infinitesimal distance" to the vertex list.
	//They don't actually have to be different in this implementation of the algorithm.
	//In fact, the algorithm (as implemented) will fail if both nodes don't reference the same point.
	var newNode1 = new DLLNode(inter); var newNode2 = new DLLNode(inter);
	vertexDLL.push(newNode1); vertexDLL.push(newNode2);
	
	//Re-links the vertices.
	edgeADir[0].linkToNext(newNode1);
	newNode1.linkToNext(edgeBDir[1]);
	edgeBDir[0].linkToNext(newNode2);
	newNode2.linkToNext(edgeADir[1]);
	
	//Adds the edges' new IDs to the redirect table, so that they remain equal and consistent.
	edgeA.updateID();
	edgeB.updateID();
	
	EQ.insert(newNode1);
	EQ.insert(newNode2);
};

//Helper class for renderTo, used in the sweep line for Bentley-Ottmann.
//Encodes an object with properties leftVertex and rightVertexIndex.
//rightVertexIndex should be 0 if leftVertex.node0.value is to the right of leftVertex.value, 1 if leftVertex.node1.value is.
//This format is useful because an edge on the sweep line can only be cut to the right.
//That way, we don't need to modify the SL objects after the division process: only the nodes' connections change.
function SLEdge(leftVertex, rightVertexIndex) {
	this.leftVertex = leftVertex;
	this.rightVertexIndex = rightVertexIndex;
	
	//Gives the edge an immutable ID in terms of its vertices.
	//Uses the redirect table (read below).
	var x = this.leftVertex.id;
	var y = this.rightVertex().id;
	var newID = (x + y) * (x + y + 1) / 2 + y;
	this.id = (SLEdge.redirectTable[newID] === undefined ? newID : SLEdge.redirectTable[newID]);
};
		
SLEdge.prototype.rightVertex = function() {
	return this.leftVertex.getNode(this.rightVertexIndex);
};
	
//An edge's ID must be immutable, even if the vertices themselves change, so that sorting can occur consistently.
//At the same time, it needs to be uniquely identified from the vertices, so searches can occur.
//To be able to do both things, I use a "redirect table".
//If the left vertex of an edge changes, I "redirect" the new calculated ID to the old one.
SLEdge.redirectTable = [];

SLEdge.prototype.updateID = function() {
	var x = this.leftVertex.id;
	var y = this.rightVertex().id;
	var newID = (x + y) * (x + y + 1) / 2 + y;
	SLEdge.redirectTable[newID] = this.id;
}	;

//TO DELETE.
//Used for debugging purposes.
SLEdge.prototype.toString = function(){
	return "([" + this.leftVertex.value.coordinates.toString() +"], ["+this.rightVertex().value.coordinates.toString()+"])";
};
