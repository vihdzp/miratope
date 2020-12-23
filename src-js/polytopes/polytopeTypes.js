"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolytopeC = exports.PolytopeB = exports.PolytopeType = void 0;
const constructionNode_1 = require("../data structures/constructionNode");
const linkedListNode_1 = require("../data structures/linkedListNode");
const point_1 = require("../geometry/point");
var PolytopeType;
(function (PolytopeType) {
    PolytopeType[PolytopeType["C"] = 0] = "C";
    PolytopeType[PolytopeType["S"] = 1] = "S";
})(PolytopeType = exports.PolytopeType || (exports.PolytopeType = {}));
;
class PolytopeB {
    getName() {
        return this.construction.getName();
    }
    ;
    //Declared in off.ts.
    saveAsOFF(_options) {
        throw new Error("saveAsOFF called before implementation!");
    }
    ;
    //Declared in ggb.ts.
    saveAsGGB(_wireframe) {
        throw new Error("saveAsGGB called before implementation!");
    }
    ;
    //Declared in polytopeBuild.ts.
    extrudeToPyramid(_apex) {
        throw new Error("extrudeToPyramid called before implementation!");
    }
    ;
    //Declared in polytopeProducts.ts.
    extrudeToPrism(_height) {
        throw new Error("extrudeToPrism called before implementation!");
    }
    ;
    //Declared in polytopeCD.ts.
    polytopeToGraph() {
        throw new Error("polytopeToGraph called before implementation!");
    }
    ;
    //Declared in render.ts.
    renderTo(_scene) {
        throw new Error("renderTo called before implementation!");
    }
    ;
}
exports.PolytopeB = PolytopeB;
class PolytopeC extends PolytopeB {
    /**
     * The constructor for the PolytopeC class.
     * @constructor
     * @param {ElementList} elementList The polytope's element list.
     * @param {ConstructionNode} constructionRoot The constructionNode representing how the polytope was built.
     * @classDesc Represents a polytope as a list of elements, in ascending order of dimensions,
     * similarly (but not identically) to an OFF file.
     * Subelements are stored as indices.
     * All points are assumed to be of the same dimension.
     * @todo Coming soon to theaters near you: A PolytopeV class!
     * PolytopeV would represent a polytope as a convex hull.
     * Or, we could make that into "another" constructor for PolytopeC.
     * We'll probably embed QHull to make that work.
     */
    constructor(elementList, constructionRoot) {
        super();
        if (!constructionRoot) //The construction defaults to just the polytope itself.
            constructionRoot = new constructionNode_1.ConstructionNode(constructionNode_1.ConstructionNodeType.Plain, [
                elementList[elementList.length - 2].length,
                elementList.length - 1
            ]);
        this.construction = constructionRoot;
        this.dimensions = elementList.length - 1; //The rank of the polytope.
        this.elementList = elementList;
        this.type = PolytopeType.C;
        if (this.elementList[0])
            this.spaceDimensions = this.elementList[0][0].dimensions();
        else
            this.spaceDimensions = -1; //The almighty nullitope (aka nothing)
    }
    ;
    /**
     * Scales a polytope up or down.
     * @param {number} r The scaling factor.
     * @returns {Polytope} The scaled polytope.
    */
    scale(r) {
        if (!this.elementList[0])
            return this;
        for (var i = 0; i < this.elementList[0].length; i++)
            this.elementList[0][i].scale(r);
        return this;
    }
    /**
     * Calculates the centroid of a polytope.
     * @returns {Point} The centroid of the polytope.
     */
    gravicenter() {
        if (!this.elementList[0])
            return new point_1.Point(0);
        let d = this.spaceDimensions;
        let res = [];
        for (let i = 0; i < d; i++)
            res.push(0);
        for (let i = 0; i < this.elementList[0].length; i++)
            for (let j = 0; j < d; j++)
                res[j] += this.elementList[0][i].coordinates[j];
        for (let i = 0; i < d; i++)
            res[i] /= this.elementList[0].length;
        return new point_1.Point(res);
    }
    ;
    circumradius() {
        return this.toPolytopeC().elementList[0][0].magnitude();
    }
    ;
    move(P, mult) {
        if (!this.elementList[0])
            return this;
        let Q = P.clone().scale(mult);
        for (let i = 0; i < this.elementList[0].length; i++)
            this.elementList[0][i].add(Q);
        return this;
    }
    /**
     * Makes every vertex have a set number of coordinates either by adding zeros or removing numbers.
     * @param {number} dim The new number of coordinates for each vertex.
     */
    setSpaceDimensions(dim) {
        if (!this.elementList[0])
            return;
        for (let i = 0; i < this.elementList[0].length; i++) {
            if (this.elementList[0][i].coordinates.length > dim)
                this.elementList[0][i].coordinates = this.elementList[0][i].coordinates.slice(0, dim);
            else if (this.elementList[0][i].coordinates.length < dim)
                for (let j = 0; j < dim - this.elementList[0][i].coordinates.length; j++)
                    this.elementList[0][i].coordinates.push(0);
        }
        this.spaceDimensions = dim;
    }
    ;
    /**
     * Converts the edge representation of the i-th face to an ordered array of vertices.
     * @param {number} i The selected face.
     * @returns {number[]} An array with the indices of the vertices of the i-th face in order.
     */
    faceToVertices(i) {
        if (!this.elementList[2] || !this.elementList[2][i])
            throw RangeError("The polytope does not have that many 2-faces!");
        //Enumerates the vertices in order.
        //A doubly linked list does the job easily.
        let vertexDLL = [];
        for (let j = 0; j < this.elementList[2][i].length; j++) {
            var edge = this.elementList[1][this.elementList[2][i][j]];
            if (vertexDLL[edge[0]] === undefined)
                vertexDLL[edge[0]] = new linkedListNode_1.LinkedListNode(edge[0]);
            if (vertexDLL[edge[1]] === undefined)
                vertexDLL[edge[1]] = new linkedListNode_1.LinkedListNode(edge[1]);
            vertexDLL[edge[0]].linkTo(vertexDLL[edge[1]]);
        }
        //Cycle of vertex indices.
        //"this.elementList[1][this.elementList[2][i][0]][0]" is just some vertex index.
        return vertexDLL[this.elementList[1][this.elementList[2][i][0]][0]].getCycle();
    }
    ;
    /**
     * Places the gravicenter of the polytope at the origin.
     * @returns {PolytopeC} The recentered polytope.
     */
    recenter() {
        return this.move(this.gravicenter(), -1);
    }
    ;
    /**
     * Ensures that we can always correctly call toPolytopeC on a polytope.
     * @returns {PolytopeC} The polytope, unchanged.
     */
    toPolytopeC() {
        return this;
    }
    ;
}
exports.PolytopeC = PolytopeC;
//# sourceMappingURL=polytopeTypes.js.map