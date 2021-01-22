import Point from "../geometry/Point";
import LinkedListNode from "./LinkedListNode";
import Global from "../global";

/**
 * Helper class for [[`Render.to`]], used in the sweepline for
 * [[https://en.wikipedia.org/wiki/Bentley%E2%80%93Ottmann_algorithm|
 * Bentley-Ottmann]]. This format is useful because an edge on the sweepline can
 * only be cut to the right. That way, we don't need to modify the SL objects
 * after the division process: only the nodes' connections change.
 */
export default class SweeplineEdge {
  /** The leftmost vertex of the sweepline edge. */
  leftVertex: LinkedListNode<Point>;

  /** The index of the [[leftVertex|`leftVertex's`]] node corresponding to the
   * rightmost vertex of the sweepline edge. Equals 0 when this node is
   * [[LinkedListNode.node0|`node0`]], and equals 1 when this node is
   * [[LinkedListNode.node1|`node1`]]. */
  rightVertexIndex: 0 | 1;

  /** The slope of the sweepline edge. Doesn't change even when the edge is cut
  down to zero length.*/
  slope: number;

  /** A unique, immutable [[`ID`]] associated to the sweepline edge. */
  private id: number;

  /**
   * An edge's ID must be immutable, even if the vertices themselves change, so
   * that sorting can occur consistently. At the same time, it needs to be
   * uniquely identified from the vertices, so searches can be made. To be able
   * to do both things simultaneously, we use a "redirect table". If the
   * leftmost vertex of an edge changes, we "redirect" the new calculated ID to
   * the old one.
   *
   * The redirect table is filled out as necesary by the
   * [[`updateRedirectTable`]] method.
   */
  static redirectTable: number[] = [];

  /** Constructor for SweeplineEdge. Precomputes the [[`slope`]] and assigns an
   * [[`ID`]] to the edge. These two properties permit consistent ordering of
   * collinear or otherwise indistinguishable edges.
   *
   * @param leftVertex The leftmost vertex of the sweepline edge.
   * @param rightVertexIndex The index of the [[leftVertex|`leftVertex's`]]
   * node corresponding to the rightmost vertex of the sweepline edge.
   */
  constructor(leftVertex: LinkedListNode<Point>, rightVertexIndex: 0 | 1) {
    this.leftVertex = leftVertex;
    this.rightVertexIndex = rightVertexIndex;
    const rightVertex = this.rightVertex();

    //Calculates the slope.
    this.slope =
      (leftVertex.value.coordinates[Global.index1] -
        rightVertex.value.coordinates[Global.index1]) /
      (leftVertex.value.coordinates[Global.index0] -
        rightVertex.value.coordinates[Global.index0]);

    //Gives the edge an immutable ID in terms of its vertices.
    //Uses the redirect table (read below).
    const x = leftVertex.getId();
    const y = rightVertex.getId();
    const newID = ((x + y) * (x + y + 1)) / 2 + y;

    this.id = SweeplineEdge.redirectTable[newID] || newID;
  }

  /**
   * The rightmost vertex of the edge, as determined by [[`rightVertexIndex`]].
   * @returns {LinkedListNode<Point>} The rightmost vertex of the edge.
   */
  rightVertex(): LinkedListNode<Point> {
    const rv = this.leftVertex.getNode(this.rightVertexIndex);
    if (!rv) throw new Error("An SLEdge must have two extremes!");
    return rv;
  }

  /**
   * Getter for the ID of the edge.
   *
   * @returns The ID.
   */
  getId(): number {
    return this.id;
  }

  directedEdge(): [LinkedListNode<Point>, LinkedListNode<Point>] {
    if (this.rightVertexIndex === 0)
      return [this.leftVertex, this.rightVertex()];
    else return [this.rightVertex(), this.leftVertex];
  }

  /**
   * Updates the {@link SweeplineEdge.redirectTable|redirect table} so that the
   * ID of the edge remains consisten even if the `leftVertex` changes.
   */
  updateRedirectTable(): void {
    const x = this.leftVertex.getId();
    const y = this.rightVertex().getId();
    const newID = ((x + y) * (x + y + 1)) / 2 + y;
    SweeplineEdge.redirectTable[newID] = this.id;
  }

  //TO DELETE
  //Used for debugging purposes
  toString(): string {
    return (
      "([" +
      this.leftVertex.value.coordinates.toString() +
      "], [" +
      this.rightVertex().value.coordinates.toString() +
      "])"
    );
  }
}
