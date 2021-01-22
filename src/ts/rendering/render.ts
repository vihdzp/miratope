import Point from "../geometry/point";
import Space from "../geometry/space";
import { PolytopeB } from "../polytopes/types";
import Scene from "./scene";
import LinkedListNode from "../data structures/linkedListNode";
import SweeplineEdge from "../data structures/sweeplineEdge";
import AvlTree from "../data structures/avl-tree";
import Global from "../global";

/**
 * Class with the needed methods to render a polytope.
 */
export default abstract class Render {
  /** A doubly-linked-list that represents how the intersections of the
   * polygon's edges are connected. */
  static vertexDLL: LinkedListNode<Point>[];

  /** An "Event queue", which stores the vertices in lexicographic order. Used
   * to determine the next point the sweepline should stop at. */
  static EQ: AvlTree<LinkedListNode<Point>>;

  /** An event on the [[EQ | Event queue]]. */
  static Event: LinkedListNode<Point>;

  /** Renders a polytope into a scene. Implements the
   * [[http://geomalgorithms.com/a09-_intersect-3.html | Bentley-Ottmann algorithm]]
   * as well as a simplification algorithm to triangulate general polygons.
   *
   * @param P The polytope to render.
   * @param scene The scene into which the polytope is rendered.
   * @todo Guarantee that all edge cases work properly (zero length edges,
   * collinear edges, concurrent edges, etc.)
   */
  static to(P: PolytopeB, scene: Scene): void {
    const SL = new AvlTree(Render.SLSort);

    function debug(): void {
      console.log(Render.Event.value.coordinates[Global.index0].toString());
      console.log(SL.toString());
    }

    const Q = P.toPolytopeC().recenter();
    if (!Q.elementList[0] || !Q.elementList[1] || !Q.elementList[2]) return;

    //For each face:
    faceLoop: for (let i = 0; i < Q.elementList[2].length; i++) {
      //Let's not even bother with digons and monogons.
      if (Q.elementList[2][i].length < 3) continue faceLoop;
      /*	if(P.elementList[2][i].length === 3) {
				//All triangles are convex, so cut to the chase and render it directly.
			} */

      //Enumerates the vertices in order.
      const cycle = Q.faceToVertices(i);

      //Makes a doubly-linked list vertexDLL for the polygon's vertices and the
      //new vertices created.
      //node0 is always the "next" vertex.
      //Every vertex should *always* have two adjacent vertices.
      Render.vertexDLL = [new LinkedListNode(Q.elementList[0][cycle[0]])];
      for (let j = 0; j < cycle.length - 1; j++) {
        Render.vertexDLL[j + 1] = new LinkedListNode(
          Q.elementList[0][cycle[j + 1]]
        );
        Render.vertexDLL[j].linkToNext(Render.vertexDLL[j + 1]);
      }
      Render.vertexDLL[Render.vertexDLL.length - 1].linkToNext(
        Render.vertexDLL[0]
      );
      const v0 = Render.vertexDLL[0].value;

      //Tries to find two non-equal points. If all points are the same, doesn't
      //render the face.
      let a = 1;
      while (Point.equal(v0, Render.vertexDLL[a].value))
        if (++a >= Render.vertexDLL.length) continue faceLoop;
      const va = Render.vertexDLL[a].value;

      //Tries to find three non-collinear points. If all points are collinear,
      //doesn't render the face.
      let b = a === 1 ? 2 : 1;
      while (Space.collinear(v0, va, Render.vertexDLL[b].value))
        if (++b >= Render.vertexDLL.length) continue faceLoop;
      const vb = Render.vertexDLL[b].value;

      //Calculates the coordinates such that the projection of our three
      //non-collinear points onto their 2D plane has the highest area.
      //Uses the shoelace formula.
      //Stores such coordinates' indices in Global.index0, Global.index1.
      //That way, they become global variables that can be used elsewhere.
      let maxArea = 0,
        area: number;

      Global.index0 = 0;
      Global.index1 = 1;
      for (let j = 0; j < v0.dimensions(); j++)
        for (let k = j + 1; k < v0.dimensions(); k++)
          if ((area = Space.area(v0, va, vb, j, k)) > maxArea) {
            Global.index0 = j;
            Global.index1 = k;
            maxArea = area;
          }

      //Event queue for Bentley-Ottmann, stores vertices.
      //Sorts EQ by lexicographic order of the vertices.
      Render.EQ = new AvlTree<LinkedListNode<Point>>(Render.order);
      for (let j = 0; j < Render.vertexDLL.length; j++)
        Render.EQ.insert(Render.vertexDLL[j]);

      //Bentley-Ottmann:
      while (!Render.EQ.isEmpty()) {
        const min = Render.EQ.findMinimum();
        if (!min) throw new Error("EQ minimum not found!");
        Render.Event = min; //The next "event" in the event queue.
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
          const nodeJ = Render.Event.getNode(j);
          if (!nodeJ) throw new Error("Doubly linked list broken!");

          const ord =
            Render.Event.value.coordinates[Global.index0] -
            nodeJ.value.coordinates[Global.index0];

          //Vertex E is a left endpoint of the edge:
          if (ord < -Global.epsilon) {
            const edge = new SweeplineEdge(Render.Event, j);
            const node = SL.insert(edge);
            if (!node) {
              console.log(
                "SL insertion failed! This isn't supposed to happen!"
              );
              console.log("Edge searched for: " + edge.toString());
              console.log("Debug stuff:");
              debug();
              return;
            }
            const prevNode = SL.prev(node);
            const nextNode = SL.next(node);

            //Checks for an intersection with the edge below edgeE.
            if (prevNode) Render.divide(edge, prevNode.key);
            //Checks for an intersection with the edge above edgeE.
            if (nextNode) Render.divide(edge, nextNode.key);
          }
          //Vertex E is a right endpoint of the edge:
          else if (ord > Global.epsilon) {
            const edge = new SweeplineEdge(nodeJ, 1 - j);

            //Deletes edge from the sweep line.
            const node = SL.getNode(edge);
            if (!node) {
              console.log(
                "SL retrieval failed! This isn't supposed to happen!"
              );
              console.log("Edge searched for: " + edge.toString());
              console.log("Debug stuff:");
              debug();
              return;
            }
            const prevNode = SL.prev(node);
            const nextNode = SL.next(node);

            //Checks for an intersection between the edges below and above
            //edgeE.
            if (prevNode && nextNode) Render.divide(prevNode.key, nextNode.key);
            SL.delete(edge);
          }
          //The edge is perpendicular to the first coordinate's axis:
          //Runs only once per such an edge.
          else if (
            Render.Event.value.coordinates[Global.index1] >
            nodeJ.value.coordinates[Global.index1]
          ) {
            const edge = new SweeplineEdge(Render.Event, j);

            //I really should only check intersections with segments at the
            //"correct height".
            let node = SL.findMinimumNode();
            while (node) {
              Render.divide(edge, node.key);
              node = SL.next(node);
            }
          }
        }
      }

      //Polygons composing a single face as ordered sets of vertices.
      const face: Point[][] = [];

      //Retrieves polygonal paths from edges.
      for (let j = 0; j < Render.vertexDLL.length; j++) {
        if (!Render.vertexDLL[j].traversed)
          face.push(Render.vertexDLL[j].getCycle());
      }

      //The rest of the rendering shenanigans are handled by the Scene class.
      scene.add(face);
    }

    scene.polytopes.push(P);
  }

  /**
   * renderTo helper function.
   * "Cuts" two edges at the intersection point, adds the new directed edges
   * according to the simplification algorithm.
   *
   * @param edgeA The first edge to cut.
   * @param edgeB The second edge to cut.
   */
  private static divide(edgeA: SweeplineEdge, edgeB: SweeplineEdge) {
    //No point in doing anything if the intersection has already been dealt
    //with.
    //...what happens if two different vertices take the same location?
    if (
      edgeA.leftVertex.value === edgeB.leftVertex.value ||
      edgeA.leftVertex.value === edgeB.rightVertex().value ||
      edgeA.rightVertex().value === edgeB.leftVertex.value ||
      edgeA.rightVertex().value === edgeB.rightVertex().value
    )
      return;

    //Converts edges from the SL format to the [vertex1, vertex2] directed edge
    //format.
    const edgeADir = edgeA.directedEdge(),
      edgeBDir = edgeB.directedEdge();

    //No point in doing anything if the intersection is non-existent.
    const inter = Space.intersect(
      edgeADir[0].value,
      edgeADir[1].value,
      edgeBDir[0].value,
      edgeBDir[1].value
    );
    if (!inter) return;

    //Add the intersection and a point at "infinitesimal distance" to the vertex
    //list. They don't actually have to be different in this implementation of
    //the algorithm. In fact, the algorithm (as implemented) will fail if both
    //nodes don't reference the same point.
    const newNode1 = new LinkedListNode(inter),
      newNode2 = new LinkedListNode(inter);

    Render.vertexDLL.push(newNode1);
    Render.vertexDLL.push(newNode2);

    //Re-links the vertices.
    edgeADir[0].linkToNext(newNode1);
    newNode1.linkToNext(edgeBDir[1]);
    edgeBDir[0].linkToNext(newNode2);
    newNode2.linkToNext(edgeADir[1]);

    //Adds the edges' new IDs to the redirect table, so that they remain equal
    //and consistent.
    edgeA.updateRedirectTable();
    edgeB.updateRedirectTable();

    Render.EQ.insert(newNode1);
    Render.EQ.insert(newNode2);
  }

  /**
   * Orders two points lexicographically based on the coordinates on indices 0
   * and 1. Uses the IDs of the vertices to order them consistently if their
   * coordinates are identical.
   *
   * @param a The first point to order.
   * @param b The second point to order.
   * @returns 1, 0 or -1 depending on whether a > b, a = b or a < b.
   */
  private static order(
    a: LinkedListNode<Point>,
    b: LinkedListNode<Point>
  ): number {
    let c =
      a.value.coordinates[Global.index0] - b.value.coordinates[Global.index0];
    if (c === 0) {
      //DO NOT REPLACE BY Math.abs(c) < Global.epsilon

      c =
        a.value.coordinates[Global.index1] - b.value.coordinates[Global.index1];
      if (c === 0) return a.getId() - b.getId();
    }
    return c;
  }

  /**
   * The sweepline is sorted by the height of the edges' intersections with the
   * sweepline. If these are equal, the lines are sorted by slope. If these are
   * also equal, the lines are consistently ordered by their
   * [[`SweeplineEdge.id` | IDs]].
   */
  private static SLSort(x: SweeplineEdge, y: SweeplineEdge): number {
    //This is the only case where the function should return 0:
    if (x.leftVertex === y.leftVertex && x.rightVertex() === y.rightVertex())
      return 0;

    const a = x.leftVertex.value,
      b = x.rightVertex().value,
      c = y.leftVertex.value,
      d = y.rightVertex().value,
      k = Render.Event.value.coordinates[Global.index0];

    //Calculates where in the segments the intersection with the sweepline
    //lies.
    const lambda0 =
      (k - b.coordinates[Global.index0]) /
      (a.coordinates[Global.index0] - b.coordinates[Global.index0]);
    const lambda1 =
      (k - d.coordinates[Global.index0]) /
      (c.coordinates[Global.index0] - d.coordinates[Global.index0]);

    //The height difference between the intersections.
    let res =
      a.coordinates[Global.index1] * lambda0 +
      b.coordinates[Global.index1] * (1 - lambda0) -
      (c.coordinates[Global.index1] * lambda1 +
        d.coordinates[Global.index1] * (1 - lambda1));

    //If the intersections are so similar, we also need to consider the
    //possibility that the edges actually have a common endpoint.
    if (Math.abs(res) < Global.epsilon) {
      //If the first edge starts at a point, and the second ends at that point
      //then the former gets sorted after the latter.
      if (lambda0 > 1 - Global.epsilon && lambda1 < Global.epsilon) return 1;
      //And viceversa.
      if (lambda0 < Global.epsilon && lambda1 > 1 - Global.epsilon) return -1;

      //If both edges start at the same point, sort by increasing slope.
      if (lambda0 > 1 - Global.epsilon) res = 1;
      //If both edges end at the same point, sort by decreasing slope.
      else if (lambda0 < Global.epsilon) res = -1;
      //The edges are just really close, so compare them normally.
      else return res;

      //The difference between the slopes.
      res *= Math.atan(x.slope) - Math.atan(y.slope);

      //If both lines are the same, might as well compare using IDs.
      if (Math.abs(res) < Global.epsilon) return x.getId() - y.getId();
    }
    return res;
  }
}
