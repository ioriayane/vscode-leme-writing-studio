import * as parser from './index';
import { ParagraphItem } from './paragraph';


export enum BorderState {
    None,
    Start,
    Inner,
    // End,
}

export class TextParser {
    //ひらがな:http://www.unicode.org/charts/PDF/U3040.pdf
    //カタカナ:http://www.unicode.org/charts/PDF/U30A0.pdf
    //      http://www.unicode.org/charts/PDF/U31F0.pdf
    private readonly REG_KANA = '[\u3041-\u309f\u30fc\u30a0\u30a0-\u30ff\u31f0-\u31ff\u3099-\u309c\uff65-\uff9f]';
    // CJK統合漢字:http://www.unicode.org/charts/PDF/U4E00.pdf
    // CJK互換漢字:http://www.unicode.org/charts/PDF/UF900.pdf
    // CJK統合漢字拡張A:http://www.unicode.org/charts/PDF/U3400.pdf
    // CJK統合漢字拡張B(JIS X 0213の漢字)は省略！（なろうも対応していないっぽいし）
    //〻:303b, 々:3005, 〆:3006, 〇:3007, ヶ:30f6,( 仝:4edd すでに含まれてる）
    private readonly REG_KANJI = '[\u4e00-\u9fcf\uf900-\ufaff\u3400-\u4dbf\u3005-\u3007\u303b\u30f6]';
    private readonly REG_ALPHABET = '[a-zA-Z]';
    //《》()を省く[^《》（）｜\\(\\)\\|]
    private readonly REG_ANY_CHARS = '[^\u300a\u300b\uff08\uff09\uff5c\\(\\)\\|]';
    private readonly RUBY_BEGIN_SYMBOL_1 = '\u300a';        //《
    private readonly RUBY_END_SIMBOL_1 = '\u300b';          //》
    private readonly RUBY_BEGIN_SYMBOL_2 = '[\uff08\\(]';   //丸括弧
    private readonly RUBY_END_SYMBOL_2 = '[\uff09\\)]';     //丸括弧
    private readonly RUBY_SYMBOL = '[\uff5c\\|]';           //縦棒


    private _borderState: BorderState = BorderState.None;
    private _borderCommand: parser.BorderProperty = {
        top: false,
        left: false,
        right: false,
        bottom: false,
        inner: false
    };


    public parse(text: string): parser.Paragraph[] {

        let lines = text.split('\n');
        let document: parser.Paragraph[] = lines.map((line, index, array) => {
            let para = new parser.Paragraph();
            let items: parser.ParagraphItem[] = [];

            //// Block format

            if (this._parseBorder(line, para, index, array)) {
                para.empty = true;
                return para;
            } else if (this._parsePageBreak(line)) {
                para.pageBreak = true;
                return para;
            } else if (this._parseHorizontalRule(line)) {
                para.horizontalRule = true;
                return para;
            }


            line = this._parseOutline(line, para, index);

            line = this._parseAlignment(line, para, parser.AlignmentType.Right);
            if (para.alignment === parser.AlignmentType.None) {
                line = this._parseAlignment(line, para, parser.AlignmentType.Left);
                if (para.alignment === parser.AlignmentType.None) {
                    line = this._parseAlignment(line, para, parser.AlignmentType.Center);
                }
            }


            //// Span format

            // initial state
            items.push(new parser.ParagraphItemText(line, ''));

            items = this._parseImage(items);
            items = this._parserRuby(items);


            para.items = items;
            return para;
        });

        return document;
    }

    private _parseBorder(line: string, property: parser.ParagraphProperty, index: number, lines: string[]): boolean {
        const reg = /^[\\!\uff01][B\uff22][D\uff24]([,\uff0c][TBLRH\uff34\uff22\uff2c\uff32\uff28]+)?$/u;
        const m = line.trim().match(reg);
        if (!m) {
            if (this._borderState === BorderState.None) {
                // out of border area
            } else {
                let nextIsEnd: boolean = false;
                if (index + 1 < lines.length) {
                    if (lines[index + 1].trim().match(reg)) {
                        // next is end command
                        nextIsEnd = true;
                    }
                } else {
                    nextIsEnd = true;
                }
                switch (this._borderState) {
                    case BorderState.Start:
                        if (nextIsEnd) {
                            // only one paragraph
                            property.border.top = this._borderCommand.top;
                            property.border.bottom = this._borderCommand.bottom;
                        } else {
                            // first paragraph
                            property.border.top = this._borderCommand.top;
                            property.border.bottom = this._borderCommand.inner;
                            this._borderState = BorderState.Inner;
                        }
                        break;
                    case BorderState.Inner:
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

        } else if (this._borderState === BorderState.None) {
            // look up start command
            let commandItems = m[0].split(/[,\uff0c]/u);
            if (commandItems.length !== 2) {
                // end
                return false;
            }
            this._borderCommand.top = false;
            this._borderCommand.bottom = false;
            this._borderCommand.left = false;
            this._borderCommand.right = false;
            this._borderCommand.inner = false;

            this._borderState = BorderState.Start;
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
            this._borderState = BorderState.None;
            return true;
        }
    };

    private _parsePageBreak(line: string): boolean {
        const m = line.trim().match(/^[\\!\uff01][P\uff30][B\uff22]$/u);
        if (!m) {
            return false;
        } else {
            return true;
        }
    }

    private _parseHorizontalRule(line: string): boolean {
        const m = line.trim().match(/^[\\!\uff01][H\uff28][R\uff32]$/u);
        if (!m) {
            return false;
        } else {
            return true;
        }
    }

    private _parseOutline(line: string, property: parser.ParagraphProperty, index: number): string {
        const m = line.match(/^[#＃]{1,9}[ 　]/);
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

        if (align === parser.AlignmentType.Right) {
            reg = /^[ \u3000]*[\\!\uff01][R\uff32B\uff22][ \u3000]/u;
        } else if (align === parser.AlignmentType.Left) {
            reg = /^[ \u3000]*[\\!\uff01][L\uff2cT\uff34][ \u3000]/u;
        } else if (align === parser.AlignmentType.Center) {
            reg = /^[ \u3000]*[\\!\uff01][C\uff23][ \u3000]/u;
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
        callback: (m: string, retItems: parser.ParagraphItem[]) => any) {

        let retItems: parser.ParagraphItem[] = [];

        items.forEach((item, index) => {
            if (item.type !== parser.ParagraphItemType.Text) {
                retItems.push(item);
                return;
            } else if ((item as parser.ParagraphItemText).plainRuby.length > 0) {
                retItems.push(item);
                return;
            }

            let m = (item as parser.ParagraphItemText).plainText.match(reg);
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
    };

    private _parseImage(items: parser.ParagraphItem[]): parser.ParagraphItem[] {
        return this._parseContent(items, /[!！][\[［][^\[\]［］\(（]*[\]］][（\(][^）\)]*[）\)]/g,
            (m, retItems) => {
                const splitImageSyntax = m.split(/[\]］][（\(]/);
                retItems.push(new parser.ParagraphItemImage(splitImageSyntax[1].slice(0, -1), ''));
            });
    }

    private _parserRuby(items: parser.ParagraphItem[]): parser.ParagraphItem[] {
        //|と()は、半角全角両方
        const s1 = this.RUBY_BEGIN_SYMBOL_1;
        const s2 = this.RUBY_END_SIMBOL_1;
        const s3 = this.RUBY_BEGIN_SYMBOL_2;
        const s4 = this.RUBY_END_SYMBOL_2;
        const s5 = this.RUBY_SYMBOL;
        const s6 = this.REG_ANY_CHARS;
        const s7 = this.REG_KANJI;
        const s8 = this.REG_KANA;
        const s9 = this.REG_ALPHABET;

        const regRuby = [
            `${s5}${s6}*${s1}${s6}+${s2}`,      //|任意《任意》
            `${s5}${s6}*${s3}${s6}+${s4}`,      //|任意(任意)
            `${s7}+${s1}${s8}+${s2}`,           //漢字《任意》 説明的には←なのだけど、実際の挙動は、漢字《ひらがなorカタカナ》
            `${s7}+${s3}${s8}+${s4}`,           //漢字(ひらがなorカタカナ)
            `${s9}+${s1}${s8}+${s2}`,          //アルファベット《ひらがなorカタカナ》
            `${s9}+${s3}${s8}+${s4}`           //アルファベット(ひらがなorカタカナ)
        ];

        const reg2 = new RegExp(`${s1}|${s3}`, 'gu');

        regRuby.forEach((reg, index) => {
            items = this._parseContent(items, new RegExp(reg, 'gu'),
                (m, retItems) => {
                    let captured = m;
                    if (captured.startsWith('|') || captured.startsWith('｜')) {
                        captured = captured.substring(1, captured.length);
                    }
                    let m2 = captured.split(reg2);
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
}
