/* eslint-disable @typescript-eslint/no-explicit-any */
import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as parser from '../../../parser/index';
import { BorderState, TextFormatType } from '../../../parser/textParser';

suite('TextParser Test Suite', () => {
    vscode.window.showInformationMessage('Start TextParser tests.');

    const textParser = new parser.TextParser({
        eraseConsecutiveBlankLine: true,

        firstLineHeading: true,
        heading: true,
        align: true,
        indent: true,
        border: true,
        pageBreak: true,
        horizontalRule: true, // hr
        rubyAngle: true, //二重山括弧
        rubyParen: true, //丸括弧
        tcy: true,
        bold: true,
        italic: true,
        emMarkDot: true, //傍点 +文字+
        emMarkDot2: true, //傍点の記法違い 《《文字》》
        emMarkComma: true,
        image: true,

        advanceMode: false //細かい書式をMarkdown方式にする
    });

    test('Simple text test', () => {
        const paragraphs = textParser.parse('line1\nline2\nThis is a ![image](media/image1.png).\nline4\n' +
            'これは|漢字(かんじ)です\n' +
            '## 見出しLv2\n' +
            '!PB\n' +
            '!HR\n' +
            '!R line9\n' +
            '!L line10\n' +
            '!C line11\n' +
            'line12 ^tcy^ and **bold** and *italic* and +dot+ and \u300a\u300adot2\u300b\u300b and ++comma++.'
        );

        assert.strictEqual(paragraphs.length, 12);
        //
        assert.strictEqual(paragraphs[0].outlineLv, 1);
        assert.strictEqual(paragraphs[0].items.length, 1);
        assert.strictEqual((paragraphs[0].items[0] as parser.ParagraphItemText).text, 'line1');
        assert.strictEqual((paragraphs[0].items[0] as parser.ParagraphItemText).ruby, '');
        //
        assert.strictEqual(paragraphs[1].outlineLv, 0);
        assert.strictEqual(paragraphs[1].items.length, 1);
        assert.strictEqual((paragraphs[1].items[0] as parser.ParagraphItemText).text, 'line2');
        assert.strictEqual((paragraphs[1].items[0] as parser.ParagraphItemText).ruby, '');
        //
        assert.strictEqual(paragraphs[2].outlineLv, 0);
        assert.strictEqual(paragraphs[2].items.length, 3);
        assert.strictEqual((paragraphs[2].items[0] as parser.ParagraphItemText).text, 'This is a ');
        assert.strictEqual((paragraphs[2].items[0] as parser.ParagraphItemText).ruby, '');
        assert.strictEqual((paragraphs[2].items[1] as parser.ParagraphItemImage).path, 'media/image1.png');
        assert.strictEqual((paragraphs[2].items[1] as parser.ParagraphItemImage).alt, '');
        assert.strictEqual((paragraphs[2].items[2] as parser.ParagraphItemText).text, '.');
        assert.strictEqual((paragraphs[2].items[2] as parser.ParagraphItemText).ruby, '');
        //
        assert.strictEqual(paragraphs[3].outlineLv, 0);
        assert.strictEqual(paragraphs[3].items.length, 1);
        assert.strictEqual((paragraphs[3].items[0] as parser.ParagraphItemText).text, 'line4');
        assert.strictEqual((paragraphs[3].items[0] as parser.ParagraphItemText).ruby, '');
        //
        assert.strictEqual(paragraphs[4].outlineLv, 0);
        assert.strictEqual(paragraphs[4].items.length, 3);
        assert.strictEqual((paragraphs[4].items[0] as parser.ParagraphItemText).text, 'これは');
        assert.strictEqual((paragraphs[4].items[0] as parser.ParagraphItemText).ruby, '');
        assert.strictEqual((paragraphs[4].items[1] as parser.ParagraphItemText).text, '漢字');
        assert.strictEqual((paragraphs[4].items[1] as parser.ParagraphItemText).ruby, 'かんじ');
        assert.strictEqual((paragraphs[4].items[2] as parser.ParagraphItemText).text, 'です');
        assert.strictEqual((paragraphs[4].items[2] as parser.ParagraphItemText).ruby, '');
        //
        assert.strictEqual(paragraphs[5].outlineLv, 2);
        assert.strictEqual(paragraphs[5].items.length, 1);
        assert.strictEqual((paragraphs[5].items[0] as parser.ParagraphItemText).text, '見出しLv2');
        assert.strictEqual((paragraphs[5].items[0] as parser.ParagraphItemText).ruby, '');
        //
        assert.strictEqual(paragraphs[6].outlineLv, 0);
        assert.strictEqual(paragraphs[6].pageBreak, true);
        assert.strictEqual(paragraphs[6].items.length, 0);
        //
        assert.strictEqual(paragraphs[7].outlineLv, 0);
        assert.strictEqual(paragraphs[7].horizontalRule, true);
        assert.strictEqual(paragraphs[7].items.length, 0);
        //
        assert.strictEqual(paragraphs[8].outlineLv, 0);
        assert.strictEqual(paragraphs[8].alignment, parser.AlignmentType.right);
        assert.strictEqual(paragraphs[8].items.length, 1);
        assert.strictEqual((paragraphs[8].items[0] as parser.ParagraphItemText).text, 'line9');
        assert.strictEqual((paragraphs[8].items[0] as parser.ParagraphItemText).ruby, '');
        //
        assert.strictEqual(paragraphs[9].outlineLv, 0);
        assert.strictEqual(paragraphs[9].alignment, parser.AlignmentType.left);
        assert.strictEqual(paragraphs[9].items.length, 1);
        assert.strictEqual((paragraphs[9].items[0] as parser.ParagraphItemText).text, 'line10');
        assert.strictEqual((paragraphs[9].items[0] as parser.ParagraphItemText).ruby, '');
        //
        assert.strictEqual(paragraphs[10].outlineLv, 0);
        assert.strictEqual(paragraphs[10].alignment, parser.AlignmentType.center);
        assert.strictEqual(paragraphs[10].items.length, 1);
        assert.strictEqual((paragraphs[10].items[0] as parser.ParagraphItemText).text, 'line11');
        assert.strictEqual((paragraphs[10].items[0] as parser.ParagraphItemText).ruby, '');
        //
        assert.strictEqual(paragraphs[11].items.length, 13);
        assert.strictEqual((paragraphs[11].items[0] as parser.ParagraphItemText).text, 'line12 ');
        assert.strictEqual((paragraphs[11].items[1] as parser.ParagraphItemText).text, 'tcy');
        assert.strictEqual((paragraphs[11].items[1] as parser.ParagraphItemText).font.tcy, true);
        assert.strictEqual((paragraphs[11].items[2] as parser.ParagraphItemText).text, ' and ');
        assert.strictEqual((paragraphs[11].items[3] as parser.ParagraphItemText).text, 'bold');
        assert.strictEqual((paragraphs[11].items[3] as parser.ParagraphItemText).font.bold, true);
        assert.strictEqual((paragraphs[11].items[4] as parser.ParagraphItemText).text, ' and ');
        assert.strictEqual((paragraphs[11].items[5] as parser.ParagraphItemText).text, 'italic');
        assert.strictEqual((paragraphs[11].items[5] as parser.ParagraphItemText).font.italic, true);
        assert.strictEqual((paragraphs[11].items[6] as parser.ParagraphItemText).text, ' and ');
        assert.strictEqual((paragraphs[11].items[7] as parser.ParagraphItemText).text, 'dot');
        assert.strictEqual((paragraphs[11].items[7] as parser.ParagraphItemText).font.em, parser.EmphasisMarkType.dot);
        assert.strictEqual((paragraphs[11].items[8] as parser.ParagraphItemText).text, ' and ');
        assert.strictEqual((paragraphs[11].items[9] as parser.ParagraphItemText).text, 'dot2');
        assert.strictEqual((paragraphs[11].items[9] as parser.ParagraphItemText).font.em, parser.EmphasisMarkType.dot);
        assert.strictEqual((paragraphs[11].items[10] as parser.ParagraphItemText).text, ' and ');
        assert.strictEqual((paragraphs[11].items[11] as parser.ParagraphItemText).text, 'comma');
        assert.strictEqual((paragraphs[11].items[11] as parser.ParagraphItemText).font.em, parser.EmphasisMarkType.comma);
        assert.strictEqual((paragraphs[11].items[12] as parser.ParagraphItemText).text, '.');
    });


    test('_checkEraseConsecutiveBlankLine test(No.1-1)', () => {
        const lines: string[] = ['line0', 'line1', '', 'line2'];
        const expect: boolean[] = [false, false, true, false];
        for (let i = 0; i < lines.length; i++) {
            assert.strictEqual((textParser as any)._checkEraseConsecutiveBlankLine(lines[i], i, lines), expect[i], 'line:' + i);
        }
    });

    test('_checkEraseConsecutiveBlankLine test(No.1-2)', () => {
        const lines: string[] = ['line0', 'line1', '', '', 'line2'];
        const expect: boolean[] = [false, false, true, false, false];
        for (let i = 0; i < lines.length; i++) {
            assert.strictEqual((textParser as any)._checkEraseConsecutiveBlankLine(lines[i], i, lines), expect[i], 'line:' + i);
        }
    });

    test('_checkEraseConsecutiveBlankLine test(No.1-3)', () => {
        const lines: string[] = ['line0', 'line1', '', '', '', 'line2'];
        const expect: boolean[] = [false, false, true, true, false, false];
        for (let i = 0; i < lines.length; i++) {
            assert.strictEqual((textParser as any)._checkEraseConsecutiveBlankLine(lines[i], i, lines), expect[i], 'line:' + i);
        }
    });

    test('_checkEraseConsecutiveBlankLine test(No.2-1)', () => {
        const lines: string[] = ['line0', 'line1', '', '# line2'];
        const expect: boolean[] = [false, false, false, false];
        for (let i = 0; i < lines.length; i++) {
            assert.strictEqual((textParser as any)._checkEraseConsecutiveBlankLine(lines[i], i, lines), expect[i], 'line:' + i);
        }
    });

    test('_checkEraseConsecutiveBlankLine test(No.2-2)', () => {
        const lines: string[] = ['line0', 'line1', '', '', '# line2'];
        const expect: boolean[] = [false, false, true, false, false];
        for (let i = 0; i < lines.length; i++) {
            assert.strictEqual((textParser as any)._checkEraseConsecutiveBlankLine(lines[i], i, lines), expect[i], 'line:' + i);
        }
    });

    test('_checkEraseConsecutiveBlankLine test(No.2-3)', () => {
        const lines: string[] = ['line0', 'line1', '', '', '', '# line2'];
        const expect: boolean[] = [false, false, true, true, false, false];
        for (let i = 0; i < lines.length; i++) {
            assert.strictEqual((textParser as any)._checkEraseConsecutiveBlankLine(lines[i], i, lines), expect[i], 'line:' + i);
        }
    });

    test('_checkEraseConsecutiveBlankLine test(No.3-1)', () => {
        const lines: string[] = ['line0', '# line1', '', 'line2'];
        const expect: boolean[] = [false, false, false, false];
        for (let i = 0; i < lines.length; i++) {
            assert.strictEqual((textParser as any)._checkEraseConsecutiveBlankLine(lines[i], i, lines), expect[i], 'line:' + i);
        }
    });

    test('_checkEraseConsecutiveBlankLine test(No.3-2)', () => {
        const lines: string[] = ['line0', '# line1', '', '', 'line2'];
        const expect: boolean[] = [false, false, true, false, false];
        for (let i = 0; i < lines.length; i++) {
            assert.strictEqual((textParser as any)._checkEraseConsecutiveBlankLine(lines[i], i, lines), expect[i], 'line:' + i);
        }
    });

    test('_checkEraseConsecutiveBlankLine test(No.3-3)', () => {
        const lines: string[] = ['line0', '# line1', '', '', '', 'line2'];
        const expect: boolean[] = [false, false, true, true, false, false];
        for (let i = 0; i < lines.length; i++) {
            assert.strictEqual((textParser as any)._checkEraseConsecutiveBlankLine(lines[i], i, lines), expect[i], 'line:' + i);
        }
    });

    test('_checkEraseConsecutiveBlankLine test(No.4-1)', () => {
        const lines: string[] = ['', 'line1'];
        const expect: boolean[] = [true, false];
        for (let i = 0; i < lines.length; i++) {
            assert.strictEqual((textParser as any)._checkEraseConsecutiveBlankLine(lines[i], i, lines), expect[i], 'line:' + i);
        }
    });

    test('_checkEraseConsecutiveBlankLine test(No.4-2)', () => {
        const lines: string[] = ['', '', 'line1'];
        const expect: boolean[] = [true, false, false];
        for (let i = 0; i < lines.length; i++) {
            assert.strictEqual((textParser as any)._checkEraseConsecutiveBlankLine(lines[i], i, lines), expect[i], 'line:' + i);
        }
    });

    test('_checkEraseConsecutiveBlankLine test(No.4-3)', () => {
        const lines: string[] = ['', '', '', 'line1'];
        const expect: boolean[] = [true, true, false, false];
        for (let i = 0; i < lines.length; i++) {
            assert.strictEqual((textParser as any)._checkEraseConsecutiveBlankLine(lines[i], i, lines), expect[i], 'line:' + i);
        }
    });

    test('_checkEraseConsecutiveBlankLine test(No.5-1)', () => {
        const lines: string[] = ['', '# line1'];
        const expect: boolean[] = [false, false];
        for (let i = 0; i < lines.length; i++) {
            assert.strictEqual((textParser as any)._checkEraseConsecutiveBlankLine(lines[i], i, lines), expect[i], 'line:' + i);
        }
    });

    test('_checkEraseConsecutiveBlankLine test(No.5-2)', () => {
        const lines: string[] = ['', '', '# line1'];
        const expect: boolean[] = [true, false, false];
        for (let i = 0; i < lines.length; i++) {
            assert.strictEqual((textParser as any)._checkEraseConsecutiveBlankLine(lines[i], i, lines), expect[i], 'line:' + i);
        }
    });

    test('_checkEraseConsecutiveBlankLine test(No.5-3)', () => {
        const lines: string[] = ['', '', '', '# line1'];
        const expect: boolean[] = [true, true, false, false];
        for (let i = 0; i < lines.length; i++) {
            assert.strictEqual((textParser as any)._checkEraseConsecutiveBlankLine(lines[i], i, lines), expect[i], 'line:' + i);
        }
    });

    test('_checkEraseConsecutiveBlankLine test(No.6-1)', () => {
        const lines: string[] = ['line0', 'line1', ''];
        const expect: boolean[] = [false, false, true];
        for (let i = 0; i < lines.length; i++) {
            assert.strictEqual((textParser as any)._checkEraseConsecutiveBlankLine(lines[i], i, lines), expect[i], 'line:' + i);
        }
    });

    test('_checkEraseConsecutiveBlankLine test(No.6-2)', () => {
        const lines: string[] = ['line0', 'line1', '', ''];
        const expect: boolean[] = [false, false, true, true];
        for (let i = 0; i < lines.length; i++) {
            assert.strictEqual((textParser as any)._checkEraseConsecutiveBlankLine(lines[i], i, lines), expect[i], 'line:' + i);
        }
    });

    test('_checkEraseConsecutiveBlankLine test(No.6-3)', () => {
        const lines: string[] = ['line0', 'line1', '', '', ''];
        const expect: boolean[] = [false, false, true, true, true];
        for (let i = 0; i < lines.length; i++) {
            assert.strictEqual((textParser as any)._checkEraseConsecutiveBlankLine(lines[i], i, lines), expect[i], 'line:' + i);
        }
    });

    test('_checkEraseConsecutiveBlankLine test(No.1-3) disable', () => {
        const lines: string[] = ['line0', 'line1', '', '', '', 'line2'];
        const expect: boolean[] = [false, false, false, false, false, false];
        (textParser as any)._textSetting.eraseConsecutiveBlankLine = false;
        for (let i = 0; i < lines.length; i++) {
            assert.strictEqual((textParser as any)._checkEraseConsecutiveBlankLine(lines[i], i, lines), expect[i], 'line:' + i);
        }
        (textParser as any)._textSetting.eraseConsecutiveBlankLine = true;
    });


    test('_parseIndent test', () => {
        const para = new parser.Paragraph();
        (textParser as any)._indentState = false;
        assert.strictEqual((textParser as any)._parseIndent('!I 1', para), false);
        assert.strictEqual((textParser as any)._indentState, false);
        assert.deepStrictEqual((textParser as any)._indentCommand, { left: 0, right: 0 });
        (textParser as any)._indentState = false;
        assert.strictEqual((textParser as any)._parseIndent('!I2,0', para), true);
        assert.strictEqual((textParser as any)._indentState, true);
        assert.deepStrictEqual((textParser as any)._indentCommand, { left: 2, right: 0 });
        (textParser as any)._indentState = false;
        assert.strictEqual((textParser as any)._parseIndent('!I4,3', para), true);
        assert.strictEqual((textParser as any)._indentState, true);
        assert.deepStrictEqual((textParser as any)._indentCommand, { left: 4, right: 3 });
    });

    test('_parseIndent test(sequence)', () => {
        const lines: string[] = ['line1', ' !I4,3　', 'line2', '!I5,6', 'line4', '!I', 'line6'];
        const para = new parser.Paragraph();
        let i = 0;
        (textParser as any)._indentState = false;
        // (textParser as any)._indentCommand = {left: 0, right:0};
        assert.strictEqual((textParser as any)._parseIndent(lines[i], para), false, 'result:' + i);
        assert.strictEqual((textParser as any)._indentState, false, '_indentState:' + i);
        assert.deepStrictEqual((textParser as any)._indentCommand, { left: 0, right: 0 }, '_indentCommand:' + i);
        assert.deepStrictEqual(para.indent.left, 0, 'indent.left:' + i);
        assert.deepStrictEqual(para.indent.right, 0, 'indent.right:' + i);
        i = 1;
        assert.strictEqual((textParser as any)._parseIndent(lines[i], para), true, 'result:' + i);
        assert.strictEqual((textParser as any)._indentState, true, '_indentState:' + i);
        assert.deepStrictEqual((textParser as any)._indentCommand, { left: 4, right: 3 }, '_indentCommand:' + i);
        assert.deepStrictEqual(para.indent.left, 4, 'indent.left:' + i);
        assert.deepStrictEqual(para.indent.right, 3, 'indent.right:' + i);
        i = 2;
        assert.strictEqual((textParser as any)._parseIndent(lines[i], para), false, 'result:' + i);
        assert.strictEqual((textParser as any)._indentState, true, '_indentState:' + i);
        assert.deepStrictEqual((textParser as any)._indentCommand, { left: 4, right: 3 }, '_indentCommand:' + i);
        assert.deepStrictEqual(para.indent.left, 4, 'indent.left:' + i);
        assert.deepStrictEqual(para.indent.right, 3, 'indent.right:' + i);
        i = 3;
        assert.strictEqual((textParser as any)._parseIndent(lines[i], para), true, 'result:' + i);
        assert.strictEqual((textParser as any)._indentState, true, '_indentState:' + i);
        assert.deepStrictEqual((textParser as any)._indentCommand, { left: 5, right: 6 }, '_indentCommand:' + i);
        assert.deepStrictEqual(para.indent.left, 5, 'indent.left:' + i);
        assert.deepStrictEqual(para.indent.right, 6, 'indent.right:' + i);
        i = 4;
        assert.strictEqual((textParser as any)._parseIndent(lines[i], para), false, 'result:' + i);
        assert.strictEqual((textParser as any)._indentState, true, '_indentState:' + i);
        assert.deepStrictEqual((textParser as any)._indentCommand, { left: 5, right: 6 }, '_indentCommand:' + i);
        assert.deepStrictEqual(para.indent.left, 5, 'indent.left:' + i);
        assert.deepStrictEqual(para.indent.right, 6, 'indent.right:' + i);
        i = 5;
        assert.strictEqual((textParser as any)._parseIndent(lines[i], para), true, 'result:' + i);
        assert.strictEqual((textParser as any)._indentState, false, '_indentState:' + i);
        assert.deepStrictEqual((textParser as any)._indentCommand, { left: 0, right: 0 }, '_indentCommand:' + i);
        assert.deepStrictEqual(para.indent.left, 0, 'indent.left:' + i);
        assert.deepStrictEqual(para.indent.right, 0, 'indent.right:' + i);
        i = 6;
        assert.strictEqual((textParser as any)._parseIndent(lines[i], para), false, 'result:' + i);
        assert.strictEqual((textParser as any)._indentState, false, '_indentState:' + i);
        assert.deepStrictEqual((textParser as any)._indentCommand, { left: 0, right: 0 }, '_indentCommand:' + i);
        assert.deepStrictEqual(para.indent.left, 0, 'indent.left:' + i);
        assert.deepStrictEqual(para.indent.right, 0, 'indent.right:' + i);
    });

    test('_parseIndent test(contain outline)', () => {
        const lines: string[] = ['line1', ' !I4,3　', 'line2', '## line3', 'line4', '!I', 'line6'];
        const para = new parser.Paragraph();
        let i = 0;
        (textParser as any)._indentState = false;
        // (textParser as any)._indentCommand = {left: 0, right:0};
        assert.strictEqual((textParser as any)._parseIndent(lines[i], para), false, 'result:' + i);
        assert.strictEqual((textParser as any)._indentState, false, '_indentState:' + i);
        assert.deepStrictEqual((textParser as any)._indentCommand, { left: 0, right: 0 }, '_indentCommand:' + i);
        assert.deepStrictEqual(para.indent.left, 0, 'indent.left:' + i);
        assert.deepStrictEqual(para.indent.right, 0, 'indent.right:' + i);
        i = 1;
        assert.strictEqual((textParser as any)._parseIndent(lines[i], para), true, 'result:' + i);
        assert.strictEqual((textParser as any)._indentState, true, '_indentState:' + i);
        assert.deepStrictEqual((textParser as any)._indentCommand, { left: 4, right: 3 }, '_indentCommand:' + i);
        assert.deepStrictEqual(para.indent.left, 4, 'indent.left:' + i);
        assert.deepStrictEqual(para.indent.right, 3, 'indent.right:' + i);
        i = 2;
        assert.strictEqual((textParser as any)._parseIndent(lines[i], para), false, 'result:' + i);
        assert.strictEqual((textParser as any)._indentState, true, '_indentState:' + i);
        assert.deepStrictEqual((textParser as any)._indentCommand, { left: 4, right: 3 }, '_indentCommand:' + i);
        assert.deepStrictEqual(para.indent.left, 4, 'indent.left:' + i);
        assert.deepStrictEqual(para.indent.right, 3, 'indent.right:' + i);
        i = 3;
        assert.strictEqual((textParser as any)._parseIndent(lines[i], para), false, 'result:' + i);
        assert.strictEqual((textParser as any)._indentState, true, '_indentState:' + i);
        assert.deepStrictEqual((textParser as any)._indentCommand, { left: 4, right: 3 }, '_indentCommand:' + i); // outline
        assert.deepStrictEqual(para.indent.left, 0, 'indent.left:' + i);
        assert.deepStrictEqual(para.indent.right, 0, 'indent.right:' + i);
        i = 4;
        assert.strictEqual((textParser as any)._parseIndent(lines[i], para), false, 'result:' + i);
        assert.strictEqual((textParser as any)._indentState, true, '_indentState:' + i);
        assert.deepStrictEqual((textParser as any)._indentCommand, { left: 4, right: 3 }, '_indentCommand:' + i);
        assert.deepStrictEqual(para.indent.left, 4, 'indent.left:' + i);
        assert.deepStrictEqual(para.indent.right, 3, 'indent.right:' + i);
        i = 5;
        assert.strictEqual((textParser as any)._parseIndent(lines[i], para), true, 'result:' + i);
        assert.strictEqual((textParser as any)._indentState, false, '_indentState:' + i);
        assert.deepStrictEqual((textParser as any)._indentCommand, { left: 0, right: 0 }, '_indentCommand:' + i);
        assert.deepStrictEqual(para.indent.left, 0, 'indent.left:' + i);
        assert.deepStrictEqual(para.indent.right, 0, 'indent.right:' + i);
        i = 6;
        assert.strictEqual((textParser as any)._parseIndent(lines[i], para), false, 'result:' + i);
        assert.strictEqual((textParser as any)._indentState, false, '_indentState:' + i);
        assert.deepStrictEqual((textParser as any)._indentCommand, { left: 0, right: 0 }, '_indentCommand:' + i);
        assert.deepStrictEqual(para.indent.left, 0, 'indent.left:' + i);
        assert.deepStrictEqual(para.indent.right, 0, 'indent.right:' + i);
    });

    test('_parseIndent test(contain invalid format)', () => {
        const lines: string[] = ['line1', ' !I4,3　', 'line2', '!I,6', 'line4', '!I0,0'];
        const para = new parser.Paragraph();
        let i = 0;
        (textParser as any)._indentState = false;
        // (textParser as any)._indentCommand = {left: 0, right:0};
        assert.strictEqual((textParser as any)._parseIndent(lines[i], para), false, 'result:' + i);
        assert.strictEqual((textParser as any)._indentState, false, '_indentState:' + i);
        assert.deepStrictEqual((textParser as any)._indentCommand, { left: 0, right: 0 }, '_indentCommand:' + i);
        i = 1;
        assert.strictEqual((textParser as any)._parseIndent(lines[i], para), true, 'result:' + i);
        assert.strictEqual((textParser as any)._indentState, true, '_indentState:' + i);
        assert.deepStrictEqual((textParser as any)._indentCommand, { left: 4, right: 3 }, '_indentCommand:' + i);
        i = 2;
        assert.strictEqual((textParser as any)._parseIndent(lines[i], para), false, 'result:' + i);
        assert.strictEqual((textParser as any)._indentState, true, '_indentState:' + i);
        assert.deepStrictEqual((textParser as any)._indentCommand, { left: 4, right: 3 }, '_indentCommand:' + i);
        i = 3;
        assert.strictEqual((textParser as any)._parseIndent(lines[i], para), false, 'result:' + i);
        assert.strictEqual((textParser as any)._indentState, true, '_indentState:' + i);
        assert.deepStrictEqual((textParser as any)._indentCommand, { left: 4, right: 3 }, '_indentCommand:' + i);
        i = 4;
        assert.strictEqual((textParser as any)._parseIndent(lines[i], para), false, 'result:' + i);
        assert.strictEqual((textParser as any)._indentState, true, '_indentState:' + i);
        assert.deepStrictEqual((textParser as any)._indentCommand, { left: 4, right: 3 }, '_indentCommand:' + i);
        i = 5;
        assert.strictEqual((textParser as any)._parseIndent(lines[i], para), true, 'result:' + i);
        assert.strictEqual((textParser as any)._indentState, false, '_indentState:' + i);
        assert.deepStrictEqual((textParser as any)._indentCommand, { left: 0, right: 0 }, '_indentCommand:' + i);
    });

    test('_parseIndent test(disable)', () => {
        const para = new parser.Paragraph();
        (textParser as any)._textSetting.indent = false;
        (textParser as any)._indentState = false;
        assert.strictEqual((textParser as any)._parseIndent('!I4,3', para), false);
        assert.strictEqual((textParser as any)._indentState, false);
        assert.deepStrictEqual((textParser as any)._indentCommand, { left: 0, right: 0 });
        (textParser as any)._textSetting.indent = true;
    });

    test('_parseBorder test', () => {
        const lines: string[] = ['line1', ' !BD,TLRBH　', 'line2', 'line3', 'line4', '!BD'];
        const para = new parser.Paragraph();
        (textParser as any)._borderState = BorderState.none;
        assert.strictEqual((textParser as any)._parseBorder('!BD,TLRBH', para, 0, lines), true);
        assert.deepStrictEqual((textParser as any)._borderCommand, { top: true, bottom: true, left: true, right: true, inner: true });
        assert.strictEqual((textParser as any)._borderState, BorderState.start);
        assert.deepStrictEqual(para.border, { top: false, bottom: false, left: false, right: false, inner: false });

        (textParser as any)._borderState = BorderState.none;
        assert.strictEqual((textParser as any)._parseBorder('!BD,T', para, 0, lines), true);
        assert.deepStrictEqual((textParser as any)._borderCommand, { top: true, bottom: false, left: false, right: false, inner: false });
        assert.strictEqual((textParser as any)._borderState, BorderState.start);
        assert.deepStrictEqual(para.border, { top: false, bottom: false, left: false, right: false, inner: false });

        (textParser as any)._borderState = BorderState.none;
        assert.strictEqual((textParser as any)._parseBorder('!BD,L', para, 0, lines), true);
        assert.deepStrictEqual((textParser as any)._borderCommand, { top: false, bottom: false, left: true, right: false, inner: false });
        assert.strictEqual((textParser as any)._borderState, BorderState.start);
        assert.deepStrictEqual(para.border, { top: false, bottom: false, left: false, right: false, inner: false });

        (textParser as any)._borderState = BorderState.none;
        assert.strictEqual((textParser as any)._parseBorder('!BD,R', para, 0, lines), true);
        assert.deepStrictEqual((textParser as any)._borderCommand, { top: false, bottom: false, left: false, right: true, inner: false });
        assert.strictEqual((textParser as any)._borderState, BorderState.start);
        assert.deepStrictEqual(para.border, { top: false, bottom: false, left: false, right: false, inner: false });

        (textParser as any)._borderState = BorderState.none;
        assert.strictEqual((textParser as any)._parseBorder('!BD,B', para, 0, lines), true);
        assert.deepStrictEqual((textParser as any)._borderCommand, { top: false, bottom: true, left: false, right: false, inner: false });
        assert.strictEqual((textParser as any)._borderState, BorderState.start);
        assert.deepStrictEqual(para.border, { top: false, bottom: false, left: false, right: false, inner: false });

        (textParser as any)._borderState = BorderState.none;
        assert.strictEqual((textParser as any)._parseBorder('!BD,H', para, 0, lines), true);
        assert.deepStrictEqual((textParser as any)._borderCommand, { top: false, bottom: false, left: false, right: false, inner: true });
        assert.strictEqual((textParser as any)._borderState, BorderState.start);
        assert.deepStrictEqual(para.border, { top: false, bottom: false, left: false, right: false, inner: false });
    });

    test('_parseBorder test(full)', () => {
        let i = 0;
        const lines: string[] = ['line1', ' !BD,TLRBH　', 'line2', 'line3', 'line4', '!BD'];
        const para = new parser.Paragraph();
        (textParser as any)._borderCommand = { top: false, bottom: false, left: false, right: false, inner: false };
        (textParser as any)._borderState = BorderState.none;
        i = 0;
        para.border = { top: false, bottom: false, left: false, right: false, inner: false };
        assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), false);
        assert.deepStrictEqual((textParser as any)._borderCommand, { top: false, bottom: false, left: false, right: false, inner: false }, '_borderCommand:' + i);
        assert.strictEqual((textParser as any)._borderState, BorderState.none);
        assert.deepStrictEqual(para.border, { top: false, bottom: false, left: false, right: false, inner: false }, 'border:' + i);
        i = 1;
        para.border = { top: false, bottom: false, left: false, right: false, inner: false };
        assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), true);
        assert.deepStrictEqual((textParser as any)._borderCommand, { top: true, bottom: true, left: true, right: true, inner: true }, '_borderCommand:' + i);
        assert.strictEqual((textParser as any)._borderState, BorderState.start);
        assert.deepStrictEqual(para.border, { top: false, bottom: false, left: false, right: false, inner: false }, 'border:' + i);
        i = 2;
        para.border = { top: false, bottom: false, left: false, right: false, inner: false };
        assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), false);
        assert.deepStrictEqual((textParser as any)._borderCommand, { top: true, bottom: true, left: true, right: true, inner: true }, '_borderCommand:' + i);
        assert.strictEqual((textParser as any)._borderState, BorderState.inner);
        assert.deepStrictEqual(para.border, { top: true, bottom: true, left: true, right: true, inner: false }, 'border:' + i);
        i = 3;
        para.border = { top: false, bottom: false, left: false, right: false, inner: false };
        assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), false);
        assert.deepStrictEqual((textParser as any)._borderCommand, { top: true, bottom: true, left: true, right: true, inner: true }, '_borderCommand:' + i);
        assert.strictEqual((textParser as any)._borderState, BorderState.inner);
        assert.deepStrictEqual(para.border, { top: false, bottom: true, left: true, right: true, inner: false }, 'border:' + i);
        i = 4;
        para.border = { top: false, bottom: false, left: false, right: false, inner: false };
        assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), false);
        assert.deepStrictEqual((textParser as any)._borderCommand, { top: true, bottom: true, left: true, right: true, inner: true }, '_borderCommand:' + i);
        assert.strictEqual((textParser as any)._borderState, BorderState.inner);
        assert.deepStrictEqual(para.border, { top: false, bottom: true, left: true, right: true, inner: false }, 'border:' + i);
        i = 5;
        para.border = { top: false, bottom: false, left: false, right: false, inner: false };
        assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), true);
        assert.deepStrictEqual((textParser as any)._borderCommand, { top: false, bottom: false, left: false, right: false, inner: false }, '_borderCommand:' + i);
        assert.strictEqual((textParser as any)._borderState, BorderState.none);
        assert.deepStrictEqual(para.border, { top: false, bottom: false, left: false, right: false, inner: false }, 'border:' + i);
    });

    test('_parseBorder test(none inner)', () => {
        let i = 0;
        const lines: string[] = ['line1', ' !BD,TLRB　', 'line2', 'line3', 'line4', '!BD'];
        const para = new parser.Paragraph();
        (textParser as any)._borderCommand = { top: false, bottom: false, left: false, right: false, inner: false };
        (textParser as any)._borderState = BorderState.none;
        i = 0;
        para.border = { top: false, bottom: false, left: false, right: false, inner: false };
        assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), false);
        assert.deepStrictEqual((textParser as any)._borderCommand, { top: false, bottom: false, left: false, right: false, inner: false }, '_borderCommand:' + i);
        assert.strictEqual((textParser as any)._borderState, BorderState.none);
        assert.deepStrictEqual(para.border, { top: false, bottom: false, left: false, right: false, inner: false }, 'border:' + i);
        i = 1;
        para.border = { top: false, bottom: false, left: false, right: false, inner: false };
        assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), true);
        assert.deepStrictEqual((textParser as any)._borderCommand, { top: true, bottom: true, left: true, right: true, inner: false }, '_borderCommand:' + i);
        assert.strictEqual((textParser as any)._borderState, BorderState.start);
        assert.deepStrictEqual(para.border, { top: false, bottom: false, left: false, right: false, inner: false }, 'border:' + i);
        i = 2;
        para.border = { top: false, bottom: false, left: false, right: false, inner: false };
        assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), false);
        assert.deepStrictEqual((textParser as any)._borderCommand, { top: true, bottom: true, left: true, right: true, inner: false }, '_borderCommand:' + i);
        assert.strictEqual((textParser as any)._borderState, BorderState.inner);
        assert.deepStrictEqual(para.border, { top: true, bottom: false, left: true, right: true, inner: false }, 'border:' + i);
        i = 3;
        para.border = { top: false, bottom: false, left: false, right: false, inner: false };
        assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), false);
        assert.deepStrictEqual((textParser as any)._borderCommand, { top: true, bottom: true, left: true, right: true, inner: false }, '_borderCommand:' + i);
        assert.strictEqual((textParser as any)._borderState, BorderState.inner);
        assert.deepStrictEqual(para.border, { top: false, bottom: false, left: true, right: true, inner: false }, 'border:' + i);
        i = 4;
        para.border = { top: false, bottom: false, left: false, right: false, inner: false };
        assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), false);
        assert.deepStrictEqual((textParser as any)._borderCommand, { top: true, bottom: true, left: true, right: true, inner: false }, '_borderCommand:' + i);
        assert.strictEqual((textParser as any)._borderState, BorderState.inner);
        assert.deepStrictEqual(para.border, { top: false, bottom: true, left: true, right: true, inner: false }, 'border:' + i);
        i = 5;
        para.border = { top: false, bottom: false, left: false, right: false, inner: false };
        assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), true);
        assert.deepStrictEqual((textParser as any)._borderCommand, { top: false, bottom: false, left: false, right: false, inner: false }, '_borderCommand:' + i);
        assert.strictEqual((textParser as any)._borderState, BorderState.none);
        assert.deepStrictEqual(para.border, { top: false, bottom: false, left: false, right: false, inner: false }, 'border:' + i);
    });

    test('_parseBorder test(none top)', () => {
        let i = 0;
        const lines: string[] = ['line1', ' !BD,LRBH　', 'line2', 'line3', 'line4', '!BD'];
        const para = new parser.Paragraph();
        (textParser as any)._borderCommand = { top: false, bottom: false, left: false, right: false, inner: false };
        (textParser as any)._borderState = BorderState.none;
        i = 0;
        para.border = { top: false, bottom: false, left: false, right: false, inner: false };
        assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), false);
        assert.deepStrictEqual((textParser as any)._borderCommand, { top: false, bottom: false, left: false, right: false, inner: false }, '_borderCommand:' + i);
        assert.strictEqual((textParser as any)._borderState, BorderState.none);
        assert.deepStrictEqual(para.border, { top: false, bottom: false, left: false, right: false, inner: false }, 'border:' + i);
        i = 1;
        para.border = { top: false, bottom: false, left: false, right: false, inner: false };
        assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), true);
        assert.deepStrictEqual((textParser as any)._borderCommand, { top: false, bottom: true, left: true, right: true, inner: true }, '_borderCommand:' + i);
        assert.strictEqual((textParser as any)._borderState, BorderState.start);
        assert.deepStrictEqual(para.border, { top: false, bottom: false, left: false, right: false, inner: false }, 'border:' + i);
        i = 2;
        para.border = { top: false, bottom: false, left: false, right: false, inner: false };
        assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), false);
        assert.deepStrictEqual((textParser as any)._borderCommand, { top: false, bottom: true, left: true, right: true, inner: true }, '_borderCommand:' + i);
        assert.strictEqual((textParser as any)._borderState, BorderState.inner);
        assert.deepStrictEqual(para.border, { top: false, bottom: true, left: true, right: true, inner: false }, 'border:' + i);
        i = 3;
        para.border = { top: false, bottom: false, left: false, right: false, inner: false };
        assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), false);
        assert.deepStrictEqual((textParser as any)._borderCommand, { top: false, bottom: true, left: true, right: true, inner: true }, '_borderCommand:' + i);
        assert.strictEqual((textParser as any)._borderState, BorderState.inner);
        assert.deepStrictEqual(para.border, { top: false, bottom: true, left: true, right: true, inner: false }, 'border:' + i);
        i = 4;
        para.border = { top: false, bottom: false, left: false, right: false, inner: false };
        assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), false);
        assert.deepStrictEqual((textParser as any)._borderCommand, { top: false, bottom: true, left: true, right: true, inner: true }, '_borderCommand:' + i);
        assert.strictEqual((textParser as any)._borderState, BorderState.inner);
        assert.deepStrictEqual(para.border, { top: false, bottom: true, left: true, right: true, inner: false }, 'border:' + i);
        i = 5;
        para.border = { top: false, bottom: false, left: false, right: false, inner: false };
        assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), true);
        assert.deepStrictEqual((textParser as any)._borderCommand, { top: false, bottom: false, left: false, right: false, inner: false }, '_borderCommand:' + i);
        assert.strictEqual((textParser as any)._borderState, BorderState.none);
        assert.deepStrictEqual(para.border, { top: false, bottom: false, left: false, right: false, inner: false }, 'border:' + i);
    });

    test('_parseBorder test(none bottom)', () => {
        let i = 0;
        const lines: string[] = ['line1', ' !BD,TLRH　', 'line2', 'line3', 'line4', '!BD'];
        const para = new parser.Paragraph();
        (textParser as any)._borderCommand = { top: false, bottom: false, left: false, right: false, inner: false };
        (textParser as any)._borderState = BorderState.none;
        i = 0;
        para.border = { top: false, bottom: false, left: false, right: false, inner: false };
        assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), false);
        assert.deepStrictEqual((textParser as any)._borderCommand, { top: false, bottom: false, left: false, right: false, inner: false }, '_borderCommand:' + i);
        assert.strictEqual((textParser as any)._borderState, BorderState.none);
        assert.deepStrictEqual(para.border, { top: false, bottom: false, left: false, right: false, inner: false }, 'border:' + i);
        i = 1;
        para.border = { top: false, bottom: false, left: false, right: false, inner: false };
        assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), true);
        assert.deepStrictEqual((textParser as any)._borderCommand, { top: true, bottom: false, left: true, right: true, inner: true }, '_borderCommand:' + i);
        assert.strictEqual((textParser as any)._borderState, BorderState.start);
        assert.deepStrictEqual(para.border, { top: false, bottom: false, left: false, right: false, inner: false }, 'border:' + i);
        i = 2;
        para.border = { top: false, bottom: false, left: false, right: false, inner: false };
        assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), false);
        assert.deepStrictEqual((textParser as any)._borderCommand, { top: true, bottom: false, left: true, right: true, inner: true }, '_borderCommand:' + i);
        assert.strictEqual((textParser as any)._borderState, BorderState.inner);
        assert.deepStrictEqual(para.border, { top: true, bottom: true, left: true, right: true, inner: false }, 'border:' + i);
        i = 3;
        para.border = { top: false, bottom: false, left: false, right: false, inner: false };
        assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), false);
        assert.deepStrictEqual((textParser as any)._borderCommand, { top: true, bottom: false, left: true, right: true, inner: true }, '_borderCommand:' + i);
        assert.strictEqual((textParser as any)._borderState, BorderState.inner);
        assert.deepStrictEqual(para.border, { top: false, bottom: true, left: true, right: true, inner: false }, 'border:' + i);
        i = 4;
        para.border = { top: false, bottom: false, left: false, right: false, inner: false };
        assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), false);
        assert.deepStrictEqual((textParser as any)._borderCommand, { top: true, bottom: false, left: true, right: true, inner: true }, '_borderCommand:' + i);
        assert.strictEqual((textParser as any)._borderState, BorderState.inner);
        assert.deepStrictEqual(para.border, { top: false, bottom: false, left: true, right: true, inner: false }, 'border:' + i);
        i = 5;
        para.border = { top: false, bottom: false, left: false, right: false, inner: false };
        assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), true);
        assert.deepStrictEqual((textParser as any)._borderCommand, { top: false, bottom: false, left: false, right: false, inner: false }, '_borderCommand:' + i);
        assert.strictEqual((textParser as any)._borderState, BorderState.none);
        assert.deepStrictEqual(para.border, { top: false, bottom: false, left: false, right: false, inner: false }, 'border:' + i);
    });

    test('_parseBorder test(none left)', () => {
        let i = 0;
        const lines: string[] = ['line1', ' !BD,TRBH　', 'line2', 'line3', 'line4', '!BD'];
        const para = new parser.Paragraph();
        (textParser as any)._borderCommand = { top: false, bottom: false, left: false, right: false, inner: false };
        (textParser as any)._borderState = BorderState.none;
        i = 0;
        para.border = { top: false, bottom: false, left: false, right: false, inner: false };
        assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), false);
        assert.deepStrictEqual((textParser as any)._borderCommand, { top: false, bottom: false, left: false, right: false, inner: false }, '_borderCommand:' + i);
        assert.strictEqual((textParser as any)._borderState, BorderState.none);
        assert.deepStrictEqual(para.border, { top: false, bottom: false, left: false, right: false, inner: false }, 'border:' + i);
        i = 1;
        para.border = { top: false, bottom: false, left: false, right: false, inner: false };
        assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), true);
        assert.deepStrictEqual((textParser as any)._borderCommand, { top: true, bottom: true, left: false, right: true, inner: true }, '_borderCommand:' + i);
        assert.strictEqual((textParser as any)._borderState, BorderState.start);
        assert.deepStrictEqual(para.border, { top: false, bottom: false, left: false, right: false, inner: false }, 'border:' + i);
        i = 2;
        para.border = { top: false, bottom: false, left: false, right: false, inner: false };
        assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), false);
        assert.deepStrictEqual((textParser as any)._borderCommand, { top: true, bottom: true, left: false, right: true, inner: true }, '_borderCommand:' + i);
        assert.strictEqual((textParser as any)._borderState, BorderState.inner);
        assert.deepStrictEqual(para.border, { top: true, bottom: true, left: false, right: true, inner: false }, 'border:' + i);
        i = 3;
        para.border = { top: false, bottom: false, left: false, right: false, inner: false };
        assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), false);
        assert.deepStrictEqual((textParser as any)._borderCommand, { top: true, bottom: true, left: false, right: true, inner: true }, '_borderCommand:' + i);
        assert.strictEqual((textParser as any)._borderState, BorderState.inner);
        assert.deepStrictEqual(para.border, { top: false, bottom: true, left: false, right: true, inner: false }, 'border:' + i);
        i = 4;
        para.border = { top: false, bottom: false, left: false, right: false, inner: false };
        assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), false);
        assert.deepStrictEqual((textParser as any)._borderCommand, { top: true, bottom: true, left: false, right: true, inner: true }, '_borderCommand:' + i);
        assert.strictEqual((textParser as any)._borderState, BorderState.inner);
        assert.deepStrictEqual(para.border, { top: false, bottom: true, left: false, right: true, inner: false }, 'border:' + i);
        i = 5;
        para.border = { top: false, bottom: false, left: false, right: false, inner: false };
        assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), true);
        assert.deepStrictEqual((textParser as any)._borderCommand, { top: false, bottom: false, left: false, right: false, inner: false }, '_borderCommand:' + i);
        assert.strictEqual((textParser as any)._borderState, BorderState.none);
        assert.deepStrictEqual(para.border, { top: false, bottom: false, left: false, right: false, inner: false }, 'border:' + i);
    });

    test('_parseBorder test(none right)', () => {
        let i = 0;
        const lines: string[] = ['line1', ' !BD,TLBH　', 'line2', 'line3', 'line4', '!BD'];
        const para = new parser.Paragraph();
        (textParser as any)._borderCommand = { top: false, bottom: false, left: false, right: false, inner: false };
        (textParser as any)._borderState = BorderState.none;
        i = 0;
        para.border = { top: false, bottom: false, left: false, right: false, inner: false };
        assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), false);
        assert.deepStrictEqual((textParser as any)._borderCommand, { top: false, bottom: false, left: false, right: false, inner: false }, '_borderCommand:' + i);
        assert.strictEqual((textParser as any)._borderState, BorderState.none);
        assert.deepStrictEqual(para.border, { top: false, bottom: false, left: false, right: false, inner: false }, 'border:' + i);
        i = 1;
        para.border = { top: false, bottom: false, left: false, right: false, inner: false };
        assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), true);
        assert.deepStrictEqual((textParser as any)._borderCommand, { top: true, bottom: true, left: true, right: false, inner: true }, '_borderCommand:' + i);
        assert.strictEqual((textParser as any)._borderState, BorderState.start);
        assert.deepStrictEqual(para.border, { top: false, bottom: false, left: false, right: false, inner: false }, 'border:' + i);
        i = 2;
        para.border = { top: false, bottom: false, left: false, right: false, inner: false };
        assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), false);
        assert.deepStrictEqual((textParser as any)._borderCommand, { top: true, bottom: true, left: true, right: false, inner: true }, '_borderCommand:' + i);
        assert.strictEqual((textParser as any)._borderState, BorderState.inner);
        assert.deepStrictEqual(para.border, { top: true, bottom: true, left: true, right: false, inner: false }, 'border:' + i);
        i = 3;
        para.border = { top: false, bottom: false, left: false, right: false, inner: false };
        assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), false);
        assert.deepStrictEqual((textParser as any)._borderCommand, { top: true, bottom: true, left: true, right: false, inner: true }, '_borderCommand:' + i);
        assert.strictEqual((textParser as any)._borderState, BorderState.inner);
        assert.deepStrictEqual(para.border, { top: false, bottom: true, left: true, right: false, inner: false }, 'border:' + i);
        i = 4;
        para.border = { top: false, bottom: false, left: false, right: false, inner: false };
        assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), false);
        assert.deepStrictEqual((textParser as any)._borderCommand, { top: true, bottom: true, left: true, right: false, inner: true }, '_borderCommand:' + i);
        assert.strictEqual((textParser as any)._borderState, BorderState.inner);
        assert.deepStrictEqual(para.border, { top: false, bottom: true, left: true, right: false, inner: false }, 'border:' + i);
        i = 5;
        para.border = { top: false, bottom: false, left: false, right: false, inner: false };
        assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), true);
        assert.deepStrictEqual((textParser as any)._borderCommand, { top: false, bottom: false, left: false, right: false, inner: false }, '_borderCommand:' + i);
        assert.strictEqual((textParser as any)._borderState, BorderState.none);
        assert.deepStrictEqual(para.border, { top: false, bottom: false, left: false, right: false, inner: false }, 'border:' + i);
    });

    test('_parseBorder test(only one)', () => {
        let i = 0;
        const lines: string[] = ['line1', ' !BD,TLRBH　', 'line2', '!BD', 'line3', 'line4'];
        const para = new parser.Paragraph();
        (textParser as any)._borderCommand = { top: false, bottom: false, left: false, right: false, inner: false };
        (textParser as any)._borderState = BorderState.none;
        i = 0;
        para.border = { top: false, bottom: false, left: false, right: false, inner: false };
        assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), false);
        assert.deepStrictEqual((textParser as any)._borderCommand, { top: false, bottom: false, left: false, right: false, inner: false }, '_borderCommand:' + i);
        assert.strictEqual((textParser as any)._borderState, BorderState.none);
        assert.deepStrictEqual(para.border, { top: false, bottom: false, left: false, right: false, inner: false }, 'border:' + i);
        i = 1;
        para.border = { top: false, bottom: false, left: false, right: false, inner: false };
        assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), true);
        assert.deepStrictEqual((textParser as any)._borderCommand, { top: true, bottom: true, left: true, right: true, inner: true }, '_borderCommand:' + i);
        assert.strictEqual((textParser as any)._borderState, BorderState.start);
        assert.deepStrictEqual(para.border, { top: false, bottom: false, left: false, right: false, inner: false }, 'border:' + i);
        i = 2;
        para.border = { top: false, bottom: false, left: false, right: false, inner: false };
        assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), false);
        assert.deepStrictEqual((textParser as any)._borderCommand, { top: true, bottom: true, left: true, right: true, inner: true }, '_borderCommand:' + i);
        assert.strictEqual((textParser as any)._borderState, BorderState.start);
        assert.deepStrictEqual(para.border, { top: true, bottom: true, left: true, right: true, inner: false }, 'border:' + i);
        i = 3;
        para.border = { top: false, bottom: false, left: false, right: false, inner: false };
        assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), true);
        assert.deepStrictEqual((textParser as any)._borderCommand, { top: false, bottom: false, left: false, right: false, inner: false }, '_borderCommand:' + i);
        assert.strictEqual((textParser as any)._borderState, BorderState.none);
        assert.deepStrictEqual(para.border, { top: false, bottom: false, left: false, right: false, inner: false }, 'border:' + i);
    });

    test('_parseBorder test(disable)', () => {
        const lines: string[] = ['line1', ' !BD,TLRBH　', 'line2', 'line3', 'line4', '!BD'];
        const para = new parser.Paragraph();
        (textParser as any)._textSetting.border = false;
        (textParser as any)._borderState = BorderState.none;
        assert.strictEqual((textParser as any)._parseBorder('!BD,TLRBH', para, 0, lines), false);
        assert.deepStrictEqual((textParser as any)._borderCommand, { top: false, bottom: false, left: false, right: false, inner: false });
        assert.strictEqual((textParser as any)._borderState, BorderState.none);
        assert.deepStrictEqual(para.border, { top: false, bottom: false, left: false, right: false, inner: false });
        (textParser as any)._textSetting.border = true;
    });

    test('_parsePageBreak test', () => {
        assert.strictEqual((textParser as any)._parsePageBreak('hoge'), false);
        assert.strictEqual((textParser as any)._parsePageBreak('!PB'), true);
        assert.strictEqual((textParser as any)._parsePageBreak(' !PB'), true);
        assert.strictEqual((textParser as any)._parsePageBreak('!PB '), true);
        assert.strictEqual((textParser as any)._parsePageBreak(' !PB '), true);
        assert.strictEqual((textParser as any)._parsePageBreak('！PB'), true);
        assert.strictEqual((textParser as any)._parsePageBreak('!ＰB'), true);
        assert.strictEqual((textParser as any)._parsePageBreak('!PＢ'), true);
        assert.strictEqual((textParser as any)._parsePageBreak('！ＰＢ'), true);
    });

    test('_parsePageBreak test(disable)', () => {
        (textParser as any)._textSetting.pageBreak = false;
        assert.strictEqual((textParser as any)._parsePageBreak('hoge'), false);
        assert.strictEqual((textParser as any)._parsePageBreak('!PB'), false);
        (textParser as any)._textSetting.pageBreak = true;
    });

    test('_parseHorizontalRule test', () => {
        assert.strictEqual((textParser as any)._parseHorizontalRule('hoge'), false);
        assert.strictEqual((textParser as any)._parseHorizontalRule('!HR'), true);
        assert.strictEqual((textParser as any)._parseHorizontalRule(' !HR'), true);
        assert.strictEqual((textParser as any)._parseHorizontalRule('!HR '), true);
        assert.strictEqual((textParser as any)._parseHorizontalRule(' !HR '), true);
        assert.strictEqual((textParser as any)._parseHorizontalRule('！HR'), true);
        assert.strictEqual((textParser as any)._parseHorizontalRule('!ＨR'), true);
        assert.strictEqual((textParser as any)._parseHorizontalRule('!HＲ'), true);
        assert.strictEqual((textParser as any)._parseHorizontalRule('！ＨＲ'), true);
    });

    test('_parseHorizontalRule test(disable)', () => {
        (textParser as any)._textSetting.horizontalRule = false;
        assert.strictEqual((textParser as any)._parseHorizontalRule('hoge'), false);
        assert.strictEqual((textParser as any)._parseHorizontalRule('!HR'), false);
        (textParser as any)._textSetting.horizontalRule = true;
    });

    test('_parseOutline test', () => {
        // Lv1~9
        {
            const para = new parser.Paragraph();
            assert.strictEqual((textParser as any)._parseOutline('# hoge ', para, 1), 'hoge ');
            assert.strictEqual(para.outlineLv, 1);
            assert.strictEqual(para.font.gothic, true);
            assert.strictEqual(para.font.sizeRatio, 140);
        }
        {
            const para = new parser.Paragraph();
            assert.strictEqual((textParser as any)._parseOutline('## hoge', para, 1), 'hoge');
            assert.strictEqual(para.outlineLv, 2);
            assert.strictEqual(para.font.gothic, true);
            assert.strictEqual(para.font.sizeRatio, 120);
        }
        {
            const para = new parser.Paragraph();
            assert.strictEqual((textParser as any)._parseOutline('### hoge', para, 1), 'hoge');
            assert.strictEqual(para.outlineLv, 3);
            assert.strictEqual(para.font.gothic, true);
            assert.strictEqual(para.font.sizeRatio, 110);
        }
        {
            const para = new parser.Paragraph();
            assert.strictEqual((textParser as any)._parseOutline('#### hoge', para, 1), 'hoge');
            assert.strictEqual(para.outlineLv, 4);
            assert.strictEqual(para.font.gothic, true);
            assert.strictEqual(para.font.sizeRatio, 100);
        }
        {
            const para = new parser.Paragraph();
            assert.strictEqual((textParser as any)._parseOutline('##### hoge', para, 1), 'hoge');
            assert.strictEqual(para.outlineLv, 5);
            assert.strictEqual(para.font.gothic, true);
            assert.strictEqual(para.font.sizeRatio, 100);
        }
        {
            const para = new parser.Paragraph();
            assert.strictEqual((textParser as any)._parseOutline('###### hoge', para, 1), 'hoge');
            assert.strictEqual(para.outlineLv, 6);
            assert.strictEqual(para.font.gothic, true);
            assert.strictEqual(para.font.sizeRatio, 100);
        }
        {
            const para = new parser.Paragraph();
            assert.strictEqual((textParser as any)._parseOutline('####### hoge', para, 1), 'hoge');
            assert.strictEqual(para.outlineLv, 7);
            assert.strictEqual(para.font.gothic, true);
            assert.strictEqual(para.font.sizeRatio, 100);
        }
        {
            const para = new parser.Paragraph();
            assert.strictEqual((textParser as any)._parseOutline('######## hoge', para, 1), 'hoge');
            assert.strictEqual(para.outlineLv, 8);
            assert.strictEqual(para.font.gothic, true);
            assert.strictEqual(para.font.sizeRatio, 100);
        }
        {
            const para = new parser.Paragraph();
            assert.strictEqual((textParser as any)._parseOutline('######### hoge', para, 1), 'hoge');
            assert.strictEqual(para.outlineLv, 9);
            assert.strictEqual(para.font.gothic, true);
            assert.strictEqual(para.font.sizeRatio, 100);
        }
        {
            const para = new parser.Paragraph();
            assert.strictEqual((textParser as any)._parseOutline('＃ hoge ', para, 1), 'hoge ');
            assert.strictEqual(para.outlineLv, 1);
            assert.strictEqual(para.font.gothic, true);
            assert.strictEqual(para.font.sizeRatio, 140);
        }
        {
            const para = new parser.Paragraph();
            assert.strictEqual((textParser as any)._parseOutline('＃＃ hoge', para, 1), 'hoge');
            assert.strictEqual(para.outlineLv, 2);
            assert.strictEqual(para.font.gothic, true);
            assert.strictEqual(para.font.sizeRatio, 120);
        }
        {
            const para = new parser.Paragraph();
            assert.strictEqual((textParser as any)._parseOutline('hoge', para, 0), 'hoge');
            assert.strictEqual(para.outlineLv, 1);
            assert.strictEqual(para.font.gothic, true);
            assert.strictEqual(para.font.sizeRatio, 140);
        }

        //unmatch
        {
            const para = new parser.Paragraph();
            assert.strictEqual((textParser as any)._parseOutline('hoge', para, 1), 'hoge');
            assert.strictEqual(para.outlineLv, 0);
            assert.strictEqual(para.font.gothic, false);
            assert.strictEqual(para.font.sizeRatio, 100);
        }
        {
            const para = new parser.Paragraph();
            assert.strictEqual((textParser as any)._parseOutline('#hoge ', para, 1), '#hoge ');
            assert.strictEqual(para.outlineLv, 0);
            assert.strictEqual(para.font.gothic, false);
            assert.strictEqual(para.font.sizeRatio, 100);
        }
        {
            const para = new parser.Paragraph();
            assert.strictEqual((textParser as any)._parseOutline('########## hoge', para, 1), '########## hoge');
            assert.strictEqual(para.outlineLv, 0);
            assert.strictEqual(para.font.gothic, false);
            assert.strictEqual(para.font.sizeRatio, 100);
        }
    });


    test('_parseOutline test(disable)', () => {
        // Lv1~9
        (textParser as any)._textSetting.heading = false;
        const para = new parser.Paragraph();
        assert.strictEqual((textParser as any)._parseOutline('# hoge ', para, 1), '# hoge ');
        assert.strictEqual(para.outlineLv, 0);
        assert.strictEqual(para.font.gothic, false);
        assert.strictEqual(para.font.sizeRatio, 100);
        (textParser as any)._textSetting.heading = true;
    });

    test('_parseAlignment test(right)', () => {
        {
            const para = new parser.Paragraph();
            assert.strictEqual((textParser as any)._parseAlignment('!R hoge', para, parser.AlignmentType.none), '!R hoge');
            assert.strictEqual(para.alignment, parser.AlignmentType.none);
        }
        {
            const para = new parser.Paragraph();
            assert.strictEqual((textParser as any)._parseAlignment('!R hoge', para, parser.AlignmentType.right), 'hoge');
            assert.strictEqual(para.alignment, parser.AlignmentType.right);
        }
        {
            const para = new parser.Paragraph();
            assert.strictEqual((textParser as any)._parseAlignment(' !R hoge', para, parser.AlignmentType.right), 'hoge');
            assert.strictEqual(para.alignment, parser.AlignmentType.right);
        }
        {
            const para = new parser.Paragraph();
            assert.strictEqual((textParser as any)._parseAlignment('　!R　hoge', para, parser.AlignmentType.right), 'hoge');
            assert.strictEqual(para.alignment, parser.AlignmentType.right);
        }
        {
            const para = new parser.Paragraph();
            assert.strictEqual((textParser as any)._parseAlignment('　！R　hoge', para, parser.AlignmentType.right), 'hoge');
            assert.strictEqual(para.alignment, parser.AlignmentType.right);
        }
        {
            const para = new parser.Paragraph();
            assert.strictEqual((textParser as any)._parseAlignment('　!Ｒ　hoge', para, parser.AlignmentType.right), 'hoge');
            assert.strictEqual(para.alignment, parser.AlignmentType.right);
        }
        {
            const para = new parser.Paragraph();
            assert.strictEqual((textParser as any)._parseAlignment('　!Ｒ　hoge', para, parser.AlignmentType.right), 'hoge');
            assert.strictEqual(para.alignment, parser.AlignmentType.right);
        }

        {
            const para = new parser.Paragraph();
            assert.strictEqual((textParser as any)._parseAlignment('!B hoge', para, parser.AlignmentType.right), 'hoge');
            assert.strictEqual(para.alignment, parser.AlignmentType.right);
        }
        {
            const para = new parser.Paragraph();
            assert.strictEqual((textParser as any)._parseAlignment('!Ｂ hoge', para, parser.AlignmentType.right), 'hoge');
            assert.strictEqual(para.alignment, parser.AlignmentType.right);
        }
    });
    test('_parseAlignment test(top)', () => {
        {
            const para = new parser.Paragraph();
            assert.strictEqual((textParser as any)._parseAlignment('!T hoge', para, parser.AlignmentType.none), '!T hoge');
            assert.strictEqual(para.alignment, parser.AlignmentType.none);
        }
        {
            const para = new parser.Paragraph();
            assert.strictEqual((textParser as any)._parseAlignment('!T hoge', para, parser.AlignmentType.left), 'hoge');
            assert.strictEqual(para.alignment, parser.AlignmentType.left);
        }
        {
            const para = new parser.Paragraph();
            assert.strictEqual((textParser as any)._parseAlignment(' !T hoge', para, parser.AlignmentType.left), 'hoge');
            assert.strictEqual(para.alignment, parser.AlignmentType.left);
        }
        {
            const para = new parser.Paragraph();
            assert.strictEqual((textParser as any)._parseAlignment('　!T　hoge', para, parser.AlignmentType.left), 'hoge');
            assert.strictEqual(para.alignment, parser.AlignmentType.left);
        }
        {
            const para = new parser.Paragraph();
            assert.strictEqual((textParser as any)._parseAlignment('　！T　hoge', para, parser.AlignmentType.left), 'hoge');
            assert.strictEqual(para.alignment, parser.AlignmentType.left);
        }
        {
            const para = new parser.Paragraph();
            assert.strictEqual((textParser as any)._parseAlignment('　!Ｔ　hoge', para, parser.AlignmentType.left), 'hoge');
            assert.strictEqual(para.alignment, parser.AlignmentType.left);
        }
        {
            const para = new parser.Paragraph();
            assert.strictEqual((textParser as any)._parseAlignment('　!Ｔ　hoge', para, parser.AlignmentType.left), 'hoge');
            assert.strictEqual(para.alignment, parser.AlignmentType.left);
        }

        {
            const para = new parser.Paragraph();
            assert.strictEqual((textParser as any)._parseAlignment('!T hoge', para, parser.AlignmentType.left), 'hoge');
            assert.strictEqual(para.alignment, parser.AlignmentType.left);
        }
        {
            const para = new parser.Paragraph();
            assert.strictEqual((textParser as any)._parseAlignment('!Ｔ hoge', para, parser.AlignmentType.left), 'hoge');
            assert.strictEqual(para.alignment, parser.AlignmentType.left);
        }
    });

    test('_parseAlignment test(center)', () => {
        {
            const para = new parser.Paragraph();
            assert.strictEqual((textParser as any)._parseAlignment('!C hoge', para, parser.AlignmentType.none), '!C hoge');
            assert.strictEqual(para.alignment, parser.AlignmentType.none);
        }
        {
            const para = new parser.Paragraph();
            assert.strictEqual((textParser as any)._parseAlignment('!C hoge', para, parser.AlignmentType.center), 'hoge');
            assert.strictEqual(para.alignment, parser.AlignmentType.center);
        }
        {
            const para = new parser.Paragraph();
            assert.strictEqual((textParser as any)._parseAlignment(' !C hoge', para, parser.AlignmentType.center), 'hoge');
            assert.strictEqual(para.alignment, parser.AlignmentType.center);
        }
        {
            const para = new parser.Paragraph();
            assert.strictEqual((textParser as any)._parseAlignment('　!C　hoge', para, parser.AlignmentType.center), 'hoge');
            assert.strictEqual(para.alignment, parser.AlignmentType.center);
        }
        {
            const para = new parser.Paragraph();
            assert.strictEqual((textParser as any)._parseAlignment('　！C　hoge', para, parser.AlignmentType.center), 'hoge');
            assert.strictEqual(para.alignment, parser.AlignmentType.center);
        }
        {
            const para = new parser.Paragraph();
            assert.strictEqual((textParser as any)._parseAlignment('　!Ｃ　hoge', para, parser.AlignmentType.center), 'hoge');
            assert.strictEqual(para.alignment, parser.AlignmentType.center);
        }
        {
            const para = new parser.Paragraph();
            assert.strictEqual((textParser as any)._parseAlignment('　!Ｃ　hoge', para, parser.AlignmentType.center), 'hoge');
            assert.strictEqual(para.alignment, parser.AlignmentType.center);
        }
    });

    test('_parseAlignment test(disable)', () => {
        (textParser as any)._textSetting.align = false;
        {
            const para = new parser.Paragraph();
            assert.strictEqual((textParser as any)._parseAlignment('!R hoge', para, parser.AlignmentType.none), '!R hoge');
            assert.strictEqual(para.alignment, parser.AlignmentType.none);
        }
        {
            const para = new parser.Paragraph();
            assert.strictEqual((textParser as any)._parseAlignment('!R hoge', para, parser.AlignmentType.right), '!R hoge');
            assert.strictEqual(para.alignment, parser.AlignmentType.none);
        }
        (textParser as any)._textSetting.align = true;
    });

    test('_parseImage test', () => {
        let actualItems: parser.ParagraphItem[];

        actualItems = (textParser as any)._parseImage([
            new parser.ParagraphItemText('hoge', '')
        ]);
        assert.strictEqual(actualItems.length, 1);
        assert.strictEqual((actualItems[0] as parser.ParagraphItemText).text, 'hoge');
        assert.strictEqual((actualItems[0] as parser.ParagraphItemText).ruby, '');

        actualItems = (textParser as any)._parseImage([
            new parser.ParagraphItemText('hoge![fuga](./media/image.jpg)foo', '')
        ]);
        assert.strictEqual(actualItems.length, 3);
        assert.strictEqual((actualItems[0] as parser.ParagraphItemText).text, 'hoge');
        assert.strictEqual((actualItems[0] as parser.ParagraphItemText).ruby, '');
        assert.strictEqual((actualItems[1] as parser.ParagraphItemImage).path, './media/image.jpg');
        assert.strictEqual((actualItems[1] as parser.ParagraphItemImage).alt, '');
        assert.strictEqual((actualItems[2] as parser.ParagraphItemText).text, 'foo');
        assert.strictEqual((actualItems[2] as parser.ParagraphItemText).ruby, '');

        actualItems = (textParser as any)._parseImage([
            new parser.ParagraphItemText('これは![fuga](./media/image1.jpg)画像が![](./media/image2.jpg)複数のパターン', '')
        ]);
        assert.strictEqual(actualItems.length, 5);
        assert.strictEqual((actualItems[0] as parser.ParagraphItemText).text, 'これは');
        assert.strictEqual((actualItems[0] as parser.ParagraphItemText).ruby, '');
        assert.strictEqual((actualItems[1] as parser.ParagraphItemImage).path, './media/image1.jpg');
        assert.strictEqual((actualItems[1] as parser.ParagraphItemImage).alt, '');
        assert.strictEqual((actualItems[2] as parser.ParagraphItemText).text, '画像が');
        assert.strictEqual((actualItems[2] as parser.ParagraphItemText).ruby, '');
        assert.strictEqual((actualItems[3] as parser.ParagraphItemImage).path, './media/image2.jpg');
        assert.strictEqual((actualItems[3] as parser.ParagraphItemImage).alt, '');
        assert.strictEqual((actualItems[4] as parser.ParagraphItemText).text, '複数のパターン');
        assert.strictEqual((actualItems[4] as parser.ParagraphItemText).ruby, '');

        actualItems = (textParser as any)._parseImage([
            new parser.ParagraphItemText('hoge！［fuga］（./media/image.jpg）foo', '')
        ]);
        assert.strictEqual(actualItems.length, 3);
        assert.strictEqual((actualItems[0] as parser.ParagraphItemText).text, 'hoge');
        assert.strictEqual((actualItems[0] as parser.ParagraphItemText).ruby, '');
        assert.strictEqual((actualItems[1] as parser.ParagraphItemImage).path, './media/image.jpg');
        assert.strictEqual((actualItems[1] as parser.ParagraphItemImage).alt, '');
        assert.strictEqual((actualItems[2] as parser.ParagraphItemText).text, 'foo');
        assert.strictEqual((actualItems[2] as parser.ParagraphItemText).ruby, '');

    });

    test('_parseImage test(disable)', () => {
        let actualItems: parser.ParagraphItem[];

        (textParser as any)._textSetting.image = false;

        actualItems = (textParser as any)._parseImage([
            new parser.ParagraphItemText('hoge', '')
        ]);
        assert.strictEqual(actualItems.length, 1);
        assert.strictEqual((actualItems[0] as parser.ParagraphItemText).text, 'hoge');
        assert.strictEqual((actualItems[0] as parser.ParagraphItemText).ruby, '');

        actualItems = (textParser as any)._parseImage([
            new parser.ParagraphItemText('hoge![fuga](./media/image.jpg)foo', '')
        ]);
        assert.strictEqual(actualItems.length, 1);
        assert.strictEqual((actualItems[0] as parser.ParagraphItemText).text, 'hoge![fuga](./media/image.jpg)foo');
        assert.strictEqual((actualItems[0] as parser.ParagraphItemText).ruby, '');

        (textParser as any)._textSetting.image = true;
    });

    test('_parseHyperlink test', () => {
        let actualItems: parser.ParagraphItem[];

        actualItems = (textParser as any)._parseHyperlink([
            new parser.ParagraphItemText('hoge', '')
        ]);
        assert.strictEqual(actualItems.length, 1);
        assert.strictEqual((actualItems[0] as parser.ParagraphItemText).text, 'hoge');
        assert.strictEqual((actualItems[0] as parser.ParagraphItemText).ruby, '');

        actualItems = (textParser as any)._parseHyperlink([
            new parser.ParagraphItemText('hoge[LeME&](https://leme.style)foo', '')
        ]);
        assert.strictEqual(actualItems.length, 3);
        assert.strictEqual((actualItems[0] as parser.ParagraphItemText).text, 'hoge');
        assert.strictEqual((actualItems[0] as parser.ParagraphItemText).ruby, '');
        assert.strictEqual((actualItems[1] as parser.ParagraphItemHyperlink).text, 'LeME&amp;');
        assert.strictEqual((actualItems[1] as parser.ParagraphItemHyperlink).path, 'https://leme.style');
        assert.strictEqual((actualItems[1] as parser.ParagraphItemHyperlink).alt, '');
        assert.strictEqual((actualItems[2] as parser.ParagraphItemText).text, 'foo');
        assert.strictEqual((actualItems[2] as parser.ParagraphItemText).ruby, '');

        actualItems = (textParser as any)._parseHyperlink([
            new parser.ParagraphItemText('これは[LeME](https://leme.style)画像が[Image](./media/image2.jpg)複数のパターン', '')
        ]);
        assert.strictEqual(actualItems.length, 5);
        assert.strictEqual((actualItems[0] as parser.ParagraphItemText).text, 'これは');
        assert.strictEqual((actualItems[0] as parser.ParagraphItemText).ruby, '');
        assert.strictEqual((actualItems[1] as parser.ParagraphItemHyperlink).text, 'LeME');
        assert.strictEqual((actualItems[1] as parser.ParagraphItemHyperlink).path, 'https://leme.style');
        assert.strictEqual((actualItems[1] as parser.ParagraphItemHyperlink).alt, '');
        assert.strictEqual((actualItems[2] as parser.ParagraphItemText).text, '画像が');
        assert.strictEqual((actualItems[2] as parser.ParagraphItemText).ruby, '');
        assert.strictEqual((actualItems[3] as parser.ParagraphItemHyperlink).text, 'Image');
        assert.strictEqual((actualItems[3] as parser.ParagraphItemHyperlink).path, './media/image2.jpg');
        assert.strictEqual((actualItems[3] as parser.ParagraphItemHyperlink).alt, '');
        assert.strictEqual((actualItems[4] as parser.ParagraphItemText).text, '複数のパターン');
        assert.strictEqual((actualItems[4] as parser.ParagraphItemText).ruby, '');

        actualItems = (textParser as any)._parseHyperlink([
            new parser.ParagraphItemText('hoge［ＬｅＭＥ］（https://leme.style）foo', '')
        ]);
        assert.strictEqual(actualItems.length, 3);
        assert.strictEqual((actualItems[0] as parser.ParagraphItemText).text, 'hoge');
        assert.strictEqual((actualItems[0] as parser.ParagraphItemText).ruby, '');
        assert.strictEqual((actualItems[1] as parser.ParagraphItemHyperlink).text, 'ＬｅＭＥ');
        assert.strictEqual((actualItems[1] as parser.ParagraphItemHyperlink).path, 'https://leme.style');
        assert.strictEqual((actualItems[1] as parser.ParagraphItemHyperlink).alt, '');
        assert.strictEqual((actualItems[2] as parser.ParagraphItemText).text, 'foo');
        assert.strictEqual((actualItems[2] as parser.ParagraphItemText).ruby, '');

    });

    test('_parseHyperlink test(disable)', () => {
        let actualItems: parser.ParagraphItem[];

        (textParser as any)._textSetting.image = false;

        actualItems = (textParser as any)._parseHyperlink([
            new parser.ParagraphItemText('hoge', '')
        ]);
        assert.strictEqual(actualItems.length, 1);
        assert.strictEqual((actualItems[0] as parser.ParagraphItemText).text, 'hoge');
        assert.strictEqual((actualItems[0] as parser.ParagraphItemText).ruby, '');

        actualItems = (textParser as any)._parseHyperlink([
            new parser.ParagraphItemText('hoge[LeME&](https://leme.style)foo', '')
        ]);
        assert.strictEqual(actualItems.length, 1);
        assert.strictEqual((actualItems[0] as parser.ParagraphItemText).text, 'hoge[LeME&amp;](https://leme.style)foo');
        assert.strictEqual((actualItems[0] as parser.ParagraphItemText).ruby, '');

        (textParser as any)._textSetting.image = true;
    });

    test('_parserRuby test', () => {
        let actualItems: parser.ParagraphItem[];

        actualItems = (textParser as any)._parserRuby([
            new parser.ParagraphItemText('これは|漢字(かんじ)です', '')
        ]);
        assert.strictEqual(actualItems.length, 3);
        assert.strictEqual((actualItems[0] as parser.ParagraphItemText).text, 'これは');
        assert.strictEqual((actualItems[0] as parser.ParagraphItemText).ruby, '');
        assert.strictEqual((actualItems[1] as parser.ParagraphItemText).text, '漢字');
        assert.strictEqual((actualItems[1] as parser.ParagraphItemText).ruby, 'かんじ');
        assert.strictEqual((actualItems[2] as parser.ParagraphItemText).text, 'です');
        assert.strictEqual((actualItems[2] as parser.ParagraphItemText).ruby, '');

        //ルビになる
        {
            actualItems = (textParser as any)._parserRuby([
                new parser.ParagraphItemText('わたしは|山田太郎《やまaだたろう》と申します', '')
            ]);
            assert.strictEqual(actualItems.length, 3);
            assert.strictEqual((actualItems[0] as parser.ParagraphItemText).text, 'わたしは');
            assert.strictEqual((actualItems[0] as parser.ParagraphItemText).ruby, '');
            assert.strictEqual((actualItems[1] as parser.ParagraphItemText).text, '山田太郎');
            assert.strictEqual((actualItems[1] as parser.ParagraphItemText).ruby, 'やまaだたろう');
            assert.strictEqual((actualItems[2] as parser.ParagraphItemText).text, 'と申します');
            assert.strictEqual((actualItems[2] as parser.ParagraphItemText).ruby, '');
            actualItems = (textParser as any)._parserRuby([
                new parser.ParagraphItemText('わたしは山田|太郎《やまだたろう》と申します。', '')
            ]);
            assert.strictEqual(actualItems.length, 3);
            assert.strictEqual((actualItems[0] as parser.ParagraphItemText).text, 'わたしは山田');
            assert.strictEqual((actualItems[0] as parser.ParagraphItemText).ruby, '');
            assert.strictEqual((actualItems[1] as parser.ParagraphItemText).text, '太郎');
            assert.strictEqual((actualItems[1] as parser.ParagraphItemText).ruby, 'やまだたろう');
            assert.strictEqual((actualItems[2] as parser.ParagraphItemText).text, 'と申します。');
            assert.strictEqual((actualItems[2] as parser.ParagraphItemText).ruby, '');
            actualItems = (textParser as any)._parserRuby([
                new parser.ParagraphItemText('わたしは山田太郎《やまだたろう》と申します。', '')
            ]);
            assert.strictEqual(actualItems.length, 3);
            assert.strictEqual((actualItems[0] as parser.ParagraphItemText).text, 'わたしは');
            assert.strictEqual((actualItems[0] as parser.ParagraphItemText).ruby, '');
            assert.strictEqual((actualItems[1] as parser.ParagraphItemText).text, '山田太郎');
            assert.strictEqual((actualItems[1] as parser.ParagraphItemText).ruby, 'やまだたろう');
            assert.strictEqual((actualItems[2] as parser.ParagraphItemText).text, 'と申します。');
            assert.strictEqual((actualItems[2] as parser.ParagraphItemText).ruby, '');
            actualItems = (textParser as any)._parserRuby([
                new parser.ParagraphItemText('わたしは|taroYamada《たろーやまだ》です', '')
            ]);
            assert.strictEqual(actualItems.length, 3);
            assert.strictEqual((actualItems[0] as parser.ParagraphItemText).text, 'わたしは');
            assert.strictEqual((actualItems[0] as parser.ParagraphItemText).ruby, '');
            assert.strictEqual((actualItems[1] as parser.ParagraphItemText).text, 'taroYamada');
            assert.strictEqual((actualItems[1] as parser.ParagraphItemText).ruby, 'たろーやまだ');
            assert.strictEqual((actualItems[2] as parser.ParagraphItemText).text, 'です');
            assert.strictEqual((actualItems[2] as parser.ParagraphItemText).ruby, '');
        }

        //ルビにならない
        {
            actualItems = (textParser as any)._parserRuby([
                new parser.ParagraphItemText('わたしは山田太郎《山田太郎》と申します。', '')
            ]);
            assert.strictEqual(actualItems.length, 1);
            assert.strictEqual((actualItems[0] as parser.ParagraphItemText).text, 'わたしは山田太郎《山田太郎》と申します。');
            assert.strictEqual((actualItems[0] as parser.ParagraphItemText).ruby, '');
            actualItems = (textParser as any)._parserRuby([
                new parser.ParagraphItemText('わたしは山田太郎《yamadataro》と申します。', '')
            ]);
            assert.strictEqual(actualItems.length, 1);
            assert.strictEqual((actualItems[0] as parser.ParagraphItemText).text, 'わたしは山田太郎《yamadataro》と申します。');
            assert.strictEqual((actualItems[0] as parser.ParagraphItemText).ruby, '');
        }

        //ルビになる
        {
            actualItems = (textParser as any)._parserRuby([
                new parser.ParagraphItemText('わたしは|山田太郎(やまだたろう)と申します。', '')
            ]);
            assert.strictEqual(actualItems.length, 3);
            assert.strictEqual((actualItems[0] as parser.ParagraphItemText).text, 'わたしは');
            assert.strictEqual((actualItems[0] as parser.ParagraphItemText).ruby, '');
            assert.strictEqual((actualItems[1] as parser.ParagraphItemText).text, '山田太郎');
            assert.strictEqual((actualItems[1] as parser.ParagraphItemText).ruby, 'やまだたろう');
            assert.strictEqual((actualItems[2] as parser.ParagraphItemText).text, 'と申します。');
            assert.strictEqual((actualItems[2] as parser.ParagraphItemText).ruby, '');
            actualItems = (textParser as any)._parserRuby([
                new parser.ParagraphItemText('わたしは山田|太郎(やまだたろう)と申します。', '')
            ]);
            assert.strictEqual(actualItems.length, 3);
            assert.strictEqual((actualItems[0] as parser.ParagraphItemText).text, 'わたしは山田');
            assert.strictEqual((actualItems[0] as parser.ParagraphItemText).ruby, '');
            assert.strictEqual((actualItems[1] as parser.ParagraphItemText).text, '太郎');
            assert.strictEqual((actualItems[1] as parser.ParagraphItemText).ruby, 'やまだたろう');
            assert.strictEqual((actualItems[2] as parser.ParagraphItemText).text, 'と申します。');
            assert.strictEqual((actualItems[2] as parser.ParagraphItemText).ruby, '');
            actualItems = (textParser as any)._parserRuby([
                new parser.ParagraphItemText('わたしは山田太郎(やまだたろう)と申します。', '')
            ]);
            assert.strictEqual(actualItems.length, 3);
            assert.strictEqual((actualItems[0] as parser.ParagraphItemText).text, 'わたしは');
            assert.strictEqual((actualItems[0] as parser.ParagraphItemText).ruby, '');
            assert.strictEqual((actualItems[1] as parser.ParagraphItemText).text, '山田太郎');
            assert.strictEqual((actualItems[1] as parser.ParagraphItemText).ruby, 'やまだたろう');
            assert.strictEqual((actualItems[2] as parser.ParagraphItemText).text, 'と申します。');
            assert.strictEqual((actualItems[2] as parser.ParagraphItemText).ruby, '');
            actualItems = (textParser as any)._parserRuby([
                new parser.ParagraphItemText('わたしは山田太郎(ヤマダタロウ)と申します。', '')
            ]);
            assert.strictEqual(actualItems.length, 3);
            assert.strictEqual((actualItems[0] as parser.ParagraphItemText).text, 'わたしは');
            assert.strictEqual((actualItems[0] as parser.ParagraphItemText).ruby, '');
            assert.strictEqual((actualItems[1] as parser.ParagraphItemText).text, '山田太郎');
            assert.strictEqual((actualItems[1] as parser.ParagraphItemText).ruby, 'ヤマダタロウ');
            assert.strictEqual((actualItems[2] as parser.ParagraphItemText).text, 'と申します。');
            assert.strictEqual((actualItems[2] as parser.ParagraphItemText).ruby, '');
            actualItems = (textParser as any)._parserRuby([
                new parser.ParagraphItemText('わたしは|山田太郎（やまだたろう）と申します。', '')
            ]);
            assert.strictEqual(actualItems.length, 3);
            assert.strictEqual((actualItems[0] as parser.ParagraphItemText).text, 'わたしは');
            assert.strictEqual((actualItems[0] as parser.ParagraphItemText).ruby, '');
            assert.strictEqual((actualItems[1] as parser.ParagraphItemText).text, '山田太郎');
            assert.strictEqual((actualItems[1] as parser.ParagraphItemText).ruby, 'やまだたろう');
            assert.strictEqual((actualItems[2] as parser.ParagraphItemText).text, 'と申します。');
            assert.strictEqual((actualItems[2] as parser.ParagraphItemText).ruby, '');
            actualItems = (textParser as any)._parserRuby([
                new parser.ParagraphItemText('わたしは山田太郎（ヤマダタロウ)と申します。', '')
            ]);
            assert.strictEqual(actualItems.length, 3);
            assert.strictEqual((actualItems[0] as parser.ParagraphItemText).text, 'わたしは');
            assert.strictEqual((actualItems[0] as parser.ParagraphItemText).ruby, '');
            assert.strictEqual((actualItems[1] as parser.ParagraphItemText).text, '山田太郎');
            assert.strictEqual((actualItems[1] as parser.ParagraphItemText).ruby, 'ヤマダタロウ');
            assert.strictEqual((actualItems[2] as parser.ParagraphItemText).text, 'と申します。');
            assert.strictEqual((actualItems[2] as parser.ParagraphItemText).ruby, '');
        }

        //「郎」にルビがつく
        {
            actualItems = (textParser as any)._parserRuby([
                new parser.ParagraphItemText('わたしは山田|太(郎（ヤマダタロウ）と申します。', '')
            ]);
            assert.strictEqual(actualItems.length, 3);
            assert.strictEqual((actualItems[0] as parser.ParagraphItemText).text, 'わたしは山田|太(');
            assert.strictEqual((actualItems[0] as parser.ParagraphItemText).ruby, '');
            assert.strictEqual((actualItems[1] as parser.ParagraphItemText).text, '郎');
            assert.strictEqual((actualItems[1] as parser.ParagraphItemText).ruby, 'ヤマダタロウ');
            assert.strictEqual((actualItems[2] as parser.ParagraphItemText).text, 'と申します。');
            assert.strictEqual((actualItems[2] as parser.ParagraphItemText).ruby, '');
            actualItems = (textParser as any)._parserRuby([
                new parser.ParagraphItemText('わたしは山田|太)郎（ヤマダタロウ）と申します。', '')
            ]);
            assert.strictEqual(actualItems.length, 3);
            assert.strictEqual((actualItems[0] as parser.ParagraphItemText).text, 'わたしは山田|太)');
            assert.strictEqual((actualItems[0] as parser.ParagraphItemText).ruby, '');
            assert.strictEqual((actualItems[1] as parser.ParagraphItemText).text, '郎');
            assert.strictEqual((actualItems[1] as parser.ParagraphItemText).ruby, 'ヤマダタロウ');
            assert.strictEqual((actualItems[2] as parser.ParagraphItemText).text, 'と申します。');
            assert.strictEqual((actualItems[2] as parser.ParagraphItemText).ruby, '');
            actualItems = (textParser as any)._parserRuby([
                new parser.ParagraphItemText('わたしは山田|太|郎（ヤマダタロウ）と申します。', '')
            ]);
            assert.strictEqual(actualItems.length, 3);
            assert.strictEqual((actualItems[0] as parser.ParagraphItemText).text, 'わたしは山田|太');
            assert.strictEqual((actualItems[0] as parser.ParagraphItemText).ruby, '');
            assert.strictEqual((actualItems[1] as parser.ParagraphItemText).text, '郎');
            assert.strictEqual((actualItems[1] as parser.ParagraphItemText).ruby, 'ヤマダタロウ');
            assert.strictEqual((actualItems[2] as parser.ParagraphItemText).text, 'と申します。');
            assert.strictEqual((actualItems[2] as parser.ParagraphItemText).ruby, '');
            actualItems = (textParser as any)._parserRuby([
                new parser.ParagraphItemText('わたしは山田|太｜郎（ヤマダタロウ）と申します。', '')
            ]);
            assert.strictEqual(actualItems.length, 3);
            assert.strictEqual((actualItems[0] as parser.ParagraphItemText).text, 'わたしは山田|太');
            assert.strictEqual((actualItems[0] as parser.ParagraphItemText).ruby, '');
            assert.strictEqual((actualItems[1] as parser.ParagraphItemText).text, '郎');
            assert.strictEqual((actualItems[1] as parser.ParagraphItemText).ruby, 'ヤマダタロウ');
            assert.strictEqual((actualItems[2] as parser.ParagraphItemText).text, 'と申します。');
            assert.strictEqual((actualItems[2] as parser.ParagraphItemText).ruby, '');
        }

        //ルビにならない
        {
            actualItems = (textParser as any)._parserRuby([
                new parser.ParagraphItemText('わたしは山田太郎|(やまだたろう)と申します。', '')
            ]);
            assert.strictEqual(actualItems.length, 3);
            assert.strictEqual((actualItems[0] as parser.ParagraphItemText).text, 'わたしは山田太郎');
            assert.strictEqual((actualItems[0] as parser.ParagraphItemText).ruby, '');
            assert.strictEqual((actualItems[1] as parser.ParagraphItemText).text, '(やまだたろう)');
            assert.strictEqual((actualItems[1] as parser.ParagraphItemText).ruby, '');
            assert.strictEqual((actualItems[2] as parser.ParagraphItemText).text, 'と申します。');
            assert.strictEqual((actualItems[2] as parser.ParagraphItemText).ruby, '');
            actualItems = (textParser as any)._parserRuby([
                new parser.ParagraphItemText('わたしは山田太郎(山田太郎)と申します。', '')
            ]);
            assert.strictEqual(actualItems.length, 1);
            assert.strictEqual((actualItems[0] as parser.ParagraphItemText).text, 'わたしは山田太郎(山田太郎)と申します。');
            assert.strictEqual((actualItems[0] as parser.ParagraphItemText).ruby, '');
            actualItems = (textParser as any)._parserRuby([
                new parser.ParagraphItemText('わたしは山田太郎(yamadataro)と申します。', '')
            ]);
            assert.strictEqual(actualItems.length, 1);
            assert.strictEqual((actualItems[0] as parser.ParagraphItemText).text, 'わたしは山田太郎(yamadataro)と申します。');
            assert.strictEqual((actualItems[0] as parser.ParagraphItemText).ruby, '');
            actualItems = (textParser as any)._parserRuby([
                new parser.ParagraphItemText('わたしは山田太郎(たろーspecial)と申します。', '')
            ]);
            assert.strictEqual(actualItems.length, 1);
            assert.strictEqual((actualItems[0] as parser.ParagraphItemText).text, 'わたしは山田太郎(たろーspecial)と申します。');
            assert.strictEqual((actualItems[0] as parser.ParagraphItemText).ruby, '');
            actualItems = (textParser as any)._parserRuby([
                new parser.ParagraphItemText('わたしはtaroYamada《山田》です。', '')
            ]);
            assert.strictEqual(actualItems.length, 1);
            assert.strictEqual((actualItems[0] as parser.ParagraphItemText).text, 'わたしはtaroYamada《山田》です。');
            assert.strictEqual((actualItems[0] as parser.ParagraphItemText).ruby, '');
            actualItems = (textParser as any)._parserRuby([
                new parser.ParagraphItemText('わたしは山田太郎()と申します。', '')
            ]);
            assert.strictEqual(actualItems.length, 1);
            assert.strictEqual((actualItems[0] as parser.ParagraphItemText).text, 'わたしは山田太郎()と申します。');
            assert.strictEqual((actualItems[0] as parser.ParagraphItemText).ruby, '');
            actualItems = (textParser as any)._parserRuby([
                new parser.ParagraphItemText('わたしはtaroYamada《》です。', '')
            ]);
            assert.strictEqual(actualItems.length, 1);
            assert.strictEqual((actualItems[0] as parser.ParagraphItemText).text, 'わたしはtaroYamada《》です。');
            assert.strictEqual((actualItems[0] as parser.ParagraphItemText).ruby, '');
        }
    });

    test('_parserRuby test(disable)', () => {
        let actualItems: parser.ParagraphItem[];

        (textParser as any)._textSetting.rubyAngle = false;
        (textParser as any)._textSetting.rubyParen = true;
        actualItems = (textParser as any)._parserRuby([
            new parser.ParagraphItemText('これは|漢字(かんじ)です。私は太郎《たろう》です。', '')
        ]);
        assert.strictEqual(actualItems.length, 3);
        assert.strictEqual((actualItems[0] as parser.ParagraphItemText).text, 'これは');
        assert.strictEqual((actualItems[0] as parser.ParagraphItemText).ruby, '');
        assert.strictEqual((actualItems[1] as parser.ParagraphItemText).text, '漢字');
        assert.strictEqual((actualItems[1] as parser.ParagraphItemText).ruby, 'かんじ');
        assert.strictEqual((actualItems[2] as parser.ParagraphItemText).text, 'です。私は太郎《たろう》です。');
        assert.strictEqual((actualItems[2] as parser.ParagraphItemText).ruby, '');

        (textParser as any)._textSetting.rubyAngle = true;
        (textParser as any)._textSetting.rubyParen = false;
        actualItems = (textParser as any)._parserRuby([
            new parser.ParagraphItemText('これは|漢字(かんじ)です。私は太郎《たろう》です。', '')
        ]);
        assert.strictEqual(actualItems.length, 3);
        assert.strictEqual((actualItems[0] as parser.ParagraphItemText).text, 'これは|漢字(かんじ)です。私は');
        assert.strictEqual((actualItems[0] as parser.ParagraphItemText).ruby, '');
        assert.strictEqual((actualItems[1] as parser.ParagraphItemText).text, '太郎');
        assert.strictEqual((actualItems[1] as parser.ParagraphItemText).ruby, 'たろう');
        assert.strictEqual((actualItems[2] as parser.ParagraphItemText).text, 'です。');
        assert.strictEqual((actualItems[2] as parser.ParagraphItemText).ruby, '');

        (textParser as any)._textSetting.rubyAngle = false;
        (textParser as any)._textSetting.rubyParen = false;
        actualItems = (textParser as any)._parserRuby([
            new parser.ParagraphItemText('これは|漢字(かんじ)です。私は太郎《たろう》です。', '')
        ]);
        assert.strictEqual(actualItems.length, 1);
        assert.strictEqual((actualItems[0] as parser.ParagraphItemText).text, 'これは|漢字(かんじ)です。私は太郎《たろう》です。');
        assert.strictEqual((actualItems[0] as parser.ParagraphItemText).ruby, '');

        (textParser as any)._textSetting.rubyAngle = true;
        (textParser as any)._textSetting.rubyParen = true;
    });

    test('_parseTextFormat test(tcy)', () => {
        let actualItems: parser.ParagraphItem[];

        actualItems = (textParser as any)._parseTextFormat([
            new parser.ParagraphItemText('縦中横^12^です', '')
        ], TextFormatType.tcy);
        assert.strictEqual(actualItems.length, 3);
        assert.strictEqual((actualItems[0] as parser.ParagraphItemText).text, '縦中横');
        assert.strictEqual((actualItems[1] as parser.ParagraphItemText).text, '12');
        assert.strictEqual((actualItems[1] as parser.ParagraphItemText).font.tcy, true);
        assert.strictEqual((actualItems[2] as parser.ParagraphItemText).text, 'です');

        actualItems = (textParser as any)._parseTextFormat([
            new parser.ParagraphItemText('縦中横^34^が^2^つです', '')
        ], TextFormatType.tcy);
        assert.strictEqual(actualItems.length, 5);
        assert.strictEqual((actualItems[0] as parser.ParagraphItemText).text, '縦中横');
        assert.strictEqual((actualItems[1] as parser.ParagraphItemText).text, '34');
        assert.strictEqual((actualItems[1] as parser.ParagraphItemText).font.tcy, true);
        assert.strictEqual((actualItems[2] as parser.ParagraphItemText).text, 'が');
        assert.strictEqual((actualItems[3] as parser.ParagraphItemText).text, '2');
        assert.strictEqual((actualItems[3] as parser.ParagraphItemText).font.tcy, true);
        assert.strictEqual((actualItems[4] as parser.ParagraphItemText).text, 'つです');

        actualItems = (textParser as any)._parseTextFormat([
            new parser.ParagraphItemText('縦中横^ 56^です', '')
        ], TextFormatType.tcy);
        assert.strictEqual(actualItems.length, 1);
        assert.strictEqual((actualItems[0] as parser.ParagraphItemText).text, '縦中横^ 56^です');

        actualItems = (textParser as any)._parseTextFormat([
            new parser.ParagraphItemText('縦中横^78 ^です', '')
        ], TextFormatType.tcy);
        assert.strictEqual(actualItems.length, 1);
        assert.strictEqual((actualItems[0] as parser.ParagraphItemText).text, '縦中横^78 ^です');
    });

    test('_parseTextFormat test(tcy)(disable)', () => {
        (textParser as any)._textSetting.tcy = false;

        const actualItems = (textParser as any)._parseTextFormat([
            new parser.ParagraphItemText('縦中横^12^です', '')
        ], TextFormatType.tcy);
        assert.strictEqual(actualItems.length, 1);
        assert.strictEqual((actualItems[0] as parser.ParagraphItemText).text, '縦中横^12^です');

        (textParser as any)._textSetting.tcy = true;
    });

    test('_parseTextFormat test(bold)', () => {
        let actualItems: parser.ParagraphItem[];

        actualItems = (textParser as any)._parseTextFormat([
            new parser.ParagraphItemText('これは**太字**です', '')
        ], TextFormatType.bold);
        assert.strictEqual(actualItems.length, 3);
        assert.strictEqual((actualItems[0] as parser.ParagraphItemText).text, 'これは');
        assert.strictEqual((actualItems[1] as parser.ParagraphItemText).text, '太字');
        assert.strictEqual((actualItems[1] as parser.ParagraphItemText).font.bold, true);
        assert.strictEqual((actualItems[2] as parser.ParagraphItemText).text, 'です');

        actualItems = (textParser as any)._parseTextFormat([
            new parser.ParagraphItemText('これは**太字**の**2つ目**です', '')
        ], TextFormatType.bold);
        assert.strictEqual(actualItems.length, 5);
        assert.strictEqual((actualItems[0] as parser.ParagraphItemText).text, 'これは');
        assert.strictEqual((actualItems[1] as parser.ParagraphItemText).text, '太字');
        assert.strictEqual((actualItems[1] as parser.ParagraphItemText).font.bold, true);
        assert.strictEqual((actualItems[2] as parser.ParagraphItemText).text, 'の');
        assert.strictEqual((actualItems[3] as parser.ParagraphItemText).text, '2つ目');
        assert.strictEqual((actualItems[3] as parser.ParagraphItemText).font.bold, true);
        assert.strictEqual((actualItems[4] as parser.ParagraphItemText).text, 'です');

        actualItems = (textParser as any)._parseTextFormat([
            new parser.ParagraphItemText('これは** 太字**です', '')
        ], TextFormatType.bold);
        assert.strictEqual(actualItems.length, 1);
        assert.strictEqual((actualItems[0] as parser.ParagraphItemText).text, 'これは** 太字**です');

        actualItems = (textParser as any)._parseTextFormat([
            new parser.ParagraphItemText('これは**太字 **です', '')
        ], TextFormatType.bold);
        assert.strictEqual(actualItems.length, 1);
        assert.strictEqual((actualItems[0] as parser.ParagraphItemText).text, 'これは**太字 **です');
    });

    test('_parseTextFormat test(bold)(disable)', () => {
        (textParser as any)._textSetting.bold = false;

        const actualItems = (textParser as any)._parseTextFormat([
            new parser.ParagraphItemText('これは**太字**です', '')
        ], TextFormatType.bold);
        assert.strictEqual(actualItems.length, 1);
        assert.strictEqual((actualItems[0] as parser.ParagraphItemText).text, 'これは**太字**です');

        (textParser as any)._textSetting.bold = true;
    });

    test('_parseTextFormat test(italic)', () => {
        let actualItems: parser.ParagraphItem[];

        actualItems = (textParser as any)._parseTextFormat([
            new parser.ParagraphItemText('これは*イタリック*です', '')
        ], TextFormatType.italic);
        assert.strictEqual(actualItems.length, 3);
        assert.strictEqual((actualItems[0] as parser.ParagraphItemText).text, 'これは');
        assert.strictEqual((actualItems[1] as parser.ParagraphItemText).text, 'イタリック');
        assert.strictEqual((actualItems[1] as parser.ParagraphItemText).font.italic, true);
        assert.strictEqual((actualItems[2] as parser.ParagraphItemText).text, 'です');

        actualItems = (textParser as any)._parseTextFormat([
            new parser.ParagraphItemText('これは*イタリック*の*2つ目*です', '')
        ], TextFormatType.italic);
        assert.strictEqual(actualItems.length, 5);
        assert.strictEqual((actualItems[0] as parser.ParagraphItemText).text, 'これは');
        assert.strictEqual((actualItems[1] as parser.ParagraphItemText).text, 'イタリック');
        assert.strictEqual((actualItems[1] as parser.ParagraphItemText).font.italic, true);
        assert.strictEqual((actualItems[2] as parser.ParagraphItemText).text, 'の');
        assert.strictEqual((actualItems[3] as parser.ParagraphItemText).text, '2つ目');
        assert.strictEqual((actualItems[3] as parser.ParagraphItemText).font.italic, true);
        assert.strictEqual((actualItems[4] as parser.ParagraphItemText).text, 'です');

        actualItems = (textParser as any)._parseTextFormat([
            new parser.ParagraphItemText('これは* イタリック*です', '')
        ], TextFormatType.italic);
        assert.strictEqual(actualItems.length, 1);
        assert.strictEqual((actualItems[0] as parser.ParagraphItemText).text, 'これは* イタリック*です');

        actualItems = (textParser as any)._parseTextFormat([
            new parser.ParagraphItemText('これは*イタリック *です', '')
        ], TextFormatType.italic);
        assert.strictEqual(actualItems.length, 1);
        assert.strictEqual((actualItems[0] as parser.ParagraphItemText).text, 'これは*イタリック *です');
    });

    test('_parseTextFormat test(italic)(disable)', () => {
        (textParser as any)._textSetting.italic = false;

        const actualItems = (textParser as any)._parseTextFormat([
            new parser.ParagraphItemText('これは*イタリック*です', '')
        ], TextFormatType.italic);
        assert.strictEqual(actualItems.length, 1);
        assert.strictEqual((actualItems[0] as parser.ParagraphItemText).text, 'これは*イタリック*です');

        (textParser as any)._textSetting.italic = true;
    });

    test('_parseTextFormat test(emMarkDot)', () => {
        let actualItems: parser.ParagraphItem[];

        actualItems = (textParser as any)._parseTextFormat([
            new parser.ParagraphItemText('これは+傍点+です', '')
        ], TextFormatType.emMarkDot);
        assert.strictEqual(actualItems.length, 3);
        assert.strictEqual((actualItems[0] as parser.ParagraphItemText).text, 'これは');
        assert.strictEqual((actualItems[1] as parser.ParagraphItemText).text, '傍点');
        assert.strictEqual((actualItems[1] as parser.ParagraphItemText).font.em, parser.EmphasisMarkType.dot);
        assert.strictEqual((actualItems[2] as parser.ParagraphItemText).text, 'です');

        actualItems = (textParser as any)._parseTextFormat([
            new parser.ParagraphItemText('これは+傍点+の+2つ目+です', '')
        ], TextFormatType.emMarkDot);
        assert.strictEqual(actualItems.length, 5);
        assert.strictEqual((actualItems[0] as parser.ParagraphItemText).text, 'これは');
        assert.strictEqual((actualItems[1] as parser.ParagraphItemText).text, '傍点');
        assert.strictEqual((actualItems[1] as parser.ParagraphItemText).font.em, parser.EmphasisMarkType.dot);
        assert.strictEqual((actualItems[2] as parser.ParagraphItemText).text, 'の');
        assert.strictEqual((actualItems[3] as parser.ParagraphItemText).text, '2つ目');
        assert.strictEqual((actualItems[3] as parser.ParagraphItemText).font.em, parser.EmphasisMarkType.dot);
        assert.strictEqual((actualItems[4] as parser.ParagraphItemText).text, 'です');

        actualItems = (textParser as any)._parseTextFormat([
            new parser.ParagraphItemText('これは+ 傍点+です', '')
        ], TextFormatType.emMarkDot);
        assert.strictEqual(actualItems.length, 1);
        assert.strictEqual((actualItems[0] as parser.ParagraphItemText).text, 'これは+ 傍点+です');

        actualItems = (textParser as any)._parseTextFormat([
            new parser.ParagraphItemText('これは+傍点 +です', '')
        ], TextFormatType.emMarkDot);
        assert.strictEqual(actualItems.length, 1);
        assert.strictEqual((actualItems[0] as parser.ParagraphItemText).text, 'これは+傍点 +です');
    });

    test('_parseTextFormat test(emMarkDot)(disable)', () => {
        (textParser as any)._textSetting.emMarkDot = false;

        const actualItems = (textParser as any)._parseTextFormat([
            new parser.ParagraphItemText('これは+傍点+です', '')
        ], TextFormatType.emMarkDot);
        assert.strictEqual(actualItems.length, 1);
        assert.strictEqual((actualItems[0] as parser.ParagraphItemText).text, 'これは+傍点+です');

        (textParser as any)._textSetting.emMarkDot = true;
    });

    test('_parseTextFormat test(emMarkDot2)', () => {
        let actualItems: parser.ParagraphItem[];

        actualItems = (textParser as any)._parseTextFormat([
            new parser.ParagraphItemText('これは\u300a\u300a傍点\u300b\u300bです', '')
        ], TextFormatType.emMarkDot2);
        assert.strictEqual(actualItems.length, 3);
        assert.strictEqual((actualItems[0] as parser.ParagraphItemText).text, 'これは');
        assert.strictEqual((actualItems[1] as parser.ParagraphItemText).text, '傍点');
        assert.strictEqual((actualItems[1] as parser.ParagraphItemText).font.em, parser.EmphasisMarkType.dot);
        assert.strictEqual((actualItems[2] as parser.ParagraphItemText).text, 'です');

        actualItems = (textParser as any)._parseTextFormat([
            new parser.ParagraphItemText('これは\u300a\u300a傍点\u300b\u300bの\u300a\u300a2つ目\u300b\u300bです', '')
        ], TextFormatType.emMarkDot2);
        assert.strictEqual(actualItems.length, 5);
        assert.strictEqual((actualItems[0] as parser.ParagraphItemText).text, 'これは');
        assert.strictEqual((actualItems[1] as parser.ParagraphItemText).text, '傍点');
        assert.strictEqual((actualItems[1] as parser.ParagraphItemText).font.em, parser.EmphasisMarkType.dot);
        assert.strictEqual((actualItems[2] as parser.ParagraphItemText).text, 'の');
        assert.strictEqual((actualItems[3] as parser.ParagraphItemText).text, '2つ目');
        assert.strictEqual((actualItems[3] as parser.ParagraphItemText).font.em, parser.EmphasisMarkType.dot);
        assert.strictEqual((actualItems[4] as parser.ParagraphItemText).text, 'です');

        actualItems = (textParser as any)._parseTextFormat([
            new parser.ParagraphItemText('これは\u300a\u300a 傍点\u300b\u300bです', '')
        ], TextFormatType.emMarkDot2);
        assert.strictEqual(actualItems.length, 1);
        assert.strictEqual((actualItems[0] as parser.ParagraphItemText).text, 'これは\u300a\u300a 傍点\u300b\u300bです');

        actualItems = (textParser as any)._parseTextFormat([
            new parser.ParagraphItemText('これは\u300a\u300a傍点 \u300b\u300bです', '')
        ], TextFormatType.emMarkDot2);
        assert.strictEqual(actualItems.length, 1);
        assert.strictEqual((actualItems[0] as parser.ParagraphItemText).text, 'これは\u300a\u300a傍点 \u300b\u300bです');
    });

    test('_parseTextFormat test(emMarkDot2)(disable)', () => {
        (textParser as any)._textSetting.emMarkDot2 = false;

        const actualItems = (textParser as any)._parseTextFormat([
            new parser.ParagraphItemText('これは\u300a\u300a傍点\u300b\u300bです', '')
        ], TextFormatType.emMarkDot2);
        assert.strictEqual(actualItems.length, 1);
        assert.strictEqual((actualItems[0] as parser.ParagraphItemText).text, 'これは\u300a\u300a傍点\u300b\u300bです');

        (textParser as any)._textSetting.emMarkDot2 = false;

    });

    test('_parseTextFormat test(emMarkComma)', () => {
        let actualItems: parser.ParagraphItem[];

        actualItems = (textParser as any)._parseTextFormat([
            new parser.ParagraphItemText('これは++傍点++です', '')
        ], TextFormatType.emMarkComma);
        assert.strictEqual(actualItems.length, 3);
        assert.strictEqual((actualItems[0] as parser.ParagraphItemText).text, 'これは');
        assert.strictEqual((actualItems[1] as parser.ParagraphItemText).text, '傍点');
        assert.strictEqual((actualItems[1] as parser.ParagraphItemText).font.em, parser.EmphasisMarkType.comma);
        assert.strictEqual((actualItems[2] as parser.ParagraphItemText).text, 'です');

        actualItems = (textParser as any)._parseTextFormat([
            new parser.ParagraphItemText('これは++傍点++の++2つ目++です', '')
        ], TextFormatType.emMarkComma);
        assert.strictEqual(actualItems.length, 5);
        assert.strictEqual((actualItems[0] as parser.ParagraphItemText).text, 'これは');
        assert.strictEqual((actualItems[1] as parser.ParagraphItemText).text, '傍点');
        assert.strictEqual((actualItems[1] as parser.ParagraphItemText).font.em, parser.EmphasisMarkType.comma);
        assert.strictEqual((actualItems[2] as parser.ParagraphItemText).text, 'の');
        assert.strictEqual((actualItems[3] as parser.ParagraphItemText).text, '2つ目');
        assert.strictEqual((actualItems[3] as parser.ParagraphItemText).font.em, parser.EmphasisMarkType.comma);
        assert.strictEqual((actualItems[4] as parser.ParagraphItemText).text, 'です');

        actualItems = (textParser as any)._parseTextFormat([
            new parser.ParagraphItemText('これは++ 傍点++です', '')
        ], TextFormatType.emMarkComma);
        assert.strictEqual(actualItems.length, 1);
        assert.strictEqual((actualItems[0] as parser.ParagraphItemText).text, 'これは++ 傍点++です');

        actualItems = (textParser as any)._parseTextFormat([
            new parser.ParagraphItemText('これは++傍点 ++です', '')
        ], TextFormatType.emMarkComma);
        assert.strictEqual(actualItems.length, 1);
        assert.strictEqual((actualItems[0] as parser.ParagraphItemText).text, 'これは++傍点 ++です');
    });

    test('_parseTextFormat test(emMarkComma)(disable)', () => {
        (textParser as any)._textSetting.emMarkComma = false;

        const actualItems = (textParser as any)._parseTextFormat([
            new parser.ParagraphItemText('これは++傍点++です', '')
        ], TextFormatType.emMarkComma);
        assert.strictEqual(actualItems.length, 1);
        assert.strictEqual((actualItems[0] as parser.ParagraphItemText).text, 'これは++傍点++です');

        (textParser as any)._textSetting.emMarkComma = true;
    });
});
