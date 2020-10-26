"use strict";
//Class for translating words, phrases, or generating names for polytopes in various languages.

var Translation = {language: "en"};
Translation._globalize = Globalize("en");

Translation.firstToLower = function(str) {
	return str.charAt(0).toLowerCase() + str.slice(1);
};

Translation.firstToUpper = function(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
};

Translation.setLanguage = function(lang) {
	Translation._globalize = Globalize(lang);
	Translation.language = lang;
};

Translation.get = function(message, params) {
	if(params.uppercase)
		return Translation.firstToUpper(Translation._globalize.messageFormatter(message)(params));
	return Translation._globalize.messageFormatter(message)(params);
};
