"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Render = void 0;
const point_1 = require("../geometry/point");
const space_1 = require("../geometry/space");
const polytopeTypes_1 = require("../polytopes/polytopeTypes");
const linkedListNode_1 = require("../data structures/linkedListNode");
const sweeplineEdge_1 = require("../data structures/sweeplineEdge");
const avl_tree_1 = require("../data structures/avl-tree");
class Render {
    /** Renders a polytope into a scene.
     * Implements the Bentley-Ottmann algorithm
     * as well as a simplification algorithm
     * to triangulate general polygons.
     * @summary Renders a polytope into a scene.
     * @todo Guarantee that all edge cases work properly (zero length edges,
     * collinear edges, concurrent edges, etc.)
     * @see {@link http://geomalgorithms.com/a09-_intersect-3.html|Dan Sunday. Intersections for a Set of Segments. 2012.}
     */
    static to(P_, scene) {
        function debug() {
            console.log(Render.Event.value.coordinates[globalThis.index0].toString());
            console.log(SL.toString());
        }
        ;
        //SL is sorted by the height of the edges' intersections with the sweepline.
        //If these are equal, the lines are sorted by slope.
        //If both are equal, the lines are consistently ordered by their IDs (unique, immutable identifiers).
        function SLSort(x, y) {
            //This is the only case where the function should return 0:
            if (x.leftVertex === y.leftVertex && x.rightVertex() === y.rightVertex())
                return 0;
            var a = x.leftVertex.value, b = x.rightVertex().value, c = y.leftVertex.value, d = y.rightVertex().value, k = Render.Event.value.coordinates[globalThis.index0];
            //Calculates where in the segments the intersection with the sweepline lies.
            var lambda0 = (k - b.coordinates[globalThis.index0]) / (a.coordinates[globalThis.index0] - b.coordinates[globalThis.index0]);
            var lambda1 = (k - d.coordinates[globalThis.index0]) / (c.coordinates[globalThis.index0] - d.coordinates[globalThis.index0]);
            //The height difference between the intersections.
            var res = (a.coordinates[globalThis.index1] * lambda0 + b.coordinates[globalThis.index1] * (1 - lambda0)) - (c.coordinates[globalThis.index1] * lambda1 + d.coordinates[globalThis.index1] * (1 - lambda1));
            //If the intersections are so similar, we also need to consider the possibility
            //that the edges actually have a common endpoint.
            if (Math.abs(res) < globalThis.epsilon) {
                //If the first edge starts at a point, and the second ends at that point, the former gets sorted after the latter.
                if (lambda0 > 1 - globalThis.epsilon && lambda1 < globalThis.epsilon)
                    return 1;
                //And viceversa.
                if (lambda0 < globalThis.epsilon && lambda1 > 1 - globalThis.epsilon)
                    return -1;
                //If both edges start at the same point, sort by increasing slope.
                if (lambda0 > 1 - globalThis.epsilon)
                    res = 1;
                //If both edges end at the same point, sort by decreasing slope.
                else if (lambda0 < globalThis.epsilon)
                    res = -1;
                //The edges are just really close, so compare them normally.
                else
                    return res;
                //The difference between the slopes.
                res *= Math.atan(x.slope) - Math.atan(y.slope);
                //If both lines are the same, might as well compare using IDs.
                if (Math.abs(res) < globalThis.epsilon)
                    return x.getId() - y.getId();
            }
            return res;
        }
        ;
        let P = P_.toPolytopeC().recenter();
        if (!P.elementList[0] || !P.elementList[1] || !P.elementList[2])
            return;
        //For each face:
        faceLoop: for (let i = 0; i < P.elementList[2].length; i++) {
            //Let's not even bother with digons and monogons.
            if (P.elementList[2][i].length < 3)
                continue faceLoop;
            /*	if(P.elementList[2][i].length === 3) {
                    //All triangles are convex, so cut to the chase and render it directly.
                } */
            //Enumerates the vertices in order.
            var cycle = P.faceToVertices(i);
            //Makes a doubly-linked list vertexDLL for the polygon's vertices and the new vertices created.
            //node0 is always the "next" vertex.
            //Every vertex should *always* have two adjacent vertices.
            Render.vertexDLL = [new linkedListNode_1.LinkedListNode(P.elementList[0][cycle[0]])];
            for (let j = 0; j < cycle.length - 1; j++) {
                Render.vertexDLL[j + 1] = new linkedListNode_1.LinkedListNode(P.elementList[0][cycle[j + 1]]);
                Render.vertexDLL[j].linkToNext(Render.vertexDLL[j + 1]);
            }
            Render.vertexDLL[Render.vertexDLL.length - 1].linkToNext(Render.vertexDLL[0]);
            //Tries to find two non-equal points. If all points are the same, doesn't render the face.
            let a = 1;
            while (point_1.Point.equal(Render.vertexDLL[0].value, Render.vertexDLL[a].value))
                if (++a >= Render.vertexDLL.length)
                    continue faceLoop;
            //Tries to find three non-collinear points. If all points are collinear, doesn't render the face.
            let b = (a === 1 ? 2 : 1);
            while (space_1.Space.collinear(Render.vertexDLL[0].value, Render.vertexDLL[a].value, Render.vertexDLL[b].value))
                if (++b >= Render.vertexDLL.length)
                    continue faceLoop;
            //Calculates the coordinates such that the projection of our three non-collinear points onto their 2D plane has the highest area.
            //Uses the shoelace formula.
            //Stores such coordinates' indices in globalThis.index0, globalThis.index1.
            //That way, they become global variables that can be used elsewhere.
            let maxArea = 0, area, va = Render.vertexDLL[a].value, vb = Render.vertexDLL[b].value, v0 = Render.vertexDLL[0].value;
            globalThis.index0 = 0;
            globalThis.index1 = 1;
            for (let j = 0; j < v0.dimensions(); j++)
                for (let k = j + 1; k < v0.dimensions(); k++)
                    if ((area = space_1.Space.area(v0, va, vb, j, k)) > maxArea) {
                        globalThis.index0 = j;
                        globalThis.index1 = k;
                        maxArea = area;
                    }
            //Event queue for Bentley-Ottmann, stores vertices.
            //Sorts EQ by lexicographic order of the vertices (EQ is read backwards at the moment).
            Render.EQ = new avl_tree_1.AvlTree(Render._order);
            for (let j = 0; j < Render.vertexDLL.length; j++)
                Render.EQ.insert(Render.vertexDLL[j]);
            //Sweep line for Bentley-Ottmann, as an object with properties leftVertex and rightVertexIndex.
            //rightVertexIndex should be 0 if leftVertex.node0.value is to the right of leftVertex.value, 1 if leftVertex.node1.value is.
            //This format is useful because an edge on the sweep line can only be cut to the right.
            //That way, we don't need to modify the SL objects after the division process: only the nodes' connections change.
            var SL = new avl_tree_1.AvlTree(SLSort); //counter is just a debug variable.
            //Bentley-Ottmann:
            while (!Render.EQ.isEmpty()) {
                Render.Event = Render.EQ.findMinimum(); //The next "event" in the event queue.
                Render.EQ.delete(Render.Event);
                //If the code worked perfectly, we could skip this expensive check.
                /*
                if(!SL.checkSorted()) {
                        alert("Something went wrong!");
                        //return; //Uncomment if you want the code not to throw an exception.
                    }
                */
                //Runs the code on both edges adjacent to E's vertex.
                for (let j = 0; j <= 1; j++) {
                    let ord = Render.Event.value.coordinates[globalThis.index0] - Render.Event.getNode(j).value.coordinates[globalThis.index0];
                    //Vertex E is a left endpoint of the edge:
                    if (ord < -globalThis.epsilon) {
                        let edge = new sweeplineEdge_1.SweeplineEdge(Render.Event, j);
                        let node = SL.insert(edge);
                        if (!node) {
                            console.log("SL insertion failed! This isn't supposed to happen!");
                            console.log("Edge searched for: " + edge.toString());
                            console.log("Debug stuff:");
                            debug();
                            return;
                        }
                        let prevNode = SL.prev(node);
                        let nextNode = SL.next(node);
                        if (prevNode)
                            Render._divide(edge, prevNode.key); //Checks for an intersection with the edge below edgeE.
                        if (nextNode)
                            Render._divide(edge, nextNode.key); //Checks for an intersection with the edge above edgeE.
                    }
                    //Vertex E is a right endpoint of the edge:
                    else if (ord > globalThis.epsilon) {
                        let edge = new sweeplineEdge_1.SweeplineEdge(Render.Event.getNode(j), 1 - j);
                        //Deletes edge from the sweep line.
                        let node = SL.getNode(edge);
                        if (!node) {
                            console.log("SL retrieval failed! This isn't supposed to happen!");
                            console.log("Edge searched for: " + edge.toString());
                            console.log("Debug stuff:");
                            debug();
                            return;
                        }
                        let prevNode = SL.prev(node);
                        let nextNode = SL.next(node);
                        if (prevNode && nextNode)
                            Render._divide(prevNode.key, nextNode.key); //Checks for an intersection between the edges below and above edgeE.
                        SL.delete(edge);
                    }
                    //The edge is perpendicular to the first coordinate's axis:
                    //Runs only once per such an edge.
                    else if (Render.Event.value.coordinates[globalThis.index1] > Render.Event.getNode(j).value.coordinates[globalThis.index1]) {
                        let edge = new sweeplineEdge_1.SweeplineEdge(Render.Event, j);
                        //I really should only check intersections with segments at the "correct height".
                        let node = SL.findMinimumNode();
                        while (node) {
                            Render._divide(edge, node.key);
                            node = SL.next(node);
                        }
                    }
                }
            }
            //Polygons composing a single face as ordered sets of vertices.
            let face = [];
            //Retrieves polygonal paths from edges.
            for (let j = 0; j < Render.vertexDLL.length; j++) {
                if (!Render.vertexDLL[j].traversed)
                    face.push(Render.vertexDLL[j].getCycle());
            }
            //The rest of the rendering shenanigans are handled by the Scene class.
            scene.add(face);
        }
        scene.polytopes.push(P_);
    }
    ;
    /**
     * renderTo helper function.
     * "Cuts" two edges at the intersection point, adds the new directed edges according to the simplification algorithm.
     * @private
     * @param {SLEdge} edgeA The first edge to cut.
     * @param {SLEdge} edgeB The second edge to cut.
     */
    static _divide(edgeA, edgeB) {
        //No point in doing anything if the intersection has already been dealt with.
        //...what happens if two different vertices take the same location?
        if (edgeA.leftVertex.value === edgeB.leftVertex.value || edgeA.leftVertex.value === edgeB.rightVertex().value ||
            edgeA.rightVertex().value === edgeB.leftVertex.value || edgeA.rightVertex().value === edgeB.rightVertex().value)
            return;
        //Converts edges from the SL format to the [vertex1, vertex2] directed edge format.
        let edgeADir = edgeA.directedEdge(), edgeBDir = edgeB.directedEdge();
        //No point in doing anything if the intersection is non-existent.
        let inter = space_1.Space.intersect(edgeADir[0].value, edgeADir[1].value, edgeBDir[0].value, edgeBDir[1].value);
        if (!inter)
            return;
        //Add the intersection and a point at "infinitesimal distance" to the vertex list.
        //They don't actually have to be different in this implementation of the algorithm.
        //In fact, the algorithm (as implemented) will fail if both nodes don't reference the same point.
        let newNode1 = new linkedListNode_1.LinkedListNode(inter), newNode2 = new linkedListNode_1.LinkedListNode(inter);
        Render.vertexDLL.push(newNode1);
        Render.vertexDLL.push(newNode2);
        //Re-links the vertices.
        edgeADir[0].linkToNext(newNode1);
        newNode1.linkToNext(edgeBDir[1]);
        edgeBDir[0].linkToNext(newNode2);
        newNode2.linkToNext(edgeADir[1]);
        //Adds the edges' new IDs to the redirect table, so that they remain equal and consistent.
        edgeA.updateRedirectTable();
        edgeB.updateRedirectTable();
        Render.EQ.insert(newNode1);
        Render.EQ.insert(newNode2);
    }
    ;
    /** Orders two points lexicographically based on the coordinates on indices 0 and 1.
     * Uses the IDs of the vertices to order them consistently if their coordinates are identical.
     * @private
     * @param {LinkedListNode<Point>} a The first point to order.
     * @param {LinkedListNode<Point>} b The second point to order.
     * @returns {number} 1, 0 or -1 depending on whether a > b, a = b or a < b.
     */
    static _order(a, b) {
        var c = a.value.coordinates[globalThis.index0] - b.value.coordinates[globalThis.index0];
        if (c === 0) { //DO NOT REPLACE BY Math.abs(c) < globalThis.epsilon
            c = a.value.coordinates[globalThis.index1] - b.value.coordinates[globalThis.index1];
            if (c === 0)
                return a.id - b.id;
        }
        return c;
    }
    ;
}
exports.Render = Render;
polytopeTypes_1.PolytopeB.prototype.renderTo = function (scene) {
    Render.to(this, scene);
};
//# sourceMappingURL=render.js.map