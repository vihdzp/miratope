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
}
