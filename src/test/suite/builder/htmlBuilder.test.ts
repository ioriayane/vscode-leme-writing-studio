import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as path from 'path';
import * as parser from '../../../parser/index';
import * as builder from '../../../builder/index';

suite('HtmlBuilder Test Suite', () => {
    vscode.window.showInformationMessage('Start HtmlBuilder tests.');

    test('Simple text test', () => {
        const panel = vscode.window.createWebviewPanel(
            'leme-writing-studio-preview_test', 'LeME Preview Test',
            vscode.ViewColumn.Beside, {});
        let htmlBuilder = new builder.HtmlBuilder(panel.webview, '/LeME');
        let textParser = new parser.TextParser();

        assert.strictEqual(htmlBuilder.build([]), '');

        const expectImage1 = panel.webview.asWebviewUri(vscode.Uri.file(path.join('/LeME/', 'media/image1.png')));

        assert.strictEqual(htmlBuilder.build(
            textParser.parse('line1\nline2\nThis is a ![image](./media/image1.png).\nline4')
        ),
            `<h1 class="gfont">line1</h1>
<p>line2</p>
<p>This is a <img alt="" src="${expectImage1}"/>.</p>
<p>line4</p>`
        );

        assert.strictEqual(htmlBuilder.build(
            textParser.parse('line1\nline2\nThis is a ![image](./media/image1.png).\nline4'), 1
        ),
            `<h1 class="gfont">line1</h1>
<p id="scroll_mark" class="active_p">line2</p>
<p>This is a <img alt="" src="${expectImage1}"/>.</p>
<p>line4</p>`
        );

        panel.dispose();
    });

    test('Simple text test2', () => {
        let htmlBuilder = new builder.HtmlBuilder(undefined, undefined);
        let textParser = new parser.TextParser();

        assert.strictEqual(htmlBuilder.build([]), '');

        assert.strictEqual(htmlBuilder.build(
            textParser.parse('line1\nline2\nThis is a ![image](./media/image1.png).\nline4')
        ),
            `<h1 class="gfont">line1</h1>
<p>line2</p>
<p>This is a <img alt="" src="./media/image1.png"/>.</p>
<p>line4</p>`
        );

        assert.strictEqual(htmlBuilder.build(
            textParser.parse('line1\nline2\nThis is a ![image](./media/image1.png).\nline4'), 1
        ),
            `<h1 class="gfont">line1</h1>
<p id="scroll_mark" class="active_p">line2</p>
<p>This is a <img alt="" src="./media/image1.png"/>.</p>
<p>line4</p>`
        );
    });

    test('_buildText test', () => {
        let htmlBuilder = new builder.HtmlBuilder(undefined, undefined);

        assert.strictEqual((htmlBuilder as any)._buildText(new parser.ParagraphItemText('', '')), '');
        assert.strictEqual((htmlBuilder as any)._buildText(new parser.ParagraphItemText('hoge', '')), 'hoge');
        assert.strictEqual((htmlBuilder as any)._buildText(new parser.ParagraphItemText('hoge', 'fuga')), '<ruby>hoge<rt>fuga</rt></ruby>');
    });
});
