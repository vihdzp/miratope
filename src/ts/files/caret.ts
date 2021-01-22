import { Translation, LanguageOptions } from "../translation/translation";

export default class Caret {
  contents: string;
  pos: number;
  line: number;
  column: number;
  EOF: boolean;

  /**
   * Creates a new Caret.
   * @constructor
   * @classdesc A helper class for reading imported text files.
   * Reads through a file, keeping track of its position, line, and column.
   * @param contents The contents of the file.
   */
  constructor(contents: string) {
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
  }

  /** Moves the caret to the next column or the next line.
   * Automatically keeps track of [this.pos]{@linkcode Caret#pos},
   * [this.line]{@linkcode Caret#line}, [this.column]{@linkcode Caret#column}, and
   * [this.EOF]{@linkcode Caret#EOF}. Assumes Windows-style line endings.
   * @see [Caret.prototype.advance]{@linkcode Caret#advance}.
   * @todo Take care of Unix and Macintosh line endings.
   */
  increment(): void {
    if (this.getChar() === "\n") {
      this.line++;
      this.column = 0;
    } else this.column++;
    //Checks if next position is the EOF
    this.EOF = ++this.pos > this.contents.length;
  }

  /**
   * Shortcut for calling [Caret.prototype.increment]{@linkcode Caret#increment}
   * repeatedly.
   * @param n The number of times to call
   * [Caret.prototype.increment]{@linkcode Caret#increment}-
   */
  advance(n: number): void {
    for (let i = 0; i < n; i++) this.increment();
  }

  /** Gets the character at the caret.
   * @returns The current character.
   */
  getChar(): string {
    return this.contents[this.pos];
  }

  /**
   * Increments the caret but skips whitespaces, new lines, and comments.
   * Leaves the caret at the beginning of the next "content".
   */
  skipToContent(): void {
    while (!this.EOF) {
      switch (this.getChar()) {
        case "\n": //New Line (\n)
        case "\r": //Carriage Return (\r)
        case " ": //Skips Whitespace
          this.increment();
          break;
        case "#": //Skips Comments
          this.increment();
          //A comment lasts from the # until the end of the line.
          //Increments until you hit the EOF or a new line character.
          while (!this.EOF && this.getChar() !== "\n") this.increment();
          this.increment();
          break;
        default:
          return;
      }
    }
  }

  /**
   * Increments the caret until a certain character is reached.
   * Caret ends up before the character.
   * @param char A character to search for.
   * @example
   * var C = new Caret("The quick brown fox jumps over the lazy dog.");
   * C.skipToChar('q');
   * //The |quick brown fox jumps over the lazy dog.
   *
   * //4
   * console.log(C.pos);
   */
  skipToChar(char: string): void {
    while (!this.EOF && this.getChar() !== char) this.increment();
  }

  /**
   * Increments the caret until a certain string is read.
   * Caret ends up after the string.
   * @see [Caret.prototype.skipToStringList]{@linkcode Caret#skipToStringList}.
   * @param str A string to search for.
   * @example
   * var C = new Caret("The quick brown fox jumps over the lazy dog.");
   * C.skipToString("fox");
   * //The quick brown fox| jumps over the lazy dog.
   *
   * //19
   * console.log(C.pos);
   */
  skipToString(str: string): void {
    let matches = 0;

    while (!this.EOF && matches < str.length) {
      if (this.getChar() === str[matches]) matches++;
      else matches = 0;
      this.increment();
    }
  }

  /**
   * Increments the caret until one in a list of strings is read.
   * Caret ends up after the string.
   * @see [Caret.prototype.skipToString]{@linkcode Caret#skipToString}.
   * @param {string[]} strs The list of strings to search for.
   * @returns The index of the first found string.
   * @example
   * var C = new Caret("The quick brown fox jumps over the lazy dog.");
   * C.skipToStringList(["quick", "lazy"]);
   * //The quick| brown fox jumps over the lazy dog.
   *
   * //9
   * console.log(C.pos);
   */
  skipToStringList(strs: string[]): number {
    //Counts the amount of matching letters per string.
    const matches: number[] = [];

    while (!this.EOF) {
      const c = this.getChar();

      //Updates matches.
      for (let i = 0; i < strs.length; i++) {
        if (c === strs[i][matches[i]]) matches[i]++;
        else matches[i] = 0;
      }

      this.increment();

      //Checks if a match was completed.
      for (let i = 0; i < strs.length; i++)
        if (matches[i] >= strs[i].length) return i;
    }

    return -1; //EOF.
  }

  /**
   * Reads the next word from the caret position until a whitespace, newline or
   * hash appears.
   * Caret automatically [skips to next content]{@link Caret#skipToContent}
   * afterwards.
   * @returns The read word.
   * @throws Will throw an error if the caret is currently at the EOF.
   * @throws Will throw an error if the read number is invalid.
   */
  readWord(): string {
    if (this.EOF)
      //EOF error
      this.throwError("unexpectedEOF");

    const initIndx = this.pos;

    WHILELOOP: do {
      switch (this.getChar()) {
        case "\n": //New Line (\n)
        case "\r": //Carriage Return (\r)
        case " ": //Space ( )
        case "#": //Hashtag (#)
          break WHILELOOP; //Leave the do-while loop immediately
        default:
          this.increment();
          break;
      }
    } while (!this.EOF); //Until you hit the EOF.

    const endIndx = this.pos;
    this.skipToContent();

    //Returns the substring found
    return this.contents.substr(initIndx, endIndx - initIndx);
  }

  /**
   * Advances the caret until a certain character is reached.
   * Places the caret at the left of such char.
   * @param char The searched-for character.
   * @returns The read substring.
   */
  readUntil(char: string): string {
    if (this.EOF)
      //EOF error
      this.throwError("unexpectedEOF");

    const initIndx = this.pos;

    do {
      if (this.getChar() === char) break;
      //Leave the do-while loop immediately
      else this.increment();
    } while (!this.EOF); //Until you hit the EOF.

    //Returns the substring found
    return this.contents.substr(initIndx, this.pos - initIndx);
  }

  /**
   * Reads the next number from the caret position, until a non-numeric char
   * appears. Supports numbers in the scientific notation format (e.g. 1E+10).
   * Caret automatically [skips to next content]{@link Caret#skipToContent}
   * afterwards.
   * @returns The read number, or `NaN` if the caret isn't immmediately
   * before a number.
   * @throws Will throw an error if the caret is currently at the EOF.
   * @throws Will throw an error if the read number is invalid.
   */
  readNumber(): number {
    if (this.EOF)
      //EOF error
      this.throwError("unexpectedEOF");

    const initIndx = this.pos;

    WHILELOOP: do {
      switch (this.getChar()) {
        case "+":
        case "-":
        case ".":
        case "e":
        case "E":
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
          this.increment();
          break;
        default:
          break WHILELOOP; //Leave the do-while loop immediately
      }
    } while (!this.EOF); //Until you hit EOF

    const endIndx = this.pos;
    this.skipToContent();

    //We return NaN only when the read number is in fact the empty string.
    if (endIndx === initIndx) return NaN;

    const res = parseFloat(this.contents.substr(initIndx, endIndx - initIndx));
    if (isNaN(res)) this.throwError("invalidNumber");
    return res;
  }

  /**
   * Throws an error corresponding to the error code.
   * Automatically inserts the line and column numbers
   * into the error message.
   * @throws The corresponding error.
   */
  throwError(code: string): never {
    throw new Error(
      Translation.get("error/" + code, {
        line: this.line,
        column: this.column,
      } as LanguageOptions)
    );
  }
}
