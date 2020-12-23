import { GraphNode } from "../../data structures/graphNode";
import { PolytopeB } from "../polytopeTypes";

export abstract class PolytopeCD {
  /**
   * Creates a Schläfli matrix from a Coxeter diagram
   * @param {string} diagram The input Coxeter diagram
   * @returns {number[][]} A 2D array corresponding to the CD's Schläfli matrix
   */
  static cdToMatrix(diagram: string): number[][] {
    if(/[a-z][a-z]/.test(diagram))
      throw new Error("Hey! I see you inputting a compound! Stop that >:[");
    if(/[#]/.test(diagram))
      throw new Error("Laces don't work yet, sorry :/");
    if(/[']/.test(diagram))
      throw new Error("Retrograde stuff doesn't work yet, sorry :/");
    diagram = diagram.replace(/-/gi, "");
    let dimen = diagram.replace(/\*.|[^a-z\u03B2]/gi, "").length;
    let alpha = 0;
    let marked = "";
    let v = false;
    for(let i = 0; i < diagram.length; i++){
      let char = diagram.charAt(i);
      check:
      if(/[^1234567890/ \u221E\u00D8]/.test(char)) {
        if(/\*/.test(char)) {
          v = true;
          break check;
        }
        if(v) {
          v = false;
          break check;
        }
        alpha++;
        char = (alpha + 9).toString(36);
      }
      marked = marked + char;
    }
    marked = marked.replace(/\*/gi, "");
    let pat = /(?=(([a-z]\d+[a-z])|([a-z]\d+\/\d+[a-z])|([a-z]\u221E+[a-z])|([a-z]\u00D8+[a-z])))./g;
    let angles: string[] = [];
    let match: RegExpExecArray | null;
    while((match = pat.exec(marked)) != null)
      angles.push(match[1]);

    let schlafl: number[][] = [];
    for(let i = 0; i < dimen; i++) {
      schlafl[i] = [];
      for(let j = 0; j < dimen; j++) {
        schlafl[i][j] = 0;
        if(i == j) {
          schlafl[i][j] = 2;
        }
      }
    }
    for(let i = 0; i < angles.length; i++) {
      let mira1 = angles[i].charCodeAt(0) - 97;
        let mira2 = angles[i].charCodeAt(angles[i].length-1) - 97;
        if(mira2 > mira1) {
          mira1 = angles[i].charCodeAt(angles[i].length-1) - 97;
          mira2 = angles[i].charCodeAt(0) - 97;
        }
        let num1 = parseInt(angles[i].substring(1, angles[i].length - 1));
        let num2: number;
        let ang = -2*Math.cos(Math.PI/num1);
        if(/[\u221E\u00D8]/.test(angles[i].substring(1,angles[i].length - 1))) {ang = -2};
        if(/\//.test(angles[i])) {
          num1 = parseInt(angles[i].substring(1, angles[i].search("/")));
          num2 = parseInt(angles[i].substring(angles[i].search("/") + 1, angles[i].length-1));
          ang = -2 * Math.cos(Math.PI / (num1 / num2));
        }
        schlafl[mira1][mira2] = ang;
        schlafl[mira2][mira1] = ang;
    }
    return schlafl;
  };

  /**
   * Returns a polytope's dimension and space shape from a Coxeter diagram
   * @param {string} diagram The input Coxeter diagram
   * @returns {[number, number?]} An array with the first entry being the dimension and the second is 1 for spherical, 0 for euclidean, and -1 for hyperbolic (and null when something is wrong)
   */
  static spaceShape(diagram: string): [number, number | null] {
    let schlafl = PolytopeCD.cdToMatrix(diagram);
    var det = Math.round(PolytopeCD.determinant(schlafl) * 1000) / 1000;
    //var space = [];
    diagram = diagram.replace(/-/gi, "");
    let dimen = diagram.replace(/\*.|[^a-z\u03B2]/gi, "").length;
    let shape: number | null = Math.sign(det);
    if(isNaN(det)) shape = null;
    return [dimen, shape];
  };

  /**
   * Returns the determinant of a matrix.
   * @param {number[][]} diagram A matrix in the form of a 2D array
   * @returns {number} The matrix's determinant
   * @private
   * @todo Use Gaussian elimination to calculate the determinant much quicker.
   */
  static determinant(schlafl: number[][]): number {
    if (schlafl.length == 1) {
      if (typeof schlafl[0] === 'object' )
        return schlafl[0][0];
      else
        return schlafl[0];
    }

    let minors: number[][][] = [];
    for (let i = 0; i < schlafl[0].length; i++) {
      minors[i] = [];
      for (let j = 0; j < schlafl[0].length; j++) {
        if (j == 0) continue;
        if (!minors[i][j - 1]) minors[i][j - 1] = [];
        for (let k = 0; k < schlafl[0].length; k++) {
          if (k == i) continue;
          minors[i][j - 1].push(schlafl[j][k]);
        }
      }
    }

    let multiplier = 1;
    let subResults: number[] = [];
    for (let i = 0; i < schlafl.length; i++) {
      subResults[i] = multiplier * schlafl[0][i] * PolytopeCD.determinant(minors[i]);
      multiplier *= -1;
    }
    return subResults.reduce( function( sum, val ) {return sum + val; }, 0 );
  };
}

/**
 * Creates a graph from the vertices and edges of a polyhedron.
 * Adds labels edges based on their adjacent faces.
 * @todo Could this be changed to work for higher/lower dimensions too?
 * @returns {GraphNode<number>[]} The graph of the polytope.
 */
PolytopeB.prototype.polytopeToGraph = function(): GraphNode<number>[] {
  let P = this.toPolytopeC();
  if(!P.elementList[0] || !P.elementList[1] || !P.elementList[2])
    throw new RangeError("polytopeToGraph only works for 3D+!");

  let gNodes: GraphNode<number>[] = [];
  let gLinks: [GraphNode<number>, GraphNode<number>][] = [];
  for(let v = 0; v < P.elementList[0].length; v++) {
    let gNode = new GraphNode(v);
    gNodes.push(gNode);
  }
  for(let f = 0; f < P.elementList[2].length; f++) {
    for(let e = 0; e < P.elementList[2][f].length; e++) {
      let p1 = gNodes[P.elementList[1][P.elementList[2][f][e]][0]];
      let p2 = gNodes[P.elementList[1][P.elementList[2][f][e]][1]];
      if(gLinks.includes([p1, p2])){
        p1.labels[p1.neighbors.indexOf(p2)] = f;
        p2.labels[p2.neighbors.indexOf(p1)] = f;
      } else {
        p1.connectTo(p2, f);
        gLinks.push([p1, p2]);
      }
    }
  }
  return gNodes;
};
