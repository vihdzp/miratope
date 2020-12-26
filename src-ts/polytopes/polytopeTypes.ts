import * as THREE from "three";
import { TrackballControls } from "../rendering/trackball-controls";
import {
  CNName,
  CNPlain,
  ConstructionNode,
} from "../data structures/constructionNode";
import { GraphNode } from "../data structures/graphNode";
import { LinkedListNode } from "../data structures/linkedListNode";
import { Point } from "../geometry/point";
import { ConcreteGroup } from "../data structures/group";
import { Matrix } from "../data structures/matrix";
import { Flag, FlagClass, Simplifier } from "../data structures/flag";

export type ElementList = [Point[], ...number[][][]] | [];

export enum PolytopeType {
  C,
  S,
}

export interface OFFOptions {
  comments?: boolean;
}

interface Scene {
  scene: THREE.Scene;
  polytopes: PolytopeB[];
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  ambientLight: THREE.AmbientLight;
  directionalLight: THREE.DirectionalLight;
  material: THREE.MeshLambertMaterial;
  controls: TrackballControls;
}

export abstract class PolytopeB {
  abstract construction: ConstructionNode<unknown>;
  abstract dimensions: number;
  abstract spaceDimensions: number;
  abstract readonly type: PolytopeType;
  abstract toPolytopeC(): PolytopeC;
  abstract scale(r: number): PolytopeB;
  abstract move(P: Point, mult: number): PolytopeB;

  abstract circumradius(): number;
  abstract gravicenter(): Point;

  getName(): string {
    return this.construction.getName();
  }

  //Declared in off.ts.
  saveAsOFF(_options: OFFOptions): void {
    _options;
    throw new Error("saveAsOFF called before implementation!");
  }

  //Declared in ggb.ts.
  saveAsGGB(_wireframe: boolean): void {
    _wireframe;
    throw new Error("saveAsGGB called before implementation!");
  }

  //Declared in polytopeBuild.ts.
  extrudeToPyramid(_apex: Point | number): PolytopeB {
    _apex;
    throw new Error("extrudeToPyramid called before implementation!");
  }

  //Declared in polytopeProducts.ts.
  extrudeToPrism(_height: number): PolytopeB {
    _height;
    throw new Error("extrudeToPrism called before implementation!");
  }

  //Declared in polytopeCD.ts.
  polytopeToGraph(): GraphNode<number>[] {
    throw new Error("polytopeToGraph called before implementation!");
  }

  //Declared in render.ts.
  renderTo(_scene: Scene): void {
    _scene;
    throw new Error("renderTo called before implementation!");
  }
}

export class PolytopeC extends PolytopeB {
  construction: ConstructionNode<unknown>;
  dimensions: number;
  spaceDimensions: number;
  readonly type: PolytopeType;
  elementList: ElementList;

  /**
   * The constructor for the PolytopeC class.
   * @constructor
   * @param {ElementList} elementList The polytope's element list.
   * @param {ConstructionNode} constructionRoot The constructionNode
   * representing how the polytope was built.
   * @classDesc Represents a polytope as a list of elements, in ascending order
   * of dimensions,
   * similarly (but not identically) to an OFF file.
   * Subelements are stored as indices.
   * All points are assumed to be of the same dimension.
   */
  constructor(
    elementList: ElementList,
    constructionRoot?: ConstructionNode<unknown>
  ) {
    super();
    if (!constructionRoot)
      //The construction defaults to just the polytope itself.
      constructionRoot = new CNPlain([
        elementList[elementList.length - 2].length,
        elementList.length - 1,
      ]);

    this.construction = constructionRoot;
    this.dimensions = elementList.length - 1; //The rank of the polytope.
    this.elementList = elementList;
    this.type = PolytopeType.C;

    if (this.elementList[0])
      this.spaceDimensions = this.elementList[0][0].dimensions();
    else this.spaceDimensions = -1; //The almighty nullitope (aka nothing)
  }

  setConstruction(construction: ConstructionNode<unknown>): void {
    this.construction = construction;
    construction.polytope = this;
  }

  /**
   * Scales a polytope up or down.
   * @param {number} r The scaling factor.
   * @returns {Polytope} The scaled polytope.
   */
  scale(r: number): PolytopeC {
    if (!this.elementList[0]) return this;
    for (let i = 0; i < this.elementList[0].length; i++)
      this.elementList[0][i].scale(r);
    return this;
  }

  /**
   * Calculates the centroid of a polytope.
   * @returns {Point} The centroid of the polytope.
   */
  gravicenter(): Point {
    if (!this.elementList[0]) return new Point(0);

    const d = this.spaceDimensions;
    const res: number[] = [];

    for (let i = 0; i < d; i++) res.push(0);

    for (let i = 0; i < this.elementList[0].length; i++)
      for (let j = 0; j < d; j++)
        res[j] += this.elementList[0][i].coordinates[j];

    for (let i = 0; i < d; i++) res[i] /= this.elementList[0].length;

    return new Point(res);
  }

  circumradius(): number {
    const els = this.toPolytopeC().elementList;
    return els[0] ? els[0][0].magnitude() : 0;
  }

  move(P: Point, mult: number): PolytopeC {
    if (!this.elementList[0]) return this;
    const Q = P.clone().scale(mult);
    for (let i = 0; i < this.elementList[0].length; i++)
      this.elementList[0][i].add(Q);
    return this;
  }

  /**
   * Makes every vertex have a set number of coordinates either by adding zeros
   * or removing numbers.
   * @param {number} dim The new number of coordinates for each vertex.
   */
  setSpaceDimensions(dim: number): void {
    if (!this.elementList[0]) return;

    for (let i = 0; i < this.elementList[0].length; i++) {
      if (this.elementList[0][i].coordinates.length > dim)
        this.elementList[0][i].coordinates = this.elementList[0][
          i
        ].coordinates.slice(0, dim);
      else if (this.elementList[0][i].coordinates.length < dim)
        for (
          let j = 0;
          j < dim - this.elementList[0][i].coordinates.length;
          j++
        )
          this.elementList[0][i].coordinates.push(0);
    }
    this.spaceDimensions = dim;
  }

  /**
   * Converts the edge representation of the i-th face to an ordered array of
   * vertices.
   * @param {number} i The selected face.
   * @returns {number[]} An array with the indices of the vertices of the i-th
   * face in order.
   */
  faceToVertices(i: number): number[] {
    if (!this.elementList[2] || !this.elementList[2][i])
      throw RangeError("The polytope does not have that many 2-faces!");

    //Enumerates the vertices in order.
    //A doubly linked list does the job easily.
    const vertexDLL: LinkedListNode<number>[] = [];
    for (let j = 0; j < this.elementList[2][i].length; j++) {
      const edge = (this.elementList[1] as number[][])[
        this.elementList[2][i][j]
      ];
      if (vertexDLL[edge[0]] === undefined)
        vertexDLL[edge[0]] = new LinkedListNode<number>(edge[0]);
      if (vertexDLL[edge[1]] === undefined)
        vertexDLL[edge[1]] = new LinkedListNode<number>(edge[1]);

      vertexDLL[edge[0]].linkTo(vertexDLL[edge[1]]);
    }

    //Cycle of vertex indices.
    //"this.elementList[1][this.elementList[2][i][0]][0]" is just some vertex
    //index.
    return vertexDLL[
      (this.elementList[1] as number[][])[this.elementList[2][i][0]][0]
    ].getCycle();
  }

  /**
   * Places the gravicenter of the polytope at the origin.
   * @returns {PolytopeC} The recentered polytope.
   */
  recenter(): PolytopeC {
    return this.move(this.gravicenter(), -1);
  }

  /**
   * Ensures that we can always correctly call toPolytopeC on a polytope.
   * @returns {PolytopeC} The polytope, unchanged.
   */
  toPolytopeC(): PolytopeC {
    return this;
  }
}

//Represents a polytope in a way that takes advantage of symmetry
//Obviously, this requires a representation of the symmetry group.
//The other components are a description of how the flags (tuples of
//vertex/edge/face...) within a single domain connect to each other under
//"change vertex/edge/..." operations, matrices describing how the symmetry
//group affects the physical representation of the polytope, and positions of
//each class of vertices.
//In this implementation the symmetry group and its physical effects are
//bundled.
export class PolytopeS<T> extends PolytopeB {
  symmetries: ConcreteGroup<T>;
  flagClasses: FlagClass[];
  vertices: Point[];
  dimensions: number;
  spaceDimensions: number;
  construction: ConstructionNode<unknown>;
  readonly type: PolytopeType;
  private identitySimplifier: Simplifier<T>;

  constructor(
    symmetries: ConcreteGroup<T>,
    flagClasses: FlagClass[],
    vertices: Point[],
    dimensions: number
  ) {
    super();
    this.symmetries = symmetries;
    this.flagClasses = flagClasses;
    this.vertices = vertices;
    this.dimensions = dimensions;
    this.identitySimplifier = {};
    this.spaceDimensions = vertices[0].dimensions();
    this.type = PolytopeType.S;

    this.construction = new CNName("temp");
  }

  //The gravicenter is the gravicenter of the original vertices,
  //weighted by the inverse of the number of domains each vertex appears in,
  //projected onto the intersection of the eigenspaces of the generators
  //with eigenvalues 1.
  gravicenter(): Point {
    throw new Error("PolytopeS.gravicenter is not yet implemented");
  }

  scale(r: number): PolytopeB {
    for (let i = 0; i < this.vertices.length; i++) this.vertices[i].scale(r);
    return this;
  }

  move(_P: Point): PolytopeB {
    _P;
    throw new Error("PolytopeS move not yet implemented!");
  }

  circumradius(): number {
    throw new Error("PolytopeS circumradius not yet implemented!");
  }

  //Apply a flag-change operation to a flag.
  //Operators numbered from vertex to facet.
  moveFlag(flag: Flag<T>, generator: number): Flag<T> {
    const flagClass = flag.number;
    const flagDomain = flag.element;
    const effects = this.flagClasses[generator][flagClass];
    const newFlagClass = effects[0];
    let newFlagDomain = flagDomain;
    for (let i = 0; i < effects[1].length; i++)
      newFlagDomain = this.symmetries.multiply(
        newFlagDomain,
        this.symmetries.generators[effects[1][i]]
      );

    return new Flag(newFlagClass, newFlagDomain);
  }

  compareFlags(flag1: Flag<T>, flag2: Flag<T>): number {
    if (flag1.number < flag2.number) return -1;
    if (flag1.number > flag2.number) return 1;
    return this.symmetries.compare(flag1.element, flag2.element);
  }

  //Utility function for toPolytopeC.
  //Modifies a simplifier to use another generator.
  //Almost identical to the merge function but I don't really care rn.
  extendSimplifier(
    simplifier: Simplifier<T>,
    generator: number
  ): Simplifier<T> {
    const newSimplifier: Simplifier<T> = {};
    for (const i in simplifier) newSimplifier[i] = simplifier[i];
    for (const i in simplifier) {
      let oldLeftElem = new Flag(0, this.symmetries.identity());
      let leftElem = this.identitySimplifier[i];
      let oldRightElem = this.moveFlag(oldLeftElem, generator);
      let rightElem = this.moveFlag(leftElem, generator);
      while (
        oldLeftElem.number != leftElem.number ||
        !this.symmetries.equal(oldLeftElem.element, leftElem.element)
      ) {
        oldLeftElem = leftElem;
        leftElem = newSimplifier[leftElem.toString()];
        //console.log("upd left", ""+oldLeftElem, ""+leftElem);
      }
      while (
        oldRightElem.number != rightElem.number ||
        !this.symmetries.equal(oldRightElem.element, rightElem.element)
      ) {
        oldRightElem = rightElem;
        rightElem = newSimplifier[rightElem.toString()];
        //console.log("upd right", ""+oldRightElem, ""+rightElem);
      }
      const order = this.compareFlags(leftElem, rightElem);
      //console.log("order", ""+leftElem, ""+rightElem, order);
      if (order === 0) continue;
      if (order === -1) newSimplifier[rightElem.toString()] = leftElem;
      if (order === 1) newSimplifier[leftElem.toString()] = rightElem;
    }
    const betterSimplifier = {};
    for (const i in newSimplifier) {
      let oldElem = new Flag(0, this.symmetries.identity());
      let elem = newSimplifier[i];
      while (this.compareFlags(oldElem, elem)) {
        oldElem = elem;
        elem = newSimplifier[elem.toString()];
      }
      betterSimplifier[i] = elem;
    }
    return betterSimplifier;
  }

  //Utility function for toPolytopeC.
  //Merges two simplifiers.
  private mergeSimplifiers(
    simplifier1: Simplifier<T>,
    simplifier2: Simplifier<T>
  ) {
    const newSimplifier: Simplifier<T> = {};
    for (const i in simplifier1) newSimplifier[i] = simplifier1[i];
    for (const i in simplifier1) {
      let oldLeftElem = new Flag(0, this.symmetries.identity());
      let leftElem = simplifier1[i];
      let oldRightElem = new Flag(0, this.symmetries.identity());
      let rightElem = simplifier2[i];
      while (
        oldLeftElem.number != leftElem.number ||
        !this.symmetries.equal(oldLeftElem.element, leftElem.element)
      ) {
        oldLeftElem = leftElem;
        leftElem = newSimplifier[leftElem.toString()];
      }
      while (
        oldRightElem.number != rightElem.number ||
        !this.symmetries.equal(oldRightElem.element, rightElem.element)
      ) {
        oldRightElem = rightElem;
        rightElem = newSimplifier[rightElem.toString()];
      }
      const order = this.compareFlags(leftElem, rightElem);
      if (order === 0) continue;
      if (order === -1) newSimplifier[rightElem.toString()] = leftElem;
      if (order === 1) newSimplifier[leftElem.toString()] = rightElem;
    }
    const betterSimplifier: Simplifier<T> = {};
    for (const i in newSimplifier) {
      let oldElem = new Flag(0, this.symmetries.identity());
      let elem = newSimplifier[i];
      while (this.compareFlags(oldElem, elem)) {
        oldElem = elem;
        elem = newSimplifier[elem.toString()];
      }
      betterSimplifier[i] = elem;
    }
    return betterSimplifier;
  }

  //Count a simplifier's cosets. Not needed except for debugging.
  simplifierCosets(simplifier: Simplifier<T>): number {
    let count = 0;
    for (const i in simplifier) if (i === simplifier[i].toString()) count++;
    return count;
  }

  //This is basically the algorithm from the Grünbaumian thing,
  //but modified to work for higher dimensions and calculate incidences.
  toPolytopeC(): PolytopeC {
    const maxDomains = 500; //Change to Infinity if you dare
    const domains: [T, Matrix][] = this.symmetries.enumerateElements(
      maxDomains
    );

    //Maps each flag to itself. Used as a base for the later simplifiers.
    const identitySimplifier: Simplifier<T> = {};
    for (let i = 0; i < domains.length; i++) {
      for (let j = 0; j < this.flagClasses[0].length; j++) {
        identitySimplifier[j + "," + domains[i]] = new Flag(j, domains[i]);
      }
    }

    //Used in the simplifier operations to convert from stringified flags to
    //flags.
    this.identitySimplifier = identitySimplifier;

    //Maps each flag to a representative flag of its subwhatever
    //generated by the first n change vertex/face/etc operations.
    const ascendingSimplifiers = [identitySimplifier];
    console.log("Ascending simplifiers");
    for (let i = 0; i < this.dimensions; i++) {
      const lastSimplifier =
        ascendingSimplifiers[ascendingSimplifiers.length - 1];
      console.log(lastSimplifier, this.simplifierCosets(lastSimplifier));
      ascendingSimplifiers.push(this.extendSimplifier(lastSimplifier, i));
    }

    //Maps each flag to a representative flag of its subwhatever
    //generated by the first n change facet/ridge/etc operations.
    const descendingSimplifiers = [identitySimplifier];
    console.log("Descending simplifiers");
    for (let i = 0; i < this.dimensions; i++) {
      const lastSimplifier =
        descendingSimplifiers[descendingSimplifiers.length - 1];
      console.log(lastSimplifier, this.simplifierCosets(lastSimplifier));
      descendingSimplifiers.push(
        this.extendSimplifier(lastSimplifier, this.dimensions - (i + 1))
      );
    }

    //Maps each flag to a representative flag of the subwhatever
    //fixing that flag's vertex/edge/etc.
    const elementSimplifiers: Simplifier<T>[] = [];
    console.log("Element simplifiers");
    for (let i = 0; i < this.dimensions; i++) {
      const simplifier = this.mergeSimplifiers(
        ascendingSimplifiers[i],
        descendingSimplifiers[this.dimensions - (i + 1)]
      );
      console.log(simplifier, this.simplifierCosets(simplifier));
      elementSimplifiers.push(simplifier);
    }
    elementSimplifiers.push(ascendingSimplifiers[this.dimensions]);

    //Maps each flag to a representative flag of the subwhatever
    //fixing that flag's vertex-edge/edge-face/etc pair.
    const intersectionSimplifiers: Simplifier<T>[] = [];
    console.log("Intersection simplifiers");
    for (let i = 0; i < this.dimensions - 1; i++) {
      const simplifier = this.mergeSimplifiers(
        ascendingSimplifiers[i],
        descendingSimplifiers[this.dimensions - (i + 2)]
      );
      console.log(simplifier, this.simplifierCosets(simplifier));
      intersectionSimplifiers.push(simplifier);
    }
    intersectionSimplifiers.push(ascendingSimplifiers[this.dimensions - 1]);

    //Vertices are inherently different from other elements, so compute them
    //separately.
    const vertices: Point[] = [];
    for (let i = 0; i < domains.length; i++) {
      for (let j = 0; j < this.flagClasses[0].length; j++) {
        const flag = new Flag(j, domains[i]);
        //Skip flags that aren't vertex representatives
        if (this.compareFlags(flag, elementSimplifiers[0][flag.toString()])) {
          continue;
        }
        const vertex = flag.element[1].movePoint(this.vertices[flag.number]);
        vertices.push(vertex);
      }
    }
    console.log("Vertices");
    console.log(vertices);

    //Map representatives to IDs.
    const locations: { [key: string]: number }[] = [];
    const locationsLengths: number[] = [];
    for (let i = 0; i < this.dimensions + 1; i++) {
      const locationsRow: { [key: string]: number } = {};
      let nextID = 0;
      for (let j = 0; j < domains.length; j++) {
        for (let k = 0; k < this.flagClasses[0].length; k++) {
          const flag = new Flag(k, domains[j]);
          if (this.compareFlags(flag, elementSimplifiers[i][flag.toString()])) {
            continue;
          }
          locationsRow[flag.toString()] = nextID++;
        }
      }
      locations.push(locationsRow);
      locationsLengths.push(nextID);
    }
    console.log("Locations");
    console.log(locations, locationsLengths);
    console.log("Higher elements");

    const elems: ElementList = [vertices];
    for (let i = 1; i < this.dimensions + 1; i++) {
      //TODO rename this to something better
      const someElems: number[][] = [];
      for (let j = 0; j < locationsLengths[i]; j++) someElems.push([]);
      for (let j = 0; j < domains.length; j++) {
        for (let k = 0; k < this.flagClasses[0].length; k++) {
          const flag = new Flag(k, domains[j]);
          if (
            this.compareFlags(
              flag,
              intersectionSimplifiers[i - 1][flag.toString()]
            )
          ) {
            continue;
          }
          const leftFlag = elementSimplifiers[i - 1][flag.toString()];
          const rightFlag = elementSimplifiers[i][flag.toString()];
          const leftID = locations[i - 1][leftFlag.toString()];
          const rightID = locations[i][rightFlag.toString()];
          someElems[rightID].push(leftID);
        }
      }
      console.log(someElems);
      elems.push(someElems);
    }

    return new PolytopeC(elems);
  }
}
