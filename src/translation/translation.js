"use strict";
//Class for translating words, phrases, or generating names for polytopes in various languages.

var GlobalizeLang = Globalize("en");
var Translation = {};

Translation.firstToLower = function(str) {
	return str.charAt(0).toLowerCase() + str.slice(1);
};

Translation.firstToUpper = function(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
};

Translation.setLanguage = function(lang) {
	GlobalizeLang = Globalize(lang);
};
