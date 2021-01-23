/**
 * Must be called before the translations actually do anything.
 */

import * as Globalize from "globalize";

import "./loadJSON";
import * as Translation from "./Translation";
import * as Adjectives from "./Adjective";

import en from "./Languages/en";
import es from "./Languages/es";
import de from "./Languages/de";

import en_endings from "./Languages/en_endings";
import es_endings from "./Languages/es_endings";

/** Loads the messages used to translate Miratope. */
Globalize.loadMessages({
  // English is used as a fall-back.
  root: en,
  es: es,
  de: de,
  en: {}, // DON'T FILL THIS!
});

/** Loads the endings used in the [[`Adjectives.to`]] method. */
Adjectives.loadEndings({
  en: en_endings,
  es: es_endings,
});

Translation.setLanguage("en");
