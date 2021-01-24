import Options from "../Basic/LanguageOptions";
import BaseLanguage from "./base";
import en_endings from "./en_endings";

export default class en extends BaseLanguage {
  nounCapitalization = false;

  adjBeforeNoun = true;

  genderedLanguage = false;

  code = "en";

  endings = en_endings;

  constructor() {
    super();
  }

  polytopeEnding(d: number, options: Options = {}): string {
    options.count ||= 1;

    if (d === 2) return "gon";
    if (d > 31) return d + "-polytope" + (options.count > 1 ? "s" : "");

    return this.element(d - 1, options);
  }
}
