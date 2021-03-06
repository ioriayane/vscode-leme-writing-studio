
export enum ParagraphItemType {
    text,
    image,
    multimedia,
    hyperLink,
}

export enum EmphasisMarkType {
    none,
    // Circle,
    comma,
    dot,
    // UnderDot,
}

export enum AlignmentType {
    none,
    left,
    center,
    right,
    // Distribute, //均等
}

export interface FontProperty {
    sizeRatio: number       //基本サイズに対する倍率(%)
    gothic: boolean         //ゴシック?
    bold: boolean           //太字
    emLine: boolean         //横：下線、縦：右線(not implement)
    italic: boolean         //斜体
    strike: boolean         //取り消し線
    em: EmphasisMarkType    //圏点（文字の強調の点）
    tcy: boolean            //縦中横
}

export interface IndentProperty {
    left: number
    right: number
}

export interface BorderProperty {
    top: boolean    // right when vertical
    left: boolean   // top when vertical
    right: boolean  // bottom when vertical
    bottom: boolean // left when vertical
    inner: boolean
}

export interface ParagraphProperty {
    outlineLv: number   //0:body, 1:h1, 2:h2, ... , 9:h9
    pageBreak: boolean
    horizontalRule: boolean
    alignment: AlignmentType
    indent: IndentProperty
    border: BorderProperty
    font: FontProperty
}

export abstract class ParagraphItem {
    constructor(
        public readonly type: ParagraphItemType
    ) { }
}

export class ParagraphItemText extends ParagraphItem {
    private readonly _regAmp = /&/g;
    private readonly _regLt = /</g;
    private readonly _regCode0d = new RegExp(String.fromCodePoint(0xd), 'g');
    private readonly _regCode00 = new RegExp(String.fromCodePoint(0x0), 'g');

    public font: FontProperty = {
        sizeRatio: 100,
        gothic: false,
        bold: false,
        emLine: false,
        italic: false,
        strike: false,
        em: EmphasisMarkType.none,
        tcy: false
    };

    constructor(
        private _text: string,
        private _ruby: string
    ) {
        super(ParagraphItemType.text);
    }

    get plainText(): string {
        return this._text;
    }

    get plainRuby(): string {
        return this._ruby;
    }

    private _encode(t: string): string {
        return t.replace(this._regAmp, '&amp;')
            .replace(this._regLt, '&lt;')
            .replace(this._regCode0d, '&#xd')
            .replace(this._regCode00, '');
    }

    get text(): string {
        return this._encode(this._text);
    }

    get ruby(): string {
        return this._encode(this._ruby);
    }
}

export class ParagraphItemImage extends ParagraphItem {
    protected readonly _regAmp = /&/g;
    protected readonly _regLt = /</g;
    protected readonly _regCode09 = new RegExp(String.fromCodePoint(0x9), 'g');
    protected readonly _regCode0a = new RegExp(String.fromCodePoint(0xa), 'g');
    protected readonly _regCode0d = new RegExp(String.fromCodePoint(0xd), 'g');
    protected readonly _regCode00 = new RegExp(String.fromCodePoint(0x0), 'g');

    constructor(
        private _path: string,
        private _alt: string,
        type = ParagraphItemType.image
    ) {
        super(type);
    }

    get plainPath(): string {
        return this._path;
    }

    get plainAlt(): string {
        return this._alt;
    }

    private _encode(t: string): string {
        return t.replace(this._regAmp, '&amp;')
            .replace(this._regLt, '&lt;')
            .replace(this._regCode09, '&#x9')
            .replace(this._regCode0a, '&#xa')
            .replace(this._regCode0d, '&#xd')
            .replace(this._regCode00, '');
    }

    get path(): string {
        return encodeURI(this._path);
    }

    get alt(): string {
        return this._encode(this._alt);
    }
}

export class ParagraphItemHyperlink extends ParagraphItemImage {
    constructor(
        private _text: string,
        path: string,
        alt: string
    ) {
        super(path, alt, ParagraphItemType.hyperLink);
    }

    private _encodeText(t: string): string {
        return t.replace(this._regAmp, '&amp;')
            .replace(this._regLt, '&lt;')
            .replace(this._regCode0d, '&#xd')
            .replace(this._regCode00, '');
    }

    get text(): string {
        return this._encodeText(this._text);
    }
}

export class Paragraph implements ParagraphProperty {
    public empty = false;
    public items: ParagraphItem[] = [];

    public outlineLv = 0;       //0:body, 1:h1, 2:h2, ... , 9:h9
    public pageBreak = false;
    public horizontalRule = false;
    public alignment = AlignmentType.none;
    public indent: IndentProperty = {
        left: 0,
        right: 0
    };
    public border: BorderProperty = {
        top: false,
        left: false,
        right: false,
        bottom: false,
        inner: false
    };
    public font: FontProperty = {
        sizeRatio: 100,
        gothic: false,
        bold: false,
        emLine: false,
        italic: false,
        strike: false,
        em: EmphasisMarkType.none,
        tcy: false
    };

    public pushText(text = '', ruby = ''): ParagraphItemText {
        const item = new ParagraphItemText(text, ruby);
        this.items.push(item);
        return item;
    }
    public pushImage(path = '', alt = ''): ParagraphItemImage {
        const item = new ParagraphItemImage(path, alt);
        this.items.push(item);
        return item;
    }

    public text(): string {
        return this.items.map(item => {
            if (item.type === ParagraphItemType.text) {
                return (item as ParagraphItemText).text;
            }else if (item.type === ParagraphItemType.hyperLink) {
                return (item as ParagraphItemHyperlink).text;
            } else {
                return undefined;
            }
        }).filter(value => value !== undefined).join('');
    }
}
