"use strict";
/**
 * The constructor for the `Polytope` class.
 * @constructor
 * @param {ConstructionNode} construction The constructionNode representing how the polytope was built.
 * @classDesc A class for general polytopes, and functions of general polytopes.
 * Other than the construction property (which stores how the polytope was created),
 * instances of this class doesn't contain any properties by default.
 * These are set in the {@link PolytopeC} (combinatorial) and {@link PolytopeS}
 * (symmetry) subclasses.
 */
function Polytope(construction) {
    this.construction = construction;
    this.construction.polytope = this;
}
;
/**
 * Scales a polytope up or down.
 * @param {number} r The scaling factor.
 * @returns {Polytope} The scaled polytope.
*/
Polytope.prototype.scale = function (r) {
    for (var i = 0; i < this.elementList[0].length; i++)
        this.elementList[0][i].scale(r);
    return this;
};
/**
 * Moves a polytope by a vector.
 * @param {Point} P The translation vector.
 * @returns {Polytope} The translated polytope.
*/
Polytope.prototype.move = function (P) {
    for (var i = 0; i < this.elementList[0].length; i++)
        this.elementList[0][i].add(P);
    return this;
};
/**
 * Moves a polytope by the negative of a vector.
 * @param {Point} P The negative of the translation vector.
 * @returns {Polytope} The translated polytope.
*/
Polytope.prototype.moveNeg = function (P) {
    for (var i = 0; i < this.elementList[0].length; i++)
        this.elementList[0][i].subtract(P);
    return this;
};
/**
 * Gets the name of a polytope. Internally calls
 * [ConstructionNode.prototype.getName]{@linkcode ConstructionNode#getName}.
 * @returns {string} The name of the polytope.
 * @example
 * //"great heptagram"
 * Polytope.regularPolygon(7,3).getName();
 *
 * //"pentachoric prism"
 * Polytope.simplex(4).extrudeToPrism(1).getName();
 *
 * //"pentagonal bipyramid"
 * Polytope.tegumProduct(Polytope.regularPolygon(5), Polytope.dyad()).getName();

*/
Polytope.prototype.getName = function () {
    return this.construction.getName();
};
/**
 * Calculates the circumradius of a polytope.
 * @returns {number} The polytope's circumradius.
 * @todo Actually implement this properly!
*/
Polytope.prototype.circumradius = function () {
    return this.elementList[0][0].magnitude();
};
/**
 * Simple auxiliary function to get the length of a regular polygon's vertex figure.
 * @param {number} n The number of sides of the polygon.
 * @param {number} d The winding number of the polygon.
 */
Polytope.verfLength = function (n, d) {
    if (d === undefined)
        d = 1;
    return 2 * Math.cos(Math.PI / (n / d));
};
/**
 * Creates the null polytope.
 * @returns An instance of the null polytope.
 */
Polytope.nullitope = function () {
    return new PolytopeC([], new ConstructionNode(ConstructionNodeType.Codename, "nullitope"));
};
/**
 * Creates the point polytope.
 * @returns An instance of the point polytope.
 */
Polytope.point = function () {
    return new PolytopeC([[new Point([])]], new ConstructionNode(ConstructionNodeType.Codename, "point"));
};
/**
 * Creates a dyad (line segment) of a specified length.
 * @param {number} length The length of the dyad.
 * @returns A dyad of the specified length.
 */
Polytope.dyad = function (length) {
    //The dyad's length defaults to 1.
    //Note that the variable name length is actually a misnomer, and will store half of the length instead.
    if (length === undefined)
        length = 0.5;
    else
        length /= 2;
    return new PolytopeC([[new Point([-length]), new Point([length])], [[0, 1]]], new ConstructionNode(ConstructionNodeType.Codename, "dyad"));
};
/**
 * Calculates the prism product (Cartesian product) of a set of polytopes.
 * Vertices are the products of vertices, edges are the products of vertices
 * with edges or viceversa, and so on.
 * @summary Calculates the prism product of a set of polytopes.
 * @param {...Polytope} P The list of polytopes to "multiply" together.
 */
Polytope.prismProduct = function (...P) {
    return Polytope._product(P, ConstructionNodeType.Multiprism, Polytope._prismProduct);
};
/**
 * Helper function for {@link Polytope.prismProduct}.
 * Is the one actually performing the product.
 * Takes the prism product of two polytopes.
 * @private
 * @param {Polytope} P The first polytope to multiply.
 * @param {Polytope} Q The second polytope to multiply.
 */
Polytope._prismProduct = function (P, Q) {
    //Deals with the point, nullitope cases.
    if (P.dimensions === 0)
        return Q;
    if (Q.dimensions === 0)
        return P;
    if (P.dimensions === -1 || Q.dimensions === -1)
        return Polytope.nullitope();
    var i, j, k, m, n, els, newElementList = [[]], memoizer = [];
    //Adds vertices.
    for (i = 0; i < P.elementList[0].length; i++)
        for (j = 0; j < Q.elementList[0].length; j++)
            newElementList[0].push(Point.product(P.elementList[0][i], Q.elementList[0][j]));
    //Fills up newElementList.
    for (i = 1; i <= P.dimensions + Q.dimensions; i++)
        newElementList.push([]);
    //The dimensions of the subelements we're multiplying.
    for (m = 0; m <= P.dimensions; m++) {
        for (n = (m === 0 ? 1 : 0); n <= Q.dimensions; n++) {
            //The indices of the elements we're multiplying.
            for (i = 0; i < P.elementList[m].length; i++) {
                for (j = 0; j < Q.elementList[n].length; j++) {
                    //Adds the Cartesian product of the ith m-element and the j-th n-element to the newElementList.
                    //The elements of this product are the prism products of each of the first polytope's facets with the other polytope, and viceversa.
                    els = [];
                    //Vertices don't have facets!
                    if (m !== 0)
                        for (k = 0; k < P.elementList[m][i].length; k++)
                            els.push(Polytope._getIndexOfPrismProduct(m - 1, P.elementList[m][i][k], n, j, P, Q, memoizer));
                    if (n !== 0)
                        for (k = 0; k < Q.elementList[n][j].length; k++)
                            els.push(Polytope._getIndexOfPrismProduct(m, i, n - 1, Q.elementList[n][j][k], P, Q, memoizer));
                    newElementList[m + n].push(els);
                }
            }
        }
    }
    return new PolytopeC(newElementList); //The construction gets added in the main function.
};
/**
 * Helper function for {@link Polytope.prismProduct}.
 * Gets the index of the product of the ith m-element of P
 * and the jth n-element of Q in the new polytope.
 * Takes into account the order in which the elements are calculated and added.
 * @summary Helper function for {@link Polytope.prismProduct}.
 * @private
 * @param {number} m The dimension of an element on the first polytope.
 * @param {number} i The index of an element on the first polytope.
 * @param {number} n The dimension of an element on the second polytope.
 * @param {number} j The index of an element on the second polytope.
 * @param {Polytope} P The first polytope to multiply.
 * @param {Polytope} Q The second polytope to multiply.
 * @param {number[][]} memoizer An array to store past calculations.
 */
Polytope._getIndexOfPrismProduct = function (m, i, n, j, P, Q, memoizer) {
    //Recall that the elements of a single dimension are added in order vertex * facet, edge * ridge, ...
    //memoizer[m][n] counts the number of such elements that we have to skip before we reach the multiplication we actually care about.
    //This number is found recursively, so we memoize to calculate it more efficiently.
    //offset calculates the index of our product within the products of elements of the same dimensions,
    //simply by recalling that this last ordering is lexicographic.
    var offset = (i * Q.elementList[n].length) + j;
    if (memoizer[m]) {
        if (memoizer[m][n])
            return memoizer[m][n] + offset;
    }
    else
        memoizer[m] = [];
    if (m === 0 || n === Q.elementList.length - 1)
        memoizer[m][n] = 0;
    else
        memoizer[m][n] = memoizer[m - 1][n + 1] + P.elementList[m - 1].length * Q.elementList[n + 1].length;
    return memoizer[m][n] + offset;
};
//Polytope._tegumProduct, but also supports P being an array.
Polytope.tegumProduct = function (...P) {
    return Polytope._product(P, ConstructionNodeType.Multitegum, Polytope._tegumProduct);
};
//Calculates the tegum product, or rather the dual of the Cartesian product, of P and Q.
//Edges are the products of vertices, faces are the products of vertices with edges or viceversa, and so on.
Polytope._tegumProduct = function (P, Q) {
    //Deals with the point, nullitope cases.
    if (P.dimensions <= 0)
        return Q;
    if (Q.dimensions <= 0)
        return P;
    var i, j, k, l, m, n, elIndx, elIndx2, iElCount, jElCount, mDimCount, nDimCount, els, newElementList = [[]], memoizer = [];
    //Adds vertices.
    for (i = 0; i < Q.elementList[0].length; i++)
        newElementList[0].push(Point.padLeft(Q.elementList[0][i], P.spaceDimensions));
    for (i = 0; i < P.elementList[0].length; i++)
        newElementList[0].push(Point.padRight(P.elementList[0][i], Q.spaceDimensions));
    //Fills up newElementList.
    for (i = 1; i <= P.dimensions + Q.dimensions; i++)
        newElementList.push([]);
    //The dimensions of the subelements we're multiplying.
    for (m = -1; m < P.dimensions; m++) {
        //Every polytope has a single nullitope.
        if (m === -1)
            mDimCount = 1;
        else
            mDimCount = P.elementList[m].length;
        for (n = -1; n < Q.dimensions; n++) {
            //We don't care about adding the nullitope,
            //and we already dealt with vertices.
            if (m + n < 0)
                continue;
            //Same thing for n down here.
            if (n === -1)
                nDimCount = 1;
            else
                nDimCount = Q.elementList[n].length;
            //The indices of the elements we're multiplying.
            for (i = 0; i < mDimCount; i++) {
                //Nullitopes have no subelements.
                if (m === -1)
                    iElCount = 0;
                //Points have only a single nullitope as a subelement.
                else if (m === 0)
                    iElCount = 1;
                else
                    iElCount = P.elementList[m][i].length;
                for (j = 0; j < nDimCount; j++) {
                    //Same thing for n down here.
                    if (n === -1)
                        jElCount = 0;
                    else if (n === 0)
                        jElCount = 1;
                    else
                        jElCount = Q.elementList[n][j].length;
                    //Adds the pyramid product of the ith m-element and the j-th n-element to the newElementList.
                    //The elements of this product are the pyramid products of each of the first polytope's facets with the other polytope, and viceversa.
                    //The pyramid product of a polytope and the nullitope is just the polytope itself.
                    els = [];
                    //This loop won't be entered if m == -1.
                    for (k = 0; k < iElCount; k++) {
                        //A vertex has only a single nullitope, we index it as "the zeroth nullitope".
                        if (m === 0)
                            elIndx = 0;
                        //We retrieve the index of the element's kth subelement.
                        else
                            elIndx = P.elementList[m][i][k];
                        els.push(Polytope._getIndexOfTegumProduct(m - 1, elIndx, n, j, P, Q, memoizer, true));
                    }
                    //Same thing for n down here.
                    for (k = 0; k < jElCount; k++) {
                        if (n === 0)
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
    for (i = 0; i < mDimCount; i++) {
        //Points have only a single nullitope as a subelement.
        if (m === 0)
            iElCount = 1;
        else
            iElCount = P.elementList[m][i].length;
        for (j = 0; j < nDimCount; j++) {
            //Same thing for n down here.
            if (n === 0)
                jElCount = 1;
            else
                jElCount = Q.elementList[n][j].length;
            //Adds the pyramid product of the ith m-element and the j-th n-element to the newElementList.
            //The elements of this product are the pyramid products of each of the first polytope's facets with the other polytope, and viceversa.
            //The pyramid product of a polytope and the nullitope is just the polytope itself.
            els = [];
            for (k = 0; k < iElCount; k++) {
                //A vertex has only a single nullitope, we index it as "the zeroth nullitope".
                if (m === 0)
                    elIndx = 0;
                //We retrieve the index of the element's kth subelement.
                else
                    elIndx = P.elementList[m][i][k];
                for (l = 0; l < jElCount; l++) {
                    //Same thing for n.
                    if (n === 0)
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
Polytope.pyramidProduct = function (...P) {
    return Polytope._product(P, ConstructionNodeType.Multipyramid, Polytope._pyramidProduct);
};
//Calculates the pyramid product of P and Q.
//Edges are the products of vertices, faces are the products of vertices with edges or viceversa, and so on.
//Very similar to the tegum code.
Polytope._pyramidProduct = function (P, Q, height) {
    if (P.dimensions === -1)
        return Q;
    if (Q.dimensions === -1)
        return P;
    if (height === undefined)
        height = 0.5;
    else
        height /= 2;
    //Deals with the point, nullitope cases.
    if (P.dimensions <= 0)
        return Q;
    if (Q.dimensions <= 0)
        return P;
    var i, j, k, l, m, n, elIndx, elIndx2, iElCount, jElCount, mDimCount, nDimCount, els, newElementList = [[]], memoizer = [];
    //Adds vertices.
    for (i = 0; i < Q.elementList[0].length; i++)
        newElementList[0].push(Point.padLeft(Q.elementList[0][i], P.spaceDimensions).addCoordinate(height));
    height = -height; //Super trivial optimization.
    for (i = 0; i < P.elementList[0].length; i++)
        newElementList[0].push(Point.padRight(P.elementList[0][i], Q.spaceDimensions).addCoordinate(height));
    //Fills up newElementList.
    for (i = 1; i <= P.dimensions + Q.dimensions + 1; i++)
        newElementList.push([]);
    //The dimensions of the subelements we're multiplying.
    for (m = -1; m <= P.dimensions; m++) {
        //Every polytope has a single nullitope.
        if (m === -1)
            mDimCount = 1;
        else
            mDimCount = P.elementList[m].length;
        for (n = -1; n <= Q.dimensions; n++) {
            //We don't care about adding the nullitope,
            //and we already dealt with vertices.
            if (m + n < 0)
                continue;
            //Same thing for n down here.
            if (n === -1)
                nDimCount = 1;
            else
                nDimCount = Q.elementList[n].length;
            //The indices of the elements we're multiplying.
            for (i = 0; i < mDimCount; i++) {
                //Nullitopes have no subelements.
                if (m === -1)
                    iElCount = 0;
                //Points have only a single nullitope as a subelement.
                else if (m === 0)
                    iElCount = 1;
                else
                    iElCount = P.elementList[m][i].length;
                for (j = 0; j < nDimCount; j++) {
                    //Same thing for n down here.
                    if (n === -1)
                        jElCount = 0;
                    else if (n === 0)
                        jElCount = 1;
                    else
                        jElCount = Q.elementList[n][j].length;
                    //Adds the pyramid product of the ith m-element and the j-th n-element to the newElementList.
                    //The elements of this product are the pyramid products of each of the first polytope's facets with the other polytope, and viceversa.
                    //The pyramid product of a polytope and the nullitope is just the polytope itself.
                    els = [];
                    //This loop won't be entered if m = -1.
                    for (k = 0; k < iElCount; k++) {
                        //A vertex has only a single nullitope, we index it as "the zeroth nullitope".
                        if (m === 0)
                            elIndx = 0;
                        //We retrieve the index of the element's kth subelement.
                        else
                            elIndx = P.elementList[m][i][k];
                        //We use an ever-so-slightly modified version of the tegum product function, since it's so similar to what we need.
                        els.push(Polytope._getIndexOfTegumProduct(m - 1, elIndx, n, j, P, Q, memoizer, false));
                    }
                    //Same thing for n down here.
                    for (k = 0; k < jElCount; k++) {
                        if (n === 0)
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
Polytope._getIndexOfTegumProduct = function (m, i, n, j, P, Q, memoizer, tegum) {
    //Recall that the elements of a single dimension are added in order nullitope * facet, vertex * ridge, ...
    //memoizer[m][n] counts the number of such elements that we have to skip before we reach the multiplication we actually care about.
    //This number is found recursively, so we memoize to calculate it more efficiently.
    //offset calculates the index of our product within the products of elements of the same dimensions,
    //simply by recalling that this last ordering is lexicographic.
    var offset;
    if (m === -1)
        offset = j;
    else if (n === -1)
        offset = i;
    else
        offset = (i * Q.elementList[n].length) + j;
    m++;
    n++; //To avoid wacky negative indices
    if (memoizer[m]) {
        if (memoizer[m][n])
            return memoizer[m][n] + offset;
    }
    else
        memoizer[m] = [];
    if (m === 0 || n === Q.elementList.length - (tegum ? 1 : 0))
        memoizer[m][n] = 0;
    else if (m === 1)
        memoizer[m][n] = memoizer[m - 1][n + 1] + Q.elementList[n].length;
    else
        memoizer[m][n] = memoizer[m - 1][n + 1] + P.elementList[m - 2].length * Q.elementList[n].length;
    return memoizer[m][n] + offset;
};
/**
 * Helper function for {@link Polytope.prismProduct},
 * {@link Polytope.tegumProduct}, and {@link Polytope.pyramidProduct}.
 * @summary Performs a product of a set of polytopes.
 * @private
 * @param {Polytope[]} P An array of polytopes to "multiply."
 * @param {ConstructionNodeType} type The ConstructionNodeType corresponding to the product operation.
 * @param {function} fun The function used to perform the product.
 * @returns {Polytope} The resulting product.
 * */
Polytope._product = function (P, type, fun) {
    if (P.length === 0)
        return Polytope.nullitope();
    var constructions = [], res;
    res = P.pop();
    constructions.push(res.construction);
    while (P.length) {
        //Stores the constructions of the elements of P in a temporary array.
        constructions.push(P[P.length - 1].construction);
        res = fun(P.pop(), res);
    }
    res.construction = new ConstructionNode(type, constructions);
    return res;
};
//Extrudes a polytope to a pyramid with an apex at the specified point.
//Constructs pyramids out of elements recursively.
//The ith n-element in the original polytope gets extruded to the
//(i+[(n+1)-elements in the original polytope])th element in the new polytope.
/**
 * Extrudes a polytope into a pyramid.
 * @param  {(Point|number)} apex The apex of the pyramid, or its height.
 * @returns {Polytope} The resulting pyramid.
 */
Polytope.prototype.extrudeToPyramid = function (apex) {
    var P = this.toPolytopeC(), els, i;
    //If the height was passed instead, builds a point from there.
    if (typeof (apex) === 'number') {
        var newApex = [];
        for (i = 0; i < P.dimensions; i++)
            newApex.push(0);
        newApex.push(apex);
        apex = new Point(newApex);
    }
    P.dimensions++;
    P.elementList.push([]);
    var oldElNumbers = [];
    for (i = 0; i <= P.dimensions; i++)
        oldElNumbers.push(P.elementList[i].length);
    //Adds apex.
    P.elementList[0].push(apex);
    P.setSpaceDimensions(Math.max(apex.dimensions(), P.spaceDimensions));
    //Adds edges.
    for (i = 0; i < oldElNumbers[0]; i++)
        P.elementList[1].push([i, oldElNumbers[0]]);
    //Adds remaining elements.
    for (var d = 2; d <= P.dimensions; d++) {
        for (i = 0; i < oldElNumbers[d - 1]; i++) {
            els = [i];
            for (var j = 0; j < P.elementList[d - 1][i].length; j++)
                els.push(P.elementList[d - 1][i][j] + oldElNumbers[d - 1]);
            P.elementList[d].push(els);
        }
    }
    var construction = new ConstructionNode(ConstructionNodeType.Pyramid, P.construction);
    P.construction = construction;
    return P;
};
//TODO: Add a PolytopeS version.
Polytope.prototype.extrudeToPrism = function (height) {
    return Polytope.prismProduct(this.toPolytopeC(), Polytope.dyad(height));
};
/**
 * Creates a graph from the vertices and edges of a polyhedron.
 * Adds labels edges based on their adjacent faces.
 * @todo Could this be changed to work for higher/lower dimensions too?
 * @returns {GraphNode[]} The graph of the polytope.
 */
Polytope.prototype.polytopeToGraph = function () {
    var gNodes = [];
    var gLinks = [];
    for (var v = 0; v < this.elementList[0].length; v++) {
        var gNode = new GraphNode(v);
        gNodes.push(gNode);
    }
    for (var f = 0; f < this.elementList[2].length; f++) {
        for (var e = 0; e < this.elementList[2][f].length; e++) {
            var p1 = gNodes[this.elementList[1][this.elementList[2][f][e]][0]];
            var p2 = gNodes[this.elementList[1][this.elementList[2][f][e]][1]];
            if (gLinks.includes([p1, p2])) {
                p1.labels[p1.neighbors.indexOf(p2)] = f;
                p2.labels[p2.neighbors.indexOf(p1)] = f;
            }
            else {
                p1.connectTo(p2, f);
                gLinks.push([p1, p2]);
            }
        }
    }
    return gNodes;
};
//Generates the petrie dual of a polytope
Polytope.prototype.petrial = function () {
    gNodes = this.polytopeToGraph();
    var faces = [];
    var edges = [];
    var edgeCount = [];
    for (var f = 0; f < this.elementList[2].length; f++) {
        adjVerts = this.adjacentEls(2, f, 2);
        build_faces: for (sVert in adjVerts) {
            var nVert = undefined;
            while (nVert != sVert) {
                //Oh god, this one definition relies on so many things being in sync
                nEdge = [this.elementList[0].indexOf(sVert), gNodes[this.elementList[0].indexOf(sVert)].neighbors[0].value];
                //newEdge is an array of the indexes of the points that make up the new edge: [a, b]
                switch (edgeCount[nEdge.toString()]) {
                    case undefined:
                        edgeCount[nEdge.toString()] = 1;
                        edges.push(nEdge);
                        break;
                    case 1:
                        edgeCount[nEdge.toString()] = 2;
                        break;
                    case 2:
                        break build_faces;
                }
                ;
                nVert = nEdge[1];
                //Select nEdge's adjacent face
                //Set f to the index of newEdge's adjacent face
            }
        }
    }
};
/**
 * Returns the subelements that are adjacent to an element of elementList d layers down.
 * @param {number} type The index of the type of element in newElementList.
 * @param {number} elem The index of the element selected.
 * @param {number} d The subelement type (type-d) you want from elem.
 * @returns {Polytope} The adjacent subelements in an array.
 */
Polytope.adjacentEls = function (type, elem, d) {
    var down = 1;
    var subels = this.elementList[type][elem];
    var subelsTemp = [];
    while (down < d) {
        down++;
        for (i in subels) {
            subelsTemp = [...new Set(subelsTemp.concat(this.elementList[type - 1][i]))];
        }
        subels = subelsTemp;
        type--;
    }
    return subels;
};
/**
 * Creates a Schläfli matrix from a Coxeter diagram
 * @param {string} diagram The input Coxeter diagram
 * @returns {array} A 2D array corresponding to the CD's Schläfli matrix
 */
Polytope.cdToMatrix = function (diagram) {
    if (/[a-z][a-z]/.test(diagram))
        throw new error("Hey! I see you inputting a compound! Stop that >:[");
    if (/[#]/.test(diagram))
        throw new error("Laces don't work yet, sorry :/");
    if (/[']/.test(diagram))
        throw new error("Retrograde stuff doesn't work yet, sorry :/");
    diagram = diagram.replace(/-/gi, "");
    var dimen = diagram.replace(/\*.|[^a-z\u03B2]/gi, "").length;
    var alpha = 0;
    var marked = "";
    var v = false;
    for (var i = 0; i < diagram.length; i++) {
        var char = diagram.charAt(i);
        check: if (/[^1234567890/ \u221E\u00D8]/.test(char)) {
            if (/\*/.test(char)) {
                v = true;
                break check;
            }
            if (v) {
                v = false;
                break check;
            }
            alpha++;
            char = (alpha + 9).toString(36);
        }
        marked = marked + char;
    }
    marked = marked.replace(/\*/gi, "");
    var pat = /(?=(([a-z]\d+[a-z])|([a-z]\d+\/\d+[a-z])|([a-z]\u221E+[a-z])|([a-z]\u00D8+[a-z])))./g;
    var angles = [];
    var match;
    while ((match = pat.exec(marked)) != null)
        angles.push(match[1]);
    var schlafl = [];
    for (var i = 0; i < dimen; i++) {
        schlafl[i] = [];
        for (var j = 0; j < dimen; j++) {
            schlafl[i][j] = 0;
            if (i == j) {
                schlafl[i][j] = 2;
            }
        }
    }
    for (var i = 0; i < angles.length; i++) {
        var mira1 = angles[i].charCodeAt(0) - 97;
        var mira2 = angles[i].charCodeAt(angles[i].length - 1) - 97;
        if (mira2 > mira1) {
            mira1 = angles[i].charCodeAt(angles[i].length - 1) - 97;
            mira2 = angles[i].charCodeAt(0) - 97;
        }
        var num1 = parseInt(angles[i].substring(1, angles[i].length - 1));
        var num2;
        var ang = -2 * Math.cos(Math.PI / num1);
        if (/[\u221E\u00D8]/.test(angles[i].substring(1, angles[i].length - 1))) {
            ang = -2;
        }
        ;
        if (/\//.test(angles[i])) {
            num1 = parseInt(angles[i].substring(1, angles[i].search("/")));
            num2 = parseInt(angles[i].substring(angles[i].search("/") + 1, angles[i].length - 1));
            ang = -2 * Math.cos(Math.PI / (num1 / num2));
        }
        schlafl[mira1][mira2] = ang;
        schlafl[mira2][mira1] = ang;
    }
    return schlafl;
};
/**
 * Returns a polytope's dimension and space shape from a Coxeter diagram
 * @param {string} diagram The input Coxeter diagram
 * @returns {array} An array with the first entry being the dimension and the second is 1 for spherical, 0 for euclidean, and -1 for hyperbolic (and "uhoh" when something is wrong)
 */
Polytope.spaceShape = function (diagram) {
    var schlafl = Polytope.cdToMatrix(diagram);
    var det = Math.round(Polytope._determinant(schlafl) * 1000) / 1000;
    var space = [];
    diagram = diagram.replace(/-/gi, "");
    var dimen = diagram.replace(/\*.|[^a-z\u03B2]/gi, "").length;
    var shape = Math.sign(det);
    if (isNaN(det))
        shape = "oops";
    return [dimen, shape];
};
/**
 * Returns the determinant of a matrix.
 * @param {number[][]} diagram A matrix in the form of a 2D array
 * @returns {number} The matrix's determinant
 * @private
 * @todo Use Gaussian elimination to calculate the determinant much quicker.
 */
Polytope._determinant = function (schlafl) {
    if (schlafl.length == 1) {
        if (typeof schlafl[0] === 'object')
            return schlafl[0][0];
        else
            return schlafl[0];
    }
    var minors = [];
    for (var i = 0; i < schlafl[0].length; i++) {
        minors[i] = [];
        for (var j = 0; j < schlafl[0].length; j++) {
            if (j == 0)
                continue;
            if (!minors[i][j - 1])
                minors[i][j - 1] = [];
            for (var k = 0; k < schlafl[0].length; k++) {
                if (k == i)
                    continue;
                minors[i][j - 1].push(schlafl[j][k]);
            }
        }
    }
    var multiplier = 1;
    var subResults = [];
    for (var i = 0; i < schlafl.length; i++) {
        subResults[i] = multiplier * schlafl[0][i] * Polytope._determinant(minors[i]);
        multiplier *= -1;
    }
    return subResults.reduce(function (sum, val) { return sum + val; }, 0);
};
//Builds a polygon from the vertices given in order.
Polytope.polygon = function (points) {
    var newElementList = [[], [], [[]]], i = 0;
    for (; i < points.length - 1; i++) {
        newElementList[0].push(points[i]);
        newElementList[1].push([i, i + 1]);
        newElementList[2][0].push(i);
    }
    newElementList[0].push(points[i]);
    newElementList[1].push([i, 0]);
    newElementList[2][0].push(i);
    return new PolytopeC(newElementList, new ConstructionNode(ConstructionNodeType.Polygon, [points.length, 1]));
};
//Builds a n/d star with edge length s.
//If n and d are not coprime, a regular polygon compound is made instead.
//In the future, should be replaced by the PolytopeS version.
/**
 * Builds a regular polygon with a given edge length.
 * @param {number} n The number of sides of the regular polygon.
 * @param {number} d The winding number of the regluar polygon.
 * @param {number} [s=1] The edge length of the regular polygon.
 * @returns {Polytope} The regular polygon.
 */
Polytope.regularPolygon = function (n, d, s) {
    var gcd;
    if (d === undefined) {
        d = 1;
        gcd = 1;
    }
    else
        gcd = Polytope._gcd(n, d);
    if (s === undefined)
        s = 1;
    var els = [[], [], []], n_gcd = n / gcd, counter = 0, comp, i, j, x = 0, y = d, t = 2 * Math.PI / n, angle = 0, invRad = 2 * Math.sin(Math.PI * d / n) / s; //1 / the circumradius.
    for (i = 0; i < n; i++) {
        els[0].push(new Point([Math.cos(angle) / invRad, Math.sin(angle) / invRad])); //Vertices
        angle += t;
    }
    //i is the component number.
    for (i = 0; i < gcd; i++) {
        //x and y keep track of the vertices that are being connected.
        comp = [];
        //j is the edge.
        for (j = 0; j < n_gcd; j++) {
            els[1].push([x, y]); //Edges
            x = y;
            y += d;
            if (y >= n)
                y -= n;
            comp.push(counter++); //Components
        }
        els[2].push(comp);
        x++;
        y++;
    }
    return new PolytopeC(els, new ConstructionNode(ConstructionNodeType.Polygon, [n, d]));
};
/**
 * Helper function for {@linkcode Polytope.regularPolygon} and
 * {@linkcode Translation.regularPolygonName}.
 * Just the most basic form of the Euclidean algorithm.
 * @private
 * @param {number} a The first number.
 * @param {number} b The second number.
 * @returns {number} The greatest common divisor of `a` and `b`.
 */
Polytope._gcd = function (a, b) {
    var t;
    while (b !== 0) {
        t = b;
        b = a % b;
        a = t;
    }
    return a;
};
//Returns if two elements of the same type are adjacent
//TODO: maybe adjust this so it works for elements of different types too?
Polytope.checkAdjacent = function (otherelement) {
    return this.some(item => otherelement.includes(item));
};
//Builds a Grünbaumian n/d star with edge lenth s.
//In the future, should be replaced by the PolytopeS version.
Polytope.regularPolygonG = function (n, d, s) {
    if (d === undefined)
        d = 1;
    if (s === undefined)
        s = 1;
    var els = [[], [], [[]]], i, angle = 0, t = Math.PI * d / n, invRad = 2 * Math.sin(t) / s; //1 / the circumradius
    for (i = 0; i < n; i++) {
        els[0].push(new Point([Math.cos(angle) / invRad, Math.sin(angle) / invRad])); //Vertices
        els[2][0].push(i); //Face.
        angle += 2 * t;
    }
    for (i = 0; i < n - 1; i++)
        els[1].push([i, i + 1]); //Edges
    els[1].push([els[0].length - 1, 0]);
    return new PolytopeC(els, new ConstructionNode(ConstructionNodeType.Polygon, [n, d]));
};
/**
 * Builds a semiuniform polygon with `n` sides and "absolute turning number" `d`
 * with some given edge lengths.
 * The absolute turning number is the number `d` such that
 * the sum of the angles of the polygon is `π(n - 2d)`.
 * The bowtie is generated by the special case of `n = 4`, `d = 0`, for lack of
 * better parameters.
 * @param {number} n The number of sides of the semiuniform polygon.
 * @param {number} [d=1] The "absolute turning number", as defined above.
 * @param {number} [a=1] The first edge length of the polygon.
 * @param {number} [b=1] The second edge length of the polygon.
 * @return {Polytope} The resulting semiregular polygon.
 */
Polytope.semiregularPolygon = function (n, d = 1, a = 1, b = 1) {
    //If n = 4, d = 0, a bowtie is created.
    //Idk if there are more natural parameters for the bowtie.
    if (n === 4 && d === 0) {
        //If a > b, swaps b and a.
        if (a > b) {
            var t = a;
            a = b;
            b = t;
        }
        b = Math.sqrt(b * b - a * a) / 2;
        a /= 2;
        return new PolytopeC([
            [new Point([-a, b]), new Point([a, b]), new Point([-a, -b]), new Point([a, -b])],
            [[0, 1], [1, 2], [2, 3], [3, 0]],
            [[0, 1, 2, 3]]
        ], new ConstructionNode(ConstructionNodeType.Codename, "bowtie"));
    }
    //The angles and sides of a triangle made by three adjacent vertices.
    //Also, the circumdiameter 2R.
    var gamma = Math.PI * (1 - 2 * d / n), c = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(gamma)), R = c / Math.sin(gamma) / 2, 
    //The sine rule doesn't work here, since asin is ambiguous in [0, π/2].
    //Instead, we use the more complicated cosine rule.
    alpha = 2 * Math.acos((b * b + c * c - a * a) / (2 * b * c)), //is actually 2α.
    beta = 2 * Math.acos((a * a + c * c - b * b) / (2 * a * c)), //is actually 2β.
    //Some more variables
    i, angle = 0, els = [[], [], [[]]];
    for (i = 0; i < n / 2; i++) {
        //Side a.
        els[0].push(new Point([Math.cos(angle) * R, Math.sin(angle) * R])); //Vertices
        els[2][0].push(2 * i); //Face.
        angle += alpha;
        //Side b
        els[0].push(new Point([Math.cos(angle) * R, Math.sin(angle) * R])); //Vertices
        els[2][0].push(2 * i + 1); //Face.
        angle += beta;
    }
    for (i = 0; i < n - 1; i++)
        els[1].push([i, i + 1]); //Edges
    els[1].push([els[0].length - 1, 0]);
    return new PolytopeC(els, new ConstructionNode(ConstructionNodeType.Polygon, [n, d]));
};
//Builds a hypercube in the specified amount of dimensions.
//Positioned in the standard orientation with edge length 1.
//In the future, will be replaced by the PolytopeS version.
Polytope.hypercube = function (dimensions) {
    var els = []; //Elements is a reserved word.
    for (var i = 0; i <= dimensions; i++)
        els.push([]);
    //Mapping from pairs of the indices below to indices of the corresponding els.
    var locations = {};
    //i and i^j are the indices of the vertices of the current subelement.
    //i^j is used instead of j to ensure that facets of els
    //are generated before the corresponding element.
    for (var i = 0; i < Math.pow(2, dimensions); i++) {
        for (var j = 0; j < Math.pow(2, dimensions); j++) {
            //If the indices are the same, this is a vertex
            if (i == 0) {
                var coordinates = [];
                for (var k = 1; k <= dimensions; k++)
                    coordinates.push(j % (Math.pow(2, k)) < Math.pow(2, k - 1) ? 0.5 : -0.5);
                locations[j] = { 0: els[0].length };
                els[0].push(new Point(coordinates));
                continue;
            }
            //To avoid redundancy, i^j should be >=i using the obvious partial ordering on bitstrings.
            //This is equivalent to i and j being disjoint
            if ((j & i) != 0)
                continue;
            //Everything else is a higher-dimensional element
            var elementDimension = 0;
            var difference = i;
            var differences = [];
            while (difference > 0) {
                elementDimension++;
                differences.push(difference & ~(difference - 1));
                difference = difference & (difference - 1);
            }
            var facets = [];
            //facets connected to i
            for (var k = 0; k < differences.length; k++)
                facets.push(locations[j][i ^ differences[k]]);
            //facets connected to i^j
            for (var k = 0; k < differences.length; k++)
                facets.push(locations[j ^ differences[k]][i ^ differences[k]]);
            locations[j][i] = els[elementDimension].length;
            els[elementDimension].push(facets);
        }
    }
    return new PolytopeC(els, new ConstructionNode(ConstructionNodeType.Hypercube, dimensions));
};
//Builds a simplex in the specified amount of dimensions.
//Implements the more complicated coordinates in the space of the same dimension.
//In the future, will be replaced by the PolytopeS version.
Polytope.simplex = function (dimensions) {
    var vertices = [];
    //Memoizes some square roots, tiny optimization.
    var aux = [Infinity];
    for (var i = 1; i <= dimensions; i++)
        aux.push(1 / Math.sqrt(2 * i * (i + 1)));
    //Adds vertices.
    for (var i = 0; i <= dimensions; i++) {
        var coordinates = [];
        for (var j = 1; j <= dimensions; j++) {
            if (j > i)
                coordinates.push(-aux[j]);
            else if (j === i)
                coordinates.push(j * aux[j]);
            else
                coordinates.push(0);
        }
        vertices.push(new Point(coordinates));
    }
    //Adds higher dimensional elements.
    var els = [vertices];
    for (var i = 1; i <= dimensions; i++)
        els.push([]);
    var locations = {};
    for (var i = 0; i < dimensions + 1; i++)
        locations[Math.pow(2, i)] = i;
    for (var i = 1; i < Math.pow(2, dimensions + 1); i++) {
        //Vertices were generated earlier
        if (!(i & (i - 1)))
            continue;
        var elementDimension = -1;
        var t = i;
        var elemVertices = [];
        while (t > 0) {
            elementDimension++;
            elemVertices.push(t & ~(t - 1));
            t = t & (t - 1);
        }
        var facets = [];
        for (var k = 0; k < elemVertices.length; k++)
            facets.push(locations[i ^ elemVertices[k]]);
        locations[i] = els[elementDimension].length;
        els[elementDimension].push(facets);
    }
    return new PolytopeC(els, new ConstructionNode(ConstructionNodeType.Simplex, dimensions));
};
//Builds a cross-polytope in the specified amount of dimensions.
//Positioned in the standard orientation with edge length 1.
//In the future, will be replaced by the PolytopeS version.
Polytope.cross = function (dimensions) {
    //i is the set of nonzero dimensions, j is the set of negative dimensions
    var els = [];
    for (var i = 0; i <= dimensions; i++)
        els.push([]);
    var locations = {};
    //The full polytope is best handled separately
    for (var i = 1; i < Math.pow(2, dimensions); i++) {
        for (var j = 0; j < Math.pow(2, dimensions); j++) {
            //No negative zero dimensions
            if ((i & j) != j)
                continue;
            if (!j)
                locations[i] = {};
            if (!(i & (i - 1))) {
                var coordinates = [];
                var sign = j ? -1 : 1;
                for (var k = 0; k < dimensions; k++)
                    coordinates.push((Math.pow(2, k)) == i ? sign * Math.SQRT1_2 : 0);
                locations[i][j] = els[0].length;
                els[0].push(new Point(coordinates));
                continue;
            }
            var elementDimension = -1;
            var t = i;
            var elemVertices = [];
            while (t > 0) {
                elementDimension++;
                elemVertices.push(t & ~(t - 1));
                t = t & (t - 1);
            }
            var facets = [];
            for (var k = 0; k < elemVertices.length; k++)
                facets.push(locations[i ^ elemVertices[k]][j & ~elemVertices[k]]);
            locations[i][j] = els[elementDimension].length;
            els[elementDimension].push(facets);
        }
    }
    var facets = [];
    for (var i = 0; i < els[dimensions - 1].length; i++) {
        facets.push(i);
    }
    els[dimensions].push(facets);
    return new PolytopeC(els, new ConstructionNode(ConstructionNodeType.Cross, dimensions));
};
//Creates a uniform {n / d} antiprism.
//Only meant for when (n, d) = 1.
Polytope.uniformAntiprism = function (n, d) {
    if (d === undefined)
        d = 1;
    var x = n / d, scale = 2 * Math.sin(Math.PI / x), //Guarantees an unit edge length polytope.
    height = Math.sqrt((Math.cos(Math.PI / x) - Math.cos(2 * Math.PI / x)) / 2) / scale, //Half of the distance between bases.
    base1 = [], base2 = [], newElementList = [[], [], [base1, base2], [[]]], i = 0; //The edges in the bases.
    while (i < 2 * (n - 1)) {
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
    for (i = 0; i < 2 * (n + 1); i++)
        newElementList[3][0].push(i);
    return new PolytopeC(newElementList, new ConstructionNode(ConstructionNodeType.Antiprism, new ConstructionNode(ConstructionNodeType.Polygon, [n, d])));
};
//Creates an {n / d} cupola with regular faces.
Polytope.cupola = function (n, d) {
    if (d === undefined)
        d = 1;
    var x = n / d, r1 = 1 / (2 * Math.sin(Math.PI / x)), //Radius of the smaller base.
    r2 = 1 / (2 * Math.sin(Math.PI / (2 * x))), //Radius of the larger base.
    t = 1 / (2 * Math.tan(Math.PI / x)) - 1 / (2 * Math.tan(Math.PI / (2 * x))), //Temporary variable.
    h0 = Math.sqrt(1 - t * t), //Distance between bases.
    h1 = ((r2 * r2 - r1 * r1) / h0 + h0) / 2, //Distance between circumcenter and smaller base.
    h2 = h1 - h0, //Distance between circumcenter and larger base.
    base1 = [], base2 = [], newElementList = [[], [], [base1, base2], [[]]], //List of elements of the cupola.
    i;
    for (i = 0; i < n - 1; i++) {
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
    for (i = 0; i < 2 * n - 1; i++) {
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
    for (i = 0; i < 2 * n + 2; i++)
        newElementList[3][0].push(i);
    return new PolytopeC(newElementList, new ConstructionNode(ConstructionNodeType.Cupola, new ConstructionNode(ConstructionNodeType.Polygon, [n, d])));
};
//Creates an {n / d} cuploid with regular faces.
Polytope.cuploid = function (n, d) {
    if (d === undefined)
        d = 1;
    var x = n / d, r1 = 1 / (2 * Math.sin(Math.PI / x)), //Radius of the smaller base.
    r2 = 1 / (2 * Math.sin(Math.PI / (2 * x))), //Radius of the larger base.
    t = 1 / (2 * Math.tan(Math.PI / x)) - 1 / (2 * Math.tan(Math.PI / (2 * x))), //Temporary variable.
    h0 = Math.sqrt(1 - t * t), //Distance between bases.
    h1 = ((r2 * r2 - r1 * r1) / h0 + h0) / 2, //Distance between circumcenter and smaller base.
    h2 = h1 - h0, //Distance between circumcenter and larger base.
    base = [], newElementList = [[], [], [base], [[]]], //List of elements of the cupola.
    i;
    for (i = 0; i < n - 1; i++) {
        //Small base's vertices.
        newElementList[0].push(new Point([r1 * Math.cos(2 * Math.PI * (i / x)), r1 * Math.sin(2 * Math.PI * (i / x)), h1]));
        //Small base's edges.
        newElementList[1].push([i, i + 1]);
        //Connecting edges.
        newElementList[1].push([i, n + (2 * i) % n]);
        newElementList[1].push([i, n + (2 * i + 1) % n]);
        //Triangles.
        newElementList[2].push([3 * i + 1, 3 * i + 2, 3 * n + (2 * i) % n]);
        //Squares.
        newElementList[2].push([3 * i + 2, 3 * n + (2 * i + 1) % n, 3 * i + 4, 3 * i]);
        //Small base.
        base.push(3 * i);
    }
    //Adds last elements.
    newElementList[0].push(new Point([r1 * Math.cos(2 * Math.PI * (i / x)), r1 * Math.sin(2 * Math.PI * (i / x)), h1]));
    newElementList[1].push([i, 0]);
    newElementList[1].push([i, 2 * i]);
    newElementList[1].push([i, 2 * i + 1]);
    newElementList[2].push([3 * i + 1, 3 * i + 2, 2 * n + 2 * i]);
    newElementList[2].push([3 * i + 2, 2 * n + 2 * i + 1, 1, 3 * i]);
    base.push(3 * i);
    for (i = 0; i < n - 1; i++) {
        //Big base's vertices.
        newElementList[0].push(new Point([r2 * Math.cos(Math.PI * ((i - 0.5) / x)), r2 * Math.sin(Math.PI * ((i - 0.5) / x)), h2]));
        //Big base's edges.
        newElementList[1].push([n + i, n + i + 1]);
    }
    //Adds last elements.
    newElementList[0].push(new Point([r2 * Math.cos(Math.PI * ((i - 0.5) / x)), r2 * Math.sin(Math.PI * ((i - 0.5) / x)), h2]));
    newElementList[1].push([n + i, n]);
    for (i = 0; i < 2 * n + 1; i++)
        newElementList[3][0].push(i);
    return new PolytopeC(newElementList, new ConstructionNode(ConstructionNodeType.Cuploid, new ConstructionNode(ConstructionNodeType.Polygon, [n, d])));
};
//Creates an {n / d} cupolaic blend with regular faces.
Polytope.cupolaicBlend = function (n, d) {
    if (d === undefined)
        d = 1;
    var x = n / d, r1 = 1 / (2 * Math.sin(Math.PI / x)), //Radius of the smaller base.
    r2 = 1 / (2 * Math.sin(Math.PI / (2 * x))), //Radius of the larger base.
    t = 1 / (2 * Math.tan(Math.PI / x)) - 1 / (2 * Math.tan(Math.PI / (2 * x))), //Temporary variable.
    h0 = Math.sqrt(1 - t * t), //Distance between bases.
    h1 = ((r2 * r2 - r1 * r1) / h0 + h0) / 2, //Distance between circumcenter and smaller base.
    h2 = h1 - h0, //Distance between circumcenter and larger base.
    base1 = [], base2 = [], newElementList = [[], [], [base1, base2], [[]]], //List of elements of the cupola.
    i, even = true;
    for (i = 0; i < 2 * (n - 1); i++) {
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
        if (even)
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
    for (i = 0; i < 2 * n - 1; i++) {
        //Big base's vertices.
        newElementList[0].push(new Point([r2 * Math.cos(Math.PI * ((i - 0.5) / x)), r2 * Math.sin(Math.PI * ((i - 0.5) / x)), h2]));
        //Big base's edges.
        newElementList[1].push([2 * n + i, 2 * n + i + 1]);
    }
    //Adds last elements.
    newElementList[0].push(new Point([r2 * Math.cos(Math.PI * ((i - 0.5) / x)), r2 * Math.sin(Math.PI * ((i - 0.5) / x)), h2]));
    newElementList[1].push([2 * n + i, 2 * n]);
    for (i = 0; i < 2 * n + 1; i++)
        newElementList[3][0].push(i);
    return new PolytopeC(newElementList, new ConstructionNode(ConstructionNodeType.CupolaicBlend, new ConstructionNode(ConstructionNodeType.Polygon, [n, d])));
};
/**
 * Opens a file and stores it into the global variable `P`.
 * @param {Object|string} e Either the event triggered by the import button,
 * or a local filepath.
 * @todo Replace P by scene.polytope or something similar.
 * @todo Add support for more file formats.
 */
Polytope.openFile = function (e) {
    var file;
    //If e is an event.
    if (e.target) {
        file = e.target.files[0];
        if (!file)
            return;
        var reader = new FileReader(), contents; //Contents of file.
        //File name of imported polytope.
        //Stored in a global variable so it can be accessed from Polytope._readerOnload.
        Polytope.fileName = e.target.files[0].name;
    }
    //If e is a string.
    else
        Polytope.fileName = e;
    //Extracts the filename and extension.
    var i = Polytope.fileName.lastIndexOf("."), ext = Polytope.fileName.substr(i + 1); //Extension of file.
    Polytope.fileName = Polytope.fileName.substr(0, i); //Removes extension from file name.
    if (Translation.language !== "de")
        Polytope.fileName = Translation.firstToLower(Polytope.fileName); //Lowercase name.
    //If e is an event.
    if (e.target) {
        //Handles the file according to its extension.
        switch (ext) {
            case "off":
                reader.onload = function (e) {
                    Polytope._OFFReaderOnload(e.target.result);
                };
                reader.readAsText(file);
                break;
            case "ggb":
                reader.onload = function (e) {
                    JSZip.loadAsync(e.target.result).then(function (e) {
                        e.file("geogebra.xml").async("string").then(Polytope._GGBReaderOnload);
                    });
                };
                reader.readAsArrayBuffer(file);
                break;
        }
    }
    //If e is a string.
    else {
        //Reads the file as an OFF file.
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            //this.status === 0 is for debug purposes only!
            if (this.readyState === 4 && this.status === 200)
                Polytope._OFFReaderOnload(this.responseText);
        };
        xhttp.open("GET", e, true);
        xhttp.send();
    }
};
//Saves the file with the given data, the given MIME type, and the given extension.
Polytope._saveBlob = function (blob) {
    var fileName = Polytope.fileName.replace("/", "_");
    if (navigator.msSaveOrOpenBlob)
        navigator.msSaveOrOpenBlob(blob, fileName);
    else {
        var a = document.getElementById("download");
        a.href = window.URL.createObjectURL(blob);
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(a.href);
    }
};
//# sourceMappingURL=polytope.js.map