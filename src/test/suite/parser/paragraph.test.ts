import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as parser from '../../../parser/index';

suite('Paragraph Test Suite', () => {
    vscode.window.showInformationMessage('Start Paragraph tests.');

    test('Paragraph item test', () => {
        let para = new parser.Paragraph();

        let text = para.pushText('text1', 'ruby1');
        assert.strictEqual(text.text, 'text1');
        assert.strictEqual(text.ruby, 'ruby1');

        let image = para.pushImage('path1', 'alt1');
        assert.strictEqual(image.path, 'path1');
        assert.strictEqual(image.alt, 'alt1');

        assert.strictEqual(para.items.length, 2);
        assert.strictEqual((para.items[0] as parser.ParagraphItemText).text, 'text1');
        assert.strictEqual((para.items[0] as parser.ParagraphItemText).ruby, 'ruby1');
        assert.strictEqual((para.items[1] as parser.ParagraphItemImage).path, 'path1');
        assert.strictEqual((para.items[1] as parser.ParagraphItemImage).alt, 'alt1');

    });
});
