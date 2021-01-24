/**
 * Contains methods to translate polytope names and messages.
 *
 * @packageDocumentation
 * @module Language
 * @category Translation
 */

import * as Message from "./Basic/Message";
import { _setLanguage, _language } from "./Languages/base";

import en from "./Languages/en";
import es from "./Languages/es";
import de from "./Languages/de";

export { _language as Language };

export const setLanguage = function (languageCode: string): void {
  // Don't even bother if this is the same language as is active.
  if (languageCode === _language.code) return;

  Message.setLanguage(languageCode);

  switch (languageCode) {
    case "en":
      _setLanguage(new en());
      break;
    case "es":
      _setLanguage(new es());
      break;
    case "de":
      _setLanguage(new de());
      break;
    default:
      Message.error("invalidLanguage");
  }
};
