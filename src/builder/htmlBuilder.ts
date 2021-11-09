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
                    case parser.ParagraphItemType.PageBreak:
                        // If you want to convert to a epub, this function will be changed to a generator.
                        // yield 'html for one file';
                        return '';
                    case parser.ParagraphItemType.Image:
                        return this._buildImage(item as parser.ParagraphItemImage);
                    case parser.ParagraphItemType.Multimedia:
                        return '';
                    case parser.ParagraphItemType.HyperLink:
                        return '';
                    case parser.ParagraphItemType.HorizontalRule:
                        return '<hr/>';
                    default:
                        return '';
                }
            });

            let pTag = 'p';
            let idList: string[] = [];
            let classList: string[] = [];
            let idStr = '';
            let classStr = '';

            // for Preview
            if (index === cursorLine) {
                idList.push('scroll_mark');
                classList.push('active_p');
            }

            // build line
            let line = lineItems.join('');

            // if paragraph is empty
            if (line.length === 0) {
                line = '<br/>';
            }

            // headline
            if (paragraph.outlineLv > 0) {
                if (paragraph.outlineLv <= 6) {
                    pTag = `h${paragraph.outlineLv}`;
                } else {
                    pTag = 'h6';
                }
            }

            // class
            classList = classList.concat(this._buildParagraphClassString(paragraph));

            // build paragraph
            if (idList.length > 0) {
                idStr = ` id="${idList.join(' ')}"`;
            }
            if (classList.length > 0) {
                classStr = ` class="${classList.join(' ')}"`;
            }
            return `<${pTag}${idStr}${classStr}>${line}</${pTag}>`;
        });

        return lines.join('\n');
    }

    private _buildText(item: parser.ParagraphItemText): string {
        let text: string;
        if (item.ruby.length > 0) {
            text = `<ruby>${item.text}<rt>${item.ruby}</rt></ruby>`;
        } else {
            text = item.text;
        }
        return text;
    }

    private _buildImage(item: parser.ParagraphItemImage): string {

        if (this._webview && this._parentPath) {
            const srcPath = this._webview.asWebviewUri(
                vscode.Uri.file(path.join(this._parentPath, item.path))
            );
            return `<img alt="" src="${srcPath}"/>`;
        } else {
            return `<img alt="" src="${item.path}"/>`;
        }
    }

    private _buildParagraphClassString(property: parser.ParagraphProperty): string[] {
        let str: string[] = [];

        const midashi: string[] = ['', 'oo-midashi', 'naka-midashi', 'ko-midashi', 'ko-midashi', 'ko-midashi', 'ko-midashi'];
        if (property.outlineLv > 0 && property.outlineLv < midashi.length) {
            str.push(midashi[property.outlineLv]);
        } else if (property.outlineLv >= midashi.length) {
            str.push('ko-midashi');
        }

        return str.concat(this._buildFontClassString(property.font));
    }

    private _buildFontClassString(font: parser.FontProperty): string[] {
        let str: string[] = [];
        if (font.sizeRatio !== 100) {
            str.push(`font-${font.sizeRatio}per`);
        }
        if (font.gothic) {
            str.push('gfont');
        }
        return str;
    }
}