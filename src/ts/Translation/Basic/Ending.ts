import type { Gender } from "./LanguageOptions";
type CustomFunctionType = (name: string, gender: Gender) => string;

/**
 * Helper class for the [[`Adjective`]] module.
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

  /**
   * Helper function for [[`BaseLanguage.toAdjective`]].
   * Finds the ending that fits a string among a list of endings.
   * Uses a modified binary search.
   *
   * @param name The string for which we want to match an ending.
   * @param endings The sorted list of endings that `name` will be compared to.
   * @returns The first ending that matches, or `null` if none does.
   */
  static findEnding(name: string, endings: Ending[]): Ending | null {
    let first: number;
    let mid: number;
    let last: number;
    let firstMatch = 0;
    let lastMatch: number = endings.length - 1;
    let k = 1; // The number of characters we're checking.
    let backup = -1;

    // Adds one letter of name at a time.
    // Searches for the least and greatest elements of _endings
    // that are compatible with the observed letters.
    while (lastMatch !== firstMatch) {
      // If the first (shorter) possibility fits, and no other (longer one)
      // does, we'll use that one.
      if (endings[firstMatch].string.length < k) backup = firstMatch;
      else backup = -1;

      // Finds firstMatch.
      first = firstMatch;
      last = lastMatch;
      while (last - first > 1) {
        mid = Math.floor((first + last) / 2);
        if (Ending.compare(name, endings[mid].string, k) <= 0) last = mid;
        else first = mid;
      }

      if (Ending.compare(name, endings[first].string, k) === 0) {
        firstMatch = first;
      } else firstMatch = last;

      // Finds lastMatch.
      first = firstMatch;
      last = lastMatch;
      while (last - first > 1) {
        mid = Math.floor((first + last) / 2);
        if (Ending.compare(name, endings[mid].string, k) < 0) last = mid;
        else first = mid;
      }

      if (Ending.compare(name, endings[last].string, k) === 0) lastMatch = last;
      else lastMatch = first;

      k++;
    }

    // If at some point, only one match fits,
    // we check if it fits the whole string.
    // Note: we haven't checked whether the (k - 1)th character is correct.
    const endingStr = endings[firstMatch].string;
    for (k--; k <= endingStr.length; k++) {
      // No match.
      const nameChar = name.charAt(name.length - k).toLowerCase();
      const endChar = endingStr.charAt(endingStr.length - k).toLowerCase();
      if (nameChar !== endChar) return endings[backup] || null;
    }

    // If the match does fit, we return it.
    return endings[firstMatch];
  }

  /* Compares the kth to last (and therefore the last k characters backwards) of
    name with _endings kth entry,
    in alphabetical order. */
  private static compare(name: string, endingStr: string, k: number): number {
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
