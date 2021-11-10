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
    onDidReceiveMessage!: vscode.Event<any>;
    postMessage(message: any): Thenable<boolean> {
        throw new Error('Method not implemented.');
    }
    asWebviewUri(localResource: vscode.Uri): vscode.Uri {
        let json = localResource.toJSON();
        json['scheme'] = 'https';
        return vscode.Uri.from(json);
    }
    cspSource: string;
}


suite('HtmlBuilder Test Suite', () => {
    vscode.window.showInformationMessage('Start HtmlBuilder tests.');

    test('Build text test', () => {
        const dummyWebview = new DummyWebview();
        let htmlBuilder = new builder.HtmlBuilder(dummyWebview, '/LeME');
        let textParser = new parser.TextParser();

        assert.strictEqual(htmlBuilder.build([]), '');

        const expectImage1 = dummyWebview.asWebviewUri(vscode.Uri.file(path.join('/LeME/', 'media/image1.png')));

        const text = 'line1\nline2\nThis is a ![image](./media/image1.png).\n!PB\nline4\n!HR\nline6\n' +
            '!R right\n!L left\n!C center';

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
<p class="align-right">right</p>
<p class="align-left">left</p>
<p class="align-center">center</p>`
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
<p class="align-right">right</p>
<p class="align-left">left</p>
<p class="align-center">center</p>`
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
<p class="align-right">right</p>
<p class="align-left">left</p>
<p class="align-center">center</p>`
        );
    });

    test('Build text test(web)', () => {
        let htmlBuilder = new builder.HtmlBuilder(undefined, undefined);
        let textParser = new parser.TextParser();

        assert.strictEqual(htmlBuilder.build([]), '');

        const text = 'line1\nline2\nThis is a ![image](./media/image1.png).\n!PB\nline4\n!HR\nline6\n' +
            '!R right\n!L left\n!C center';

        assert.strictEqual(htmlBuilder.build(
            textParser.parse(text)
        ),
            `<h1 class="oo-midashi font-140per gfont">line1</h1>
<p>line2</p>
<p>This is a <img alt="" src="./media/image1.png"/>.</p>
<p class="align-center"><br/>   ----  Page break ----   <br/><br/></p>
<p>line4</p>
<p><hr/></p>
<p>line6</p>
<p class="align-right">right</p>
<p class="align-left">left</p>
<p class="align-center">center</p>`
        );

        assert.strictEqual(htmlBuilder.build(
            textParser.parse(text), 1
        ),
            `<h1 class="oo-midashi font-140per gfont">line1</h1>
<p id="scroll_mark" class="active_p">line2</p>
<p>This is a <img alt="" src="./media/image1.png"/>.</p>
<p class="align-center"><br/>   ----  Page break ----   <br/><br/></p>
<p>line4</p>
<p><hr/></p>
<p>line6</p>
<p class="align-right">right</p>
<p class="align-left">left</p>
<p class="align-center">center</p>`
        );
    });

    test('_buildText test', () => {
        let htmlBuilder = new builder.HtmlBuilder(undefined, undefined);

        assert.strictEqual((htmlBuilder as any)._buildText(new parser.ParagraphItemText('', '')), '');
        assert.strictEqual((htmlBuilder as any)._buildText(new parser.ParagraphItemText('hoge', '')), 'hoge');
        assert.strictEqual((htmlBuilder as any)._buildText(new parser.ParagraphItemText('hoge', 'fuga')), '<ruby>hoge<rt>fuga</rt></ruby>');
    });


    test('_buildParagraphClassString test', () => {
        let htmlBuilder = new builder.HtmlBuilder(undefined, undefined);

        assert.deepStrictEqual((htmlBuilder as any)._buildParagraphClassString({
            outlineLv: 0,
            font: {
                sizeRatio: 100,
                gothic: false,
                bold: false,
                emLine: false,
                italic: false,
                strike: false,
                em: parser.EmphasisMarkType.None
            }
        }), []);

        assert.deepStrictEqual((htmlBuilder as any)._buildParagraphClassString({
            outlineLv: 1,
            font: {
                sizeRatio: 140,
                gothic: true,
                bold: false,
                emLine: false,
                italic: false,
                strike: false,
                em: parser.EmphasisMarkType.None
            }
        }), ['oo-midashi', 'font-140per', 'gfont']);

        assert.deepStrictEqual((htmlBuilder as any)._buildParagraphClassString({
            outlineLv: 2,
            font: {
                sizeRatio: 120,
                gothic: true,
                bold: false,
                emLine: false,
                italic: false,
                strike: false,
                em: parser.EmphasisMarkType.None
            }
        }), ['naka-midashi', 'font-120per', 'gfont']);

        assert.deepStrictEqual((htmlBuilder as any)._buildParagraphClassString({
            outlineLv: 3,
            font: {
                sizeRatio: 110,
                gothic: true,
                bold: false,
                emLine: false,
                italic: false,
                strike: false,
                em: parser.EmphasisMarkType.None
            }
        }), ['ko-midashi', 'font-110per', 'gfont']);

        assert.deepStrictEqual((htmlBuilder as any)._buildParagraphClassString({
            outlineLv: 4,
            font: {
                sizeRatio: 100,
                gothic: false,
                bold: false,
                emLine: false,
                italic: false,
                strike: false,
                em: parser.EmphasisMarkType.None
            }
        }), ['ko-midashi']);

        assert.deepStrictEqual((htmlBuilder as any)._buildParagraphClassString({
            outlineLv: 6,
            font: {
                sizeRatio: 100,
                gothic: false,
                bold: false,
                emLine: false,
                italic: false,
                strike: false,
                em: parser.EmphasisMarkType.None
            }
        }), ['ko-midashi']);

        assert.deepStrictEqual((htmlBuilder as any)._buildParagraphClassString({
            outlineLv: 7,
            font: {
                sizeRatio: 100,
                gothic: false,
                bold: false,
                emLine: false,
                italic: false,
                strike: false,
                em: parser.EmphasisMarkType.None
            }
        }), ['ko-midashi']);
    });


    test('_buildFontClassString test', () => {
        let htmlBuilder = new builder.HtmlBuilder(undefined, undefined);

        assert.deepStrictEqual((htmlBuilder as any)._buildFontClassString({
            sizeRatio: 100,
            gothic: false,
            bold: false,
            emLine: false,
            italic: false,
            strike: false,
            em: parser.EmphasisMarkType.None
        }), []);

        assert.deepStrictEqual((htmlBuilder as any)._buildFontClassString({
            sizeRatio: 140,
            gothic: false,
            bold: false,
            emLine: false,
            italic: false,
            strike: false,
            em: parser.EmphasisMarkType.None
        }), ['font-140per']);

        assert.deepStrictEqual((htmlBuilder as any)._buildFontClassString({
            sizeRatio: 100,
            gothic: true,
            bold: false,
            emLine: false,
            italic: false,
            strike: false,
            em: parser.EmphasisMarkType.None
        }), ['gfont']);

        assert.deepStrictEqual((htmlBuilder as any)._buildFontClassString({
            sizeRatio: 140,
            gothic: true,
            bold: false,
            emLine: false,
            italic: false,
            strike: false,
            em: parser.EmphasisMarkType.None
        }), ['font-140per', 'gfont']);
    });
});
