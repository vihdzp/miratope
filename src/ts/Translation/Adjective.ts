import type { Gender, LanguageOptions } from "./interfaces";
import * as Translation from "./Translation";
import Ending from "./Ending";

/**
 * Converts a polytope name into an adjective, possibly depending on the
 * grammatical gender of the substantive it modifies.
 *
 * To do this, the code compares the string with a list of [[`Ending`]]
 * patterns. The longest pattern that matches is then applied to transform the
 * string into what will hopefully be the correct adjective form. If no match is
 * found, the string is left as-is.
 *
 * @param name The name of the polytope to convert into an adjective.
 * @param gender The grammatical gender to use.
 * @returns The polytope name as an adjective.
 * @example
 * //Sets language to English.
 * Translation.setLanguage("en");
 *
 * //Cubical
 * console.log(Adjective.convert("cube"));
 */
export const convert = function (name: string, gender: Gender): string {
  let endingIndx: number;
  const langEndings = endings[Translation.language];

  if (Translation.adjBeforeNoun) {
    endingIndx = findEnding(name, langEndings);

    if (endingIndx !== -1)
      return langEndings[endingIndx].changeEnding(name, gender);

    return name;
  } else {
    const indexOfSpace = name.indexOf(" ");
    const firstWord = indexOfSpace === -1 ? name : name.substr(0, indexOfSpace);
    const restOfName = indexOfSpace === -1 ? "" : name.substr(indexOfSpace);

    endingIndx = findEnding(firstWord, langEndings);

    if (endingIndx !== -1)
      return (
        langEndings[endingIndx].changeEnding(firstWord, gender) + restOfName
      );

    return name;
  }
};

// Helper function for toAdjective.
// Finds the ending that fits a string among a list of endings.
// Returns its index. -1 if no ending fits.
// Uses a modified binary search.
const findEnding = function (name: string, endings: Ending[]) {
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
    // If the first (shorter) possibility fits, and no other (longer one) does,
    // we'll use that one.
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
    if (nameChar !== endChar) return backup;
  }

  // If the match does fit, we return it.
  return firstMatch;
};

/**
 * Adds an appropriately declensed adjective to a noun.
 *
 * @param adj The adjective, already declensed.
 * @param noun The noun to which the adjective will be added.
 * @returns The adjective placed before or after the noun, according to the
 * target Translation.language.
 */
export const add = function (
  adj: string,
  noun: string,
  options: LanguageOptions = {}
): string {
  let res: string;

  if (Translation.adjBeforeNoun) res = adj + " " + noun;
  else res = noun + " " + adj;

  if (options.uppercase) return Translation.firstToUpper(res);
  return res;
};

export const loadEndings = function (json: Record<string, Ending[]>): void {
  endings = json;
};

// Helper array for toAdjective.
// Stores some endings and what to do with them.
// Sorted by alphabetical order of the strings, backwards!
// cba is sorted before dcba.
let endings: Record<string, Ending[]> = {};
