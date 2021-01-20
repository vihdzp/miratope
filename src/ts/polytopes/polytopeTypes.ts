import ConstructionNode, {
  Name as CNName,
  Plain as CNPlain,
} from "../data structures/constructionNode";
import type GraphNode from "../data structures/graphNode";
import LinkedListNode from "../data structures/linkedListNode";
import Point from "../geometry/point";
import type { ConcreteGroup } from "../data structures/group";
import Flag, { FlagClass, FlagMap } from "../data structures/flag";
import type Scene from "../rendering/scene";

export type ElementList = [Point[], ...number[][][]] | [];

/** Stores the type of any given [[`PolytopeB`]]. */
export enum PolytopeType {
  /** The object is a [[`PolytopeC`]]. */
  C,

  /** The object is a [[`PolytopeS`]]. */
  S,
}

export interface OFFOptions {
  comments?: boolean;
}

/**
 * The base class for polytopes.
 *
 * @category Polytope Type
 */
export abstract class PolytopeB {
  /** Represents how a Polytope is built up. */
  abstract construction: ConstructionNode<unknown>;
  /** The rank of the polytope. */
  abstract dimensions: number;
  /** The number of dimensions of the space the polytope lives in. */
  abstract spaceDimensions: number;
  /** The type of polytope. */
  abstract readonly type: PolytopeType;
  abstract toPolytopeC(): PolytopeC;
  abstract scale(r: number): PolytopeB;
  abstract move(P: Point, mult: number): PolytopeB;

  abstract circumradius(): number;
  abstract gravicenter(): Point;

  /**
   * Gets the polytope's name from its [[`ConstructionNode`]].
   *
   * @returns The polytope's name.
   */
  getName(): string {
    return this.construction.getName();
  }

  /**
   * Saves the current polytope as an OFF file.
   *
   * @param options The file saving options.
   * @todo Deal with the nullitope case.
   */
  saveAsOFF(_options: OFFOptions = {}): void {
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

/**
 * Stores a polytope in its "combinatorial" representation: as an array of
 * elements sorted by rank. The first entry is the array of
 * [[Point | `Points`]], subsequent entries store the elements as the sets of
 * the indices their facets are stored in. This representation mirrors closely
 * the OFF file format.
 *
 * @category Polytope Type
 */
export class PolytopeC extends PolytopeB {
  construction: ConstructionNode<unknown>;
  dimensions: number;
  spaceDimensions: number;
  readonly type: PolytopeType = PolytopeType.C;
  elementList: ElementList;

  /**
   * The constructor for the PolytopeC class.
   *
   * @param elementList The polytope's element list.
   * @param construction The constructionNode representing how the polytope
   * was built.
   */
  constructor(
    elementList: ElementList,
    construction?: ConstructionNode<unknown>
  ) {
    super();
    if (!construction)
      //The construction defaults to just the polytope itself.
      construction = new CNPlain([
        elementList[elementList.length - 2].length,
        elementList.length - 1,
      ]);

    this.construction = construction;
    this.dimensions = elementList.length - 1; //The rank of the polytope.
    this.elementList = elementList;

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
   * @param r The scaling factor.
   * @returns The scaled polytope.
   */
  scale(r: number): PolytopeC {
    if (!this.elementList[0]) return this;
    for (let i = 0; i < this.elementList[0].length; i++)
      this.elementList[0][i].scale(r);
    return this;
  }

  /**
   * Calculates the centroid of a polytope.
   * @returns The centroid of the polytope.
   */
  gravicenter(): Point {
    const vertices = this.elementList[0];
    if (!vertices) return new Point(0);

    const d = this.spaceDimensions,
      res: number[] = [];

    for (let i = 0; i < d; i++) res.push(0);

    for (let i = 0; i < vertices.length; i++)
      for (let j = 0; j < d; j++) res[j] += vertices[i].coordinates[j];

    for (let i = 0; i < d; i++) res[i] /= vertices.length;

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
   * @param dim The new number of coordinates for each vertex.
   */
  setSpaceDimensions(dim: number): void {
    const vertices = this.elementList[0];
    if (!vertices) return;

    for (let i = 0; i < vertices.length; i++) {
      let coords = vertices[i].coordinates;

      if (coords.length > dim) coords = coords.slice(0, dim);
      else if (coords.length < dim)
        for (let j = 0; j < dim - coords.length; j++) coords.push(0);
    }

    this.spaceDimensions = dim;
  }

  /**
   * Converts the edge representation of the i-th face to an ordered array of
   * vertices.
   *
   * @param i The selected face's index.
   * @returns An array with the indices of the vertices of the i-th
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
   * @returns The recentered polytope.
   */
  recenter(): PolytopeC {
    return this.move(this.gravicenter(), -1);
  }

  /**
   * Ensures that we can always correctly call toPolytopeC on a polytope.
   * @returns The polytope, unchanged.
   */
  toPolytopeC(): PolytopeC {
    return this;
  }
}

/**
 * Represents a polytope in a way that takes advantage of symmetry. Obviously,
 * this requires a representation of the symmetry group. The other components
 * are a description of how the flags (tuples of vertex/edge/face...) within a
 * single domain connect to each other under "change vertex/edge/..."
 * operations, matrices describing how the symmetry group affects the physical
 * representation of the polytope, and positions of each class of vertices.
 * In this implementation the symmetry group and its physical effects are
 * bundled.
 *
 * @category Polytope Type
 */
export class PolytopeS<T> extends PolytopeB {
  /** The symmetry group of the polytope. */
  symmetries: ConcreteGroup<T>;
  /** Stores the interactions between flag classes. */
  flagClasses: FlagClass[];
  /** Stores a set of vertices that generates the entire polytope. */
  vertices: Point[];
  dimensions: number;
  spaceDimensions: number;
  construction: ConstructionNode<unknown>;
  readonly type: PolytopeType;
  private identitySimplifier: FlagMap<T, Flag<T>>;

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
    this.identitySimplifier = new FlagMap();
    this.spaceDimensions = vertices[0].dimensions();
    this.type = PolytopeType.S;

    this.construction = new CNName("temp");
  }

  /**
   * The gravicenter is the gravicenter of the original vertices, weighted by
   * the inverse of the number of domains each vertex appears in, projected onto
   * the intersection of the eigenspaces of the generators with eigenvalues 1.
   */
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

  /**
   * Apply an element-change operation to a flag.
   *
   * @param flag The flag to apply the operation.
   * @param generator The index of the element that is changed.
   */
  moveFlag(flag: Flag<T>, generator: number): Flag<T> {
    const classNumber = flag.classNumber,
      domain = flag.domain,
      elementChange = this.flagClasses[classNumber].elementChanges[generator];

    const newClassNumber = elementChange.newClassNumber,
      newDomain = elementChange.apply(this.symmetries, domain);

    return new Flag(newClassNumber, newDomain);
  }

  compareFlags(flag1: Flag<T>, flag2: Flag<T>): -1 | 0 | 1 {
    if (flag1.classNumber < flag2.classNumber) return -1;
    if (flag1.classNumber > flag2.classNumber) return 1;
    return this.symmetries.compare(flag1.domain, flag2.domain);
  }

  equalFlags(flag1: Flag<T>, flag2: Flag<T>): boolean {
    return this.compareFlags(flag1, flag2) == 0;
  }

  //Utility function for toPolytopeC.
  //Modifies a simplifier to use another generator.
  //Almost identical to the merge function but I don't really care rn.
  private extendSimplifier(
    simplifier1: FlagMap<T, Flag<T>>,
    simplifier2: number
  ): FlagMap<T, Flag<T>> {
    return this.modifySimplifier(simplifier1, simplifier2);
  }

  private mergeSimplifiers(
    simplifier1: FlagMap<T, Flag<T>>,
    simplifier2: FlagMap<T, Flag<T>>
  ): FlagMap<T, Flag<T>> {
    return this.modifySimplifier(simplifier1, simplifier2);
  }

  private modifySimplifier(
    simplifier1: FlagMap<T, Flag<T>>,
    simplifier2: FlagMap<T, Flag<T>> | number
  ): FlagMap<T, Flag<T>> {
    const newSimplifier = simplifier1.clone();

    for (const key in simplifier1.dictionary) {
      let oldLeftElem = new Flag(0, this.symmetries.identity()),
        oldRightElem: Flag<T>,
        leftElem: Flag<T>,
        rightElem: Flag<T>;

      //extend
      if (typeof simplifier2 == "number") {
        const generator = simplifier2;

        oldRightElem = this.moveFlag(oldLeftElem, generator);
        leftElem = this.identitySimplifier.get(key);
        rightElem = this.moveFlag(leftElem, generator);
      }

      //merge
      else {
        oldRightElem = new Flag(0, this.symmetries.identity());
        leftElem = simplifier1.get(key);
        rightElem = simplifier2.get(key);
      }

      while (!this.equalFlags(oldLeftElem, leftElem)) {
        oldLeftElem = leftElem;
        leftElem = newSimplifier.get(leftElem);
        //console.log("upd left", ""+oldLeftElem, ""+leftElem);
      }

      while (!this.equalFlags(oldRightElem, rightElem)) {
        oldRightElem = rightElem;
        rightElem = newSimplifier.get(rightElem);
        //console.log("upd right", ""+oldRightElem, ""+rightElem);
      }

      const order = this.compareFlags(leftElem, rightElem);

      //console.log("order", ""+leftElem, ""+rightElem, order);
      if (order === 1) newSimplifier.set(leftElem, rightElem);
      else if (order === -1) newSimplifier.set(rightElem, leftElem);
    }

    const betterSimplifier = new FlagMap<T, Flag<T>>();
    for (const key in newSimplifier.dictionary) {
      let oldElem = new Flag(0, this.symmetries.identity()),
        elem = newSimplifier.get(key);

      while (!this.equalFlags(oldElem, elem)) {
        oldElem = elem;
        elem = newSimplifier.get(elem);
      }

      betterSimplifier.set(key, elem);
    }

    return betterSimplifier;
  }

  /**
   * Counts a simplifier's cosets. Not needed except for debugging.
   *
   * @param simplifier The simplifier to perform the count.
   * @return The number of cosets of the simplifier.
   */
  simplifierCosets(simplifier: FlagMap<T, Flag<T>>): number {
    let count = 0;

    for (const key in simplifier.dictionary)
      if (key == simplifier.get(key).toString()) count++;

    return count;
  }

  //This is basically the algorithm from the Grünbaumian thing,
  //but modified to work for higher dimensions and calculate incidences.
  toPolytopeC(): PolytopeC {
    const maxDomains = 500; //Change to Infinity if you dare
    const domains = this.symmetries.enumerateElements(maxDomains);

    //Maps each flag to itself. Used as a base for the later simplifiers.
    this.identitySimplifier = new FlagMap<T, Flag<T>>();
    for (let i = 0; i < domains.length; i++)
      for (let j = 0; j < this.flagClasses.length; j++) {
        const flag = new Flag(j, domains[i]);
        this.identitySimplifier.set(flag, flag);
      }

    //Maps each flag to a representative flag of its subwhatever
    //generated by the first n change vertex/face/etc operations.
    const ascendingSimplifiers = [this.identitySimplifier];
    let lastSimplifier = this.identitySimplifier;

    console.log("Ascending simplifiers");

    for (let i = 0; i < this.dimensions; i++) {
      console.log(lastSimplifier, this.simplifierCosets(lastSimplifier));
      lastSimplifier = this.extendSimplifier(lastSimplifier, i);

      ascendingSimplifiers.push(lastSimplifier);
    }

    //Maps each flag to a representative flag of its subwhatever
    //generated by the first n change facet/ridge/etc operations.
    const descendingSimplifiers = [this.identitySimplifier];
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
    const elementSimplifiers: FlagMap<T, Flag<T>>[] = [];
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
    const intersectionSimplifiers: FlagMap<T, Flag<T>>[] = [];
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
    console.log("Vertices");
    const vertices: Point[] = [];
    for (let i = 0; i < domains.length; i++) {
      for (let j = 0; j < this.flagClasses.length; j++) {
        const flag = new Flag(j, domains[i]);

        //Skip flags that aren't vertex representatives
        if (!this.equalFlags(flag, elementSimplifiers[0].get(flag))) continue;

        const vertex = this.vertices[j].applyMatrix(flag.domain.matrix);
        vertices.push(vertex);
      }
    }
    console.log(vertices);

    //Map representatives to IDs.
    const locations: FlagMap<T, number>[] = [];
    const locationsLengths: number[] = [];

    for (let i = 0; i < this.dimensions + 1; i++) {
      const locationsRow = new FlagMap<T, number>();
      let nextID = 0;

      for (let j = 0; j < domains.length; j++) {
        for (let k = 0; k < this.flagClasses.length; k++) {
          const flag = new Flag(k, domains[j]);
          if (!this.equalFlags(flag, elementSimplifiers[i].get(flag))) continue;

          locationsRow.set(flag, nextID++);
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
        for (let k = 0; k < this.flagClasses.length; k++) {
          const flag = new Flag(k, domains[j]);
          if (!this.equalFlags(flag, intersectionSimplifiers[i - 1].get(flag)))
            continue;

          const leftFlag = elementSimplifiers[i - 1].get(flag);
          const rightFlag = elementSimplifiers[i].get(flag);
          const leftID = locations[i - 1].get(leftFlag);
          const rightID = locations[i].get(rightFlag);

          someElems[rightID].push(leftID);
        }
      }

      console.log(someElems);
      elems.push(someElems);
    }

    return new PolytopeC(elems);
  }
}
