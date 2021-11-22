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
	});
});
