import * as assert from 'assert';

import * as vscode from 'vscode';
import * as project from '../../lemeProject';
import * as book from '../../book';


suite('lemeProject Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    test('getWorkspaceUri test', async () => {
        const bookSpec = book.defaultValueBookSpecification();
        const bookTextSetting = book.defaultValueTextSetting();

        assert.strictEqual(await project.loadLemeFile(vscode.Uri.file('/hoge'), bookSpec, bookTextSetting), false);

        bookSpec.language = book.BookLanguage.en;
        bookSpec.textFlowDirection = book.TextFlowDirection.vertical;
        assert.strictEqual(await project.loadLemeFile(
            vscode.Uri.joinPath(vscode.Uri.file(__dirname), '../../../src/test/suite/dataLemeProject/example.leme'),
            bookSpec, bookTextSetting),
            true);
        assert.strictEqual(bookSpec.language, book.BookLanguage.ja);
        assert.strictEqual(bookSpec.textFlowDirection, book.TextFlowDirection.horizontal);
    });
});
