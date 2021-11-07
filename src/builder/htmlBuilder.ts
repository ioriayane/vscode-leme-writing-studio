import * as vscode from 'vscode';
import * as path from 'path';
import * as parser from '../parser/index';

export class HtmlBuilder {
    constructor(
        private readonly _webview: vscode.Webview | undefined,
        private readonly _parentPath: string | undefined
    ) {
    }

    public build(document: parser.Paragraph[], cursorLine: number = -1): string {

        let lines = document.map((paragraph, index) => {
            let lineItems: string[] = paragraph.items.map(item => {
                switch (item.type) {
                    case parser.ParagraphItemType.Text:
                        return this._buildText(item as parser.ParagraphItemText);
                    case parser.ParagraphItemType.Image:
                        return this._buildImage(item as parser.ParagraphItemImage);
                    default:
                        return '';
                }
            });
            
            // for Preview
            let classStr: string = '';
            if (index === cursorLine) {
                classStr = ' class="active_p" id="scroll_mark"';
            }

            // if paragraph is empty
            let line = lineItems.join('');
            if(line.length === 0){
                line = '<br/>';
            }

            return `<p${classStr}>${line}</p>`;
        });

        return lines.join('\n');
    }

    private _buildText(item: parser.ParagraphItemText): string {
        let text: string;
        if(item.ruby.length > 0){
            text = `<ruby>${item.text}<rt>${item.ruby}</rt></ruby>`;
        }else{
            text = item.text;
        }
        return text;
    }

    private _buildImage(item: parser.ParagraphItemImage): string {

        if(this._webview && this._parentPath){
            const srcPath = this._webview.asWebviewUri(
                vscode.Uri.file(path.join(this._parentPath, item.path))
                );
            return `<img alt="" src="${srcPath}"/>`;
        }else{
            return `<img alt="" src="${item.path}"/>`;
        }
    }
}