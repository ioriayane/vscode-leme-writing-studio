import * as vscode from 'vscode';
import * as path from 'path';
import * as parser from '../parser/index';

export class HtmlBuilder {

    constructor(
        private readonly _webview: vscode.Webview | undefined,
        private readonly _parentPath: string | undefined
    ) {
    }

    public build(document: parser.Paragraph[], cursorLine = -1): string {

        const lines = document.map((paragraph, index) => {
            if (paragraph.empty) {
                return '';
            }

            const lineItems: string[] = paragraph.items.map(item => {
                switch (item.type) {
                    case parser.ParagraphItemType.text:
                        return this._buildText(item as parser.ParagraphItemText);
                    case parser.ParagraphItemType.image:
                        return this._buildImage(item as parser.ParagraphItemImage);
                    case parser.ParagraphItemType.multimedia:
                        return '';
                    default:
                        return '';
                }
            });

            let tag = 'p';
            const idList: string[] = [];
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
            classList = classList.concat(this._buildParagraphClassBorder(paragraph));

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
        const classList = this._buildFontClass(item.font);
        if (classList.length > 0) {
            return `<span class="${classList.join(' ')}">${text}</span>`;
        } else {
            return text;
        }
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
        const str: string[] = [];

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
            case parser.AlignmentType.right:
                str.push('align-right');
                break;
            case parser.AlignmentType.left:
                str.push('align-left');
                break;
            case parser.AlignmentType.center:
                str.push('align-center');
                break;
            default:
                break;
        }

        return str.concat(this._buildFontClass(property.font));
    }

    private _buildFontClass(font: parser.FontProperty): string[] {
        const str: string[] = [];
        if (font.sizeRatio !== 100) {
            str.push(`font-${font.sizeRatio}per`);
        }
        if (font.gothic) {
            str.push('gfont');
        }
        if (font.bold) {
            str.push('bold');
        }
        if (font.italic) {
            str.push('italic');
        }
        if (font.em === parser.EmphasisMarkType.dot) {
            str.push('em-dot');
        } else if (font.em === parser.EmphasisMarkType.comma) {
            str.push('em-sesame');
        }
        if (font.tcy) {
            str.push('tcy');
        }
        return str;
    }

    private _buildParagraphClassIndent(property: parser.ParagraphProperty): string[] {
        const str: string[] = [];

        if (property.indent.left > 0) {
            if (property.indent.left <= 10) {
                str.push(`start-${property.indent.left}em`);
            } else {
                str.push('start-10em');
            }
        }
        if (property.indent.right > 0) {
            if (property.indent.right <= 10) {
                str.push(`end-${property.indent.right}em`);
            } else {
                str.push('end-10em');
            }
        }
        return str;
    }

    private _buildParagraphClassBorder(property: parser.ParagraphProperty): string[] {
        const str: string[] = [];

        if (property.border.top || property.border.right || property.border.bottom || property.border.left) {
            const bit: string[] = [];
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
            str.push(`border-${bit.join('')}`);
        }

        return str;
    }

}