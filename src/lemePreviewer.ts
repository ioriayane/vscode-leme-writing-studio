import {
    ExtensionContext, TextEditor, Uri,
    Webview, WebviewPanel, ViewColumn, window
} from 'vscode';
import * as path from 'path';
import { getNonce } from './utility';
import * as parser from './parser/index';
import * as builder from './builder/index';
import * as book from './book';

export class LemePreviewer {

    public static readonly comandName = 'leme-writing-studio.preview';
    public readonly supportExt = ['.txt'];

    public bookInfo: book.BookInformation;
    public bookSpec: book.BookSpecification;
    public bookMaking: book.BookMaking;
    public bookTextSetting: book.TextSetting;

    constructor(
        private readonly _extensionUri: Uri
    ) {
        this.bookInfo = book.defaultValueBookInformation();
        this.bookSpec = book.defaultValueBookSpecification();
        this.bookMaking = book.defaultValueBookMakeing();
        this.bookTextSetting = book.defaultValueTextSetting();
    }

    private _panel: WebviewPanel | undefined = undefined;


    public create(context: ExtensionContext, editor: TextEditor | undefined): void {
        if (!editor) {
            // console.log('Not found active text editor.');
            return;
        } else if (!this.isSupportFileType(editor.document.uri)) {
            // not support file
            return;
        }

        if (this._panel) {
            // If we already have a panel, activate
            this._panel.reveal();

            this.update(editor, false);
        } else {
            this._panel = window.createWebviewPanel(
                'leme-writing-studio-preview', 'LeME Preview',
                ViewColumn.Beside,
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

    public async update(editor: TextEditor | undefined, initialize = false): Promise<parser.Paragraph[] | undefined> {
        if (!editor) {
            // console.log('Not found active text editor.');
            return undefined;
        } else if (!this.isSupportFileType(editor.document.uri)) {
            // not support file
            return undefined;
        }
        const editorText = editor.document.getText();
        const textParser = new parser.TextParser(this.bookTextSetting);
        const document = textParser.parse(editorText);


        if (!this._panel) {
            // console.log('Not found preview panel.');
            return document;
        }
        const newTitle = 'LeME Preview : ' + path.basename(editor.document.fileName);
        if (this._panel.title !== newTitle) {
            this._panel.title = newTitle;
        }

        const parentPath = path.dirname(editor.document.uri.fsPath);
        const htmlBuilder = new builder.HtmlBuilder(this._panel.webview, parentPath, this.bookMaking);
        const htmlText = htmlBuilder.build(document, editor.selection.active.line);

        if (initialize) {
            this._panel.webview.html = this._getWebviewContent(this._panel.webview, htmlText);
            this._panel.webview.postMessage({
                command: 'sync',
                body: ''
            });
        } else {
            this._panel.webview.postMessage({
                command: 'update',
                body: htmlText
            });
        }

        return document;
    }

    private _getWebviewContent(webview: Webview, body: string) {
        const styleUri = webview.asWebviewUri(Uri.joinPath(
            this._extensionUri, 'ebook_resource', 'book-style.css'));
        const scriptUri = webview.asWebviewUri(Uri.joinPath(
            this._extensionUri, 'ebook_resource', 'book-script.js'));
        const nonce = getNonce();

        let lang: string;
        if (this.bookInfo.language === book.BookLanguage.ja) {
            lang = 'ja';
        } else {
            lang = 'en';
        }
        let direction: string;
        if (this.bookSpec.textFlowDirection === book.TextFlowDirection.vertical) {
            direction = 'vrtl';
        } else {
            direction = 'hltr';
        }

        return `<!DOCTYPE html>
        <html lang="${lang}" class="${direction}">
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

    public isSupportFileType(uri: Uri): boolean {
        return this.supportExt.includes(path.extname(uri.fsPath).toLowerCase());
    }
}

