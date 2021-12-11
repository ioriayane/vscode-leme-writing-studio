/* eslint-disable @typescript-eslint/no-explicit-any */
import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as path from 'path';
import * as parser from '../../../parser/index';
import * as builder from '../../../builder/index';
import * as book from '../../../book';

class DummyWebview implements vscode.Webview {
    constructor() {
        this.html = '';
        this.cspSource = '';
    }
    options!: vscode.WebviewOptions;
    html: string;
    onDidReceiveMessage!: vscode.Event<unknown>;
    postMessage(message: unknown): Thenable<boolean> {
        throw new Error('Method not implemented.' + message);
    }
    asWebviewUri(localResource: vscode.Uri): vscode.Uri {
        const json = localResource.toJSON();
        json['scheme'] = 'https';
        return vscode.Uri.from(json);
    }
    cspSource: string;
}


suite('HtmlBuilder Test Suite', () => {
    vscode.window.showInformationMessage('Start HtmlBuilder tests.');


    const bookText: book.TextSetting = {
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
    };

    test('Build text test', () => {
        const dummyWebview = new DummyWebview();
        const bookMaking = book.defaultValueBookMakeing();
        const htmlBuilder = new builder.HtmlBuilder(dummyWebview, '/LeME', bookMaking);
        const textParser = new parser.TextParser(bookText);

        assert.strictEqual(htmlBuilder.build([]), '');

        const expectImage1 = dummyWebview.asWebviewUri(vscode.Uri.file(path.join('/LeME/', 'media/image1<.png')));

        const text = 'line1\nline2\nThis is a ![image](./media/image1<.png).\n!PB\nline4\n!HR\nline6\n' +
            '!R !C right\n!L left\n!C center\n' +
            '<hr/>\n' +
            '|今は昔《<span>むかし</span>》';

        assert.strictEqual(htmlBuilder.build(
            textParser.parse(text)
        ),
            `<h1 class="oo-midashi font-140per gfont">line1</h1>
<p>line2</p>
<p>This is a <img alt="" src="${expectImage1}"/>.</p>
<p class="align-center"><br/>   ----  Page break ----   <br/><br/></p>
<p>line4</p>
<p><hr/></p>
<p>line6</p>
<p class="align-right">!C right</p>
<p class="align-left">left</p>
<p class="align-center">center</p>
<p>&lt;hr/></p>
<p><ruby>今は昔<rt>&lt;span>むかし</span></rt></ruby></p>`
        );

        assert.strictEqual(htmlBuilder.build(
            textParser.parse(text), 0
        ),
            `<h1 id="scroll_mark" class="active_p oo-midashi font-140per gfont">line1</h1>
<p>line2</p>
<p>This is a <img alt="" src="${expectImage1}"/>.</p>
<p class="align-center"><br/>   ----  Page break ----   <br/><br/></p>
<p>line4</p>
<p><hr/></p>
<p>line6</p>
<p class="align-right">!C right</p>
<p class="align-left">left</p>
<p class="align-center">center</p>
<p>&lt;hr/></p>
<p><ruby>今は昔<rt>&lt;span>むかし</span></rt></ruby></p>`
        );

        assert.strictEqual(htmlBuilder.build(
            textParser.parse(text), 1
        ),
            `<h1 class="oo-midashi font-140per gfont">line1</h1>
<p id="scroll_mark" class="active_p">line2</p>
<p>This is a <img alt="" src="${expectImage1}"/>.</p>
<p class="align-center"><br/>   ----  Page break ----   <br/><br/></p>
<p>line4</p>
<p><hr/></p>
<p>line6</p>
<p class="align-right">!C right</p>
<p class="align-left">left</p>
<p class="align-center">center</p>
<p>&lt;hr/></p>
<p><ruby>今は昔<rt>&lt;span>むかし</span></rt></ruby></p>`
        );
    });


    test('Build text test(web)', () => {
        const bookMaking = book.defaultValueBookMakeing();
        const htmlBuilder = new builder.HtmlBuilder(undefined, undefined, bookMaking);
        const textParser = new parser.TextParser(bookText);

        assert.strictEqual(htmlBuilder.build([]), '');

        const text = 'line1\nline2\nThis is a ![image](./media/image1<.png).\n!PB\nline4\n!HR\nline6\n' +
            '!R !C right\n!L left\n!C center\n' +
            '<hr/>\n' +
            '|今は昔《<span>むかし</span>》';

        assert.strictEqual(htmlBuilder.build(
            textParser.parse(text)
        ),
            `<h1 class="oo-midashi font-140per gfont">line1</h1>
<p>line2</p>
<p>This is a <img alt="" src="./media/image1%3C.png"/>.</p>
<p class="align-center"><br/>   ----  Page break ----   <br/><br/></p>
<p>line4</p>
<p><hr/></p>
<p>line6</p>
<p class="align-right">!C right</p>
<p class="align-left">left</p>
<p class="align-center">center</p>
<p>&lt;hr/></p>
<p><ruby>今は昔<rt>&lt;span>むかし</span></rt></ruby></p>`
        );

        assert.strictEqual(htmlBuilder.build(
            textParser.parse(text), 1
        ),
            `<h1 class="oo-midashi font-140per gfont">line1</h1>
<p id="scroll_mark" class="active_p">line2</p>
<p>This is a <img alt="" src="./media/image1%3C.png"/>.</p>
<p class="align-center"><br/>   ----  Page break ----   <br/><br/></p>
<p>line4</p>
<p><hr/></p>
<p>line6</p>
<p class="align-right">!C right</p>
<p class="align-left">left</p>
<p class="align-center">center</p>
<p>&lt;hr/></p>
<p><ruby>今は昔<rt>&lt;span>むかし</span></rt></ruby></p>`
        );
    });

    test('_buildText test', () => {
        const bookMaking = book.defaultValueBookMakeing();
        const htmlBuilder = new builder.HtmlBuilder(undefined, undefined, bookMaking);

        assert.strictEqual((htmlBuilder as any)._buildText(new parser.ParagraphItemText('', '')), '');
        assert.strictEqual((htmlBuilder as any)._buildText(new parser.ParagraphItemText('hoge', '')), 'hoge');
        assert.strictEqual((htmlBuilder as any)._buildText(new parser.ParagraphItemText('hoge', 'fuga')), '<ruby>hoge<rt>fuga</rt></ruby>');
    });

    test('_buildText test(convert space)', () => {
        const bookMaking:book.BookMaking = {
            convertSpaceToEnspace: true,
            enableHyperLink: false,
            epubPath: 'book.epub'
        };
        const htmlBuilder = new builder.HtmlBuilder(undefined, undefined, bookMaking);

        assert.strictEqual((htmlBuilder as any)._buildText(new parser.ParagraphItemText('', '')), '');
        assert.strictEqual((htmlBuilder as any)._buildText(new parser.ParagraphItemText(' hoge fuga', '')), '\u2002hoge\u2002fuga');
        assert.strictEqual((htmlBuilder as any)._buildText(new parser.ParagraphItemText('hoge fuga', 'foo bar')), '<ruby>hoge\u2002fuga<rt>foo bar</rt></ruby>');
    });

    test('_buildImage test(preview)', () => {
        const dummyWebview = new DummyWebview();
        const bookMaking = book.defaultValueBookMakeing();
        const htmlBuilder = new builder.HtmlBuilder(dummyWebview, '/LeME', bookMaking);

        const item = new parser.ParagraphItemImage('path/to/image.jpg', 'alt');
        assert.deepStrictEqual((htmlBuilder as any)._buildImage(item), '<img alt="" src="https:/LeME/path/to/image.jpg"/>');
    });

    test('_buildImage test(epub)', () => {
        const bookMaking = book.defaultValueBookMakeing();
        const htmlBuilder = new builder.HtmlBuilder(undefined, undefined, bookMaking);

        const item = new parser.ParagraphItemImage('path/to/image.jpg', 'alt');
        assert.deepStrictEqual((htmlBuilder as any)._buildImage(item), '<img alt="" src="path/to/image.jpg"/>');
    });

    test('_buildHyperlink test', () => {
        const bookMaking:book.BookMaking = {
            convertSpaceToEnspace: false,
            enableHyperLink: true,
            epubPath: 'book.epub'
        };
        const htmlBuilder = new builder.HtmlBuilder(undefined, undefined, bookMaking);

        const item = new parser.ParagraphItemHyperlink('text', 'https://leme.style', 'alt');
        assert.deepStrictEqual((htmlBuilder as any)._buildHyperlink(item), '<a alt="" href="https://leme.style">text</a>');
    });

    test('_buildHyperlink test(disable)', () => {
        const bookMaking:book.BookMaking = {
            convertSpaceToEnspace: false,
            enableHyperLink: false,
            epubPath: 'book.epub'
        };
        const htmlBuilder = new builder.HtmlBuilder(undefined, undefined, bookMaking);

        const item = new parser.ParagraphItemHyperlink('text', 'https://leme.style', 'alt');
        assert.deepStrictEqual((htmlBuilder as any)._buildHyperlink(item), '<span>text</span>');
    });

    test('_buildParagraphClass test', () => {
        const bookMaking = book.defaultValueBookMakeing();
        const htmlBuilder = new builder.HtmlBuilder(undefined, undefined, bookMaking);

        assert.deepStrictEqual((htmlBuilder as any)._buildParagraphClass({
            outlineLv: 0,
            font: {
                sizeRatio: 100,
                gothic: false,
                bold: false,
                emLine: false,
                italic: false,
                strike: false,
                em: parser.EmphasisMarkType.none
            }
        }), []);

        assert.deepStrictEqual((htmlBuilder as any)._buildParagraphClass({
            outlineLv: 1,
            font: {
                sizeRatio: 140,
                gothic: true,
                bold: false,
                emLine: false,
                italic: false,
                strike: false,
                em: parser.EmphasisMarkType.none
            }
        }), ['oo-midashi', 'font-140per', 'gfont']);

        assert.deepStrictEqual((htmlBuilder as any)._buildParagraphClass({
            outlineLv: 2,
            font: {
                sizeRatio: 120,
                gothic: true,
                bold: false,
                emLine: false,
                italic: false,
                strike: false,
                em: parser.EmphasisMarkType.none
            }
        }), ['naka-midashi', 'font-120per', 'gfont']);

        assert.deepStrictEqual((htmlBuilder as any)._buildParagraphClass({
            outlineLv: 3,
            font: {
                sizeRatio: 110,
                gothic: true,
                bold: false,
                emLine: false,
                italic: false,
                strike: false,
                em: parser.EmphasisMarkType.none
            }
        }), ['ko-midashi', 'font-110per', 'gfont']);

        assert.deepStrictEqual((htmlBuilder as any)._buildParagraphClass({
            outlineLv: 4,
            font: {
                sizeRatio: 100,
                gothic: false,
                bold: false,
                emLine: false,
                italic: false,
                strike: false,
                em: parser.EmphasisMarkType.none
            }
        }), ['ko-midashi']);

        assert.deepStrictEqual((htmlBuilder as any)._buildParagraphClass({
            outlineLv: 6,
            font: {
                sizeRatio: 100,
                gothic: false,
                bold: false,
                emLine: false,
                italic: false,
                strike: false,
                em: parser.EmphasisMarkType.none
            }
        }), ['ko-midashi']);

        assert.deepStrictEqual((htmlBuilder as any)._buildParagraphClass({
            outlineLv: 7,
            font: {
                sizeRatio: 100,
                gothic: false,
                bold: false,
                emLine: false,
                italic: false,
                strike: false,
                em: parser.EmphasisMarkType.none
            }
        }), ['ko-midashi']);
    });


    test('_buildFontClass test', () => {
        const bookMaking = book.defaultValueBookMakeing();
        const htmlBuilder = new builder.HtmlBuilder(undefined, undefined, bookMaking);

        assert.deepStrictEqual((htmlBuilder as any)._buildFontClass({
            sizeRatio: 100,
            gothic: false,
            bold: false,
            emLine: false,
            italic: false,
            strike: false,
            em: parser.EmphasisMarkType.none
        }), []);

        assert.deepStrictEqual((htmlBuilder as any)._buildFontClass({
            sizeRatio: 140,
            gothic: false,
            bold: false,
            emLine: false,
            italic: false,
            strike: false,
            em: parser.EmphasisMarkType.none
        }), ['font-140per']);

        assert.deepStrictEqual((htmlBuilder as any)._buildFontClass({
            sizeRatio: 100,
            gothic: true,
            bold: false,
            emLine: false,
            italic: false,
            strike: false,
            em: parser.EmphasisMarkType.none
        }), ['gfont']);

        assert.deepStrictEqual((htmlBuilder as any)._buildFontClass({
            sizeRatio: 140,
            gothic: true,
            bold: false,
            emLine: false,
            italic: false,
            strike: false,
            em: parser.EmphasisMarkType.none
        }), ['font-140per', 'gfont']);
    });

    test('_buildParagraphClassIndent test', () => {
        const bookMaking = book.defaultValueBookMakeing();
        const htmlBuilder = new builder.HtmlBuilder(undefined, undefined, bookMaking);

        assert.deepStrictEqual((htmlBuilder as any)._buildParagraphClassIndent({
            indent: {
                left: 0,
                right: 0
            }
        }), []);

        assert.deepStrictEqual((htmlBuilder as any)._buildParagraphClassIndent({
            indent: {
                left: 1,
                right: 0
            }
        }), ['start-1em']);

        assert.deepStrictEqual((htmlBuilder as any)._buildParagraphClassIndent({
            indent: {
                left: 10,
                right: 0
            }
        }), ['start-10em']);

        assert.deepStrictEqual((htmlBuilder as any)._buildParagraphClassIndent({
            indent: {
                left: 10,
                right: 0
            }
        }), ['start-10em']);

        assert.deepStrictEqual((htmlBuilder as any)._buildParagraphClassIndent({
            indent: {
                left: 0,
                right: 1
            }
        }), ['end-1em']);

        assert.deepStrictEqual((htmlBuilder as any)._buildParagraphClassIndent({
            indent: {
                left: 0,
                right: 11
            }
        }), ['end-10em']);

        assert.deepStrictEqual((htmlBuilder as any)._buildParagraphClassIndent({
            indent: {
                left: 1,
                right: 10
            }
        }), ['start-1em', 'end-10em']);
    });

    test('_buildParagraphClassBorder test', () => {
        const bookMaking = book.defaultValueBookMakeing();
        const htmlBuilder = new builder.HtmlBuilder(undefined, undefined, bookMaking);

        assert.deepStrictEqual((htmlBuilder as any)._buildParagraphClassBorder({
            border: {
                top: false,    // right when vertical
                right: false,  // bottom when vertical
                bottom: false, // left when vertical
                left: false,   // top when vertical
                inner: false
            }
        }), []);

        assert.deepStrictEqual((htmlBuilder as any)._buildParagraphClassBorder({
            border: {
                top: true,    // right when vertical
                right: false,  // bottom when vertical
                bottom: false, // left when vertical
                left: false,   // top when vertical
                inner: false
            }
        }), ['border-1000']);
        assert.deepStrictEqual((htmlBuilder as any)._buildParagraphClassBorder({
            border: {
                top: false,    // right when vertical
                right: true,  // bottom when vertical
                bottom: false, // left when vertical
                left: false,   // top when vertical
                inner: false
            }
        }), ['border-0100']);
        assert.deepStrictEqual((htmlBuilder as any)._buildParagraphClassBorder({
            border: {
                top: false,    // right when vertical
                right: false,  // bottom when vertical
                bottom: true,  // left when vertical
                left: false,   // top when vertical
                inner: false
            }
        }), ['border-0010']);
        assert.deepStrictEqual((htmlBuilder as any)._buildParagraphClassBorder({
            border: {
                top: false,    // right when vertical
                right: false,  // bottom when vertical
                bottom: false, // left when vertical
                left: true,   // top when vertical
                inner: false
            }
        }), ['border-0001']);
    });
});
