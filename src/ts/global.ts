/**
 * Stores the global variables used by Miratope.
 * We could just use `globalThis`, but polluting the global namespace is bad
 * practice.
 */
export default abstract class Global {
  // As part of the render algorithm, every polygon is projected down into 2D.
  // This projection is done by selecting only two of the coordinates of each
  // Point.
  // The indices of the selected coordinates are stored in index0 and index1.
  // index2 is provided as an auxiliary variable.
  // These variables might better belong elsewhere.
  // I just put them here 'cause I didn't want to pollute the global namespace.
  static index0 = -1;
  static index1 = -1;
  static index2 = -1;

  // In the render code, stores whether a polygonal face's vertices needs to be
  // reversed.
  // This is calculated in the modified version of three.js.
  static reversePolygon = false;

  static epsilon = 1e-12;
}
