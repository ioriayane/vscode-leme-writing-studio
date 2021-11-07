
export enum ParagraphItemType {
    Text,
    PageBreak,
    Image,
    Multimedia,
    HyperLink,
    HorizontalRule,
}

export abstract class ParagraphItem {
    constructor(
        public readonly type: ParagraphItemType
    ) { }
}

export class ParagraphItemText extends ParagraphItem {
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

export class Paragraph {
    public items: ParagraphItem[] = [];

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
