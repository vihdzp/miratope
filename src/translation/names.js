"use strict";

//The part of the Translation class that gives translated names for families.

//-, one, two, three, four, five, six, seven, eight, nine, to Greek, back to each language.
Translation._units = {
	en: ["", "hen", "di", "tri", "tetra", "penta", "hexa", "hepta", "octa", "ennea"],
	es: ["", "hen", "di", "tri", "tetra", "penta", "hexa", "hepta", "octa", "enea"],
	de: ["", "hen", "di", "tri", "tetra", "penta", "hexa", "hepta", "okto", "ennea"]
};

//Converts n into a greek prefix (or whatever works similarly in the target language).
//Works only from 0 to 99999.
//Based on https://www.georgehart.com/virtual-polyhedra/greek-prefixes.html
//Defaults to n-.

//Possible options:
/* uppercase */
Translation.greekPrefix = function(n, options) {
	if(!options)
		options = {};
	if(n === 0)
		return Translation.get("greekPrefixes/nulli", options);
	if(n === 1)
		return Translation.get("greekPrefixes/mono", options);
	if(n >= 100000)
		return n + "-";

	var res = "";
	var ones = n % 10; n = Math.floor(n / 10);
	var tens = n % 10; n = Math.floor(n / 10);
	var hundreds = n % 10; n = Math.floor(n / 10);
	var thousands = n % 10; n = Math.floor(n / 10);
	var tenThousands = n % 10,

	units = Translation._units[Translation.language];

	//Myrias
	switch(tenThousands) {
		case 0:
			break;
		case 1:
			res += Translation.get("greekPrefixes/myria");
			break;
		case 2:
			res += Translation.get("greekPrefixes/dis") + Translation.get("greekPrefixes/myria");
			break;
		case 3:
			res += Translation.get("greekPrefixes/tris") + Translation.get("greekPrefixes/myria");
			break;
		default:
			res += units[tenThousands] + Translation.get("greekPrefixes/myria");
			break;
	}

	//Chilias
	switch(thousands) {
		case 0:
			break;
		case 1:
			res += Translation.get("greekPrefixes/chilia");
			break;
		case 2:
			res += Translation.get("greekPrefixes/dis") + Translation.get("greekPrefixes/chilia");
			break;
		case 3:
			res += Translation.get("greekPrefixes/tris") + Translation.get("greekPrefixes/chilia");
			break;
		default:
			res += units[thousands] + Translation.get("greekPrefixes/chilia");
			break;
	}

	//Hectos
	switch(hundreds) {
		case 0:
			break;
		case 1:
			if(!tens && !ones)
				res += Translation.get("greekPrefixes/hecto");
			else
				res += Translation.get("greekPrefixes/hecaton");
			break;
		case 2:
			res += Translation.get("greekPrefixes/dia") + Translation.get("greekPrefixes/cosi");
			break;
		default:
			res += units[hundreds] + Translation.get("greekPrefixes/cosi");
			break;
	}

	//Decas
	switch(tens) {
		case 0:
			res += units[ones];
			break;
		//-deca cases:
		case 1:
			switch(ones) {
				case 0:
					res += Translation.get("greekPrefixes/deca");
					break;
				case 2:
					res += Translation.get("greekPrefixes/dodeca");
					break;
				default:
					res += units[ones] + Translation.get("greekPrefixes/deca");
					break;
			}
			break;
		//icosa- cases:
		case 2:
			if(ones)
				res += Translation.get("greekPrefixes/icosi") + units[ones];
			else
				res += Translation.get("greekPrefixes/icosa");
			break;
		//triaconta- cases:
		case 3:
			res += Translation.get("greekPrefixes/triaconta") + units[ones];
			break;
		default:
			res += units[tens] + Translation.get("greekPrefixes/conta") + units[ones];
			break;
	}

	if(options.uppercase)
		return Translation.firstToUpper(res);
	return res;
};

//A plain name for the polytope is simply [greek facet count prefix] [greek dimension Ending].

//Possible options:
/* uppercase */
Translation.plainName = function(n, dimension, options) {
	var UPPERCASE = {uppercase: true};
	if(!options)
		options = {};
	if(!options.count)
		options.count = 1;

	var prefix = Translation.greekPrefix(n, options);

	//"Pentágono" en vez de "pentagono."
	if(Translation.language === "es" && dimension === 2)
		prefix = Translation._lastVowelTilde(prefix);

	return prefix + Translation.polytopeEnding(dimension, options);
};

//The name for an d-element, according to http://os2fan2.com/gloss/pglosstu.html
//These are all neologisms, so feel free to translate them as you think appropriate.
//Works for up to 20 dimensions, we very probably don't need more than that.
Translation.elementName = function(d, options) {
	if(!options)
		options = {};
	var res;
	switch(Translation.language) {
		case "en":
			switch(d) {
				case 0:
					if(options.count) res = "vertices"; else res = "vertex"; break;
				case 1:
					if(options.count) res = "edges"; else res = "edge"; break;
				case 2:
					if(options.count) res = "faces"; else res = "face"; break;
				case 3:
					if(options.count) res = "cells"; else res = "cell"; break;
				case 4:
					if(options.count) res = "tera"; else res = "teron"; break;
				case 5:
					if(options.count) res = "peta"; else res = "peton"; break;
				case 6:
					if(options.count) res = "exa"; else res = "exon"; break;
				case 7:
					if(options.count) res = "zetta"; else res = "zetton"; break;
				case 8:
					if(options.count) res = "yotta"; else res = "yotton"; break;
				case 9:
					if(options.count) res = "xenna"; else res = "xennon"; break;
				case 10:
					if(options.count) res = "daka"; else res = "dakon"; break;
				case 11:
					if(options.count) res = "hendaka"; else res = "hendakon"; break;
				case 12:
					if(options.count) res = "doka"; else res = "dokon"; break;
				case 13:
					if(options.count) res = "tradaka"; else res = "tradakon"; break;
				case 14:
					if(options.count) res = "teradaka"; else res = "teradakon"; break;
				case 15:
					if(options.count) res = "petadaka"; else res = "petadakon"; break;
				case 16:
					if(options.count) res = "exdaka"; else res = "exdakon"; break;
				case 17:
					if(options.count) res = "zettadaka"; else res = "zettadakon"; break;
				case 18:
					if(options.count) res = "yottadaka"; else res = "yottadakon"; break;
				case 19:
					if(options.count) res = "xendaka"; else res = "xendakon"; break;
				case 20:
					if(options.count) res = "ica"; else res = "icon"; break;
				default:
					if(options.count) res = d + "-elements"; else res = d + "-element"; break;
			}

			break;
		case "es":
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

			if(options.count)
				res += "s";
			break;
		case "de":
			switch(d) {
				case 0:
					if(options.count) res = "Eck"; else res = "Ecke"; break;
				case 1:
					if(options.count) res = "Kante"; else res = "Kanten"; break;
				case 2:
					if(options.count) res = "Fläche"; else res = "Flächen"; break;
				case 3:
					if(options.count) res = "Zell"; else res = "Zellen"; break;
				case 4:
					if(options.count) res = "Tera"; else res = "Teras"; break;
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

			if(options.count)
				res += "s";
			break;
	}

	if(options.uppercase)
		return Translation.firstToUpper(res);
	return res;
};

//The ending in the name for a d-polytope.
Translation.polytopeEnding = function(d, options = {}) {
	var res = "";
	switch(Translation.language) {
		case "en":
			switch(d) {
				case 1:
					if(options.count > 1) res = "tela"; else res = "telon"; break;
				case 2:
					if(options.count > 1) res = "gons"; else res = "gon"; break;
				case 3:
					if(options.count > 1) res = "hedra"; else res = "hedron"; break;
				case 4:
					if(options.count > 1) res = "chora"; else res = "choron"; break;
				default:
					if(d > 20)
						return n + "-polytope" + (options.count > 1? "s" : "");
					return Translation.elementName(d - 1, options);
			}

			break;
		case "es":
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

			if(options.count >= 2)
				res += "s";
			break;
		case "de":
			switch(d) {
				case 1:
					if(options.count) res = "tela"; else res = "telon"; break;
				case 2:
					if(options.count) res = "gone"; else res = "gon"; break;
				case 3:
					res = "eder"; break;
				case 4:
					if(options.count) res = "chora"; else res = "choron"; break;
				default:
					if(d > 20)
						return n + "-polytop" + (options.count ? "en" : "");
					return Translation.elementName(d - 1, options);
			}

			break;
	}

	if(options.uppercase)
		return Translation.firstToUpper(res);
	return res;
};

//The name for a hypercube in d dimensions.
Translation.hypercube = function(d, options = {}) {
	switch(d) {
		case 0:
			return Translation.get("shape/point");
		case 1:
			return Translation.get("shape/dyad");
		case 2:
			return Translation.get("shape/square");
		case 3:
			return Translation.get("shape/cube");
		case 4:
			return Translation.get("shape/tesseract");
		default:
			var prefix = Translation.greekPrefix(d);
			//Changes the ending of the prefix accordingly.
			switch(Translation.language) {
				case "es":
					if(prefix.charAt(prefix.length - 2) == 'c')
						return prefix.substr(0, prefix.length - 2) + "queracto";
					else
						return prefix.substr(0, prefix.length - 1) + "eract";
				case "de":
					return prefix.substr(0, prefix.length - 1) + "eract";
				case "en":
				default:
					if(prefix.charAt(prefix.length - 2) == 'c')
						return prefix.substr(0, prefix.length - 2) + "keract";
					else
						return prefix.substr(0, prefix.length - 1) + "eract";
			}
		}
};

//The name for a cross-polytope in d dimensions.
Translation.cross = function(d) {
	switch(d) {
		case 0:
			return Translation.get("shape/point");
		case 1:
			return Translation.get("shape/dyad");
		case 2:
			return Translation.get("shape/square");
		case 3:
			return Translation.plainName(8, 3);
		case 4:
			return Translation.plainName(16, 4);
		default:
			return Translation.greekPrefix(d) + Translation.get("misc/cross");
		}
};

//The name for a simplex in d dimensions.
Translation.simplex = function(d) {
	switch(d) {
		case 0:
			return Translation.get("shape/point");
		case 1:
			return Translation.get("shape/dyad");
		case 2:
			return Translation.get("shape/triangle");
		case 3:
			return Translation.plainName(4, 3);
		case 4:
			return Translation.plainName(5, 4);
		default:
			return Translation.greekPrefix(d) + Translation.get("misc/plex");
		}
};

//Converts a nodeC into its the corresponding member of the specified family's name.
Translation.familyMember = function(node, family, gender) {
	return Translation.addAdjective(
		Translation.toAdjective(node.getName(), gender),
		Translation.get(family)
	);
};

//Converts a set of ConstructionNodes into their prism product/tegum product/pyramid product's name.
//The family is which product is used ("prism", "tegum", "pyramid").
//specialFactor is an element that, when in the product, is considered differently.
//specialFactorModify specifies what this element becomes into within the product.
//e.g. for a multiprism, specialFactor = "dyad", specialFactorModify = "prism".
//For a multipyramid, specialFactor = "point", specialFactorModify = "pyramid".
Translation.multiFamily = function(nodes, family, specialFactor, specialFactorModify, gender) {
	var names = [],
	FAMILY = Translation.get(family),
	FAMILYADJ = Translation.toAdjective(FAMILY, gender),
	SPECIAL = Translation.get(specialFactor),
	SPECIALMOD = Translation.get(specialFactorModify),
	SPECIALMODADJ = Translation.toAdjective(SPECIALMOD, gender),
	specialCount = 0,
	tempName, concatName, allNamesSame = true;

	//Counts special factors.
	for(var i = 0; i < nodes.length; i++) {
		tempName = nodes[i].getName();
		if(tempName === SPECIAL)
			specialCount++;
		else
			names.push(tempName);
	}

	var prefix; //The prefix before [family], e.g. *duo*[family], *trio*[family], ...
	switch(names.length) {
		//All special factors.
		case 0:
			names.push(SPECIAL);
			specialCount--;
			/*prefix = ""; //Fun fact: this code works the same
			break; //without these two lines!*/
		case 1:
			prefix = ""; break;
		case 2:
			prefix = "duo"; break;
		case 3:
			prefix = "trio"; break;
		default:
			prefix = Translation.greekPrefix(names.length);	break;
	}

	tempName = names.pop();
	concatName = Translation.toAdjective(tempName, gender);

	while(names.length > 0) {
		concatName += "-" + Translation.toAdjective(names[names.length - 1], gender);
		if(names.pop() !== tempName)
			allNamesSame = false;
	}

	if(!specialCount) {
		//X multi[family]
		if(allNamesSame)
			return Translation.addAdjective(
				Translation.toAdjective(tempName, gender),
				prefix + FAMILY
			);

		//X-Y-Z multi[family]
		return Translation.addAdjective(
			concatName,
			prefix + FAMILY
		);
	}

	//Same as before, but adds as many ...[family-adj] [family]	as needed at the end.
	if(allNamesSame)
		concatName = Translation.toAdjective(tempName, gender);

	//We aren't calling a single polytope X an "X mono[family]", are we?
	if(prefix)
		concatName = Translation.addAdjective(
			concatName,
			prefix + FAMILYADJ
		);

	while(--specialCount)
		concatName = Translation.addAdjective(
			concatName,
			SPECIALMODADJ
		);

	return Translation.addAdjective(
		concatName,
		SPECIALMOD
	);
};

//Spanish helper function.
//Adds a tilde to the last vowel of a word.
//E.g. penta -> pentá
Translation._lastVowelTilde = function(str) {
	for(var i = str.length - 1; i >= 0; i--)
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

	throw new Error("No vowel to replace!");
};

//https://stackoverflow.com/a/1431113
Translation._replaceAt = function(str, index, replacement) {
    return str.substr(0, index) + replacement + str.substr(index + replacement.length);
};

//Gives a name for {n / d}.
//For polygons with up to five non-compound stellations, uses the [small/-/medial/great/grand] n-gram naming scheme.
//For everything else, uses d-strophic n-gon.

//Possible options:
/* uppercase
 * gender
 * count */
Translation.regularPolygonName = function(n, d, options = {}) {
	if(d === undefined || d === 1)
		return Translation.plainName(n, 2);
	if(n === 3 && d === 1)
		return Translation.get("shape/triangle", options);
	if(n === 4 && d === 1)
		return Translation.get("shape/square", options);

	options.uppercase |= Translation.nounCapitalization;

	//"Crossed" polygons, as in the crossed pentagrammic antiprism.
	if(d > n / 2)
		return Translation.addAdjective(
			Translation.get("misc/crossed", {gender: options.gender}),
			Translation.regularPolygonName(n, n - d, Translation._lowercaseOptions(options)),
			{uppercase: options.uppercase},
		);

	//Counts the number of stellation non-compounds.
	var count,
	//Gets the index of {n/d} among these.
	index = 0,
	i = 2;

	//Any polygon with more than 42 sides has at least 6 non-compound stellations.
	if(n > 42)
		return Translation._simpleStarName(n, d);

	//Calculates the index.
	while(i < d)
		if(Polytope._gcd(n, i++) === 1 && ++index >= 5)
				return Translation._simpleStarName(n, d);

	count = index;

	//Calculates the count.
	while(i < n / 2)
		if(Polytope._gcd(n, i++) === 1 && ++count >= 5)
			return Translation._simpleStarName(n, d);

	//Adds the great, grand, etc. modifiers.
	//This system is complicated, don't blame me, I didn't make it.
	switch(count * 10 + index) {
		case 30: case 40:	case 50:
			return Translation._starName(n, "modifiers/small", options);
		case 52:
			return Translation._starName(n, "modifiers/medial", options);
		case 21: case 32: case 42: case 53:
			return Translation._starName(n, "modifiers/great", options);
		case 43: case 54:
			return Translation._starName(n, "modifiers/grand", options);
		default:
			return Translation._starName(n, undefined, options);
	}
};
/*
	//Adds plural and uppercase.
	//The plurals aren't always like this in the languages below, but they work for all polygon names.
	if(options.count) {
		switch(Translation.language) {
			case ENGLISH:
			case "es":
				res += "s"; break;
			case "de":
				res += "e"; break;
		}
	}
	if(options.uppercase)
		return Translation.firstToUpper(res);
	return res;
};*/


//Possible options:
/* uppercase
 * gender
 * count */
Translation._simpleStarName = function(n, d, options = {}) {
	return Translation.addAdjective(
		Translation.greekPrefix(d) + Translation.get("misc/strophic", options),
		Translation.get("grammar/starName",
		{
			prefix: Translation.greekPrefix(n),
			count: options.count,
			uppercase: Translation.nounCapitalization
		}),
		{uppercase: options.uppercase}
	);
};

//Helper function for regularPolygonName.
//Is the one actually giving the names.

//Possible options:
/* uppercase
 * gender
 * count */
Translation._starName = function(n, mod, options = {}) {
	//The base name of the star, e.g. "heptagram".
	var starName = Translation.get("grammar/starName",
	{
		prefix: Translation.greekPrefix(n),
		count: options.count,
	});

	//If there's no modifier, returns the name.
	if(!mod) {
		if(options.uppercase)
			return Translation.firstToUpper(starName);
		return starName;
	}

	//The base name with the modifier added, e.g. "great heptagram".
	return Translation.addAdjective(
		Translation.get(mod, {gender: options.gender}),
		starName,
		{uppercase: options.uppercase}
	);
};

//Clones the options and sets the uppercase attribute to false.
Translation._lowercaseOptions = function(options) {
	var newOptions = {...options};
	newOptions.uppercase = false;
	return newOptions;
};
