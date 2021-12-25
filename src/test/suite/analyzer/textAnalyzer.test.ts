/* eslint-disable @typescript-eslint/no-explicit-any */
import * as assert from 'assert';

import * as vscode from 'vscode';
import * as analyzer from '../../../analyzer/index';
import { CharType } from '../../../analyzer/textAnalyzer';

suite('TextAnalyzer Test Suite', () => {

    test('right test', () => {
        const textAnalyzer = new analyzer.TextAnalyzer();

        const text = '# 百人一首\r\n'
            + '**花の _色_ は** 移りにけりな いたづらに\r\n'
            + '__わが＊身世＊にふる__ ながめせしまに\r\n'
            + '\r\n'
            + '```\r\n'
            + '千早振る　神代もきかず　竜田川\r\n'
            + '     から紅に　水くくるとは\r\n'
            + '```\r\n';
        const lines = text.split('\n');
        const lastLineNo = lines.length - 1;
        textAnalyzer.update(text);

        assert.deepStrictEqual(textAnalyzer.right(-1, -1), new vscode.Position(0, 0), 'under line');
        assert.deepStrictEqual(textAnalyzer.right(1, -1), new vscode.Position(1, 0), 'under character');
        assert.deepStrictEqual(textAnalyzer.right(lines.length, lines[lastLineNo].length), new vscode.Position(lastLineNo, lines[lastLineNo].length), 'over line');
        assert.deepStrictEqual(textAnalyzer.right(1, lines[1].length + 1), new vscode.Position(1, lines[1].length - 1), 'over character');

        assert.deepStrictEqual(textAnalyzer.right(0, 0), new vscode.Position(0, 1), '0,0 -> 0,1');
        assert.deepStrictEqual(textAnalyzer.right(0, 1), new vscode.Position(0, 2), '0,1 -> 0,2');
        assert.deepStrictEqual(textAnalyzer.right(0, 2), new vscode.Position(0, 6), '0,2 -> 0,6');
        assert.deepStrictEqual(textAnalyzer.right(0, 6), new vscode.Position(1, 0), '0,6 -> 1,0');

        assert.deepStrictEqual(textAnalyzer.right(1, 0), new vscode.Position(1, 2), '1,0 -> 1,2');
        assert.deepStrictEqual(textAnalyzer.right(1, 2), new vscode.Position(1, 3), '1,2 -> 1,3');
        assert.deepStrictEqual(textAnalyzer.right(1, 3), new vscode.Position(1, 4), '1,3 -> 1,4');
        assert.deepStrictEqual(textAnalyzer.right(1, 4), new vscode.Position(1, 5), '1,4 -> 1,5');
        assert.deepStrictEqual(textAnalyzer.right(1, 5), new vscode.Position(1, 6), '1,5 -> 1,6');
        assert.deepStrictEqual(textAnalyzer.right(1, 6), new vscode.Position(1, 7), '1,6 -> 1,7');
        assert.deepStrictEqual(textAnalyzer.right(1, 7), new vscode.Position(1, 8), '1,7 -> 1,8');
        assert.deepStrictEqual(textAnalyzer.right(1, 8), new vscode.Position(1, 9), '1,8 -> 1,9');
        assert.deepStrictEqual(textAnalyzer.right(1, 9), new vscode.Position(1, 10), '1,9 -> 1,10');
        assert.deepStrictEqual(textAnalyzer.right(1, 10), new vscode.Position(1, 12), '1,10 -> 1,12');
        assert.deepStrictEqual(textAnalyzer.right(1, 12), new vscode.Position(1, 13), '1,12 -> 1,13');
        assert.deepStrictEqual(textAnalyzer.right(1, 13), new vscode.Position(1, 14), '1,13 -> 1,14');
        assert.deepStrictEqual(textAnalyzer.right(1, 14), new vscode.Position(1, 19), '1,14 -> 1,19');
        assert.deepStrictEqual(textAnalyzer.right(1, 19), new vscode.Position(1, 20), '1,19 -> 1,20');
        assert.deepStrictEqual(textAnalyzer.right(1, 20), new vscode.Position(1, 25), '1,20 -> 1,25');
        assert.deepStrictEqual(textAnalyzer.right(1, 25), new vscode.Position(2, 0), '1,25 -> 2,0');

        assert.deepStrictEqual(textAnalyzer.right(3, 0), new vscode.Position(4, 0), '3,0 -> 4,0');

        assert.deepStrictEqual(textAnalyzer.right(4, 0), new vscode.Position(4, 3), '4,0 -> 4,3');
        assert.deepStrictEqual(textAnalyzer.right(4, 3), new vscode.Position(5, 0), '4,3 -> 5,0');

        assert.deepStrictEqual(textAnalyzer.right(7, 0), new vscode.Position(7, 3), '7,0 -> 7,3');
        assert.deepStrictEqual(textAnalyzer.right(7, 3), new vscode.Position(8, 0), '7,3 -> 8,0');
        assert.deepStrictEqual(textAnalyzer.right(8, 0), new vscode.Position(8, 0), '8,0 -> 8,0');
    });

    test('left test', () => {
        const textAnalyzer = new analyzer.TextAnalyzer();

        const text = '# 百人一首\r\n'
            + '**花の _色_ は** 移りにけりな いたづらに\r\n'
            + '__わが＊身世＊にふる__ ながめせしまに\r\n'
            + '\r\n'
            + '```\r\n'
            + '千早振る　神代もきかず　竜田川\r\n'
            + '     から紅に　水くくるとは\r\n'
            + '```\r\n';
        const lines = text.split('\n');
        const lastLineNo = lines.length - 1;
        textAnalyzer.update(text);

        assert.deepStrictEqual(textAnalyzer.left(-1, -1), new vscode.Position(0, 0), 'under line');
        assert.deepStrictEqual(textAnalyzer.left(1, -1), new vscode.Position(1, 0), 'under character');
        assert.deepStrictEqual(textAnalyzer.left(lines.length, lines[lastLineNo].length), new vscode.Position(lastLineNo, lines[lastLineNo].length), 'over line');
        assert.deepStrictEqual(textAnalyzer.left(1, lines[1].length + 1), new vscode.Position(1, lines[1].length - 1), 'over character');

        assert.deepStrictEqual(textAnalyzer.left(2, 0), new vscode.Position(1, 25), '2,0 -> 1,25');
        assert.deepStrictEqual(textAnalyzer.left(2, 2), new vscode.Position(2, 0), '2,2 -> 2,0');
        assert.deepStrictEqual(textAnalyzer.left(2, 4), new vscode.Position(2, 2), '2,4 -> 2,2');
        assert.deepStrictEqual(textAnalyzer.left(2, 5), new vscode.Position(2, 4), '2,5 -> 2,4');
        assert.deepStrictEqual(textAnalyzer.left(2, 7), new vscode.Position(2, 5), '2,7 -> 2,5');
        assert.deepStrictEqual(textAnalyzer.left(2, 8), new vscode.Position(2, 7), '2,8 -> 2,7');
        assert.deepStrictEqual(textAnalyzer.left(2, 11), new vscode.Position(2, 8), '2,11 -> 2,8');
        assert.deepStrictEqual(textAnalyzer.left(2, 13), new vscode.Position(2, 11), '2,13 -> 2,11');
        assert.deepStrictEqual(textAnalyzer.left(2, 14), new vscode.Position(2, 13), '2,14 -> 2,13');
        assert.deepStrictEqual(textAnalyzer.left(2, 21), new vscode.Position(2, 14), '2,21 -> 2,14');
        assert.deepStrictEqual(textAnalyzer.left(3, 0), new vscode.Position(2, 21), '3,0 -> 2,21');

        assert.deepStrictEqual(textAnalyzer.left(0, 0), new vscode.Position(0, 0), '0,0 -> 0,0');
    });

    test('leftWordStartPosition test', () => {
        const textAnalyzer = new analyzer.TextAnalyzer();

        const text = '# 百人一首\r\n'
            + '花の色は 移りにけりな いたづらに\r\n'
            + '__わが＊身世＊にふる__ ながめせしまに\r\n'
            + '\r\n'
            + '```\r\n'
            + '千早振る　神代もきかず　竜田川\r\n'
            + '     から紅に　水くくるとは\r\n'
            + '```\r\n';
        const lines = text.split('\n');
        const lastLineNo = lines.length - 1;
        textAnalyzer.update(text);

        assert.deepStrictEqual(textAnalyzer.leftWord(-1, -1), new vscode.Position(0, 0), 'under line');
        assert.deepStrictEqual(textAnalyzer.leftWord(1, -1), new vscode.Position(1, 0), 'under character');
        assert.deepStrictEqual(textAnalyzer.leftWord(lines.length, lines[lastLineNo].length), new vscode.Position(lastLineNo, lines[lastLineNo].length), 'over line');
        assert.deepStrictEqual(textAnalyzer.leftWord(1, lines[1].length + 1), new vscode.Position(1, lines[1].length - 1), 'over character');

        assert.deepStrictEqual(textAnalyzer.leftWord(1, 0), new vscode.Position(1, 0), '1,0 -> 1,0');
        assert.deepStrictEqual(textAnalyzer.leftWord(1, 2), new vscode.Position(1, 0), '1,2 -> 1,0');
        assert.deepStrictEqual(textAnalyzer.leftWord(1, 3), new vscode.Position(1, 2), '1,3 -> 1,2');
        assert.deepStrictEqual(textAnalyzer.leftWord(1, 4), new vscode.Position(1, 2), '1,4 -> 1,2');
        assert.deepStrictEqual(textAnalyzer.leftWord(1, 5), new vscode.Position(1, 5), '1,5 -> 1,2');
        assert.deepStrictEqual(textAnalyzer.leftWord(1, 6), new vscode.Position(1, 5), '1,6 -> 1,2');
        assert.deepStrictEqual(textAnalyzer.leftWord(1, 11), new vscode.Position(1, 5), '1,11 -> 1,2');
        assert.deepStrictEqual(textAnalyzer.leftWord(1, 17), new vscode.Position(1, 17), '1,17 -> 1,2');

        assert.deepStrictEqual(textAnalyzer.leftWord(2, 0), new vscode.Position(2, 0), '2,0 -> 2,0');
        assert.deepStrictEqual(textAnalyzer.leftWord(2, 2), new vscode.Position(2, 2), '2,2 -> 2,2');
        assert.deepStrictEqual(textAnalyzer.leftWord(2, 4), new vscode.Position(2, 4), '2,4 -> 2,4');
        assert.deepStrictEqual(textAnalyzer.leftWord(2, 5), new vscode.Position(2, 5), '2,5 -> 2,5');
        assert.deepStrictEqual(textAnalyzer.leftWord(2, 7), new vscode.Position(2, 5), '2,7 -> 2,7');
        assert.deepStrictEqual(textAnalyzer.leftWord(2, 8), new vscode.Position(2, 8), '2,8 -> 2,8');
        assert.deepStrictEqual(textAnalyzer.leftWord(2, 11), new vscode.Position(2, 11), '2,11 -> 2,11');
        assert.deepStrictEqual(textAnalyzer.leftWord(2, 13), new vscode.Position(2, 13), '2,13 -> 2,13');
        assert.deepStrictEqual(textAnalyzer.leftWord(2, 14), new vscode.Position(2, 14), '2,14 -> 2,14');
        assert.deepStrictEqual(textAnalyzer.leftWord(2, 21), new vscode.Position(2, 21), '2,21 -> 2,21');

        assert.deepStrictEqual(textAnalyzer.leftWord(3, 0), new vscode.Position(3, 0), '3,0 -> 3,0');
        assert.deepStrictEqual(textAnalyzer.leftWord(4, 1), new vscode.Position(4, 1), '4,1 -> 4,1');

        assert.deepStrictEqual(textAnalyzer.leftWord(5, 1), new vscode.Position(5, 0), '5,1 -> 5,0');
        assert.deepStrictEqual(textAnalyzer.leftWord(5, 4), new vscode.Position(5, 0), '5,4 -> 5,0');
        assert.deepStrictEqual(textAnalyzer.leftWord(5, 11), new vscode.Position(5, 5), '5,11 -> 5,5');
        assert.deepStrictEqual(textAnalyzer.leftWord(5, 15), new vscode.Position(5, 12), '5,15 -> 5,12');

        assert.deepStrictEqual(textAnalyzer.leftWord(0, 0), new vscode.Position(0, 0), '0,0 -> 0,0');
    });

    test('trimKana test', () => {
        const textAnalyzer = new analyzer.TextAnalyzer();

        assert.deepStrictEqual(textAnalyzer.trimKana('千早振る'), '千早振');
        assert.deepStrictEqual(textAnalyzer.trimKana('千早振'), '千早振');
        assert.deepStrictEqual(textAnalyzer.trimKana('君がため'), '君');

        assert.deepStrictEqual(textAnalyzer.trimKana('花の色は'), '花');
        assert.deepStrictEqual(textAnalyzer.trimKana('ちはやふる'), 'ちはやふる');
        assert.deepStrictEqual(textAnalyzer.trimKana(''), '');
    });

    test('trimOkurigana test', () => {
        const textAnalyzer = new analyzer.TextAnalyzer();

        assert.deepStrictEqual(textAnalyzer.trimOkurigana('千早振る', 'ちはやふる'), { text: '千早振', ruby: 'ちはやふ' });
        assert.deepStrictEqual(textAnalyzer.trimOkurigana('千早振', 'ちはやふ'), { text: '千早振', ruby: 'ちはやふ' });
        assert.deepStrictEqual(textAnalyzer.trimOkurigana('君がため', 'きみがため'), { text: '君', ruby: 'きみ' });

        assert.deepStrictEqual(textAnalyzer.trimOkurigana('君がため', 'きみが'), { text: '君がため', ruby: 'きみが' });
        assert.deepStrictEqual(textAnalyzer.trimOkurigana('君がため', 'がため'), { text: '君', ruby: '' });

        assert.deepStrictEqual(textAnalyzer.trimOkurigana('ちはやふる', 'ちはやふる'), { text: 'ちはやふる', ruby: 'ちはやふる' });
        assert.deepStrictEqual(textAnalyzer.trimOkurigana('', 'ちはやふる'), { text: '', ruby: 'ちはやふる' });
        assert.deepStrictEqual(textAnalyzer.trimOkurigana('千早振る', ''), { text: '千早振る', ruby: '' });
        assert.deepStrictEqual(textAnalyzer.trimOkurigana('', ''), { text: '', ruby: '' });
    });

    test('_rangeCheck test', () => {
        const textAnalyzer = new analyzer.TextAnalyzer();

        const text = '# 百人一首\r\n'
            + '**花の _色_ は** 移りにけりな いたづらに\r\n'
            + '__わが＊身世＊にふる__ ながめせしまに\r\n'
            + '\r\n'
            + '```\r\n'
            + '千早振る　神代もきかず　竜田川\r\n'
            + '     から紅に　水くくるとは\r\n'
            + '```\r\n';
        const lines = text.split('\n');
        const lastLineNo = lines.length - 1;
        textAnalyzer.update(text);

        assert.deepStrictEqual((textAnalyzer as any)._rangeCheck(-1, -1), new vscode.Position(0, 0), 'under line');
        assert.deepStrictEqual((textAnalyzer as any)._rangeCheck(1, -1), new vscode.Position(1, 0), 'under character');
        assert.deepStrictEqual((textAnalyzer as any)._rangeCheck(lines.length, lines[lastLineNo].length), new vscode.Position(lastLineNo, lines[lastLineNo].length), 'over line');
        assert.deepStrictEqual((textAnalyzer as any)._rangeCheck(1, lines[1].length + 1), new vscode.Position(1, lines[1].length - 1), 'over character');

    });

    test('_analyze test', () => {
        const textAnalyzer = new analyzer.TextAnalyzer();

        assert.deepStrictEqual((textAnalyzer as any)._analyze(
            '**花の _色_ は** 移りにけりな いたづらに\n'),
            [
                { type: CharType.asciiSymbol, prevIndex: 0, nextIndex: 0 },
                { type: CharType.asciiSymbol, prevIndex: 0, nextIndex: 0 },
                { type: CharType.kanji, prevIndex: 0, nextIndex: 0 },
                { type: CharType.kana, prevIndex: 0, nextIndex: 0 },
                { type: CharType.whitespace, prevIndex: 0, nextIndex: 0 },
                { type: CharType.asciiSymbol, prevIndex: 0, nextIndex: 0 },
                { type: CharType.kanji, prevIndex: 0, nextIndex: 0 },
                { type: CharType.asciiSymbol, prevIndex: 0, nextIndex: 0 },
                { type: CharType.whitespace, prevIndex: 0, nextIndex: 0 },
                { type: CharType.kana, prevIndex: 0, nextIndex: 0 },
                { type: CharType.asciiSymbol, prevIndex: 0, nextIndex: 0 },
                { type: CharType.asciiSymbol, prevIndex: 0, nextIndex: 0 },
                { type: CharType.whitespace, prevIndex: 0, nextIndex: 0 },
                { type: CharType.kanji, prevIndex: 0, nextIndex: 0 },
                { type: CharType.kana, prevIndex: 0, nextIndex: 0 },
                { type: CharType.kana, prevIndex: 0, nextIndex: 0 },
                { type: CharType.kana, prevIndex: 0, nextIndex: 0 },
                { type: CharType.kana, prevIndex: 0, nextIndex: 0 },
                { type: CharType.kana, prevIndex: 0, nextIndex: 0 },
                { type: CharType.whitespace, prevIndex: 0, nextIndex: 0 },
                { type: CharType.kana, prevIndex: 0, nextIndex: 0 },
                { type: CharType.kana, prevIndex: 0, nextIndex: 0 },
                { type: CharType.kana, prevIndex: 0, nextIndex: 0 },
                { type: CharType.kana, prevIndex: 0, nextIndex: 0 },
                { type: CharType.kana, prevIndex: 0, nextIndex: 0 },
                { type: CharType.crlf, prevIndex: 0, nextIndex: 0 },
            ]);

        assert.strictEqual(true, true);
    });

    test('_isAsciiAlphabet test', () => {
        const textAnalyzer = new analyzer.TextAnalyzer();

        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet(' '), false, ' ');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('!'), false, '!');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('"'), false, '"');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('#'), false, '#');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('$'), false, '$');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('%'), false, '%');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('&'), false, '&');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('\''), false, '\'');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('('), false, '(');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet(')'), false, ')');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('*'), false, '*');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('+'), false, '+');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet(','), false, ',');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('-'), false, '-');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('.'), false, '.');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('/'), false, '/');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('0'), true, '0');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('1'), true, '1');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('2'), true, '2');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('3'), true, '3');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('4'), true, '4');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('5'), true, '5');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('6'), true, '6');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('7'), true, '7');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('8'), true, '8');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('9'), true, '9');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet(':'), false, ':');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet(';'), false, ';');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('<'), false, '<');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('='), false, '=');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('>'), false, '>');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('?'), false, '?');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('@'), false, '@');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('A'), true, 'A');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('B'), true, 'B');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('C'), true, 'C');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('D'), true, 'D');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('E'), true, 'E');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('F'), true, 'F');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('G'), true, 'G');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('H'), true, 'H');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('I'), true, 'I');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('J'), true, 'J');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('K'), true, 'K');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('L'), true, 'L');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('M'), true, 'M');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('N'), true, 'N');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('O'), true, 'O');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('P'), true, 'P');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('Q'), true, 'Q');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('R'), true, 'R');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('S'), true, 'S');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('T'), true, 'T');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('U'), true, 'U');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('V'), true, 'V');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('W'), true, 'W');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('X'), true, 'X');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('Y'), true, 'Y');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('Z'), true, 'Z');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('['), false, '[');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('\\'), false, '\\');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet(']'), false, ']');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('^'), false, '^');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('_'), false, '_');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('`'), false, '`');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('a'), true, 'a');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('b'), true, 'b');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('c'), true, 'c');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('d'), true, 'd');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('e'), true, 'e');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('f'), true, 'f');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('g'), true, 'g');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('h'), true, 'h');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('i'), true, 'i');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('j'), true, 'j');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('k'), true, 'k');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('l'), true, 'l');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('m'), true, 'm');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('n'), true, 'n');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('o'), true, 'o');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('p'), true, 'p');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('q'), true, 'q');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('r'), true, 'r');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('s'), true, 's');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('t'), true, 't');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('u'), true, 'u');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('v'), true, 'v');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('w'), true, 'w');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('x'), true, 'x');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('y'), true, 'y');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('z'), true, 'z');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('{'), false, '{');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('|'), false, '|');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('}'), false, '}');
        assert.strictEqual((textAnalyzer as any)._isAsciiAlphabet('~'), false, '~');

    });

    test('_isAsciiSymbol test', () => {
        const textAnalyzer = new analyzer.TextAnalyzer();

        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol(' '), false, ' ');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('!'), true, '!');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('"'), true, '"');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('#'), true, '#');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('$'), true, '$');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('%'), true, '%');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('&'), true, '&');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('\''), true, '\'');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('('), false, '(');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol(')'), false, ')');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('*'), true, '*');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('+'), true, '+');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol(','), true, ',');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('-'), true, '-');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('.'), true, '.');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('/'), true, '/');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('0'), false, '0');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('1'), false, '1');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('2'), false, '2');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('3'), false, '3');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('4'), false, '4');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('5'), false, '5');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('6'), false, '6');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('7'), false, '7');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('8'), false, '8');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('9'), false, '9');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol(':'), true, ':');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol(';'), true, ';');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('<'), false, '<');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('='), true, '=');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('>'), false, '>');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('?'), true, '?');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('@'), true, '@');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('A'), false, 'A');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('B'), false, 'B');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('C'), false, 'C');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('D'), false, 'D');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('E'), false, 'E');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('F'), false, 'F');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('G'), false, 'G');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('H'), false, 'H');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('I'), false, 'I');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('J'), false, 'J');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('K'), false, 'K');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('L'), false, 'L');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('M'), false, 'M');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('N'), false, 'N');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('O'), false, 'O');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('P'), false, 'P');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('Q'), false, 'Q');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('R'), false, 'R');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('S'), false, 'S');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('T'), false, 'T');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('U'), false, 'U');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('V'), false, 'V');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('W'), false, 'W');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('X'), false, 'X');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('Y'), false, 'Y');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('Z'), false, 'Z');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('['), false, '[');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('\\'), true, '\\');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol(']'), false, ']');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('^'), true, '^');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('_'), true, '_');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('`'), true, '`');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('a'), false, 'a');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('b'), false, 'b');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('c'), false, 'c');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('d'), false, 'd');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('e'), false, 'e');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('f'), false, 'f');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('g'), false, 'g');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('h'), false, 'h');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('i'), false, 'i');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('j'), false, 'j');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('k'), false, 'k');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('l'), false, 'l');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('m'), false, 'm');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('n'), false, 'n');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('o'), false, 'o');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('p'), false, 'p');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('q'), false, 'q');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('r'), false, 'r');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('s'), false, 's');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('t'), false, 't');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('u'), false, 'u');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('v'), false, 'v');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('w'), false, 'w');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('x'), false, 'x');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('y'), false, 'y');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('z'), false, 'z');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('{'), false, '{');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('|'), true, '|');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('}'), false, '}');
        assert.strictEqual((textAnalyzer as any)._isAsciiSymbol('~'), true, '~');
    });

    test('_isAsciiBracket test', () => {
        const textAnalyzer = new analyzer.TextAnalyzer();

        assert.strictEqual((textAnalyzer as any)._isAsciiBracket(' '), false, ' ');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('!'), false, '!');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('"'), false, '"');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('#'), false, '#');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('$'), false, '$');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('%'), false, '%');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('&'), false, '&');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('\''), false, '\'');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('('), true, '(');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket(')'), true, ')');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('*'), false, '*');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('+'), false, '+');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket(','), false, ',');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('-'), false, '-');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('.'), false, '.');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('/'), false, '/');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('0'), false, '0');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('1'), false, '1');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('2'), false, '2');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('3'), false, '3');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('4'), false, '4');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('5'), false, '5');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('6'), false, '6');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('7'), false, '7');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('8'), false, '8');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('9'), false, '9');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket(':'), false, ':');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket(';'), false, ';');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('<'), true, '<');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('='), false, '=');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('>'), true, '>');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('?'), false, '?');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('@'), false, '@');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('A'), false, 'A');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('B'), false, 'B');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('C'), false, 'C');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('D'), false, 'D');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('E'), false, 'E');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('F'), false, 'F');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('G'), false, 'G');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('H'), false, 'H');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('I'), false, 'I');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('J'), false, 'J');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('K'), false, 'K');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('L'), false, 'L');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('M'), false, 'M');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('N'), false, 'N');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('O'), false, 'O');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('P'), false, 'P');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('Q'), false, 'Q');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('R'), false, 'R');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('S'), false, 'S');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('T'), false, 'T');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('U'), false, 'U');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('V'), false, 'V');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('W'), false, 'W');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('X'), false, 'X');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('Y'), false, 'Y');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('Z'), false, 'Z');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('['), true, '[');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('\\'), false, '\\');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket(']'), true, ']');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('^'), false, '^');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('_'), false, '_');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('`'), false, '`');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('a'), false, 'a');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('b'), false, 'b');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('c'), false, 'c');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('d'), false, 'd');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('e'), false, 'e');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('f'), false, 'f');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('g'), false, 'g');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('h'), false, 'h');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('i'), false, 'i');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('j'), false, 'j');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('k'), false, 'k');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('l'), false, 'l');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('m'), false, 'm');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('n'), false, 'n');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('o'), false, 'o');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('p'), false, 'p');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('q'), false, 'q');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('r'), false, 'r');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('s'), false, 's');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('t'), false, 't');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('u'), false, 'u');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('v'), false, 'v');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('w'), false, 'w');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('x'), false, 'x');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('y'), false, 'y');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('z'), false, 'z');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('{'), true, '{');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('|'), false, '|');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('}'), true, '}');
        assert.strictEqual((textAnalyzer as any)._isAsciiBracket('~'), false, '~');
    });

    test('_isKanji test', () => {
        const textAnalyzer = new analyzer.TextAnalyzer();

        assert.strictEqual((textAnalyzer as any)._isKanji('小'), true, '小');
        assert.strictEqual((textAnalyzer as any)._isKanji('〻'), true, '〻');
        assert.strictEqual((textAnalyzer as any)._isKanji('Ａ'), false, 'Ａ');
        assert.strictEqual((textAnalyzer as any)._isKanji('a'), false, 'a');
    });

    test('_isKana test', () => {
        const textAnalyzer = new analyzer.TextAnalyzer();

        assert.strictEqual((textAnalyzer as any)._isKana('あ'), true, 'あ');
        assert.strictEqual((textAnalyzer as any)._isKana('ゟ'), true, 'ゟ');
        assert.strictEqual((textAnalyzer as any)._isKana('゠'), true, '゠');
        assert.strictEqual((textAnalyzer as any)._isKana('ア'), true, 'ア');
        assert.strictEqual((textAnalyzer as any)._isKana('ヿ'), true, 'ヿ');
        assert.strictEqual((textAnalyzer as any)._isKana('Ａ'), false, 'Ａ');
        assert.strictEqual((textAnalyzer as any)._isKana('a'), false, 'a');
    });

    test('_isAlphabet test', () => {
        const textAnalyzer = new analyzer.TextAnalyzer();

        assert.strictEqual((textAnalyzer as any)._isAlphabet('ａ'), true, 'ａ');
        assert.strictEqual((textAnalyzer as any)._isAlphabet('ｚ'), true, 'ｚ');
        assert.strictEqual((textAnalyzer as any)._isAlphabet('Ａ'), true, 'Ａ');
        assert.strictEqual((textAnalyzer as any)._isAlphabet('Ｚ'), true, 'Ｚ');
        assert.strictEqual((textAnalyzer as any)._isAlphabet('０'), true, '０');
        assert.strictEqual((textAnalyzer as any)._isAlphabet('９'), true, '９');
        assert.strictEqual((textAnalyzer as any)._isAlphabet('0'), false, '0');
        assert.strictEqual((textAnalyzer as any)._isAlphabet('a'), false, 'a');
        assert.strictEqual((textAnalyzer as any)._isAlphabet('A'), false, 'A');
    });


    test('_isSymbol test', () => {
        const textAnalyzer = new analyzer.TextAnalyzer();

        assert.strictEqual((textAnalyzer as any)._isSymbol('　'), false, '　');
        assert.strictEqual((textAnalyzer as any)._isSymbol('！'), true, '！');
        assert.strictEqual((textAnalyzer as any)._isSymbol('＂'), true, '＂');
        assert.strictEqual((textAnalyzer as any)._isSymbol('＃'), true, '＃');
        assert.strictEqual((textAnalyzer as any)._isSymbol('＄'), true, '＄');
        assert.strictEqual((textAnalyzer as any)._isSymbol('％'), true, '％');
        assert.strictEqual((textAnalyzer as any)._isSymbol('＆'), true, '＆');
        assert.strictEqual((textAnalyzer as any)._isSymbol('＇'), true, '＇');
        assert.strictEqual((textAnalyzer as any)._isSymbol('（'), false, '（');
        assert.strictEqual((textAnalyzer as any)._isSymbol('）'), false, '）');
        assert.strictEqual((textAnalyzer as any)._isSymbol('＊'), true, '＊');
        assert.strictEqual((textAnalyzer as any)._isSymbol('＋'), true, '＋');
        assert.strictEqual((textAnalyzer as any)._isSymbol('，'), true, '，');
        assert.strictEqual((textAnalyzer as any)._isSymbol('－'), true, '－');
        assert.strictEqual((textAnalyzer as any)._isSymbol('．'), true, '．');
        assert.strictEqual((textAnalyzer as any)._isSymbol('／'), true, '／');
        assert.strictEqual((textAnalyzer as any)._isSymbol('０'), false, '０');
        assert.strictEqual((textAnalyzer as any)._isSymbol('１'), false, '１');
        assert.strictEqual((textAnalyzer as any)._isSymbol('２'), false, '２');
        assert.strictEqual((textAnalyzer as any)._isSymbol('３'), false, '３');
        assert.strictEqual((textAnalyzer as any)._isSymbol('４'), false, '４');
        assert.strictEqual((textAnalyzer as any)._isSymbol('５'), false, '５');
        assert.strictEqual((textAnalyzer as any)._isSymbol('６'), false, '６');
        assert.strictEqual((textAnalyzer as any)._isSymbol('７'), false, '７');
        assert.strictEqual((textAnalyzer as any)._isSymbol('８'), false, '８');
        assert.strictEqual((textAnalyzer as any)._isSymbol('９'), false, '９');
        assert.strictEqual((textAnalyzer as any)._isSymbol('：'), true, '：');
        assert.strictEqual((textAnalyzer as any)._isSymbol('；'), true, '；');
        assert.strictEqual((textAnalyzer as any)._isSymbol('＜'), false, '＜');
        assert.strictEqual((textAnalyzer as any)._isSymbol('＝'), true, '＝');
        assert.strictEqual((textAnalyzer as any)._isSymbol('＞'), false, '＞');
        assert.strictEqual((textAnalyzer as any)._isSymbol('？'), true, '？');
        assert.strictEqual((textAnalyzer as any)._isSymbol('＠'), true, '＠');
        assert.strictEqual((textAnalyzer as any)._isSymbol('Ａ'), false, 'Ａ');
        assert.strictEqual((textAnalyzer as any)._isSymbol('Ｂ'), false, 'Ｂ');
        assert.strictEqual((textAnalyzer as any)._isSymbol('Ｃ'), false, 'Ｃ');
        assert.strictEqual((textAnalyzer as any)._isSymbol('Ｄ'), false, 'Ｄ');
        assert.strictEqual((textAnalyzer as any)._isSymbol('Ｅ'), false, 'Ｅ');
        assert.strictEqual((textAnalyzer as any)._isSymbol('Ｆ'), false, 'Ｆ');
        assert.strictEqual((textAnalyzer as any)._isSymbol('Ｇ'), false, 'Ｇ');
        assert.strictEqual((textAnalyzer as any)._isSymbol('Ｈ'), false, 'Ｈ');
        assert.strictEqual((textAnalyzer as any)._isSymbol('Ｉ'), false, 'Ｉ');
        assert.strictEqual((textAnalyzer as any)._isSymbol('Ｊ'), false, 'Ｊ');
        assert.strictEqual((textAnalyzer as any)._isSymbol('Ｋ'), false, 'Ｋ');
        assert.strictEqual((textAnalyzer as any)._isSymbol('Ｌ'), false, 'Ｌ');
        assert.strictEqual((textAnalyzer as any)._isSymbol('Ｍ'), false, 'Ｍ');
        assert.strictEqual((textAnalyzer as any)._isSymbol('Ｎ'), false, 'Ｎ');
        assert.strictEqual((textAnalyzer as any)._isSymbol('Ｏ'), false, 'Ｏ');
        assert.strictEqual((textAnalyzer as any)._isSymbol('Ｐ'), false, 'Ｐ');
        assert.strictEqual((textAnalyzer as any)._isSymbol('Ｑ'), false, 'Ｑ');
        assert.strictEqual((textAnalyzer as any)._isSymbol('Ｒ'), false, 'Ｒ');
        assert.strictEqual((textAnalyzer as any)._isSymbol('Ｓ'), false, 'Ｓ');
        assert.strictEqual((textAnalyzer as any)._isSymbol('Ｔ'), false, 'Ｔ');
        assert.strictEqual((textAnalyzer as any)._isSymbol('Ｕ'), false, 'Ｕ');
        assert.strictEqual((textAnalyzer as any)._isSymbol('Ｖ'), false, 'Ｖ');
        assert.strictEqual((textAnalyzer as any)._isSymbol('Ｗ'), false, 'Ｗ');
        assert.strictEqual((textAnalyzer as any)._isSymbol('Ｘ'), false, 'Ｘ');
        assert.strictEqual((textAnalyzer as any)._isSymbol('Ｙ'), false, 'Ｙ');
        assert.strictEqual((textAnalyzer as any)._isSymbol('Ｚ'), false, 'Ｚ');
        assert.strictEqual((textAnalyzer as any)._isSymbol('［'), false, '［');
        assert.strictEqual((textAnalyzer as any)._isSymbol('＼'), true, '＼');
        assert.strictEqual((textAnalyzer as any)._isSymbol('］'), false, '］');
        assert.strictEqual((textAnalyzer as any)._isSymbol('＾'), true, '＾');
        assert.strictEqual((textAnalyzer as any)._isSymbol('＿'), true, '＿');
        assert.strictEqual((textAnalyzer as any)._isSymbol('｀'), true, '｀');
        assert.strictEqual((textAnalyzer as any)._isSymbol('ａ'), false, 'ａ');
        assert.strictEqual((textAnalyzer as any)._isSymbol('ｂ'), false, 'ｂ');
        assert.strictEqual((textAnalyzer as any)._isSymbol('ｃ'), false, 'ｃ');
        assert.strictEqual((textAnalyzer as any)._isSymbol('ｄ'), false, 'ｄ');
        assert.strictEqual((textAnalyzer as any)._isSymbol('ｅ'), false, 'ｅ');
        assert.strictEqual((textAnalyzer as any)._isSymbol('ｆ'), false, 'ｆ');
        assert.strictEqual((textAnalyzer as any)._isSymbol('ｇ'), false, 'ｇ');
        assert.strictEqual((textAnalyzer as any)._isSymbol('ｈ'), false, 'ｈ');
        assert.strictEqual((textAnalyzer as any)._isSymbol('ｉ'), false, 'ｉ');
        assert.strictEqual((textAnalyzer as any)._isSymbol('ｊ'), false, 'ｊ');
        assert.strictEqual((textAnalyzer as any)._isSymbol('ｋ'), false, 'ｋ');
        assert.strictEqual((textAnalyzer as any)._isSymbol('ｌ'), false, 'ｌ');
        assert.strictEqual((textAnalyzer as any)._isSymbol('ｍ'), false, 'ｍ');
        assert.strictEqual((textAnalyzer as any)._isSymbol('ｎ'), false, 'ｎ');
        assert.strictEqual((textAnalyzer as any)._isSymbol('ｏ'), false, 'ｏ');
        assert.strictEqual((textAnalyzer as any)._isSymbol('ｐ'), false, 'ｐ');
        assert.strictEqual((textAnalyzer as any)._isSymbol('ｑ'), false, 'ｑ');
        assert.strictEqual((textAnalyzer as any)._isSymbol('ｒ'), false, 'ｒ');
        assert.strictEqual((textAnalyzer as any)._isSymbol('ｓ'), false, 'ｓ');
        assert.strictEqual((textAnalyzer as any)._isSymbol('ｔ'), false, 'ｔ');
        assert.strictEqual((textAnalyzer as any)._isSymbol('ｕ'), false, 'ｕ');
        assert.strictEqual((textAnalyzer as any)._isSymbol('ｖ'), false, 'ｖ');
        assert.strictEqual((textAnalyzer as any)._isSymbol('ｗ'), false, 'ｗ');
        assert.strictEqual((textAnalyzer as any)._isSymbol('ｘ'), false, 'ｘ');
        assert.strictEqual((textAnalyzer as any)._isSymbol('ｙ'), false, 'ｙ');
        assert.strictEqual((textAnalyzer as any)._isSymbol('ｚ'), false, 'ｚ');
        assert.strictEqual((textAnalyzer as any)._isSymbol('｛'), false, '｛');
        assert.strictEqual((textAnalyzer as any)._isSymbol('｜'), true, '｜');
        assert.strictEqual((textAnalyzer as any)._isSymbol('｝'), false, '｝');
        assert.strictEqual((textAnalyzer as any)._isSymbol('～'), true, '～');
    });

    test('_isBracket test', () => {
        const textAnalyzer = new analyzer.TextAnalyzer();

        assert.strictEqual((textAnalyzer as any)._isBracket('《'), true, '《');
        assert.strictEqual((textAnalyzer as any)._isBracket('》'), true, '》');

        assert.strictEqual((textAnalyzer as any)._isBracket('　'), false, '　');
        assert.strictEqual((textAnalyzer as any)._isBracket('！'), false, '！');
        assert.strictEqual((textAnalyzer as any)._isBracket('＂'), false, '＂');
        assert.strictEqual((textAnalyzer as any)._isBracket('＃'), false, '＃');
        assert.strictEqual((textAnalyzer as any)._isBracket('＄'), false, '＄');
        assert.strictEqual((textAnalyzer as any)._isBracket('％'), false, '％');
        assert.strictEqual((textAnalyzer as any)._isBracket('＆'), false, '＆');
        assert.strictEqual((textAnalyzer as any)._isBracket('＇'), false, '＇');
        assert.strictEqual((textAnalyzer as any)._isBracket('（'), true, '（');
        assert.strictEqual((textAnalyzer as any)._isBracket('）'), true, '）');
        assert.strictEqual((textAnalyzer as any)._isBracket('＊'), false, '＊');
        assert.strictEqual((textAnalyzer as any)._isBracket('＋'), false, '＋');
        assert.strictEqual((textAnalyzer as any)._isBracket('，'), false, '，');
        assert.strictEqual((textAnalyzer as any)._isBracket('－'), false, '－');
        assert.strictEqual((textAnalyzer as any)._isBracket('．'), false, '．');
        assert.strictEqual((textAnalyzer as any)._isBracket('／'), false, '／');
        assert.strictEqual((textAnalyzer as any)._isBracket('０'), false, '０');
        assert.strictEqual((textAnalyzer as any)._isBracket('１'), false, '１');
        assert.strictEqual((textAnalyzer as any)._isBracket('２'), false, '２');
        assert.strictEqual((textAnalyzer as any)._isBracket('３'), false, '３');
        assert.strictEqual((textAnalyzer as any)._isBracket('４'), false, '４');
        assert.strictEqual((textAnalyzer as any)._isBracket('５'), false, '５');
        assert.strictEqual((textAnalyzer as any)._isBracket('６'), false, '６');
        assert.strictEqual((textAnalyzer as any)._isBracket('７'), false, '７');
        assert.strictEqual((textAnalyzer as any)._isBracket('８'), false, '８');
        assert.strictEqual((textAnalyzer as any)._isBracket('９'), false, '９');
        assert.strictEqual((textAnalyzer as any)._isBracket('：'), false, '：');
        assert.strictEqual((textAnalyzer as any)._isBracket('；'), false, '；');
        assert.strictEqual((textAnalyzer as any)._isBracket('＜'), true, '＜');
        assert.strictEqual((textAnalyzer as any)._isBracket('＝'), false, '＝');
        assert.strictEqual((textAnalyzer as any)._isBracket('＞'), true, '＞');
        assert.strictEqual((textAnalyzer as any)._isBracket('？'), false, '？');
        assert.strictEqual((textAnalyzer as any)._isBracket('＠'), false, '＠');
        assert.strictEqual((textAnalyzer as any)._isBracket('Ａ'), false, 'Ａ');
        assert.strictEqual((textAnalyzer as any)._isBracket('Ｂ'), false, 'Ｂ');
        assert.strictEqual((textAnalyzer as any)._isBracket('Ｃ'), false, 'Ｃ');
        assert.strictEqual((textAnalyzer as any)._isBracket('Ｄ'), false, 'Ｄ');
        assert.strictEqual((textAnalyzer as any)._isBracket('Ｅ'), false, 'Ｅ');
        assert.strictEqual((textAnalyzer as any)._isBracket('Ｆ'), false, 'Ｆ');
        assert.strictEqual((textAnalyzer as any)._isBracket('Ｇ'), false, 'Ｇ');
        assert.strictEqual((textAnalyzer as any)._isBracket('Ｈ'), false, 'Ｈ');
        assert.strictEqual((textAnalyzer as any)._isBracket('Ｉ'), false, 'Ｉ');
        assert.strictEqual((textAnalyzer as any)._isBracket('Ｊ'), false, 'Ｊ');
        assert.strictEqual((textAnalyzer as any)._isBracket('Ｋ'), false, 'Ｋ');
        assert.strictEqual((textAnalyzer as any)._isBracket('Ｌ'), false, 'Ｌ');
        assert.strictEqual((textAnalyzer as any)._isBracket('Ｍ'), false, 'Ｍ');
        assert.strictEqual((textAnalyzer as any)._isBracket('Ｎ'), false, 'Ｎ');
        assert.strictEqual((textAnalyzer as any)._isBracket('Ｏ'), false, 'Ｏ');
        assert.strictEqual((textAnalyzer as any)._isBracket('Ｐ'), false, 'Ｐ');
        assert.strictEqual((textAnalyzer as any)._isBracket('Ｑ'), false, 'Ｑ');
        assert.strictEqual((textAnalyzer as any)._isBracket('Ｒ'), false, 'Ｒ');
        assert.strictEqual((textAnalyzer as any)._isBracket('Ｓ'), false, 'Ｓ');
        assert.strictEqual((textAnalyzer as any)._isBracket('Ｔ'), false, 'Ｔ');
        assert.strictEqual((textAnalyzer as any)._isBracket('Ｕ'), false, 'Ｕ');
        assert.strictEqual((textAnalyzer as any)._isBracket('Ｖ'), false, 'Ｖ');
        assert.strictEqual((textAnalyzer as any)._isBracket('Ｗ'), false, 'Ｗ');
        assert.strictEqual((textAnalyzer as any)._isBracket('Ｘ'), false, 'Ｘ');
        assert.strictEqual((textAnalyzer as any)._isBracket('Ｙ'), false, 'Ｙ');
        assert.strictEqual((textAnalyzer as any)._isBracket('Ｚ'), false, 'Ｚ');
        assert.strictEqual((textAnalyzer as any)._isBracket('［'), true, '［');
        assert.strictEqual((textAnalyzer as any)._isBracket('＼'), false, '＼');
        assert.strictEqual((textAnalyzer as any)._isBracket('］'), true, '］');
        assert.strictEqual((textAnalyzer as any)._isBracket('＾'), false, '＾');
        assert.strictEqual((textAnalyzer as any)._isBracket('＿'), false, '＿');
        assert.strictEqual((textAnalyzer as any)._isBracket('｀'), false, '｀');
        assert.strictEqual((textAnalyzer as any)._isBracket('ａ'), false, 'ａ');
        assert.strictEqual((textAnalyzer as any)._isBracket('ｂ'), false, 'ｂ');
        assert.strictEqual((textAnalyzer as any)._isBracket('ｃ'), false, 'ｃ');
        assert.strictEqual((textAnalyzer as any)._isBracket('ｄ'), false, 'ｄ');
        assert.strictEqual((textAnalyzer as any)._isBracket('ｅ'), false, 'ｅ');
        assert.strictEqual((textAnalyzer as any)._isBracket('ｆ'), false, 'ｆ');
        assert.strictEqual((textAnalyzer as any)._isBracket('ｇ'), false, 'ｇ');
        assert.strictEqual((textAnalyzer as any)._isBracket('ｈ'), false, 'ｈ');
        assert.strictEqual((textAnalyzer as any)._isBracket('ｉ'), false, 'ｉ');
        assert.strictEqual((textAnalyzer as any)._isBracket('ｊ'), false, 'ｊ');
        assert.strictEqual((textAnalyzer as any)._isBracket('ｋ'), false, 'ｋ');
        assert.strictEqual((textAnalyzer as any)._isBracket('ｌ'), false, 'ｌ');
        assert.strictEqual((textAnalyzer as any)._isBracket('ｍ'), false, 'ｍ');
        assert.strictEqual((textAnalyzer as any)._isBracket('ｎ'), false, 'ｎ');
        assert.strictEqual((textAnalyzer as any)._isBracket('ｏ'), false, 'ｏ');
        assert.strictEqual((textAnalyzer as any)._isBracket('ｐ'), false, 'ｐ');
        assert.strictEqual((textAnalyzer as any)._isBracket('ｑ'), false, 'ｑ');
        assert.strictEqual((textAnalyzer as any)._isBracket('ｒ'), false, 'ｒ');
        assert.strictEqual((textAnalyzer as any)._isBracket('ｓ'), false, 'ｓ');
        assert.strictEqual((textAnalyzer as any)._isBracket('ｔ'), false, 'ｔ');
        assert.strictEqual((textAnalyzer as any)._isBracket('ｕ'), false, 'ｕ');
        assert.strictEqual((textAnalyzer as any)._isBracket('ｖ'), false, 'ｖ');
        assert.strictEqual((textAnalyzer as any)._isBracket('ｗ'), false, 'ｗ');
        assert.strictEqual((textAnalyzer as any)._isBracket('ｘ'), false, 'ｘ');
        assert.strictEqual((textAnalyzer as any)._isBracket('ｙ'), false, 'ｙ');
        assert.strictEqual((textAnalyzer as any)._isBracket('ｚ'), false, 'ｚ');
        assert.strictEqual((textAnalyzer as any)._isBracket('｛'), true, '｛');
        assert.strictEqual((textAnalyzer as any)._isBracket('｜'), false, '｜');
        assert.strictEqual((textAnalyzer as any)._isBracket('｝'), true, '｝');
        assert.strictEqual((textAnalyzer as any)._isBracket('～'), false, '～');
    });


    test('_isWhitespace test', () => {
        const textAnalyzer = new analyzer.TextAnalyzer();

        assert.strictEqual((textAnalyzer as any)._isWhitespace(' '), true, ' ');
        assert.strictEqual((textAnalyzer as any)._isWhitespace('　'), true, '　');
        assert.strictEqual((textAnalyzer as any)._isWhitespace('\t'), true, '\t');
        assert.strictEqual((textAnalyzer as any)._isWhitespace('ａ'), false, 'ａ');

    });

    test('_isCrlf test', () => {
        const textAnalyzer = new analyzer.TextAnalyzer();

        assert.strictEqual((textAnalyzer as any)._isCrlf('\n'), true, '\\n');
        assert.strictEqual((textAnalyzer as any)._isCrlf('\r'), true, '\\r');
        assert.strictEqual((textAnalyzer as any)._isCrlf('\t'), false, '\t');
        assert.strictEqual((textAnalyzer as any)._isCrlf('ａ'), false, 'ａ');

    });
});
