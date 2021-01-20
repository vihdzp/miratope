import type { ConcreteGroup, ConcreteGroupElement } from "./group";

/**
 * Represents a (flag)[https://en.wikipedia.org/wiki/Flag_(geometry)] in a
 * PolytopeS object.
 */
export default class Flag<T> {
  /** The index of the flag in the corresponding flagClasses array. */
  classNumber: number;
  /** The symmetry domain of the given flag. */
  domain: ConcreteGroupElement<T>;

  constructor(classNumber: number, domain: ConcreteGroupElement<T>) {
    this.classNumber = classNumber;
    this.domain = domain;
  }

  toString(): string {
    return (
      this.classNumber +
      "," +
      this.domain.groupElement +
      "," +
      this.domain.matrix
    );
  }
}

/**
 * Specified how a flag class is affected when an element-change operation is
 * applied to the flag.
 */
export class ElementChange {
  /** The index of the flag class the flag changes into. */
  newClassNumber: number;
  /** The sequence of the indices of the symmetry generators that send one
   * flag's domain to the other. */
  generators: number[];

  constructor(newClassNumber: number, generators: number[]) {
    this.newClassNumber = newClassNumber;
    this.generators = generators;
  }

  apply<T>(
    concreteGroup: ConcreteGroup<T>,
    domain: ConcreteGroupElement<T>
  ): ConcreteGroupElement<T> {
    let newDomain = domain;

    for (let i = 0; i < this.generators.length; i++)
      newDomain = concreteGroup.multiply(
        newDomain,
        concreteGroup.generators[this.generators[i]]
      );

    return newDomain;
  }
}

/**
 * Represents a flag class, and how it changes on element-change operations.
 */
export class FlagClass {
  /** Specifies how a flag changes when a certain element-change operation is
  applied. */
  elementChanges: ElementChange[];

  constructor(elementChanges: ElementChange[] = []) {
    this.elementChanges = elementChanges;
  }

  /** Adds a new ElementChange object to the flag class. */
  push(newClassNumber: number, generators: number[]): void {
    this.elementChanges.push(new ElementChange(newClassNumber, generators));
  }
}

/**
 * A map from flags to objects of some other type.
 * Used as a simple wrapper for a dictionary, so that one doesn't constantly
 * have to call `.toString()` on the flags.
 */
export class FlagMap<T, U> {
  dictionary: { [key: string]: U };

  constructor() {
    this.dictionary = {};
  }

  get(key: Flag<T> | string): U {
    const str = key.toString();
    const res = this.dictionary[str];

    if (res === undefined)
      throw new Error(
        "Flag " +
          str +
          " not found! Was the identity simplifier properly set up?"
      );

    return res;
  }

  set(key: Flag<T> | string, value: U): void {
    this.dictionary[key.toString()] = value;
  }

  clone(): FlagMap<T, U> {
    const newMap = new FlagMap<T, U>();

    for (const key in this.dictionary)
      newMap.dictionary[key] = this.dictionary[key];

    return newMap;
  }
}
