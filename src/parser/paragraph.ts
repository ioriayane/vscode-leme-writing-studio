
export enum ParagraphItemType {
    Text,
    Image,
    Multimedia,
    HyperLink,
}

export enum EmphasisMarkType {
    None,
    // Circle,
    Comma,
    Dot,
    // UnderDot,
}

export enum AlignmentType {
    None,
    Left,
    Center,
    Right,
    // Distribute, //均等
}

export interface FontProperty {
    sizeRatio: number       //基本サイズに対する倍率(%)
    gothic: boolean         //ゴシック?
    bold: boolean           //太字
    emLine: boolean         //横：下線、縦：右線
    italic: boolean         //斜体
    strike: boolean         //取り消し線
    em: EmphasisMarkType    //圏点（文字の強調の点）
};

export interface BorderProperty {
    top: boolean    // right when vertical
    left: boolean   // top when vertical
    right: boolean  // bottom when vertical
    bottom: boolean // left when vertical
    inner: boolean
};

export interface ParagraphProperty {
    outlineLv: number   //0:body, 1:h1, 2:h2, ... , 9:h9
    pageBreak: boolean
    horizontalRule: boolean
    alignment: AlignmentType
    border: BorderProperty
    font: FontProperty
}

export abstract class ParagraphItem {
    constructor(
        public readonly type: ParagraphItemType
    ) { }
}

export class ParagraphItemText extends ParagraphItem {
    public font: FontProperty = {
        sizeRatio: 100,
        gothic: false,
        bold: false,
        emLine: false,
        italic: false,
        strike: false,
        em: EmphasisMarkType.None
    };

    constructor(
        private _text: string,
        private _ruby: string
    ) {
        super(ParagraphItemType.Text);
    }

    get plainText(): string {
        return this._text;
    }

    get plainRuby(): string {
        return this._ruby;
    }

    private _encode(t: string): string {
        return t.replace('&', '&amp;').replace('<', '&lt;').replace(String.fromCodePoint(0xd), '&#xd').replace(String.fromCodePoint(0x0), '');
    }

    get text(): string {
        return this._encode(this._text);
    }

    get ruby(): string {
        return this._encode(this._ruby);
    }
}

export class ParagraphItemImage extends ParagraphItem {
    constructor(
        private _path: string,
        private _alt: string
    ) {
        super(ParagraphItemType.Image);
    }

    get plainPath(): string {
        return this._path;
    }

    get plainAlt(): string {
        return this._alt;
    }

    private _encode(t: string): string {
        return t.replace('&', '&amp;')
            .replace('<', '&lt;')
            .replace(String.fromCodePoint(0x9), '&#x9')
            .replace(String.fromCodePoint(0xa), '&#xa')
            .replace(String.fromCodePoint(0xd), '&#xd')
            .replace(String.fromCodePoint(0x0), '');
    }

    get path(): string {
        return encodeURI(this._path);
    }

    get alt(): string {
        return this._encode(this._alt);
    }
}

export class Paragraph implements ParagraphProperty {
    public empty: boolean = false;
    public items: ParagraphItem[] = [];

    public outlineLv = 0;       //0:body, 1:h1, 2:h2, ... , 9:h9
    public pageBreak = false;
    public horizontalRule = false;
    public alignment = AlignmentType.None;
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
        em: EmphasisMarkType.None
    };

    public pushText(text: string = '', ruby: string = ''): ParagraphItemText {
        let item = new ParagraphItemText(text, ruby);
        this.items.push(item);
        return item;
    }
    public pushImage(path: string = '', alt: string = ''): ParagraphItemImage {
        let item = new ParagraphItemImage(path, alt);
        this.items.push(item);
        return item;
    }
}
