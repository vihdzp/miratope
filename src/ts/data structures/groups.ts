import * as MathJS from "mathjs";

/**
 * A class for abstract groups.
 *
 * @typeParam T The type of the elements of the group.
 */
export default abstract class Group<T> {
  /** The generators of the group. */
  abstract generators: T[];

  /** The "dimension" of the group, whatever that means for a given group. */
  abstract dimension: number;

  /**
   * Returns the group identity.
   *
   * @returns An instance of the group identity.
   */
  abstract identity(): T;

  /**
   * Multiplies two group elements together.
   *
   * @param elem1 The left element to multiply.
   * @param elem2 The right element to multiply.
   * @returns The multiplication of both elements.
   */
  abstract multiply(elem1: T, elem2: T): T;

  /**
   * Inverts a group element.
   *
   * @param elem The element to invert.
   * @returns The group inverse of the element.
   */
  abstract invert(elem: T): T;

  /**
   * Determines whether two group elements are equal.
   *
   * @param elem1 The first group element.
   * @param elem2 The second group element.
   * @returns Whether the two group elements are equal.
   */
  abstract equal(elem1: T, elem2: T): boolean;

  /**
   * Compares two elements in a group. Returns -1 if the first is lesser, 1 if
   * the second is lesser, 0 if both are equal. Comparison must be a total order
   * relation (?).
   *
   * @param elem1 The first element to compare.
   * @param elem2 The second element to compare.
   * @returns Whehther one of the elements is greater, or if both are equal.
   */
  abstract compare(elem1: T, elem2: T): -1 | 0 | 1;

  /**
   * Enumerates all of the elements of the group. The base implementation is
   * probably not a good idea for anything with more than a few hundred
   * elements. However, the [[`RewriteGroup`]] has a much faster algorithm.
   *
   * @returns An array of all of the group elements.
   */
  enumerateElements(): T[] {
    const elems: T[] = [];
    const elemsToCheck: T[] = [this.identity()];

    whileLoop: while (elemsToCheck.length != 0) {
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

  /**
   * Constructor for the `MatrixGroup` class.
   *
   * @param generators The array of matrices used to generate the group.
   */
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
 * Defines a rule in a [[`RewriteGroup`]].
 */
export class RewriteRule {
  searchValue: number[];
  replaceValue: number[];

  constructor(searchValue: number[], replaceValue: number[]) {
    this.searchValue = searchValue;
    this.replaceValue = replaceValue;
  }
}

/**
 * A class for groups defined using
 * (normalizing rewriting systems)[https://en.wikipedia.org/wiki/Rewriting].
 */
export class RewriteGroup extends Group<number[]> {
  generators: number[][];
  system: RewriteRule[];
  dimension: number;

  constructor(generatorCount: number, system: RewriteRule[]) {
    super();
    this.generators = RewriteGroup.buildGenerators(generatorCount);
    this.system = system;
    this.dimension = generatorCount; //This probably won't always work
  }

  private static buildGenerators(n: number): number[][] {
    const generators: number[][] = [];

    for (let i = 0; i < n; i++) generators.push([i]);

    return generators;
  }

  simplifyElement(elem: number[]): number[] {
    let oldElem: number[] = [];

    while (!this.equal(elem, oldElem)) {
      oldElem = [...elem];
      for (let i = 0; i < this.system.length; i++) elem = this.replace(elem, i);
    }

    return elem;
  }

  /**
   * Applies a certain [[`RewriteRule`]] once on a given number array.
   *
   * @param elem The element to rewrite.
   * @param index The index of the rewrite rule that will be applied.
   */
  replace(elem: number[], index: number): number[] {
    let res: number[] = [...elem];

    const rule = this.system[index],
      searchValue = rule.searchValue,
      replaceValue = rule.replaceValue;

    //Searches for the searchValue starting at every index.
    FORLOOP: for (let i = 0; i <= res.length - searchValue.length; i++) {
      //Looks for the searchValue at index i.
      for (let j = 0; j < searchValue.length; j++)
        if (res[i + j] != rule.searchValue[j]) continue FORLOOP;

      //If the code reaches here, it has found the searchValue.

      //Moves the array from the match onwards to fit the replacement.
      res = RewriteGroup.slide(
        res,
        i + searchValue.length,
        replaceValue.length - searchValue.length
      );

      //Replaces one subarray by the other.
      for (let j = 0; j < replaceValue.length; j++)
        res[i + j] = replaceValue[j];

      break;
    }

    return res;
  }

  /**
   * Slides all entries of an array, starting from a given position, by a
   * certain number of positions.
   *
   * @param elem The array to slide.
   * @param index The starting index for the slide.
   * @param slide The number of positions to slide the elements.
   * @returns The array, resized and slided. This can either be the original
   * array modified, or a new array.
   */
  private static slide(elem: number[], index: number, slide: number): number[] {
    if (slide > 0)
      for (let i = elem.length - 1; i >= index; i--) elem[i + slide] = elem[i];
    else if (slide < 0) {
      for (let i = index; i < elem.length; i++) elem[i + slide] = elem[i];

      elem = elem.slice(0, elem.length + slide);
    }

    return elem;
  }

  identity(): number[] {
    return [];
  }

  multiply(elem1: number[], elem2: number[]): number[] {
    return this.simplifyElement(elem1.concat(elem2));
  }

  /**
   * Inverts a group element. Assumes that every one of the generators is of
   * order 2.
   *
   * @param elem The element to invert.
   * @returns The group inverse of the element.
   */
  invert(elem: number[]): number[] {
    return elem.reverse();
  }

  equal(elem1: number[], elem2: number[]): boolean {
    return this.compare(elem1, elem2) === 0;
  }

  compare(elem1: number[], elem2: number[]): -1 | 0 | 1 {
    if (elem1.length == elem2.length) {
      if (elem1 < elem2) return -1;
      if (elem1 > elem2) return 1;
      return 0;
    }

    if (elem1.length < elem2.length) return -1;
    return 1;
  }
}

/**
 * An element of a [[`ConcreteGroup`]]. Contains both a [[`groupElement`]] and a
 * matrix.
 *
 * @typeParam T The type of the [[`groupElement`]].
 */
export class ConcreteGroupElement<T> {
  groupElement: T;
  matrix: MathJS.Matrix;

  constructor(groupElement: T, matrix: MathJS.Matrix) {
    this.groupElement = groupElement;
    this.matrix = matrix;
  }
}

/**
 * A class for groups with a matrix representation and an underlying "concrete"
 * abstract group. In practice, the concrete group used is always a
 * [[`RewriteGroup`]]. This way, we can both mitigate the floating point errors
 * and the comparatively slow algorithms for pure matrix groups.
 */
export class ConcreteGroup<T> extends Group<ConcreteGroupElement<T>> {
  generators: ConcreteGroupElement<T>[];
  dimension: number;
  abstractGroup: Group<T>;

  /**
   * Constructor for the ConcreteGroup class.
   *
   * @param generators An array of matrices that generate the symmetry group.
   * @param abstractGroup An underlying concrete group.
   */
  constructor(generators: MathJS.Matrix[], abstractGroup: Group<T>) {
    super();
    this.generators = [];

    for (let i = 0; i < generators.length; i++)
      this.generators.push(
        new ConcreteGroupElement<T>(abstractGroup.generators[i], generators[i])
      );

    this.abstractGroup = abstractGroup;
    this.dimension = generators[0].size()[0];
  }

  identity(): ConcreteGroupElement<T> {
    return new ConcreteGroupElement<T>(
      this.abstractGroup.identity(),
      MathJS.identity(this.dimension) as MathJS.Matrix
    );
  }

  multiply(
    elem1: ConcreteGroupElement<T>,
    elem2: ConcreteGroupElement<T>
  ): ConcreteGroupElement<T> {
    return new ConcreteGroupElement<T>(
      this.abstractGroup.multiply(elem1.groupElement, elem2.groupElement),
      MathJS.multiply(elem1.matrix, elem2.matrix)
    );
  }

  invert(elem: ConcreteGroupElement<T>): ConcreteGroupElement<T> {
    return new ConcreteGroupElement<T>(
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

  /**
   * Generates the BC(n) symmetry group, which is the symmetry group of an
   * [[https://polytope.miraheze.org/wiki/Hypercube|n-hypercube]].
   *
   * @param n The number of dimensions of the symmetry group.
   * @todo Currently, this is hardcoded to work only up to n = 4! We ought to
   * fix that.
   * @returns The BC(n) symmetry group.
   * @example
   * // BC(4) is generated by the following matrices:
   * // |-1  0  0  0|  | 0  1  0  0|  | 1  0  0  0|  | 1  0  0  0|
   * // | 0  1  0  0|  | 1  0  0  0|  | 0  0  1  0|  | 0  1  0  0|
   * // | 0  0  1  0|  | 0  0  1  0|  | 0  1  0  0|  | 0  0  0  1|
   * // | 0  0  0  1|  | 0  0  0  1|  | 0  0  0  1|  | 0  0  1  0|
   *
   * console.log(ConcreteGroup.BC(4));
   */
  static BC(n: number): ConcreteGroup<number[]> {
    //The matrix generators for the group.
    const symmetryGens: MathJS.Matrix[] = [];

    //The matrix whose mirror corresponds to the 4-node in the Coxeter Diagram.
    const fourNode = MathJS.identity(n) as MathJS.Matrix;
    fourNode.set([0, 0], -1);
    symmetryGens.push(fourNode);

    //The matrices whose mirrors correspond to a 3-node in the Coxeter Diagram.
    for (let i = 0; i < n - 1; i++) {
      const threeNode = MathJS.identity(n) as MathJS.Matrix;
      threeNode.swapRows(i, i + 1);
      symmetryGens.push(threeNode);
    }

    //Using a RewriteGroup here might be better but generating those is slightly
    //unpleasant.
    //3D and 4D RewriteGroups for debugging toPolytopeS.
    const abstractSymmetries = new RewriteGroup(4, [
      new RewriteRule([0, 0], []),
      new RewriteRule([1, 1], []),
      new RewriteRule([2, 2], []),
      new RewriteRule([3, 3], []),
      new RewriteRule([1, 0, 1, 0], [0, 1, 0, 1]),
      new RewriteRule([2, 0], [0, 2]),
      new RewriteRule([3, 0], [0, 3]),
      new RewriteRule([3, 1], [1, 3]),
      new RewriteRule([2, 1, 2], [1, 2, 1]),
      new RewriteRule([3, 2, 3], [2, 3, 2]),
      new RewriteRule([2, 1, 0, 2], [1, 2, 1, 0]),
      new RewriteRule([3, 2, 1, 3], [2, 3, 2, 1]),
      new RewriteRule([3, 2, 1, 0, 3], [2, 3, 2, 1, 0]),
      new RewriteRule([2, 1, 0, 1, 2, 1], [1, 2, 1, 0, 1, 2]),
      new RewriteRule([3, 2, 1, 0, 1, 3], [2, 3, 2, 1, 0, 1]),
      new RewriteRule([3, 2, 1, 0, 1, 2, 3, 2], [2, 3, 2, 1, 0, 1, 2, 3]),
    ]);

    console.warn("Dimensional special case enabled.");
    return new ConcreteGroup(symmetryGens, abstractSymmetries);
  }

  /**
   * Generates the A(n) symmetry group, which is the symmetry group of an
   * [[https://polytope.miraheze.org/wiki/Simplex|n-simplex]].
   *
   * @param n The number of dimensions of the symmetry group.
   * @returns The A(n) symmetry group.
   * @example
   * // A(4) is generated by the following matrices:
   * // | 0  0  0  1|  | 0  1  0  0|  | 1  0  0  0|  | 1  0  0  0|
   * // | 0  1  0  0|  | 1  0  0  0|  | 0  0  1  0|  | 0  1  0  0|
   * // | 0  0  1  0|  | 0  0  1  0|  | 0  1  0  0|  | 0  0  0  1|
   * // | 1  0  0  0|  | 0  0  0  1|  | 0  0  0  1|  | 0  0  1  0|
   *
   * console.log(ConcreteGroup.A(4));
   */
  static A(n: number): ConcreteGroup<number[]> {
    //The matrix generators for the group.
    const symmetryGens: MathJS.Matrix[] = [];

    //The first of the 3-nodes in the Coxeter Diagram.
    const threeNode = MathJS.identity(n) as MathJS.Matrix;
    threeNode.swapRows(0, n - 1);
    symmetryGens.push(threeNode);

    //The other 3-nodes in the Coxeter Diagram.
    for (let i = 0; i < n - 1; i++) {
      const threeNode = MathJS.identity(n) as MathJS.Matrix;
      threeNode.swapRows(i, i + 1);
      symmetryGens.push(threeNode);
    }

    const system: RewriteRule[] = [];

    //Every reflection has order 2.
    for (let i = 0; i < n; i++) system.push(new RewriteRule([i, i], []));

    //Every two mirrors commute.
    for (let i = 1; i < n; i++)
      for (let j = 0; j < i; j++) system.push(new RewriteRule([i, j], [j, i]));

    //The remaining rewrite patterns are of the form
    //[i, ..., j, i – 1] → [i – 1, i, ..., j].
    for (let i = 1; i < n; i++)
      for (let j = 0; j < i; j++) {
        const searchValue: number[] = [],
          replaceValue = [i - 1];

        for (let k = 0; k < j - 1; k++) {
          searchValue.push(i - k);
          replaceValue.push(i - k);
        }
        searchValue.push(i);

        system.push(new RewriteRule(searchValue, replaceValue));
      }

    const abstractSymmetries = new RewriteGroup(n, system);
    return new ConcreteGroup(symmetryGens, abstractSymmetries);
  }
}
