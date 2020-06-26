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

var LANGUAGE = SPANISH;

var TRANSLATIONS = {
	polytope: ["polytope", "politopo", "Polytop"],
	polytopes: ["polytopes", "politopos", "Polytope"],
	dyad: ["dyad", "díada", "Dyade"],
	dyads: ["dyads", "díadas", "Dyaden"],
	prism: ["prism", "prisma", "Prisma"],
	prisms: ["prisms", "prismas", "Prismen"],
	pyramid: ["pyramid", "pirámide", "Pyramide"],
	pyramids: ["pyramids", "pirámides", "Pyramiden"],
	rectangle: ["rectangle", "rectángulo", "Rechteck"],
	rectangles: ["rectangles", "rectángulos", "Rechtecke"]
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
					res = "tero"; break;
				case 5:
					res = "peto"; break;
				case 6:
					res = "exo"; break;
				case 7:
					res = "zeto"; break;
				case 8:
					res = "yoto"; break;
				case 9:
					res = "xeno"; break;
				case 10:
					res = "daco"; break;
				case 11:
					res = "hendaco"; break;
				case 12:
					res = "doco"; break;
				case 13:
					res = "tradaco"; break;
				case 14:
					res = "teradaco"; break;
				case 15:
					res = "petadaco"; break;
				case 16:
					res = "exdaco"; break;
				case 17:
					res = "zettadaco"; break;
				case 18:
					res = "yottadaco"; break;
				case 19:
					res = "xendaco"; break;
				case 20:
					res = "ico"; break;
				default:
					res = d + "-elemento"; break;
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
	
	//Spanish
	//I HAVE TO DEAL WITH SOME CASES SEPARATELY!
	/*Prisma X
	Pirámide X
	X -kis/-quis
	Tego X
	Teselación X
	Hélice X*/
	[
		new Ending("da", -4, "iádic", SPANISH_MODIFIER), //D(íada/iádic[o/a])
		new Ending("lda", -2, "ular"), //5-cel(da/ular)
		new Ending("nda", -1, "áic", SPANISH_MODIFIER), //Rotund(a/áic[o/a])
		new Ending("ia", -1, "ial"), //Essenc(e/ial)
		new Ending("la", -1, "éic", SPANISH_MODIFIER), //Cupol(a/éic[o/a])
		new Ending("ula", -6, "angular"), //Estrella oct(ángula/angular)
		new Ending("na", 0, "l"), //Esfenocorona(l)
		new Ending("ide", -5, "amidal"), //Pir(ámide/amidal)
		new Ending("oide", -1, "al"), //Disfenoid(e/al)
		new Ending("ng", -12, "l de Skilling"), //Figura( de Skilling/l de Skilling)
		new Ending("ium", -2, "al"), //Girobifastigi(um/al)
		new Ending("bo", -3, "úbic", SPANISH_MODIFIER), //C(ubo/úbic[o/a])
		new Ending("do", -1, "", SPANISH_MODIFIER), //Cuadrad(o/[o/a])
		new Ending("jo", -3, "icial"), //Simpl(ejo/icial)
		new Ending("lo", -1, "ar"), //Ditel(o/ar)
		new Ending("ángulo", -6, "angular"), //Tri(ángulo/angular)
		new Ending("íngulo", -6, "ingular"), //Dispfnoc(íngulo/ingular)
		new Ending("ono", -5, "agonal"), //Pent(ágono/agonal)
		new Ending("po", -3, "ópic", SPANISH_MODIFIER), //Pentat(opo/ópic[o/a])
		new Ending("ro", -1, "al"), //Tetrahedr(on/al)
		new Ending("to", -4, "áctic", SPANISH_MODIFIER), //Teseract(o/ic[o/a])
		new Ending("nto", -1, "al"), //3-element(o/al)
		new Ending("unto", 1, "ual"), //Punt(o/ual)
		new Ending("ex", -2, "icial"), //Simpl(ex/icial)
		new Ending("uz", 0, "ad", SPANISH_MODIFIER), //Pentacruz(ad[o/a])
		new Ending("ié", -2, "odal"), //Trip(ié/odal)
	]
];

//Converts a polytope name into an adjective, possibly depending on the gender of the substantive it modifies (e.g. in Spanish or German).
//E.g. cube -> cubical, sphenocorona -> sphenocoronal, etc.
//Goes through _endings in a modified binary search.
//If there's an ending match, the transformation done will correspond to the longest match.
//If no ending matches, the default is to leave the name as is.
Translation.toAdjective = function(name, gender) {
	var first,
	mid,
	last,
	firstMatch = 0, 
	lastMatch = Translation._endings[LANGUAGE].length - 1,
	ending, endingStr,
	k = 1;
	
	//Adds one letter of name at a time.
	//Searches for the least and greatest elements of _endings that are compatible with the observed letters.
	//Will not compare the first match, if all others have been discarded. That way, the "longest match" functionality works.
	while(lastMatch > firstMatch) {
		//Finds lastMatch.
		first = firstMatch;
		last = lastMatch;
		while(last - first > 1) {
			mid = Math.floor((first + last) / 2);
			if(Ending.compare(name, mid, k) < 0)
				last = mid;
			else
				first = mid;
		}
		if(Ending.compare(name, last, k) === 0)
			lastMatch = last;
		else
			lastMatch = first;
		
		//Finds firstMatch.
		//If lastMatch - firstMatch > 1, at least another match other than the first remains, so we can safely compare the first.
		first = firstMatch;
		last = lastMatch;		
		while(last - first > 1) {
			mid = Math.floor((first + last) / 2);
			if(Ending.compare(name, mid, k) <= 0)
				last = mid;
			else
				first = mid;
		}
		
		//If only the first match remains to be discarded, it's checked outside the while loop.
		if(lastMatch - firstMatch === 1 && Ending.compare(name, lastMatch, k) !== 0) {
			lastMatch = firstMatch;
			break;
		}
		
		//At least another match other than the first remains, so we can safely compare the first.
		if(Ending.compare(name, first, k) === 0)
			firstMatch = first;
		else
			firstMatch = last;
		k++;
	}	
	
	//If at some point, only one match fits, we check if it fits the whole string.
	ending = Translation._endings[LANGUAGE][firstMatch],
	endingStr = ending.string;
	if(firstMatch === lastMatch) {
		for(; k <= ending.string.length; k++)
			//No match.
			if(name.charAt(name.length - k).toLowerCase() !== endingStr.charAt(endingStr.length - k).toLowerCase())
				return name;
		//If the match does fit, we do the corresponding ending change.
		return Translation._endings[LANGUAGE][firstMatch].changeEnding(name, gender);
	}
	
	//No match either.
	return name;
};

//The ID of a word/message is determined by its index in the TRANSLATIONS array.
//Please don't put them out of order!
Translation.get = function(id) {
	var translation = TRANSLATIONS[id];
	if(translation) {
		translation = translation[LANGUAGE];	
		if(translation)
			return translation;
	}
	return id; //This hasn't been translated!
}

//A plain name for the polytope is simply [greek facet count prefix] [greek dimension Ending].
Translation.plain = function(n, dimension, options) {
	switch(LANGUAGE) {
		case ENGLISH:
			return Translation.greekPrefix(n, options & UPPERCASE) + Translation.polytopeEnding(dimension, options & PLURAL);
		case SPANISH:			
			return Translation._lastVowelTilde(Translation.greekPrefix(n, options & UPPERCASE)) + Translation.polytopeEnding(dimension, options & PLURAL);
	}
};

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

Translation._units = [
["", "mono", "di", "tri", "tetra", "penta", "hexa", "hepta", "octa", "ennea"], //English
["", "mono", "di", "tri", "tetra", "penta", "hexa", "hepta", "octa", "enea"] //Spanish
];

Translation._powersOfTen = [
[, "conta", "hecto", "chilia", "myria"], //English
[, "conta", "hecta", "chilia", "miria"] //Spanish
];

//Converts n into a greek prefix.
//Works only from 0 to 99999.
//Based on https://www.georgehart.com/virtual-polyhedra/greek-prefixes.html
//Defaults to n-.
Translation.greekPrefix = function(n, options) {	
	if(n === 0) {
		switch(LANGUAGE) {
			case ENGLISH:
				if(options & UPPERCASE)
					return "Nulli";
				return "nulli";
			case SPANISH:
				if(options & UPPERCASE)
					return "Nuli";
				return "nuli";
		}
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
			res += Translation._powersOfTen[LANGUAGE][4];
			break;
		default:
			res += Translation._units[LANGUAGE][tenThousands] + Translation._powersOfTen[LANGUAGE][4];
			break;
	}
	
	switch(thousands) {
		case 0:
			break;
		case 1:
			res += Translation._powersOfTen[LANGUAGE][3];
			break;
		default:
			res += Translation._units[LANGUAGE][thousands] + Translation._powersOfTen[LANGUAGE][3];
			break;
	}
	
	switch(hundreds) {
		case 0:
			break;
		case 1:
			res += Translation._powersOfTen[LANGUAGE][2];
			break;
		default:
			res += Translation._units[LANGUAGE][hundreds] + Translation._powersOfTen[LANGUAGE][2];
			break;
	}
	
	switch(tens) {
		case 0:
			res += Translation._units[LANGUAGE][units];
			break;
		case 1:
			switch(units) {
				case 0:
					res += "deca";
					break;
				case 1:
					res += "hendeca";
					break;
				case 2:
					res += "dodeca";
					break;
				default:
					res += Translation._units[LANGUAGE][units] + "deca";
					break;
			}
			break;
		case 2:
			if(units)
				res += "icosi" + Translation._units[LANGUAGE][units];
			else
				res += "icosa";			
			break;
		default:
			res += Translation._units[LANGUAGE][tens] + Translation._powersOfTen[LANGUAGE][1] + Translation._units[LANGUAGE][units];
			break;
	}
	
	if(options & UPPERCASE)		
		return Translation.firstToUpper(res);
	return res;
};

//TBA some more star names.
Translation.regularPolygonName = function(n, d) {
	//I just need a quick to calculate function on n and d
	//to distinguish the stars with up to 19 sides.
	switch(LANGUAGE) {
		case ENGLISH:
			switch(32 * n + d) {
				case 97:
					return "triangle";
				case 129:
					return "square";
				case 162:
					return "pentagram";
				case 226:
					return "heptagram";
				case 227:
					return "great heptagram";
				default: 
					return Translation.plain(n, 2);
			}
		case SPANISH:
			switch(32 * n + d) {
				case 97:
					return "triángulo";
				case 129:
					return "cuadrado";
				case 162:
					return "pentagrama";
				case 226:
					return "heptagrama";
				case 227:
					return "gran heptagrama";
				default: 
					return Translation.plain(n, 2);
			}
	}
};

