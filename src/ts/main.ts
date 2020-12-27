import "./polytopes/classes/polytope";
import "./rendering/render";
import { Scene } from "./rendering/scene";
import { FileOperations } from "./file operations/fileOperations";

declare global {
  interface Math {
    gcd(a: number, b: number): number;
  }
}

if (!Math.gcd) {
  /**
   * Helper function for {@linkcode Polytope.regularPolygon} and
   * {@linkcode Translation.regularPolygonName}.
   * Just the most basic form of the Euclidean algorithm.
   * @private
   * @param {number} a The first number.
   * @param {number} b The second number.
   * @returns {number} The greatest common divisor of `a` and `b`.
   */
  Math.gcd = function (a: number, b: number): number {
    let t: number;
    while (b !== 0) {
      t = b;
      b = a % b;
      a = t;
    }
    return a;
  };
}

//Configure OFF import button.
(document.getElementById("file-input") as HTMLElement).addEventListener(
  "change",
  FileOperations.openFile,
  false
);

//Basic variables. Should probably be put in a class in the future.
globalThis.P; //Temp variable. OFF imports to here.

//Configures the basic attributes of the scene.
globalThis.mainScene = new Scene();

//elementList is an array of arrays of arrays that contains all of a Polytope's
//elements.
//elementList = [[points], [edges], [faces],..., [ridges], [facets]].
//A single array in elementList is itself a list of that type of element.
//The third edge of a polytope would be elementList[1][2].
