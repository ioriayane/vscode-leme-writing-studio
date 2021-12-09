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
        if (!(key in json)) {
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


        content.push(`<h1>Book Information</h1>`);

        content.push(this._makeTextBox('Creator1', LemeProject.infoCreator1));
        content.push(this._makeTextBox('Creator1 (kana)', LemeProject.infoCreator1Kana));
        content.push(this._makeTextBox('Creator2', LemeProject.infoCreator2));
        content.push(this._makeTextBox('Creator2 (kana)', LemeProject.infoCreator2Kana));
        content.push(this._makeTextBox('Identifier (ISBN etc)', LemeProject.infoIdentifier));
        content.push(this._makeSelect('Language', LemeProject.infoLanguage
            , [['' + book.BookLanguage.ja, 'Japanese'], ['' + book.BookLanguage.en, 'English']]));  // select
        content.push(this._makeTextBox('Publisher', LemeProject.infoPublisher));
        content.push(this._makeTextBox('Publisher (kana)', LemeProject.infoPublisherKana));
        content.push(this._makeTextBox('Title', LemeProject.infoTitle));
        content.push(this._makeTextBox('Title (kana)', LemeProject.infoTitleKana));

        content.push(`<h1>Book Specification</h1>`);

        content.push(this._makeInput(LemeProject.specAllowSpread, 'Allow spread'));
        content.push(this._makeSelect('Page progression direction'
            , LemeProject.specPageProgressionDirection
            , [[book.PageProgressionDirection.right, 'Right side'], [book.PageProgressionDirection.left, 'Left side']]));
        content.push(this._makeSelect('Text flow direction'
            , LemeProject.specTextFlowDirection
            , [[book.TextFlowDirection.vertical, 'Vertical'], [book.TextFlowDirection.horizontal, 'Horizontal']]));


        content.push(`<h1>Text file</h1>`);
        content.push(this._makeInput(LemeProject.makingFormatTextAdvanceMode, 'Advance mode (similar markdown format)'));
        content.push(this._makeInput(LemeProject.makingFormatTextBold, 'Convert Bold (format : **CHAR**)'));
        content.push(this._makeInput(LemeProject.makingFormatTextBorder, 'Convert border (format : !BD,TBLRH only in the line)'));
        content.push(this._makeInput(LemeProject.makingFormatTextEmMark, 'Convert EmMark[dot] (format : +CHAR+)'));
        content.push(this._makeInput(LemeProject.makingFormatTextEmMark2, 'Convert EmMark[dot] (format : 《《CHAR》》)'));
        content.push(this._makeInput(LemeProject.makingFormatTextEmMarkComma, 'Convert EmMark[comma] (format : ++CHAR++)'));
        content.push(this._makeInput(LemeProject.makingFormatTextFirstLineHeading, 'Convert heading (First line in the file)'));
        content.push(this._makeInput(LemeProject.makingFormatTextHeading, 'Convert heading (Hash marks (#) at the beginning of the line)'));
        content.push(this._makeInput(LemeProject.makingFormatTextHorizontalRule, 'Convert HR (format : !HR only in the line)'));
        content.push(this._makeInput(LemeProject.makingFormatTextImage, 'Convert Link/Image (format : [TEXT](URL), ![MEMO](FILE PATH))'));
        content.push(this._makeInput(LemeProject.makingFormatTextItalic, 'Convert Italic (format : *CHAR*)'));
        content.push(this._makeInput(LemeProject.makingFormatTextPageBreak, 'Convert Page Break (format : !PB only in the line)'));
        content.push(this._makeInput(LemeProject.makingFormatTextParagraphAlign, 'Convert paragraph align (format : !R at the beginning of the line)'));
        content.push(this._makeInput(LemeProject.makingFormatTextParagraphIndent, 'Convert paragraph indent (format : !Im,n only in the line)'));
        content.push(this._makeInput(LemeProject.makingFormatTextRubyAngle, 'Convert ruby (format : |BODY《RUBY》)'));
        content.push(this._makeInput(LemeProject.makingFormatTextRubyParen, 'Convert ruby (format : |BODY(RUBY))'));
        content.push(this._makeInput(LemeProject.makingFormatTextEraseConsecutiveBlankLine, 'Erace consecutive blank line (A line->remove, Two or more line->A line)'));
        content.push(this._makeInput(LemeProject.makingFormatTextTcy, 'Convert TCY (format : ^CHAR^)'));

        return content.join('\n');
    }

    private _makeTextBox(title: string, id: string) {
        const content: string[] = [];

        content.push(`<div>`);
        content.push(`<p>${title} : <input id="${id}" type="text"></p></div>`);

        return content.join('\n');
    }

    private _makeInput(id: string, description: string) {
        const content: string[] = [];

        content.push(`<div>`);
        content.push(`<p><input id="${id}" type="checkbox"><label for="${id}">${description}</label></p></div>`);

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