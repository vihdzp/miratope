/**
 * Contains methods to translate polytope names and messages.
 *
 * @packageDocumentation
 * @module Naming
 * @category Translation
 */

import * as Translation from "./Translation";
import { add as addAdjective } from "./Adjective";
import type { LanguageOptions } from "./interfaces";

/** Converts a number `n` into a greek prefix (or whatever works similarly in
 * the target language). Based on
 * [[https://www.georgehart.com/virtual-polyhedra/greek-prefixes.html|
 * George Hart's scheme for greek numerical prefixes]].
 * Works only from 0 to 99999. Defaults to `"n-"`.
 *
 * @param n The number to convert.
 * @param Result modifiers.
 * @return The number `n` as a greek prefix.
 * @example
 * setLanguage("en");
 *
 * //"penta"
 * console.log(greekPrefix(5));
 *
 * //"icositetra"
 * greekPrefix(24));
 *
 * //"enneacosioctacontahepta"
 * console.log(greekPrefix(987));
 */
export const greekPrefix = function (
  n: number,
  options: LanguageOptions = {}
): string {
  if (n === 0) return Translation.get("greekPrefixes/nulli", options);
  if (n === 1) return Translation.get("greekPrefixes/mono", options);
  if (n >= 100000) return n + "-";

  let res = "";
  const ones = n % 10;
  n = Math.floor(n / 10);
  const tens = n % 10;
  n = Math.floor(n / 10);
  const hundreds = n % 10;
  n = Math.floor(n / 10);
  const thousands = n % 10;
  n = Math.floor(n / 10);
  const tenThousands = n % 10;

  // Myrias
  switch (tenThousands) {
    case 0:
      break;
    case 1:
      res += Translation.get("greekPrefixes/myria");
      break;
    case 2:
      res +=
        Translation.get("greekPrefixes/dis") +
        Translation.get("greekPrefixes/myria");
      break;
    case 3:
      res +=
        Translation.get("greekPrefixes/tris") +
        Translation.get("greekPrefixes/myria");
      break;
    default:
      res +=
        Translation.get("greekPrefixes/unit" + tenThousands) +
        Translation.get("greekPrefixes/myria");
      break;
  }

  // Chilias
  switch (thousands) {
    case 0:
      break;
    case 1:
      res += Translation.get("greekPrefixes/chilia");
      break;
    case 2:
      res +=
        Translation.get("greekPrefixes/dis") +
        Translation.get("greekPrefixes/chilia");
      break;
    case 3:
      res +=
        Translation.get("greekPrefixes/tris") +
        Translation.get("greekPrefixes/chilia");
      break;
    default:
      res +=
        Translation.get("greekPrefixes/unit" + thousands) +
        Translation.get("greekPrefixes/chilia");
      break;
  }

  // Hectos
  switch (hundreds) {
    case 0:
      break;
    case 1:
      if (!tens && !ones) res += Translation.get("greekPrefixes/hecto");
      else res += Translation.get("greekPrefixes/hecaton");
      break;
    case 2:
      res +=
        Translation.get("greekPrefixes/dia") +
        Translation.get("greekPrefixes/cosi");
      break;
    default:
      res +=
        Translation.get("greekPrefixes/unit" + hundreds) +
        Translation.get("greekPrefixes/cosi");
      break;
  }

  // Decas
  switch (tens) {
    case 0:
      res += Translation.get("greekPrefixes/unit" + ones);
      break;
    // -deca cases:
    case 1:
      switch (ones) {
        case 0:
          res += Translation.get("greekPrefixes/deca");
          break;
        case 2:
          res += Translation.get("greekPrefixes/dodeca");
          break;
        default:
          res +=
            Translation.get("greekPrefixes/unit" + ones) +
            Translation.get("greekPrefixes/deca");
          break;
      }
      break;
    // icosa- cases:
    case 2:
      if (ones) {
        res +=
          Translation.get("greekPrefixes/icosi") +
          Translation.get("greekPrefixes/unit" + ones);
      } else res += Translation.get("greekPrefixes/icosa");
      break;
    // triaconta- cases:
    case 3:
      res +=
        Translation.get("greekPrefixes/triaconta") +
        Translation.get("greekPrefixes/unit" + ones);
      break;
    default:
      res +=
        Translation.get("greekPrefixes/unit" + tens) +
        Translation.get("greekPrefixes/conta") +
        Translation.get("greekPrefixes/unit" + ones);
      break;
  }

  if (options.uppercase) return Translation.firstToUpper(res);
  return res;
};

// A plain name for the polytope is simply [greek facet count prefix]
// + [greek dimension Ending].

// Possible options:
/* uppercase */
export const plain = function (
  n: number,
  dimension: number,
  options: LanguageOptions = {}
): string {
  if (!options.count) options.count = 1;

  let prefix = greekPrefix(n, options);

  // "Pentágono" en vez de "pentagono."
  if (Translation.language === "es" && dimension === 2) {
    prefix = lastVowelTilde(prefix);
  }

  return prefix + polytopeEnding(dimension, options);
};

/**
 * The name for an d-element, according to
 * [[http://os2fan2.com/gloss/pglosstu.html|Wendy Krieger's polygloss]].
 * This is an extension of the scheme Jonathan Bowers uses on
 * [[http://www.polytope.net/hedrondude/home.htm|his website]]. Works up to
 * `d = 30`. Defaults to `"d-element"`.
 *
 * Most of these are neologisms, so feel free to translate them as you
 * think is appropriate.
 *
 * @param options Result modifiers.
 * @example
 * setLanguage("en");
 *
 * //face
 * console.log(element(2));
 *
 * //teron
 * console.log(element(4));
 *
 * //icexon
 * console.log(element(26));
 */
export const element = function (
  n: number,
  options: LanguageOptions = {}
): string {
  if (n > 30) {
    return (
      n +
      "-" +
      Translation.get("elements/element", {
        uppercase: Translation.nounCapitalization,
        count: options.count,
      })
    );
  }

  return Translation.get("element/el" + n, options);
};

// The ending in the name for a d-polytope.
export const polytopeEnding = function (
  d: number,
  options: LanguageOptions = {}
): string {
  if (!options.count) options.count = 1;

  let res = "";
  switch (Translation.language) {
    case "en":
      switch (d) {
        case 1:
          if (options.count > 1) res = "tela";
          else res = "telon";
          break;
        case 2:
          if (options.count > 1) res = "gons";
          else res = "gon";
          break;
        case 3:
          if (options.count > 1) res = "hedra";
          else res = "hedron";
          break;
        case 4:
          if (options.count > 1) res = "chora";
          else res = "choron";
          break;
        default:
          if (d > 31) return d + "-polytope" + (options.count > 1 ? "s" : "");
          return element(d - 1, options);
      }

      break;
    case "es":
      switch (d) {
        case 1:
          res = "telo";
          break;
        case 2:
          res = "gono";
          break;
        case 3:
          res = "edro";
          break;
        case 4:
          res = "coro";
          break;
        default:
          if (d > 20) res = d + "-politopo";
          else res = element(d - 1, options);
          break;
      }

      if (options.count >= 2) res += "s";
      break;
    case "de":
      switch (d) {
        case 1:
          if (options.count) res = "tela";
          else res = "telon";
          break;
        case 2:
          if (options.count) res = "gone";
          else res = "gon";
          break;
        case 3:
          res = "eder";
          break;
        case 4:
          if (options.count) res = "chora";
          else res = "choron";
          break;
        default:
          if (d > 20) return d + "-polytop" + (options.count ? "en" : "");
          return element(d - 1, options);
      }

      break;
  }

  if (options.uppercase) return Translation.firstToUpper(res);
  return res;
};

// The name for a hypercube in d dimensions.
export const hypercube = function (d: number): string {
  switch (d) {
    case 0:
      return Translation.get("shape/Point");
    case 1:
      return Translation.get("shape/dyad");
    case 2:
      return Translation.get("shape/square");
    case 3:
      return Translation.get("shape/cube");
    case 4:
      return Translation.get("shape/tesseract");
    default:
      const prefix = greekPrefix(d);

      // Changes the ending of the prefix accordingly.
      switch (Translation.language) {
        case "es":
          if (prefix.charAt(prefix.length - 2) === "c") {
            return prefix.substr(0, prefix.length - 2) + "queracto";
          } else return prefix.substr(0, prefix.length - 1) + "eract";

        case "de":
          return prefix.substr(0, prefix.length - 1) + "eract";

        case "en":
        default:
          if (prefix.charAt(prefix.length - 2) === "c") {
            return prefix.substr(0, prefix.length - 2) + "keract";
          } else return prefix.substr(0, prefix.length - 1) + "eract";
      }
  }
};

// The name for a cross-polytope in d dimensions.
export const cross = function (d: number): string {
  switch (d) {
    case 0:
      return Translation.get("shape/Point");
    case 1:
      return Translation.get("shape/dyad");
    case 2:
      return Translation.get("shape/square");
    case 3:
      return plain(8, 3);
    case 4:
      return plain(16, 4);
    default:
      return greekPrefix(d) + Translation.get("misc/cross");
  }
};

// The name for a simplex in d dimensions.
export const simplex = function (d: number): string {
  switch (d) {
    case 0:
      return Translation.get("shape/Point");
    case 1:
      return Translation.get("shape/dyad");
    case 2:
      return Translation.get("shape/triangle");
    case 3:
      return plain(4, 3);
    case 4:
      return plain(5, 4);
    default:
      return greekPrefix(d) + Translation.get("misc/plex");
  }
};

// Spanish helper function.
// Adds a tilde to the last vowel of a word.
// E.g. penta -> pentá
const lastVowelTilde = function (str: string) {
  for (let i = str.length - 1; i >= 0; i--) {
    switch (str.charAt(i)) {
      case "a":
        return replaceAt(str, i, "á");
      case "e":
        return replaceAt(str, i, "é");
      case "i":
        return replaceAt(str, i, "í");
      case "o":
        return replaceAt(str, i, "ó");
      case "u":
        return replaceAt(str, i, "ú");
    }
  }

  throw new Error("No vowel to replace!");
};

// https://stackoverflow.com/a/1431113
const replaceAt = function (
  str: string,
  index: number,
  replacement: string
): string {
  return (
    str.substr(0, index) + replacement + str.substr(index + replacement.length)
  );
};

// Gives a name for {n / d}.
// For polygons with up to five non-compound stellations,
// uses the [small/-/medial/great/grand] n-gram naming scheme.
// For everything else, uses d-strophic n-gon.

// Possible options:
/* uppercase
 * gender
 * count */
export const regularPolygon = function (
  n: number,
  d?: number,
  options: LanguageOptions = {}
): string {
  if (d === undefined || d === 1) return plain(n, 2);
  if (n === 3 && d === 1) return Translation.get("shape/triangle", options);
  if (n === 4 && d === 1) return Translation.get("shape/square", options);

  options.uppercase ||= Translation.nounCapitalization;

  // "Crossed" polygons, as in the crossed pentagrammic antiprism.
  if (d > n / 2) {
    return addAdjective(
      Translation.get("misc/crossed", { gender: options.gender }),
      regularPolygon(n, n - d, lowercaseLanguageOptions(options)),
      { uppercase: options.uppercase }
    );
  }

  // Counts the number of stellation non-compounds.
  let count: number;
  // Gets the index of {n/d} among these.
  let index = 0;
  let i = 2;

  // Any polygon with more than 42 sides has at least 6 non-compound
  // stellations.
  if (n > 42) return simpleStar(n, d);

  // Calculates the index.
  while (i < d) {
    if (Math.gcd(n, i++) === 1 && ++index >= 5) return simpleStar(n, d);
  }

  count = index;

  // Calculates the count.
  while (i < n / 2) {
    if (Math.gcd(n, i++) === 1 && ++count >= 5) return simpleStar(n, d);
  }

  // Adds the great, grand, etc. modifiers.
  // This system is complicated, don't blame me, I didn't make it.
  switch (count * 10 + index) {
    case 30:
    case 40:
    case 50:
      return star(n, "modifiers/small", options);
    case 52:
      return star(n, "modifiers/medial", options);
    case 21:
    case 32:
    case 42:
    case 53:
      return star(n, "modifiers/great", options);
    case 43:
    case 54:
      return star(n, "modifiers/grand", options);
    default:
      return star(n, "", options);
  }
};

// Possible options:
/* uppercase
 * gender
 * count */
const simpleStar = function (
  n: number,
  d: number,
  options: LanguageOptions = {}
) {
  return addAdjective(
    greekPrefix(d) + Translation.get("misc/strophic", options),
    Translation.get("grammar/star", {
      prefix: greekPrefix(n),
      count: options.count,
      uppercase: Translation.nounCapitalization,
    } as LanguageOptions),
    { uppercase: options.uppercase }
  );
};

// Helper function for regularPolygonName.
// Is the one actually giving the names.

// Possible options:
/* uppercase
 * gender
 * count */
const star = function (n: number, mod: string, options: LanguageOptions = {}) {
  // The base name of the star, e.g. "heptagram".
  const star = Translation.get("grammar/star", {
    prefix: greekPrefix(n),
    count: options.count,
  } as LanguageOptions);

  // If there's no modifier, returns the name.
  if (!mod) {
    if (options.uppercase) return Translation.firstToUpper(star);
    return star;
  }

  // The base name with the modifier added, e.g. "great heptagram".
  return addAdjective(Translation.get(mod, { gender: options.gender }), star, {
    uppercase: options.uppercase,
  });
};

// Clones the options and sets the uppercase attribute to false.
const lowercaseLanguageOptions = function (options: LanguageOptions) {
  const newLanguageOptions = { ...options };
  newLanguageOptions.uppercase = false;
  return newLanguageOptions;
};
