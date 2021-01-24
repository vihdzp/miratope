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
}
