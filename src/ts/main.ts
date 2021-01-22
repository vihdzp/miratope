import "./polytopes/classes/Global";
import Point from "./geometry/Point";
import GraphNode from "./data structures/GraphNode";
import Scene from "./rendering/Scene";
import Library from "./files/Library";
import { OFFOptions, saveAsOFF } from "./files/OFF";
import { GGBOptions, saveAsGGB } from "./files/GGB";
import { PolytopeB } from "./polytopes/types";
import Build from "./polytopes/classes/Build";
import Product from "./polytopes/classes/Product";
import CD from "./polytopes/classes/CD";
import Render from "./rendering/render";

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
  Library.openFile,
  false
);

//Basic variables. Should probably be put in a class in the future.
globalThis.P; //Temp variable. OFF imports to here.

//Configures the basic attributes of the scene.
globalThis.mainScene = new Scene();

//Declares aliases for functions declared in classes other than PolytopeB.

/**
 * Saves the current polytope as an OFF file.
 *
 * @param options The file saving options.
 * @todo Deal with the nullitope case.
 */
PolytopeB.prototype["saveAsOFF"] = function (options: OFFOptions = {}): void {
  saveAsOFF(this, options);
};

//Declared in ggb.ts.
PolytopeB.prototype["saveAsGGB"] = function (options: GGBOptions): void {
  saveAsGGB(this, options);
};

//Declared in Build.ts.
PolytopeB.prototype["extrudeToPyramid"] = function (
  apex: Point | number
): PolytopeB {
  return Build.extrudeToPyramid(this, apex);
};

//Declared in Products.ts.
PolytopeB.prototype["extrudeToPrism"] = function (height: number): PolytopeB {
  return Product.extrudeToPrism(this, height);
};

//Declared in CD.ts.
PolytopeB.prototype["toGraph"] = function (): GraphNode<number>[] {
  return CD.toGraph(this);
};

//Declared in render.ts.
PolytopeB.prototype["renderTo"] = function (scene: Scene): void {
  Render.to(this, scene);
};
