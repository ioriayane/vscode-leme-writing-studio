import {
    Event,
    EventEmitter,
    Position,
    ProviderResult,
    Selection,
    TextEditor,
    ThemeColor,
    ThemeIcon,
    TreeDataProvider,
    TreeItem,
    TreeItemCollapsibleState
} from 'vscode';
import * as parser from './parser/index';
import * as path from 'path';

enum DocumentTreeItemType {
    file,
    heading,
    image,
    unknown
}

export class LemeTextTreeDataProvider implements TreeDataProvider<DocumentTreeItem> {

    public static readonly commandNameRefresh = 'leme-writing-studio.outline.refresh';
    public static readonly commandNameSelection = 'leme-writing-studio.outline.selection';
    public static readonly contextName = 'lemeWritingStudioOutlineEnabled';

    private _editor: TextEditor | undefined = undefined;
    private _paragraphs: parser.Paragraph[] | undefined = undefined;
    private _treeData: DocumentTreeItem[] = [];

    private _onDidChangeTreeData: EventEmitter<DocumentTreeItem | undefined> = new EventEmitter<DocumentTreeItem | undefined>();
    readonly onDidChangeTreeData: Event<DocumentTreeItem | undefined> = this._onDidChangeTreeData.event;

    getTreeItem(element: DocumentTreeItem): TreeItem | Thenable<TreeItem> {
        const item = new TreeItem(element.text,
            element.children.length > 0 ? TreeItemCollapsibleState.Expanded : TreeItemCollapsibleState.None);
        switch (element.type) {
            case DocumentTreeItemType.file:
                item.iconPath = new ThemeIcon('file-text');
                break;
            case DocumentTreeItemType.heading:
                item.iconPath = new ThemeIcon('library', new ThemeColor('focusBorder'));
                break;
            case DocumentTreeItemType.image:
                item.iconPath = new ThemeIcon('file-media');//, new ThemeColor('focusBorder'));
                break;
            default:
                item.iconPath = new ThemeIcon('warning', new ThemeColor('errorForeground'));
                break;
        }
        item.command = {
            command: LemeTextTreeDataProvider.commandNameSelection,
            title: '',
            arguments: [element]
        };
        return item;
    }

    getChildren(element?: DocumentTreeItem): ProviderResult<DocumentTreeItem[]> {
        if (!element) {
            // root
            return Promise.resolve(this._treeData);
        } else {
            // children
            return Promise.resolve(element.children);
        }
    }

    public setCurrentEditor(
        editor: TextEditor | undefined,
        callback: (commandName: string, contextName: string, enabled: boolean) => void
    ): void {
        this._editor = editor;
        if (!editor) {
            callback('setContext', LemeTextTreeDataProvider.contextName, false);
        } else {
            callback('setContext', LemeTextTreeDataProvider.contextName, (editor.document.languageId === 'lemeText'));
        }
    }

    public refresh(paragraphs?: parser.Paragraph[]): void {
        this._treeData = [];
        if (paragraphs) {
            this._paragraphs = paragraphs;
        }

        if (!this._editor) {
            //
        } else if (this._paragraphs) {
            const stack: DocumentTreeItem[] = [];
            let lastLv = 0;
            // root element is file name.
            let lastData = this._pushData(DocumentTreeItemType.file, 1, path.basename(this._editor.document.uri.path), stack);

            this._paragraphs.forEach((paragraph, index) => {
                if (paragraph.outlineLv > 0) {
                    // heading
                    if (paragraph.outlineLv < lastLv) {
                        // Bring up to current level
                        while (stack.length > 1) {
                            stack.pop();
                            if (paragraph.outlineLv > (stack.length - 1)) {
                                break;
                            }
                        }
                    } else if (paragraph.outlineLv > lastLv) {
                        // Completing a skipped level
                        for (let i = 1; i < (paragraph.outlineLv - lastLv); i++) {
                            stack.push(lastData);
                            lastData = this._pushData(DocumentTreeItemType.unknown, index, `<Missing lv${lastLv + i}>`, stack);
                        }
                        stack.push(lastData);
                    }

                    lastData = this._pushData(DocumentTreeItemType.heading, index, paragraph.text(), stack);
                    lastLv = paragraph.outlineLv;
                } else {
                    // other items
                    paragraph.items.forEach(item => {
                        if (item.type === parser.ParagraphItemType.image) {
                            const filename = path.basename((item as parser.ParagraphItemImage).plainPath);
                            lastData.children.push(new DocumentTreeItem(DocumentTreeItemType.image, index, filename));
                        }
                    });
                }
            });

        }
        this._onDidChangeTreeData.fire(undefined);
    }

    public selection(
        element: DocumentTreeItem,
        callback: (command: string, obj: { lineNumber: number, at: string }) => void
    ): void {
        if (this._editor) {
            const position = new Position(element.lineNo, 0);
            this._editor.selection = new Selection(position, position);
        }
        callback('revealLine', { lineNumber: element.lineNo, at: 'center' });
    }

    private _pushData(type: DocumentTreeItemType, index: number, text: string, stack: DocumentTreeItem[]): DocumentTreeItem {
        const data = new DocumentTreeItem(type, index, text);
        if (stack.length === 0) {
            this._treeData.push(data);
        } else {
            stack[stack.length - 1].children.push(data);
        }
        return data;
    }
}

class DocumentTreeItem {
    public children: DocumentTreeItem[] = [];
    constructor(
        readonly type: DocumentTreeItemType,
        readonly lineNo: number,
        readonly text: string,
    ) {
    }
}