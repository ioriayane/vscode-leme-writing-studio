import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as parser from '../../../parser/index';

suite('TextParser Test Suite', () => {
    vscode.window.showInformationMessage('Start TextParser tests.');

    let textParser = new parser.TextParser();

    test('Simple text test', () => {
        let document = textParser.parse('line1\nline2\nThis is a ![image](media/image1.png).\nline4');

        assert.strictEqual(document.length, 4);
        assert.strictEqual(document[0].items.length, 1);
        assert.strictEqual((document[0].items[0] as parser.ParagraphItemText).text, 'line1');
        assert.strictEqual((document[0].items[0] as parser.ParagraphItemText).ruby, '');
        assert.strictEqual(document[1].items.length, 1);
        assert.strictEqual((document[1].items[0] as parser.ParagraphItemText).text, 'line2');
        assert.strictEqual((document[1].items[0] as parser.ParagraphItemText).ruby, '');
        assert.strictEqual(document[2].items.length, 3);
        assert.strictEqual((document[2].items[0] as parser.ParagraphItemText).text, 'This is a ');
        assert.strictEqual((document[2].items[0] as parser.ParagraphItemText).ruby, '');
        assert.strictEqual((document[2].items[1] as parser.ParagraphItemImage).path, 'media/image1.png');
        assert.strictEqual((document[2].items[1] as parser.ParagraphItemImage).alt, '');
        assert.strictEqual((document[2].items[2] as parser.ParagraphItemText).text, '.');
        assert.strictEqual((document[2].items[2] as parser.ParagraphItemText).ruby, '');
        assert.strictEqual(document[3].items.length, 1);
        assert.strictEqual((document[3].items[0] as parser.ParagraphItemText).text, 'line4');
        assert.strictEqual((document[3].items[0] as parser.ParagraphItemText).ruby, '');
    });

    test('Parse image test', () => {
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
});
