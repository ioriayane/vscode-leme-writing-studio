import * as parser from './index';
import { ParagraphItem } from './paragraph';

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



    public parse(text: string): parser.Paragraph[] {

        let lines = text.split('\n');
        let document: parser.Paragraph[] = lines.map((line, index) => {
            let para = new parser.Paragraph();
            let items: parser.ParagraphItem[] = [];


            if (this._parsePageBreak(line)) {
                para.pageBreak = true;
                return para;
            }


            line = this._parseOutline(line, para, index);

            // initial state
            items.push(new parser.ParagraphItemText(line, ''));

            items = this._parseImage(items);
            items = this._parserRuby(items);


            para.items = items;
            return para;
        });

        return document;
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

    private _parsePageBreak(line: string): boolean {
        const m = line.trim().match(/^[\\!\uff01][P\uff30][B\uff22]$/u);
        if (!m) {
            return false;
        } else {
            return true;
        }
    }

    private _parseContent(items: parser.ParagraphItem[], reg: RegExp,
        callback: (m: string, retItems: parser.ParagraphItem[]) => any) {

        let retItems: parser.ParagraphItem[] = [];

        items.forEach((item, index) => {
            if (item.type !== parser.ParagraphItemType.Text) {
                retItems.push(item);
                return;
            } else if ((item as parser.ParagraphItemText).ruby.length > 0) {
                retItems.push(item);
                return;
            }

            let m = (item as parser.ParagraphItemText).text.match(reg);
            if (!m) {
                retItems.push(item);
                return;
            }
            const splitItems = (item as parser.ParagraphItemText).text.split(reg);
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
