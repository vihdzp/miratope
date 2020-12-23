"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Point = void 0;
const THREE = require("three");
class Point {
    /**
     * Creates a new Point.
     * @constructor
     * @classdesc
     * A class for points in arbitary dimensions.
     * Meant for Euclidean space, though hyperbolic space may be eventually
     * implemented.
     * @param {(number[]|number)} x The coordinates of the point, or its number of
     * dimensions.
     */
    constructor(x) {
        //Constructor from the number of dimensions "x", initializes a point at the origin of R^x
        if (typeof (x) === "number") {
            this.coordinates = [];
            for (var i = 0; i < x; i++)
                this.coordinates[i] = 0;
        }
        //Constructor from the coordinates.
        else
            this.coordinates = x;
    }
    ;
    /**
     * Returns the number of dimensions of the point's space.
     * @returns {number} The number of coordinates of the point.
     */
    dimensions() {
        return this.coordinates.length;
    }
    ;
    /**
     * Clones a Point object. Uses a simple shallow copy.
     * @returns {Point} A new Point object with the same coordinates as `this`.
     */
    clone() {
        let coordinates = [];
        for (var i = 0; i < this.coordinates.length; i++)
            coordinates.push(this.coordinates[i]);
        return new Point(coordinates);
    }
    ;
    /**
     * Projects the point into 3D.
     * For now, just the simplest orthographic projection possible.
     * @returns {Point} The projected point.
     */
    project() {
        return Point.padRight(this, 3 - this.coordinates.length);
    }
    ;
    /**
     * Adds the coordinates of `P` to the coordinates of a point.
     * Both need to have the same amount of dimensions.
     * @returns {Point} The point with the added coordinates.
     * @throws Will throw an error if the added point does not have the same
     * number of dimensions.
     */
    add(P) {
        if (P.dimensions() !== this.dimensions()) //The points need to have the same number of coordinates.
            throw new Error("You can't add points with different amounts of dimensions!");
        for (let i = 0; i < P.dimensions(); i++) //Add the respective coordinates.
            this.coordinates[i] += P.coordinates[i];
        return this;
    }
    ;
    /**
     * Subtracts the coordinates of `P` to the coordinates of a point.
     * Both need to have the same amount of dimensions.
     * @returns {Point} The point with the subtracted coordinates.
     * @throws Will throw an error if the subtracted point does not have the same
     * number of dimensions.
     */
    subtract(P) {
        if (P.dimensions() !== this.dimensions()) //The points need to have the same number of coordinates.
            throw new Error("You can't add points with different amounts of dimensions!");
        for (let i = 0; i < P.dimensions(); i++) //Add the respective coordinates.
            this.coordinates[i] -= P.coordinates[i];
        return this;
    }
    ;
    /**
     * Scales up a point by a factor of `r`.
     * Simple scalar multiplication.
     * @param {number} r The scaling factor.
     */
    scale(r) {
        for (let i = 0; i < this.dimensions(); i++)
            this.coordinates[i] = this.coordinates[i] * r; //Multiplies each of the coordinates of x by r.
        return this;
    }
    ;
    /**
     * Takes the Cartesian product of two points.
     * Simply concatenates the coordinates of both points.
     * @param {Point} P The first point to multiply.
     * @param {Point} Q The second point to multiply.
     * @returns {Point} The product of both points.
     */
    static product(P, Q) {
        return new Point(P.coordinates.concat(Q.coordinates)); //Simply concatenates the coordinates of both points.
    }
    ;
    /**
     * Pads a point's coordinates with zeros to the left.
     * @param {Point} P The point to be padded.
     * @param {number} n The number of added zeros.
     * @returns {Point} The padded point.
     */
    static padLeft(P, n) {
        let coordinates = [];
        for (let i = 0; i < n; i++)
            coordinates.push(0);
        for (let i = 0; i < P.coordinates.length; i++)
            coordinates.push(P.coordinates[i]);
        return new Point(coordinates);
    }
    ;
    /**
     * Pads a point's coordinates with zeros to the right.
     * @param {Point} P The point to be padded.
     * @param {number} n The number of added zeros.
     * @returns {Point} The padded point.
     */
    static padRight(P, n) {
        let coordinates = [];
        for (let i = 0; i < P.coordinates.length; i++)
            coordinates.push(P.coordinates[i]);
        for (let i = 0; i < n; i++)
            coordinates.push(0);
        return new Point(coordinates);
    }
    ;
    /**
     * Adds a given coordinate to the end of the coordinate list.
     * @param {Number} coord The coordinate to be added.
     * @returns {Point} The modified point.
     */
    addCoordinate(coord) {
        this.coordinates.push(coord);
        return this;
    }
    ;
    //Converts to the Vector3 class used by three.js
    //Meant only for 3D points.
    //Simply copies the coordinates over.
    toVector3() {
        return new THREE.Vector3(this.coordinates[0], this.coordinates[1], this.coordinates[2]);
    }
    ;
    //Checks if two points are equal, to a predetermined precision
    //Simply checks whether the respective coordinates are "similar enough" by floating point standards.
    static equal(a, b) {
        for (var i = 0; i < a.coordinates.length; i++) {
            if (Math.abs(a.coordinates[i] - b.coordinates[i]) > Math.abs(a.coordinates[i] * globalThis.epsilon))
                return false;
        }
        return true;
    }
    ;
    //Returns the distance of a point to the origin.
    magnitude() {
        var res = 0;
        for (var i = 0; i < this.coordinates.length; i++) {
            var t = this.coordinates[i];
            res += t * t;
        }
        return Math.sqrt(res);
    }
    ;
}
exports.Point = Point;
//# sourceMappingURL=point.js.map