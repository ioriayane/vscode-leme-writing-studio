import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as parser from '../../../parser/index';

suite('Paragraph Test Suite', () => {
    vscode.window.showInformationMessage('Start Paragraph tests.');

    test('Paragraph item test', () => {
        const para = new parser.Paragraph();

        const text = para.pushText('text1', 'ruby1');
        assert.strictEqual(text.text, 'text1');
        assert.strictEqual(text.ruby, 'ruby1');

        const image = para.pushImage('path1', 'alt1');
        assert.strictEqual(image.path, 'path1');
        assert.strictEqual(image.alt, 'alt1');

        assert.strictEqual(para.items.length, 2);
        assert.strictEqual((para.items[0] as parser.ParagraphItemText).text, 'text1');
        assert.strictEqual((para.items[0] as parser.ParagraphItemText).ruby, 'ruby1');
        assert.strictEqual((para.items[1] as parser.ParagraphItemImage).path, 'path1');
        assert.strictEqual((para.items[1] as parser.ParagraphItemImage).alt, 'alt1');

    });

    test('Initial value test', () => {
        {
            const para = new parser.Paragraph();

            assert.strictEqual(para.outlineLv, 0);
            assert.strictEqual(para.font.bold, false);
            assert.strictEqual(para.font.em, parser.EmphasisMarkType.none);
            assert.strictEqual(para.font.emLine, false);
            assert.strictEqual(para.font.gothic, false);
            assert.strictEqual(para.font.italic, false);
            assert.strictEqual(para.font.sizeRatio, 100);
            assert.strictEqual(para.font.strike, false);
        }

        {
            const item = new parser.ParagraphItemText('', '');

            assert.strictEqual(item.font.bold, false);
            assert.strictEqual(item.font.em, parser.EmphasisMarkType.none);
            assert.strictEqual(item.font.emLine, false);
            assert.strictEqual(item.font.gothic, false);
            assert.strictEqual(item.font.italic, false);
            assert.strictEqual(item.font.sizeRatio, 100);
            assert.strictEqual(item.font.strike, false);
        }
    });
});
