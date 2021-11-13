import * as vscode from 'vscode';
import * as path from 'path';
import * as parser from '../parser/index';
import * as builder from './index';

export class HtmlBuilder implements builder.BuildProperty {

    public textFlowDirection = builder.TextFlowDirection.Vertical;

    constructor(
        private readonly _webview: vscode.Webview | undefined,
        private readonly _parentPath: string | undefined
    ) {
    }

    public build(document: parser.Paragraph[], cursorLine: number = -1): string {

        let lines = document.map((paragraph, index) => {
            if (paragraph.empty) {
                return '';
            }

            let lineItems: string[] = paragraph.items.map(item => {
                switch (item.type) {
                    case parser.ParagraphItemType.Text:
                        return this._buildText(item as parser.ParagraphItemText);
                    case parser.ParagraphItemType.Image:
                        return this._buildImage(item as parser.ParagraphItemImage);
                    case parser.ParagraphItemType.Multimedia:
                        return '';
                    default:
                        return '';
                }
            });

            let tag = 'p';
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


            if (paragraph.pageBreak) {
                // If you want to convert to a epub, this function will be changed to a generator.
                // yield 'html for one file';
                line = this._buildPageBreak();

            } else if (paragraph.horizontalRule) {
                line = '<hr/>';

            } else {

                // if paragraph is empty
                if (line.length === 0) {
                    line = '<br/>';
                }

                // headline
                if (paragraph.outlineLv > 0) {
                    if (paragraph.outlineLv <= 6) {
                        tag = `h${paragraph.outlineLv}`;
                    } else {
                        tag = 'h6';
                    }
                }
            }

            // class
            classList = classList.concat(this._buildParagraphClass(paragraph));
            classList = classList.concat(this._buildParagraphClassIndent(paragraph));
            classList = classList.concat(this._buildParagraphStyle(paragraph));
            
            // build paragraph
            if (idList.length > 0) {
                idStr = ` id="${idList.join(' ')}"`;
            }
            if (classList.length > 0) {
                classStr = ` class="${classList.join(' ')}"`;
            }
            return `<${tag}${idStr}${classStr}>${line}</${tag}>`;
        });

        return lines.filter(line => line.length > 0).join('\n');
    }

    private _buildText(item: parser.ParagraphItemText): string {
        let text: string;
        if (item.plainRuby.length > 0) {
            text = `<ruby>${item.text}<rt>${item.ruby}</rt></ruby>`;
        } else {
            text = item.text;
        }
        return text;
    }

    private _buildPageBreak(): string {
        return '<br/>   ----  Page break ----   <br/><br/>';
    }

    private _buildImage(item: parser.ParagraphItemImage): string {

        if (this._webview && this._parentPath) {
            const srcPath = this._webview.asWebviewUri(
                vscode.Uri.file(path.join(this._parentPath, item.plainPath))
            );
            return `<img alt="" src="${srcPath}"/>`;
        } else {
            // TODO epubのときもパスは調整が必要
            return `<img alt="" src="${item.path}"/>`;
        }
    }

    private _buildParagraphClass(property: parser.ParagraphProperty): string[] {
        let str: string[] = [];

        if (property.pageBreak) {
            return ['align-center'];
        }

        const midashi: string[] = ['', 'oo-midashi', 'naka-midashi', 'ko-midashi', 'ko-midashi', 'ko-midashi', 'ko-midashi'];
        if (property.outlineLv > 0 && property.outlineLv < midashi.length) {
            str.push(midashi[property.outlineLv]);
        } else if (property.outlineLv >= midashi.length) {
            str.push('ko-midashi');
        }

        switch (property.alignment) {
            case parser.AlignmentType.Right:
                str.push('align-right');
                break;
            case parser.AlignmentType.Left:
                str.push('align-left');
                break;
            case parser.AlignmentType.Center:
                str.push('align-center');
                break;
            default:
                break;
        }

        return str.concat(this._buildFontClass(property.font));
    }

    private _buildFontClass(font: parser.FontProperty): string[] {
        let str: string[] = [];
        if (font.sizeRatio !== 100) {
            str.push(`font-${font.sizeRatio}per`);
        }
        if (font.gothic) {
            str.push('gfont');
        }
        return str;
    }

    private _buildParagraphClassIndent(property: parser.ParagraphProperty): string[] {
        let str: string[] = [];

        if (property.indent.left > 0) {
            if (property.indent.left <= 10){
                str.push(`start-${property.indent.left}em`);
            }else{
                str.push('start-10em');
            }
        }
        if (property.indent.right > 0) {
            if (property.indent.right <= 10){
                str.push(`end-${property.indent.right}em`);
            }else{
                str.push('end-10em');
            }
        }
        return str;
    }

    private _buildParagraphStyle(property: parser.ParagraphProperty): string[] {
        let str: string[] = [];

        if (property.border.top || property.border.right || property.border.bottom || property.border.left) {
            let bit: string[] = [];
            if (this.textFlowDirection === builder.TextFlowDirection.Vertical) {
                if (property.border.left) {
                    bit.push('1');
                } else {
                    bit.push('0');
                }
                if (property.border.top) {
                    bit.push('1');
                } else {
                    bit.push('0');
                }
                if (property.border.right) {
                    bit.push('1');
                } else {
                    bit.push('0');
                }
                if (property.border.bottom) {
                    bit.push('1');
                } else {
                    bit.push('0');
                }
            } else {
                if (property.border.top) {
                    bit.push('1');
                } else {
                    bit.push('0');
                }
                if (property.border.right) {
                    bit.push('1');
                } else {
                    bit.push('0');
                }
                if (property.border.bottom) {
                    bit.push('1');
                } else {
                    bit.push('0');
                }
                if (property.border.left) {
                    bit.push('1');
                } else {
                    bit.push('0');
                }
            }
            str.push(`border-${bit.join('')}`);
        }

        return str;
    }

}