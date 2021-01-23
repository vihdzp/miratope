import type { Gender } from "./interfaces";
type CustomFunctionType = (name: string, gender: Gender) => string;

/**
 * Helper class for toAdjective.
 * Stores endings of words and what to do with them.
 *
 * @category Translation
 */
export default class Ending {
  /** The pattern at the end of a word. */
  string: string;

  /** A function that determines how a word is transformed when turned into an
   * adjective. */
  customFunction: CustomFunctionType | undefined;

  /** The negative of the amount of characters that are removed at the end. */
  sliceDepth: number | undefined;

  /** The new characters added to turn the word into an adjective. */
  newEnding: string | undefined;

  /**
   * Constructor for the `Ending` class.
   *
   * @param string The string that represents the ending.
   * @param customFunction Function that specifies the changes that will happen
   * to the string.
   */
  constructor(string: string, customFunction: CustomFunctionType);

  /**
   * Constructor for the `Ending` class.
   *
   * @param string The string that represents the ending.
   * @param sliceDepth The number of characters that will be sliced off the
   * string before the adjective conversion.
   * @param newEnding the ending that will be appended to the string after the
   * slicing.
   * @param customFunction Function that specifies any further changes that will
   * happen to the string.
   */
  constructor(
    string: string,
    sliceDepth: number,
    newEnding: string,
    customFunction?: CustomFunctionType
  );

  /**
   * Constructor for the `Ending` class.
   *
   * @param string The string that represents the ending.
   * @param sliceDepth Either the number of characters that will be sliced off
   * the string before the adjective conversion, or a [[`customFunction`]] in
   * case no slicing needs to be done beforehand.
   * @param newEnding The ending that will be appended to the string after the
   * slicing, if applicable.
   * @param customFunction Function that specifies any further changes that will
   * happen to the string, if applicable.
   */
  constructor(
    string: string,
    sliceDepth: number | CustomFunctionType,
    newEnding?: string,
    customFunction?: CustomFunctionType
  ) {
    this.string = string;

    // In case of the first constructor.
    if (typeof sliceDepth === "function") this.customFunction = sliceDepth;
    // In case of the second constructor.
    else {
      this.sliceDepth = sliceDepth;
      this.newEnding = newEnding;
      this.customFunction = customFunction;
    }
  }

  /**
   * Applies the ending to a string, doing the necessary modifications.
   *
   * @param name The string to modify.
   * @param gender The grammatical gender used to build the adjective.
   * @return The name, modified into an adjective.
   */
  changeEnding(name: string, gender: Gender): string {
    // Slices the name.
    if (this.sliceDepth) name = name.slice(0, this.sliceDepth);

    // Adds the new ending.
    if (this.newEnding) name += this.newEnding;

    // Applies the custom function.
    if (this.customFunction !== undefined)
      name = this.customFunction(name, gender);

    // Returns the modified name.
    return name;
  }

  /* Compares the kth to last (and therefore the last k characters backwards) of
    name with _endings kth entry,
    in alphabetical order. */
  static compare(name: string, endingStr: string, k: number): number {
    const i = name.length - k;
    const j = endingStr.length - k;

    // This must be the backup ending, so let's check to the right of that.
    if (j <= -1) return 1;

    // We only really need to check the kth character; the rest have been
    // checked before.
    if (name.charAt(i).toLowerCase() < endingStr.charAt(j).toLowerCase())
      return -1;
    if (name.charAt(i).toLowerCase() > endingStr.charAt(j).toLowerCase())
      return 1;

    return 0;
  }
}
