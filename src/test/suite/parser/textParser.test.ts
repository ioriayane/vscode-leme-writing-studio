import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as parser from '../../../parser/index';

suite('TextParser Test Suite', () => {
    vscode.window.showInformationMessage('Start TextParser tests.');

    let textParser = new parser.TextParser();

    test('Simple text test', () => {
        let document = textParser.parse('line1\nline2\nThis is a ![image](media/image1.png).\nline4\n' +
            'これは|漢字(かんじ)です');

        assert.strictEqual(document.length, 5);
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
        assert.strictEqual(document[4].items.length, 3);
        assert.strictEqual((document[4].items[0] as parser.ParagraphItemText).text, 'これは');
        assert.strictEqual((document[4].items[0] as parser.ParagraphItemText).ruby, '');
        assert.strictEqual((document[4].items[1] as parser.ParagraphItemText).text, '漢字');
        assert.strictEqual((document[4].items[1] as parser.ParagraphItemText).ruby, 'かんじ');
        assert.strictEqual((document[4].items[2] as parser.ParagraphItemText).text, 'です');
        assert.strictEqual((document[4].items[2] as parser.ParagraphItemText).ruby, '');

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


    test('Parse ruby test', () => {
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
