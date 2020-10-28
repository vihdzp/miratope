//Helper class for toAdjective.
//Stores endings of words and what to do with them.
//string: the pattern of the end of a word.
//sliceDepth: The negative of how many characters at the end are removed.
//newEnding: the new characters added.
//genderModificationType: Does different things depending of the gender of the substantive.

//There's a second constructor, that takes only a string and a custom function.
//sliceDepth doubles as this custom function if newEnding is undefined.
function Ending(string, sliceDepth, newEnding, genderModificationType) {
	this.string = string;
	if(newEnding === undefined)
		this.customFunction = sliceDepth;
	else {
		this.sliceDepth = sliceDepth;
		this.newEnding = newEnding;
		this.genderModificationType = genderModificationType;
	}
};

const SPANISH_MODIFIER = 0;
const GERMAN_MODIFIER = 1;

//Adds a gender modifier at the end of a word.
//May require some extra logic in case some words behave weirdly.
Ending.prototype.genderModifier = function(gender) {
	switch(this.genderModificationType) {
		case undefined: //Does not modify a word at all.
			return "";
		case SPANISH_MODIFIER: //Adds an o for masculine nouns, an a for femenine nouns.
			if(gender === "male")	return "o";
			return "a";
		case GERMAN_MODIFIER: //Adds an er for masculine nouns, an e for femenine nouns, and an es for netural nouns.
			switch(gender) {
				case "male": return "er";
				case "female": return "e";
				default: return "es";
			}
		default:
			throw new Error("Invalid gender modifier!");
	}
}

//Changes the ending of a word, depending on the slice depth and the new ending.
Ending.prototype.changeEnding = function(name, gender) {
	if(this.customFunction === undefined) {
		if(this.sliceDepth === 0)
			return name + this.newEnding;
		return name.slice(0, this.sliceDepth) + this.newEnding + this.genderModifier(gender);
	}
	return this.customFunction(name, gender);
};

//Compares the kth to last (and therefore the last k characters backwards) of name with _endings kth entry,
//in alphabetical order.
Ending.compare = function(name, endingStr, k) {
	i = name.length - k,
	j = endingStr.length - k;

	//This must be the backup ending, so let's check to the right of that.
	if(j <= -1)
		return 1;

	//We only really need to check the kth character; the rest have been checked before.
	if(name.charAt(i).toLowerCase() < endingStr.charAt(j).toLowerCase())
		return -1;
	if(name.charAt(i).toLowerCase() > endingStr.charAt(j).toLowerCase())
		return 1;

	return 0;
};
