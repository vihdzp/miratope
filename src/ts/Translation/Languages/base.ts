import Options, { Gender } from "../Basic/LanguageOptions";
import * as Message from "../Basic/Message";
import Ending from "../Basic/Ending";

export let _language: BaseLanguage;

export const _setLanguage = function (language: BaseLanguage): void {
  _language = language;
};

export default abstract class BaseLanguage {
  /** Whether nouns are capitalized. */
  nounCapitalization = false;

  /** Whether adjectives go before (or after) nouns. */
  adjBeforeNoun = true;

  /** Whether the language has grammatical gender. */
  genderedLanguage = false;

  /** A string, which serves as an identifier for the language. */
  code = "base";

  /** Ending list for [[`toAdjective`]]. */
  endings: Ending[] = [];

  /**
   * Converts a polytope name into an adjective, possibly depending on the
   * grammatical gender of the substantive it modifies.
   *
   * To do this, the code compares the string with a list of [[`Ending`]]
   * patterns. The longest pattern that matches is then applied to transform the
   * string into what will hopefully be the correct adjective form. If no match
   * is found, the string is left as-is.
   *
   * @param name The name of the polytope to convert into an adjective.
   * @param gender The grammatical gender to use.
   * @returns The polytope name as an adjective.
   * @example
   * //Sets language to English.
   * Translation.setLanguage("en");
   *
   * //Cubical
   * console.log(Language.toAdjective("cube"));
   */
  toAdjective(name: string, gender: Gender): string {
    let ending: Ending | null;

    // Adjectives before nouns.
    if (this.adjBeforeNoun) {
      ending = this.findEnding(name);
      return ending ? ending.changeEnding(name, gender) : name;
    }
    // Nouns before adjectives.
    else {
      const indexOfSpace = name.indexOf(" "),
        firstWord = indexOfSpace === -1 ? name : name.substr(0, indexOfSpace),
        restOfName = indexOfSpace === -1 ? "" : name.substr(indexOfSpace);

      ending = this.findEnding(firstWord);
      return ending
        ? ending.changeEnding(firstWord, gender) + restOfName
        : name;
    }
  }

  // Helper function for toAdjective.
  // Finds the ending that fits a string among a list of endings.
  // Returns its index. -1 if no ending fits.
  // Uses a modified binary search.
  private findEnding(name: string): Ending | null {
    const endings = this.endings;

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

  addAdjective(adj: string, noun: string, options: Options = {}): string {
    let res: string;

    if (this.adjBeforeNoun) res = adj + " " + noun;
    else res = noun + " " + adj;

    return Message.uppercase(res, options);
  }

  /** The grammatical gender of an n-sided d-tope. */
  plainGender(n: number, d: number): Gender {
    [n, d];
    return Gender.male;
  }

  /** The grammatical gender of an {n / d} polygon. */
  polygonGender(n: number, d: number): Gender {
    [n, d];
    return Gender.male;
  }

  /** The grammatical gender of "n-prism". */
  multiprismGender(n: number): Gender {
    n;
    return Gender.male;
  }

  /** The grammatical gender of "n-tegum". */
  multitegumGender(n: number): Gender {
    n;
    return Gender.male;
  }

  /** The grammatical gender of "n-pyramid". */
  multipyramidGender(n: number): Gender {
    n;
    return Gender.male;
  }

  /** The grammatical gender of "antiprism". */
  antiprismGender(): Gender {
    return Gender.male;
  }

  /** The grammatical gender of "cupola". */
  cupolaGender(): Gender {
    return Gender.male;
  }

  /** The grammatical gender of "cuploid". */
  cuploidGender(): Gender {
    return Gender.male;
  }

  /** The grammatical gender of "cupolaic blend". */
  cupolaicBlendGender(): Gender {
    return Gender.male;
  }

  /** The grammatical gender of d-hypercube. */
  hypercubeGender(d: number): Gender {
    d;
    return Gender.male;
  }

  /** The grammatical gender of d-simplex. */
  simplexGender(d: number): Gender {
    d;
    return Gender.male;
  }

  /** The grammatical gender of d-orthoplex. */
  crossGender(d: number): Gender {
    d;
    return Gender.male;
  }

  /** Converts a number `n` into a greek prefix (or whatever works similarly in
   * the target language). Based on
   * [[https://www.georgehart.com/virtual-polyhedra/greek-prefixes.html |
   * George Hart's scheme for greek numerical prefixes]].
   * Works only from 0 to 99999. Defaults to `"n-"`.
   *
   * @param n The number to convert.
   * @param Result modifiers.
   * @return The number `n` as a greek prefix.
   */
  greekPrefix(n: number, options: Options = {}): string {
    if (n === 0) return Message.get("greekPrefixes/nulli", options);
    if (n === 1) return Message.get("greekPrefixes/mono", options);
    if (n >= 100000) return n + "-";

    // Gets the digits of n.
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
        res += Message.get("greekPrefixes/myria");
        break;
      case 2:
        res +=
          Message.get("greekPrefixes/dis") + Message.get("greekPrefixes/myria");
        break;
      case 3:
        res +=
          Message.get("greekPrefixes/tris") +
          Message.get("greekPrefixes/myria");
        break;
      default:
        res +=
          Message.get("greekPrefixes/unit" + tenThousands) +
          Message.get("greekPrefixes/myria");
        break;
    }

    // Chilias
    switch (thousands) {
      case 0:
        break;
      case 1:
        res += Message.get("greekPrefixes/chilia");
        break;
      case 2:
        res +=
          Message.get("greekPrefixes/dis") +
          Message.get("greekPrefixes/chilia");
        break;
      case 3:
        res +=
          Message.get("greekPrefixes/tris") +
          Message.get("greekPrefixes/chilia");
        break;
      default:
        res +=
          Message.get("greekPrefixes/unit" + thousands) +
          Message.get("greekPrefixes/chilia");
        break;
    }

    // Hectos
    switch (hundreds) {
      case 0:
        break;
      case 1:
        if (!tens && !ones) res += Message.get("greekPrefixes/hecto");
        else res += Message.get("greekPrefixes/hecaton");
        break;
      case 2:
        res +=
          Message.get("greekPrefixes/dia") + Message.get("greekPrefixes/cosi");
        break;
      default:
        res +=
          Message.get("greekPrefixes/unit" + hundreds) +
          Message.get("greekPrefixes/cosi");
        break;
    }

    // Decas
    switch (tens) {
      case 0:
        res += Message.get("greekPrefixes/unit" + ones);
        break;
      // -deca cases:
      case 1:
        switch (ones) {
          case 0:
            res += Message.get("greekPrefixes/deca");
            break;
          case 2:
            res += Message.get("greekPrefixes/dodeca");
            break;
          default:
            res +=
              Message.get("greekPrefixes/unit" + ones) +
              Message.get("greekPrefixes/deca");
            break;
        }
        break;
      // icosa- cases:
      case 2:
        if (ones) {
          res +=
            Message.get("greekPrefixes/icosi") +
            Message.get("greekPrefixes/unit" + ones);
        } else res += Message.get("greekPrefixes/icosa");
        break;
      // triaconta- cases:
      case 3:
        res +=
          Message.get("greekPrefixes/triaconta") +
          Message.get("greekPrefixes/unit" + ones);
        break;
      default:
        res +=
          Message.get("greekPrefixes/unit" + tens) +
          Message.get("greekPrefixes/conta") +
          Message.get("greekPrefixes/unit" + ones);
        break;
    }

    return Message.uppercase(res, options);
  }

  // A plain name for the polytope is simply [greek facet count prefix]
  // + [greek dimension Ending].

  // Possible options:
  /* uppercase */
  plain(n: number, dimension: number, options: Options = {}): string {
    return (
      this.greekPrefix(n, options) + this.polytopeEnding(dimension, options)
    );
  }

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
   * @param d The number of dimensions of the element.
   * @param options Result modifiers.
   * @returns The name of a d-element.
   */
  element(d: number, options: Options = {}): string {
    if (d > 30) {
      return (
        d +
        "-" +
        Message.get("elements/element", {
          uppercase: this.nounCapitalization,
          count: options.count,
        })
      );
    }

    return Message.get("element/el" + d, options);
  }

  polytopeEnding(d: number, options: Options = {}): string {
    options.count ||= 1;

    if (d > 31) return d + "-polytope" + (options.count > 1 ? "s" : "");

    return this.element(d - 1, options);
  }

  // Gives a name for {n / d}.
  // For polygons with up to five non-compound stellations,
  // uses the [small/-/medial/great/grand] n-gram naming scheme.
  // For everything else, uses d-strophic n-gon.
  regularPolygon(n: number, d?: number, options: Options = {}): string {
    if (d === undefined || d === 1) return this.plain(n, 2);
    if (n === 3 && d === 1) return Message.get("shape/triangle", options);
    if (n === 4 && d === 1) return Message.get("shape/square", options);

    options.uppercase ||= this.nounCapitalization;

    // "Crossed" polygons, as in the crossed pentagrammic antiprism.
    if (d > n / 2) {
      const newOptions = { ...options };
      newOptions.uppercase = this.nounCapitalization;

      return this.addAdjective(
        Message.get("misc/crossed", { gender: options.gender }),
        this.regularPolygon(n, n - d, newOptions),
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
    if (n > 42) return this.simpleStar(n, d);

    // Calculates the index.
    while (i < d)
      if (Math.gcd(n, i++) === 1 && ++index >= 5) return this.simpleStar(n, d);

    count = index;

    // Calculates the count.
    while (i < n / 2)
      if (Math.gcd(n, i++) === 1 && ++count >= 5) return this.simpleStar(n, d);

    // Adds the great, grand, etc. modifiers.
    // This system is complicated, don't blame me, I didn't make it.
    switch (10 * count + index) {
      case 30:
      case 40:
      case 50:
        return this.star(n, "modifiers/small", options);
      case 52:
        return this.star(n, "modifiers/medial", options);
      case 21:
      case 32:
      case 42:
      case 53:
        return this.star(n, "modifiers/great", options);
      case 43:
      case 54:
        return this.star(n, "modifiers/grand", options);
      default:
        return this.star(n, "", options);
    }
  }

  private simpleStar(n: number, d: number, options: Options = {}): string {
    const newOptions = {
      uppercase: this.nounCapitalization,
      count: options.count,
      gender: options.gender,

      adj0: this.greekPrefix(n, options),
    };

    return this.addAdjective(
      this.greekPrefix(d, options) + Message.get("misc/strophic", options),
      Message.get("grammar/star", newOptions),
      { uppercase: options.uppercase }
    );
  }

  // Helper function for regularPolygonName.
  // Is the one actually giving the names.
  private star(n: number, mod: string, options: Options = {}): string {
    // The base name of the star, e.g. "heptagram".
    const star = Message.get("grammar/star", {
      arg0: this.greekPrefix(n),
      count: options.count,
    });

    // If there's no modifier, returns the name.
    if (!mod) return Message.uppercase(star, options);

    // The base name with the modifier added, e.g. "great heptagram".
    return this.addAdjective(
      Message.get(mod, { gender: options.gender }),
      star,
      {
        uppercase: options.uppercase,
      }
    );
  }

  hypercube(d: number, options: Options = {}): string {
    const newOptions = { ...options };
    newOptions.arg0 = d.toString();

    return Message.get("shape/hypercube", newOptions);
  }

  simplex(d: number, options: Options = {}): string {
    const newOptions = { ...options };
    newOptions.arg0 = d.toString();

    return Message.get("shape/simplex", newOptions);
  }

  cross(d: number, options: Options = {}): string {
    const newOptions = { ...options };
    newOptions.arg0 = d.toString();

    return Message.get("shape/cross", newOptions);
  }
}
