"use strict";

/**
 * Class for translating words, phrases, or generating names for polytopes in
 * various languages.
 * @namespace Translation
 */
var Translation = {};

Translation.firstToLower = function(str) {
	return str.charAt(0).toLowerCase() + str.slice(1);
};

Translation.firstToUpper = function(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
};

Translation.setLanguage = function(lang) {
	Translation._globalize = Globalize(lang);
	Translation.language = lang;

	//Sets properties about the chosen language.

	//Does the language capitalize all nouns?
	Translation.nounCapitalization = Translation.get("meta/nounCapitalization") === "true";

	//Does the language have adjectives generally precede nouns, or viceversa?
	Translation.adjBeforeNoun = Translation.get("meta/adjBeforeNoun") === "true";

	//Does the language have grammatical gender?
	Translation.genderedLanguage = Translation.get("meta/genderedLanguage") === "true";
};

//Gets the translation of a message from loadMessages.js.
Translation.get = function(message, params = {}) {
	//Sets default parameters.
	if(!params.count)
		params.count = 1;
	if(!params.gender)
		params.gender = "male";

	var msg = Translation._globalize.messageFormatter(message)(params);

	//Uppercase message.
	if(params.uppercase)
		return Translation.firstToUpper(msg);
	return msg;
};

/**
 * Adds an appropriately declensed adjective to a noun.
 * @param {string} adj The adjective, already declensed.
 * @param {string} noun The noun to which the adjective will be added.
 * @param {Object} [options={}] Result modifiers.
 * @param {boolean} [options.uppercase] Capitalizes the first letter of
 * the result.
 * @returns The adjective placed before or after the noun, according to the
 * target language.
 */
Translation.addAdjective = function(adj, noun, options = {}) {
	var res;

	if(Translation.adjBeforeNoun)
		res = adj + " " + noun;
	else
		res = noun + " " + adj;

	if(options.uppercase)
		return Translation.firstToUpper(res);
	return res;
};
