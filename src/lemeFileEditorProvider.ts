import {
    CancellationToken
    , CustomTextEditorProvider
    , Range
    , TextDocument
    , Uri
    , Webview
    , WebviewPanel
    , window, workspace
    , WorkspaceEdit
} from 'vscode';
import { LemeProject } from './lemeProject';
import { getNonce } from './utility';
import * as book from './book';
import * as path from 'path';


export class LemeFileEditorProvider implements CustomTextEditorProvider {

    public static readonly viewType = 'leme-writing-studio.leme-file.editor';
    // public static readonly comandNameAddFile = 'leme-writing-studio.addToBook';

    public onActivate: (document: TextDocument) => void = (() => { /**/ });

    constructor(private _extensionUri: Uri) { }


    resolveCustomTextEditor(document: TextDocument,
        webviewPanel: WebviewPanel,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

        webviewPanel.onDidChangeViewState(e => {
            if(e.webviewPanel.active){
                this.onActivate(document);
            }
        });

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
                case 'loaded':
                    updateWebview();
                    break;
                case 'update':
                    this._updateSetting(document, e.key, e.value);
                    break;
                case 'contents-item-up':
                    this._moveContentItem(document, 0, parseInt(e.key));
                    break;
                case 'contents-item-down':
                    this._moveContentItem(document, 1, parseInt(e.key));
                    break;
                case 'contents-item-delete':
                    this._moveContentItem(document, 2, parseInt(e.key));
                    break;
                case 'contents-add-toc':
                    this._moveContentItem(document, 3, 0);
                    break;
                case 'contents-item-cover':
                    // 4
                    this._updateContentItemCover(document, parseInt(e.key), e.value);
                    break;
                case 'contents-item-image-handling':
                    // 5
                    this._updateContentItemImageHandling(document, parseInt(e.key), e.value);
                    break;
                case 'contents-add-blank':
                    this._moveContentItem(document, 6, 0);
                    break;
                case 'contents-add-item':
                    window.showOpenDialog({
                        canSelectFiles: true,
                        canSelectMany: true,
                        defaultUri: Uri.file(path.dirname(document.uri.path)),
                        filters: {
                            'supported': ['txt', 'png', 'jpg', 'pdf', 'docx', 'md']
                        },
                        title: 'Add to book'
                    }).then(items => {
                        if (!items) {
                            return;
                        }
                        items.forEach(itemUri => {
                            this.addContentItem(document, itemUri);
                        });
                    });
                    break;
            }
        });

        updateWebview();
        this.onActivate(document);
    }

    private _moveContentItem(document: TextDocument, command: number, index: number): void {
        const json = this._parseDocument(document);
        if (!('contents' in json)) {
            return;
        }
        switch (command) {
            case 0:
                // Up
                {
                    if (index <= 0 || index >= json['contents'].length) {
                        return;
                    }
                    const temp = json['contents'][index];
                    json['contents'][index] = json['contents'][index - 1];
                    json['contents'][index - 1] = temp;
                    break;
                }
            case 1:
                // Down
                {
                    if (index < 0 || (index + 1) >= json['contents'].length) {
                        return;
                    }
                    const temp = json['contents'][index];
                    json['contents'][index] = json['contents'][index + 1];
                    json['contents'][index + 1] = temp;
                    break;
                }
            case 2:
                // Delete
                if (index < 0 || index >= json['contents'].length) {
                    return;
                }
                json['contents'].splice(index, 1);
                break;
            case 3:
                // Add Toc
                {
                    let exist = false;
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    json['contents'].forEach((item: { [key: string]: any; }) => {
                        if (item['type'] === 4) {
                            exist = true;
                        }
                    });
                    if (!exist) {
                        json['contents'].push(book.getContentItemToc());
                    }
                    break;
                }
            case 6:
                // Add Blank page
                json['contents'].push(book.getContentItemBlank());
                break;
        }

        this._applyDocument(document, json);
    }

    private _updateContentItemCover(document: TextDocument, index: number, checked: boolean): void {
        const json = this._parseDocument(document);
        if (!('contents' in json)) {
            return;
        }
        if (index < 0 || index >= json['contents'].length) {
            return;
        }
        if (!('cover' in json['contents'][index])) {
            return;
        }
        if (json['contents'][index]['cover'] === checked) {
            return;
        }
        if (checked) {
            // cover is only one in a book.
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            json['contents'].forEach((item: { [key: string]: any; }) => {
                if (item['type'] === 3 && item['cover']) {
                    item['cover'] = false;
                }
            });
        }
        // update
        json['contents'][index]['cover'] = checked;

        this._applyDocument(document, json);
    }

    private _updateContentItemImageHandling(document: TextDocument, index: number, value: number): void {
        const json = this._parseDocument(document);
        if (!('contents' in json)) {
            return;
        }
        if (index < 0 || index >= json['contents'].length) {
            return;
        }
        // book.ImageHandling
        if (value < 0 || value > 2) {
            return;
        }
        if (!('imageHandling' in json['contents'][index])) {
            return;
        }
        if (json['contents'][index]['imageHandling'] === value) {
            return;
        }
        // update
        json['contents'][index]['imageHandling'] = value;

        this._applyDocument(document, json);
    }

    public addContentItem(document: TextDocument, itemUri: Uri): void {
        const json = this._parseDocument(document);
        if (!('contents' in json)) {
            return;
        }
        switch (path.extname(itemUri.path)) {
            case '.docx':
                json['contents'].push(book.getContentItemWord(document.uri, itemUri));
                break;
            case '.txt':
                json['contents'].push(book.getContentItemText(document.uri, itemUri));
                break;
            case '.jpg':
                json['contents'].push(book.getContentItemImage(document.uri, itemUri));
                break;
            case '.png':
                json['contents'].push(book.getContentItemImage(document.uri, itemUri));
                break;
            case '.pdf':
                json['contents'].push(book.getContentItemPdf(document.uri, itemUri));
                break;
            case '.md':
                json['contents'].push(book.getContentItemMarkdown(document.uri, itemUri));
                break;
        }

        this._applyDocument(document, json);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private _updateSetting(document: TextDocument, key: string, value: any): void {
        const json = this._parseDocument(document);
        if (!(key in json)) {
            return;
        }
        if (json[key] === value) {
            return;
        }
        json[key] = value;

        this._applyDocument(document, json);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private _applyDocument(document: TextDocument, json: any): void {
        const edit = new WorkspaceEdit();
        edit.replace(document.uri,
            new Range(0, 0, document.lineCount, 0),
            JSON.stringify(json, undefined, 4));
        workspace.applyEdit(edit);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

        content.push(`<h1>Contents</h1>`);

        content.push('<div id="contents"></div>');
        content.push('<div class="contentControl">');
        content.push('<input id="contents-add-item" class="large" type="button" value="Add File">');
        content.push('<input id="contents-add-toc" class="large" type="button" value="Add ToC">');
        content.push('<input id="contents-add-blank" class="large" type="button" value="Add Blank">');
        content.push('</div>');


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


        content.push(`<h1>Book making</h1>`);
        content.push(this._makeTextBox('Epub file name', LemeProject.makingEpubPath));
        content.push(this._makeInput(LemeProject.makingConvertSpaceToEnspace, 'Convert space to &amp;ensp;(&amp;#8194;)'));
        content.push(this._makeInput(LemeProject.makingEnableHyperLink, 'Enable External Hyper Link'));

        content.push(`<h1>Text formatting</h1>`);
        content.push(this._makeInput(LemeProject.makingFormatTextEraseConsecutiveBlankLine, 'Erace consecutive blank line (A line->remove, Two or more line->A line)'));
        content.push(this._makeInput(LemeProject.makingFormatTextFirstLineHeading, 'Convert heading (First line in the file)'));
        content.push(this._makeInput(LemeProject.makingFormatTextHeading, 'Convert heading (Hash marks (#) at the beginning of the line)'));
        content.push(this._makeInput(LemeProject.makingFormatTextParagraphAlign, 'Convert paragraph align (format : !R at the beginning of the line)'));
        content.push(this._makeInput(LemeProject.makingFormatTextParagraphIndent, 'Convert paragraph indent (format : !Im,n only in the line)'));
        content.push(this._makeInput(LemeProject.makingFormatTextBorder, 'Convert border (format : !BD,TBLRH only in the line)'));
        content.push(this._makeInput(LemeProject.makingFormatTextRubyAngle, 'Convert ruby (format : |BODY《RUBY》)'));
        content.push(this._makeInput(LemeProject.makingFormatTextRubyParen, 'Convert ruby (format : |BODY(RUBY))'));
        content.push(this._makeInput(LemeProject.makingFormatTextItalic, 'Convert Italic (format : *CHAR*)'));
        content.push(this._makeInput(LemeProject.makingFormatTextBold, 'Convert Bold (format : **CHAR**)'));
        content.push(this._makeInput(LemeProject.makingFormatTextEmMark, 'Convert EmMark[dot] (format : +CHAR+)'));
        content.push(this._makeInput(LemeProject.makingFormatTextEmMark2, 'Convert EmMark[dot] (format : 《《CHAR》》)'));
        content.push(this._makeInput(LemeProject.makingFormatTextEmMarkComma, 'Convert EmMark[comma] (format : ++CHAR++)'));
        content.push(this._makeInput(LemeProject.makingFormatTextTcy, 'Convert TCY (format : ^CHAR^)'));
        content.push(this._makeInput(LemeProject.makingFormatTextImage, 'Convert Link/Image (format : [TEXT](URL), ![MEMO](FILE PATH))'));
        content.push(this._makeInput(LemeProject.makingFormatTextPageBreak, 'Convert Page Break (format : !PB only in the line)'));
        content.push(this._makeInput(LemeProject.makingFormatTextHorizontalRule, 'Convert HR (format : !HR only in the line)'));
        content.push(this._makeInput(LemeProject.makingFormatTextAdvanceMode, 'Advance mode (similar markdown format)'));

        return content.join('\n');
    }

    private _makeTextBox(title: string, id: string) {
        const content: string[] = [];

        content.push(`<div>`);
        content.push(`<p>${title} : </p><p><input id="${id}" type="text"></p></div>`);

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

        content.push(`<div><p>${title} : </p>`);
        content.push(`<p><select id="${id}" class="wide">`);
        obj.forEach(item => {
            content.push(`<option value="${item[0]}">${item[1]}</option>`);
        });
        content.push('</select></p></div>');

        return content.join('\n');
    }
}