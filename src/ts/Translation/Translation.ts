/**
 * Serves as a wrapper for [[https://github.com/globalizejs/globalize|
 * Globalize.js]].
 */

import * as Globalize from "globalize";
import { Gender, LanguageOptions } from "./interfaces";

/** The wrapped Globalize object. */
export let globalize: Globalize;

/** A two letter string identifying the language. */
export let language: string;

/** Specifies whether the target language capitalizes all nouns. */
export let nounCapitalization: boolean;

/** Specifies whether the target language places adjectives before nouns. */
export let adjBeforeNoun: boolean;

/** Specifies whether the target language has
 * [[https://en.wikipedia.org/wiki/Grammatical_gender|grammatical gender]]. */
export let genderedLanguage: boolean;

export const setLanguage = function (lang: string): void {
  globalize = new Globalize(lang);
  language = lang;

  // Sets properties about the chosen language.

  // Does the language capitalize all nouns?
  nounCapitalization = get("meta/nounCapitalization") === "true";

  // Does the language have adjectives generally precede nouns, or viceversa?
  adjBeforeNoun = get("meta/adjBeforeNoun") === "true";

  // Does the language have grammatical gender?
  genderedLanguage = get("meta/genderedLanguage") === "true";
};

/**
 * Gets the translation of a message from loadMessages.js.
 *
 * @returns The translated message.
 */
export const get = function (
  message: string,
  options: LanguageOptions = {}
): string {
  options.count ||= 1;
  options.gender ||= Gender.male;
  const msg: string = globalize.messageFormatter(message)(options);

  // Uppercase message.
  if (options.uppercase) return firstToUpper(msg);
  return msg;
};

export const error = function (code: string, dev = false): never {
  let message: string = get(code);
  if (dev) message = "UNEXPECTED ERROR: " + message;

  throw new Error(message);
};

/**
 * Makes the first letter of a string uppercase.
 *
 * @returns The transformed string.
 */
export const firstToUpper = function (str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Makes the first letter of a string lowercase.
 *
 * @returns The transformed string.
 */
export const firstToLower = function (str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1);
};
