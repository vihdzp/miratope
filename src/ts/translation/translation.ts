import * as Globalize from "globalize";
import Ending, { GenderModificationType } from "./ending";
import loadJSON from "./loadJSON";
import loadMessages from "./loadMessages";

export interface LanguageOptions {
  uppercase?: boolean;
  gender?: string;
  count?: number;
}

/**
 * Class for translating words, phrases, or generating names for polytopes in
 * various languages. Serves as a wrapper for
 * [[https://github.com/globalizejs/globalize | Globalize.js]].
 */
export abstract class Translation {
  /** The wrapped Globalize object. */
  private static globalize: Globalize;

  /** A two letter string identifying the language. */
  static language: string;

  /** Specifies whether the target language capitalizes all nouns. */
  static nounCapitalization: boolean;

  /** Specifies whether the target language places adjectives before nouns. */
  static adjBeforeNoun: boolean;

  /** Specifies whether the target language has grammatical gender. */
  static genderedLanguage: boolean;

  /**
   * -, one, two, three, four, five, six, seven, eight, nine,
   * to Greek, back to each language.
   * Used for {@linkcode Translation.greekPrefix}.
   */
  private static readonly _greekUnits = {
    en: [
      "",
      "hen",
      "di",
      "tri",
      "tetra",
      "penta",
      "hexa",
      "hepta",
      "octa",
      "ennea",
    ],
    es: [
      "",
      "hen",
      "di",
      "tri",
      "tetra",
      "penta",
      "hexa",
      "hepta",
      "octa",
      "enea",
    ],
    de: [
      "",
      "hen",
      "di",
      "tri",
      "tetra",
      "penta",
      "hexa",
      "hepta",
      "okto",
      "ennea",
    ],
  };

  /**
   * Makes the first letter of a string lowercase.
   *
   * @returns The transformed string.
   */
  static firstToLower(str: string): string {
    return str.charAt(0).toLowerCase() + str.slice(1);
  }

  /**
   * Makes the first letter of a string uppercase.
   *
   * @returns The transformed string.
   */
  static firstToUpper(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  static setLanguage(lang: string): void {
    Translation.globalize = new Globalize(lang);
    Translation.language = lang;

    //Sets properties about the chosen language.

    //Does the language capitalize all nouns?
    Translation.nounCapitalization =
      Translation.get("meta/nounCapitalization") === "true";

    //Does the language have adjectives generally precede nouns, or viceversa?
    Translation.adjBeforeNoun =
      Translation.get("meta/adjBeforeNoun") === "true";

    //Does the language have grammatical gender?
    Translation.genderedLanguage =
      Translation.get("meta/genderedLanguage") === "true";
  }

  /**
   * Gets the translation of a message from loadMessages.js.
   *
   * @returns The translated message.
   */
  static get(message: string, options: LanguageOptions = {}): string {
    options.count ||= 1;
    options.gender ||= "male";
    const msg: string = Translation.globalize.messageFormatter(message)(
      options
    );

    //Uppercase message.
    if (options.uppercase) return Translation.firstToUpper(msg);
    return msg;
  }

  /**
   * Adds an appropriately declensed adjective to a noun.
   *
   * @param adj The adjective, already declensed.
   * @param noun The noun to which the adjective will be added.
   * @returns The adjective placed before or after the noun, according to the
   * target language.
   */
  static addAdjective(
    adj: string,
    noun: string,
    options: LanguageOptions = {}
  ): string {
    let res: string;

    if (Translation.adjBeforeNoun) res = adj + " " + noun;
    else res = noun + " " + adj;

    if (options.uppercase) return Translation.firstToUpper(res);
    return res;
  }

  /** Converts a number `n` into a greek prefix (or whatever works similarly in
   * the target language). Based on
   * [George Hart's scheme for greek numerical prefixes]{@link
   * https://www.georgehart.com/virtual-polyhedra/greek-prefixes.html}.
   * Works only from 0 to 99999. Defaults to `"n-"`.
   *
   * @param n The number to convert.
   * @param Result modifiers.
   * @returns The number `n` as a greek prefix.
   * @example
   * Translation.setLanguage("en");
   *
   * //"penta"
   * console.log(Translation.greekPrefix(5));
   *
   * //"icositetra"
   * Translation.greekPrefix(24));
   *
   * //"enneacosioctacontahepta"
   * console.log(Translation.greekPrefix(987));
   */
  static greekPrefix(n: number, options: LanguageOptions = {}): string {
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
    const tenThousands = n % 10,
      units = Translation._greekUnits[Translation.language];

    //Myrias
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
        res += units[tenThousands] + Translation.get("greekPrefixes/myria");
        break;
    }

    //Chilias
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
        res += units[thousands] + Translation.get("greekPrefixes/chilia");
        break;
    }

    //Hectos
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
        res += units[hundreds] + Translation.get("greekPrefixes/cosi");
        break;
    }

    //Decas
    switch (tens) {
      case 0:
        res += units[ones];
        break;
      //-deca cases:
      case 1:
        switch (ones) {
          case 0:
            res += Translation.get("greekPrefixes/deca");
            break;
          case 2:
            res += Translation.get("greekPrefixes/dodeca");
            break;
          default:
            res += units[ones] + Translation.get("greekPrefixes/deca");
            break;
        }
        break;
      //icosa- cases:
      case 2:
        if (ones) res += Translation.get("greekPrefixes/icosi") + units[ones];
        else res += Translation.get("greekPrefixes/icosa");
        break;
      //triaconta- cases:
      case 3:
        res += Translation.get("greekPrefixes/triaconta") + units[ones];
        break;
      default:
        res +=
          units[tens] + Translation.get("greekPrefixes/conta") + units[ones];
        break;
    }

    if (options.uppercase) return Translation.firstToUpper(res);
    return res;
  }

  //A plain name for the polytope is simply [greek facet count prefix]
  // + [greek dimension Ending].

  //Possible options:
  /* uppercase */
  static plainName(
    n: number,
    dimension: number,
    options: LanguageOptions = {}
  ): string {
    if (!options.count) options.count = 1;

    let prefix = Translation.greekPrefix(n, options);

    //"Pentágono" en vez de "pentagono."
    if (Translation.language === "es" && dimension === 2)
      prefix = Translation.lastVowelTilde(prefix);

    return prefix + Translation.polytopeEnding(dimension, options);
  }

  /**
   * The name for an d-element, according to
   * [Wendy Krieger's polygloss]{@link http://os2fan2.com/gloss/pglosstu.html}.
   * This is an extension of the scheme Jonathan Bowers uses on
   * [his website]{@link http://www.polytope.net/hedrondude/home.htm}.
   * Works up to d = 30. Defaults to `"d-element"`.<br />
   * &emsp;Most of these are neologisms, so feel free to translate them as you
   * think is appropriate.
   * @param [options={}] Result modifiers.
   * @param [options.uppercase] Capitalizes the first letter of
   * the result.
   * @param [options.count] The number of objects being referred to.
   * @example
   * Translation.setLanguage("en");
   *
   * //face
   * console.log(Translation.elementName(2));
   *
   * //teron
   * console.log(Translation.elementName(4));
   *
   * //icexon
   * console.log(Translation.elementName(26));
   */
  static elementName(n: number, options: LanguageOptions = {}): string {
    if (n > 30)
      return (
        n +
        "-" +
        Translation.get("elements/element", {
          uppercase: Translation.nounCapitalization,
          count: options.count,
        })
      );

    return Translation.get("element/el" + n, options);
  }

  //The ending in the name for a d-polytope.
  static polytopeEnding(d: number, options: LanguageOptions = {}): string {
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
            return Translation.elementName(d - 1, options);
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
            else res = Translation.elementName(d - 1, options);
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
            return Translation.elementName(d - 1, options);
        }

        break;
    }

    if (options.uppercase) return Translation.firstToUpper(res);
    return res;
  }

  //The name for a hypercube in d dimensions.
  static hypercube(d: number): string {
    switch (d) {
      case 0:
        return Translation.get("shape/point");
      case 1:
        return Translation.get("shape/dyad");
      case 2:
        return Translation.get("shape/square");
      case 3:
        return Translation.get("shape/cube");
      case 4:
        return Translation.get("shape/tesseract");
      default:
        const prefix = Translation.greekPrefix(d);
        //Changes the ending of the prefix accordingly.
        switch (Translation.language) {
          case "es":
            if (prefix.charAt(prefix.length - 2) === "c")
              return prefix.substr(0, prefix.length - 2) + "queracto";
            else return prefix.substr(0, prefix.length - 1) + "eract";
          case "de":
            return prefix.substr(0, prefix.length - 1) + "eract";
          case "en":
          default:
            if (prefix.charAt(prefix.length - 2) === "c")
              return prefix.substr(0, prefix.length - 2) + "keract";
            else return prefix.substr(0, prefix.length - 1) + "eract";
        }
    }
  }

  //The name for a cross-polytope in d dimensions.
  static cross(d: number): string {
    switch (d) {
      case 0:
        return Translation.get("shape/point");
      case 1:
        return Translation.get("shape/dyad");
      case 2:
        return Translation.get("shape/square");
      case 3:
        return Translation.plainName(8, 3);
      case 4:
        return Translation.plainName(16, 4);
      default:
        return Translation.greekPrefix(d) + Translation.get("misc/cross");
    }
  }

  //The name for a simplex in d dimensions.
  static simplex(d: number): string {
    switch (d) {
      case 0:
        return Translation.get("shape/point");
      case 1:
        return Translation.get("shape/dyad");
      case 2:
        return Translation.get("shape/triangle");
      case 3:
        return Translation.plainName(4, 3);
      case 4:
        return Translation.plainName(5, 4);
      default:
        return Translation.greekPrefix(d) + Translation.get("misc/plex");
    }
  }

  //Spanish helper function.
  //Adds a tilde to the last vowel of a word.
  //E.g. penta -> pentá
  private static lastVowelTilde = function (str: string) {
    for (let i = str.length - 1; i >= 0; i--)
      switch (str.charAt(i)) {
        case "a":
          return Translation.replaceAt(str, i, "á");
        case "e":
          return Translation.replaceAt(str, i, "é");
        case "i":
          return Translation.replaceAt(str, i, "í");
        case "o":
          return Translation.replaceAt(str, i, "ó");
        case "u":
          return Translation.replaceAt(str, i, "ú");
      }

    throw new Error("No vowel to replace!");
  };

  //https://stackoverflow.com/a/1431113
  private static replaceAt(
    str: string,
    index: number,
    replacement: string
  ): string {
    return (
      str.substr(0, index) +
      replacement +
      str.substr(index + replacement.length)
    );
  }

  //Gives a name for {n / d}.
  //For polygons with up to five non-compound stellations,
  //uses the [small/-/medial/great/grand] n-gram naming scheme.
  //For everything else, uses d-strophic n-gon.

  //Possible options:
  /* uppercase
   * gender
   * count */
  static regularPolygonName(
    n: number,
    d?: number,
    options: LanguageOptions = {}
  ): string {
    if (d === undefined || d === 1) return Translation.plainName(n, 2);
    if (n === 3 && d === 1) return Translation.get("shape/triangle", options);
    if (n === 4 && d === 1) return Translation.get("shape/square", options);

    options.uppercase ||= Translation.nounCapitalization;

    //"Crossed" polygons, as in the crossed pentagrammic antiprism.
    if (d > n / 2)
      return Translation.addAdjective(
        Translation.get("misc/crossed", { gender: options.gender }),
        Translation.regularPolygonName(
          n,
          n - d,
          Translation.lowercaseLanguageOptions(options)
        ),
        { uppercase: options.uppercase }
      );

    //Counts the number of stellation non-compounds.
    let count: number,
      //Gets the index of {n/d} among these.
      index = 0,
      i = 2;

    //Any polygon with more than 42 sides has at least 6 non-compound
    //stellations.
    if (n > 42) return Translation.simpleStarName(n, d);

    //Calculates the index.
    while (i < d)
      if (Math.gcd(n, i++) === 1 && ++index >= 5)
        return Translation.simpleStarName(n, d);

    count = index;

    //Calculates the count.
    while (i < n / 2)
      if (Math.gcd(n, i++) === 1 && ++count >= 5)
        return Translation.simpleStarName(n, d);

    //Adds the great, grand, etc. modifiers.
    //This system is complicated, don't blame me, I didn't make it.
    switch (count * 10 + index) {
      case 30:
      case 40:
      case 50:
        return Translation.starName(n, "modifiers/small", options);
      case 52:
        return Translation.starName(n, "modifiers/medial", options);
      case 21:
      case 32:
      case 42:
      case 53:
        return Translation.starName(n, "modifiers/great", options);
      case 43:
      case 54:
        return Translation.starName(n, "modifiers/grand", options);
      default:
        return Translation.starName(n, "", options);
    }
  }
  /*
		//Adds plural and uppercase.
		//The plurals aren't always like this in the languages below, but they work
		//for all polygon names.
		if(options.count) {
			switch(Translation.language) {
				case ENGLISH:
				case "es":
					res += "s"; break;
				case "de":
					res += "e"; break;
			}
		}
		if(options.uppercase)
			return Translation.firstToUpper(res);
		return res;
	};*/

  //Possible options:
  /* uppercase
   * gender
   * count */
  private static simpleStarName(
    n: number,
    d: number,
    options: LanguageOptions = {}
  ) {
    return Translation.addAdjective(
      Translation.greekPrefix(d) + Translation.get("misc/strophic", options),
      Translation.get("grammar/starName", {
        prefix: Translation.greekPrefix(n),
        count: options.count,
        uppercase: Translation.nounCapitalization,
      } as LanguageOptions),
      { uppercase: options.uppercase }
    );
  }

  //Helper function for regularPolygonName.
  //Is the one actually giving the names.

  //Possible options:
  /* uppercase
   * gender
   * count */
  private static starName(
    n: number,
    mod: string,
    options: LanguageOptions = {}
  ) {
    //The base name of the star, e.g. "heptagram".
    const starName = Translation.get("grammar/starName", {
      prefix: Translation.greekPrefix(n),
      count: options.count,
    } as LanguageOptions);

    //If there's no modifier, returns the name.
    if (!mod) {
      if (options.uppercase) return Translation.firstToUpper(starName);
      return starName;
    }

    //The base name with the modifier added, e.g. "great heptagram".
    return Translation.addAdjective(
      Translation.get(mod, { gender: options.gender }),
      starName,
      { uppercase: options.uppercase }
    );
  }

  //Clones the options and sets the uppercase attribute to false.
  private static lowercaseLanguageOptions = function (
    options: LanguageOptions
  ) {
    const newLanguageOptions = { ...options };
    newLanguageOptions.uppercase = false;
    return newLanguageOptions;
  };

  //Helper function for toAdjective.
  //To be called within the Ending class.
  //Turns everything except for the last word into an adjective and adds the
  //last word unchanged.
  private static toAdjectiveBeforeLastWord = function (
    name: string,
    gender: string
  ) {
    const i = name.lastIndexOf(" ");
    return Translation.toAdjective(name.substr(0, i), gender) + name.substr(i);
  };

  //Helper function for toAdjective.
  //Meant for Spanish.
  //To be called within the Ending class.
  //Turns everything except for the last word into an adjective and adds the
  //last word with its grammatical gender modified accordingly.
  private static toAdjectiveBeforeLastWordGendered = function (
    name: string,
    gender: string
  ) {
    const i = name.lastIndexOf(" ");
    return (
      Translation.toAdjective(name.substr(0, i), gender) +
      name.substr(i, name.length - i - 1) +
      (gender === "male" ? "o" : "a")
    );
  };

  //Helper array for toAdjective.
  //Stores some endings and what to do with them.
  //Sorted by alphabetical order of the strings, backwards!
  //cba is sorted before dcba.
  private static readonly _endings = {
    en: [
      new Ending("da", 0, "ic"), //Rotunda(ic)
      new Ending("ola", 0, "ic"), //Cupola(ic)
      new Ending("ula", 0, "r"), //Stella octangula(r)
      new Ending("na", 0, "l"), //Sphenocorona(l)
      new Ending("mb", 0, "ic"), //Cube honeycomb(ic)
      new Ending("ad", 0, "ic"), //Dyad(ic)
      new Ending("id", 0, "al"), //Pyramid(al)
      new Ending("od", 0, "al"), //Tripod(al)
      new Ending("be", -1, "ic"), //Cub(e/ic)
      new Ending("ce", -1, "ial"), //Essenc(e/ial)
      new Ending("le", -2, "ular"), //Triang(le/ular)
      new Ending("pe", -1, "ic"), //Pentatop(e/ic)
      //new Ending("re", 0, ""), //Square
      new Ending("ure", -1, "al"), //Skilling's figur(e/al)
      new Ending("ll", 0, "ular"), //5-cell(ular)
      new Ending("am", 0, "mic"), //Pentagram(mic)
      new Ending("sm", 0, "atic"), //Triangular prism(atic)
      new Ending("um", -2, "matic"), //Duoteg(um/matic)
      new Ending("ium", -2, "al"), //Gyrobifastigi(um/al)
      new Ending("lum", -2, "ar"), //Disphenocingul(um/ar)
      new Ending("gon", 0, "al"), //Pentagon(al)
      new Ending("ion", -3, "e"), //Square tesselat(ion/e)
      new Ending("lon", -2, "ar"), //Ditel(on/ar)
      new Ending("ron", -2, "ic"), //Pentachor(on/ic)
      new Ending("dron", -2, "al"), //Tetrahedr(on/al)
      //new Ending("ss", 0, ""), // Pentacross
      new Ending("us", -2, "ic"), //Triamb(us/ic)
      //new Ending("nt", 0, ""), // Point
      new Ending("ct", 0, "ic"), //Tesseract(ic)
      new Ending("nt", 0, "al"), //3-element(al)
      new Ending("ex", -2, "icial"), //Simpl(ex/icial)
      new Ending("ix", -1, "cal"), //Square heli(x/cal)
      new Ending("ny", -1, "ical"), //Octagonn(y/ical)
    ],
    es: [
      new Ending("zada", Translation.toAdjectiveBeforeLastWord), //Cúpula pentagrámica cruzada
      new Ending("íada", -4, "iádic", GenderModificationType.es), //D(íada/iádic[o/a])
      new Ending("lda", -2, "ular"), //5-cel(da/ular)
      new Ending("nda", -1, "áic", GenderModificationType.es), //Rotund(a/áic[o/a])
      new Ending("ia", 0, "l"), //Essenc(ia/ial)
      new Ending("la", -5, "upoidal"), //Cúpu(la/idal)
      new Ending("gula", -6, "angular"), //Estrella oct(ángula/angular)
      new Ending("ma", -3, "ámic", GenderModificationType.es), //Pentagr(ama/ámic[o/a])
      new Ending("sma", -1, "átic", GenderModificationType.es), //Prism(a/átic[o/a])
      new Ending("na", 0, "l"), //Esfenocorona(l)
      new Ending("ce", -5, "elicoidal"), //H(élice/elicoidal)
      new Ending("ide", -5, "amidal"), //Pir(ámide/amidal)
      new Ending("oide", -1, "al"), //Disfenoid(e/al)
      new Ending("nde", Translation.toAdjectiveBeforeLastWord), //Heptagrama grande
      new Ending("ng", -12, "l de Skilling"), //Figura( de Skilling/l de Skilling)
      new Ending("ium", -2, "al"), //Girobifastigi(um/al)
      new Ending("ón", -4, "d", GenderModificationType.es), //Tesela(ción/d[o/a])
      new Ending("bo", -3, "úbic", GenderModificationType.es), //C(ubo/úbic[o/a])
      new Ending("co", Translation.toAdjectiveBeforeLastWord), //Heptadecaedro diestrófico
      new Ending("ado", Translation.toAdjectiveBeforeLastWordGendered), //Pentagrama cruzado
      //Icosaedro estrellado
      new Ending("rado", -1, "", GenderModificationType.es), //Cuadrad(o/[o/a])
      new Ending("go", -1, "mátic", GenderModificationType.es), //Teg(o/mátic[o/a])
      new Ending("jo", -3, "icial"), //Simpl(ejo/icial)
      new Ending("io", -1, "al"), //Girobifastigi(o/al)
      new Ending("lo", -1, "ar"), //Ditel(o/ar)
      new Ending("ángulo", -6, "angular"), //Tri(ángulo/angular)
      new Ending("íngulo", -6, "ingular"), //Dispfnoc(íngulo/ingular)
      new Ending("ano", Translation.toAdjectiveBeforeLastWord), //Tridecagrama mediano
      new Ending("ono", -5, "agonal"), //Pent(ágono/agonal)
      new Ending("po", -3, "ópic", GenderModificationType.es), //Pentat(opo/ópic[o/a])
      new Ending("dro", -1, "al"), //Tetraed(ro/al)
      new Ending("oro", -3, "órico"), //Pentac(oro/órico)
      new Ending("to", -4, "áctic", GenderModificationType.es), //Teseract(o/ic[o/a])
      new Ending("nto", -1, "al"), //3-element(o/al)
      new Ending("unto", 1, "ual"), //Punt(o/ual)
      new Ending("ño", Translation.toAdjectiveBeforeLastWord), //Hendecagrama pequeño
      new Ending("or", Translation.toAdjectiveBeforeLastWord), //Hendecagrama mayor
      new Ending("is", Translation.toAdjectiveBeforeLastWord), //Dodecaedral pentakis
      new Ending("ex", -2, "icial"), //Simpl(ex/icial)
      new Ending("uz", 0, "ad", GenderModificationType.es), //Pentacruz(ad[o/a])
      new Ending("ié", -2, "odal"), //Trip(ié/odal)
    ],
  };

  //Converts a polytope name into an adjective,
  //possibly depending on the gender of the substantive it modifies
  //(e.g. in Spanish or German).
  //E.g. cube -> cubical, sphenocorona -> sphenocoronal, etc.
  //If there's an ending match, the transformation done
  //will correspond to the longest match.
  //If no ending matches, the default is to leave the name as is.
  static toAdjective(name: string, gender: string): string {
    let endingIndx: number;
    const endings = Translation._endings[Translation.language];

    if (Translation.adjBeforeNoun) {
      endingIndx = Translation.findEnding(name, endings);

      if (endingIndx !== -1)
        return endings[endingIndx].changeEnding(name, gender);
      return name;
    } else {
      const indexOfSpace = name.indexOf(" "),
        firstWord = indexOfSpace === -1 ? name : name.substr(0, indexOfSpace),
        restOfName = indexOfSpace === -1 ? "" : name.substr(indexOfSpace);

      endingIndx = Translation.findEnding(firstWord, endings);

      if (endingIndx !== -1)
        return endings[endingIndx].changeEnding(firstWord, gender) + restOfName;
      return name;
    }
  }

  //Helper function for toAdjective.
  //Finds the ending that fits a string among a list of endings.
  //Returns its index. -1 if no ending fits.
  //Uses a modified binary search.
  private static findEnding = function (name: string, endings: Ending[]) {
    let first: number,
      mid: number,
      last: number,
      firstMatch = 0,
      lastMatch: number = endings.length - 1,
      k = 1, //The number of characters we're checking.
      backup = -1;

    //Adds one letter of name at a time.
    //Searches for the least and greatest elements of _endings
    //that are compatible with the observed letters.
    while (lastMatch !== firstMatch) {
      //If the first (shorter) possibility fits, and no other (longer one) does,
      //we'll use that one.
      if (endings[firstMatch].string.length < k) backup = firstMatch;
      else backup = -1;

      //Finds firstMatch.
      first = firstMatch;
      last = lastMatch;
      while (last - first > 1) {
        mid = Math.floor((first + last) / 2);
        if (Ending.compare(name, endings[mid].string, k) <= 0) last = mid;
        else first = mid;
      }

      if (Ending.compare(name, endings[first].string, k) === 0)
        firstMatch = first;
      else firstMatch = last;

      //Finds lastMatch.
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

    //If at some point, only one match fits,
    //we check if it fits the whole string.
    //Note: we haven't checked whether the (k - 1)th character is correct.
    const endingStr = endings[firstMatch].string;
    for (k--; k <= endingStr.length; k++) {
      //No match.
      const nameChar = name.charAt(name.length - k).toLowerCase();
      const endChar = endingStr.charAt(endingStr.length - k).toLowerCase();
      if (nameChar !== endChar) return backup;
    }

    //If the match does fit, we return it.
    return firstMatch;
  };
}

//Load JSON.
loadJSON();
loadMessages();
Translation.setLanguage("en");
