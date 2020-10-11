"use strict";
//Class for translating words, phrases, or generating names for polytopes in various languages.

var Translation = {};
//Languages.
const ENGLISH = 0;
const SPANISH = 1;
const GERMAN = 2;

//These must be powers of 2:
const PLURAL = 1;
const UPPERCASE = 2;

//Grammatical gender.
const MALE = 0;
const FEMALE = 1;
const NEUTER = 2;

//Polygram modifiers.
const NONE = -1;
const SMALL = 0;
const MEDIAL = 1;
const GREAT = 2;
const GRAND = 3;

var LANGUAGE = ENGLISH;

//The TRANSLATIONS object contains Translation of all words or messages not covered by other functions.
//Each entry consists in an array of Translation, in the order of the constants ENGLISH, SPANISH, ...
//An entry with a capital P at the end represents the plural.
//I don't know if I should remove the plurals (maybe I should remove options altogether)...
//I'll do so if I don't see a use for them.
var TRANSLATIONS = {
	polytope: ["polytope", "politopo", "Polytop"],
	polytopeP: ["polytopes", "politopos", "Polytope"],
	dyad: ["dyad", "díada", "Dyade"],
	dyadP: ["dyads", "díadas", "Dyaden"],
	prism: ["prism", "prisma", "Prisma"],
	prismP: ["prisms", "prismas", "Prismen"],
	pyramid: ["pyramid", "pirámide", "Pyramide"],
	pyramidP: ["pyramids", "pirámides", "Pyramiden"],
	rectangle: ["rectangle", "rectángulo", "Rechteck"],
	rectangleP: ["rectangles", "rectángulos", "Rechtecke"],
	component: ["component", "componente"],
	componentP: ["components", "componentes"],
	compound: ["compound", "compuesto", "Verbund"],
	compoundP: ["compounds", "compuestos", "Verbunde"],
	triangle: ["triangle", "triángulo", "Dreieck"],
	triangleP: ["triangles", "triángulos", "Dreiecke"],
	square: ["square", "cuadrado", "Quadrat"],
	squareP: ["squares", "cuadrados", "Quadrate"],
	antiprism: ["antiprism", "antiprisma", "Antiprisma"],
	antiprismP: ["antiprisms", "antiprismas", "Antiprismen"],
	cupola: ["cupola", "cúpula", "Kuppel"],
	cupolaP: ["cupolae", "cúpulas", "Kuppeln"],
	cuploid: ["cuploid", "cuploide"],
	cuploidP: ["cuploids", "cuploides"],
	cupolaicBlend: ["cupolaic blend", "mezcla cupular"],
	cupolaicBlends: ["cupolaic blends", "mezclas cupulares"],
	invalidNumber: ["Invalid number!", "¡Número inválido!", "Ungültige Zahl!"],
	invalidFile: ["Invalid file!", "¡Archivo inválido!", "Ungültige Datei!"],
	unexpectedEOF: ["Unexpected end of file!", "¡Fin del archivo no esperado!", "Unerwartetes Ende der Datei!"],
	line: ["line", "línea", "Zeile"],
	column: ["column", "columna", "Spalte"],
	bipyramid: ["bipyramid", "bipirámide", "Bipyramide"],
	tegum: ["tegum", "tego", "Tegum"]
};

//The ID of a word/message is determined by its property name in the TRANSLATIONS object.
Translation.get = function(id, options) {
	var translation = TRANSLATIONS[id + (options & PLURAL ? "P" : "")];
	
	if(translation) {
		translation = translation[LANGUAGE];	
		if(translation) {			
			if(options & UPPERCASE)
				return Translation.firstToUpper(translation);
			return translation;
		}
	}
	return id; //This hasn't been translated!
};

Translation.firstToLower = function(str) {
	return str.charAt(0).toLowerCase() + str.slice(1);
};

Translation.firstToUpper = function(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
};

Translation.setLanguage = function(lang) {
	LANGUAGE = lang;
	//We also need to run setGenders on every scene's polytope's construction node.
};