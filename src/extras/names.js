"use strict";
//Class for naming elements, polygons, etc.
var Names = {};

const PLURAL = 1;
const UPPERCASE = 2;
//The name for an d-element, according to http://os2fan2.com/gloss/pglosstu.html
//Works for up to 20 dimensions, we very probably don't need more than that.
Names.elementName = function(d, options) {
	var res;
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
	
	if(options & UPPERCASE)		
		return res.charAt(0).toUpperCase() + res.slice(1);
	return res;
};

//The suffix in the name for a d-polytope.
Names.polytopeSuffix = function(d, options) {
	var res = "";
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
			return Names.elementName(d - 1, options);
	}
	
	if(options & UPPERCASE)		
		return Names.firstToUpper(res);
	return res;
};

Names.firstToLower = function(str) {
	return str.charAt(0).toLowerCase() + str.slice(1);
}

Names.firstToUpper = function(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

//Converts a polytope name into an adjective.
//E.g. cube → cubical, sphenomegacorona → sphenomegacoronal, etc.
//Can probably be made more efficient in the future.
Names.toAdjective = function(name) {
	if(Names._checkSuffix(name, "cube")
	|| Names._checkSuffix(name, "square")
	|| Names._checkSuffix(name, "point"))
		return name;
	if(Names._checkSuffix(name, "tesseract")
	|| Names._checkSuffix(name, "dyad"))
		return name + "ic";
	if(Names._checkSuffix(name, "gon"))
		return name + "al";
	if(Names._checkSuffix(name, "on"))
		return name.slice(0, -2) + "al";
	if(Names._checkSuffix(name, "gram"))
		return name + "mic";
	if(Names._checkSuffix(name, "prism"))
		return name + "atic";
	if(Names._checkSuffix(name, "a"))
		return name + "l";
	return name + "al";
};

//Helper function for toAdjective.
//Checks if name ends in suffix.
Names._checkSuffix = function(name, suffix) {
	var i = name.length - suffix.length, j = 0;
	
	while(i < name.length)
		if(name.charAt(i++).toLowerCase() !== suffix.charAt(j++).toLowerCase())
			return false;
	return true;
}

//Replaces 
Names._replaceLast = function(name, i, newName) {
}

//A plain name for the polytope is simply [greek facet count prefix] [greek dimension suffix].
Names.plain = function(n, d, options) {
	return Names.greekPrefix(n, options & UPPERCASE) + Names.polytopeSuffix(d, options & PLURAL);
};

Names._units = ["", "mono", "di", "tri", "tetra", "penta", "hexa", "hepta", "octa", "ennea"];

//Converts n into a greek prefix.
//Works only from 0 to 999.
//Based on https://www.georgehart.com/virtual-polyhedra/greek-prefixes.html
//Defaults to n-.
Names.greekPrefix = function(n, options) {	
	if(n === 0) {
		if(options & UPPERCASE)
			return "Nulli";
		return "nulli";
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
			res += "myria";
			break;
		default:
			res += Names._units[tenThousands] + "myria";
			break;
	}
	
	switch(thousands) {
		case 0:
			break;
		case 1:
			res += "chilia";
			break;
		default:
			res += Names._units[thousands] + "chilia";
			break;
	}
	
	switch(hundreds) {
		case 0:
			break;
		case 1:
			res += "hecto";
			break;
		default:
			res += Names._units[hundreds] + "hecto";
			break;
	}
	
	switch(tens) {
		case 0:
			res += Names._units[units];
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
					res += Names._units[units] + "deca";
					break;
			}
			break;
		case 2:
			if(units)
				res += "icosi" + Names._units[units];
			else
				res += "icosa";			
			break;
		default:
			res += Names._units[tens] + "conta" + Names._units[units];
			break;
	}
	
	if(options & UPPERCASE)		
		return Names.firstToUpper(res);
	return res;
}

//TBA some more star names.
Names.regularPolygonName = function(n, d) {
	//I just need a quick to calculate function on n and d
	//to distinguish the stars with up to 19 sides.
	switch(32 * n + d) {
		case 97:
			return "Triangle";
		case 129:
			return "Square";
		case 162:
			return "Pentagram";
		case 226:
			return "Heptagram";
		case 227:
			return "Heptagrammic";
		default: 
			return Names.plain(n, 2, UPPERCASE);
	}
}