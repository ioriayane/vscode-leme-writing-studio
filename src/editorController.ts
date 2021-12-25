import { StatusBarItem, TextEditor, Selection, InputBoxOptions, CancellationToken } from 'vscode';
import * as analyzer from './analyzer';

export class EditorController {
    public static readonly commandNameFormatRuby = 'leme-writing-studio.format.text.ruby';

    private _editors: { [key: string]: analyzer.TextAnalyzer; } = {};

    constructor(private _statusBarItem: StatusBarItem) {
    }

    get statusBarItem(): StatusBarItem {
        return this._statusBarItem;
    }

    public async update(e: TextEditor | undefined): Promise<void> {
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

    public async right(e: TextEditor | undefined, selecting: boolean): Promise<void> {
        if (!e) {
            return;
        }
        if (!this._editors[e.document.uri.path]) {
            return;
        }
        const position = this._editors[e.document.uri.path].right(e.selection.active.line, e.selection.active.character);
        if (selecting) {
            e.selection = new Selection(e.selection.anchor, position);
        } else {
            e.selection = new Selection(position, position);
        }
    }

    public async left(e: TextEditor | undefined, selecting: boolean): Promise<void> {
        if (!e) {
            return;
        }
        if (!this._editors[e.document.uri.path]) {
            return;
        }
        const position = this._editors[e.document.uri.path].left(e.selection.active.line, e.selection.active.character);
        if (selecting) {
            e.selection = new Selection(e.selection.anchor, position);
        } else {
            e.selection = new Selection(position, position);
        }
    }

    public async formatRuby(e: TextEditor, showInputBox: (options?: InputBoxOptions, token?: CancellationToken) => Thenable<string | undefined>): Promise<void> {
        if (!(e.document.uri.path in this._editors)) {
            return;
        }
        let selecting = true;
        if (e.selection.start.isEqual(e.selection.end)) {
            // search ruby range
            const positionStart = this._editors[e.document.uri.path].leftWord(e.selection.start.line, e.selection.start.character);
            if (e.selection.start.isEqual(positionStart)) {
                return;
            }
            e.selection = new Selection(positionStart, e.selection.end);
            selecting = false;
        }
        let text = e.document.getText(e.selection);
        const ruby = await showInputBox({
            title: 'Please input a ruby of "' + text + '".',
            placeHolder: 'ruby ...'
        });
        if (ruby) {
            // triming okurigana(only not selecting)
            let trimLength = 0;
            if (!selecting) {
                const trimmed = this._editors[e.document.uri.path].trimKana(text);
                if (text.length !== trimmed.length) {
                    e.selection = new Selection(e.selection.start, e.selection.end.translate(0, -1 * (text.length - trimmed.length)));
                }
                trimLength = text.length - trimmed.length;
                text = trimmed;
            }
            // replace
            const formatted = '|' + text + '《' + ruby + '》';
            await e.edit(builder => builder.replace(e.selection, formatted));
            // move cursor after formatted text
            const positionAfter = e.selection.start.translate(0, formatted.length + trimLength);
            e.selection = new Selection(positionAfter, positionAfter);
        }
    }
}