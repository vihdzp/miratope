import * as THREE from "three";
import * as MathJS from "mathjs";
import Global from "../global";

export default class Point {
  coordinates: number[];

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
   * @returns The number of coordinates of the point.
   */
  dimensions(): number {
    return this.coordinates.length;
  }

  /**
   * Clones a Point object. Uses a simple shallow copy.
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
   * @returns The projected point.
   */
  project(): Point {
    return Point.padRight(this, 3 - this.coordinates.length);
  }

  /**
   * Adds the coordinates of `P` to the coordinates of a point.
   * Both need to have the same amount of dimensions.
   * @returns The point with the added coordinates.
   * @throws Will throw an error if the added point does not have the same
   * number of dimensions.
   */
  add(P: Point): Point {
    if (P.dimensions() !== this.dimensions())
      //The points need to have the same number of coordinates.
      throw new Error(
        "You can't add points with different amounts of dimensions!"
      );
    for (
      let i = 0;
      i < P.dimensions();
      i++ //Add the respective coordinates.
    )
      this.coordinates[i] += P.coordinates[i];
    return this;
  }

  /**
   * Subtracts the coordinates of `P` to the coordinates of a point.
   * Both need to have the same amount of dimensions.
   * @returns The point with the subtracted coordinates.
   * @throws Will throw an error if the subtracted point does not have the same
   * number of dimensions.
   */
  subtract(P: Point): Point {
    if (P.dimensions() !== this.dimensions())
      //The points need to have the same number of coordinates.
      throw new Error(
        "You can't add points with different amounts of dimensions!"
      );
    for (
      let i = 0;
      i < P.dimensions();
      i++ //Add the respective coordinates.
    )
      this.coordinates[i] -= P.coordinates[i];
    return this;
  }

  /**
   * Scales up a point by a factor of `r`.
   * Simple scalar multiplication.
   * @param r The scaling factor.
   */
  scale(r: number): Point {
    for (let i = 0; i < this.dimensions(); i++)
      //Multiplies each of the coordinates of x by r.
      this.coordinates[i] = this.coordinates[i] * r;
    return this;
  }

  /**
   * Takes the Cartesian product of two points.
   * Simply concatenates the coordinates of both points.
   * @param P The first point to multiply.
   * @param Q The second point to multiply.
   * @returns The product of both points.
   */
  static product(P: Point, Q: Point): Point {
    //Simply concatenates the coordinates of both points.
    return new Point(P.coordinates.concat(Q.coordinates));
  }

  /**
   * Pads a point's coordinates with zeros to the left.
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
   * @param coord The coordinate to be added.
   * @returns The modified point.
   */
  addCoordinate(coord: number): Point {
    this.coordinates.push(coord);
    return this;
  }

  //Converts to the Vector3 class used by three.js
  //Meant only for 3D points.
  //Simply copies the coordinates over.
  toVector3(): THREE.Vector3 {
    return new THREE.Vector3(
      this.coordinates[0],
      this.coordinates[1],
      this.coordinates[2]
    );
  }

  //Checks if two points are equal, to a predetermined precision
  //Simply checks whether the respective coordinates are "similar enough" by
  //floating point standards.
  static equal(a: Point, b: Point): boolean {
    for (let i = 0; i < a.coordinates.length; i++)
      if (
        Math.abs(a.coordinates[i] - b.coordinates[i]) >
        Math.abs(a.coordinates[i] * Global.epsilon)
      )
        return false;

    return true;
  }

  //Returns the distance of a point to the origin.
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
