"use strict";

//Used for reading imported files
//"Caret" is another name for the pointer

//Sets the starting state of the caret at the beginning of the file
function Caret(contents) {
	this.contents = contents;
	this.pos = 0;  //Position
	this.line = 0; //Line
	this.col = 0;  //Column
	this.EOF = contents.length === 0; //EOF is "End Of File"
	this.skipToContent();
};

//Moves the caret to the next column or the next line
Caret.prototype.increment = function() {
	if(this.charCode() === 10) { //10 is the new line character (\n)
		this.line++;
		this.col = 0;
	}
	else
		this.col++;
	this.EOF = ++this.pos > this.contents.length; //Checks if next position is the EOF
};

//Gets char code of current character
Caret.prototype.charCode = function() {
	return this.contents.charCodeAt(this.pos);
}

//Increments the caret but skips whitespaces, new lines, and comments
//Runs automatically every time a read function is called
Caret.prototype.skipToContent = function() {
	while(!this.EOF) {
		switch(this.charCode()) {
			case 10: //New Line (\n)
			case 13: //Carriage Return (\r)
			case 32: //Space ( )
				this.increment(); break;
			case 35: //Hashtag (#)
				this.increment();
				//A comment lasts from the # until the end of the line.
				//Increments until you hit the EOF or a new line character.
				while(!this.EOF && this.charCode() !== 10)
					this.increment();
				this.increment();
				break;
			default:
				return;
		}
	}
};

//Reads the next number from the caret position until a whitespace, newline or hash appears
Caret.prototype.readWord = function() {
	if(this.EOF) //EOF error
		this.throwError("unexpected EOF");

	var initIndx = this.pos, endIndx;

	WHILELOOP:
	do {
		switch(this.charCode()) {
			case 10: //New Line (\n)
			case 13: //Carriage Return (\r)
			case 32: //Space ( )
			case 35: //Hashtag (#)
				break WHILELOOP; //Leave the do-while loop immediately
			default:
				this.increment();
				break;
		}
	}
	while(!this.EOF); //Until you hit the EOF.

	endIndx = this.pos;
	this.skipToContent();
	//Returns the substring found
	return this.contents.substr(initIndx, endIndx - initIndx);
};

//Helper function for openOFF
//Reads the next number from the caret position, until a non-numeric character appears
//Supports numbers in the scientific notation format (e.g. 1E+10)
Caret.prototype.readNumber = function() {
	if(this.EOF) //EOF error
		this.throwError("unexpected EOF");

	var initIndx = this.pos, endIndx;

	WHILELOOP:
	do {
		switch(this.charCode()) {
			case 43:  // (+)
			case 45:  // (-)
			case 46:  // (.)
			case 69:  // (e)
			case 101: // (E)
			case 48: case 49: case 50: case 51: case 52: case 53: case 54: case 55: case 56: case 57: // (0) to (9)
				this.increment();
				break;
			default:
				break WHILELOOP; //Leave the do-while loop immediately
		}
	}
	while(!this.EOF); //Until you hit EOF

	endIndx = this.pos;
	this.skipToContent();

	//We return NaN only when the read number is in fact the empty string.
	if(endIndx === initIndx)
		return NaN;

	var res = parseFloat(this.contents.substr(initIndx, endIndx - initIndx));
	if(isNaN(res))
		this.throwError("invalidNumber");
	return res;
};

Caret.prototype.throwError = function(code) {
	throw new Error(
		Translation.get(code) + "\n"
		+ Translation.get("line", UPPERCASE) + " " 	+ this.line + ", "
		+ Translation.get("column") + " " + this.col + "."
	);
};
