
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

export interface FontProperty {
    sizeRatio: number       //基本サイズに対する倍率(%)
    gothic: boolean         //ゴシック?
    bold: boolean           //太字
    emLine: boolean         //横：下線、縦：右線
    italic: boolean         //斜体
    strike: boolean         //取り消し線
    em: EmphasisMarkType    //圏点（文字の強調の点）
};

export interface ParagraphProperty {
    outlineLv: number   //0:body, 1:h1, 2:h2, ... , 9:h9
    pageBreak: boolean
    horizontalRule: boolean
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
        public text: string,
        public ruby: string
    ) {
        super(ParagraphItemType.Text);
    }
}

export class ParagraphItemImage extends ParagraphItem {
    constructor(
        public path: string,
        public alt: string
    ) {
        super(ParagraphItemType.Image);
    }
}

export class Paragraph implements ParagraphProperty {
    public items: ParagraphItem[] = [];

    public outlineLv = 0;       //0:body, 1:h1, 2:h2, ... , 9:h9
    public pageBreak = false;
    public horizontalRule = false;
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
