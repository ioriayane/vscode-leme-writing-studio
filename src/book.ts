import { Uri } from 'vscode';
import * as path from 'path';

export enum PageProgressionDirection {
    left = 'left',
    right = 'right'
}

export enum TextFlowDirection {
    vertical = 'vertical',
    horizontal = 'horizontal'
}

export enum BookLanguage {
    afrikaans = 'af',
    arabic = 'ar',
    azerbaijani = 'az',
    belarusian = 'be',
    bulgarian = 'bg',
    bengali = 'bn',
    breton = 'br',
    catalan = 'ca',
    corsican = 'co',
    czech = 'cs',
    welsh = 'cy',
    danish = 'da',
    german = 'de',
    greek = 'el',
    english = 'en',
    spanish = 'es',
    estonian = 'et',
    basque = 'eu',
    persian = 'fa',
    finnish = 'fi',
    faroese = 'fo',
    french = 'fr',
    westernFrisian = 'fy',
    irish = 'ga',
    scottishGaelic = 'gd',
    galician = 'gl',
    gujarati = 'gu',
    manx = 'gv',
    hebrew = 'he',
    hindi = 'hi',
    croatian = 'hr',
    hungarian = 'hu',
    armenian = 'hy',
    indonesian = 'id',
    icelandic = 'is',
    italian = 'it',
    japanese = 'ja',
    georgian = 'ka',
    kazakh = 'kk',
    kannada = 'kn',
    korean = 'ko',
    cornish = 'kw',
    latin = 'la',
    luxembourgish = 'lb',
    lithuanian = 'lt',
    latvian = 'lv',
    macedonian = 'mk',
    malayalam = 'ml',
    marathi = 'mr',
    malay = 'ms',
    maltese = 'mt',
    norwegianBokmal = 'nb',
    nepali = 'ne',
    dutch = 'nl',
    norwegianNynorsk = 'nn',
    norwegian = 'no',
    oriya = 'or',
    punjabi = 'pa',
    polish = 'pl',
    portuguese = 'pt',
    romansh = 'rm',
    romanian = 'ro',
    russian = 'ru',
    sanskrit = 'sa',
    slovak = 'sk',
    slovenian = 'sl',
    albanian = 'sq',
    serbian = 'sr',
    swedish = 'sv',
    swahili = 'sw',
    tamil = 'ta',
    telugu = 'te',
    thai = 'th',
    tswana = 'tn',
    turkish = 'tr',
    tsonga = 'ts',
    tatar = 'tt',
    ukrainian = 'uk',
    urdu = 'ur',
    uzbek = 'uz',
    vietnamese = 'vi',
    xhosa = 'xh',
    chinese = 'zh',
    zulu = 'zu',
}

export enum ImageHandling {
    none = 0,   //そのまま（埋め込み）
    fix = 1,    //固定（表紙、挿絵）
    scroll = 2  //スクロール（口絵） bookwalker only
}

export enum ContentType {
    blank = 0,
    word = 1,
    text = 2,
    image = 3,
    toc = 4,
    unknown = 5,
    pdf = 6,
    markdown = 7,
}

export interface BookInformation {
    creator1: string
    creator1Kana: string
    creator2: string
    creator2Kana: string
    identifier: string
    language: BookLanguage
    publisher: string
    publisherKana: string
    title: string
    titleKana: string
}

export interface BookSpecification {
    allowSpread: boolean
    pageProgressionDirection: PageProgressionDirection
    textFlowDirection: TextFlowDirection
}

export interface BookMaking {
    convertSpaceToEnspace: boolean
    enableHyperLink: boolean
    epubPath: string
}

export interface TextSetting {
    eraseConsecutiveBlankLine: boolean

    firstLineHeading: boolean  // false
    heading: boolean           // false
    align: boolean             // false
    indent: boolean            // false
    border: boolean            // false
    pageBreak: boolean         // false
    horizontalRule: boolean    // false // hr
    rubyAngle: boolean         // false //二重山括弧
    rubyParen: boolean         // false //丸括弧
    tcy: boolean               // false
    bold: boolean              // false
    italic: boolean            // false
    emMarkDot: boolean         // false //傍点 +文字+
    emMarkDot2: boolean        // false //傍点の記法違い 《《文字》》
    emMarkComma: boolean       // false
    image: boolean             // false

    advanceMode: boolean       // false //細かい書式をMarkdown方式にする
}

export interface MarkdownSetting {
    pageBreakBeforeH1: boolean  // true;
    convertCrlfToBr: boolean    // true  //改行を<br/>に変換（1行の中では処理しない）
    oneLine: boolean            // false // 1行モード（行頭と行末のスペースをはぶかない）
    backSlashEscape: boolean    // false //バックスラッシュエスケープ
    rubyCurly: boolean          // true  //ルビ {任意|任意}, {任意|任|意}
    rubyAngle: boolean          // true  //ルビ  |任意《任意》
    rubyParen: boolean          // true  //ルビ  |任意(任意)
    emMarkDot: boolean          // false //傍点   +word+
    emMarkDot2: boolean         // false //傍点   《《word》》
    emMarkComma: boolean        // false //傍点（ゴマ） ++word++
    tcy: boolean                // true  //縦中横 ^word^
    bold1: boolean              // false //太字 **word**
    bold2: boolean              // false //太字 __word__
    italic1: boolean            // false //斜体 *word*
    italic2: boolean            // false //斜体 _word_
    strike: boolean             // false //取り消し ~word~
    link: boolean               // false //リンク [テキスト](/url)  , 画像 ![alt](/uri "title")
    code: boolean               // false //コード `word`
    rawHtml: boolean            // false // HTMLタグ
}

export interface ContentItem {
    cover: boolean,
    firstPagePosition: number,
    headingLevel: number,
    headingText: string,
    imageHandling: number,
    path: string,
    tocHeadingLevel: number,
    type: ContentType
}

export function defaultValueBookInformation(): BookInformation {
    return {
        creator1: '',
        creator1Kana: '',
        creator2: '',
        creator2Kana: '',
        identifier: '',
        language: BookLanguage.japanese,
        publisher: '',
        publisherKana: '',
        title: '',
        titleKana: ''
    };
}

export function defaultValueBookSpecification(): BookSpecification {
    return {
        allowSpread: false,
        pageProgressionDirection: PageProgressionDirection.right,
        textFlowDirection: TextFlowDirection.vertical
    };
}

export function defaultValueBookMakeing(): BookMaking {
    return {
        convertSpaceToEnspace: false,
        enableHyperLink: false,
        epubPath: 'book.epub'
    };
}

export function defaultValueTextSetting(): TextSetting {
    return {
        eraseConsecutiveBlankLine: false,

        firstLineHeading: true,
        heading: true,
        align: true,
        indent: true,
        border: true,
        pageBreak: true,
        horizontalRule: true, // hr
        rubyAngle: true, //二重山括弧
        rubyParen: true, //丸括弧
        tcy: true,
        bold: true,
        italic: true,
        emMarkDot: true, //傍点 +文字+
        emMarkDot2: true, //傍点の記法違い 《《文字》》
        emMarkComma: true,
        image: true,

        advanceMode: false //細かい書式をMarkdown方式にする
    };
}


export function getContentItemBlank(): ContentItem {
    return {
        cover: false,
        firstPagePosition: 0,
        headingLevel: 0,
        headingText: '',
        imageHandling: 0,
        path: '空白ページ',
        tocHeadingLevel: 1,
        type: ContentType.blank
    };
}

export function getContentItemWord(bookUri: Uri, fileUri: Uri): ContentItem {
    return {
        cover: false,
        firstPagePosition: 0,
        headingLevel: 0,
        headingText: '',
        imageHandling: 1,
        path: path.posix.relative(path.dirname(bookUri.path), fileUri.path),
        tocHeadingLevel: 1,
        type: ContentType.word
    };
}

export function getContentItemText(bookUri: Uri, fileUri: Uri): ContentItem {
    return {
        cover: false,
        firstPagePosition: 0,
        headingLevel: 0,
        headingText: '',
        imageHandling: 1,
        path: path.posix.relative(path.dirname(bookUri.path), fileUri.path),
        tocHeadingLevel: 1,
        type: ContentType.text
    };
}

export function getContentItemImage(bookUri: Uri, fileUri: Uri): ContentItem {
    return {
        cover: false,
        firstPagePosition: 0,
        headingLevel: 0,
        headingText: '',
        imageHandling: 0,
        path: path.posix.relative(path.dirname(bookUri.path), fileUri.path),
        tocHeadingLevel: 1,
        type: ContentType.image
    };
}

export function getContentItemToc(): ContentItem {
    return {
        cover: false,
        firstPagePosition: 0,
        headingLevel: 0,
        headingText: '',
        imageHandling: 0,
        path: '目次',
        tocHeadingLevel: 3,
        type: ContentType.toc
    };
}

export function getContentItemPdf(bookUri: Uri, fileUri: Uri): ContentItem {
    return {
        cover: false,
        firstPagePosition: 0,
        headingLevel: 0,
        headingText: '',
        imageHandling: 1,
        path: path.posix.relative(path.dirname(bookUri.path), fileUri.path),
        tocHeadingLevel: 1,
        type: ContentType.pdf
    };
}

export function getContentItemMarkdown(bookUri: Uri, fileUri: Uri): ContentItem {
    return {
        cover: false,
        firstPagePosition: 0,
        headingLevel: 0,
        headingText: '',
        imageHandling: 1,
        path: path.posix.relative(path.dirname(bookUri.path), fileUri.path),
        tocHeadingLevel: 1,
        type: ContentType.markdown
    };
}