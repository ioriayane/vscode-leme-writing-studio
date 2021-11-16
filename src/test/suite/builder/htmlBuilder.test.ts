/* eslint-disable @typescript-eslint/no-explicit-any */
import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as path from 'path';
import * as parser from '../../../parser/index';
import * as builder from '../../../builder/index';


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

    test('Build text test', () => {
        const dummyWebview = new DummyWebview();
        const htmlBuilder = new builder.HtmlBuilder(dummyWebview, '/LeME');
        const textParser = new parser.TextParser();

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
        const htmlBuilder = new builder.HtmlBuilder(undefined, undefined);
        const textParser = new parser.TextParser();

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
        const htmlBuilder = new builder.HtmlBuilder(undefined, undefined);

        assert.strictEqual((htmlBuilder as any)._buildText(new parser.ParagraphItemText('', '')), '');
        assert.strictEqual((htmlBuilder as any)._buildText(new parser.ParagraphItemText('hoge', '')), 'hoge');
        assert.strictEqual((htmlBuilder as any)._buildText(new parser.ParagraphItemText('hoge', 'fuga')), '<ruby>hoge<rt>fuga</rt></ruby>');
    });


    test('_buildParagraphClass test', () => {
        const htmlBuilder = new builder.HtmlBuilder(undefined, undefined);

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
        const htmlBuilder = new builder.HtmlBuilder(undefined, undefined);

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
        const htmlBuilder = new builder.HtmlBuilder(undefined, undefined);

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
        const htmlBuilder = new builder.HtmlBuilder(undefined, undefined);

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
