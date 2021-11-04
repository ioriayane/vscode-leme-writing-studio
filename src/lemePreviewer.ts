import * as vscode from 'vscode';
import * as path from 'path';
import { getNonce } from './utility';


export class LemePreviewer {

    public static readonly comandName = 'leme-writing-studio.preview';

    constructor(
        private readonly _extensionUri: vscode.Uri
    ) { }

    private _panel: vscode.WebviewPanel | undefined = undefined;


    public create(context: vscode.ExtensionContext, editor: vscode.TextEditor | undefined) {
        console.log('context:' + context.extensionPath);
        console.log('this : ' + this._extensionUri);

        if (!editor) {
            console.log('Not found active text editor.');
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
                console.log('close LeME preview');
                this._panel = undefined;
            },
                null,
                context.subscriptions
            );

            this.update(editor, true);
        }
    }

    public update(editor: vscode.TextEditor | undefined, initialize: boolean = false) {
        if (!editor) {
            console.log('Not found active text editor.');
            return;
        }
        if (!this._panel) {
            console.log('Not found preview panel.');
            return;
        }

        const editorText = editor.document.getText();
        this._parse(editorText, path.dirname(editor.document.uri.fsPath)).then((result) => {
            if (this._panel) {
                if (initialize) {
                    this._panel.webview.html = this._getWebviewContent(this._panel.webview, result);
                } else {
                    this._panel.webview.postMessage({ body: result });
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
        return `<!DOCTYPE html>
        <html lang="en" class="vrtl">
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
            <script nonce="${nonce}" src="${scriptUri}"></script>
        </body>
        </html>`;

    }

    private async _parse(text: string, parentPath: string): Promise<string> {
        let lines: string[] = text.split('\n');
        let updatedLines = lines.map(line => {
            let m = line.match(/[!！][\[［][^\[\]［］\(（]*[\]］][（\(][^）\)]*[）\)]/);
            if (!m) {
                return '<p>' + line + '</p>';
            } else if (m.length !== 1) {
                return '<p>' + line + '</p>';
            } else {
                let items: string[] = m[0].split('](');
                if (items.length !== 2) {
                    return '<p>' + line + '</p>';
                } else {
                    const relPath = items[1].slice(0, -1);
                    const absPath = vscode.Uri.file(path.join(parentPath, relPath));
                    const srcPath = this._panel?.webview.asWebviewUri(absPath);
                    return '<img alt="" src="' + srcPath + '"/>';
                }
            }
        });

        return updatedLines.join('\n');
    };

}

