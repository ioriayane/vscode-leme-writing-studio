import * as parser from './index';
import * as book from '../book';

export enum BorderState {
    none,
    start,
    inner,
    // End,
}

export enum TextFormatType {
    tcy, //縦中横
    bold,
    italic,
    emMarkDot, //丸
    emMarkDot2, //丸の記法違い
    emMarkComma //ごま
}

export class TextParser {
    constructor(
        private readonly _textSetting: book.TextSetting
    ) { }

    //ひらがな:http://www.unicode.org/charts/PDF/U3040.pdf
    //カタカナ:http://www.unicode.org/charts/PDF/U30A0.pdf
    //      http://www.unicode.org/charts/PDF/U31F0.pdf
    private readonly regKANA = '[\u3041-\u309f\u30fc\u30a0\u30a0-\u30ff\u31f0-\u31ff\u3099-\u309c\uff65-\uff9f]';
    // CJK統合漢字:http://www.unicode.org/charts/PDF/U4E00.pdf
    // CJK互換漢字:http://www.unicode.org/charts/PDF/UF900.pdf
    // CJK統合漢字拡張A:http://www.unicode.org/charts/PDF/U3400.pdf
    // CJK統合漢字拡張B(JIS X 0213の漢字)は省略！（なろうも対応していないっぽいし）
    //〻:303b, 々:3005, 〆:3006, 〇:3007, ヶ:30f6,( 仝:4edd すでに含まれてる）
    private readonly regKANJI = '[\u4e00-\u9fcf\uf900-\ufaff\u3400-\u4dbf\u3005-\u3007\u303b\u30f6]';
    private readonly regALPHABET = '[a-zA-Z]';
    //《》()を省く[^《》（）｜\\(\\)\\|]
    private readonly regAnyCHARS = '[^\u300a\u300b\uff08\uff09\uff5c\\(\\)\\|]';
    private readonly regRubyBeginSymbol1 = '\u300a';        //《
    private readonly regRubyEendSymbol1 = '\u300b';          //》
    private readonly regRubyBeginSymbol2 = '[\uff08\\(]';   //丸括弧
    private readonly regRubyEndSymbol2 = '[\uff09\\)]';     //丸括弧
    private readonly regRubySymbol = '[\uff5c\\|]';           //縦棒


    private _indentState = false;
    private _indentCommand: parser.IndentProperty = {
        left: 0,
        right: 0
    };
    private _borderState: BorderState = BorderState.none;
    private _borderCommand: parser.BorderProperty = {
        top: false,
        left: false,
        right: false,
        bottom: false,
        inner: false
    };


    public parse(text: string): parser.Paragraph[] {
        this._indentState = false;
        this._borderState = BorderState.none;

        const lines = text.split('\n');
        const document: parser.Paragraph[] = lines.map((line, index, array) => {
            const para = new parser.Paragraph();
            let items: parser.ParagraphItem[] = [];

            // remove only line feed character
            line = line.trimRight();

            //// Block format

            if (this._parseIndent(line, para)) {
                para.empty = true;
                return para;
            } else if (this._parseBorder(line, para, index, array)) {
                para.empty = true;
                return para;
            } else if (this._parsePageBreak(line)) {
                para.pageBreak = true;
                return para;
            } else if (this._parseHorizontalRule(line)) {
                para.horizontalRule = true;
                return para;
            } else if (this._checkEraceConsecutiveBlankLine(line, index, array)) {
                para.empty = true;
                return para;
            }

            line = this._parseOutline(line, para, index);

            line = this._parseAlignment(line, para, parser.AlignmentType.right);
            if (para.alignment === parser.AlignmentType.none) {
                line = this._parseAlignment(line, para, parser.AlignmentType.left);
                if (para.alignment === parser.AlignmentType.none) {
                    line = this._parseAlignment(line, para, parser.AlignmentType.center);
                }
            }


            //// Span format

            // initial state
            items.push(new parser.ParagraphItemText(line, ''));

            items = this._parseImage(items);
            items = this._parserRuby(items);
            items = this._parseTextFormat(items, TextFormatType.tcy);
            items = this._parseTextFormat(items, TextFormatType.bold);
            items = this._parseTextFormat(items, TextFormatType.italic);
            items = this._parseTextFormat(items, TextFormatType.emMarkComma);
            items = this._parseTextFormat(items, TextFormatType.emMarkDot);
            items = this._parseTextFormat(items, TextFormatType.emMarkDot2);

            para.items = items;
            return para;
        });

        return document;
    }

    private _checkEraceConsecutiveBlankLine(line: string, index: number, lines: string[]) {
        // No.1 ------------
        // line                line                line
        // <blank>  remove     <blank>  remove     <blank>  remove
        // line                <blank>  stay       <blank>  remove
        //                     line                <blank>  stay
        //                                         line
        // No.2 ------------
        // line                line                line
        // <blank>  stay       <blank>  remove     <blank>  remove
        // Headline            <blank>  stay       <blank>  remove
        //                     Headline            <blank>  stay
        //                                         Headline
        // No.3 ------------
        // Headline            Headline            Headline
        // <blank>  stay       <blank>  remove     <blank>  remove
        // line                <blank>  stay       <blank>  remove
        //                     line                <blank>  stay
        //                                         line
        // No.4 ------------
        // <BOF>               <BOF>               <BOF>
        // <blank>  remove     <blank>  remove     <blank>  remove
        // line                <blank>  stay       <blank>  remove
        //                     line                <blank>  stay
        //                                         line
        // No.5 ------------
        // <BOF>               <BOF>               <BOF>
        // <blank>  stay       <blank>  remove     <blank>  remove
        // Headline            <blank>  stay       <blank>  remove
        //                     Headline            <blank>  stay
        //                                         Headline

        if (!this._textSetting.eraceConsecutiveBlankLine) {
            return false;
        }

        // 1. remove when next line is blank.
        // 2. stay when previus line is blank.
        // 3. stay when when previus or next line is headline.
        if (line.length > 0) {
            return false;
        }

        let prevLine: string;
        let nextLine: string;
        if (index === 0) {
            prevLine = '<BOF>';
        } else {
            prevLine = lines[index - 1];
        }
        if ((index + 1) < lines.length) {
            nextLine = lines[index + 1];
        } else {
            nextLine = '';
        }
        if (nextLine.length === 0) {
            return true;
        } else if (prevLine.length === 0) {
            return false;
        } else {
            const para = new parser.Paragraph();
            this._parseOutline(prevLine, para, index - 1);
            if (para.outlineLv > 0) {
                return false;
            }
            para.outlineLv = 0;
            this._parseOutline(nextLine, para, index + 1);
            if (para.outlineLv > 0) {
                return false;
            } else {
                return true;
            }
        }
    }

    private _parseIndent(line: string, property: parser.ParagraphProperty): boolean {
        const reg = /^[!\uff01][I\uff29]([0-9\uff10-\uff19]+[,\uff0c][0-9\uff10-\uff19]+)?$/u;
        const m = line.trim().match(reg);
        if (!m) {
            if (!this._indentState) {
                // out of indent area
                this._indentCommand.left = 0;
                this._indentCommand.right = 0;
                property.indent.left = 0;
                property.indent.right = 0;
            } else {
                const para = new parser.Paragraph();
                this._parseOutline(line, para, 1);
                if (para.outlineLv > 0) {
                    // force 0 when outline
                    property.indent.left = 0;
                    property.indent.right = 0;
                } else {
                    // continuous
                    property.indent.left = this._indentCommand.left;
                    property.indent.right = this._indentCommand.right;
                }
            }
            return false;
        } else if (m[0].length === 2) {
            // end command
            this._indentState = false;
            this._indentCommand.left = 0;
            this._indentCommand.right = 0;
            property.indent.left = 0;
            property.indent.right = 0;
            return true;
        } else {
            // start command
            const commandItems = m[0].substring(2, m[0].length).split(/[,\uff0c]/u);

            if (commandItems.length !== 2) {
                return false;
            } else {
                this._indentCommand.left = parseInt(commandItems[0]);
                this._indentCommand.right = parseInt(commandItems[1]);
                if (this._indentCommand.left === this._indentCommand.right && this._indentCommand.left === 0) {
                    this._indentState = false;
                } else {
                    this._indentState = true;
                }
                property.indent.left = this._indentCommand.left;
                property.indent.right = this._indentCommand.right;
                return true;
            }
        }
    }

    private _parseBorder(line: string, property: parser.ParagraphProperty, index: number, lines: string[]): boolean {
        const reg = /^[!\uff01][B\uff22][D\uff24]([,\uff0c][TBLRH\uff34\uff22\uff2c\uff32\uff28]+)?$/u;
        const m = line.trim().match(reg);
        if (!m) {
            if (this._borderState === BorderState.none) {
                // out of border area
                this._borderCommand.top = false;
                this._borderCommand.bottom = false;
                this._borderCommand.left = false;
                this._borderCommand.right = false;
                this._borderCommand.inner = false;
            } else {
                let nextIsEnd = false;
                if (index + 1 < lines.length) {
                    if (lines[index + 1].trim().match(reg)) {
                        // next is end command
                        nextIsEnd = true;
                    }
                } else {
                    nextIsEnd = true;
                }
                switch (this._borderState) {
                    case BorderState.start:
                        if (nextIsEnd) {
                            // only one paragraph
                            property.border.top = this._borderCommand.top;
                            property.border.bottom = this._borderCommand.bottom;
                        } else {
                            // first paragraph
                            property.border.top = this._borderCommand.top;
                            property.border.bottom = this._borderCommand.inner;
                            this._borderState = BorderState.inner;
                        }
                        break;
                    case BorderState.inner:
                        // 2nd, 3rd, ... paragraph
                        if (nextIsEnd) {
                            // final paragraph
                            // property.border.top = this._borderCommand.inner;
                            property.border.bottom = this._borderCommand.bottom;
                        } else {
                            // inner paragraph
                            // property.border.top = this._borderCommand.inner;
                            property.border.bottom = this._borderCommand.inner;
                        }
                        break;
                }
                //left and right is always use command
                property.border.left = this._borderCommand.left;
                property.border.right = this._borderCommand.right;
            }
            return false;

        } else if (this._borderState === BorderState.none) {
            // look up start command
            const commandItems = m[0].split(/[,\uff0c]/u);

            this._borderCommand.top = false;
            this._borderCommand.bottom = false;
            this._borderCommand.left = false;
            this._borderCommand.right = false;
            this._borderCommand.inner = false;
            if (commandItems.length !== 2) {
                // end
                return false;
            }

            this._borderState = BorderState.start;
            if (commandItems[1].match(/[T\uff34]/u)) {
                this._borderCommand.top = true;
            }
            if (commandItems[1].match(/[B\uff22]/u)) {
                this._borderCommand.bottom = true;
            }
            if (commandItems[1].match(/[L\uff2c]/u)) {
                this._borderCommand.left = true;
            }
            if (commandItems[1].match(/[R\uff32]/u)) {
                this._borderCommand.right = true;
            }
            if (commandItems[1].match(/[H\uff28]/u)) {
                this._borderCommand.inner = true;
            }
            return true;

        } else {
            // end command
            this._borderCommand.top = false;
            this._borderCommand.bottom = false;
            this._borderCommand.left = false;
            this._borderCommand.right = false;
            this._borderCommand.inner = false;
            this._borderState = BorderState.none;
            return true;
        }
    }

    private _parsePageBreak(line: string): boolean {
        const m = line.trim().match(/^[!\uff01][P\uff30][B\uff22]$/u);
        if (!m) {
            return false;
        } else {
            return true;
        }
    }

    private _parseHorizontalRule(line: string): boolean {
        const m = line.trim().match(/^[!\uff01][H\uff28][R\uff32]$/u);
        if (!m) {
            return false;
        } else {
            return true;
        }
    }

    private _parseOutline(line: string, property: parser.ParagraphProperty, index: number): string {
        const m = line.match(/^[#\uff03]{1,9}[ \u3000]/u);
        if (!m) {
            // body
            if (index === 0 && line.length > 0) {
                //最初の行で、空行じゃないので見出しにする
                property.outlineLv = 1;
                property.font.gothic = true;
                property.font.sizeRatio = 140;
            }
            return line;
        }
        property.outlineLv = m[0].trim().length;
        property.font.gothic = true;
        switch (property.outlineLv) {
            case 1:
                property.font.sizeRatio = 140;
                break;
            case 2:
                property.font.sizeRatio = 120;
                break;
            case 3:
                property.font.sizeRatio = 110;
                break;
            default:
                property.font.sizeRatio = 100;
                break;
        }
        return line.replace(m[0], '');
    }

    private _parseAlignment(line: string, property: parser.ParagraphProperty, align: parser.AlignmentType): string {
        let reg: RegExp;

        if (align === parser.AlignmentType.right) {
            reg = /^[ \u3000]*[!\uff01][R\uff32B\uff22][ \u3000]/u;
        } else if (align === parser.AlignmentType.left) {
            reg = /^[ \u3000]*[!\uff01][L\uff2cT\uff34][ \u3000]/u;
        } else if (align === parser.AlignmentType.center) {
            reg = /^[ \u3000]*[!\uff01][C\uff23][ \u3000]/u;
        } else {
            return line;
        }

        const m = line.match(reg);
        if (!m) {
            return line;
        }

        property.alignment = align;

        return line.replace(m[0], '');
    }

    private _parseContent(items: parser.ParagraphItem[], reg: RegExp,
        callback: (m: string, retItems: parser.ParagraphItem[]) => void) {

        const retItems: parser.ParagraphItem[] = [];

        items.forEach((item) => {
            if (item.type !== parser.ParagraphItemType.text) {
                retItems.push(item);
                return;
            } else if ((item as parser.ParagraphItemText).plainRuby.length > 0) {
                retItems.push(item);
                return;
            }

            const m = (item as parser.ParagraphItemText).plainText.match(reg);
            if (!m) {
                retItems.push(item);
                return;
            }
            const splitItems = (item as parser.ParagraphItemText).plainText.split(reg);
            for (let i = 0; i < splitItems.length; i++) {
                retItems.push(new parser.ParagraphItemText(splitItems[i], ''));
                if (i < m.length) {
                    callback(m[i], retItems);
                }
            }
        });
        return retItems;
    }

    private _parseImage(items: parser.ParagraphItem[]): parser.ParagraphItem[] {
        return this._parseContent(items, /[!\uff01][[\uff3b][^[\]\uff3b\uff3d(\uff08]*[\]\uff3d][\uff08(][^\uff09)]*[\uff09)]/gu,
            (m, retItems) => {
                const splitImageSyntax = m.split(/[\]\uff3d][\uff08(]/u);
                retItems.push(new parser.ParagraphItemImage(splitImageSyntax[1].slice(0, -1), ''));
            });
    }

    private _parserRuby(items: parser.ParagraphItem[]): parser.ParagraphItem[] {
        //|と()は、半角全角両方
        const s1 = this.regRubyBeginSymbol1;
        const s2 = this.regRubyEendSymbol1;
        const s3 = this.regRubyBeginSymbol2;
        const s4 = this.regRubyEndSymbol2;
        const s5 = this.regRubySymbol;
        const s6 = this.regAnyCHARS;
        const s7 = this.regKANJI;
        const s8 = this.regKANA;
        const s9 = this.regALPHABET;

        const regRuby = [
            `${s5}${s6}*${s1}${s6}+${s2}`,      //|任意《任意》
            `${s5}${s6}*${s3}${s6}+${s4}`,      //|任意(任意)
            `${s7}+${s1}${s8}+${s2}`,           //漢字《任意》 説明的には←なのだけど、実際の挙動は、漢字《ひらがなorカタカナ》
            `${s7}+${s3}${s8}+${s4}`,           //漢字(ひらがなorカタカナ)
            `${s9}+${s1}${s8}+${s2}`,          //アルファベット《ひらがなorカタカナ》
            `${s9}+${s3}${s8}+${s4}`           //アルファベット(ひらがなorカタカナ)
        ];

        const reg2 = new RegExp(`${s1}|${s3}`, 'gu');

        regRuby.forEach((reg) => {
            items = this._parseContent(items, new RegExp(reg, 'gu'),
                (m, retItems) => {
                    let captured = m;
                    if (captured.startsWith('|') || captured.startsWith('｜')) {
                        captured = captured.substring(1, captured.length);
                    }
                    const m2 = captured.split(reg2);
                    if (!m2) {
                        retItems.push(new parser.ParagraphItemText(m, ''));
                    } else if (m2[0].length === 0) {
                        // |(かんじ)のルビ取り消し状態は頭の|はいらない
                        retItems.push(new parser.ParagraphItemText(captured, ''));
                    } else {
                        retItems.push(new parser.ParagraphItemText(m2[0], m2[1].slice(0, -1)));
                    }
                });
        });

        return items;
    }

    // Caution
    // Keep the order of calling
    //   bold -> italic
    //   emMarkComma -> emMarkDot
    private _parseTextFormat(items: parser.ParagraphItem[], type: TextFormatType): parser.ParagraphItem[] {
        let left: string;
        let right: string;
        let symbolLen: number;
        switch (type) {
            case TextFormatType.tcy:
                left = '\\^';
                right = '\\^';
                symbolLen = 1;
                break;
            case TextFormatType.bold:
                left = '\\*\\*';
                right = '\\*\\*';
                symbolLen = 2;
                break;
            case TextFormatType.italic:
                left = '\\*';
                right = '\\*';
                symbolLen = 1;
                break;
            case TextFormatType.emMarkDot:
                left = '\\+';
                right = '\\+';
                symbolLen = 1;
                break;
            case TextFormatType.emMarkDot2:
                left = '\u300a\u300a';
                right = '\u300b\u300b';
                symbolLen = 2;
                break;
            case TextFormatType.emMarkComma:
                left = '\\+\\+';
                right = '\\+\\+';
                symbolLen = 2;
                break;
            default:
                return items;
        }
        return this._parseContent(items, new RegExp(`${left}[^ ^\u3000]+?${right}`, 'gu'),
            (m, retItems) => {
                const para = new parser.ParagraphItemText(m.substring(symbolLen, m.length - symbolLen), '');
                switch (type) {
                    case TextFormatType.tcy:
                        para.font.tcy = true;
                        break;
                    case TextFormatType.bold:
                        para.font.bold = true;
                        break;
                    case TextFormatType.italic:
                        para.font.italic = true;
                        break;
                    case TextFormatType.emMarkDot:
                    case TextFormatType.emMarkDot2:
                        para.font.em = parser.EmphasisMarkType.dot;
                        break;
                    case TextFormatType.emMarkComma:
                        para.font.em = parser.EmphasisMarkType.comma;
                        break;
                    default:
                        break;
                }
                retItems.push(para);
            });
    }
}
