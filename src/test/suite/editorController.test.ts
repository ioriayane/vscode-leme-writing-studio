/* eslint-disable @typescript-eslint/no-explicit-any */
import * as assert from 'assert';
import { before, after } from 'mocha';

import * as vscode from 'vscode';
import { EditorController } from '../../editorController';

let inputText = '';
let editor: vscode.TextEditor | undefined = undefined;

function dummyShowInputBox(options?: vscode.InputBoxOptions, token?: vscode.CancellationToken): Thenable<string | undefined> {
    return new Promise(function (resolve, reject) {
        resolve(inputText);
    });
}

async function refleshEditor(editor: vscode.TextEditor, controller: EditorController, text: string, charactorStart: number, charactorEnd: number): Promise<void> {
    const range = new vscode.Range(
        editor.document.positionAt(0),
        editor.document.positionAt(editor.document.getText().length));
    await editor.edit(builder => builder.replace(range, text));

    controller.update(editor);

    const start = new vscode.Position(0, charactorStart);
    const end = new vscode.Position(0, charactorEnd);
    editor.selection = new vscode.Selection(start, end);
}

function makeSelection(start: number, end: number): vscode.Selection {
    return new vscode.Selection(new vscode.Position(0, start), new vscode.Position(0, end));
}

suite('editorController Test Suite', () => {
    before(async () => {
        console.log("before");
        editor = await vscode.window.showTextDocument(await vscode.workspace.openTextDocument({ content: '', language: 'lemeText' }));
    });
    after(() => {
        console.log("after");
        // while (vscode.window.activeTextEditor) {
        vscode.commands.executeCommand('workbench.action.closeActiveEditor');
        // }
    });

    test('formatRuby test(selected)', async () => {
        const controller = new EditorController(vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1));

        editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        await refleshEditor(editor, controller, '花の色は 移りにけりな いたづらに', 2, 3);
        inputText = 'いろ';
        await controller.formatRuby(editor, dummyShowInputBox);
        assert.strictEqual(editor.document.getText(), '花の|色《いろ》は 移りにけりな いたづらに');
        assert.deepStrictEqual(editor.selection, makeSelection(8, 8));

        await refleshEditor(editor, controller, '花の色は 移りにけりな いたづらに', 5, 7);
        inputText = 'うつり';
        await controller.formatRuby(editor, dummyShowInputBox);
        assert.strictEqual(editor.document.getText(), '花の色は |移り《うつり》にけりな いたづらに');
        assert.deepStrictEqual(editor.selection, makeSelection(13, 13));
    });

    test('formatRuby test(auto range detect)', async () => {
        const controller = new EditorController(vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1));

        editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        await refleshEditor(editor, controller, '花の色は 移りにけりな いたづらに', 3, 3);
        inputText = 'いろ';
        await controller.formatRuby(editor, dummyShowInputBox);
        assert.strictEqual(editor.document.getText(), '花の|色《いろ》は 移りにけりな いたづらに');
        assert.deepStrictEqual(editor.selection, makeSelection(8, 8));

        await refleshEditor(editor, controller, '花の色は 移りにけりな いたづらに', 7, 7);
        inputText = 'うつり';
        await controller.formatRuby(editor, dummyShowInputBox);
        assert.strictEqual(editor.document.getText(), '花の色は |移《うつり》りにけりな いたづらに');
        assert.deepStrictEqual(editor.selection, makeSelection(13, 13));

        await refleshEditor(editor, controller, '花の色は 移りにけりな いたづらに', 7, 7);
        inputText = 'うつ';
        await controller.formatRuby(editor, dummyShowInputBox);
        assert.strictEqual(editor.document.getText(), '花の色は |移《うつ》りにけりな いたづらに');
        assert.deepStrictEqual(editor.selection, makeSelection(12, 12));
    });
});
