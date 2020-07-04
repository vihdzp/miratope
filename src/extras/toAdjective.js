"use strict";

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
	new Ending("go", -1, "mátic", SPANISH_MODIFIER) //Teg(o/mátic[o/a])
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