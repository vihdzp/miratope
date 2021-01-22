import Global from "../global";
import Point from "./Point";

/**
 * Calculates the intersection of two segments.
 * Assumes that these segments are coplanar, but not collinear.
 * Ignores the intersection if it lies outside of the segments, or
 * "too close" to the endpoints.
 *
 * @param a The first endpoint of the first segment.
 * @param b The second endpoint of the first segment.
 * @param c The first endpoint of the second segment.
 * @param d The second endpoint of the second segment.
 * @returns The intersection point of segments `ab` and `cd`, or `null` if
 * there's none.
 */
export const intersect = function (
  a: Point,
  b: Point,
  c: Point,
  d: Point
): Point | null {
  //Checks if any of the points are in different dimensional spaces
  if (
    a.dimensions() !== b.dimensions() ||
    a.dimensions() !== c.dimensions() ||
    a.dimensions() !== d.dimensions()
  )
    throw new Error(
      "You can't intersect edges with different amounts of dimensions!"
    );

  //This projects a, b-a, c, d-c onto the a plane
  //Then, adapts the method from https://stackoverflow.com/a/565282 (by Gareth Rees)
  const p = [a.coordinates[Global.index0], a.coordinates[Global.index1]],
    r = [
      b.coordinates[Global.index0] - a.coordinates[Global.index0],
      b.coordinates[Global.index1] - a.coordinates[Global.index1],
    ],
    q = [c.coordinates[Global.index0], c.coordinates[Global.index1]],
    s = [
      d.coordinates[Global.index0] - c.coordinates[Global.index0],
      d.coordinates[Global.index1] - c.coordinates[Global.index1],
    ];

  //If the two lines' slopes are very similar, do nothing.
  //They either not intersect or are too similar for us to care.
  if (sameSlope(r[0], r[1], s[0], s[1])) return null;

  const t =
      ((p[0] - q[0]) * s[1] - (p[1] - q[1]) * s[0]) /
      (s[0] * r[1] - s[1] * r[0]),
    u =
      ((p[0] - q[0]) * r[1] - (p[1] - q[1]) * r[0]) /
      (s[0] * r[1] - s[1] * r[0]);

  //The intersection lies outside of the segments, or at infinity
  //Makes sure that "t" and "u" are both inbetween Global.epsilon and 1
  if (
    t <= Global.epsilon ||
    t >= 1 - Global.epsilon ||
    u <= Global.epsilon ||
    u >= 1 - Global.epsilon
  )
    return null;

  //Returns the point a + t * (b - a).
  const pt: number[] = [];
  for (let i = 0; i < a.dimensions(); i++)
    pt.push(a.coordinates[i] + (b.coordinates[i] - a.coordinates[i]) * t);
  return new Point(pt);
};

/**
 * Checks if three points are "approximately" collinear.
 *
 * @param a The first point.
 * @param b The second point.
 * @param c The third point.
 * @returns Whether the angle between b - a and c - a is straight to a given
 * precision.
 */
export const collinear = function (a: Point, b: Point, c: Point): boolean {
  //If "a" is the same as "b" or "c"
  if (Point.equal(a, b) || Point.equal(a, c)) return true;

  //Calculates (b - a) . (c - a), |b - a|, |c - a|.
  //This will be used to calculate the angle between them.
  let dot = 0,
    norm0 = 0,
    norm1 = 0;

  for (let i = 0; i < a.coordinates.length; i++) {
    const sub0 = b.coordinates[i] - a.coordinates[i];
    const sub1 = c.coordinates[i] - a.coordinates[i];
    dot += sub0 * sub1;
    norm0 += sub0 * sub0;
    norm1 += sub1 * sub1;
  }

  //Returns true iff the cosine of the angle between b - a and c - a is at a
  //distance Global.epsilon from 1 or -1.
  return 1 - Math.abs(dot / Math.sqrt(norm0 * norm1)) <= Global.epsilon;
};

/**
 * Calculates the area of the triangle determined by three vertices
 * when projected onto a specific plane.
 *
 * @param a The first of the triangle's vertices.
 * @param b The first of the triangle's vertices.
 * @param c The first of the triangle's vertices.
 * @param j The first coordinate of the projection plane.
 * @param k The second coordinate of the projection plane.
 */
export const area = function (
  a: Point,
  b: Point,
  c: Point,
  j: number,
  k: number
): number {
  return Math.abs(
    a.coordinates[j] * (b.coordinates[k] - c.coordinates[k]) +
      b.coordinates[j] * (c.coordinates[k] - a.coordinates[k]) +
      c.coordinates[j] * (a.coordinates[k] - b.coordinates[k])
  );
};

/**
 * Calculates the squared Euclidean distance between two points.
 * For when you don't need that last square root.
 *
 * @param a The first point.
 * @param b The second point.
 * @returns The squared distance between `a` and `b`.
 */
export const distanceSq = function (a: Point, b: Point): number {
  let res = 0;

  for (let i = 0; i < a.coordinates.length; i++) {
    const t = a.coordinates[i] - b.coordinates[i];
    res += t * t;
  }

  return res;
};

/**
 * Calculates the Euclidean distance between two points.
 *
 * @param a The first point.
 * @param b The second point.
 * @returns The distance between `a` and `b`.
 */
export const distance = function (a: Point, b: Point): number {
  return Math.sqrt(distanceSq(a, b));
};

/**
 * Checks if two lines are "approximately" parallel.
 *
 * @param a The first coordinate.
 * @param b The second coordinate.
 * @param c The third coordinate.
 * @param d The fourth coordinate.
 * @returns Whether the line from (0, 0) to (a, b) and the line from (0, 0) to
 * (c, d) have neglibly different slopes.
 */
export const sameSlope = function (
  a: number,
  b: number,
  c: number,
  d: number
): boolean {
  //s is the difference between the angles.
  const s = Math.atan(a / b) - Math.atan(c / d);

  //Returns whether the angles (mod pi) are different by less than
  //Global.epsilon.
  return (s + Math.PI + Global.epsilon) % Math.PI < 2 * Global.epsilon;
};
