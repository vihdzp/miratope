import BaseLanguage from "./base";

export default class de extends BaseLanguage {
  nounCapitalization = true;

  adjBeforeNoun = true;

  genderedLanguage = true;

  code = "de";

  endings = [];

  constructor() {
    super();
  }
}
