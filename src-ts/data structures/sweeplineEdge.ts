import { Point } from "../geometry/point";
import { LinkedListNode } from "./linkedListNode";

export class SweeplineEdge {
  leftVertex: LinkedListNode<Point>;
  rightVertexIndex: number;
  slope: number;
  private id: number;

  /**
   * Constructor for SweeplineEdge.
   * @constructor
   * @classdesc
   * Helper class for [Polytope.prototype.renderTo]{@link Polytope#renderTo}, used in the sweep line
   * for Bentley-Ottmann. This format is useful because an edge on the sweep line
   * can only be cut to the right. That way, we don't need to modify the SL objects
   * after the division process:only the nodes' connections change.<br />
   * &emsp;The constructor precomputes the slope and gives each edge a unique,
   * immutable ID. These two properties permit consistent ordering of collinear
   * or otherwise identical edges.
   * @param {LinkedListNode<Point>} leftVertex The leftmost vertex of the edge.
   * @param {number} rightVertexIndex The index of the rightmost vertex of the edge,
   * relative to `leftVertex`.
   */
  constructor(leftVertex: LinkedListNode<Point>, rightVertexIndex: number) {
  	this.leftVertex = leftVertex;
  	this.rightVertexIndex = rightVertexIndex;
  	var rightVertex = this.rightVertex();

  	//Calculates the slope.
  	//This won't change even if the edge gets cut down to zero length, thus making the ordering consistent.
  	this.slope = (leftVertex.value.coordinates[Point.index1] - rightVertex.value.coordinates[Point.index1])
  	/ (leftVertex.value.coordinates[Point.index0] - rightVertex.value.coordinates[Point.index0]);

  	//Gives the edge an immutable ID in terms of its vertices.
  	//Uses the redirect table (read below).
  	var x = leftVertex.id;
  	var y = rightVertex.id;
  	var newID = (x + y) * (x + y + 1) / 2 + y;
  	this.id = (SweeplineEdge.redirectTable[newID] === undefined ? newID : SweeplineEdge.redirectTable[newID]);
  };

  /**
   * The rightmost vertex of the edge, as determined by
   * [this.rightVertexIndex]{@linkcode SweeplineEdge#rightVertexIndex}.
   * @returns {LinkedListNode<Point>} The rightmost vertex of the edge.
   */
  rightVertex(): LinkedListNode<Point> {
  	let rv = this.leftVertex.getNode(this.rightVertexIndex);
    if(!rv)
      throw new Error("An SLEdge must have two extremes!");
    return rv;
  };

  /**
   * Getter for the ID of the edge.
   * @returns {number} The ID.
   */
   getId(): number {
     return this.id;
   }

   directedEdge(): [LinkedListNode<Point>, LinkedListNode<Point>] {
    if(this.rightVertexIndex === 0)
   		return [this.leftVertex, this.rightVertex()];
   	else
   		return [this.rightVertex(), this.leftVertex];
   }

  /**
   * An edge's ID must be immutable, even if the vertices themselves change, so
   * that sorting can occur consistently. At the same time, it needs to be
   * uniquely identified from the vertices, so searches can be made. To be able to
   * do both things simultaneously, we use a "redirect table". If the leftmost
   * vertex of an edge changes, we "redirect" the new calculated ID to the old
   * one.<br />&emsp;The redirect table is filled out as necesary by the
   * [SweeplineEdge.prototype.updateRedirectTable]{@link SweeplineEdge#updateRedirectTable} function.
   */
  static redirectTable: number[] = [];

  /**
   * Updates the {@link SweeplineEdge.redirectTable|redirect table} so that the
   * ID of the edge remains consisten even if the `leftVertex` changes.
   */
  updateRedirectTable() {
  	var x = this.leftVertex.id;
  	var y = this.rightVertex().id;
  	var newID = (x + y) * (x + y + 1) / 2 + y;
  	SweeplineEdge.redirectTable[newID] = this.id;
  };

  //TO DELETE
  //Used for debugging purposes
  toString(): string{
  	return "([" + this.leftVertex.value.coordinates.toString() +"], ["+this.rightVertex().value.coordinates.toString()+"])";
  };
}
