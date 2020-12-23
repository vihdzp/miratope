"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Translation = void 0;
const Globalize = require("globalize");
const ending_1 = require("./ending");
const loadJSON_1 = require("./loadJSON");
const loadMessages_1 = require("./loadMessages");
/**
 * Class for translating words, phrases, or generating names for polytopes in
 * various languages.
 * @namespace Translation
 */
class Translation {
    static firstToLower(str) {
        return str.charAt(0).toLowerCase() + str.slice(1);
    }
    ;
    static firstToUpper(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    ;
    static setLanguage(lang) {
        Translation._globalize = new Globalize(lang);
        Translation.language = lang;
        //Sets properties about the chosen language.
        //Does the language capitalize all nouns?
        Translation.nounCapitalization = Translation.get("meta/nounCapitalization") === "true";
        //Does the language have adjectives generally precede nouns, or viceversa?
        Translation.adjBeforeNoun = Translation.get("meta/adjBeforeNoun") === "true";
        //Does the language have grammatical gender?
        Translation.genderedLanguage = Translation.get("meta/genderedLanguage") === "true";
    }
    ;
    //Gets the translation of a message from loadMessages.js.
    static get(message, options = {}) {
        options.count || (options.count = 1);
        options.gender || (options.gender = "male");
        let msg = Translation._globalize.messageFormatter(message)(options);
        //Uppercase message.
        if (options.uppercase)
            return Translation.firstToUpper(msg);
        return msg;
    }
    ;
    /**
     * Adds an appropriately declensed adjective to a noun.
     * @param {string} adj The adjective, already declensed.
     * @param {string} noun The noun to which the adjective will be added.
     * @param {Object} [options={}] Result modifiers.
     * @param {boolean} [options.uppercase] Capitalizes the first letter of
     * the result.
     * @returns The adjective placed before or after the noun, according to the
     * target language.
     */
    static addAdjective(adj, noun, options = {}) {
        let res;
        if (Translation.adjBeforeNoun)
            res = adj + " " + noun;
        else
            res = noun + " " + adj;
        if (options.uppercase)
            return Translation.firstToUpper(res);
        return res;
    }
    ;
    /** Converts a number `n` into a greek prefix (or whatever works similarly in
     * the target language). Based on [George Hart's scheme for greek numerical prefixes]{@link https://www.georgehart.com/virtual-polyhedra/greek-prefixes.html}.
     * Works only from 0 to 99999. Defaults to `"n-"`.
     * @param {number} n The number to convert.
     * @param {Object} [options={}] Result modifiers.
     * @param {boolean} [options.uppercase] Capitalizes the first letter of
     * the result.
     * @returns {string} The number `n` as a greek prefix.
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
    static greekPrefix(n, options = {}) {
        if (n === 0)
            return Translation.get("greekPrefixes/nulli", options);
        if (n === 1)
            return Translation.get("greekPrefixes/mono", options);
        if (n >= 100000)
            return n + "-";
        var res = "";
        var ones = n % 10;
        n = Math.floor(n / 10);
        var tens = n % 10;
        n = Math.floor(n / 10);
        var hundreds = n % 10;
        n = Math.floor(n / 10);
        var thousands = n % 10;
        n = Math.floor(n / 10);
        var tenThousands = n % 10, units = Translation._greekUnits[Translation.language];
        //Myrias
        switch (tenThousands) {
            case 0:
                break;
            case 1:
                res += Translation.get("greekPrefixes/myria");
                break;
            case 2:
                res += Translation.get("greekPrefixes/dis") + Translation.get("greekPrefixes/myria");
                break;
            case 3:
                res += Translation.get("greekPrefixes/tris") + Translation.get("greekPrefixes/myria");
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
                res += Translation.get("greekPrefixes/dis") + Translation.get("greekPrefixes/chilia");
                break;
            case 3:
                res += Translation.get("greekPrefixes/tris") + Translation.get("greekPrefixes/chilia");
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
                if (!tens && !ones)
                    res += Translation.get("greekPrefixes/hecto");
                else
                    res += Translation.get("greekPrefixes/hecaton");
                break;
            case 2:
                res += Translation.get("greekPrefixes/dia") + Translation.get("greekPrefixes/cosi");
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
                if (ones)
                    res += Translation.get("greekPrefixes/icosi") + units[ones];
                else
                    res += Translation.get("greekPrefixes/icosa");
                break;
            //triaconta- cases:
            case 3:
                res += Translation.get("greekPrefixes/triaconta") + units[ones];
                break;
            default:
                res += units[tens] + Translation.get("greekPrefixes/conta") + units[ones];
                break;
        }
        if (options.uppercase)
            return Translation.firstToUpper(res);
        return res;
    }
    ;
    //A plain name for the polytope is simply [greek facet count prefix] [greek dimension Ending].
    //Possible options:
    /* uppercase */
    static plainName(n, dimension, options = {}) {
        if (!options.count)
            options.count = 1;
        var prefix = Translation.greekPrefix(n, options);
        //"Pentágono" en vez de "pentagono."
        if (Translation.language === "es" && dimension === 2)
            prefix = Translation._lastVowelTilde(prefix);
        return prefix + Translation.polytopeEnding(dimension, options);
    }
    ;
    /**
     * The name for an d-element, according to
     * [Wendy Krieger's polygloss]{@link http://os2fan2.com/gloss/pglosstu.html}.
     * This is an extension of the scheme Jonathan Bowers uses on
     * [his website]{@link http://www.polytope.net/hedrondude/home.htm}.
     * Works up to d = 30. Defaults to `"d-element"`.<br />
     * &emsp;Most of these are neologisms, so feel free to translate them as you think
     * is appropriate.
     * @param {Object} [options={}] Result modifiers.
     * @param {boolean} [options.uppercase] Capitalizes the first letter of
     * the result.
     * @param {number} [options.count] The number of objects being referred to.
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
    static elementName(n, options = {}) {
        if (n > 30)
            return n + "-" + Translation.get("elements/element", {
                uppercase: Translation.nounCapitalization,
                count: options.count
            });
        return Translation.get("element/el" + n, options);
    }
    ;
    //The ending in the name for a d-polytope.
    static polytopeEnding(d, options = {}) {
        if (!options.count)
            options.count = 1;
        var res = "";
        switch (Translation.language) {
            case "en":
                switch (d) {
                    case 1:
                        if (options.count > 1)
                            res = "tela";
                        else
                            res = "telon";
                        break;
                    case 2:
                        if (options.count > 1)
                            res = "gons";
                        else
                            res = "gon";
                        break;
                    case 3:
                        if (options.count > 1)
                            res = "hedra";
                        else
                            res = "hedron";
                        break;
                    case 4:
                        if (options.count > 1)
                            res = "chora";
                        else
                            res = "choron";
                        break;
                    default:
                        if (d > 31)
                            return d + "-polytope" + (options.count > 1 ? "s" : "");
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
                        if (d > 20)
                            res = d + "-politopo";
                        else
                            res = Translation.elementName(d - 1, options);
                        break;
                }
                if (options.count >= 2)
                    res += "s";
                break;
            case "de":
                switch (d) {
                    case 1:
                        if (options.count)
                            res = "tela";
                        else
                            res = "telon";
                        break;
                    case 2:
                        if (options.count)
                            res = "gone";
                        else
                            res = "gon";
                        break;
                    case 3:
                        res = "eder";
                        break;
                    case 4:
                        if (options.count)
                            res = "chora";
                        else
                            res = "choron";
                        break;
                    default:
                        if (d > 20)
                            return d + "-polytop" + (options.count ? "en" : "");
                        return Translation.elementName(d - 1, options);
                }
                break;
        }
        if (options.uppercase)
            return Translation.firstToUpper(res);
        return res;
    }
    ;
    //The name for a hypercube in d dimensions.
    static hypercube(d) {
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
                var prefix = Translation.greekPrefix(d);
                //Changes the ending of the prefix accordingly.
                switch (Translation.language) {
                    case "es":
                        if (prefix.charAt(prefix.length - 2) == 'c')
                            return prefix.substr(0, prefix.length - 2) + "queracto";
                        else
                            return prefix.substr(0, prefix.length - 1) + "eract";
                    case "de":
                        return prefix.substr(0, prefix.length - 1) + "eract";
                    case "en":
                    default:
                        if (prefix.charAt(prefix.length - 2) == 'c')
                            return prefix.substr(0, prefix.length - 2) + "keract";
                        else
                            return prefix.substr(0, prefix.length - 1) + "eract";
                }
        }
    }
    ;
    //The name for a cross-polytope in d dimensions.
    static cross(d) {
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
    ;
    //The name for a simplex in d dimensions.
    static simplex(d) {
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
    ;
    //https://stackoverflow.com/a/1431113
    static _replaceAt(str, index, replacement) {
        return str.substr(0, index) + replacement + str.substr(index + replacement.length);
    }
    ;
    //Gives a name for {n / d}.
    //For polygons with up to five non-compound stellations, uses the [small/-/medial/great/grand] n-gram naming scheme.
    //For everything else, uses d-strophic n-gon.
    //Possible options:
    /* uppercase
     * gender
     * count */
    static regularPolygonName(n, d, options = {}) {
        if (d === undefined || d === 1)
            return Translation.plainName(n, 2);
        if (n === 3 && d === 1)
            return Translation.get("shape/triangle", options);
        if (n === 4 && d === 1)
            return Translation.get("shape/square", options);
        options.uppercase || (options.uppercase = Translation.nounCapitalization);
        //"Crossed" polygons, as in the crossed pentagrammic antiprism.
        if (d > n / 2)
            return Translation.addAdjective(Translation.get("misc/crossed", { gender: options.gender }), Translation.regularPolygonName(n, n - d, Translation._lowercaseLanguageOptions(options)), { uppercase: options.uppercase });
        //Counts the number of stellation non-compounds.
        let count, 
        //Gets the index of {n/d} among these.
        index = 0, i = 2;
        //Any polygon with more than 42 sides has at least 6 non-compound stellations.
        if (n > 42)
            return Translation._simpleStarName(n, d);
        //Calculates the index.
        while (i < d)
            if (Math.gcd(n, i++) === 1 && ++index >= 5)
                return Translation._simpleStarName(n, d);
        count = index;
        //Calculates the count.
        while (i < n / 2)
            if (Math.gcd(n, i++) === 1 && ++count >= 5)
                return Translation._simpleStarName(n, d);
        //Adds the great, grand, etc. modifiers.
        //This system is complicated, don't blame me, I didn't make it.
        switch (count * 10 + index) {
            case 30:
            case 40:
            case 50:
                return Translation._starName(n, "modifiers/small", options);
            case 52:
                return Translation._starName(n, "modifiers/medial", options);
            case 21:
            case 32:
            case 42:
            case 53:
                return Translation._starName(n, "modifiers/great", options);
            case 43:
            case 54:
                return Translation._starName(n, "modifiers/grand", options);
            default:
                return Translation._starName(n, "", options);
        }
    }
    ;
    /*
      //Adds plural and uppercase.
      //The plurals aren't always like this in the languages below, but they work for all polygon names.
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
    static _simpleStarName(n, d, options = {}) {
        return Translation.addAdjective(Translation.greekPrefix(d) + Translation.get("misc/strophic", options), Translation.get("grammar/starName", {
            prefix: Translation.greekPrefix(n),
            count: options.count,
            uppercase: Translation.nounCapitalization
        }), { uppercase: options.uppercase });
    }
    ;
    //Helper function for regularPolygonName.
    //Is the one actually giving the names.
    //Possible options:
    /* uppercase
     * gender
     * count */
    static _starName(n, mod, options = {}) {
        //The base name of the star, e.g. "heptagram".
        var starName = Translation.get("grammar/starName", {
            prefix: Translation.greekPrefix(n),
            count: options.count,
        });
        //If there's no modifier, returns the name.
        if (!mod) {
            if (options.uppercase)
                return Translation.firstToUpper(starName);
            return starName;
        }
        //The base name with the modifier added, e.g. "great heptagram".
        return Translation.addAdjective(Translation.get(mod, { gender: options.gender }), starName, { uppercase: options.uppercase });
    }
    ;
    //Converts a polytope name into an adjective, possibly depending on the gender of the substantive it modifies (e.g. in Spanish or German).
    //E.g. cube -> cubical, sphenocorona -> sphenocoronal, etc.
    //If there's an ending match, the transformation done will correspond to the longest match.
    //If no ending matches, the default is to leave the name as is.
    static toAdjective(name, gender) {
        let endingIndx, endings = Translation._endings[Translation.language];
        if (Translation.adjBeforeNoun) {
            endingIndx = Translation._findEnding(name, endings);
            if (endingIndx !== -1)
                return endings[endingIndx].changeEnding(name, gender);
            return name;
        }
        else {
            var indexOfSpace = name.indexOf(' '), firstWord = indexOfSpace === -1 ? name : name.substr(0, indexOfSpace), restOfName = indexOfSpace === -1 ? "" : name.substr(indexOfSpace);
            endingIndx = Translation._findEnding(firstWord, endings);
            if (endingIndx !== -1)
                return endings[endingIndx].changeEnding(firstWord, gender) + restOfName;
            return name;
        }
    }
    ;
}
exports.Translation = Translation;
/**
 * -, one, two, three, four, five, six, seven, eight, nine,
 * to Greek, back to each language.
 * Used for {@linkcode Translation.greekPrefix}.
 * @private
 * @type {Object}
 */
Translation._greekUnits = {
    en: ["", "hen", "di", "tri", "tetra", "penta", "hexa", "hepta", "octa", "ennea"],
    es: ["", "hen", "di", "tri", "tetra", "penta", "hexa", "hepta", "octa", "enea"],
    de: ["", "hen", "di", "tri", "tetra", "penta", "hexa", "hepta", "okto", "ennea"]
};
//Spanish helper function.
//Adds a tilde to the last vowel of a word.
//E.g. penta -> pentá
Translation._lastVowelTilde = function (str) {
    for (var i = str.length - 1; i >= 0; i--)
        switch (str.charAt(i)) {
            case "a":
                return Translation._replaceAt(str, i, "á");
            case "e":
                return Translation._replaceAt(str, i, "é");
            case "i":
                return Translation._replaceAt(str, i, "í");
            case "o":
                return Translation._replaceAt(str, i, "ó");
            case "u":
                return Translation._replaceAt(str, i, "ú");
        }
    throw new Error("No vowel to replace!");
};
//Clones the options and sets the uppercase attribute to false.
Translation._lowercaseLanguageOptions = function (options) {
    let newLanguageOptions = Object.assign({}, options);
    newLanguageOptions.uppercase = false;
    return newLanguageOptions;
};
//Helper function for toAdjective.
//To be called within the Ending class.
//Turns everything except for the last word into an adjective and adds the last word unchanged.
Translation._toAdjectiveBeforeLastWord = function (name, gender) {
    let i = name.lastIndexOf(" ");
    return Translation.toAdjective(name.substr(0, i), gender) + name.substr(i);
};
//Helper function for toAdjective.
//Meant for Spanish.
//To be called within the Ending class.
//Turns everything except for the last word into an adjective and adds the last word with its grammatical gender modified accordingly.
Translation._toAdjectiveBeforeLastWordGendered = function (name, gender) {
    let i = name.lastIndexOf(" ");
    return Translation.toAdjective(name.substr(0, i), gender) + name.substr(i, name.length - i - 1) + (gender === "male" ? "o" : "a");
};
//Helper array for toAdjective.
//Stores some endings and what to do with them.
//Sorted by alphabetical order of the strings, backwards!
//cba is sorted before dcba.
Translation._endings = {
    en: [
        new ending_1.Ending("da", 0, "ic"),
        new ending_1.Ending("ola", 0, "ic"),
        new ending_1.Ending("ula", 0, "r"),
        new ending_1.Ending("na", 0, "l"),
        new ending_1.Ending("mb", 0, "ic"),
        new ending_1.Ending("ad", 0, "ic"),
        new ending_1.Ending("id", 0, "al"),
        new ending_1.Ending("od", 0, "al"),
        new ending_1.Ending("be", -1, "ic"),
        new ending_1.Ending("ce", -1, "ial"),
        new ending_1.Ending("le", -2, "ular"),
        new ending_1.Ending("pe", -1, "ic"),
        //new Ending("re", 0, ""), //Square
        new ending_1.Ending("ure", -1, "al"),
        new ending_1.Ending("ll", 0, "ular"),
        new ending_1.Ending("am", 0, "mic"),
        new ending_1.Ending("sm", 0, "atic"),
        new ending_1.Ending("um", -2, "matic"),
        new ending_1.Ending("ium", -2, "al"),
        new ending_1.Ending("lum", -2, "ar"),
        new ending_1.Ending("gon", 0, "al"),
        new ending_1.Ending("ion", -3, "e"),
        new ending_1.Ending("lon", -2, "ar"),
        new ending_1.Ending("ron", -2, "ic"),
        new ending_1.Ending("dron", -2, "al"),
        //new Ending("ss", 0, ""), // Pentacross
        new ending_1.Ending("us", -2, "ic"),
        //new Ending("nt", 0, ""), // Point
        new ending_1.Ending("ct", 0, "ic"),
        new ending_1.Ending("nt", 0, "al"),
        new ending_1.Ending("ex", -2, "icial"),
        new ending_1.Ending("ix", -1, "cal"),
        new ending_1.Ending("ny", -1, "ical") //Octagonn(y/ical)
    ],
    es: [
        new ending_1.Ending("zada", Translation._toAdjectiveBeforeLastWord),
        new ending_1.Ending("íada", -4, "iádic", ending_1.GenderModificationType.es),
        new ending_1.Ending("lda", -2, "ular"),
        new ending_1.Ending("nda", -1, "áic", ending_1.GenderModificationType.es),
        new ending_1.Ending("ia", 0, "l"),
        new ending_1.Ending("la", -5, "upoidal"),
        new ending_1.Ending("gula", -6, "angular"),
        new ending_1.Ending("ma", -3, "ámic", ending_1.GenderModificationType.es),
        new ending_1.Ending("sma", -1, "átic", ending_1.GenderModificationType.es),
        new ending_1.Ending("na", 0, "l"),
        new ending_1.Ending("ce", -5, "elicoidal"),
        new ending_1.Ending("ide", -5, "amidal"),
        new ending_1.Ending("oide", -1, "al"),
        new ending_1.Ending("nde", Translation._toAdjectiveBeforeLastWord),
        new ending_1.Ending("ng", -12, "l de Skilling"),
        new ending_1.Ending("ium", -2, "al"),
        new ending_1.Ending("ón", -4, "d", ending_1.GenderModificationType.es),
        new ending_1.Ending("bo", -3, "úbic", ending_1.GenderModificationType.es),
        new ending_1.Ending("co", Translation._toAdjectiveBeforeLastWord),
        new ending_1.Ending("ado", Translation._toAdjectiveBeforeLastWordGendered),
        //Icosaedro estrellado
        new ending_1.Ending("rado", -1, "", ending_1.GenderModificationType.es),
        new ending_1.Ending("go", -1, "mátic", ending_1.GenderModificationType.es),
        new ending_1.Ending("jo", -3, "icial"),
        new ending_1.Ending("io", -1, "al"),
        new ending_1.Ending("lo", -1, "ar"),
        new ending_1.Ending("ángulo", -6, "angular"),
        new ending_1.Ending("íngulo", -6, "ingular"),
        new ending_1.Ending("ano", Translation._toAdjectiveBeforeLastWord),
        new ending_1.Ending("ono", -5, "agonal"),
        new ending_1.Ending("po", -3, "ópic", ending_1.GenderModificationType.es),
        new ending_1.Ending("dro", -1, "al"),
        new ending_1.Ending("oro", -3, "órico"),
        new ending_1.Ending("to", -4, "áctic", ending_1.GenderModificationType.es),
        new ending_1.Ending("nto", -1, "al"),
        new ending_1.Ending("unto", 1, "ual"),
        new ending_1.Ending("ño", Translation._toAdjectiveBeforeLastWord),
        new ending_1.Ending("or", Translation._toAdjectiveBeforeLastWord),
        new ending_1.Ending("is", Translation._toAdjectiveBeforeLastWord),
        new ending_1.Ending("ex", -2, "icial"),
        new ending_1.Ending("uz", 0, "ad", ending_1.GenderModificationType.es),
        new ending_1.Ending("ié", -2, "odal") //Trip(ié/odal)
    ]
};
//Helper function for toAdjective.
//Finds the ending that fits a string among a list of endings.
//Returns its index. -1 if no ending fits.
//Uses a modified binary search.
Translation._findEnding = function (name, endings) {
    let first, mid, last, firstMatch = 0, lastMatch = endings.length - 1, k = 1, //The number of characters we're checking.
    backup = -1;
    let endingStr;
    //Adds one letter of name at a time.
    //Searches for the least and greatest elements of _endings that are compatible with the observed letters.
    while (lastMatch !== firstMatch) {
        //If the first (shorter) possibility fits, and no other (longer one) does, we'll use that one.
        if (endings[firstMatch].string.length < k)
            backup = firstMatch;
        else
            backup = -1;
        //Finds firstMatch.
        first = firstMatch;
        last = lastMatch;
        while (last - first > 1) {
            mid = Math.floor((first + last) / 2);
            if (ending_1.Ending.compare(name, endings[mid].string, k) <= 0)
                last = mid;
            else
                first = mid;
        }
        if (ending_1.Ending.compare(name, endings[first].string, k) === 0)
            firstMatch = first;
        else
            firstMatch = last;
        //Finds lastMatch.
        first = firstMatch;
        last = lastMatch;
        while (last - first > 1) {
            mid = Math.floor((first + last) / 2);
            if (ending_1.Ending.compare(name, endings[mid].string, k) < 0)
                last = mid;
            else
                first = mid;
        }
        if (ending_1.Ending.compare(name, endings[last].string, k) === 0)
            lastMatch = last;
        else
            lastMatch = first;
        k++;
    }
    //If at some point, only one match fits, we check if it fits the whole string.
    //Note: we haven't checked if the (k - 1)th character is correct.
    endingStr = endings[firstMatch].string;
    for (k--; k <= endingStr.length; k++)
        //No match.
        if (name.charAt(name.length - k).toLowerCase() !== endingStr.charAt(endingStr.length - k).toLowerCase())
            return backup;
    //If the match does fit, we return it.
    return firstMatch;
};
//Load JSON.
loadJSON_1.loadJSON();
loadMessages_1.loadMessages();
Translation.setLanguage("en");
//# sourceMappingURL=translation.js.map