"use strict";
//Class for naming elements, polygons, etc.
//If we ever translate Miratope... (and we should!) this part will be hard.
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

//The Ending in the name for a d-polytope.
Names.polytopeEnding = function(d, options) {
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
//E.g. cube -> cubical, sphenocorona -> sphenocoronal, etc.
//Goes through _endings in a modified binary search.
//If there's an ending match, the transformation done will correspond to the longest.
//If no ending matches, the default is to leave the name as is.
Names.toAdjective = function(name) {
	var first,
	mid,
	last,
	firstMatch = 0, 
	lastMatch = Names._endings.length,
	k = 1;
	
	//Adds one letter of name at a time.
	//Searches for the least and greatest elements of _endings that are compatible with the observed letters.
	while(lastMatch > firstMatch) {
		//Finds firstMatch.
		first = firstMatch;
		last = lastMatch;
		
		while(last - first > 1) {
			mid = Math.floor((first + last) / 2);
			if(Ending.compare(name, mid, k) <= 0)
				last = mid;
			else
				first = mid;
		}
		if(Ending.compare(name, first, k) === 0)
			firstMatch = first;
		else if(Ending.compare(name, last, k) === 0)
			firstMatch = last;
		else
			return name;
		
		//Finds greatestMatch.
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
		else if(Ending.compare(name, first, k) === 0)
			lastMatch = first;
		else
			return name;
		
		k++;
	}	
	
	//If at some point, only one match fits, we check if it fits the whole string.
	//If it does, we do the corresponding ending change.
	if(firstMatch === lastMatch && !Ending.compare(name, firstMatch, Infinity))
		return Names._endings[firstMatch].changeEnding(name);
	//No match.
	return name;
};

//Helper array for toAdjective.
//Stores some endings and what to do with them.
//Sorted by alphabetical order of the strings, backwards!
//cba is sorted before dcba.
Names._endings = [
	new Ending("da", 0, "ic"), //Rotunda(ic)
	new Ending("la", 0, "ic"), //Cupola(ic)
	new Ending("na", 0, "l"), //Sphenocorona(l)
	new Ending("ad", 0, "ic"), //Dyad(ic)
	new Ending("id", 0, "al"), //Triangular pyramid(al)
	new Ending("be", -1, "ic"), //Cub(e/ic)
	//Square
	new Ending("gle", -2, "ular"), //Triang(le/ular)
	new Ending("pe", -1, "ic"), //Pentatop(e/ic)
	new Ending("ure", -1, "al"), //Skilling's figur(e/al)
	new Ending("ll", 0, "ular"), //5-cell(ular)
	new Ending("sm", 0, "atic"), //Triangular prism(atic)
	new Ending("gum", -2, "matic"), //Duoteg(um/matic)
	new Ending("ium", -2, "al"), //Gyrobifastigi(um/al)
	new Ending("lum", -2, "ar"), //Disphenocingul(um/ar)
	new Ending("on", -2, "al"), //Tetrahedr(on/al)
	new Ending("gon", 0, "al"), //Pentagon(al)
	new Ending("lon", -2, "ar"), //Ditel(on/ar)
	//Pentacross
	new Ending("ct", 0, "ic"), //Tesseract(ic)
	//Point
	new Ending("ex", -2, "icial"), //Simpl(ex/icial)
	new Ending("ny", -1, "ical") //Octagonn(y/ical)
];

//A plain name for the polytope is simply [greek facet count prefix] [greek dimension Ending].
Names.plain = function(n, d, options) {
	return Names.greekPrefix(n, options & UPPERCASE) + Names.polytopeEnding(d, options & PLURAL);
};

Names._units = ["", "mono", "di", "tri", "tetra", "penta", "hexa", "hepta", "octa", "ennea"];

//Converts n into a greek prefix.
//Works only from 0 to 99999.
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
};

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
};

//Helper class for toAdjective.
//Stores endings of words and what to do with them.
function Ending(string, sliceDepth, newEnding) {
	this.string = string;
	this.sliceDepth = sliceDepth;
	this.newEnding = newEnding;
};

Ending.prototype.changeEnding = function(name) {
	if(!this.sliceDepth)
		return name + this.newEnding;
	return name.slice(0, this.sliceDepth) + this.newEnding;
};

//Compares the last k characters of name with ending, in backwards order.
Ending.compare = function(name, indx, k) {
	var endingStr = Names._endings[indx].string;
	var i = name.length - 1, j = endingStr.length - 1, 
	//Compares k characters if possible, otherwise, compares the max amount possible.
	k = Math.min(k, endingStr.length);
	
	while(k--) {
		if(name.charAt(i).toLowerCase() < endingStr.charAt(j).toLowerCase())
			return -1;
		if(name.charAt(i--).toLowerCase() > endingStr.charAt(j--).toLowerCase())
			return 1;
	}
	
	return 0;
};