import Options, { Gender } from "../Basic/LanguageOptions";
import BaseLanguage from "./base";
import es_endings from "./es_endings";

export default class es extends BaseLanguage {
  nounCapitalization = false;

  adjBeforeNoun = false;

  genderedLanguage = true;

  code = "es";

  endings = es_endings;

  constructor() {
    super();
  }

  /** The grammatical gender of "n-pyramid". */
  multipyramidGender(n: number): Gender {
    n;
    return Gender.female;
  }

  /** The grammatical gender of "cupola". */
  cupolaGender(): Gender {
    return Gender.female;
  }

  /** The grammatical gender of "cupolaic blend". */
  cupolaicBlendGender(): Gender {
    return Gender.female;
  }

  plain(n: number, dimension: number, options: Options = {}): string {
    return (
      lastVowelTilde(this.greekPrefix(n, options)) +
      this.polytopeEnding(dimension, options)
    );
  }
}

const tildes = { a: "á", e: "é", i: "í", o: "ó", u: "ú" };
const lastVowelTilde = function (prefix: string): string {
  for (let i = prefix.length - 1; i >= 0; i--)
    if (prefix[i] in tildes)
      return prefix.substr(0, i) + tildes[prefix[i]] + prefix.substr(i + 1);

  return prefix;
};
