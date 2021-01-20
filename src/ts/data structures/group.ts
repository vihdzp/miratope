import * as MathJS from "mathjs";

/**
 * A class for abstract groups.
 */
export default abstract class Group<T> {
  abstract generators: T[];
  abstract dimension: number;

  abstract identity(): T;
  abstract multiply(elem1: T, elem2: T): T;
  abstract invert(elem: T): T;
  abstract equal(elem1: T, elem2: T): boolean;
  abstract compare(elem1: T, elem2: T): -1 | 0 | 1;

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

/**
 * A class for groups defined using matrices.
 */
export class MatrixGroup extends Group<MathJS.Matrix> {
  generators: MathJS.Matrix[];
  dimension: number;

  constructor(generators: MathJS.Matrix[]) {
    super();
    this.generators = generators;
    this.dimension = generators[0].size()[0];
  }

  identity(): MathJS.Matrix {
    return MathJS.identity(this.dimension) as MathJS.Matrix;
  }

  multiply(elem1: MathJS.Matrix, elem2: MathJS.Matrix): MathJS.Matrix {
    return MathJS.multiply(elem1, elem2);
  }

  invert(elem: MathJS.Matrix): MathJS.Matrix {
    return MathJS.inv(elem);
  }

  equal(elem1: MathJS.Matrix, elem2: MathJS.Matrix): boolean {
    return this.compare(elem1, elem2) == 0;
  }

  compare(elem1: MathJS.Matrix, elem2: MathJS.Matrix): -1 | 0 | 1 {
    for (let i = 0; i < this.dimension; i++)
      for (let j = 0; j < this.dimension; j++) {
        const diff = elem1.get([i, j]) - elem2.get([i, j]);

        if (diff > 0) return 1;
        if (diff < 0) return -1;
      }

    return 0;
  }
}

/**
 * A class for groups defined using
 * (normalizing rewriting systems)[https://en.wikipedia.org/wiki/Rewriting].
 */
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

  compare(elem1: string, elem2: string): -1 | 0 | 1 {
    if (elem1.length == elem2.length) {
      if (elem1 < elem2) return -1;
      if (elem1 > elem2) return 1;
      return 0;
    }

    if (elem1.length < elem2.length) return -1;
    if (elem1.length > elem2.length) return 1;
    return 0;
  }
}

/**
 * An element of a concrete group.
 * Constains both a matrix element, used for concrete geometric calculations,
 * and a group element to avoid floating point weirdness.
 */
export class ConcreteGroupElement<T> {
  groupElement: T;
  matrix: MathJS.Matrix;
  concreteGroup: ConcreteGroup<T>;

  constructor(
    concreteGroup: ConcreteGroup<T>,
    groupElement: T,
    matrix: MathJS.Matrix
  ) {
    this.groupElement = groupElement;
    this.matrix = matrix;
    this.concreteGroup = concreteGroup;
  }
}

/**
 * A class for groups with matrix representations in the appropriately-
 * dimensioned space.
 * Including the abstract representation as a property probably isn't the right
 * way to do this, but I can't think of anything better so I'm doing it this
 * way.
 * --CIF
 */
export class ConcreteGroup<T> extends Group<ConcreteGroupElement<T>> {
  generators: ConcreteGroupElement<T>[];
  dimension: number;
  abstractGroup: Group<T>;

  constructor(generators: MathJS.Matrix[], abstractGroup: Group<T>) {
    super();
    this.generators = [];

    for (let i = 0; i < generators.length; i++)
      this.generators.push(
        new ConcreteGroupElement<T>(
          this,
          abstractGroup.generators[i],
          generators[i]
        )
      );

    this.abstractGroup = abstractGroup;
    this.dimension = generators[0].size()[0];
  }

  identity(): ConcreteGroupElement<T> {
    return new ConcreteGroupElement<T>(
      this,
      this.abstractGroup.identity(),
      MathJS.identity(this.dimension) as MathJS.Matrix
    );
  }

  multiply(
    elem1: ConcreteGroupElement<T>,
    elem2: ConcreteGroupElement<T>
  ): ConcreteGroupElement<T> {
    return new ConcreteGroupElement<T>(
      this,
      this.abstractGroup.multiply(elem1.groupElement, elem2.groupElement),
      MathJS.multiply(elem1.matrix, elem2.matrix)
    );
  }

  invert(elem: ConcreteGroupElement<T>): ConcreteGroupElement<T> {
    return new ConcreteGroupElement<T>(
      this,
      this.abstractGroup.invert(elem.groupElement),
      MathJS.inv(elem.matrix)
    );
  }

  //The representation may behave completely differently from the abstract group
  //so it isn't worth trusting
  equal(
    elem1: ConcreteGroupElement<T>,
    elem2: ConcreteGroupElement<T>
  ): boolean {
    return this.abstractGroup.equal(elem1.groupElement, elem2.groupElement);
  }

  compare(
    elem1: ConcreteGroupElement<T>,
    elem2: ConcreteGroupElement<T>
  ): -1 | 0 | 1 {
    return this.abstractGroup.compare(elem1.groupElement, elem2.groupElement);
  }

  static BC(n: number): ConcreteGroup<string> {
    const symmetryGens: MathJS.Matrix[] = [];

    //TODO: Find a better way to make these matrices
    const fourNode = MathJS.identity(n) as MathJS.Matrix;
    fourNode.set([0, 0], -1);
    symmetryGens.push(fourNode);

    for (let i = 0; i < n - 1; i++) {
      const flipNode = MathJS.identity(n) as MathJS.Matrix;
      flipNode.set([i, i], 0);
      flipNode.set([i + 1, i], 1);
      flipNode.set([i, i + 1], 1);
      flipNode.set([i + 1, i + 1], 0);

      symmetryGens.push(flipNode);
    }

    //Using a RewriteGroup here might be better but generating those is slightly
    //unpleasant.
    //3D and 4D RewriteGroups for debugging toPolytopeS.
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
