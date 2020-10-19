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
	if(this.getChar() === '\n') {
		this.line++;
		this.col = 0;
	}
	else
		this.col++;
	this.EOF = ++this.pos > this.contents.length; //Checks if next position is the EOF
};

//Shortcut for calling increment repeatedly.
Caret.prototype.advance = function(n) {
	for(var i = 0; i < n; i++)
		this.increment();
}

//Gets current character
Caret.prototype.getChar = function() {
	return this.contents[this.pos];
}

//Increments the caret but skips whitespaces, new lines, and comments
//Runs automatically every time a read function is called
Caret.prototype.skipToContent = function() {
	while(!this.EOF) {
		switch(this.getChar()) {
			case '\n': //New Line (\n)
			case '\r': //Carriage Return (\r)
			case ' ': //Space ( )
				this.increment(); break;
			case '#': //Hashtag (#)
				this.increment();
				//A comment lasts from the # until the end of the line.
				//Increments until you hit the EOF or a new line character.
				while(!this.EOF && this.getChar() !== '\n')
					this.increment();
				this.increment();
				break;
			default:
				return;
		}
	}
};

//Increments the caret until a certain char is reached.
Caret.prototype.skipToChar = function(c) {
	while(!this.EOF && this.getChar() !== c)
		this.increment();
};

//Increments the caret until a certain string is read.
//Caret ends up after the string.
Caret.prototype.skipToString = function(str) {
	var matches = 0;

	while(!this.EOF && matches < str.length) {
		if(this.getChar() === str[matches])
			matches++;
		else
			matches = 0;
		this.increment();
	}
};

//Increments the caret until one of a list of strings is read.
//Returns the index of the read string.
//Caret ends up after the string.
Caret.prototype.skipToStringList = function(strs) {
	var matches = []; //Counts the amount of matching letters per string.

	while(!this.EOF) {
		var c = this.getChar();

		//Updates matches.
		for(var i = 0; i < strs.length; i++) {
			if(c === strs[i][matches[i]])
				matches[i]++;
			else
				matches[i] = 0;
		}

		this.increment();

		//Checks if a match was completed.
		for(var i = 0; i < strs.length; i++)
			if(matches[i] >= strs[i].length)
				return i;
	}

	return -1; //EOF.
};

//Reads the next number from the caret position until a whitespace, newline or hash appears.
//Caret skips to next content.
Caret.prototype.readWord = function() {
	if(this.EOF) //EOF error
		this.throwError("unexpected EOF");

	var initIndx = this.pos, endIndx;

	WHILELOOP:
	do {
		switch(this.getChar()) {
			case '\n': //New Line (\n)
			case '\r': //Carriage Return (\r)
			case ' ': //Space ( )
			case '#': //Hashtag (#)
				break WHILELOOP; //Leave the do-while loop immediately
			default:
				this.increment();
				break;
		}
	}
	while(!this.EOF); //Until you hit the EOF.

	var endIndx = this.pos;
	this.skipToContent();

	//Returns the substring found
	return this.contents.substr(initIndx, endIndx - initIndx);
};

Caret.prototype.readUntil = function(c) {
	if(this.EOF) //EOF error
		this.throwError("unexpected EOF");

	var initIndx = this.pos, endIndx;

	WHILELOOP:
	do {
		if(this.getChar() === c)
			break; //Leave the do-while loop immediately
		else {
			this.increment();
		}
	}
	while(!this.EOF); //Until you hit the EOF.

	var endIndx = this.pos;

	//Returns the substring found
	return this.contents.substr(initIndx, endIndx - initIndx);
}

//Reads the next number from the caret position, until a non-numeric character appears
//Supports numbers in the scientific notation format (e.g. 1E+10)
//Caret ends up after the number.
Caret.prototype.readNumber = function() {
	if(this.EOF) //EOF error
		this.throwError("unexpected EOF");

	var initIndx = this.pos, endIndx;

	WHILELOOP:
	do {
		switch(this.getChar()) {
			case '+':
			case '-':
			case '.':
			case 'e':
			case 'E':
			case '0': case '1': case '2': case '3': case '4':
			case '5': case '6': case '7': case '8': case '9':
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
