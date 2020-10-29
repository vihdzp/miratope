"use strict";

/**
 * Constructor for Caret.
 * @constructor
 * @classdesc A helper class for reading imported text files.
 * Reads through a file, keeping track of its position, line, and column.
 * @param {string} contents The contents of the file.
 */
function Caret(contents) {
	this.contents = contents;
	/** The current position of the caret.
	 * @type {number} */
	this.pos = 0;
	/** The line number of the caret.
	 * @type {number} */
	this.line = 0; //Line
	/** The column number of the caret.
	 * @type {number} */
	this.column = 0;
	/** Stores whether the caret has reached the end of the file or not.
	 * @type {boolean} */
	this.EOF = contents.length === 0;
	this.skipToContent();
};

/** Moves the caret to the next column or the next line.
 * Automatically keeps track of [this.pos]{@linkcode Caret#pos},
 * [this.line]{@linkcode Caret#line}, [this.column]{@linkcode Caret#column}, and
 * [this.EOF]{@linkcode Caret#EOF}. Assumes Windows-style line endings.
 * @see [Caret.prototype.advance]{@linkcode Caret#advance}.
 * @todo Take care of Unix and Macintosh line endings.
 */
Caret.prototype.increment = function() {
	if(this.getChar() === '\n') {
		this.line++;
		this.column = 0;
	}
	else
		this.column++;
	this.EOF = ++this.pos > this.contents.length; //Checks if next position is the EOF
};

/**
 * Shortcut for calling [Caret.prototype.increment]{@linkcode Caret#increment}
 * repeatedly.
 * @param {number} n The number of times to call
 * [Caret.prototype.increment]{@linkcode Caret#increment}-
 */
Caret.prototype.advance = function(n) {
	for(var i = 0; i < n; i++)
		this.increment();
};

/** Gets the character at the caret.
 * @returns {string} The current character.
 */
Caret.prototype.getChar = function() {
	return this.contents[this.pos];
};

/**
 * Increments the caret but skips whitespaces, new lines, and comments.
 * Leaves the caret at the beginning of the next "content".
 */
Caret.prototype.skipToContent = function() {
	while(!this.EOF) {
		switch(this.getChar()) {
			case '\n': //New Line (\n)
			case '\r': //Carriage Return (\r)
			case ' ':  //Skips Whitespace
				this.increment(); break;
			case '#':  //Skips Comments
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

/**
 * Increments the caret until a certain character is reached.
 * Caret ends up before the character.
 * @param {string} char A character to search for.
 * @example
 * var C = new Caret("The quick brown fox jumps over the lazy dog.");
 * C.skipToChar('q');
 * //The |quick brown fox jumps over the lazy dog.
 *
 * //4
 * console.log(C.pos);
 */
 Caret.prototype.skipToChar = function(char) {
	while(!this.EOF && this.getChar() !== char)
		this.increment();
};

/**
 * Increments the caret until a certain string is read.
 * Caret ends up after the string.
 * @see [Caret.prototype.skipToStringList]{@linkcode Caret#skipToStringList}.
 * @param {string} str A string to search for.
 * @example
 * var C = new Caret("The quick brown fox jumps over the lazy dog.");
 * C.skipToString("fox");
 * //The quick brown fox| jumps over the lazy dog.
 *
 * //19
 * console.log(C.pos);
 */
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

/**
 * Increments the caret until one in a list of strings is read.
 * Caret ends up after the string.
 * @see [Caret.prototype.skipToString]{@linkcode Caret#skipToString}.
 * @param {string[]} strs The list of strings to search for.
 * @returns {number} The index of the first found string.
 * @example
 * var C = new Caret("The quick brown fox jumps over the lazy dog.");
 * C.skipToStringList(["quick", "lazy"]);
 * //The quick| brown fox jumps over the lazy dog.
 *
 * //9
 * console.log(C.pos);
 */
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

/**
 * Reads the next word from the caret position until a whitespace, newline or hash appears.
 * appears.
 * Caret automatically [skips to next content]{@link Caret#skipToContent}
 * afterwards.
 * @returns {number} The read number, or `NaN` if the caret isn't immmediately
 * before a number.
 * @throws Will throw an error if the caret is currently at the EOF.
 * @throws Will throw an error if the read number is invalid.
 */
Caret.prototype.readWord = function() {
	if(this.EOF) //EOF error
		this.throwError("unexpectedEOF");

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


/**
 * Advances the caret until a certain character is reached.
 * Places the caret at the left of such char.
 * @param {string} char The searched-for character.
 * @returns {string} The read substring.
 */
Caret.prototype.readUntil = function(char) {
	if(this.EOF) //EOF error
		this.throwError("unexpectedEOF");

	var initIndx = this.pos, endIndx;

	do {
		if(this.getChar() === char)
			break; //Leave the do-while loop immediately
		else
			this.increment();
	}
	while(!this.EOF); //Until you hit the EOF.

	var endIndx = this.pos;

	//Returns the substring found
	return this.contents.substr(initIndx, endIndx - initIndx);
};

/**
 * Reads the next number from the caret position, until a non-numeric character
 * appears. Supports numbers in the scientific notation format (e.g. 1E+10).
 * Caret automatically [skips to next content]{@link Caret#skipToContent}
 * afterwards.
 * @returns {number} The read number, or `NaN` if the caret isn't immmediately
 * before a number.
 * @throws Will throw an error if the caret is currently at the EOF.
 * @throws Will throw an error if the read number is invalid.
 */
Caret.prototype.readNumber = function() {
	if(this.EOF) //EOF error
		this.throwError("unexpectedEOF");

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

/**
 * Throws an error corresponding to the error code.
 * Automatically inserts the line and column numbers
 * into the error message.
 * @throws The corresponding error.
 */
Caret.prototype.throwError = function(code) {
	throw new Error(
		Translation.get("error/" + code,
		{
			line: this.line,
			column: this.column
		}
	));
};
