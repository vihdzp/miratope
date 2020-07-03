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

//The name for an d-element, according to http://os2fan2.com/gloss/pglosstu.html
//Works for up to 20 dimensions, we very probably don't need more than that.
Translation.elementName = function(d, options) {
	var res;
	switch(LANGUAGE) {
		case ENGLISH:
			switch(d) {
				case 0:
					if(options & PLURAL) res = "vertices"; else res = "vertex"; break;
				case 1:
					if(options & PLURAL) res = "edges"; else res = "edge"; break;
				case 2:
					if(options & PLURAL) res = "faces"; else res = "face"; break;
				case 3:
					if(options & PLURAL) res = "cells"; else res = "cell"; break;
				case 4:
					if(options & PLURAL) res = "tera"; else res = "teron"; break;
				case 5:
					if(options & PLURAL) res = "peta"; else res = "peton"; break;
				case 6:
					if(options & PLURAL) res = "exa"; else res = "exon"; break;
				case 7:
					if(options & PLURAL) res = "zetta"; else res = "zetton"; break;
				case 8:
					if(options & PLURAL) res = "yotta"; else res = "yotton"; break;
				case 9:
					if(options & PLURAL) res = "xenna"; else res = "xennon"; break;
				case 10:
					if(options & PLURAL) res = "daka"; else res = "dakon"; break;
				case 11:
					if(options & PLURAL) res = "hendaka"; else res = "hendakon"; break;
				case 12:
					if(options & PLURAL) res = "doka"; else res = "dokon"; break;
				case 13:
					if(options & PLURAL) res = "tradaka"; else res = "tradakon"; break;
				case 14:
					if(options & PLURAL) res = "teradaka"; else res = "teradakon"; break;
				case 15:
					if(options & PLURAL) res = "petadaka"; else res = "petadakon"; break;
				case 16:
					if(options & PLURAL) res = "exdaka"; else res = "exdakon"; break;
				case 17:
					if(options & PLURAL) res = "zettadaka"; else res = "zettadakon"; break;
				case 18:
					if(options & PLURAL) res = "yottadaka"; else res = "yottadakon"; break;
				case 19:
					if(options & PLURAL) res = "xendaka"; else res = "xendakon"; break;
				case 20:
					if(options & PLURAL) res = "ica"; else res = "icon"; break;
				default:
					if(options & PLURAL) res = d + "-elements"; else res = d + "-element"; break;
			}
			
			break;
		case SPANISH:
			switch(d) {
				case 0:
					res = "vértice"; break;
				case 1:
					res = "arista"; break;
				case 2:
					res = "cara"; break;
				case 3:
					res = "celda"; break;
				case 4:
					res = "tera"; break;
				case 5:
					res = "peta"; break;
				case 6:
					res = "exa"; break;
				case 7:
					res = "zeta"; break;
				case 8:
					res = "yota"; break;
				case 9:
					res = "xena"; break;
				case 10:
					res = "daca"; break;
				case 11:
					res = "hendaca"; break;
				case 12:
					res = "doca"; break;
				case 13:
					res = "tradaca"; break;
				case 14:
					res = "teradaca"; break;
				case 15:
					res = "petadaca"; break;
				case 16:
					res = "exadaca"; break;
				case 17:
					res = "zettadaca"; break;
				case 18:
					res = "yottadaca"; break;
				case 19:
					res = "xendaca"; break;
				case 20:
					res = "ica"; break;
				default:
					res = d + "-elemento"; break;
			}
			
			if(options & PLURAL)
				res += "s";
			break;
		case GERMAN:
			switch(d) {
				case 0:
					if(options & PLURAL) res = "Eck"; else res = "Ecke"; break;
				case 1:
					if(options & PLURAL) res = "Kante"; else res = "Kanten"; break;
				case 2:
					if(options & PLURAL) res = "Fläche"; else res = "Flächen"; break;
				case 3:
					if(options & PLURAL) res = "Zell"; else res = "Zellen"; break;
				case 4:
					if(options & PLURAL) res = "Tera"; else res = "Teras"; break;
				case 5:
					res = "Peta"; break;
				case 6:
					res = "Exa"; break;
				case 7:
					res = "Zetta"; break;
				case 8:
					res = "Yotta"; break;
				case 9:
					res = "Xena"; break;
				case 10:
					res = "Daka"; break;
				case 11:
					res = "Hendaka"; break;
				case 12:
					res = "Doka"; break;
				case 13:
					res = "Tradaka"; break;
				case 14:
					res = "Teradaka"; break;
				case 15:
					res = "Petadaka"; break;
				case 16:
					res = "Exadaka"; break;
				case 17:
					res = "Zettadaka"; break;
				case 18:
					res = "Yottadaka"; break;
				case 19:
					res = "Xendaka"; break;
				case 20:
					res = "Ika"; break;
				default:
					res = d + "-Element"; break;
			}
			
			if(options & PLURAL)
				res += "s";
			break;
	}	
	
	if(options & UPPERCASE)		
		return Translation.firstToUpper(res);
	return res;
};

//The ending in the name for a d-polytope.
Translation.polytopeEnding = function(d, options) {
	var res = "";
	switch(LANGUAGE) {
		case ENGLISH:
			switch(d) {
				case 1:
					if(options & PLURAL) res = "tela"; else res = "telon"; break;
				case 2:
					if(options & PLURAL) res = "gons"; else res = "gon"; break;
				case 3:
					if(options & PLURAL) res = "hedra"; else res = "hedron"; break;
				case 4:
					if(options & PLURAL) res = "chora"; else res = "choron"; break;
				default:
					if(d > 20)
						return n + "-polytope" + (options & PLURAL ? "s" : "");
					return Translation.elementName(d - 1, options);
			}
			
			break;
		case SPANISH:
			switch(d) {
				case 1:
					res = "telo"; break;
				case 2:
					res = "gono"; break;
				case 3:
					res = "edro"; break;
				case 4:
					res = "coro"; break;
				default:
					if(d > 20)
						res = n + "-politopo";
					else
						res = Translation.elementName(d - 1, options);
					break;
			}
			
			if(options & PLURAL)
				res += "s";
			break;
		case GERMAN:
			switch(d) {
				case 1:
					if(options & PLURAL) res = "tela"; else res = "telon"; break;
				case 2:
					if(options & PLURAL) res = "gone"; else res = "gon"; break;
				case 3:
					res = "eder"; break;
				case 4:
					if(options & PLURAL) res = "chora"; else res = "choron"; break;
				default:
					if(d > 20)
						return n + "-polytop" + (options & PLURAL ? "en" : "");
					return Translation.elementName(d - 1, options);
			}
			
			break;
	}
	
	if(options & UPPERCASE)		
		return Translation.firstToUpper(res);
	return res;
};

Translation.firstToLower = function(str) {
	return str.charAt(0).toLowerCase() + str.slice(1);
}

Translation.firstToUpper = function(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

//Helper function for toAdjective.
//To be called within the Ending class.
//Turns everything except for the last word into an adjective and adds the last word unchanged.
Translation._toAdjectiveBeforeLastWord = function(name, gender) {
	var i = name.lastIndexOf(" ");
	return Translation.toAdjective(name.substr(0, i), gender) + name.substr(i);
};

//Helper function for toAdjective.
//Meant for Spanish.
//To be called within the Ending class.
//Turns everything except for the last word into an adjective and adds the last word with its grammatical gender modified accordingly.
Translation._toAdjectiveBeforeLastWordGendered = function(name, gender) {
	var i = name.lastIndexOf(" ");
	return Translation.toAdjective(name.substr(0, i), gender) + name.substr(i, name.length - i - 1) + (gender === MALE ? "o" : "a");
};

//Helper array for toAdjective.
//Stores some endings and what to do with them.
//Sorted by alphabetical order of the strings, backwards!
//cba is sorted before dcba.
Translation._endings = [
	//English
	[
		new Ending("da", 0, "ic"), //Rotunda(ic)
		new Ending("ola", 0, "ic"), //Cupola(ic)
		new Ending("ula", 0, "r"), //Stella octangula(r)
		new Ending("na", 0, "l"), //Sphenocorona(l)
		new Ending("mb", 0, "ic"), //Cube honeycomb(ic)
		new Ending("ad", 0, "ic"), //Dyad(ic)
		new Ending("id", 0, "al"), //Pyramid(al)
		new Ending("od", 0, "al"), //Tripod(al)
		new Ending("be", -1, "ic"), //Cub(e/ic)
		new Ending("ce", -1, "ial"), //Essenc(e/ial)
		new Ending("le", -2, "ular"), //Triang(le/ular)
		new Ending("pe", -1, "ic"), //Pentatop(e/ic)
		//new Ending("re", 0, ""), //Square
		new Ending("ure", -1, "al"), //Skilling's figur(e/al)
		new Ending("ll", 0, "ular"), //5-cell(ular)
		new Ending("am", 0, "mic"), //Pentagram(mic)
		new Ending("sm", 0, "atic"), //Triangular prism(atic)
		new Ending("um", -2, "matic"), //Duoteg(um/matic)
		new Ending("ium", -2, "al"), //Gyrobifastigi(um/al)
		new Ending("lum", -2, "ar"), //Disphenocingul(um/ar)
		new Ending("on", -2, "al"), //Tetrahedr(on/al)
		new Ending("gon", 0, "al"), //Pentagon(al)
		new Ending("ion", -3, "e"), //Square tesselat(ion/e)
		new Ending("lon", -2, "ar"), //Ditel(on/ar)
		//new Ending("ss", 0, ""), // Pentacross
		new Ending("us", -2, "ic"), //Triamb(us/ic)
		//new Ending("nt", 0, ""), // Point
		new Ending("ct", 0, "ic"), //Tesseract(ic)
		new Ending("nt", 0, "al"), //3-element(al)
		new Ending("ex", -2, "icial"), //Simpl(ex/icial)
		new Ending("ix", -1, "cal"), //Square heli(x/cal)
		new Ending("ny", -1, "ical") //Octagonn(y/ical)
	],
	[
		new Ending("zada", Translation._toAdjectiveBeforeLastWord), //Cúpula pentagrámica cruzada
		new Ending("íada", -4, "iádic", SPANISH_MODIFIER), //D(íada/iádic[o/a])
		new Ending("lda", -2, "ular"), //5-cel(da/ular)
		new Ending("nda", -1, "áic", SPANISH_MODIFIER), //Rotund(a/áic[o/a])
		new Ending("ia", 0, "l"), //Essenc(ia/ial)
		new Ending("la", -2, "idal"), //Cupo(la/idal)
		new Ending("ula", -6, "angular"), //Estrella oct(ángula/angular)
		new Ending("ma", -3, "ámic", SPANISH_MODIFIER), //Pentagr(ama/ámic[o/a])
		new Ending("sma", -1, "átic", SPANISH_MODIFIER), //Prism(a/átic[o/a])
		new Ending("na", 0, "l"), //Esfenocorona(l)
		new Ending("ide", -5, "amidal"), //Pir(ámide/amidal)
		new Ending("oide", -1, "al"), //Disfenoid(e/al)
		new Ending("nde", Translation._toAdjectiveBeforeLastWord), //Heptagrama grande
		new Ending("ng", -12, "l de Skilling"), //Figura( de Skilling/l de Skilling)
		new Ending("ium", -2, "al"), //Girobifastigi(um/al)
		new Ending("bo", -3, "úbic", SPANISH_MODIFIER), //C(ubo/úbic[o/a])
		new Ending("co", Translation._toAdjectiveBeforeLastWord), //Heptadecaedro diestrófico
		new Ending("ado", Translation._toAdjectiveBeforeLastWordGendered), //Pentagrama cruzado
		//Icosaedro estrellado
		new Ending("rado", -1, "", SPANISH_MODIFIER), //Cuadrad(o/[o/a])
		new Ending("jo", -3, "icial"), //Simpl(ejo/icial)
		new Ending("io", -1, "al"), //Girobifastigi(o/al)
		new Ending("lo", -1, "ar"), //Ditel(o/ar)
		new Ending("ángulo", -6, "angular"), //Tri(ángulo/angular)
		new Ending("íngulo", -6, "ingular"), //Dispfnoc(íngulo/ingular)
		new Ending("ano", Translation._toAdjectiveBeforeLastWord), //Tridecagrama mediano
		new Ending("ono", -5, "agonal"), //Pent(ágono/agonal)
		new Ending("po", -3, "ópic", SPANISH_MODIFIER), //Pentat(opo/ópic[o/a])
		new Ending("ro", -1, "al"), //Tetrahedr(on/al)
		new Ending("to", -4, "áctic", SPANISH_MODIFIER), //Teseract(o/ic[o/a])
		new Ending("nto", -1, "al"), //3-element(o/al)
		new Ending("unto", 1, "ual"), //Punt(o/ual)		
		new Ending("ño", Translation._toAdjectiveBeforeLastWord), //Hendecagrama pequeño
		new Ending("or", Translation._toAdjectiveBeforeLastWord), //Hendecagrama mayor
		new Ending("is", Translation._toAdjectiveBeforeLastWord), //Dodecaedral pentakis
		new Ending("ex", -2, "icial"), //Simpl(ex/icial)
		new Ending("uz", 0, "ad", SPANISH_MODIFIER), //Pentacruz(ad[o/a])
		new Ending("ié", -2, "odal") //Trip(ié/odal)
	]
];
	
//I have to deal with some special cases in toAdjective.
//Some Spanish words have to be modified at the beginning.
//E,g, Prisma triangular -> Prismático triangular.
Translation._spanishFirstWordEndings = [
	new Ending("nda", -1, "áic", SPANISH_MODIFIER), //Rotund(a/áic[o/a])
	new Ending("ula", -5, "upular"), //C(úpula/upular)
	new Ending("sma", -1, "átic", SPANISH_MODIFIER), //Prism(a/átic[o/a])
	new Ending("ce", -5, "elicoidal"), //H(élice/elicoidal)
	new Ending("mide", -5, "amidal"), //Pir(ámide/amidal)
	new Ending("ón", -4, "d", SPANISH_MODIFIER), //Tesela(ción/d[o/a])
	new Ending("go", -1, "átic", SPANISH_MODIFIER) //Teg(o/mátic[o/a])
];

//Converts a polytope name into an adjective, possibly depending on the gender of the substantive it modifies (e.g. in Spanish or German).
//E.g. cube -> cubical, sphenocorona -> sphenocoronal, etc.
//If there's an ending match, the transformation done will correspond to the longest match.
//If no ending matches, the default is to leave the name as is.
Translation.toAdjective = function(name, gender) {
	var endingIndx;
	
	//Checks a few special cases in Spanish.
	if(LANGUAGE === SPANISH) {
		var i = name.indexOf(" "), firstWord = name.substr(0, i);
		endingIndx = Translation._findEnding(firstWord, Translation._spanishFirstWordEndings);
		if(endingIndx !== -1)
			return Translation._spanishFirstWordEndings[endingIndx].changeEnding(firstWord, gender) + name.substr(i);
	}
		
	endingIndx = Translation._findEnding(name, Translation._endings[LANGUAGE])
	
	if(endingIndx !== -1)		
		return Translation._endings[LANGUAGE][endingIndx].changeEnding(name, gender);
	return name;
};

//Helper function for toAdjective.
//Finds the ending that fits a string among a list of endings.
//Returns its index. -1 if no ending fits.
//Uses a modified binary search.
Translation._findEnding = function (name, endings) {
	var first,
	mid,
	last,
	firstMatch = 0, 
	lastMatch = endings.length - 1,
	endingStr,
	backup,
	k = 1;
	
	//Adds one letter of name at a time.
	//Searches for the least and greatest elements of _endings that are compatible with the observed letters.
	while(lastMatch !== firstMatch) {
		//If the first (shorter) possibility fits, and no other (longer one) does, we'll use that one.
		
		if(endings[firstMatch].string.length < k)
			backup = firstMatch;
		else
			backup = null;
		
		//Finds firstMatch.
		first = firstMatch;
		last = lastMatch;		
		while(last - first > 1) {
			mid = Math.floor((first + last) / 2);
			if(Ending.compare(name, endings[mid].string, k) <= 0)
				last = mid;
			else
				first = mid;
		}		
		if(Ending.compare(name, endings[first].string, k) === 0)
			firstMatch = first;
		else
			firstMatch = last;
		
		//Finds lastMatch.
		first = firstMatch;
		last = lastMatch;
		while(last - first > 1) {
			mid = Math.floor((first + last) / 2);
			if(Ending.compare(name, endings[mid].string, k) < 0)
				last = mid;
			else
				first = mid;
		}
		if(Ending.compare(name, endings[last].string, k) === 0)
			lastMatch = last;
		else
			lastMatch = first;	
		
		k++;
	}	
	
	//If at some point, only one match fits, we check if it fits the whole string.
	//Note: we haven't checked if the (k - 1)th character is correct.
	endingStr = endings[firstMatch].string;
	for(k--; k <= endingStr.length; k++)
		//No match.
		if(name.charAt(name.length - k).toLowerCase() !== endingStr.charAt(endingStr.length - k).toLowerCase()) {
			if(backup)
				return backup;
			return -1;
		}
		
	//If the match does fit, we return it.
	return firstMatch;
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
}

//A plain name for the polytope is simply [greek facet count prefix] [greek dimension Ending].
Translation.plain = function(n, dimension, options) {
	switch(LANGUAGE) {
		case ENGLISH:
			return Translation.greekPrefix(n, options & UPPERCASE) + Translation.polytopeEnding(dimension, options & PLURAL);
		case GERMAN:		
			return Translation.greekPrefix(n, UPPERCASE) + Translation.polytopeEnding(dimension, options & PLURAL);
		case SPANISH:
			if(dimension === 2) //"Pentágono" en vez de "pentagono".
				return Translation._lastVowelTilde(Translation.greekPrefix(n, options & UPPERCASE)) + "gono" + (options & PLURAL ? "s" : "");
			return Translation.greekPrefix(n, options & UPPERCASE) + Translation.polytopeEnding(dimension, options & PLURAL);
		default:
			return n;
	}
};

//Converts a constructionNode into its the corresponding member of the specified family's name.
Translation.familyMember = function(node, family, gender) {
	var name = node.getName();
	switch(LANGUAGE) {
		case ENGLISH:
			return Translation.toAdjective(name) + " " + Translation.get(family);
		case SPANISH:
			return Translation.get(family) + " " + Translation.toAdjective(name, gender);
		case GERMAN:
			return Translation.toAdjective(name, gender) + " " + Translation.get(family);
		default:
			return name;
	}
}

//Converts a set of constructionNodes into their prism product's name.
//Dyads are written as plain prisms.
Translation.multiprism = function(nodes, gender) {
	var names = [], DYAD = Translation.get("dyad"), dyadCount = 0, tempName, concatName, allNamesSame = true;
	
	//Multiprisms of multiprisms are just larger multiprisms.
	for(var i = 0; i < nodes.length; i++) {
		tempName = nodes[i].getName();
		if(tempName === DYAD)
			dyadCount++;
		else 
			names.push(tempName);
	}
	
	var prefix; //The prefix before prism, e.g. *duo*prism, *trio*prism, ...
	switch(names.length) {
		case 1:
			prefix = ""; break;
		case 2:
			prefix = "duo"; break;
		default:
			prefix = Translation.greekPrefix(names.length);	break;
	}
	
	switch(LANGUAGE) {
		case ENGLISH:
			concatName = Translation.toAdjective(names[names.length - 1]);
			tempName = names.pop();
			
			while(names.length > 0) {
				concatName += "-" + Translation.toAdjective(names[names.length - 1]);
				if(names.pop() !== tempName)
					allNamesSame = false;
			}
			
			if(!dyadCount) {				
				//X multiprism
				if(allNamesSame)
					return Translation.toAdjective(tempName)+ " " + prefix + Translation.get("prism");
				
				//X-Y-Z multiprism
				return concatName + " " + prefix + Translation.get("prism");
			}
			
			//Same as before, but adds as many ...prismatic prism as needed at the end.
			if(allNamesSame)
				concatName = Translation.toAdjective(tempName) + " ";
			else
				concatName = concatName + " ";
			
			//We aren't calling a single polytope X an "X monoprism", are we?
			if(prefix)
				concatName += prefix + Translation.toAdjective(Translation.get("prism")) + " ";
			
			while(--dyadCount)
				concatName += Translation.toAdjective(Translation.get("prism")) + " ";
			return concatName + Translation.get("prism");
		case SPANISH:
			concatName = Translation.toAdjective(names[names.length - 1], gender);
			tempName = names.pop();
			
			while(names.length > 0) {
				concatName += "-" + Translation.toAdjective(names[names.length - 1], gender);
				if(names.pop() !== tempName)
					allNamesSame = false;
			}
			
			if(!dyadCount) {
				//Multiprisma X
				if(allNamesSame)
					return prefix + Translation.get("prism") + " " + Translation.toAdjective(tempName, gender);
				
				//Multiprisma X-Y-Z
				return prefix + Translation.get("prism") + " " + concatName;
			}
			
			//Igual que antes, pero con tantos prisma prismático... como se requieran al inicio.
			if(allNamesSame)
				concatName =  Translation.toAdjective(tempName, gender);
			
			//No estamos llamando a un politopo X un "monoprisma X", ¿o sí?
			if(prefix)
				concatName = prefix + Translation.toAdjective(Translation.get("prism"), gender) + " " + concatName;
			
			while(--dyadCount)
				concatName = Translation.toAdjective(Translation.get("prism"), gender) + " " + concatName;
			return Translation.get("prism") + " " + concatName;
	}
}

//Converts a set of constructionNodes into their tegum product's name.
//Dyads are written as plain prisms.
Translation.multitegum = function(nodes, gender) {
	var names = [], DYAD = Translation.get("dyad"), dyadCount = 0, tempName, concatName, allNamesSame = true;
	
	//Multiprisms of multiprisms are just larger multiprisms.
	for(var i = 0; i < nodes.length; i++) {
		tempName = nodes[i].getName();
		if(tempName === DYAD)
			dyadCount++;
		else 
			names.push(tempName);
	}
	
	var prefix; //The prefix before prism, e.g. *duo*tegum, *trio*tegum, ...
	switch(names.length) {
		case 1:
			prefix = ""; break;
		case 2:
			prefix = "duo"; break;
		default:
			prefix = Translation.greekPrefix(names.length);	break;
	}
	
	switch(LANGUAGE) {
		case ENGLISH:
			concatName = Translation.toAdjective(names[names.length - 1]);
			tempName = names.pop();
			
			while(names.length > 0) {
				concatName += "-" + Translation.toAdjective(names[names.length - 1]);
				if(names.pop() !== tempName)
					allNamesSame = false;
			}
			
			if(!dyadCount) {				
				//X multiprism
				if(allNamesSame)
					return Translation.toAdjective(tempName)+ " " + prefix + Translation.get("tegum");
				
				//X-Y-Z multiprism
				return concatName + " " + prefix + Translation.get("tegum");
			}
			
			//Same as before, but adds as many ...tegmatic tegum as needed at the end.
			if(allNamesSame)
				concatName = Translation.toAdjective(tempName) + " ";
			else
				concatName = concatName + " ";
			
			//We aren't calling a single polytope X an "X monoprism", are we?
			if(prefix)
				concatName += prefix + Translation.toAdjective(Translation.get("tegum")) + " ";
			
			while(--dyadCount)
				concatName += Translation.toAdjective(Translation.get("bipyramid")) + " ";
			return concatName + Translation.get("bipyramid");
		case SPANISH:
			concatName = Translation.toAdjective(names[names.length - 1], MALE);
			tempName = names.pop();
			
			while(names.length > 0) {
				concatName += "-" + Translation.toAdjective(names[names.length - 1], gender);
				if(names.pop() !== tempName)
					allNamesSame = false;
			}
			
			if(!dyadCount) {
				//Multiprisma X
				if(allNamesSame)
					return prefix + Translation.get("tegum") + " " + Translation.toAdjective(tempName, gender);
				
				//Multiprisma X-Y-Z
				return prefix + Translation.get("tegum") + " " + concatName;
			}
			
			//Igual que antes, pero con tantos prisma prismático... como se requieran al inicio.
			if(allNamesSame)
				concatName =  Translation.toAdjective(tempName, gender);
			
			//No estamos llamando a un politopo X un "monoprisma X", ¿o sí?
			if(prefix)
				concatName = prefix + Translation.toAdjective(Translation.get("prism"), gender) + " " + concatName;
			
			while(--dyadCount)
				concatName = Translation.toAdjective(Translation.get("bypiramid"), gender) + " " + concatName;
			return Translation.get("bipyramid") + " " + concatName;
	}
}

//https://stackoverflow.com/a/1431113
Translation._replaceAt = function(str, index, replacement) {
    return str.substr(0, index) + replacement + str.substr(index + replacement.length);
}

//Spanish helper function.
//Adds a tilde to the last vowel of a word.
//E.g. penta -> pentá
Translation._lastVowelTilde = function(str) {
	for(var i = str.length - 1; i >= 0; i--) {
		switch(str.charAt(i)) {
			case "a":
				return Translation._replaceAt(str, i, "á");
			case "e":
				return Translation._replaceAt(str, i, "é");
			case "i":
				return Translation._replaceAt(str, i, "í");
			case "o":
				return Translation._replaceAt(str, i, "ó");
			case "u":
				return Translation._replaceAt(str, i, "ú");
		}
	}
	
	throw new Error("No vowel to replace!");
}	

//-, one, two, three, four, five, six, seven, eight, nine, to Greek, back to each language.
Translation._units = [
["", "hen", "di", "tri", "tetra", "penta", "hexa", "hepta", "octa", "ennea"], //English
["", "hen", "di", "tri", "tetra", "penta", "hexa", "hepta", "octa", "enea"], //Spanish
["", "hen", "di", "tri", "tetra", "penta", "hexa", "hepta", "okto", "ennea"], //German
];

//ten, tenfold, twenty, twenty-, hundredfold, thousandfold, ten-thousandfold, to Greek, back to each language.
Translation._joiners = [
["deca", "conta", "icosa", "icosi", "hecto", "chilia", "myria"], //English
["deca", "conta", "icosa", "icosi", "hecta", "chilia", "miria"], //Spanish
["deka", "conta", "ikosa", "ikosi", "hekto", "chilia", "myria"] //German
];

//Converts n into a greek prefix.
//Works only from 0 to 99999.
//Based on https://www.georgehart.com/virtual-polyhedra/greek-prefixes.html
//Defaults to n-.
Translation.greekPrefix = function(n, options) {	
	if(n === 0) {
		switch(LANGUAGE) {
			case ENGLISH:
			case GERMAN:
				if(options & UPPERCASE)
					return "Nulli";
				return "nulli";
			case SPANISH:
				if(options & UPPERCASE)
					return "Nuli";
				return "nuli";
		}
	}
	
	if(n === 1) {		
		if(options & UPPERCASE)
			return "Mono";
		return "mono";
	}
	
	if(n >= 100000)
		return n + "-";
	
	var res = "";
	var units = n % 10; n = Math.floor(n / 10);
	var tens = n % 10; n = Math.floor(n / 10);
	var hundreds = n % 10; n = Math.floor(n / 10);
	var thousands = n % 10; n = Math.floor(n / 10);
	var tenThousands = n % 10;
	
	switch(tenThousands) {
		case 0:
			break;
		case 1:
			res += Translation._joiners[LANGUAGE][6];
			break;
		default:
			res += Translation._units[LANGUAGE][tenThousands] + Translation._joiners[LANGUAGE][6];
			break;
	}
	
	switch(thousands) {
		case 0:
			break;
		case 1:
			res += Translation._joiners[LANGUAGE][5];
			break;
		default:
			res += Translation._units[LANGUAGE][thousands] + Translation._joiners[LANGUAGE][5];
			break;
	}
	
	switch(hundreds) {
		case 0:
			break;
		case 1:
			res += Translation._joiners[LANGUAGE][4];
			break;
		default:
			res += Translation._units[LANGUAGE][hundreds] + Translation._joiners[LANGUAGE][4];
			break;
	}
	
	switch(tens) {
		case 0:
			res += Translation._units[LANGUAGE][units];
			break;
		case 1:
			switch(units) {
				case 0:
					res += Translation._joiners[LANGUAGE][0];
					break;
				case 2:
					res += "do" + Translation._joiners[LANGUAGE][0];
					break;
				default:
					res += Translation._units[LANGUAGE][units] + Translation._joiners[LANGUAGE][0];
					break;
			}
			break;
		case 2:
			if(units)
				res += Translation._joiners[LANGUAGE][2] + Translation._units[LANGUAGE][units];
			else
				res += Translation._joiners[LANGUAGE][1];			
			break;
		default:
			res += Translation._units[LANGUAGE][tens] + Translation._joiners[LANGUAGE][1] + Translation._units[LANGUAGE][units];
			break;
	}
	
	if(options & UPPERCASE)		
		return Translation.firstToUpper(res);
	return res;
};

//Gives a name for {n / d}.
//For polygons with up to five non-compound stellations, uses the [small/-/medial/great/grand] n-gram naming scheme.
//For everything else, uses d-strophic n-gon.
Translation.regularPolygonName = function(n, d, options, gender) {
	if(d === undefined)
		d = 1;
	//"Crossed" polygons, as in the crossed pentagrammic antiprism.
	else if(d > n / 2) {
		switch(LANGUAGE) {
			case ENGLISH:
				if(options & UPPERCASE)
					return "Crossed " + Translation.regularPolygonName(n, n - d, options & PLURAL);
				return "crossed " + Translation.regularPolygonName(n, n - d, options & PLURAL);
			case SPANISH:
				return Translation.regularPolygonName(n, n - d, options) + " cruzad" + (gender === MALE ? "o" : "a") + (options & PLURAL ? "s" : "");
		}
	}
	
	var res;
	//I just need a quick to calculate function on n and d
	//to distinguish the stars with up to 42 sides.
	//I could just use the Euler totient function to give names without this enormous switch,
	//but this is ever so slightly faster so whatever.
	switch(64 * n + d) {
		case 193:
			return Translation.get("triangle", options);
		case 257:
			return Translation.get("square", options);
		case 322:
			res = Translation._starName(NONE, 5); break;
		case 386:
			res = Translation._starName(NONE, 6); break;
		case 450:
			res = Translation._starName(NONE, 7); break;
		case 451:
			res = Translation._starName(GREAT, 7); break;
		case 515:
			res = Translation._starName(NONE, 8); break;
		case 578:
			res = Translation._starName(NONE, 9); break;
		case 580:
			res = Translation._starName(GREAT, 5); break;
		case 643:
			res = Translation._starName(NONE, 10); break;
		case 706:
			res = Translation._starName(SMALL, 11); break;
		case 707:
			res = Translation._starName(NONE, 11); break;
		case 708:
			res = Translation._starName(GREAT, 11); break;
		case 709:
			res = Translation._starName(GRAND, 11); break;
		case 773:
			res = Translation._starName(NONE, 12); break;
		case 834:
			res = Translation._starName(SMALL, 13); break;
		case 835:
			res = Translation._starName(NONE, 13); break;
		case 836:
			res = Translation._starName(MEDIAL, 13); break;
		case 837:
			res = Translation._starName(GREAT, 13); break;
		case 838:
			res = Translation._starName(GRAND, 13); break;
		case 899:
			res = Translation._starName(NONE, 14); break;
		case 901:
			res = Translation._starName(GREAT, 14); break;
		case 962:
			res = Translation._starName(SMALL, 15); break;
		case 964:
			res = Translation._starName(NONE, 15); break;
		case 967:
			res = Translation._starName(GREAT, 15); break;
		case 1027:
			res = Translation._starName(SMALL, 16); break;
		case 1029:
			res = Translation._starName(NONE, 16); break;
		case 1031:
			res = Translation._starName(GREAT, 16); break;
		case 1157:
			res = Translation._starName(NONE, 18); break;
		case 1159:
			res = Translation._starName(GREAT, 18); break;
		case 1283:
			res = Translation._starName(SMALL, 20); break;
		case 1287:
			res = Translation._starName(NONE, 20); break;
		case 1289:
			res = Translation._starName(GREAT, 20); break;
		case 1346:
			res = Translation._starName(SMALL, 21); break;
		case 1348:
			res = Translation._starName(NONE, 21); break;
		case 1349:
			res = Translation._starName(MEDIAL, 21); break;
		case 1352:
			res = Translation._starName(GREAT, 21); break;
		case 1354:
			res = Translation._starName(GRAND, 21); break
		case 1411:
			res = Translation._starName(SMALL, 22); break;
		case 1413:
			res = Translation._starName(NONE, 22); break;					
		case 1415:
			res = Translation._starName(GREAT, 22); break;
		case 1417:
			res = Translation._starName(GRAND, 22); break;
		case 1541:
			res = Translation._starName(SMALL, 24); break;
		case 1543:
			res = Translation._starName(NONE, 24); break;
		case 1547:
			res = Translation._starName(GREAT, 24); break;
		case 1667:
			res = Translation._starName(SMALL, 26); break;
		case 1669:
			res = Translation._starName(NONE, 26); break;
		case 1671:
			res = Translation._starName(MEDIAL, 26); break;
		case 1673:
			res = Translation._starName(GREAT, 26); break;
		case 1675:
			res = Translation._starName(GRAND, 26); break;
		case 1795:
			res = Translation._starName(SMALL, 28); break;
		case 1797:
			res = Translation._starName(NONE, 28); break;
		case 1801:
			res = Translation._starName(MEDIAL, 28); break;
		case 1803:
			res = Translation._starName(GREAT, 28); break;
		case 1805:
			res = Translation._starName(GRAND, 28); break;
		case 1927:
			res = Translation._starName(SMALL, 30); break;
		case 1931:
			res = Translation._starName(NONE, 30); break;
		case 1933:
			res = Translation._starName(GREAT, 30); break;
		case 2309:
			res = Translation._starName(SMALL, 36); break;
		case 2311:
			res = Translation._starName(NONE, 36); break;
		case 2315:
			res = Translation._starName(MEDIAL, 36); break;
		case 2317:
			res = Translation._starName(GREAT, 36); break;
		case 2321:
			res = Translation._starName(GRAND, 36); break;
		case 2693:
			res = Translation._starName(SMALL, 42); break;
		case 2699:
			res = Translation._starName(NONE, 42); break;
		case 2701:
			res = Translation._starName(MEDIAL, 42); break;
		case 2705:
			res = Translation._starName(GREAT, 42); break;
		case 2707:
			res = Translation._starName(GRAND, 42); break;
		default:
			if(d === 1)
				return Translation.plain(n, 2, options);
			
			switch(LANGUAGE) {
				case ENGLISH:
					res = Translation.greekPrefix(d) + "strophic " + Translation.greekPrefix(n) + "gram"; break;
				case SPANISH:
					res = Translation.greekPrefix(n) + "grama " + Translation.greekPrefix(d) + "estrófic" + (gender === MALE ? "o" : "a"); break;
				case GERMAN: //Todo: conjugate strophisch.
					res = Translation.firstToUpper(Translation.greekPrefix(d)) + "strophisches " + Translation.greekPrefix(n, UPPERCASE) + "gramm"; break;
			}
	}
	
	//Adds plural and uppercase.
	//The plurals aren't always like this in the languages below, but they work for all polygon names.
	if(options & PLURAL) {
		switch(LANGUAGE) {
			case ENGLISH:
			case SPANISH:
				res += "s"; break;
			case GERMAN:
				res += "e"; break;
		}
	}
	if(options & UPPERCASE)
		return Translation.firstToUpper(res);
	return res;
};

Translation._starModifiers = [
["small", "medial", "great", "grand"], //English
["pequeño", "mediano", "grande", "mayor"], //Spanish
["Kleines", "Mittel", "Großes", "Größtes"] //German THE LAST ONE IS PROBABLY WRONG
];

Translation._starName = function(mod, n) {
	if(mod === NONE) {
		switch(LANGUAGE) {
			case ENGLISH:
				return Translation.greekPrefix(n) + "gram";
			case GERMAN:
				return Translation.firstToUpper(Translation.greekPrefix(n)) + "gramm";
			case SPANISH:
				return Translation.greekPrefix(n) + "grama";
		}
	}
	
	switch(LANGUAGE) {
		case ENGLISH:
			return Translation._starModifiers[LANGUAGE][mod] + " " + Translation.greekPrefix(n) + "gram";
		case GERMAN:
			return Translation._starModifiers[LANGUAGE][mod] + " " + Translation.firstToUpper(Translation.greekPrefix(n)) + "gramm";
		case SPANISH:
			return Translation.greekPrefix(n) + "grama" + " " + Translation._starModifiers[LANGUAGE][mod];
	}
}
