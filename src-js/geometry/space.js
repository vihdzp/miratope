"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Space = void 0;
const point_1 = require("./point");
/**
 * A namespace for operations on points.
 * @namespace Space
 */
class Space {
    /**
     * Calculates the intersection of two segments.
     * Assumes that these segments are coplanar, but not collinear.
     * Ignores the intersection if it lies outside of the segments, or
     * "too close" to the endpoints.
     * @param {Point} a The first endpoint of the first segment.
     * @param {Point} b The second endpoint of the first segment.
     * @param {Point} c The first endpoint of the second segment.
     * @param {Point} d The second endpoint of the second segment.
     * @returns {Point} The intersection point of segments `ab` and `cd`, or
     * `null` if there's none.
     */
    static intersect(a, b, c, d) {
        //Checks if any of the points are in different dimensional spaces
        if (a.dimensions() !== b.dimensions() || a.dimensions() !== c.dimensions() || a.dimensions() !== d.dimensions())
            throw new Error("You can't intersect edges with different amounts of dimensions!");
        //This projects a, b-a, c, d-c onto the a plane
        //Then, adapts the method from https://stackoverflow.com/a/565282 (by Gareth Rees)
        let p = [a.coordinates[globalThis.index0], a.coordinates[globalThis.index1]], r = [b.coordinates[globalThis.index0] - a.coordinates[globalThis.index0], b.coordinates[globalThis.index1] - a.coordinates[globalThis.index1]], q = [c.coordinates[globalThis.index0], c.coordinates[globalThis.index1]], s = [d.coordinates[globalThis.index0] - c.coordinates[globalThis.index0], d.coordinates[globalThis.index1] - c.coordinates[globalThis.index1]];
        //If the two lines' slopes are very similar, do nothing.
        //They either not intersect or are too similar for us to care.
        if (Space.sameSlope(r[0], r[1], s[0], s[1]))
            return null;
        //Wow, complicated formulas, @ is used to mean "at ab_MAX_indx" or "at cd_MAX_indx"
        let t = ((p[0] - q[0]) * s[1] - (p[1] - q[1]) * s[0]) / //(a@ab-c@ab)*(d@cd-c@cd)-(a@cd-c@cd)*(d@ab-c@ab) divided by
            (s[0] * r[1] - s[1] * r[0]), //(d@ab-c@ab)*(b@cd-a@cd)-(d@cd-c@cd)*(b@ab-a@ab)
        u = ((p[0] - q[0]) * r[1] - (p[1] - q[1]) * r[0]) / //(a@ab-c@ab)*(b@cd-a@cd)-(a@cd-c@cd)*(b@ab-a@ab) divided by
            (s[0] * r[1] - s[1] * r[0]); //(d@ab-c@ab)*(b@cd-a@cd)-(d@cd-c@cd)*(b@ab-a@ab)
        //The intersection lies outside of the segments, or at infinity
        //Makes sure that "t" and "u" are both inbetween globalThis.epsilon and 1
        if (t <= globalThis.epsilon || t >= 1 - globalThis.epsilon || u <= globalThis.epsilon || u >= 1 - globalThis.epsilon)
            return null;
        //Returns the point a + t * (b - a).
        let pt = [];
        for (var i = 0; i < a.dimensions(); i++)
            pt.push(a.coordinates[i] + (b.coordinates[i] - a.coordinates[i]) * t);
        return new point_1.Point(pt);
    }
    ;
    //Checks if the angle between b - a and c - a is straight to a given precision
    static collinear(a, b, c) {
        if (point_1.Point.equal(a, b) || point_1.Point.equal(a, c)) //If "a" is the same as "b" or "c"
            return true;
        //Calculates (b - a) . (c - a), |b - a|, |c - a|.
        //This will be used to calculate the angle between them.
        let dot = 0, norm0 = 0, norm1 = 0;
        for (var i = 0; i < a.coordinates.length; i++) {
            let sub0 = b.coordinates[i] - a.coordinates[i];
            let sub1 = c.coordinates[i] - a.coordinates[i];
            dot += sub0 * sub1;
            norm0 += sub0 * sub0;
            norm1 += sub1 * sub1;
        }
        //Returns true iff the cosine of the angle between b - a and c - a is at a distance globalThis.epsilon from 1 or -1.
        return 1 - Math.abs(dot / Math.sqrt(norm0 * norm1)) <= globalThis.epsilon;
    }
    ;
    /**
     * Calculates the Euclidean distance between two points.
     * @param {Point} a The first point.
     * @param {Point} b The second point.
     * @returns {number} The distance between `a` and `b`.
     */
    static distance(a, b) {
        return Math.sqrt(Space.distanceSq(a, b));
    }
    ;
    /**
     * Calculates the area of the triangle determined by three vertices
     * when projected onto a specific plane.
     * @param {Point} a The first of the triangle's vertices.
     * @param {Point} b The first of the triangle's vertices.
     * @param {Point} c The first of the triangle's vertices.
     * @param {number} j The first coordinate of the projection plane.
     * @param {number} k The second coordinate of the projection plane.
     */
    static area(a, b, c, j, k) {
        return Math.abs(a.coordinates[j] * (b.coordinates[k] - c.coordinates[k])
            + b.coordinates[j] * (c.coordinates[k] - a.coordinates[k])
            + c.coordinates[j] * (a.coordinates[k] - b.coordinates[k]));
    }
    ;
    /**
     * Calculates the squared Euclidean distance between two points.
     * For when you don't need that last square root.
     * @param {Point} a The first point.
     * @param {Point} b The second point.
     * @returns {number} The squared distance between `a` and `b`.
     */
    static distanceSq(a, b) {
        var res = 0;
        for (var i = 0; i < a.coordinates.length; i++) {
            var t = a.coordinates[i] - b.coordinates[i];
            res += t * t;
        }
        return res;
    }
    ;
    /**
     * Returns whether the line from (0, 0) to (a, b) and the line from (0, 0) to (c, d)
     * have the same (neglibly different) slopes
     * @param {number} a The first coordinate.
     * @param {number} a The second coordinate.
     * @param {number} a The third coordinate.
     * @param {number} a The fourth coordinate.
     * @returns {boolean} Whether the slopes are approximately equal or not.
     */
    static sameSlope(a, b, c, d) {
        //s is the difference between the angles.
        var s = Math.atan(a / b) - Math.atan(c / d);
        //Returns whether the angles (mod pi) are different by less than globalThis.epsilon.
        return (s + Math.PI + globalThis.epsilon) % Math.PI < 2 * globalThis.epsilon;
    }
    ;
}
exports.Space = Space;
//# sourceMappingURL=space.js.map