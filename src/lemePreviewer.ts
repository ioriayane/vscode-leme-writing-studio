import * as vscode from 'vscode';
import * as path from 'path';
import { getNonce } from './utility';
import * as parser from './parser/index';
import * as builder from './builder/index';
import * as book from './book';

export class LemePreviewer {

    public static readonly comandName = 'leme-writing-studio.preview';

    public bookSpec: book.BookSpecification = {
        textFlowDirection: book.TextFlowDirection.vertical
    };
    public bookTextSetting: book.TextSetting = {
        eraceConsecutiveBlankLine: false,

        firstLineHeading: true,
        headling: true,
        align: true,
        indent: true,
        border: true,
        pageBreak: true,
        horizontalRule: true, // hr
        rubyBracket: true, //二重山括弧
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


    constructor(
        private readonly _extensionUri: vscode.Uri
    ) { }

    private _panel: vscode.WebviewPanel | undefined = undefined;


    public create(context: vscode.ExtensionContext, editor: vscode.TextEditor | undefined): void {
        if (!editor) {
            // console.log('Not found active text editor.');
            return;
        }

        if (this._panel) {
            // If we already have a panel, activate
            this._panel.reveal();

            this.update(editor, false);
        } else {
            this._panel = vscode.window.createWebviewPanel(
                'leme-writing-studio-preview', 'LeME Preview',
                vscode.ViewColumn.Beside,
                {
                    enableScripts: true,
                    // localResourceRoots: [vscode.Uri.file(path.dirname(activeEditor.document.uri.fsPath))]
                    // localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'ebook_resource'))]
                }
            );

            this._panel.onDidDispose(() => {
                // console.log('close LeME preview');
                this._panel = undefined;
            },
                null,
                context.subscriptions
            );

            this.update(editor, true);
        }
    }

    public update(editor: vscode.TextEditor | undefined, initialize = false): void {
        if (!editor) {
            // console.log('Not found active text editor.');
            return;
        }
        if (!this._panel) {
            // console.log('Not found preview panel.');
            return;
        }
        const newTitle = 'LeME Preview : ' + path.basename(editor.document.fileName);
        if (this._panel.title !== newTitle) {
            this._panel.title = newTitle;
        }

        const editorText = editor.document.getText();
        this._parse(editorText, editor.selection.active.line, path.dirname(editor.document.uri.fsPath)).then((result) => {
            if (this._panel) {
                if (initialize) {
                    this._panel.webview.html = this._getWebviewContent(this._panel.webview, result);
                    this._panel.webview.postMessage({
                        command: 'sync',
                        body: ''
                    });
                } else {
                    this._panel.webview.postMessage({
                        command: 'update',
                        body: result
                    });
                }
            }
        });
    }

    private _getWebviewContent(webview: vscode.Webview, body: string) {
        const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(
            this._extensionUri, 'ebook_resource', 'book-style.css'));
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(
            this._extensionUri, 'ebook_resource', 'book-script.js'));
        const nonce = getNonce();

        let direction: string;
        if (this.bookSpec.textFlowDirection === book.TextFlowDirection.vertical) {
            direction = 'vrtl';
        } else {
            direction = 'hltr';
        }

        return `<!DOCTYPE html>
        <html lang="en" class="${direction}">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource}; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" type="text/css" href="${styleUri}"/>
            <title>LeME Preview</title>
        </head>
        <body class="p-text">
            <div class="main" id="preview_main_content">
            ${body}
            </div>
            <script nonce="${nonce}" src="${scriptUri}" charset="UTF-8"></script>
        </body>
        </html>`;

    }

    private async _parse(text: string, cursorLine: number, parentPath: string): Promise<string> {
        const htmlBuilder = new builder.HtmlBuilder(this._panel?.webview, parentPath);
        const textParser = new parser.TextParser(this.bookTextSetting);
        return htmlBuilder.build(textParser.parse(text), cursorLine);
    }

}

