/**
 * Serves as a wrapper for [[https://github.com/globalizejs/globalize |
 * Globalize.js]].
 */

import "./loadJSON";

import * as Globalize from "globalize";
import Options, { Gender } from "./LanguageOptions";

/** The wrapped Globalize object. */
export let globalize: Globalize;

export const setLanguage = function (lang: string): void {
  globalize = new Globalize(lang);
};

/**
 * Gets the translation of a message from loadMessages.js.
 *
 * @returns The translated message.
 */
export const get = function (message: string, options: Options = {}): string {
  options.uppercase ||= false;
  options.gender ||= Gender.male;
  options.count ||= 1;

  return uppercase(globalize.messageFormatter(message)(options), options);
};

export const error = function (
  code: string,
  options: Options = {},
  dev = false
): never {
  let message: string = get(code, options);

  if (dev) message = get("error/unexpected", { arg0: message });

  throw new Error(message);
};

export const uppercase = function (str: string, options: Options = {}): string {
  if (options.uppercase) return firstToUpper(str);
  return str;
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
