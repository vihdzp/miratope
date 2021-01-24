import "./Translation/load";
import Point from "./geometry/Point";
import Scene from "./rendering/Scene";
import * as Library from "./files/Library";
import { OFFOptions, saveAsOFF } from "./files/OFF";
import { GGBOptions, saveAsGGB } from "./files/GGB";
import { PolytopeB } from "./polytopes/types";
import * as Build from "./polytopes/classes/Build";
import * as Product from "./polytopes/classes/Product";
import CD from "./Data structures/CD";
import Render from "./rendering/Render";
import { setLanguage } from "./Translation/Language";

/** @internal */
declare global {
  interface Math {
    gcd(a: number, b: number): number;
  }
}

// Adds a quick & convenient implementation of the Euclidean algorithm.
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

// Configure OFF import button.
(document.getElementById("file-input") as HTMLElement).addEventListener(
  "change",
  Library.openFile,
  false
);

// Basic variables. Should probably be put in a class in the future.
globalThis.P; // Temp variable. OFF imports to here.

// Configures the basic attributes of the scene.
globalThis.mainScene = new Scene();

globalThis.setLanguage = setLanguage;

// Declares aliases for functions declared in classes other than PolytopeB.

// Declared in off.ts.
PolytopeB.prototype["saveAsOFF"] = function (options: OFFOptions = {}): void {
  saveAsOFF(this, options);
};

// Declared in ggb.ts.
PolytopeB.prototype["saveAsGGB"] = function (options: GGBOptions): void {
  saveAsGGB(this, options);
};

// Declared in Build.ts.
PolytopeB.prototype["extrudeToPyramid"] = function (
  apex: Point | number
): PolytopeB {
  return Build.extrudeToPyramid(this, apex);
};

// Declared in Products.ts.
PolytopeB.prototype["extrudeToPrism"] = function (height: number): PolytopeB {
  return Product.extrudeToPrism(this, height);
};

// Declared in CD.ts.
/* PolytopeB.prototype["toGraph"] = function (): GraphNode<number>[] {
  return CD.toGraph(this);
};*/

// Declared in render.ts.
PolytopeB.prototype["renderTo"] = function (scene: Scene): void {
  Render.to(this, scene);
};

// Exposes the internal classes.
globalThis.Build = Build;
globalThis.CD = CD;
globalThis.Product = Product;
globalThis.Library = Library;
