/**
 * Exposes and initializes the language object.
 *
 * @packageDocumentation
 * @module Language
 * @category Translation
 */

import * as Globalize from "globalize";
import * as Message from "./Basic/Message";
import { _setLanguage, _language } from "./Languages/base";

import en from "./Languages/en";
import es from "./Languages/es";
import de from "./Languages/de";

import en_messages from "./Languages/en_messages";
import es_messages from "./Languages/es_messages";
import de_messages from "./Languages/de_messages";

export { _language as Language };

/**
 * Changes Miratope's language.
 *
 * @param languageCode The code of the new language.
 * @example
 * // Sets language to English.
 * setLanguage("en");
 *
 * // "triangle"
 * console.log(Build.regularPolygon(3).getName());
 *
 * // Sets language to Spanish.
 * setLanguage("es");
 *
 * // "triángulo"
 * console.log(Build.regularPolygon(3).getName());
 */
export const setLanguage = function (languageCode: string): void {
  // Don't even bother if this is the same language as is active.
  if (_language && languageCode === _language.code) return;

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

  Message.setLanguage(languageCode);
  localStorage.setItem("lang", languageCode);
};

/** Loads the messages used to translate Miratope. */
Globalize.loadMessages({
  // English is used as a fall-back.
  root: en_messages,
  es: es_messages,
  de: de_messages,
  en: {}, // DON'T FILL THIS!
});

// Loads the default language. If there's none, loads English.
const lang = localStorage.getItem("lang");
if (lang !== null) setLanguage(lang);
else setLanguage("en");
