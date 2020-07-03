"use strict";

function Caret(contents) {
	this.contents = contents;
	this.pos = 0;
	this.line = 0;
	this.col = 0;
	this.EOF = contents.length === 0;
	this.skipToContent();
};

Caret.prototype.increment = function() {
	if(this.charCode() === 10) { //New line.
		this.line++;
		this.col = 0;
	}
	else
		this.col++;
	this.EOF = ++this.pos > this.contents.length; //Increments pos, checks for EOF.
};

//Gets char code of current character.
Caret.prototype.charCode = function() {
	return this.contents.charCodeAt(this.pos);
}

//Increments the caret, skipping over whitespaces, newlines, and comments.
//Runs automatically every time a read function is called.
Caret.prototype.skipToContent = function() {
	while(!this.EOF) {
		switch(this.charCode()) {
			case 10: //'\n'
			case 13: //'\r'
			case 32: //' '
				this.increment(); break;
			case 35: //'#': A comment lasts from the # until the end of the line.
				this.increment();
				while(!this.EOF && this.charCode() !== 10)
					this.increment();
				this.increment();
				break;
			default:
				return;
		}
	}
};

//Reads the next number from the caret position, until a whitespace, newline or hash appears.
Caret.prototype.readWord = function() {
	if(this.EOF)	
		this.throwError("unexpectedEOF");
	
	var initIndx = this.pos, endIndx;
	
	WHILELOOP:
	do {
		switch(this.charCode()) {
			case 10: //'\n'
			case 13: //'\r'
			case 32: //' '
			case 35: //'#'
				break WHILELOOP;
			default:
				this.increment();
				break;
		}
	}
	while(!this.EOF);
	
	endIndx = this.pos;
	this.skipToContent();
	return this.contents.substr(initIndx, endIndx - initIndx);
};

//Helper function for openOFF.
//Reads the next number from the caret position, until a non-numeric character appears.
//Supports numbers in the scientific notation format (e.g. 1E+10).
Caret.prototype.readNumber = function() {
	if(this.EOF)	
		this.throwError("unexpectedEOF");
	
	var initIndx = this.pos, endIndx;

	WHILELOOP:
	do {
		switch(this.charCode()) {
			case 43: //+
			case 45: //-
			case 46: //.
			case 69: //e
			case 101: //E
			case 48: case 49: case 50: case 51: case 52: case 53: case 54: case 55: case 56: case 57: //0-9
				this.increment();
				break;
			default:
				break WHILELOOP;
		}
	}
	while(!this.EOF);
	
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
	throw new Error(Translation.get(code) + "\n" + Translation.get("line", UPPERCASE) + " " + this.line + ", " + Translation.get("column") + " " + this.col + ".");
};