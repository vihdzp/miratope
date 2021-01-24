/**
 * Contains methods to translate polytope names and messages.
 *
 * @packageDocumentation
 * @module Naming
 * @category Translation
 */

import * as Message from "./Basic/Message";
import { _setLanguage, _language } from "./Languages/base";

import en from "./Languages/en";
import es from "./Languages/es";

export { _language as Language };

export const setLanguage = function (languageCode: string): void {
  Message.setLanguage(languageCode);

  switch (languageCode) {
    case "en":
      _setLanguage(new en());
      break;
    case "es":
      _setLanguage(new es());
      break;
  }
};
