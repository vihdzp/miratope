//Helper class for toAdjective.
//Stores endings of words and what to do with them.
//string: the pattern of the end of a word.
//sliceDepth: The negative of how many characters at the end are removed.
//newEnding: the new characters added.
//genderModificationType: Does different things depending of the gender of the substantive.
function Ending(string, sliceDepth, newEnding, genderModificationType) {
	this.string = string;
	this.sliceDepth = sliceDepth;
	this.newEnding = newEnding;
	this.genderModificationType = genderModificationType;
};

const SPANISH_MODIFIER = 0;
//Adds a gender modifier at the end of a word.
Ending.prototype.genderModifier = function(gender) {
	switch(this.genderModificationType) {
		case undefined:
			return "";
		case SPANISH_MODIFIER:
			if(gender === MALE)
				return "o";
			return "a";
		default:
			throw new Error("Invalid gender modifier!");
	}
}

//Changes the ending of a word, depending on the slice depth and the new ending.
Ending.prototype.changeEnding = function(name, gender) {
	if(!this.sliceDepth)
		return name + this.newEnding;
	return name.slice(0, this.sliceDepth) + this.newEnding + this.genderModifier(gender);
};

//Compares the kth to last (and therefore the last k characters backwards) of name with _endings kth entry, 
//in alphabetical order.
Ending.compare = function(name, indx, k) {
	var endingStr = Names._endings[LANGUAGE][indx].string,
	i = name.length - k,
	j = endingStr.length - k;
	
	//This can only happen if there's another longer matching string.
	if(k > endingStr.length + 1)
		return 1;
	
	//We only really need to check the kth character; the rest have been checked before.
	if(name.charAt(i).toLowerCase() < endingStr.charAt(j).toLowerCase())
		return -1;
	if(name.charAt(i).toLowerCase() > endingStr.charAt(j).toLowerCase())
		return 1;	

	return 0;
};