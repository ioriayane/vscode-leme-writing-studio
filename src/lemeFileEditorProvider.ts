import {
    CancellationToken
    , CustomTextEditorProvider
    , Range
    , TextDocument
    , Uri
    , Webview
    , WebviewPanel
    , workspace
    , WorkspaceEdit
} from 'vscode';
import { LemeProject } from './lemeProject';
import { getNonce } from './utility';
import * as book from './book';

export class LemeFileEditorProvider implements CustomTextEditorProvider {

    public static readonly viewType = 'leme-writing-studio.leme-file.editor';

    constructor(private _extensionUri: Uri) { }


    resolveCustomTextEditor(document: TextDocument,
        webviewPanel: WebviewPanel,
        token: CancellationToken
    ): void | Thenable<void> {
        webviewPanel.webview.options = {
            enableScripts: true,
        };
        webviewPanel.webview.html = this._getWebviewContent(webviewPanel.webview);

        function updateWebview() {
            webviewPanel.webview.postMessage({
                command: 'update',
                text: document.getText(),
            });
        }

        const changeDocumentSubscription = workspace.onDidChangeTextDocument(e => {
            if (e.document.uri.toString() === document.uri.toString()) {
                // console.log('onDidChangeTextDocument' + e.document.uri.toString());
                updateWebview();
            }
        });

        webviewPanel.onDidDispose(() => {
            changeDocumentSubscription.dispose();
        });

        webviewPanel.webview.onDidReceiveMessage(e => {
            // console.log(e);
            switch (e.command) {
                case 'update':
                    this._updateDocument(document, e.key, e.value);
                    break;
            }
        });

        updateWebview();
    }

    private _updateDocument(document: TextDocument, key: string, value: any): void {
        const json = this._parseDocument(document);
        if (!json[key]) {
            return;
        }
        if (json[key] === value) {
            return;
        }
        json[key] = value;

        const edit = new WorkspaceEdit();
        edit.replace(document.uri,
            new Range(0, 0, document.lineCount, 0),
            JSON.stringify(json, undefined, 4));
        workspace.applyEdit(edit);
    }

    private _parseDocument(document: TextDocument): any {
        const text = document.getText();
        if (text.trim().length === 0) {
            return {};
        }
        try {
            return JSON.parse(text);
        } catch {
            return {};
        }
    }


    private _getWebviewContent(webview: Webview) {
        const styleUri = webview.asWebviewUri(Uri.joinPath(
            this._extensionUri, 'editor_resource', 'editor-style.css'));
        const scriptUri = webview.asWebviewUri(Uri.joinPath(
            this._extensionUri, 'editor_resource', 'editor-script.js'));
        const nonce = getNonce();
        const body = this._makeMainContent();

        let lang: string;
        // if (this.bookSpec.language === book.BookLanguage.ja) {
        if (undefined) {
            lang = 'ja';
        } else {
            lang = 'en';
        }

        return `<!DOCTYPE html>
        <html lang="${lang}">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource}; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" type="text/css" href="${styleUri}"/>
            <title>LeME File Editor</title>
        </head>
        <body>
            <div id="editor_main_content">
            ${body}
            </div>
            <script nonce="${nonce}" src="${scriptUri}" charset="UTF-8"></script>
        </body>
        </html>`;
    }

    private _makeMainContent(): string {
        const content: string[] = [];

        content.push(`<h1>Book Specification</h1>`);

        content.push(this._makeSelect('Text flow direction'
            , LemeProject.specTextFlowDirection
            , [[book.TextFlowDirection.vertical, 'Vertical'], [book.TextFlowDirection.horizontal, 'Horizontal']]));

        return content.join('\n');
    }

    private _makeSelect(title: string, id: string, obj: string[][]): string {
        const content: string[] = [];

        content.push(`<div>${title} : `);
        content.push(`<select id="${id}"">`);
        obj.forEach(item => {
            content.push(`<option value="${item[0]}">${item[1]}</option>`);
        });
        content.push('</select></div>');

        return content.join('\n');
    }
}