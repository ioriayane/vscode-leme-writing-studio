import * as vscode from 'vscode';
import * as analyzer from './analyzer';

export class EditorController {
    private _editors: { [key: string]: analyzer.TextAnalyzer; } = {};
    private _statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);

    get statusBarItem(): vscode.StatusBarItem {
        return this._statusBarItem;
    }

    public async update(e: vscode.TextEditor | undefined): Promise<void> {
        if (!e) {
            this._statusBarItem.hide();
            return;
        }
        if (!this._editors[e.document.uri.path]) {
            // new
            this._editors[e.document.uri.path] = new analyzer.TextAnalyzer();
        }
        const characterCount = this._editors[e.document.uri.path].update(e.document.getText());

        this.statusBarItem.text = 'TL ' + e.document.lineCount.toLocaleString() + ', TC ' + characterCount.toLocaleString();
        this.statusBarItem.show();
    }

    public async right(e: vscode.TextEditor | undefined, selecting: boolean): Promise<void> {
        if (!e) {
            return;
        }
        if (!this._editors[e.document.uri.path]) {
            return;
        }
        const position = this._editors[e.document.uri.path].right(e.selection.active.line, e.selection.active.character);
        if (selecting) {
            e.selection = new vscode.Selection(e.selection.anchor, position);
        } else {
            e.selection = new vscode.Selection(position, position);
        }
    }

    public async left(e: vscode.TextEditor | undefined, selecting: boolean): Promise<void> {
        if (!e) {
            return;
        }
        if (!this._editors[e.document.uri.path]) {
            return;
        }
        const position = this._editors[e.document.uri.path].left(e.selection.active.line, e.selection.active.character);
        if (selecting) {
            e.selection = new vscode.Selection(e.selection.anchor, position);
        } else {
            e.selection = new vscode.Selection(position, position);
        }
    }
}