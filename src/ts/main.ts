import "./polytopes/classes/polytope";
import "./rendering/render";
import Scene from "./rendering/scene";
import FileOperations from "./file operations/fileOperations";

/** @internal */
declare global {
  interface Math {
    gcd(a: number, b: number): number;
  }
}

if (!Math.gcd) {
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
