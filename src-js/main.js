"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./polytopes/classes/polytope");
require("./rendering/render");
const scene_1 = require("./rendering/scene");
const fileOperations_1 = require("./file operations/fileOperations");
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
    Math.gcd = function (a, b) {
        let t;
        while (b !== 0) {
            t = b;
            b = a % b;
            a = t;
        }
        return a;
    };
}
//Configure OFF import button.
document.getElementById('file-input').addEventListener('change', fileOperations_1.FileOperations.openFile, false);
//Basic variables. Should probably be put in a class in the future.
globalThis.P; //Temp variable. OFF imports to here.
//A small number, used as a threshold for certain rendering operations.
//Should probs be reworked.
globalThis.epsilon = 0.000000000001;
//Configures the basic attributes of the scene.
globalThis.mainScene = new scene_1.Scene();
//elementList is an array of arrays of arrays that contains all of a Polytope's elements:
//elementList = [[points], [edges], [faces],..., [ridges], [facets]]
//A single array in elementList is itself a list of that type of element
//The third edge of a polytope would be elementList[1][2]
//# sourceMappingURL=main.js.map