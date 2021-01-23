import type { ConcreteGroup, ConcreteGroupElement } from "./groups";

/**
 * Represents a [[https://en.wikipedia.org/wiki/Flag_(geometry)|flag]] in a
 * [[`PolytopeS`]] object.
 */
export default class Flag<T> {
  /** The index of the flag in the corresponding [[PolytopeS.flagClasses|
  `flagClasses`]] array. */
  classNumber: number;

  /** The symmetry domain of the given flag. */
  domain: ConcreteGroupElement<T>;

  /** Constructor for the `Flag` class. */
  constructor(classNumber: number, domain: ConcreteGroupElement<T>) {
    this.classNumber = classNumber;
    this.domain = domain;
  }

  /**
   * Represents a flag as a string.
   *
   * @returns A unique string identifier, consisting both of the
   * [[`classNumber`]] of the flag and the
   * [[ConcreteGroupElement.groupElement|`groupElement`]] of its [[`domain`]].
   */
  toString(): string {
    return this.classNumber + "|" + this.domain.groupElement;
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

  /** Constructor for the `ElementChange` class. */
  constructor(newClassNumber: number, generators: number[]) {
    this.newClassNumber = newClassNumber;
    this.generators = generators;
  }

  /**
   * Applies an `ElementChange` to a flag.
   *
   * @param concreteGroup The concrete symmetry group associated to a flag.
   * @param domain The domain of the flag.
   * @returns The domain of the flag resulting from the element-change
   * operation.
   */
  apply<T>(
    concreteGroup: ConcreteGroup<T>,
    domain: ConcreteGroupElement<T>
  ): ConcreteGroupElement<T> {
    let newDomain = domain;

    for (let i = 0; i < this.generators.length; i++) {
      newDomain = concreteGroup.multiply(
        newDomain,
        concreteGroup.generators[this.generators[i]]
      );
    }

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

  /**
   * Constructor for the FlagClass class.
   *
   * @param elementChanges Specifies how a flag changes when a certain
   * element-change operation is applied.
   */
  constructor(elementChanges: ElementChange[] = []) {
    this.elementChanges = elementChanges;
  }

  /**
   * Adds a new [[`ElementChange`]] object to the flag class.
   *
   * @param newClassNumber The [[ElementChange.newClassNumber|
   * `newClassNumber`]] associated to the [[`ElementChange`]] object.
   * @param generators The [[ElementChange.generators|
   * `generators`]] associated to the [[`ElementChange`]] object.
   */
  push(newClassNumber: number, generators: number[]): void {
    this.elementChanges.push(new ElementChange(newClassNumber, generators));
  }
}

/**
 * A map from flags to objects of some other type.
 * Used as a simple wrapper for a dictionary, so that one doesn't constantly
 * have to call [[Flag.toString|`.toString()`]] on the flags.
 *
 * @typeParam T The type of the [[`Flag`]] objects used as keys.
 * @typeParam U The type of the values.
 */
export class FlagMap<T, U> {
  /** The internal dictionary used to actually do the mapping. */
  dictionary: { [key: string]: U };

  /** Constructor for the FlagMap class. */
  constructor() {
    this.dictionary = {};
  }

  /**
   * Gets the value associated to a flag.
   *
   * @param key The flag to use as a key.
   * @returns The value associated to the flag.
   */
  get(key: Flag<T> | string): U {
    const str = key.toString();
    const res = this.dictionary[str];

    if (res === undefined) {
      throw new Error(
        "Flag " +
          str +
          " not found! Was the identity simplifier properly set up?"
      );
    }

    return res;
  }

  /**
   * Sets the value associated to a flag.
   *
   * @param key The flag to use as a key.
   * @param value The new value that will be associated to the flag.
   */
  set(key: Flag<T> | string, value: U): void {
    this.dictionary[key.toString()] = value;
  }

  clone(): FlagMap<T, U> {
    const newMap = new FlagMap<T, U>();

    for (const key in this.dictionary) {
      newMap.dictionary[key] = this.dictionary[key];
    }

    return newMap;
  }
}
