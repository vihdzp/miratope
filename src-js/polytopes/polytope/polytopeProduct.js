"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolytopeProduct = void 0;
const constructionNode_1 = require("../../data structures/constructionNode");
const point_1 = require("../../geometry/point");
const polytopeTypes_1 = require("../polytopeTypes");
const polytopeBuild_1 = require("./polytopeBuild");
class PolytopeProduct {
    /**
     * Calculates the prism product (Cartesian product) of a set of polytopes.
     * Vertices are the products of vertices, edges are the products of vertices
     * with edges or viceversa, and so on.
     * @summary Calculates the prism product of a set of polytopes.
     * @param {...Polytope} P The list of polytopes to "multiply" together.
     */
    static prismProduct(...P) {
        return PolytopeProduct._product(P, constructionNode_1.ConstructionNodeType.Multiprism, PolytopeProduct._prismProduct);
    }
    ;
    /**
     * Helper function for {@link Polytope.prismProduct}.
     * Is the one actually performing the product.
     * Takes the prism product of two polytopes.
     * @private
     * @param {PolytopeB} P The first polytope to multiply.
     * @param {PolytopeB} Q The second polytope to multiply.
     */
    static _prismProduct(P, Q) {
        //Deals with the point, nullitope cases.
        if (P.dimensions === 0)
            return Q;
        if (Q.dimensions === 0)
            return P;
        if (P.dimensions === -1 || Q.dimensions === -1)
            return polytopeBuild_1.PolytopeBuild.nullitope();
        let P_ = P.toPolytopeC(), Q_ = Q.toPolytopeC();
        let newElementList = [[]], memoizer = [];
        //Adds vertices.
        for (let i = 0; i < P_.elementList[0].length; i++)
            for (let j = 0; j < Q_.elementList[0].length; j++)
                newElementList[0].push(point_1.Point.product(P_.elementList[0][i], Q_.elementList[0][j]));
        //Fills up newElementList.
        for (let i = 1; i <= P.dimensions + Q.dimensions; i++)
            newElementList.push([]);
        //The dimensions of the subelements we're multiplying.
        for (let m = 0; m <= P.dimensions; m++) {
            for (let n = (m === 0 ? 1 : 0); n <= Q.dimensions; n++) {
                //The indices of the elements we're multiplying.
                for (let i = 0; i < P_.elementList[m].length; i++) {
                    for (let j = 0; j < Q_.elementList[n].length; j++) {
                        //Adds the Cartesian product of the ith m-element and the j-th n-element to the newElementList.
                        //The elements of this product are the prism products of each of the first polytope's facets with the other polytope, and viceversa.
                        let indices = [];
                        //Vertices don't have facets!
                        if (m !== 0)
                            for (let k = 0; k < P_.elementList[m][i].length; k++)
                                indices.push(PolytopeProduct._getIndexOfPrismProduct(m - 1, P_.elementList[m][i][k], n, j, P_, Q_, memoizer));
                        if (n !== 0)
                            for (let k = 0; k < Q_.elementList[n][j].length; k++)
                                indices.push(PolytopeProduct._getIndexOfPrismProduct(m, i, n - 1, Q_.elementList[n][j][k], P_, Q_, memoizer));
                        newElementList[m + n].push(indices);
                    }
                }
            }
        }
        return new polytopeTypes_1.PolytopeC(newElementList); //The construction gets added in the main function.
    }
    ;
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
     * @returns {number} The index described above.
     */
    static _getIndexOfPrismProduct(m, i, n, j, P, Q, memoizer) {
        //Recall that the elements of a single dimension are added in order vertex * facet, edge * ridge, ...
        //memoizer[m][n] counts the number of such elements that we have to skip before we reach the multiplication we actually care about.
        //This number is found recursively, so we memoize to calculate it more efficiently.
        //offset calculates the index of our product within the products of elements of the same dimensions,
        //simply by recalling that this last ordering is lexicographic.
        let offset = (i * Q.elementList[n].length) + j;
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
    }
    ;
    //Polytope._tegumProduct, but also supports P being an array.
    static tegumProduct(...P) {
        return PolytopeProduct._product(P, constructionNode_1.ConstructionNodeType.Multitegum, PolytopeProduct._tegumProduct);
    }
    ;
    //Calculates the tegum product, or rather the dual of the Cartesian product, of P and Q.
    //Edges are the products of vertices, faces are the products of vertices with edges or viceversa, and so on.
    static _tegumProduct(P, Q) {
        //Deals with the point, nullitope cases.
        if (P.dimensions <= 0)
            return Q;
        if (Q.dimensions <= 0)
            return P;
        let P_ = P.toPolytopeC();
        let Q_ = Q.toPolytopeC();
        let newElementList = [[]], memoizer = [];
        //Adds vertices.
        for (let i = 0; i < Q_.elementList[0].length; i++)
            newElementList[0].push(point_1.Point.padLeft(Q_.elementList[0][i], P.spaceDimensions));
        for (let i = 0; i < P_.elementList[0].length; i++)
            newElementList[0].push(point_1.Point.padRight(P_.elementList[0][i], Q.spaceDimensions));
        //Fills up newElementList.
        for (let i = 1; i <= P.dimensions + Q.dimensions; i++)
            newElementList.push([]);
        //The dimensions of the subelements we're multiplying.
        for (let m = -1; m < P.dimensions; m++) {
            let mDimCount;
            //Every polytope has a single nullitope.
            if (m === -1)
                mDimCount = 1;
            else
                mDimCount = P_.elementList[m].length;
            for (let n = -1; n < Q.dimensions; n++) {
                let nDimCount;
                //We don't care about adding the nullitope,
                //and we already dealt with vertices.
                if (m + n < 0)
                    continue;
                //Same thing for n down here.
                if (n === -1)
                    nDimCount = 1;
                else
                    nDimCount = Q_.elementList[n].length;
                //The indices of the elements we're multiplying.
                for (let i = 0; i < mDimCount; i++) {
                    let iElCount;
                    //Nullitopes have no subelements.
                    if (m === -1)
                        iElCount = 0;
                    //Points have only a single nullitope as a subelement.
                    else if (m === 0)
                        iElCount = 1;
                    else
                        iElCount = P_.elementList[m][i].length;
                    for (let j = 0; j < nDimCount; j++) {
                        let jElCount;
                        //Same thing for n down here.
                        if (n === -1)
                            jElCount = 0;
                        else if (n === 0)
                            jElCount = 1;
                        else
                            jElCount = Q_.elementList[n][j].length;
                        //Adds the pyramid product of the ith m-element and the j-th n-element to the newElementList.
                        //The elements of this product are the pyramid products of each of the first polytope's facets with the other polytope, and viceversa.
                        //The pyramid product of a polytope and the nullitope is just the polytope itself.
                        let indices = [];
                        //This loop won't be entered if m == -1.
                        for (let k = 0; k < iElCount; k++) {
                            let elIndx;
                            //A vertex has only a single nullitope, we index it as "the zeroth nullitope".
                            if (m === 0)
                                elIndx = 0;
                            //We retrieve the index of the element's kth subelement.
                            else
                                elIndx = P_.elementList[m][i][k];
                            indices.push(PolytopeProduct._getIndexOfTegumProduct(m - 1, elIndx, n, j, P_, Q_, memoizer, true));
                        }
                        //Same thing for n down here.
                        for (let k = 0; k < jElCount; k++) {
                            let elIndx;
                            if (n === 0)
                                elIndx = 0;
                            else
                                elIndx = Q_.elementList[n][j][k];
                            indices.push(PolytopeProduct._getIndexOfTegumProduct(m, i, n - 1, elIndx, P_, Q_, memoizer, true));
                        }
                        newElementList[m + n + 1].push(indices);
                    }
                }
            }
        }
        //Calculating the components is a special case.
        //We'll just tegum multiply the compounds of the first polytope with the compounds of the second.
        //m must be at least 0, since we already dealt with the case where P was a point.
        let m = P_.elementList.length - 1;
        let mDimCount = P_.elementList[m].length;
        let n = Q_.elementList.length - 1;
        let nDimCount = Q_.elementList[n].length;
        //The indices of the elements we're multiplying.
        for (let i = 0; i < mDimCount; i++) {
            let iElCount;
            //Points have only a single nullitope as a subelement.
            if (m === 0)
                iElCount = 1;
            else
                iElCount = P_.elementList[m][i].length;
            for (let j = 0; j < nDimCount; j++) {
                let jElCount;
                //Same thing for n down here.
                if (n === 0)
                    jElCount = 1;
                else
                    jElCount = Q_.elementList[n][j].length;
                //Adds the pyramid product of the ith m-element and the j-th n-element to the newElementList.
                //The elements of this product are the pyramid products of each of the first polytope's facets with the other polytope, and viceversa.
                //The pyramid product of a polytope and the nullitope is just the polytope itself.
                let indices = [];
                for (let k = 0; k < iElCount; k++) {
                    let elIndx;
                    //A vertex has only a single nullitope, we index it as "the zeroth nullitope".
                    if (m === 0)
                        elIndx = 0;
                    //We retrieve the index of the element's kth subelement.
                    else
                        elIndx = P_.elementList[m][i][k];
                    for (let l = 0; l < jElCount; l++) {
                        let elIndx2;
                        //Same thing for n.
                        if (n === 0)
                            elIndx2 = 0;
                        else
                            elIndx2 = Q_.elementList[n][j][k];
                        indices.push(PolytopeProduct._getIndexOfTegumProduct(m - 1, elIndx, n - 1, elIndx2, P_, Q_, memoizer, true));
                    }
                }
                newElementList[m + n].push(indices);
            }
        }
        return new polytopeTypes_1.PolytopeC(newElementList); //The construction gets added in the main function.
    }
    ;
    //Polytope._pyramidProduct, but also supports P being an array.
    static pyramidProduct(...P) {
        return PolytopeProduct._product(P, constructionNode_1.ConstructionNodeType.Multipyramid, PolytopeProduct._pyramidProduct);
    }
    ;
    //Calculates the pyramid product of P and Q.
    //Edges are the products of vertices, faces are the products of vertices with edges or viceversa, and so on.
    //Very similar to the tegum code.
    static _pyramidProduct(P, Q, height) {
        if (P.dimensions === -1)
            return Q;
        if (Q.dimensions === -1)
            return P;
        //Deals with the point, nullitope cases.
        if (P.dimensions <= 0)
            return Q;
        if (Q.dimensions <= 0)
            return P;
        let P_ = P.toPolytopeC();
        let Q_ = Q.toPolytopeC();
        if (height === undefined)
            height = 0.5;
        else
            height /= 2;
        let newElementList = [[]], memoizer = [];
        //Adds vertices.
        for (let i = 0; i < Q_.elementList[0].length; i++)
            newElementList[0].push(point_1.Point.padLeft(Q_.elementList[0][i], P.spaceDimensions).addCoordinate(height));
        height = -height; //Super trivial optimization.
        for (let i = 0; i < P_.elementList[0].length; i++)
            newElementList[0].push(point_1.Point.padRight(P_.elementList[0][i], Q.spaceDimensions).addCoordinate(height));
        //Fills up newElementList.
        for (let i = 1; i <= P.dimensions + Q.dimensions + 1; i++)
            newElementList.push([]);
        //The dimensions of the subelements we're multiplying.
        for (let m = -1; m <= P.dimensions; m++) {
            //Every polytope has a single nullitope.
            let mDimCount;
            if (m === -1)
                mDimCount = 1;
            else
                mDimCount = P_.elementList[m].length;
            for (let n = -1; n <= Q.dimensions; n++) {
                //We don't care about adding the nullitope,
                //and we already dealt with vertices.
                if (m + n < 0)
                    continue;
                //Same thing for n down here.
                let nDimCount;
                if (n === -1)
                    nDimCount = 1;
                else
                    nDimCount = Q_.elementList[n].length;
                //The indices of the elements we're multiplying.
                for (let i = 0; i < mDimCount; i++) {
                    //Nullitopes have no subelements.
                    let iElCount;
                    if (m === -1)
                        iElCount = 0;
                    //Points have only a single nullitope as a subelement.
                    else if (m === 0)
                        iElCount = 1;
                    else
                        iElCount = P_.elementList[m][i].length;
                    for (let j = 0; j < nDimCount; j++) {
                        //Same thing for n down here.
                        let jElCount;
                        if (n === -1)
                            jElCount = 0;
                        else if (n === 0)
                            jElCount = 1;
                        else
                            jElCount = Q_.elementList[n][j].length;
                        //Adds the pyramid product of the ith m-element and the j-th n-element to the newElementList.
                        //The elements of this product are the pyramid products of each of the first polytope's facets with the other polytope, and viceversa.
                        //The pyramid product of a polytope and the nullitope is just the polytope itself.
                        let indices = [];
                        //This loop won't be entered if m = -1.
                        for (let k = 0; k < iElCount; k++) {
                            //A vertex has only a single nullitope, we index it as "the zeroth nullitope".
                            let elIndx;
                            if (m === 0)
                                elIndx = 0;
                            //We retrieve the index of the element's kth subelement.
                            else
                                elIndx = P_.elementList[m][i][k];
                            //We use an ever-so-slightly modified version of the tegum product function, since it's so similar to what we need.
                            indices.push(PolytopeProduct._getIndexOfTegumProduct(m - 1, elIndx, n, j, P_, Q_, memoizer, false));
                        }
                        //Same thing for n down here.
                        for (let k = 0; k < jElCount; k++) {
                            let elIndx;
                            if (n === 0)
                                elIndx = 0;
                            else
                                elIndx = Q_.elementList[n][j][k];
                            indices.push(PolytopeProduct._getIndexOfTegumProduct(m, i, n - 1, elIndx, P_, Q_, memoizer, false));
                        }
                        newElementList[m + n + 1].push(indices);
                    }
                }
            }
        }
        return new polytopeTypes_1.PolytopeC(newElementList); //The construction gets added in the main function.
    }
    ;
    //Helper function for tegumProduct and pyramidProduct.
    //Gets the index of the product of the ith m-element and the jth n-element in the new polytope.
    //Takes into account the order in which the elements are calculated and added.
    //The only difference between the tegum case and the pyramid case is that for pyramids, we need to consider an extra column in memoizer.
    static _getIndexOfTegumProduct(m, i, n, j, P, Q, memoizer, tegum) {
        //Recall that the elements of a single dimension are added in order nullitope * facet, vertex * ridge, ...
        //memoizer[m][n] counts the number of such elements that we have to skip before we reach the multiplication we actually care about.
        //This number is found recursively, so we memoize to calculate it more efficiently.
        //offset calculates the index of our product within the products of elements of the same dimensions,
        //simply by recalling that this last ordering is lexicographic.
        let offset;
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
    }
    ;
    /**
     * Helper function for {@link Polytope.prismProduct},
     * {@link Polytope.tegumProduct}, and {@link Polytope.pyramidProduct}.
     * @summary Performs a product of a set of polytopes.
     * @private
     * @param {Polytope[]} P An array of polytopes to "multiply."
     * @param {ConstructionNodeType} type The ConstructionNodeType corresponding to the product operation.
     * @param {Function} fun The function used to perform the product.
     * @returns {Polytope} The resulting product.
     * */
    static _product(P, type, fun) {
        let res_ = P.pop();
        if (!res_)
            return polytopeBuild_1.PolytopeBuild.nullitope();
        let res = res_;
        let constructions = [];
        constructions.push(res.construction);
        while (P.length) {
            //Stores the constructions of the elements of P in a temporary array.
            constructions.push(P[P.length - 1].construction);
            res = fun(P.pop(), res);
        }
        res.construction = new constructionNode_1.ConstructionNode(type, constructions);
        return res;
    }
    ;
}
exports.PolytopeProduct = PolytopeProduct;
polytopeTypes_1.PolytopeB.prototype.extrudeToPrism = function (height) {
    return PolytopeProduct.prismProduct(this.toPolytopeC(), polytopeBuild_1.PolytopeBuild.dyad(height));
};
//# sourceMappingURL=polytopeProduct.js.map