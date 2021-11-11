import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as parser from '../../../parser/index';
import { BorderState } from '../../../parser/textParser';

suite('TextParser Test Suite', () => {
    vscode.window.showInformationMessage('Start TextParser tests.');

    let textParser = new parser.TextParser();

    test('Simple text test', () => {
        let document = textParser.parse('line1\nline2\nThis is a ![image](media/image1.png).\nline4\n' +
            'これは|漢字(かんじ)です\n' +
            '## 見出しLv2\n' +
            '!PB\n' +
            '!HR\n' +
            '!R line9\n' +
            '!L line10\n' +
            '!C line11'
        );

        assert.strictEqual(document.length, 11);
        //
        assert.strictEqual(document[0].outlineLv, 1);
        assert.strictEqual(document[0].items.length, 1);
        assert.strictEqual((document[0].items[0] as parser.ParagraphItemText).text, 'line1');
        assert.strictEqual((document[0].items[0] as parser.ParagraphItemText).ruby, '');
        //
        assert.strictEqual(document[1].outlineLv, 0);
        assert.strictEqual(document[1].items.length, 1);
        assert.strictEqual((document[1].items[0] as parser.ParagraphItemText).text, 'line2');
        assert.strictEqual((document[1].items[0] as parser.ParagraphItemText).ruby, '');
        //
        assert.strictEqual(document[2].outlineLv, 0);
        assert.strictEqual(document[2].items.length, 3);
        assert.strictEqual((document[2].items[0] as parser.ParagraphItemText).text, 'This is a ');
        assert.strictEqual((document[2].items[0] as parser.ParagraphItemText).ruby, '');
        assert.strictEqual((document[2].items[1] as parser.ParagraphItemImage).path, 'media/image1.png');
        assert.strictEqual((document[2].items[1] as parser.ParagraphItemImage).alt, '');
        assert.strictEqual((document[2].items[2] as parser.ParagraphItemText).text, '.');
        assert.strictEqual((document[2].items[2] as parser.ParagraphItemText).ruby, '');
        //
        assert.strictEqual(document[3].outlineLv, 0);
        assert.strictEqual(document[3].items.length, 1);
        assert.strictEqual((document[3].items[0] as parser.ParagraphItemText).text, 'line4');
        assert.strictEqual((document[3].items[0] as parser.ParagraphItemText).ruby, '');
        //
        assert.strictEqual(document[4].outlineLv, 0);
        assert.strictEqual(document[4].items.length, 3);
        assert.strictEqual((document[4].items[0] as parser.ParagraphItemText).text, 'これは');
        assert.strictEqual((document[4].items[0] as parser.ParagraphItemText).ruby, '');
        assert.strictEqual((document[4].items[1] as parser.ParagraphItemText).text, '漢字');
        assert.strictEqual((document[4].items[1] as parser.ParagraphItemText).ruby, 'かんじ');
        assert.strictEqual((document[4].items[2] as parser.ParagraphItemText).text, 'です');
        assert.strictEqual((document[4].items[2] as parser.ParagraphItemText).ruby, '');
        //
        assert.strictEqual(document[5].outlineLv, 2);
        assert.strictEqual(document[5].items.length, 1);
        assert.strictEqual((document[5].items[0] as parser.ParagraphItemText).text, '見出しLv2');
        assert.strictEqual((document[5].items[0] as parser.ParagraphItemText).ruby, '');
        //
        assert.strictEqual(document[6].outlineLv, 0);
        assert.strictEqual(document[6].pageBreak, true);
        assert.strictEqual(document[6].items.length, 0);
        //
        assert.strictEqual(document[7].outlineLv, 0);
        assert.strictEqual(document[7].horizontalRule, true);
        assert.strictEqual(document[7].items.length, 0);
        //
        assert.strictEqual(document[8].outlineLv, 0);
        assert.strictEqual(document[8].alignment, parser.AlignmentType.Right);
        assert.strictEqual(document[8].items.length, 1);
        assert.strictEqual((document[8].items[0] as parser.ParagraphItemText).text, 'line9');
        assert.strictEqual((document[8].items[0] as parser.ParagraphItemText).ruby, '');
        //
        assert.strictEqual(document[9].outlineLv, 0);
        assert.strictEqual(document[9].alignment, parser.AlignmentType.Left);
        assert.strictEqual(document[9].items.length, 1);
        assert.strictEqual((document[9].items[0] as parser.ParagraphItemText).text, 'line10');
        assert.strictEqual((document[9].items[0] as parser.ParagraphItemText).ruby, '');
        //
        assert.strictEqual(document[10].outlineLv, 0);
        assert.strictEqual(document[10].alignment, parser.AlignmentType.Center);
        assert.strictEqual(document[10].items.length, 1);
        assert.strictEqual((document[10].items[0] as parser.ParagraphItemText).text, 'line11');
        assert.strictEqual((document[10].items[0] as parser.ParagraphItemText).ruby, '');
    });

    test('_parseBorder test', () => {
        let i: number = 0;
        {
            let lines: string[] = ['line1', ' !BD,TLRBH　', 'line2', 'line3', 'line4', '!BD'];
            let para = new parser.Paragraph();
            (textParser as any)._borderState = BorderState.None;
            assert.strictEqual((textParser as any)._parseBorder('!BD,TLRBH', para, 0, lines), true);
            assert.deepStrictEqual((textParser as any)._borderCommand, { top: true, bottom: true, left: true, right: true, inner: true });
            assert.strictEqual((textParser as any)._borderState, BorderState.Start);
            assert.deepStrictEqual(para.border, { top: false, bottom: false, left: false, right: false, inner: false });

            (textParser as any)._borderState = BorderState.None;
            assert.strictEqual((textParser as any)._parseBorder('!BD,T', para, 0, lines), true);
            assert.deepStrictEqual((textParser as any)._borderCommand, { top: true, bottom: false, left: false, right: false, inner: false });
            assert.strictEqual((textParser as any)._borderState, BorderState.Start);
            assert.deepStrictEqual(para.border, { top: false, bottom: false, left: false, right: false, inner: false });

            (textParser as any)._borderState = BorderState.None;
            assert.strictEqual((textParser as any)._parseBorder('!BD,L', para, 0, lines), true);
            assert.deepStrictEqual((textParser as any)._borderCommand, { top: false, bottom: false, left: true, right: false, inner: false });
            assert.strictEqual((textParser as any)._borderState, BorderState.Start);
            assert.deepStrictEqual(para.border, { top: false, bottom: false, left: false, right: false, inner: false });

            (textParser as any)._borderState = BorderState.None;
            assert.strictEqual((textParser as any)._parseBorder('!BD,R', para, 0, lines), true);
            assert.deepStrictEqual((textParser as any)._borderCommand, { top: false, bottom: false, left: false, right: true, inner: false });
            assert.strictEqual((textParser as any)._borderState, BorderState.Start);
            assert.deepStrictEqual(para.border, { top: false, bottom: false, left: false, right: false, inner: false });

            (textParser as any)._borderState = BorderState.None;
            assert.strictEqual((textParser as any)._parseBorder('!BD,B', para, 0, lines), true);
            assert.deepStrictEqual((textParser as any)._borderCommand, { top: false, bottom: true, left: false, right: false, inner: false });
            assert.strictEqual((textParser as any)._borderState, BorderState.Start);
            assert.deepStrictEqual(para.border, { top: false, bottom: false, left: false, right: false, inner: false });

            (textParser as any)._borderState = BorderState.None;
            assert.strictEqual((textParser as any)._parseBorder('!BD,H', para, 0, lines), true);
            assert.deepStrictEqual((textParser as any)._borderCommand, { top: false, bottom: false, left: false, right: false, inner: true });
            assert.strictEqual((textParser as any)._borderState, BorderState.Start);
            assert.deepStrictEqual(para.border, { top: false, bottom: false, left: false, right: false, inner: false });
        }
        {
            let lines: string[] = ['line1', ' !BD,TLRBH　', 'line2', 'line3', 'line4', '!BD'];
            let para = new parser.Paragraph();
            (textParser as any)._borderCommand = { top: false, bottom: false, left: false, right: false, inner: false };
            (textParser as any)._borderState = BorderState.None;
            i = 0;
            para.border = { top: false, bottom: false, left: false, right: false, inner: false };
            assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), false);
            assert.deepStrictEqual((textParser as any)._borderCommand, { top: false, bottom: false, left: false, right: false, inner: false }, '_borderCommand:' + i);
            assert.strictEqual((textParser as any)._borderState, BorderState.None);
            assert.deepStrictEqual(para.border, { top: false, bottom: false, left: false, right: false, inner: false }, 'border:' + i);
            i = 1;
            para.border = { top: false, bottom: false, left: false, right: false, inner: false };
            assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), true);
            assert.deepStrictEqual((textParser as any)._borderCommand, { top: true, bottom: true, left: true, right: true, inner: true }, '_borderCommand:' + i);
            assert.strictEqual((textParser as any)._borderState, BorderState.Start);
            assert.deepStrictEqual(para.border, { top: false, bottom: false, left: false, right: false, inner: false }, 'border:' + i);
            i = 2;
            para.border = { top: false, bottom: false, left: false, right: false, inner: false };
            assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), false);
            assert.deepStrictEqual((textParser as any)._borderCommand, { top: true, bottom: true, left: true, right: true, inner: true }, '_borderCommand:' + i);
            assert.strictEqual((textParser as any)._borderState, BorderState.Inner);
            assert.deepStrictEqual(para.border, { top: true, bottom: true, left: true, right: true, inner: false }, 'border:' + i);
            i = 3;
            para.border = { top: false, bottom: false, left: false, right: false, inner: false };
            assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), false);
            assert.deepStrictEqual((textParser as any)._borderCommand, { top: true, bottom: true, left: true, right: true, inner: true }, '_borderCommand:' + i);
            assert.strictEqual((textParser as any)._borderState, BorderState.Inner);
            assert.deepStrictEqual(para.border, { top: true, bottom: true, left: true, right: true, inner: false }, 'border:' + i);
            i = 4;
            para.border = { top: false, bottom: false, left: false, right: false, inner: false };
            assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), false);
            assert.deepStrictEqual((textParser as any)._borderCommand, { top: true, bottom: true, left: true, right: true, inner: true }, '_borderCommand:' + i);
            assert.strictEqual((textParser as any)._borderState, BorderState.Inner);
            assert.deepStrictEqual(para.border, { top: true, bottom: true, left: true, right: true, inner: false }, 'border:' + i);
            i = 5;
            para.border = { top: false, bottom: false, left: false, right: false, inner: false };
            assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), true);
            assert.deepStrictEqual((textParser as any)._borderCommand, { top: false, bottom: false, left: false, right: false, inner: false }, '_borderCommand:' + i);
            assert.strictEqual((textParser as any)._borderState, BorderState.None);
            assert.deepStrictEqual(para.border, { top: false, bottom: false, left: false, right: false, inner: false }, 'border:' + i);
        }
        // none inner
        {
            let lines: string[] = ['line1', ' !BD,TLRB　', 'line2', 'line3', 'line4', '!BD'];
            let para = new parser.Paragraph();
            (textParser as any)._borderCommand = { top: false, bottom: false, left: false, right: false, inner: false };
            (textParser as any)._borderState = BorderState.None;
            i = 0;
            para.border = { top: false, bottom: false, left: false, right: false, inner: false };
            assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), false);
            assert.deepStrictEqual((textParser as any)._borderCommand, { top: false, bottom: false, left: false, right: false, inner: false }, '_borderCommand:' + i);
            assert.strictEqual((textParser as any)._borderState, BorderState.None);
            assert.deepStrictEqual(para.border, { top: false, bottom: false, left: false, right: false, inner: false }, 'border:' + i);
            i = 1;
            para.border = { top: false, bottom: false, left: false, right: false, inner: false };
            assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), true);
            assert.deepStrictEqual((textParser as any)._borderCommand, { top: true, bottom: true, left: true, right: true, inner: false }, '_borderCommand:' + i);
            assert.strictEqual((textParser as any)._borderState, BorderState.Start);
            assert.deepStrictEqual(para.border, { top: false, bottom: false, left: false, right: false, inner: false }, 'border:' + i);
            i = 2;
            para.border = { top: false, bottom: false, left: false, right: false, inner: false };
            assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), false);
            assert.deepStrictEqual((textParser as any)._borderCommand, { top: true, bottom: true, left: true, right: true, inner: false }, '_borderCommand:' + i);
            assert.strictEqual((textParser as any)._borderState, BorderState.Inner);
            assert.deepStrictEqual(para.border, { top: true, bottom: false, left: true, right: true, inner: false }, 'border:' + i);
            i = 3;
            para.border = { top: false, bottom: false, left: false, right: false, inner: false };
            assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), false);
            assert.deepStrictEqual((textParser as any)._borderCommand, { top: true, bottom: true, left: true, right: true, inner: false }, '_borderCommand:' + i);
            assert.strictEqual((textParser as any)._borderState, BorderState.Inner);
            assert.deepStrictEqual(para.border, { top: false, bottom: false, left: true, right: true, inner: false }, 'border:' + i);
            i = 4;
            para.border = { top: false, bottom: false, left: false, right: false, inner: false };
            assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), false);
            assert.deepStrictEqual((textParser as any)._borderCommand, { top: true, bottom: true, left: true, right: true, inner: false }, '_borderCommand:' + i);
            assert.strictEqual((textParser as any)._borderState, BorderState.Inner);
            assert.deepStrictEqual(para.border, { top: false, bottom: true, left: true, right: true, inner: false }, 'border:' + i);
            i = 5;
            para.border = { top: false, bottom: false, left: false, right: false, inner: false };
            assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), true);
            assert.deepStrictEqual((textParser as any)._borderCommand, { top: false, bottom: false, left: false, right: false, inner: false }, '_borderCommand:' + i);
            assert.strictEqual((textParser as any)._borderState, BorderState.None);
            assert.deepStrictEqual(para.border, { top: false, bottom: false, left: false, right: false, inner: false }, 'border:' + i);
        }
        // none top
        {
            let lines: string[] = ['line1', ' !BD,LRBH　', 'line2', 'line3', 'line4', '!BD'];
            let para = new parser.Paragraph();
            (textParser as any)._borderCommand = { top: false, bottom: false, left: false, right: false, inner: false };
            (textParser as any)._borderState = BorderState.None;
            i = 0;
            para.border = { top: false, bottom: false, left: false, right: false, inner: false };
            assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), false);
            assert.deepStrictEqual((textParser as any)._borderCommand, { top: false, bottom: false, left: false, right: false, inner: false }, '_borderCommand:' + i);
            assert.strictEqual((textParser as any)._borderState, BorderState.None);
            assert.deepStrictEqual(para.border, { top: false, bottom: false, left: false, right: false, inner: false }, 'border:' + i);
            i = 1;
            para.border = { top: false, bottom: false, left: false, right: false, inner: false };
            assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), true);
            assert.deepStrictEqual((textParser as any)._borderCommand, { top: false, bottom: true, left: true, right: true, inner: true }, '_borderCommand:' + i);
            assert.strictEqual((textParser as any)._borderState, BorderState.Start);
            assert.deepStrictEqual(para.border, { top: false, bottom: false, left: false, right: false, inner: false }, 'border:' + i);
            i = 2;
            para.border = { top: false, bottom: false, left: false, right: false, inner: false };
            assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), false);
            assert.deepStrictEqual((textParser as any)._borderCommand, { top: false, bottom: true, left: true, right: true, inner: true }, '_borderCommand:' + i);
            assert.strictEqual((textParser as any)._borderState, BorderState.Inner);
            assert.deepStrictEqual(para.border, { top: false, bottom: true, left: true, right: true, inner: false }, 'border:' + i);
            i = 3;
            para.border = { top: false, bottom: false, left: false, right: false, inner: false };
            assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), false);
            assert.deepStrictEqual((textParser as any)._borderCommand, { top: false, bottom: true, left: true, right: true, inner: true }, '_borderCommand:' + i);
            assert.strictEqual((textParser as any)._borderState, BorderState.Inner);
            assert.deepStrictEqual(para.border, { top: true, bottom: true, left: true, right: true, inner: false }, 'border:' + i);
            i = 4;
            para.border = { top: false, bottom: false, left: false, right: false, inner: false };
            assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), false);
            assert.deepStrictEqual((textParser as any)._borderCommand, { top: false, bottom: true, left: true, right: true, inner: true }, '_borderCommand:' + i);
            assert.strictEqual((textParser as any)._borderState, BorderState.Inner);
            assert.deepStrictEqual(para.border, { top: true, bottom: true, left: true, right: true, inner: false }, 'border:' + i);
            i = 5;
            para.border = { top: false, bottom: false, left: false, right: false, inner: false };
            assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), true);
            assert.deepStrictEqual((textParser as any)._borderCommand, { top: false, bottom: false, left: false, right: false, inner: false }, '_borderCommand:' + i);
            assert.strictEqual((textParser as any)._borderState, BorderState.None);
            assert.deepStrictEqual(para.border, { top: false, bottom: false, left: false, right: false, inner: false }, 'border:' + i);
        }
        // none bottom
        {
            let lines: string[] = ['line1', ' !BD,TLRH　', 'line2', 'line3', 'line4', '!BD'];
            let para = new parser.Paragraph();
            (textParser as any)._borderCommand = { top: false, bottom: false, left: false, right: false, inner: false };
            (textParser as any)._borderState = BorderState.None;
            i = 0;
            para.border = { top: false, bottom: false, left: false, right: false, inner: false };
            assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), false);
            assert.deepStrictEqual((textParser as any)._borderCommand, { top: false, bottom: false, left: false, right: false, inner: false }, '_borderCommand:' + i);
            assert.strictEqual((textParser as any)._borderState, BorderState.None);
            assert.deepStrictEqual(para.border, { top: false, bottom: false, left: false, right: false, inner: false }, 'border:' + i);
            i = 1;
            para.border = { top: false, bottom: false, left: false, right: false, inner: false };
            assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), true);
            assert.deepStrictEqual((textParser as any)._borderCommand, { top: true, bottom: false, left: true, right: true, inner: true }, '_borderCommand:' + i);
            assert.strictEqual((textParser as any)._borderState, BorderState.Start);
            assert.deepStrictEqual(para.border, { top: false, bottom: false, left: false, right: false, inner: false }, 'border:' + i);
            i = 2;
            para.border = { top: false, bottom: false, left: false, right: false, inner: false };
            assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), false);
            assert.deepStrictEqual((textParser as any)._borderCommand, { top: true, bottom: false, left: true, right: true, inner: true }, '_borderCommand:' + i);
            assert.strictEqual((textParser as any)._borderState, BorderState.Inner);
            assert.deepStrictEqual(para.border, { top: true, bottom: true, left: true, right: true, inner: false }, 'border:' + i);
            i = 3;
            para.border = { top: false, bottom: false, left: false, right: false, inner: false };
            assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), false);
            assert.deepStrictEqual((textParser as any)._borderCommand, { top: true, bottom: false, left: true, right: true, inner: true }, '_borderCommand:' + i);
            assert.strictEqual((textParser as any)._borderState, BorderState.Inner);
            assert.deepStrictEqual(para.border, { top: true, bottom: true, left: true, right: true, inner: false }, 'border:' + i);
            i = 4;
            para.border = { top: false, bottom: false, left: false, right: false, inner: false };
            assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), false);
            assert.deepStrictEqual((textParser as any)._borderCommand, { top: true, bottom: false, left: true, right: true, inner: true }, '_borderCommand:' + i);
            assert.strictEqual((textParser as any)._borderState, BorderState.Inner);
            assert.deepStrictEqual(para.border, { top: true, bottom: false, left: true, right: true, inner: false }, 'border:' + i);
            i = 5;
            para.border = { top: false, bottom: false, left: false, right: false, inner: false };
            assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), true);
            assert.deepStrictEqual((textParser as any)._borderCommand, { top: false, bottom: false, left: false, right: false, inner: false }, '_borderCommand:' + i);
            assert.strictEqual((textParser as any)._borderState, BorderState.None);
            assert.deepStrictEqual(para.border, { top: false, bottom: false, left: false, right: false, inner: false }, 'border:' + i);
        }
        // none left
        {
            let lines: string[] = ['line1', ' !BD,TRBH　', 'line2', 'line3', 'line4', '!BD'];
            let para = new parser.Paragraph();
            (textParser as any)._borderCommand = { top: false, bottom: false, left: false, right: false, inner: false };
            (textParser as any)._borderState = BorderState.None;
            i = 0;
            para.border = { top: false, bottom: false, left: false, right: false, inner: false };
            assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), false);
            assert.deepStrictEqual((textParser as any)._borderCommand, { top: false, bottom: false, left: false, right: false, inner: false }, '_borderCommand:' + i);
            assert.strictEqual((textParser as any)._borderState, BorderState.None);
            assert.deepStrictEqual(para.border, { top: false, bottom: false, left: false, right: false, inner: false }, 'border:' + i);
            i = 1;
            para.border = { top: false, bottom: false, left: false, right: false, inner: false };
            assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), true);
            assert.deepStrictEqual((textParser as any)._borderCommand, { top: true, bottom: true, left: false, right: true, inner: true }, '_borderCommand:' + i);
            assert.strictEqual((textParser as any)._borderState, BorderState.Start);
            assert.deepStrictEqual(para.border, { top: false, bottom: false, left: false, right: false, inner: false }, 'border:' + i);
            i = 2;
            para.border = { top: false, bottom: false, left: false, right: false, inner: false };
            assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), false);
            assert.deepStrictEqual((textParser as any)._borderCommand, { top: true, bottom: true, left: false, right: true, inner: true }, '_borderCommand:' + i);
            assert.strictEqual((textParser as any)._borderState, BorderState.Inner);
            assert.deepStrictEqual(para.border, { top: true, bottom: true, left: false, right: true, inner: false }, 'border:' + i);
            i = 3;
            para.border = { top: false, bottom: false, left: false, right: false, inner: false };
            assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), false);
            assert.deepStrictEqual((textParser as any)._borderCommand, { top: true, bottom: true, left: false, right: true, inner: true }, '_borderCommand:' + i);
            assert.strictEqual((textParser as any)._borderState, BorderState.Inner);
            assert.deepStrictEqual(para.border, { top: true, bottom: true, left: false, right: true, inner: false }, 'border:' + i);
            i = 4;
            para.border = { top: false, bottom: false, left: false, right: false, inner: false };
            assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), false);
            assert.deepStrictEqual((textParser as any)._borderCommand, { top: true, bottom: true, left: false, right: true, inner: true }, '_borderCommand:' + i);
            assert.strictEqual((textParser as any)._borderState, BorderState.Inner);
            assert.deepStrictEqual(para.border, { top: true, bottom: true, left: false, right: true, inner: false }, 'border:' + i);
            i = 5;
            para.border = { top: false, bottom: false, left: false, right: false, inner: false };
            assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), true);
            assert.deepStrictEqual((textParser as any)._borderCommand, { top: false, bottom: false, left: false, right: false, inner: false }, '_borderCommand:' + i);
            assert.strictEqual((textParser as any)._borderState, BorderState.None);
            assert.deepStrictEqual(para.border, { top: false, bottom: false, left: false, right: false, inner: false }, 'border:' + i);
        }
        // none right
        {
            let lines: string[] = ['line1', ' !BD,TLBH　', 'line2', 'line3', 'line4', '!BD'];
            let para = new parser.Paragraph();
            (textParser as any)._borderCommand = { top: false, bottom: false, left: false, right: false, inner: false };
            (textParser as any)._borderState = BorderState.None;
            i = 0;
            para.border = { top: false, bottom: false, left: false, right: false, inner: false };
            assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), false);
            assert.deepStrictEqual((textParser as any)._borderCommand, { top: false, bottom: false, left: false, right: false, inner: false }, '_borderCommand:' + i);
            assert.strictEqual((textParser as any)._borderState, BorderState.None);
            assert.deepStrictEqual(para.border, { top: false, bottom: false, left: false, right: false, inner: false }, 'border:' + i);
            i = 1;
            para.border = { top: false, bottom: false, left: false, right: false, inner: false };
            assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), true);
            assert.deepStrictEqual((textParser as any)._borderCommand, { top: true, bottom: true, left: true, right: false, inner: true }, '_borderCommand:' + i);
            assert.strictEqual((textParser as any)._borderState, BorderState.Start);
            assert.deepStrictEqual(para.border, { top: false, bottom: false, left: false, right: false, inner: false }, 'border:' + i);
            i = 2;
            para.border = { top: false, bottom: false, left: false, right: false, inner: false };
            assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), false);
            assert.deepStrictEqual((textParser as any)._borderCommand, { top: true, bottom: true, left: true, right: false, inner: true }, '_borderCommand:' + i);
            assert.strictEqual((textParser as any)._borderState, BorderState.Inner);
            assert.deepStrictEqual(para.border, { top: true, bottom: true, left: true, right: false, inner: false }, 'border:' + i);
            i = 3;
            para.border = { top: false, bottom: false, left: false, right: false, inner: false };
            assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), false);
            assert.deepStrictEqual((textParser as any)._borderCommand, { top: true, bottom: true, left: true, right: false, inner: true }, '_borderCommand:' + i);
            assert.strictEqual((textParser as any)._borderState, BorderState.Inner);
            assert.deepStrictEqual(para.border, { top: true, bottom: true, left: true, right: false, inner: false }, 'border:' + i);
            i = 4;
            para.border = { top: false, bottom: false, left: false, right: false, inner: false };
            assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), false);
            assert.deepStrictEqual((textParser as any)._borderCommand, { top: true, bottom: true, left: true, right: false, inner: true }, '_borderCommand:' + i);
            assert.strictEqual((textParser as any)._borderState, BorderState.Inner);
            assert.deepStrictEqual(para.border, { top: true, bottom: true, left: true, right: false, inner: false }, 'border:' + i);
            i = 5;
            para.border = { top: false, bottom: false, left: false, right: false, inner: false };
            assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), true);
            assert.deepStrictEqual((textParser as any)._borderCommand, { top: false, bottom: false, left: false, right: false, inner: false }, '_borderCommand:' + i);
            assert.strictEqual((textParser as any)._borderState, BorderState.None);
            assert.deepStrictEqual(para.border, { top: false, bottom: false, left: false, right: false, inner: false }, 'border:' + i);
        }
        // only one
        {
            let lines: string[] = ['line1', ' !BD,TLRBH　', 'line2', '!BD', 'line3', 'line4'];
            let para = new parser.Paragraph();
            (textParser as any)._borderCommand = { top: false, bottom: false, left: false, right: false, inner: false };
            (textParser as any)._borderState = BorderState.None;
            i = 0;
            para.border = { top: false, bottom: false, left: false, right: false, inner: false };
            assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), false);
            assert.deepStrictEqual((textParser as any)._borderCommand, { top: false, bottom: false, left: false, right: false, inner: false }, '_borderCommand:' + i);
            assert.strictEqual((textParser as any)._borderState, BorderState.None);
            assert.deepStrictEqual(para.border, { top: false, bottom: false, left: false, right: false, inner: false }, 'border:' + i);
            i = 1;
            para.border = { top: false, bottom: false, left: false, right: false, inner: false };
            assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), true);
            assert.deepStrictEqual((textParser as any)._borderCommand, { top: true, bottom: true, left: true, right: true, inner: true }, '_borderCommand:' + i);
            assert.strictEqual((textParser as any)._borderState, BorderState.Start);
            assert.deepStrictEqual(para.border, { top: false, bottom: false, left: false, right: false, inner: false }, 'border:' + i);
            i = 2;
            para.border = { top: false, bottom: false, left: false, right: false, inner: false };
            assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), false);
            assert.deepStrictEqual((textParser as any)._borderCommand, { top: true, bottom: true, left: true, right: true, inner: true }, '_borderCommand:' + i);
            assert.strictEqual((textParser as any)._borderState, BorderState.Start);
            assert.deepStrictEqual(para.border, { top: true, bottom: true, left: true, right: true, inner: false }, 'border:' + i);
            i = 3;
            para.border = { top: false, bottom: false, left: false, right: false, inner: false };
            assert.strictEqual((textParser as any)._parseBorder(lines[i], para, i, lines), true);
            assert.deepStrictEqual((textParser as any)._borderCommand, { top: false, bottom: false, left: false, right: false, inner: false }, '_borderCommand:' + i);
            assert.strictEqual((textParser as any)._borderState, BorderState.None);
            assert.deepStrictEqual(para.border, { top: false, bottom: false, left: false, right: false, inner: false }, 'border:' + i);
        }

    });

    test('_parsePageBreak test', () => {
        let para = new parser.Paragraph();

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

    test('_parseHorizontalRule test', () => {
        let para = new parser.Paragraph();

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

    test('_parseOutline test', () => {
        // Lv1~9
        {
            let para = new parser.Paragraph();
            assert.strictEqual((textParser as any)._parseOutline('# hoge ', para, 1), 'hoge ');
            assert.strictEqual(para.outlineLv, 1);
            assert.strictEqual(para.font.gothic, true);
            assert.strictEqual(para.font.sizeRatio, 140);
        }
        {
            let para = new parser.Paragraph();
            assert.strictEqual((textParser as any)._parseOutline('## hoge', para, 1), 'hoge');
            assert.strictEqual(para.outlineLv, 2);
            assert.strictEqual(para.font.gothic, true);
            assert.strictEqual(para.font.sizeRatio, 120);
        }
        {
            let para = new parser.Paragraph();
            assert.strictEqual((textParser as any)._parseOutline('### hoge', para, 1), 'hoge');
            assert.strictEqual(para.outlineLv, 3);
            assert.strictEqual(para.font.gothic, true);
            assert.strictEqual(para.font.sizeRatio, 110);
        }
        {
            let para = new parser.Paragraph();
            assert.strictEqual((textParser as any)._parseOutline('#### hoge', para, 1), 'hoge');
            assert.strictEqual(para.outlineLv, 4);
            assert.strictEqual(para.font.gothic, true);
            assert.strictEqual(para.font.sizeRatio, 100);
        }
        {
            let para = new parser.Paragraph();
            assert.strictEqual((textParser as any)._parseOutline('##### hoge', para, 1), 'hoge');
            assert.strictEqual(para.outlineLv, 5);
            assert.strictEqual(para.font.gothic, true);
            assert.strictEqual(para.font.sizeRatio, 100);
        }
        {
            let para = new parser.Paragraph();
            assert.strictEqual((textParser as any)._parseOutline('###### hoge', para, 1), 'hoge');
            assert.strictEqual(para.outlineLv, 6);
            assert.strictEqual(para.font.gothic, true);
            assert.strictEqual(para.font.sizeRatio, 100);
        }
        {
            let para = new parser.Paragraph();
            assert.strictEqual((textParser as any)._parseOutline('####### hoge', para, 1), 'hoge');
            assert.strictEqual(para.outlineLv, 7);
            assert.strictEqual(para.font.gothic, true);
            assert.strictEqual(para.font.sizeRatio, 100);
        }
        {
            let para = new parser.Paragraph();
            assert.strictEqual((textParser as any)._parseOutline('######## hoge', para, 1), 'hoge');
            assert.strictEqual(para.outlineLv, 8);
            assert.strictEqual(para.font.gothic, true);
            assert.strictEqual(para.font.sizeRatio, 100);
        }
        {
            let para = new parser.Paragraph();
            assert.strictEqual((textParser as any)._parseOutline('######### hoge', para, 1), 'hoge');
            assert.strictEqual(para.outlineLv, 9);
            assert.strictEqual(para.font.gothic, true);
            assert.strictEqual(para.font.sizeRatio, 100);
        }
        {
            let para = new parser.Paragraph();
            assert.strictEqual((textParser as any)._parseOutline('＃ hoge ', para, 1), 'hoge ');
            assert.strictEqual(para.outlineLv, 1);
            assert.strictEqual(para.font.gothic, true);
            assert.strictEqual(para.font.sizeRatio, 140);
        }
        {
            let para = new parser.Paragraph();
            assert.strictEqual((textParser as any)._parseOutline('＃＃ hoge', para, 1), 'hoge');
            assert.strictEqual(para.outlineLv, 2);
            assert.strictEqual(para.font.gothic, true);
            assert.strictEqual(para.font.sizeRatio, 120);
        }
        {
            let para = new parser.Paragraph();
            assert.strictEqual((textParser as any)._parseOutline('hoge', para, 0), 'hoge');
            assert.strictEqual(para.outlineLv, 1);
            assert.strictEqual(para.font.gothic, true);
            assert.strictEqual(para.font.sizeRatio, 140);
        }

        //unmatch
        {
            let para = new parser.Paragraph();
            assert.strictEqual((textParser as any)._parseOutline('hoge', para, 1), 'hoge');
            assert.strictEqual(para.outlineLv, 0);
            assert.strictEqual(para.font.gothic, false);
            assert.strictEqual(para.font.sizeRatio, 100);
        }
        {
            let para = new parser.Paragraph();
            assert.strictEqual((textParser as any)._parseOutline('#hoge ', para, 1), '#hoge ');
            assert.strictEqual(para.outlineLv, 0);
            assert.strictEqual(para.font.gothic, false);
            assert.strictEqual(para.font.sizeRatio, 100);
        }
        {
            let para = new parser.Paragraph();
            assert.strictEqual((textParser as any)._parseOutline('########## hoge', para, 1), '########## hoge');
            assert.strictEqual(para.outlineLv, 0);
            assert.strictEqual(para.font.gothic, false);
            assert.strictEqual(para.font.sizeRatio, 100);
        }
    });

    test('_parseAlignment test', () => {
        {
            {
                let para = new parser.Paragraph();
                assert.strictEqual((textParser as any)._parseAlignment('!R hoge', para, parser.AlignmentType.None), '!R hoge');
                assert.strictEqual(para.alignment, parser.AlignmentType.None);
            }
            {
                let para = new parser.Paragraph();
                assert.strictEqual((textParser as any)._parseAlignment('!R hoge', para, parser.AlignmentType.Right), 'hoge');
                assert.strictEqual(para.alignment, parser.AlignmentType.Right);
            }
            {
                let para = new parser.Paragraph();
                assert.strictEqual((textParser as any)._parseAlignment(' !R hoge', para, parser.AlignmentType.Right), 'hoge');
                assert.strictEqual(para.alignment, parser.AlignmentType.Right);
            }
            {
                let para = new parser.Paragraph();
                assert.strictEqual((textParser as any)._parseAlignment('　!R　hoge', para, parser.AlignmentType.Right), 'hoge');
                assert.strictEqual(para.alignment, parser.AlignmentType.Right);
            }
            {
                let para = new parser.Paragraph();
                assert.strictEqual((textParser as any)._parseAlignment('　！R　hoge', para, parser.AlignmentType.Right), 'hoge');
                assert.strictEqual(para.alignment, parser.AlignmentType.Right);
            }
            {
                let para = new parser.Paragraph();
                assert.strictEqual((textParser as any)._parseAlignment('　!Ｒ　hoge', para, parser.AlignmentType.Right), 'hoge');
                assert.strictEqual(para.alignment, parser.AlignmentType.Right);
            }
            {
                let para = new parser.Paragraph();
                assert.strictEqual((textParser as any)._parseAlignment('　!Ｒ　hoge', para, parser.AlignmentType.Right), 'hoge');
                assert.strictEqual(para.alignment, parser.AlignmentType.Right);
            }

            {
                let para = new parser.Paragraph();
                assert.strictEqual((textParser as any)._parseAlignment('!B hoge', para, parser.AlignmentType.Right), 'hoge');
                assert.strictEqual(para.alignment, parser.AlignmentType.Right);
            }
            {
                let para = new parser.Paragraph();
                assert.strictEqual((textParser as any)._parseAlignment('!Ｂ hoge', para, parser.AlignmentType.Right), 'hoge');
                assert.strictEqual(para.alignment, parser.AlignmentType.Right);
            }
        }
        {
            {
                let para = new parser.Paragraph();
                assert.strictEqual((textParser as any)._parseAlignment('!T hoge', para, parser.AlignmentType.None), '!T hoge');
                assert.strictEqual(para.alignment, parser.AlignmentType.None);
            }
            {
                let para = new parser.Paragraph();
                assert.strictEqual((textParser as any)._parseAlignment('!T hoge', para, parser.AlignmentType.Left), 'hoge');
                assert.strictEqual(para.alignment, parser.AlignmentType.Left);
            }
            {
                let para = new parser.Paragraph();
                assert.strictEqual((textParser as any)._parseAlignment(' !T hoge', para, parser.AlignmentType.Left), 'hoge');
                assert.strictEqual(para.alignment, parser.AlignmentType.Left);
            }
            {
                let para = new parser.Paragraph();
                assert.strictEqual((textParser as any)._parseAlignment('　!T　hoge', para, parser.AlignmentType.Left), 'hoge');
                assert.strictEqual(para.alignment, parser.AlignmentType.Left);
            }
            {
                let para = new parser.Paragraph();
                assert.strictEqual((textParser as any)._parseAlignment('　！T　hoge', para, parser.AlignmentType.Left), 'hoge');
                assert.strictEqual(para.alignment, parser.AlignmentType.Left);
            }
            {
                let para = new parser.Paragraph();
                assert.strictEqual((textParser as any)._parseAlignment('　!Ｔ　hoge', para, parser.AlignmentType.Left), 'hoge');
                assert.strictEqual(para.alignment, parser.AlignmentType.Left);
            }
            {
                let para = new parser.Paragraph();
                assert.strictEqual((textParser as any)._parseAlignment('　!Ｔ　hoge', para, parser.AlignmentType.Left), 'hoge');
                assert.strictEqual(para.alignment, parser.AlignmentType.Left);
            }

            {
                let para = new parser.Paragraph();
                assert.strictEqual((textParser as any)._parseAlignment('!T hoge', para, parser.AlignmentType.Left), 'hoge');
                assert.strictEqual(para.alignment, parser.AlignmentType.Left);
            }
            {
                let para = new parser.Paragraph();
                assert.strictEqual((textParser as any)._parseAlignment('!Ｔ hoge', para, parser.AlignmentType.Left), 'hoge');
                assert.strictEqual(para.alignment, parser.AlignmentType.Left);
            }
        }
        {
            {
                let para = new parser.Paragraph();
                assert.strictEqual((textParser as any)._parseAlignment('!C hoge', para, parser.AlignmentType.None), '!C hoge');
                assert.strictEqual(para.alignment, parser.AlignmentType.None);
            }
            {
                let para = new parser.Paragraph();
                assert.strictEqual((textParser as any)._parseAlignment('!C hoge', para, parser.AlignmentType.Center), 'hoge');
                assert.strictEqual(para.alignment, parser.AlignmentType.Center);
            }
            {
                let para = new parser.Paragraph();
                assert.strictEqual((textParser as any)._parseAlignment(' !C hoge', para, parser.AlignmentType.Center), 'hoge');
                assert.strictEqual(para.alignment, parser.AlignmentType.Center);
            }
            {
                let para = new parser.Paragraph();
                assert.strictEqual((textParser as any)._parseAlignment('　!C　hoge', para, parser.AlignmentType.Center), 'hoge');
                assert.strictEqual(para.alignment, parser.AlignmentType.Center);
            }
            {
                let para = new parser.Paragraph();
                assert.strictEqual((textParser as any)._parseAlignment('　！C　hoge', para, parser.AlignmentType.Center), 'hoge');
                assert.strictEqual(para.alignment, parser.AlignmentType.Center);
            }
            {
                let para = new parser.Paragraph();
                assert.strictEqual((textParser as any)._parseAlignment('　!Ｃ　hoge', para, parser.AlignmentType.Center), 'hoge');
                assert.strictEqual(para.alignment, parser.AlignmentType.Center);
            }
            {
                let para = new parser.Paragraph();
                assert.strictEqual((textParser as any)._parseAlignment('　!Ｃ　hoge', para, parser.AlignmentType.Center), 'hoge');
                assert.strictEqual(para.alignment, parser.AlignmentType.Center);
            }
        }

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
});
