import GraphNode, { Graph } from "../../data structures/graphNode";
import { PolytopeB } from "../Types";
import * as MathJS from "mathjs";

/**
 * A class containing various methods to work with
 * [[Coxeter-Dynkin diagrams | https://polytope.miraheze.org/wiki/Coxeter_diagram]].
 *
 * @category Polytope Method
 */
export default abstract class CD {
  static parse(diagram: string): Graph<string> {
    return new Graph<string>([new GraphNode<string>(diagram)]);
  }

  /**
   * Creates a Schläfli matrix from a Coxeter diagram
   *
   * @param diagram The input Coxeter diagram
   * @returns A 2D array corresponding to the CD's Schläfli matrix
   */
  static toMatrix(diagram: string): MathJS.Matrix {
    if (/[a-z][a-z]/.test(diagram))
      throw new Error("Compounds not yet supported.");

    if (/[#]/.test(diagram)) throw new Error("Laces not yet supported.");

    if (/[']/.test(diagram)) throw new Error("Retrogrades not yet supported.");

    diagram = diagram.replace(/-/gi, "");
    const dimen = diagram.replace(/\*.|[^a-z\u03B2]/gi, "").length;
    let alpha = 0;
    let marked = "";
    let v = false;
    for (let i = 0; i < diagram.length; i++) {
      let char = diagram.charAt(i);
      check: if (/[^1234567890/ \u221E\u00D8]/.test(char)) {
        if (/\*/.test(char)) {
          v = true;
          break check;
        }
        if (v) {
          v = false;
          break check;
        }
        alpha++;
        char = (alpha + 9).toString(36);
      }
      marked = marked + char;
    }
    marked = marked.replace(/\*/gi, "");
    const pat = /(?=(([a-z]\d+[a-z])|([a-z]\d+\/\d+[a-z])|([a-z]\u221E+[a-z])|([a-z]\u00D8+[a-z])))./g;
    const angles: string[] = [];
    let match: RegExpExecArray | null;
    while ((match = pat.exec(marked)) != null) angles.push(match[1]);

    const schlafl: number[][] = [];
    for (let i = 0; i < dimen; i++) {
      schlafl[i] = [];
      for (let j = 0; j < dimen; j++) {
        schlafl[i][j] = 0;
        if (i === j) schlafl[i][j] = 2;
      }
    }

    for (let i = 0; i < angles.length; i++) {
      let mira1 = angles[i].charCodeAt(0) - 97;
      let mira2 = angles[i].charCodeAt(angles[i].length - 1) - 97;

      if (mira2 > mira1) {
        mira1 = angles[i].charCodeAt(angles[i].length - 1) - 97;
        mira2 = angles[i].charCodeAt(0) - 97;
      }

      let num1 = parseInt(angles[i].substring(1, angles[i].length - 1));
      let num2: number;
      let ang = -2 * Math.cos(Math.PI / num1);

      if (/[\u221E\u00D8]/.test(angles[i].substring(1, angles[i].length - 1)))
        ang = -2;

      if (/\//.test(angles[i])) {
        num1 = parseInt(angles[i].substring(1, angles[i].search("/")));
        num2 = parseInt(
          angles[i].substring(angles[i].search("/") + 1, angles[i].length - 1)
        );
        ang = -2 * Math.cos(Math.PI / (num1 / num2));
      }

      schlafl[mira1][mira2] = ang;
      schlafl[mira2][mira1] = ang;
    }

    return MathJS.matrix(schlafl) as MathJS.Matrix;
  }

  /**
   * Returns a polytope's dimension and space shape from a Coxeter diagram
   *
   * @param diagram The input Coxeter diagram
   * @returns An array with the first entry being the dimension and the second
   * is 1 for spherical, 0 for euclidean, and -1 for hyperbolic (and null when
   * something is wrong)
   */
  static spaceShape(diagram: string): [number, number | null] {
    const schlafli = CD.toMatrix(diagram);
    const det = MathJS.det(schlafli);

    //var space = [];
    diagram = diagram.replace(/-/gi, "");
    const dimen = diagram.replace(/\*.|[^a-z\u03B2]/gi, "").length;
    let shape: number | null = Math.sign(det);
    if (isNaN(det)) shape = null;
    return [dimen, shape];
  }

  /**
   * Creates a graph from the vertices and edges of a polyhedron.
   * Adds labels edges based on their adjacent faces.
   *
   * @todo Could this be changed to work for higher/lower dimensions too?
   * @returns The graph of the polytope.
   */
  static toGraph(polytope: PolytopeB): GraphNode<number>[] {
    const P = polytope.toPolytopeC();

    if (!P.elementList[0] || !P.elementList[1] || !P.elementList[2])
      throw new RangeError("polytopeToGraph only works for 3D+!");

    const gNodes: GraphNode<number>[] = [];
    const gLinks: [GraphNode<number>, GraphNode<number>][] = [];
    for (let v = 0; v < P.elementList[0].length; v++) {
      const gNode = new GraphNode(v);
      gNodes.push(gNode);
    }

    for (let f = 0; f < P.elementList[2].length; f++) {
      for (let e = 0; e < P.elementList[2][f].length; e++) {
        const p1 = gNodes[P.elementList[1][P.elementList[2][f][e]][0]];
        const p2 = gNodes[P.elementList[1][P.elementList[2][f][e]][1]];
        if (gLinks.includes([p1, p2])) {
          p1.labels[p1.neighbors.indexOf(p2)] = f;
          p2.labels[p2.neighbors.indexOf(p1)] = f;
        } else {
          p1.connectTo(p2, f);
          gLinks.push([p1, p2]);
        }
      }
    }
    return gNodes;
  }
}
