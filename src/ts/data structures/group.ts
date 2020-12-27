import { Matrix } from "./matrix";

//A class for abstract groups.
export abstract class Group<T> {
  abstract generators: T[];
  abstract dimension: number;

  abstract identity(): T;
  abstract multiply(elem1: T, elem2: T): T;
  abstract invert(elem: T): T;
  abstract equal(elem1: T, elem2: T): boolean;
  abstract compare(elem1: T, elem2: T): number;

  //Probably not a good idea for anything with more than a few hundred elements.
  //AFAIK nothing better exists for MatrixGroup or many other representations,
  //but RewriteGroup has a much faster algorithm that I'll implement later.
  enumerateElements(max = 100): T[] {
    const elems: T[] = [];
    const elemsToCheck: T[] = [this.identity()];

    whileLoop: while (elemsToCheck.length && elems.length < max) {
      const elem: T = elemsToCheck.pop() as T;
      for (let j = 0; j < elems.length; j++)
        if (this.equal(elems[j], elem)) continue whileLoop;

      elems.push(elem);

      for (let i = 0; i < this.generators.length; i++) {
        const newElem = this.multiply(elem, this.generators[i]);
        elemsToCheck.push(newElem);
      }
    }

    return elems;
  }
}

//A class for groups defined using matrices.
export class MatrixGroup extends Group<Matrix> {
  generators: Matrix[];
  dimension: number;

  constructor(generators: Matrix[]) {
    super();
    this.generators = generators;
    this.dimension = generators[0].width();
  }

  identity(): Matrix {
    return Matrix.identity(this.dimension);
  }

  multiply(elem1: Matrix, elem2: Matrix): Matrix {
    return elem1.multiply(elem2);
  }

  invert(elem: Matrix): Matrix {
    return elem.inverse();
  }

  equal(elem1: Matrix, elem2: Matrix): boolean {
    return elem1.compare(elem2) === 0;
  }

  compare(elem1: Matrix, elem2: Matrix): number {
    return elem1.compare(elem2);
  }
}

//A class for groups defined using normalizing rewriting systems.
class RewriteGroup extends Group<string> {
  generators: string[];
  system: [string, string][];
  dimension: number;

  constructor(generators: string[], system: [string, string][]) {
    super();
    this.generators = generators;
    this.system = system;
    this.dimension = generators.length - 1; //This probably won't always work
  }

  simplifyElement(elem: string): string {
    let oldElem = "";
    while (elem !== oldElem) {
      oldElem = elem;
      for (let i = 0; i < this.system.length; i++)
        elem = elem.replace(this.system[i][0], this.system[i][1]);
    }
    return elem;
  }

  identity(): string {
    return "";
  }

  multiply(elem1: string, elem2: string) {
    return this.simplifyElement(elem1 + elem2);
  }

  invert(elem: string): string {
    let inverse = "";
    for (let i = 0; i < elem.length; i++) inverse = elem[i] + inverse;
    return inverse;
  }

  equal(elem1: string, elem2: string): boolean {
    return elem1 === elem2;
  }

  compare(elem1: string, elem2: string): number {
    if (elem1.length < elem2.length) return -1;
    if (elem1.length > elem2.length) return 1;
    if (elem1 < elem2) return -1;
    if (elem1 > elem2) return 1;
    return 0;
  }
}

//A class for groups with matrix representations in the appropriately-
//dimensioned space.
//Including the abstract representation as a property probably isn't the right
//way to do this, but I can't think of anything better so I'm doing it this way.
//--CIF
export class ConcreteGroup<T> extends Group<[T, Matrix]> {
  generators: [T, Matrix][];
  dimension: number;
  abstractGroup: Group<T>;

  constructor(generators: Matrix[], abstractGroup: Group<T>) {
    super();
    this.generators = [];
    for (let i = 0; i < generators.length; i++)
      this.generators.push([abstractGroup.generators[i], generators[i]]);
    this.abstractGroup = abstractGroup;
    this.dimension = generators[0].width();
  }

  identity(): [T, Matrix] {
    return [this.abstractGroup.identity(), Matrix.identity(this.dimension)];
  }

  multiply(elem1: [T, Matrix], elem2: [T, Matrix]): [T, Matrix] {
    return [
      this.abstractGroup.multiply(elem1[0], elem2[0]),
      elem1[1].multiply(elem2[1]),
    ];
  }

  invert(elem: [T, Matrix]): [T, Matrix] {
    return [this.abstractGroup.invert(elem[0]), elem[1].inverse()];
  }

  //The representation may behave completely differently from the abstract group
  //so it isn't worth trusting
  equal(elem1: [T, Matrix], elem2: [T, Matrix]): boolean {
    return this.abstractGroup.equal(elem1[0], elem2[0]);
  }

  compare(elem1: [T, Matrix], elem2: [T, Matrix]): number {
    return this.abstractGroup.compare(elem1[0], elem2[0]);
  }

  static BC(n: number): ConcreteGroup<string> {
    const symmetryGens: Matrix[] = [];
    //TODO: Find a better way to make these matrices
    const fourNode = Matrix.identity(n);
    fourNode.els[0][0] = -1;
    symmetryGens.push(fourNode);
    for (let i = 0; i < n - 1; i++) {
      const flipNode = Matrix.identity(n);
      flipNode.els[i][i] = 0;
      flipNode.els[i + 1][i] = 1;
      flipNode.els[i][i + 1] = 1;
      flipNode.els[i + 1][i + 1] = 0;
      symmetryGens.push(flipNode);
    }
    //Using a RewriteGroup here might be better but generating those is slightly
    //unpleasant.
    //abstractSymmetries = new MatrixGroup(symmetryGens);
    //3D and 4D RewriteGroups for for debugging toPolytopeS.
    //abstractSymmetries = new RewriteGroup("012",[["00",""],["11",""],["22",""],["1010","0101"],["20","02"],["212","121"],["2102","1210"],["210121","121012"]])
    const abstractSymmetries = new RewriteGroup(
      [..."0123"],
      [
        ["00", ""],
        ["11", ""],
        ["22", ""],
        ["33", ""],
        ["1010", "0101"],
        ["20", "02"],
        ["30", "03"],
        ["212", "121"],
        ["31", "13"],
        ["323", "232"],
        ["2102", "1210"],
        ["3213", "2321"],
        ["32103", "23210"],
        ["210121", "121012"],
        ["321013", "232101"],
        ["32101232", "23210123"],
      ]
    );
    console.warn("Dimensional special case enabled.");
    return new ConcreteGroup(symmetryGens, abstractSymmetries);
  }
}
