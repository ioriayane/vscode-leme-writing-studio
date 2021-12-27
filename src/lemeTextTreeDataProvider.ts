import * as vscode from 'vscode';
import * as parser from './parser/index';

export class LemeTextTreeDataProvider implements vscode.TreeDataProvider<DocumentTreeItem> {

    public static readonly commandNameRefresh = 'leme-writing-studio.outline.refresh';
    public static readonly commandNameSelection = 'leme-writing-studio.outline.selection';

    private _document: parser.Paragraph[] | undefined = undefined;
    private _treeData: DocumentTreeItem[] = [];

    private _onDidChangeTreeData: vscode.EventEmitter<DocumentTreeItem | undefined> = new vscode.EventEmitter<DocumentTreeItem | undefined>();
    readonly onDidChangeTreeData: vscode.Event<DocumentTreeItem | undefined> = this._onDidChangeTreeData.event;

    getTreeItem(element: DocumentTreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
        const item = new vscode.TreeItem(element.text,
            element.children.length > 0 ? vscode.TreeItemCollapsibleState.Expanded : vscode.TreeItemCollapsibleState.None);
        item.iconPath = new vscode.ThemeIcon('selection', new vscode.ThemeColor('focusBorder'));
        item.command = {
            command: LemeTextTreeDataProvider.commandNameSelection,
            title: '',
            arguments: [element]
        };
        return item;
    }

    getChildren(element?: DocumentTreeItem): vscode.ProviderResult<DocumentTreeItem[]> {
        if (!element) {
            // root
            return Promise.resolve(this._treeData);
        } else {
            // children
            return Promise.resolve(element.children);
        }
    }

    public refresh(document?: parser.Paragraph[]): void {
        this._treeData = [];
        if(document){
            this._document = document;
        }

        if (this._document) {
            const stack: DocumentTreeItem[] = [];
            let lastLv = 1;
            let lastData: DocumentTreeItem | undefined;

            this._document.forEach((paragraph, index) => {
                if (paragraph.outlineLv > 0) {
                    if (paragraph.outlineLv > 1 && this._treeData.length === 0){
                        // Special if a level is skipped when the stack is empty
                        lastData = this._pushData(index, `<Missing lv1>`, stack);
                        stack.push(lastData);
                    }else if (paragraph.outlineLv < lastLv) {
                        // Bring up to current level
                        while (stack.length > 0) {
                            stack.pop();
                            if (paragraph.outlineLv > stack.length) {
                                break;
                            }
                        }
                    } else if (paragraph.outlineLv > lastLv) {
                        // Completing a skipped level
                        for (let i = 1; i < (paragraph.outlineLv - lastLv); i++) {
                            if (lastData) {
                                stack.push(lastData);
                            }
                            lastData = this._pushData(index, `<Missing lv${lastLv + i}>`, stack);
                        }
                        if (lastData) {
                            stack.push(lastData);
                        }
                    }

                    lastData = this._pushData(index, paragraph.text(), stack);
                    lastLv = paragraph.outlineLv;
                }
            });

        }
        this._onDidChangeTreeData.fire(undefined);
    }

    public selection(element: DocumentTreeItem):void{
        //
        console.log('select:' + element.text);
    }

    private _pushData(index: number, text: string, stack: DocumentTreeItem[]): DocumentTreeItem {
        const data = new DocumentTreeItem(index, text);
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
        readonly lineNo: number,
        readonly text: string,
    ) {
    }
}