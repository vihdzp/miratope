import * as THREE from "three";
import * as MathJS from "mathjs";
import Global from "../global";

/**
 * A class for points in arbitary dimensions.
 * Meant for Euclidean space, though hyperbolic space may be eventually
 * implemented.
 *
 * @category Geometry
 */
export default class Point {
  coordinates: number[];

  /**
   * Constructor for the Point class.
   *
   * @param x Either the number of dimensions of the point, or its coordinate
   * array.
   */
  constructor(x: number[] | number) {
    //Constructor from the number of dimensions "x", initializes a point at the
    //origin of R^x
    if (typeof x === "number") {
      this.coordinates = [];
      for (let i = 0; i < x; i++) this.coordinates[i] = 0;
    }

    //Constructor from the coordinates.
    else this.coordinates = x;
  }

  /**
   * Returns the number of dimensions of the point's space.
   *
   * @returns The number of coordinates of the point.
   */
  dimensions(): number {
    return this.coordinates.length;
  }

  /**
   * Clones a Point object. Uses a simple shallow copy.
   *
   * @returns A new Point object with the same coordinates as `this`.
   */
  clone(): Point {
    const coordinates: number[] = [];

    for (let i = 0; i < this.coordinates.length; i++)
      coordinates.push(this.coordinates[i]);

    return new Point(coordinates);
  }

  /**
   * Projects the point into 3D.
   * For now, just the simplest orthographic projection possible.
   *
   * @returns The projected point.
   */
  project(): Point {
    return Point.padRight(this, 3 - this.coordinates.length);
  }

  /**
   * Adds the coordinates of `P` to the coordinates of `this`.
   * Both need to have the same amount of dimensions.
   *
   * @returns The point `this`, but with the modified coordinates.
   * @throws Will throw an error if the added point does not have the same
   * number of dimensions.
   */
  add(P: Point): Point {
    //The points need to have the same number of coordinates.
    if (P.dimensions() !== this.dimensions())
      throw new Error(
        "You can't add points with different amounts of dimensions!"
      );

    //Adds the respective coordinates.
    for (let i = 0; i < P.dimensions(); i++)
      this.coordinates[i] += P.coordinates[i];

    return this;
  }

  /**
   * Subtracts the coordinates of `P` from the coordinates of `this`.
   * Both need to have the same amount of dimensions.
   *
   * @returns The point `this`, but with the modified coordinates.
   * @throws Will throw an error if the subtracted point does not have the same
   * number of dimensions.
   */
  subtract(P: Point): Point {
    //The points need to have the same number of coordinates.
    if (P.dimensions() !== this.dimensions())
      throw new Error(
        "You can't add points with different amounts of dimensions!"
      );

    //Add the respective coordinates.
    for (let i = 0; i < P.dimensions(); i++)
      this.coordinates[i] -= P.coordinates[i];

    return this;
  }

  /**
   * Scales up `this` by a factor of `r`.
   * Simple scalar multiplication.
   *
   * @param r The scaling factor.
   * @returns The point `this`, but scaled.
   */
  scale(r: number): Point {
    //Multiplies each of the coordinates of x by r.
    for (let i = 0; i < this.dimensions(); i++)
      this.coordinates[i] = this.coordinates[i] * r;

    return this;
  }

  /**
   * Takes the Cartesian product of two points.
   * Simply concatenates the coordinates of both points.
   *
   * @param P The first point to multiply.
   * @param Q The second point to multiply.
   * @returns The product of both points.
   */
  static product(P: Point, Q: Point): Point {
    return new Point(P.coordinates.concat(Q.coordinates));
  }

  /**
   * Pads a point's coordinates with zeros to the left.
   *
   * @param P The point to be padded.
   * @param n The number of added zeros.
   * @returns The padded point.
   */
  static padLeft(P: Point, n: number): Point {
    const coordinates: number[] = [];

    for (let i = 0; i < n; i++) coordinates.push(0);

    for (let i = 0; i < P.coordinates.length; i++)
      coordinates.push(P.coordinates[i]);

    return new Point(coordinates);
  }

  /**
   * Pads a point's coordinates with zeros to the right.
   *
   * @param P The point to be padded.
   * @param n The number of added zeros.
   * @returns The padded point.
   */
  static padRight(P: Point, n: number): Point {
    const coordinates: number[] = [];

    for (let i = 0; i < P.coordinates.length; i++)
      coordinates.push(P.coordinates[i]);

    for (let i = 0; i < n; i++) coordinates.push(0);

    return new Point(coordinates);
  }

  /**
   * Adds a given coordinate to the end of the coordinate list.
   *
   * @param coord The coordinate to be added.
   * @returns The modified point.
   */
  addCoordinate(coord: number): Point {
    this.coordinates.push(coord);
    return this;
  }

  /**
   * Converts a point to the `Vector3` class used by three.js.
   * Meant only for 3D points – simply copies the coordinates over.
   *
   * @returns The `Vector3` with the same coordinates as the point.
   */
  toVector3(): THREE.Vector3 {
    return new THREE.Vector3(...this.coordinates);
  }

  /**
   * Checks if two points are equal, to a predetermined precision.
   *
   * @param a The first point to compare.
   * @param b The second point to compare.
   * @returns Whether the respective coordinates are "similar enough" by
   * floating point standards.
   */
  static equal(a: Point, b: Point): boolean {
    for (let i = 0; i < a.coordinates.length; i++)
      if (
        Math.abs(a.coordinates[i] - b.coordinates[i]) >
        Math.abs(a.coordinates[i] * Global.epsilon)
      )
        return false;

    return true;
  }

  /**
   * Calculates a point's magnitude.
   *
   * @returns The distance of a point to the origin.
   */
  magnitude(): number {
    let res = 0;

    for (let i = 0; i < this.coordinates.length; i++) {
      const t = this.coordinates[i];
      res += t * t;
    }

    return Math.sqrt(res);
  }

  /**
   * Multiplies a matrix by the vector defined by the point.
   *
   * @param matrix The rotation matrix to apply to the point.
   * @returns The resulting point.
   */
  applyMatrix(matrix: MathJS.Matrix): Point {
    //The point is treated as a row vector, so we transpose it.
    const columnVector = MathJS.transpose(MathJS.matrix([this.coordinates])),
      mat = MathJS.multiply(matrix, columnVector);

    //We return the point whose coordinates are the single row of the
    //multiplication's result.
    return new Point(MathJS.transpose(mat).toArray()[0]);
  }
}
