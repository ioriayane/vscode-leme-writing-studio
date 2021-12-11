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

    test('ParagraphItemText properties(escape)', () => {
        {
            const item = new parser.ParagraphItemText('hoge', 'fuga');
            assert.strictEqual(item.text, 'hoge', 'text1');
            assert.strictEqual(item.ruby, 'fuga', 'ruby1');
        }
        {
            const item = new parser.ParagraphItemText('hoge&<fuga>&<foo>', '<fuga>&foo&<bar>');
            assert.strictEqual(item.text, 'hoge&amp;&lt;fuga>&amp;&lt;foo>', 'text2');
            assert.strictEqual(item.ruby, '&lt;fuga>&amp;foo&amp;&lt;bar>', 'ruby2');
        }
        {
            const item = new parser.ParagraphItemText('hoge\u000dfuga\u000dfoo', 'fuga\u000dfoo\u000dbar');
            assert.strictEqual(item.text, 'hoge&#xdfuga&#xdfoo', 'text3');
            assert.strictEqual(item.ruby, 'fuga&#xdfoo&#xdbar', 'ruby3');
        }
        {
            const item = new parser.ParagraphItemText('hoge\u0000fuga\u0000foo', 'fuga\u0000foo\u0000bar');
            assert.strictEqual(item.text, 'hogefugafoo', 'text4');
            assert.strictEqual(item.ruby, 'fugafoobar', 'ruby4');
        }
    });

    test('ParagraphItemText properties(plain)', () => {
        {
            const item = new parser.ParagraphItemText('hoge', 'fuga');
            assert.strictEqual(item.plainText, 'hoge', 'plainText1');
            assert.strictEqual(item.plainRuby, 'fuga', 'plainRuby1');
        }
        {
            const item = new parser.ParagraphItemText('hoge&<fuga>&<foo>', '<fuga>&foo&<bar>');
            assert.strictEqual(item.plainText, 'hoge&<fuga>&<foo>', 'plainText2');
            assert.strictEqual(item.plainRuby, '<fuga>&foo&<bar>', 'plainRuby2');
        }
        {
            const item = new parser.ParagraphItemText('hoge\u000dfuga\u000dfoo', 'fuga\u000dfoo\u000dbar');
            assert.strictEqual(item.plainText, 'hoge\u000dfuga\u000dfoo', 'plainText3');
            assert.strictEqual(item.plainRuby, 'fuga\u000dfoo\u000dbar', 'plainRuby3');
        }
        {
            const item = new parser.ParagraphItemText('hoge\u0000fuga\u0000foo', 'fuga\u0000foo\u0000bar');
            assert.strictEqual(item.plainText, 'hoge\u0000fuga\u0000foo', 'plainText4');
            assert.strictEqual(item.plainRuby, 'fuga\u0000foo\u0000bar', 'plainRuby4');
        }
    });

    test('ParagraphItemImage properties(escape)', () => {
        {
            const item = new parser.ParagraphItemImage('hoge', 'fuga');
            assert.strictEqual(item.path, 'hoge', 'path1');
            assert.strictEqual(item.alt, 'fuga', 'alt1');
        }
        {
            const item = new parser.ParagraphItemImage('https://leme.style?hoge=<value>&fuga=a b', '<fuga>&foo&<bar>');
            assert.strictEqual(item.path, 'https://leme.style?hoge=%3Cvalue%3E&fuga=a%20b', 'path2');
            assert.strictEqual(item.alt, '&lt;fuga>&amp;foo&amp;&lt;bar>', 'alt2');
        }
        {
            const item = new parser.ParagraphItemImage('https://leme.style?hoge=<value>&fuga=a b', 'fuga\u000dfoo\u000dbar');
            assert.strictEqual(item.path, 'https://leme.style?hoge=%3Cvalue%3E&fuga=a%20b', 'path3');
            assert.strictEqual(item.alt, 'fuga&#xdfoo&#xdbar', 'alt3');
        }
        {
            const item = new parser.ParagraphItemImage('https://leme.style?hoge=<value>&fuga=a b', 'fuga\u0000foo\u0000bar');
            assert.strictEqual(item.path, 'https://leme.style?hoge=%3Cvalue%3E&fuga=a%20b', 'path4');
            assert.strictEqual(item.alt, 'fugafoobar', 'alt4');
        }
    });

    test('ParagraphItemImage properties(plain)', () => {
        {
            const item = new parser.ParagraphItemImage('hoge', 'fuga');
            assert.strictEqual(item.plainPath, 'hoge', 'plainPath1');
            assert.strictEqual(item.plainAlt, 'fuga', 'plainAlt1');
        }
        {
            const item = new parser.ParagraphItemImage('https://leme.style?hoge=<value>&fuga=a b', '<fuga>&foo&<bar>');
            assert.strictEqual(item.plainPath, 'https://leme.style?hoge=<value>&fuga=a b', 'plainPath2');
            assert.strictEqual(item.plainAlt, '<fuga>&foo&<bar>', 'plainAlt2');
        }
        {
            const item = new parser.ParagraphItemImage('https://leme.style?hoge=<value>&fuga=a b', 'fuga\u000dfoo\u000dbar');
            assert.strictEqual(item.plainPath, 'https://leme.style?hoge=<value>&fuga=a b', 'plainPath3');
            assert.strictEqual(item.plainAlt, 'fuga\u000dfoo\u000dbar', 'plainAlt4');
        }
        {
            const item = new parser.ParagraphItemImage('https://leme.style?hoge=<value>&fuga=a b', 'fuga\u0000foo\u0000bar');
            assert.strictEqual(item.plainPath, 'https://leme.style?hoge=<value>&fuga=a b', 'plainPath4');
            assert.strictEqual(item.plainAlt, 'fuga\u0000foo\u0000bar', 'plainAlt4');
        }
    });

    
    test('ParagraphItemHyperlink properties(escape)', () => {
        {
            const item = new parser.ParagraphItemHyperlink('hoge', 'https://leme.style?hoge=<value>&fuga=a b', 'fuga');
            assert.strictEqual(item.text, 'hoge', 'text1');
            assert.strictEqual(item.path, 'https://leme.style?hoge=%3Cvalue%3E&fuga=a%20b', 'path1');
            assert.strictEqual(item.alt, 'fuga', 'alt1');
        }
        {
            const item = new parser.ParagraphItemHyperlink('hoge&<fuga>&<foo>', 'https://leme.style?hoge=<value>&fuga=a b', '<fuga>&foo&<bar>');
            assert.strictEqual(item.text, 'hoge&amp;&lt;fuga>&amp;&lt;foo>', 'text2');
            assert.strictEqual(item.path, 'https://leme.style?hoge=%3Cvalue%3E&fuga=a%20b', 'path2');
            assert.strictEqual(item.alt, '&lt;fuga>&amp;foo&amp;&lt;bar>', 'alt2');
        }
        {
            const item = new parser.ParagraphItemHyperlink('hoge\u000dfuga\u000dfoo', 'https://leme.style?hoge=<value>&fuga=a b', 'fuga\u000dfoo\u000dbar');
            assert.strictEqual(item.text, 'hoge&#xdfuga&#xdfoo', 'text3');
            assert.strictEqual(item.path, 'https://leme.style?hoge=%3Cvalue%3E&fuga=a%20b', 'path3');
            assert.strictEqual(item.alt, 'fuga&#xdfoo&#xdbar', 'alt3');
        }
        {
            const item = new parser.ParagraphItemHyperlink('hoge\u0000fuga\u0000foo', 'https://leme.style?hoge=<value>&fuga=a b', 'fuga\u0000foo\u0000bar');
            assert.strictEqual(item.text, 'hogefugafoo', 'text4');
            assert.strictEqual(item.path, 'https://leme.style?hoge=%3Cvalue%3E&fuga=a%20b', 'path4');
            assert.strictEqual(item.alt, 'fugafoobar', 'alt4');
        }
    });

    test('ParagraphItemHyperlink properties(plain)', () => {
        {
            const item = new parser.ParagraphItemHyperlink('hoge', 'https://leme.style?hoge=<value>&fuga=a b', 'fuga');
            assert.strictEqual(item.plainPath, 'https://leme.style?hoge=<value>&fuga=a b', 'plainPath1');
            assert.strictEqual(item.plainAlt, 'fuga', 'plainAlt1');
        }
        {
            const item = new parser.ParagraphItemHyperlink('hoge&<fuga>&<foo>', 'https://leme.style?hoge=<value>&fuga=a b', '<fuga>&foo&<bar>');
            assert.strictEqual(item.plainPath, 'https://leme.style?hoge=<value>&fuga=a b', 'plainPath2');
            assert.strictEqual(item.plainAlt, '<fuga>&foo&<bar>', 'plainAlt2');
        }
        {
            const item = new parser.ParagraphItemHyperlink('hoge\u000dfuga\u000dfoo', 'https://leme.style?hoge=<value>&fuga=a b', 'fuga\u000dfoo\u000dbar');
            assert.strictEqual(item.plainPath, 'https://leme.style?hoge=<value>&fuga=a b', 'plainPath3');
            assert.strictEqual(item.plainAlt, 'fuga\u000dfoo\u000dbar', 'plainAlt3');
        }
        {
            const item = new parser.ParagraphItemHyperlink('hoge\u0000fuga\u0000foo', 'https://leme.style?hoge=<value>&fuga=a b', 'fuga\u0000foo\u0000bar');
            assert.strictEqual(item.plainPath, 'https://leme.style?hoge=<value>&fuga=a b', 'plainPath4');
            assert.strictEqual(item.plainAlt, 'fuga\u0000foo\u0000bar', 'plainAlt4');
        }
    });
});
