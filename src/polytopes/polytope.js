"use strict";

//A class for general polytopes, and functions of general polytopes
//Other than the construction property (which stores how the polytope was created),
//the class doesn't contain any properties (but it does contain methods)
//Those are set in the PolytopeC (combinatorial) and PolytopeS (symmetry) subclasses

//Stores how a polytope was created in Polytope.construction
function Polytope(construction) {
	if(!construction)                                    //If Polytope is called without defining "construction",
		this.construction = new ConstructionNode(POLYTOPE, [this]); //Polytope.construction.type is set to 0
		                                                            //Polytope.construction.children is set to the array [Polytope]
	else
		this.construction = construction;
};

//This gets the polytope's name from its construction (in the current language) and sets it to Polytope.getName
Polytope.prototype.getName = function() {
	return this.construction.getName();
};

//The two elephants in the room.
//Using these two is probably buggy, and we should check this eventually.
Polytope.nullitope = function() {
	return new PolytopeC([], new ConstructionNode(NAME, ["nullitope"]));
};

//This sets Polytope.point as.
Polytope.point = function() {
	return new PolytopeC([[new Point([])]], new ConstructionNode(NAME, ["point"]));
};

//This sets Polytope.dyad to a dyad of half a given size, using the variable "length"
Polytope.dyad = function(length) {
	if(length === undefined) //If "length" is not specified,
		length = 0.5;        //Default "length" to 0.5
	else                     //Otherwise,
		length /= 2;         //Set "length" to the input "length" value divided by 2
	return new PolytopeC([[new Point([-length]), new Point([length])], [[0, 1]]], new ConstructionNode(NAME, ["dyad"])); //Then.
};

//Polytope._prismProduct, but also supports P being an array.
Polytope.prismProduct = function(P, Q) {
	return Polytope._product(P, Q, MULTIPRISM, Polytope._prismProduct);
};

//Calculates the prism product (Cartesian product) of P and Q
//Vertices are the products of vertices, edges are the products of vertices with edges or viceversa, and so on.
Polytope._prismProduct = function(P, Q) {	
	//Deals with the point, nullitope cases.
	if(P.dimensions === 0)
		return Q;
	if(Q.dimensions === 0)
		return P;
	if(P.dimensions === -1 || Q.dimensions === -1)
		return Polytope.nullitope();
	
	var i, j, k, m, n, els,
	newElementList = [[]],
	memoizer = [];
	
	//Adds vertices.
	for(i = 0; i < P.elementList[0].length; i++) 
		for(j = 0; j < Q.elementList[0].length; j++) 
			newElementList[0].push(Point.product(P.elementList[0][i], Q.elementList[0][j]));
	
	//Fills up newElementList.
	for(i = 1; i <= P.dimensions + Q.dimensions; i++) 
		newElementList.push([]);
	
	//The dimensions of the subelements we're multiplying.
	for (m = 0; m <= P.dimensions; m++) {
		for (n = (m === 0 ? 1 : 0); n <= Q.dimensions; n++) {
			//The indices of the elements we're multiplying.
			for(i = 0; i < P.elementList[m].length; i++) {
				for(j = 0; j < Q.elementList[n].length; j++) {
					//Adds the Cartesian product of the ith m-element and the j-th n-element to the newElementList.
					//The elements of this product are the prism products of each of the first polytope's facets with the other polytope, and viceversa.
					els = [];
					
					//Vertices don't have facets!
					if(m !== 0)
						for(k = 0; k < P.elementList[m][i].length; k++)
							els.push(Polytope._getIndexOfPrismProduct(m - 1, P.elementList[m][i][k], n, j, P, Q, memoizer));
					if(n !== 0)
						for(k = 0; k < Q.elementList[n][j].length; k++)
							els.push(Polytope._getIndexOfPrismProduct(m, i, n - 1, Q.elementList[n][j][k], P, Q, memoizer));

					newElementList[m + n].push(els);
				}
			}
		}
	}
	
	return new PolytopeC(newElementList); //The construction gets added in the main function.
};

//Helper function for prismProduct.
//Gets the index of the product of the ith m-element and the jth n-element in the new polytope.
//Takes into account the order in which the elements are calculated and added.
Polytope._getIndexOfPrismProduct = function(m, i, n, j, P, Q, memoizer) {
	//Recall that the elements of a single dimension are added in order vertex * facet, edge * ridge, ...
	//memoizer[m][n] counts the number of such elements that we have to skip before we reach the multiplication we actually care about.
	//This number is found recursively, so we memoize to calculate it more efficiently.
	//offset calculates the index of our product within the products of elements of the same dimensions,
	//simply by recalling that this last ordering is lexicographic.
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

//Polytope._tegumProduct, but also supports P being an array.
Polytope.tegumProduct = function(P, Q) {
	return Polytope._product(P, Q, MULTITEGUM, Polytope._tegumProduct);
};

//Calculates the tegum product, or rather the dual of the Cartesian product, of P and Q.
//Edges are the products of vertices, faces are the products of vertices with edges or viceversa, and so on.
Polytope._tegumProduct = function(P, Q) {	
	//Deals with the point, nullitope cases.
	if(P.dimensions <= 0)
		return Q;
	if(Q.dimensions <= 0)
		return P;
	
	var i, j, k, l, m, n, elIndx, elIndx2, iElCount, jElCount, mDimCount, nDimCount, els,
	newElementList = [[]],
	memoizer = [];
	
	//Adds vertices.
	for(i = 0; i < Q.elementList[0].length; i++)
		newElementList[0].push(Point.padLeft(Q.elementList[0][i], P.spaceDimensions));	
	for(i = 0; i < P.elementList[0].length; i++)
		newElementList[0].push(Point.padRight(P.elementList[0][i], Q.spaceDimensions));
	
	//Fills up newElementList.
	for(i = 1; i <= P.dimensions + Q.dimensions; i++) 
		newElementList.push([]);
	
	//The dimensions of the subelements we're multiplying.
	for (m = -1; m < P.dimensions; m++) {
		//Every polytope has a single nullitope.
		if(m === -1)
			mDimCount = 1;
		else
			mDimCount = P.elementList[m].length;
		
		for (n = -1; n < Q.dimensions; n++) {
			//We don't care about adding the nullitope,
			//and we already dealt with vertices.
			if(m + n < 0)
				continue;
			
			//Same thing for n down here.
			if(n === -1)
				nDimCount = 1;
			else
				nDimCount = Q.elementList[n].length;
			
			//The indices of the elements we're multiplying.
			for(i = 0; i < mDimCount; i++) {
				//Nullitopes have no subelements.
				if(m === -1)
					iElCount = 0;
				//Points have only a single nullitope as a subelement.
				else if(m === 0)
					iElCount = 1;
				else
					iElCount = P.elementList[m][i].length;
				
				for(j = 0; j < nDimCount; j++) {
					//Same thing for n down here.
					if(n === -1)
						jElCount = 0;
					else if(n === 0)
						jElCount = 1;
					else
						jElCount = Q.elementList[n][j].length;
					
					//Adds the pyramid product of the ith m-element and the j-th n-element to the newElementList.
					//The elements of this product are the pyramid products of each of the first polytope's facets with the other polytope, and viceversa.
					//The pyramid product of a polytope and the nullitope is just the polytope itself.
					els = [];					
					
					//This loop won't be entered if m = -1.
					for(k = 0; k < iElCount; k++) {
						//A vertex has only a single nullitope, we index it as "the zeroth nullitope".
						if(m === 0)
							elIndx = 0;
						//We retrieve the index of the element's kth subelement.
						else
							elIndx = P.elementList[m][i][k];
						
						els.push(Polytope._getIndexOfTegumProduct(m - 1, elIndx, n, j, P, Q, memoizer, true));
					}
					//Same thing for n down here.
					for(k = 0; k < jElCount; k++) {
						if(n === 0)
							elIndx = 0;
						else
							elIndx = Q.elementList[n][j][k];
						
						els.push(Polytope._getIndexOfTegumProduct(m, i, n - 1, elIndx, P, Q, memoizer, true));
					}
					
					newElementList[m + n + 1].push(els);
				}
			}
		}
	}
	
	//Calculating the components is a special case.
	//We'll just tegum multiply the compounds of the first polytope with the compounds of the second.
	
	//m must be at least 0, since we already dealt with the case where P was a point.
	m = P.elementList.length - 1;
	mDimCount = mDimCount = P.elementList[m].length;
	n = Q.elementList.length - 1;
	nDimCount = nDimCount = Q.elementList[n].length;
	//The indices of the elements we're multiplying.
	for(i = 0; i < mDimCount; i++) {
		//Points have only a single nullitope as a subelement.
		if(m === 0)
			iElCount = 1;
		else
			iElCount = P.elementList[m][i].length;
		
		for(j = 0; j < nDimCount; j++) {
			//Same thing for n down here.
			if(n === 0)
				jElCount = 1;
			else
				jElCount = Q.elementList[n][j].length;
			
			//Adds the pyramid product of the ith m-element and the j-th n-element to the newElementList.
			//The elements of this product are the pyramid products of each of the first polytope's facets with the other polytope, and viceversa.
			//The pyramid product of a polytope and the nullitope is just the polytope itself.
			els = [];					
			
			for(k = 0; k < iElCount; k++) {
				//A vertex has only a single nullitope, we index it as "the zeroth nullitope".
				if(m === 0)
					elIndx = 0;
				//We retrieve the index of the element's kth subelement.
				else
					elIndx = P.elementList[m][i][k];
				
				for(l = 0; l < jElCount; l++) {
					//Same thing for n.
					if(n === 0)
						elIndx2 = 0;
					else
						elIndx2 = Q.elementList[n][j][k];
				
					els.push(Polytope._getIndexOfTegumProduct(m - 1, elIndx, n - 1, elIndx2, P, Q, memoizer, true));
				}
			}
			
			newElementList[m + n].push(els);
		}
	}
	
	return new PolytopeC(newElementList); //The construction gets added in the main function.
};

//Polytope._pyramidProduct, but also supports P being an array.
Polytope.pyramidProduct = function(P, Q) {
	return Polytope._product(P, Q, MULTIPYRAMID, Polytope._pyramidProduct);
};

//Calculates the pyramid product of P and Q.
//Edges are the products of vertices, faces are the products of vertices with edges or viceversa, and so on.
//Very similar to the tegum code.
Polytope._pyramidProduct = function(P, Q, height) {
	if(P.dimensions === -1)
		return Q;
	if(Q.dimensions === -1)
		return P;
	
	if(height === undefined)
		height = 0.5;
	else
		height /= 2;
	
	//Deals with the point, nullitope cases.
	if(P.dimensions <= 0)
		return Q;
	if(Q.dimensions <= 0)
		return P;
	
	var i, j, k, l, m, n, elIndx, elIndx2, iElCount, jElCount, mDimCount, nDimCount, els,
	newElementList = [[]],
	memoizer = [];
	
	//Adds vertices.
	for(i = 0; i < Q.elementList[0].length; i++)
		newElementList[0].push(Point.padLeft(Q.elementList[0][i], P.spaceDimensions).addCoordinate(height));
	height = -height; //Super trivial optimization.
	for(i = 0; i < P.elementList[0].length; i++)
		newElementList[0].push(Point.padRight(P.elementList[0][i], Q.spaceDimensions).addCoordinate(height));
	
	//Fills up newElementList.
	for(i = 1; i <= P.dimensions + Q.dimensions + 1; i++) 
		newElementList.push([]);
	
	//The dimensions of the subelements we're multiplying.
	for (m = -1; m <= P.dimensions; m++) {
		//Every polytope has a single nullitope.
		if(m === -1)
			mDimCount = 1;
		else
			mDimCount = P.elementList[m].length;
		
		for (n = -1; n <= Q.dimensions; n++) {
			//We don't care about adding the nullitope,
			//and we already dealt with vertices.
			if(m + n < 0)
				continue;
			
			//Same thing for n down here.
			if(n === -1)
				nDimCount = 1;
			else
				nDimCount = Q.elementList[n].length;
			
			//The indices of the elements we're multiplying.
			for(i = 0; i < mDimCount; i++) {
				//Nullitopes have no subelements.
				if(m === -1)
					iElCount = 0;
				//Points have only a single nullitope as a subelement.
				else if(m === 0)
					iElCount = 1;
				else
					iElCount = P.elementList[m][i].length;
				
				for(j = 0; j < nDimCount; j++) {
					//Same thing for n down here.
					if(n === -1)
						jElCount = 0;
					else if(n === 0)
						jElCount = 1;
					else
						jElCount = Q.elementList[n][j].length;
					
					//Adds the pyramid product of the ith m-element and the j-th n-element to the newElementList.
					//The elements of this product are the pyramid products of each of the first polytope's facets with the other polytope, and viceversa.
					//The pyramid product of a polytope and the nullitope is just the polytope itself.
					els = [];					
					
					//This loop won't be entered if m = -1.
					for(k = 0; k < iElCount; k++) {
						//A vertex has only a single nullitope, we index it as "the zeroth nullitope".
						if(m === 0)
							elIndx = 0;
						//We retrieve the index of the element's kth subelement.
						else
							elIndx = P.elementList[m][i][k];
						
						//We use an ever-so-slightly modified version of the tegum product function, since it's so similar to what we need.
						els.push(Polytope._getIndexOfTegumProduct(m - 1, elIndx, n, j, P, Q, memoizer, false));
					}
					//Same thing for n down here.
					for(k = 0; k < jElCount; k++) {
						if(n === 0)
							elIndx = 0;
						else
							elIndx = Q.elementList[n][j][k];
						
						els.push(Polytope._getIndexOfTegumProduct(m, i, n - 1, elIndx, P, Q, memoizer, false));
					}
					
					newElementList[m + n + 1].push(els);
				}
			}
		}
	}
	
	return new PolytopeC(newElementList); //The construction gets added in the main function.
};

//Helper function for tegumProduct and pyramidProduct.
//Gets the index of the product of the ith m-element and the jth n-element in the new polytope.
//Takes into account the order in which the elements are calculated and added.
//The only difference between the tegum case and the pyramid case is that for pyramids, we need to consider an extra column in memoizer.
Polytope._getIndexOfTegumProduct = function(m, i, n, j, P, Q, memoizer, tegum) {
	//Recall that the elements of a single dimension are added in order nullitope * facet, vertex * ridge, ...
	//memoizer[m][n] counts the number of such elements that we have to skip before we reach the multiplication we actually care about.
	//This number is found recursively, so we memoize to calculate it more efficiently.
	//offset calculates the index of our product within the products of elements of the same dimensions,
	//simply by recalling that this last ordering is lexicographic.
	var offset;
	if(m === -1)
		offset = j;
	else if(n === -1)
		offset = i;
	else
		offset = (i * Q.elementList[n].length) + j;
	
	m++; n++; //To avoid wacky negative indices
	if(memoizer[m]) {
		if(memoizer[m][n])
			return memoizer[m][n] + offset;
	}
	else 
		memoizer[m] = [];
	
	if(m === 0 || n === Q.elementList.length - (tegum ? 1 : 0))
		memoizer[m][n] = 0;
	else if (m === 1)
		memoizer[m][n] = memoizer[m - 1][n + 1] + Q.elementList[n].length;
	else
		memoizer[m][n] = memoizer[m - 1][n + 1] + P.elementList[m - 2].length * Q.elementList[n].length;
	return memoizer[m][n] + offset;
};

//Helper function.
//If P is not an array, performs the product dicated by type and fun of P and Q.
//If P is an array, same thing, but among P's elements.
Polytope._product = function(P, Q, type, fun) {
	if(P.length === 0)
		return Polytope.nullitope();
	
	var constructions = [], res;
	
	//If P is an array:
	if(P.length && P.length >= 1) {
		res = P.pop();
		constructions.push(res.construction);
		while(P.length) {
			//Stores the constructions of the elements of P in a temporary array.
			constructions.push(P[P.length - 1].construction);
			res = fun(P.pop(), res);
		}
		res.construction = new ConstructionNode(type, constructions);
		return res;
	}
	
	//If P and Q are just two polytopes:
	res = fun(P, Q);
	res.construction = new ConstructionNode(type, [P.construction, Q.construction]);
	return res;
};

//Extrudes a polytope to a pyramid with an apex at the specified point.
//Constructs pyramids out of elements recursively.
//The ith n-element in the original polytope gets extruded to the 
//(i+[(n+1)-elements in the original polytope])th element in the new polytope.
//TODO: Use the pyramid product for this instead.
Polytope.prototype.extrudeToPyramid = function(apex) {
	var P = this.toPolytopeC(),
	els, i;
	
	P.dimensions++;
	P.elementList.push([]);
	
	var oldElNumbers = [];
	for(i = 0; i <= P.dimensions; i++)
		oldElNumbers.push(P.elementList[i].length);
	
	//Adds apex.
	P.elementList[0].push(apex);		
	P.setSpaceDimensions(Math.max(apex.dimensions(), P.spaceDimensions));
	
	//Adds edges.
	for(i = 0; i < oldElNumbers[0]; i++)
		P.elementList[1].push([i, oldElNumbers[0]]);
	
	//Adds remaining elements.
	for(var d = 2; d <= P.dimensions; d++) {
		for(i = 0; i < oldElNumbers[d - 1]; i++) {
			els = [i];
			for(var j = 0; j < P.elementList[d - 1][i].length; j++)
				els.push(P.elementList[d - 1][i][j] + oldElNumbers[d - 1]);
			P.elementList[d].push(els);
		}
	}
	
	var construction = new ConstructionNode(PYRAMID, [P.construction]);
	P.construction = construction;
	return P;
};

//TODO: Add a PolytopeS version.
Polytope.prototype.extrudeToPrism = function(height) {
	return Polytope.prismProduct(this.toPolytopeC(), Polytope.dyad(height));
};

//Builds a polygon from the vertices given in order.
Polytope.polygon = function(points) {
	var newElementList = [[], [], [[]]], i = 0;
	
	for(; i < points.length - 1; i++) {
		newElementList[0].push(points[i]);
		newElementList[1].push([i, i + 1]);
		newElementList[2][0].push(i);
	}
	
	newElementList[0].push(points[i]);
	newElementList[1].push([i, 0]);
	newElementList[2][0].push(i);
	
	return new PolytopeC(newElementList, new ConstructionNode(POLYGON, [points.length, 1]));
};

//Builds a n/d star.
//If n and d are not coprime, a regular polygon compound is made instead.
//In the future, should be replaced by the PolytopeS version.
Polytope.regularPolygon = function(n, d) {
	var gcd;
	if(d === undefined) {
		d = 1;
		gcd = 1;
	}
	else
		gcd = Polytope._gcd(n, d);
	
	var els = [[], [], []],
	n_gcd = n / gcd,
	counter = 0,
	comp,
	i, j, x = 0, y = d,
	angle = 0,
	invRad = 2 * Math.sin(Math.PI * d / n); //1 / the circumradius.
	
	for(i = 0; i < n; i++) {
		els[0].push(new Point([Math.cos(angle) / invRad, Math.sin(angle) / invRad])); //Vertices
		angle += 2 * Math.PI / n;
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
	
	return new PolytopeC(els, new ConstructionNode(POLYGON, [n, d]));
};

//Helper function for regularPolygon.
//Just the most basic form of the Euclidean algorithm.
Polytope._gcd = function(n, d) {
	var t;
	while (d !== 0) {
		t = d;
		d = n % d;
		n = t;
	}
	return n;
};	

//Builds a Grünbaumian n/d star.
//In the future, should be replaced by the PolytopeS version.
Polytope.regularPolygonG = function(n, d) {
	if(d === undefined)
		d = 1;
	
	var els = [[], [], [[]]],
	i,
	angle = 0,
	invRad = 2 * Math.sin(Math.PI * d / n); //1 / the circumradius
	
	for(i = 0; i < n; i++) {
		els[0].push(new Point([Math.cos(angle) / invRad, Math.sin(angle) / invRad])); //Vertices
		els[2][0].push(i); //Face.
		angle += 2 * Math.PI * d / n;
	}
	
	for(i = 0; i < n - 1; i++)
		els[1].push([i, i + 1]); //Edges
	els[1].push([els[0].length - 1, 0]);
	
	return new PolytopeC(els, new ConstructionNode(POLYGON, [n, d]));
};

//Builds a hypercube in the specified amount of dimensions.
//Positioned in the standard orientation with edge length 1.
//In the future, will be replaced by the PolytopeS version.
Polytope.hypercube = function(dimensions) {
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
//In the future, will be replaced by the PolytopeS version.
Polytope.simplex = function(dimensions) {
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
//In the future, will be replaced by the PolytopeS version.
Polytope.cross = function(dimensions) {
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

//Creates a uniform {n / d} antiprism.
//Only meant for when (n, d) = 1.
Polytope.uniformAntiprism = function(n, d) {
	if(d === undefined)
		d = 1;
	var x = n / d,
	scale = 2 * Math.sin(Math.PI / x), //Guarantees an unit edge length polytope.
	height = Math.sqrt((Math.cos(Math.PI / x) - Math.cos(2 * Math.PI / x)) / 2) / scale, //Half of the distance between bases.
	base1 = [], base2 = [], newElementList = [[], [], [base1, base2], [[]]],
	i = 0; //The edges in the bases.
	
	while(i < 2 * (n - 1)) {
		//Vertices.
		newElementList[0].push(new Point([Math.cos(Math.PI * (i / x)) / scale, Math.sin(Math.PI * (i / x)) / scale, height]));
		//Equatorial edges, top & bottom edges.
		newElementList[1].push([i, i + 1], [i, i + 2]);
		//Triangular faces.
		newElementList[2].push([2 * i, 2 * i + 1, 2 * i + 2]);
		//Polygonal faces.
		base1.push(2 * i + 1);
		i++;
		
		//Same thing down here:
		newElementList[0].push(new Point([Math.cos(Math.PI * (i / x)) / scale, Math.sin(Math.PI * (i / x)) / scale, -height]));
		newElementList[1].push([i, i + 1]);
		newElementList[1].push([i, i + 2]);
		newElementList[2].push([2 * i, 2 * i + 1, 2 * i + 2]);
		base2.push(2 * i + 1);
		i++;
	}
	
	//Adds last elements.
	newElementList[0].push(new Point([Math.cos(Math.PI * (i / x)) / scale, Math.sin(Math.PI * (i / x)) / scale, height]));
	newElementList[1].push([i, i + 1]);
	newElementList[1].push([i, 0]);
	newElementList[2].push([2 * i, 2 * i + 1, 2 * i + 2]);
	base1.push(2 * i + 1);
	i++;
	
	newElementList[0].push(new Point([Math.cos(Math.PI * (i / x)) / scale, Math.sin(Math.PI * (i / x)) / scale, -height]));
	newElementList[1].push([i, 0], [i, 1]);
	newElementList[2].push([2 * i, 2 * i + 1, 0]);
	base2.push(2 * i + 1);
	
	//Adds component.
	for(i = 0; i < 2 * (n + 1); i++)
		newElementList[3][0].push(i);
	
	return new PolytopeC(newElementList, new ConstructionNode(ANTIPRISM, [new ConstructionNode(POLYGON, [n, d])]));
};

//Creates an {n / d} cupola with regular faces.
Polytope.cupola = function(n, d) {
	if(d === undefined)
		d = 1;
	var x = n / d,
	r1 = 1 / (2 * Math.sin(Math.PI / x)), //Radius of the smaller base.
	r2 = 1 / (2 * Math.sin(Math.PI / (2 * x))), //Radius of the larger base.
	t = 1 / (2 * Math.tan(Math.PI / x)) - 1 / (2 * Math.tan(Math.PI / (2 * x))), //Temporary variable.
	h0 = Math.sqrt(1 - t * t), //Distance between bases.
	h1 = ((r2 * r2 - r1 * r1) / h0 + h0) / 2, //Distance between circumcenter and smaller base.
	h2 = h1 - h0, //Distance between circumcenter and larger base.
	base1 = [], base2 = [], newElementList = [[], [], [base1, base2], [[]]], //List of elements of the cupola.
	i;
	
	for(i = 0; i < n - 1; i++) {
		//Small base's vertices.
		newElementList[0].push(new Point([r1 * Math.cos(2 * Math.PI * (i / x)), r1 * Math.sin(2 * Math.PI * (i / x)), h1]));
		//Small base's edges.
		newElementList[1].push([i, i + 1]);
		//Connecting edges.
		newElementList[1].push([i, n + 2 * i]);
		newElementList[1].push([i, n + 2 * i + 1]);
		//Triangles.
		newElementList[2].push([3 * i + 1, 3 * i + 2, 3 * n + 2 * i]);
		//Squares.		
		newElementList[2].push([3 * i + 2, 3 * n + 2 * i + 1, 3 * i + 4, 3 * i]);
		//Small base.
		base1.push(3 * i);
	}
	
	//Adds last elements.
	newElementList[0].push(new Point([r1 * Math.cos(2 * Math.PI * (i / x)), r1 * Math.sin(2 * Math.PI * (i / x)), h1]));
	newElementList[1].push([i, 0]);
	newElementList[1].push([i, n + 2 * i]);
	newElementList[1].push([i, n + 2 * i + 1]);
	newElementList[2].push([3 * i + 1, 3 * i + 2, 3 * n + 2 * i]);
	newElementList[2].push([3 * i + 2, 3 * n + 2 * i + 1, 1, 3 * i]);
	base1.push(3 * i);
	
	for(i = 0; i < 2 * n - 1; i++) {
		//Big base's vertices.
		newElementList[0].push(new Point([r2 * Math.cos(Math.PI * ((i - 0.5) / x)), r2 * Math.sin(Math.PI * ((i - 0.5) / x)), h2]));
		//Big base's edges.
		newElementList[1].push([n + i, n + i + 1]);
		//Big base.
		base2.push(3 * n + i);
	}
	//Adds last elements.
	newElementList[0].push(new Point([r2 * Math.cos(Math.PI * ((i - 0.5) / x)), r2 * Math.sin(Math.PI * ((i - 0.5) / x)), h2]));
	newElementList[1].push([n + i, n]);
	base2.push(3 * n + i);
	
	for(i = 0; i < 2 * n + 2; i++)
		newElementList[3][0].push(i);
	
	return new PolytopeC(newElementList, new ConstructionNode(CUPOLA, [new ConstructionNode(POLYGON, [n, d])]));
};

//Creates an {n / d} cuploid with regular faces.
Polytope.cuploid = function(n, d) {
	if(d === undefined)
		d = 1;
	var x = n / d,
	r1 = 1 / (2 * Math.sin(Math.PI / x)), //Radius of the smaller base.
	r2 = 1 / (2 * Math.sin(Math.PI / (2 * x))), //Radius of the larger base.
	t = 1 / (2 * Math.tan(Math.PI / x)) - 1 / (2 * Math.tan(Math.PI / (2 * x))), //Temporary variable.
	h0 = Math.sqrt(1 - t * t), //Distance between bases.
	h1 = ((r2 * r2 - r1 * r1) / h0 + h0) / 2, //Distance between circumcenter and smaller base.
	h2 = h1 - h0, //Distance between circumcenter and larger base.
	base = [], newElementList = [[], [], [base], [[]]], //List of elements of the cupola.
	i;
	
	for(i = 0; i < n - 1; i++) {
		//Small base's vertices.
		newElementList[0].push(new Point([r1 * Math.cos(2 * Math.PI * (i / x)), r1 * Math.sin(2 * Math.PI * (i / x)), h1]));
		//Small base's edges.
		newElementList[1].push([i, i + 1]);
		//Connecting edges.
		newElementList[1].push([i, n + 2 * i]);
		newElementList[1].push([i, n + 2 * i + 1]);
		//Triangles.
		newElementList[2].push([3 * i + 1, 3 * i + 2, 3 * n + 2 * i]);
		//Squares.		
		newElementList[2].push([3 * i + 2, 3 * n + 2 * i + 1, 3 * i + 4, 3 * i]);
		//Small base.
		base.push(3 * i);
	}
	
	//Adds last elements.
	newElementList[0].push(new Point([r1 * Math.cos(2 * Math.PI * (i / x)), r1 * Math.sin(2 * Math.PI * (i / x)), h1]));
	newElementList[1].push([i, 0]);
	newElementList[1].push([i, n + 2 * i]);
	newElementList[1].push([i, n + 2 * i + 1]);
	newElementList[2].push([3 * i + 1, 3 * i + 2, 3 * n + 2 * i]);
	newElementList[2].push([3 * i + 2, 3 * n + 2 * i + 1, 1, 3 * i]);
	base.push(3 * i);
	
	for(i = 0; i < 2 * n - 1; i++) {
		//Big base's vertices.
		newElementList[0].push(new Point([r2 * Math.cos(Math.PI * ((i - 0.5) / x)), r2 * Math.sin(Math.PI * ((i - 0.5) / x)), h2]));
		//Big base's edges.
		newElementList[1].push([n + i, n + i + 1]);
	}
	//Adds last elements.
	newElementList[0].push(new Point([r2 * Math.cos(Math.PI * ((i - 0.5) / x)), r2 * Math.sin(Math.PI * ((i - 0.5) / x)), h2]));
	newElementList[1].push([n + i, n]);
	
	for(i = 0; i < 2 * n + 1; i++)
		newElementList[3][0].push(i);
	
	return new PolytopeC(newElementList, new ConstructionNode(CUPLOID, [new ConstructionNode(POLYGON, [n, d])]));
};

//Creates an {n / d} cupolaic blend with regular faces.
Polytope.cupolaicBlend = function(n, d) {
	if(d === undefined)
		d = 1;
	var x = n / d,
	r1 = 1 / (2 * Math.sin(Math.PI / x)), //Radius of the smaller base.
	r2 = 1 / (2 * Math.sin(Math.PI / (2 * x))), //Radius of the larger base.
	t = 1 / (2 * Math.tan(Math.PI / x)) - 1 / (2 * Math.tan(Math.PI / (2 * x))), //Temporary variable.
	h0 = Math.sqrt(1 - t * t), //Distance between bases.
	h1 = ((r2 * r2 - r1 * r1) / h0 + h0) / 2, //Distance between circumcenter and smaller base.
	h2 = h1 - h0, //Distance between circumcenter and larger base.
	base1 = [], base2 = [], newElementList = [[], [], [base1, base2], [[]]], //List of elements of the cupola.
	i, even = true;
	
	for(i = 0; i < 2 * (n - 1); i++) {
		//Small bases' vertices.
		newElementList[0].push(new Point([r1 * Math.cos(Math.PI * (i / x)), r1 * Math.sin(Math.PI * (i / x)), h1]));
		//Small bases' edges.
		newElementList[1].push([i, i + 2]);
		//Connecting edges.
		newElementList[1].push([i, 2 * n + i]);
		newElementList[1].push([i, 2 * n + i + 1]);
		//Triangles.
		newElementList[2].push([3 * i + 1, 3 * i + 2, 6 * n + i]);
		//Squares.		
		newElementList[2].push([3 * i + 2, 6 * n + i + 1, 3 * i + 7, 3 * i]);
		//Small base.
		if(even)
			base1.push(3 * i);
		else			
			base2.push(3 * i);
		even = !even;
	}
	
	//Adds last elements.
	newElementList[0].push(new Point([r1 * Math.cos(Math.PI * (i / x)), r1 * Math.sin(Math.PI * (i / x)), h1]));
	newElementList[1].push([i, 0]);
	newElementList[1].push([i, 2 * n + i]);
	newElementList[1].push([i, 2 * n + i + 1]);
	newElementList[2].push([3 * i + 1, 3 * i + 2, 6 * n + i]);	
	newElementList[2].push([3 * i + 2, 6 * n + i + 1, 1, 3 * i]);
	base1.push(3 * i);
	i++;
	
	newElementList[0].push(new Point([r1 * Math.cos(Math.PI * (i / x)), r1 * Math.sin(Math.PI * (i / x)), h1]));
	newElementList[1].push([i, 1]);
	newElementList[1].push([i, 2 * n + i]);
	newElementList[1].push([i, 2 * n]);
	newElementList[2].push([3 * i + 1, 3 * i + 2, 6 * n + i]);	
	newElementList[2].push([3 * i + 2, 6 * n, 4, 3 * i]);
	base2.push(3 * i);
	
	for(i = 0; i < 2 * n - 1; i++) {
		//Big base's vertices.
		newElementList[0].push(new Point([r2 * Math.cos(Math.PI * ((i - 0.5) / x)), r2 * Math.sin(Math.PI * ((i - 0.5) / x)), h2]));
		//Big base's edges.
		newElementList[1].push([2 * n + i, 2 * n + i + 1]);
	}
	//Adds last elements.
	newElementList[0].push(new Point([r2 * Math.cos(Math.PI * ((i - 0.5) / x)), r2 * Math.sin(Math.PI * ((i - 0.5) / x)), h2]));
	newElementList[1].push([2 * n + i, 2 * n]);
	
	for(i = 0; i < 2 * n + 1; i++)
		newElementList[3][0].push(i);
	
	return new PolytopeC(newElementList, new ConstructionNode(CUPBLEND, [new ConstructionNode(POLYGON, [n, d])]));
};

//The event triggered by the OFF import button.
//Reads the OFF file into the global variable P.
//Eventually, P should be replaced by scene.Polytope or something of the sort.
Polytope.openOFF = function(e) {	
	var file = e.target.files[0];
	if (!file)
		return;
	var reader = new FileReader(),
	contents; //Contents of OFF file.
	
	//File name of imported polytope. Stored in a global variable so it can be accessed from Polytope._readerOnload.
	Polytope.fileName = e.target.files[0].name; 
	
	Polytope.fileName = Polytope.fileName.substr(0, Polytope.fileName.lastIndexOf(".")); //Removes extension from file name.
	if(LANGUAGE !== GERMAN)
		Polytope.fileName = Translation.firstToLower(Polytope.fileName); //Lowercase name.
	
	reader.onload = Polytope._readerOnload;
	
	reader.readAsText(file);
};

//Helper function for OFF importing.
Polytope._readerOnload = function(e) {
	var caret = new Caret(e.target.result), //Caret for reading the OFF file.	
	component, //A component of the polytope.
	dimensions = caret.readNumber(), //The number of dimensions of the OFF file's polytope.
	el, //An element of the polytope.
	elCount = 0, //The number of facets in an element of the polytope.
	edgeList = [], //A dictionary mapping hashes of pairs of integers to edge indices.
	elementCount = [], //The amount of vertices, edges, faces... elementCount[1] goes unused except for the special case of 2D components.
	elementList = [[]], //The elements of the described polytope.
	face, //A face of the polytope.
	facets, //The list of facets of the polytope.
	i, j, x, y, t; //Temporary variables used in for loops.
	
	//The file just starts with OFF.
	if(isNaN(dimensions))
		dimensions = 3;
	
	//Checks that the word OFF is the next thing on the file.
	if(caret.readWord() !== "OFF")
		caret.throwError("invalidFile");
	
	//Nullitope
	if(dimensions === -1) {
		P = Polytope.nullitope();
		return;
	}
	
	//Point
	if(dimensions === 0) {
		P = Polytope.point();
		return;
	}
	
	//Reads vertex amount.
	if(dimensions >= 1) {
		elementCount.push(caret.readNumber());
		elementList.push([]);
	}
	
	//Reads face and edge amounts.
	if(dimensions >= 3) {
		elementCount.push(null, caret.readNumber());
		caret.readWord(); //We can't actually care about the edge amount, since Stella itself ignores it.
		elementList.push([], []);
	}
	
	//Reads component amount in the special 2OFF case.
	else if(dimensions === 2) {
		elementCount.push(null, caret.readNumber());
		elementList.push([]);
	}
	
	//Reads higher element amounts.
	for(i = 3; i < dimensions; i++) {
		elementCount.push(caret.readNumber());
		elementList.push([]);
	}
	
	//Adds vertices.
	for(i = 0; i < elementCount[0]; i++) {
		el = [];
		for(j = 0; j < dimensions; j++)
			el.push(caret.readNumber());
		elementList[0].push(new Point(el));
	}
	
	if(dimensions >= 2) {
		//Adds faces and edges (or compounds in the special case).
		for(i = 0; i < elementCount[2]; i++) {
			el = [];
			face = [];
			elCount = caret.readNumber();
			
			//Retrieves vertices.
			for(j = 0; j < elCount; j++)
				el.push(caret.readNumber());
			
			//Creates edges.
			for(j = 0; j < elCount - 1; j++) {
				//Orders the edge's vertices.
				x = el[j];
				y = el[j + 1];
				if(x < y) {
					t = x;
					x = y;
					y = t;
				}
				t = (x + y + 1) * (x + y) / 2 + y; //Cantor pairing function.
				if(edgeList[t] === undefined) {
					edgeList[t] = elementList[1].length;
					elementList[1].push([x, y]);
				}
				face.push(edgeList[t]);
			}
			//Last edge.
			x = el[0];
			y = el[el.length - 1];
			if(x < y) {
				t = x;
				x = y;
				y = t;
			}
			t = (x + y + 1) * (x + y) / 2 + y; //Cantor pairing function.
			if(edgeList[t] === undefined) {
				edgeList[t] = elementList[1].length;
				elementList[1].push([x, y]);
			}
			face.push(edgeList[t]);
			
			elementList[2].push(face);
		}
	}
	
	//Adds higher-dimensional elements.
	for(i = 3; i < dimensions; i++) {
		for(j = 0; j < elementCount[i]; j++) {
			el = [];
			elCount = caret.readNumber();
			for(t = 0; t < elCount; t++)
				el.push(caret.readNumber());
			elementList[i].push(el);
		}
	}
	
	//Gets components. The 1D case is trivial.
	if(dimensions === 1) {
		elementList[1].push([]);
		for(i = 0; i < elementCount[0]; i++)
			elementList[1][0].push(i);
	}
	
	//Gets components in higher dimensions, except in 2D, where they've already been retrieved.
	else if(dimensions >= 3) {
		//Reuses for graph of incidences between facets.
		el = [];
		facets = elementList[elementList.length - 2];
		for(i = 0; i < facets.length; i++)
			el.push(new GraphNode(i));
		//Calculates incidences.
		for(i = 0; i < facets.length; i++)
			for(j = i + 1; j < facets.length; j++)
				if(Polytope._checkCommonElements(facets[i], facets[j]))
					el[i].connectTo(el[j]);
				
		//Gets components.
		for(i = 0; i < facets.length; i++) {
			component = el[i].getComponent();
			if(component)
				elementList[elementList.length - 1].push(component);
		}
	}
	
	P = new PolytopeC(elementList, new ConstructionNode(NAME, [Polytope.fileName]));
};

//Helper function for OFF importing.
//Checks whether two arrays have a common element using a dictionary.
Polytope._checkCommonElements = function(a, b) {
	var vals = {}, i;
	vals[a[i]] = true;
	
	for(i = 1; i < a.length; i++) {
		if(vals[a[i]])
			return true;
		vals[a[i]] = true;
	}
	for(i = 0; i < b.length - 1; i++) {
		if(vals[b[i]])
			return true;
		vals[b[i]] = true;
	}
	
	if(vals[b[i]])
		return true;
	return false;
};

//Saves the current polytope as an OFF file.
//If comments, the OFF file will contain comments dividing the different element types.
Polytope.prototype.saveAsOFF = function(comments) {
	var P = this.toPolytopeC(),
	i, j, coord, vertices;
	
	if(P.spaceDimensions > P.dimensions) {
		//Maybe automatically project the polytope?
		alert("The OFF format does not support polytopes in spaces with more dimensions than themselves.");
		return;
	}
	//The contexts of the OFF file, as an array of plaintext strings.
	var data = [];
	
	//Writes the element counts, and optionally, leaves a comment listing their names in order.
	switch(P.dimensions) {
		case 0: //LOL
			data.push("0OFF");
			break;
		case 1: //Also LOL
			data.push("1OFF\n");
			if(comments)
				data.push("# ", Translation.elementName(0, PLURAL ^ UPPERCASE), "\n");
			data.push(P.elementList[0].length, "\n");
			break;
		case 2:
			data.push("2OFF\n");
			if(comments)
				data.push("# ", Translation.elementName(0, PLURAL ^ UPPERCASE), ", ", Translation.get("component", PLURAL ^ UPPERCASE), "\n");
			data.push(P.elementList[0].length, " ", P.elementList[2].length, "\n");
			break;
		case 3:
			data.push("OFF\n"); //For compatibility.
			if(comments)			
				data.push("# ", Translation.elementName(0, PLURAL ^ UPPERCASE), ", ", Translation.elementName(2, PLURAL ^ UPPERCASE), ", ", Translation.elementName(1, PLURAL ^ UPPERCASE), "\n");
			data.push(P.elementList[0].length, " ", P.elementList[2].length, " ", P.elementList[1].length, "\n");
			break;
		default:
			data.push(P.dimensions, "OFF\n");
			if(comments) {				
				data.push("# ", Translation.elementName(0, PLURAL ^ UPPERCASE), ", ", Translation.elementName(2, PLURAL ^ UPPERCASE), ", ", Translation.elementName(1, PLURAL ^ UPPERCASE));
				for(i = 3; i < P.dimensions; i++)
					data.push(", ", Translation.elementName(i, PLURAL ^ UPPERCASE));
				data.push("\n");
			}
			data.push(P.elementList[0].length, " ", P.elementList[2].length, " ", P.elementList[1].length, " ");
			for(i = 3; i < P.dimensions - 1; i++)					
				data.push(P.elementList[i].length, " ");
			data.push(P.elementList[P.dimensions - 1].length, "\n");
	}
	
	//Adds vertices. Fills in zeros if spaceDimensions < dimensions.
	if(comments)
		data.push("\n# ", Translation.elementName(0, PLURAL ^ UPPERCASE), "\n");

	for(i = 0; i < P.elementList[0].length; i++) {
		for(j = 0; j < P.dimensions - 1; j++) {
			coord = P.elementList[0][i].coordinates[j];
			if(coord === undefined)
				data.push("0 ");
			else
				data.push(coord, " ");
		}
		coord = P.elementList[0][i].coordinates[P.dimensions - 1];
		if(coord === undefined)
			data.push("0\n");
		else
			data.push(coord, "\n");
	}
	
	//Adds faces, or copmonents for compound polygons.
	if(P.dimensions >= 2) {
		if(comments) {
			if(P.dimensions === 2)
				data.push("\n# ", Translation.get("component", PLURAL ^ UPPERCASE), "\n");
			else 
				data.push("\n# ", Translation.elementName(2, PLURAL ^ UPPERCASE), "\n");
		}
		for(i = 0; i < P.elementList[2].length; i++) {
			vertices = P.faceToVertices(i);
			data.push(P.elementList[2][i].length);
			for(j = 0; j < P.elementList[2][i].length; j++)
				data.push(" ", vertices[j]);
			data.push("\n");
		}
	}
		
	//Adds the rest of the elements.
	for(var d = 3; d < P.dimensions; d++) {
		if(comments) {
			data.push("\n# ", Translation.elementName(d, PLURAL ^ UPPERCASE), "\n");
		}
		for(i = 0; i < P.elementList[d].length; i++) {
			data.push(P.elementList[d][i].length);
			for(j = 0; j < P.elementList[d][i].length; j++)
				data.push(" ", P.elementList[d][i][j]);
			data.push("\n");
		}
	}
	
	Polytope._saveFile(data, "text/plain", Translation.firstToUpper(P.getName()) + ".off");
};

//Saves the file with the given data, the given MIME type, and the given extension.
//Adapted from https://stackoverflow.com/a/45120037/ (by Thomas Praxl),
//and from https://stackoverflow.com/a/46233123/12419072 (by Jaromanda X)
//to deal with the IE case.
Polytope._saveFile = function(data, type, fileName) {
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