import { Position } from 'vscode';


export enum CharType {
    asciiAlphabet,  // contains number
    asciiSymbol,
    asciiBracket,
    kanji,
    kana,
    alphabet,
    symbol,
    bracket,
    whitespace,
    crlf,
    other,
}

export interface CharData {
    type: CharType
    prevIndex: number
    nextIndex: number
}

interface LineData {
    original: string
    characters: CharData[]
}

export class TextAnalyzer {
    private _lines: LineData[] = [];

    private readonly _regAsciiAlphabet = new RegExp('[a-zA-Z0-9]');
    private readonly _regAsciiSymbol = new RegExp('[!-\'\\*-/:;=?@\\\\\\^_`|~]');
    private readonly _regAsciiBracket = new RegExp('[\\(\\)<>\\[\\]{}]');
    private readonly _regKanji = new RegExp('[\u4e00-\u9fcf\uf900-\ufaff\u3400-\u4dbf\u3005-\u3007\u303b\u30f6]');
    private readonly _regKana = new RegExp('[\u3041-\u309f\u30fc\u30a0\u30a0-\u30ff\u31f0-\u31ff\uff65-\uff9f]');
    private readonly _regAlphabet = new RegExp('[\uff10-\uff19\uff21-\uff3a\uff41-\uff5a]');
    private readonly _regSymbol = new RegExp('[\uff01-\uff07\uff0a-\uff0f\uff1a\uff1b\uff1d\uff1f\uff20\uff3c\uff3e\uff3f\uff40\uff5c\uff5e]');
    private readonly _regBracket = new RegExp('[\u300a\u300b\uff08\uff09\uff1c\uff1e\uff3b\uff3d\uff5b\uff5d]');
    private readonly _regWhitespace = new RegExp('[ \u3000\\t]');
    private readonly _regCrlf = new RegExp('[\\r\\n]');

    public update(text: string): number {
        let characterCount = 0;
        const lines = text.split('\n');
        this._lines = lines.map((line, index) => {
            if (line.endsWith('\r')) {
                line = line.substr(0, line.length - 1);
            }
            // count number of characters
            characterCount += line.length;
            // check the change
            if (index < this._lines.length) {
                if (this._lines[index].original === line) {
                    // This line has not been updated.
                    return this._lines[index];
                }
            }
            // update
            return {
                original: line,
                characters: this._analyze(line)
            };
        });
        return characterCount;
    }

    public right(line: number, character: number): Position {
        const pos = this._rangeCheck(line, character);
        if (pos) {
            return pos;
        }

        const characters = this._lines[line].characters;
        let retLine = line;
        let retCharacter = characters.length;
        if (character === characters.length) {
            // The cursor is set at right of last character.
            // move to next line.
            if ((line + 1) < this._lines.length) {
                retLine = line + 1;
                retCharacter = 0;
            }
        } else {
            for (let i = character + 1; i < characters.length; i++) {
                if (characters[i - 1].type !== characters[i].type) {
                    retCharacter = i;
                    break;
                }
            }
        }
        return new Position(retLine, retCharacter);
    }


    public left(line: number, character: number): Position {
        const pos = this._rangeCheck(line, character);
        if (pos) {
            return pos;
        }

        const characters = this._lines[line].characters;
        let retLine = line;
        let retCharacter = 0;
        if (character === 0) {
            if (line === 0) {
                retLine = line;
            } else {
                // previous line
                retLine = line - 1;
                retCharacter = this._lines[retLine].characters.length;
            }
        } else {
            for (let i = character - 1; i > 0; i--) {
                if (characters[i - 1].type !== characters[i].type) {
                    retCharacter = i;
                    break;
                }
            }
        }
        return new Position(retLine, retCharacter);
    }

    public leftWord(line: number, character: number): Position {
        const pos = this._rangeCheck(line, character);
        if (pos) {
            return pos;
        }

        const characters = this._lines[line].characters;
        let retLine = line;
        let retCharacter = 0;
        if (character === 0) {
            retLine = line;
            retCharacter = character;
        } else if (characters[character - 1].type !== CharType.kanji && characters[character - 1].type !== CharType.kana) {
            retLine = line;
            retCharacter = character;
        } else {
            for (let i = character - 1; i > 0; i--) {
                // kanji <- kanaの並びは送り仮名
                // other <- kanjiの並びは終了
                // required at least one kanji.
                if (characters[i - 1].type !== characters[i].type) {
                    if (characters[i].type === CharType.kanji) {
                        retCharacter = i;
                        break;
                    } else if (characters[i - 1].type === CharType.kanji && characters[i].type === CharType.kana) {
                        //送り仮名から漢字
                    } else {
                        retCharacter = character;
                        break;
                    }
                }
            }
        }
        return new Position(retLine, retCharacter);
    }

    public trimKana(text: string): string {
        if (text.length === 0) {
            return text;
        }
        let trimmed = false;
        for (let i = text.length - 1; i >= 0; i--) {
            if (this._isKanji(text.charAt(i))) {
                text = text.substring(0, i + 1);
                trimmed = true;
                break;
            }
        }
        if (!trimmed) {
            text = '';
        }
        return text;
    }

    public trimOkurigana(text: string, ruby: string): { text: string, ruby: string } {
        let rubyPos = ruby.length - 1;
        if (text.length === 0 || ruby.length === 0 || !this._isKanji(text.charAt(0))) {
            return { text: text, ruby: ruby };
        }
        for (let i = text.length - 1; i > 0; i--) {
            if (!this._isKana(text.charAt(i))) {
                break;
            }
            if (text.charAt(i) === ruby.charAt(rubyPos)) {
                text = text.substring(0, i);
                ruby = ruby.substring(0, rubyPos);
                rubyPos--;
            } else {
                break;
            }
            if (rubyPos < 0) {
                break;
            }
        }
        return { text: text, ruby: ruby };
    }

    private _rangeCheck(line: number, character: number): Position | undefined {
        if (line < 0) {
            return new Position(0, 0);
        }
        if (line >= this._lines.length) {
            const length = this._lines[this._lines.length - 1].characters.length;
            const lineLength = (length <= 0) ? 0 : (length - 1);
            return new Position(this._lines.length - 1, lineLength);
        }
        if (character < 0) {
            return new Position(line, 0);
        }
        const characters = this._lines[line].characters;
        if (character > characters.length) {
            // The cursor can be set right of last character.
            return new Position(line, characters.length);
        }
        return undefined;
    }

    private _analyze(line: string): CharData[] {
        const chardata: CharData[] = [];

        for (let i = 0; i < line.length; i++) {
            const c = line.charAt(i);
            if (this._isAsciiAlphabet(c)) {
                chardata[i] = { type: CharType.asciiAlphabet, prevIndex: 0, nextIndex: 0 };
            } else if (this._isAsciiSymbol(c)) {
                chardata[i] = { type: CharType.asciiSymbol, prevIndex: 0, nextIndex: 0 };
            } else if (this._isAsciiBracket(c)) {
                chardata[i] = { type: CharType.asciiBracket, prevIndex: 0, nextIndex: 0 };
            } else if (this._isKanji(c)) {
                chardata[i] = { type: CharType.kanji, prevIndex: 0, nextIndex: 0 };
            } else if (this._isKana(c)) {
                chardata[i] = { type: CharType.kana, prevIndex: 0, nextIndex: 0 };
            } else if (this._isAlphabet(c)) {
                chardata[i] = { type: CharType.alphabet, prevIndex: 0, nextIndex: 0 };
            } else if (this._isSymbol(c)) {
                chardata[i] = { type: CharType.symbol, prevIndex: 0, nextIndex: 0 };
            } else if (this._isBracket(c)) {
                chardata[i] = { type: CharType.bracket, prevIndex: 0, nextIndex: 0 };
            } else if (this._isWhitespace(c)) {
                chardata[i] = { type: CharType.whitespace, prevIndex: 0, nextIndex: 0 };
            } else if (this._isCrlf(c)) {
                chardata[i] = { type: CharType.crlf, prevIndex: 0, nextIndex: 0 };
            } else {
                chardata[i] = { type: CharType.other, prevIndex: 0, nextIndex: 0 };
            }
        }
        return chardata;
    }

    private _isAsciiAlphabet(char: string): boolean {
        return char.match(this._regAsciiAlphabet) !== null;
    }

    private _isAsciiSymbol(char: string): boolean {
        return char.match(this._regAsciiSymbol) !== null;
    }

    private _isAsciiBracket(char: string): boolean {
        return char.match(this._regAsciiBracket) !== null;
    }

    private _isKanji(char: string): boolean {
        return char.match(this._regKanji) !== null;
    }

    private _isKana(char: string): boolean {
        return char.match(this._regKana) !== null;
    }

    private _isAlphabet(char: string): boolean {
        return char.match(this._regAlphabet) !== null;
    }

    private _isSymbol(char: string): boolean {
        return char.match(this._regSymbol) !== null;
    }

    private _isBracket(char: string): boolean {
        return char.match(this._regBracket) !== null;
    }

    private _isWhitespace(char: string): boolean {
        return char.match(this._regWhitespace) !== null;
    }

    private _isCrlf(char: string): boolean {
        return char.match(this._regCrlf) !== null;
    }
}
