import * as vscode from 'vscode';
import * as analyzer from './analyzer';

export class EditorController {
    private _editors: { [key: string]: analyzer.TextAnalyzer; } = {};

    public async update(e: vscode.TextEditor | undefined): Promise<void> {
        if (!e) {
            return;
        }
        if (!this._editors[e.document.uri.path]) {
            // new
            this._editors[e.document.uri.path] = new analyzer.TextAnalyzer();
        }
        this._editors[e.document.uri.path].update(e.document.getText());
    }

    public async right(e: vscode.TextEditor | undefined): Promise<vscode.Position | undefined> {
        if (!e) {
            return undefined;
        }
        if (!this._editors[e.document.uri.path]) {
            return new vscode.Position(e.selection.active.line, e.selection.active.character + 1);
        } else {
            return this._editors[e.document.uri.path].right(e.selection.active.line, e.selection.active.character);
        }
    }

    public async left(e: vscode.TextEditor | undefined): Promise<vscode.Position | undefined> {
        if (!e) {
            return undefined;
        }
        if (!this._editors[e.document.uri.path]) {
            return new vscode.Position(e.selection.active.line, e.selection.active.character - 1);
        } else {
            return this._editors[e.document.uri.path].left(e.selection.active.line, e.selection.active.character);
        }
    }
}