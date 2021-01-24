/**
 * Must be called before the translations actually do anything.
 */

import * as Globalize from "globalize";
import { setLanguage } from "./Language";

import en_messages from "./Languages/en_messages";
import es_messages from "./Languages/es_messages";
import de_messages from "./Languages/de_messages";

/** Loads the messages used to translate Miratope. */
Globalize.loadMessages({
  // English is used as a fall-back.
  root: en_messages,
  es: es_messages,
  de: de_messages,
  en: {}, // DON'T FILL THIS!
});

setLanguage("en");
