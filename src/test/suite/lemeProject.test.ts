/* eslint-disable @typescript-eslint/no-explicit-any */
import * as assert from 'assert';

import * as vscode from 'vscode';
import { LemeProject } from '../../lemeProject';
import * as book from '../../book';
import * as path from 'path';

class WorkspaceFolderTest implements vscode.WorkspaceFolder {
    public readonly name: string;
    constructor(
        public readonly uri: vscode.Uri,
        public readonly index: number
    ) {
        this.name = path.basename(uri.fsPath);
    }
}

suite('lemeProject Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    test('getWorkspaceUri test', async () => {
        const project = new LemeProject(vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1));
        const bookSpec = book.defaultValueBookSpecification();
        const bookTextSetting = book.defaultValueTextSetting();

        assert.strictEqual(await project.loadLemeFile(vscode.Uri.file('/hoge'), bookSpec, bookTextSetting), false);
    });

    test('getWorkspaceUri test(update)', async () => {
        const project = new LemeProject(vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1));
        const bookSpec = book.defaultValueBookSpecification();
        const bookTextSetting = book.defaultValueTextSetting();

        bookSpec.language = book.BookLanguage.en;
        bookSpec.textFlowDirection = book.TextFlowDirection.vertical;

        bookTextSetting.advanceMode = true;
        bookTextSetting.bold = false;
        bookTextSetting.border = false;
        bookTextSetting.emMarkDot = false;
        bookTextSetting.emMarkDot2 = false;
        bookTextSetting.emMarkComma = false;
        bookTextSetting.firstLineHeading = false;
        bookTextSetting.headling = false;
        bookTextSetting.horizontalRule = false;
        bookTextSetting.image = false;
        bookTextSetting.italic = false;
        bookTextSetting.pageBreak = false;
        bookTextSetting.align = false;
        bookTextSetting.indent = false;
        bookTextSetting.rubyAngle = false;
        bookTextSetting.rubyParen = false;
        bookTextSetting.eraseConsecutiveBlankLine = true;
        bookTextSetting.tcy = false;

        assert.strictEqual(await project.loadLemeFile(
            vscode.Uri.joinPath(vscode.Uri.file(__dirname), '../../../src/test/suite/dataLemeProject/example.leme'),
            bookSpec, bookTextSetting),
            true);

        assert.strictEqual(bookSpec.language, book.BookLanguage.ja, 'language');
        assert.strictEqual(bookSpec.textFlowDirection, book.TextFlowDirection.horizontal, 'textFlowDirection');

        assert.strictEqual(bookTextSetting.advanceMode, false, 'advanceMode');
        assert.strictEqual(bookTextSetting.bold, true, 'bold');
        assert.strictEqual(bookTextSetting.border, true, 'border');
        assert.strictEqual(bookTextSetting.emMarkDot, true, 'emMarkDot');
        assert.strictEqual(bookTextSetting.emMarkDot2, true, 'emMarkDot2');
        assert.strictEqual(bookTextSetting.emMarkComma, true, 'emMarkComma');
        assert.strictEqual(bookTextSetting.firstLineHeading, true, 'firstLineHeading');
        assert.strictEqual(bookTextSetting.headling, true, 'headling');
        assert.strictEqual(bookTextSetting.horizontalRule, true, 'horizontalRule');
        assert.strictEqual(bookTextSetting.image, true, 'image');
        assert.strictEqual(bookTextSetting.italic, true, 'italic');
        assert.strictEqual(bookTextSetting.pageBreak, true, 'pageBreak');
        assert.strictEqual(bookTextSetting.align, true, 'align');
        assert.strictEqual(bookTextSetting.indent, true, 'indent');
        assert.strictEqual(bookTextSetting.rubyAngle, true, 'rubyAngle');
        assert.strictEqual(bookTextSetting.rubyParen, true, 'rubyParen');
        assert.strictEqual(bookTextSetting.eraseConsecutiveBlankLine, false, 'eraseConsecutiveBlankLine');
        assert.strictEqual(bookTextSetting.tcy, true, 'tcy');

    });


    test('getWorkspaceUri test(none update)', async () => {
        const project = new LemeProject(vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1));
        const bookSpec = book.defaultValueBookSpecification();
        const bookTextSetting = book.defaultValueTextSetting();

        bookSpec.language = book.BookLanguage.ja;
        bookSpec.textFlowDirection = book.TextFlowDirection.horizontal;

        bookTextSetting.advanceMode = false;
        bookTextSetting.bold = true;
        bookTextSetting.border = true;
        bookTextSetting.emMarkDot = true;
        bookTextSetting.emMarkDot2 = true;
        bookTextSetting.emMarkComma = true;
        bookTextSetting.firstLineHeading = true;
        bookTextSetting.headling = true;
        bookTextSetting.horizontalRule = true;
        bookTextSetting.image = true;
        bookTextSetting.italic = true;
        bookTextSetting.pageBreak = true;
        bookTextSetting.align = true;
        bookTextSetting.indent = true;
        bookTextSetting.rubyAngle = true;
        bookTextSetting.rubyParen = true;
        bookTextSetting.eraseConsecutiveBlankLine = false;
        bookTextSetting.tcy = true;

        assert.strictEqual(await project.loadLemeFile(
            vscode.Uri.joinPath(vscode.Uri.file(__dirname), '../../../src/test/suite/dataLemeProject/example.leme'),
            bookSpec, bookTextSetting),
            false);

        assert.strictEqual(bookSpec.language, book.BookLanguage.ja, 'language');
        assert.strictEqual(bookSpec.textFlowDirection, book.TextFlowDirection.horizontal, 'textFlowDirection');

        assert.strictEqual(bookTextSetting.advanceMode, false, 'advanceMode');
        assert.strictEqual(bookTextSetting.bold, true, 'bold');
        assert.strictEqual(bookTextSetting.border, true, 'border');
        assert.strictEqual(bookTextSetting.emMarkDot, true, 'emMarkDot');
        assert.strictEqual(bookTextSetting.emMarkDot2, true, 'emMarkDot2');
        assert.strictEqual(bookTextSetting.emMarkComma, true, 'emMarkComma');
        assert.strictEqual(bookTextSetting.firstLineHeading, true, 'firstLineHeading');
        assert.strictEqual(bookTextSetting.headling, true, 'headling');
        assert.strictEqual(bookTextSetting.horizontalRule, true, 'horizontalRule');
        assert.strictEqual(bookTextSetting.image, true, 'image');
        assert.strictEqual(bookTextSetting.italic, true, 'italic');
        assert.strictEqual(bookTextSetting.pageBreak, true, 'pageBreak');
        assert.strictEqual(bookTextSetting.align, true, 'align');
        assert.strictEqual(bookTextSetting.indent, true, 'indent');
        assert.strictEqual(bookTextSetting.rubyAngle, true, 'rubyAngle');
        assert.strictEqual(bookTextSetting.rubyParen, true, 'rubyParen');
        assert.strictEqual(bookTextSetting.eraseConsecutiveBlankLine, false, 'eraseConsecutiveBlankLine');
        assert.strictEqual(bookTextSetting.tcy, true, 'tcy');

    });


    test('updateWorkspace test', async () => {
        const project = new LemeProject(vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1));
        const baseUri = vscode.Uri.joinPath(vscode.Uri.file(__dirname), '../../../src/test/suite/dataLemeProject/');

        const workspaceFolders: vscode.WorkspaceFolder[] = [
            new WorkspaceFolderTest(vscode.Uri.joinPath(baseUri, 'hoge0'), 0),
            new WorkspaceFolderTest(vscode.Uri.joinPath(baseUri, 'fuga1'), 1),
            new WorkspaceFolderTest(baseUri, 2),
            new WorkspaceFolderTest(vscode.Uri.file(__dirname), 3)
        ];

        assert.strictEqual(await (project as any)._getProjectUri(undefined, vscode.Uri.file('/hoge/fuga/project.txt')), undefined);
        assert.strictEqual(await (project as any)._getProjectUri(workspaceFolders, vscode.Uri.file('/hoge/document.txt')), undefined);
        assert.deepStrictEqual(await (project as any)._getProjectUri(workspaceFolders, vscode.Uri.joinPath(baseUri, 'hoge0/document.txt')),
            vscode.Uri.joinPath(baseUri, 'example.leme'));
        assert.deepStrictEqual(await (project as any)._getProjectUri(workspaceFolders, vscode.Uri.joinPath(vscode.Uri.file(__dirname), 'hoge0/document.txt')), undefined);

    });

    test('Project history test', async () => {
        const project = new LemeProject(vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1));
        let workspaceFolderUri: vscode.Uri;



        workspaceFolderUri = vscode.Uri.file('/hoge1');
        assert.deepStrictEqual((project as any)._getProjectUriFromHistory(workspaceFolderUri), undefined);

        workspaceFolderUri = vscode.Uri.file('/hoge2');
        await (project as any)._setProjectUriHistory(workspaceFolderUri, vscode.Uri.joinPath(workspaceFolderUri, 'book1.leme'));
        assert.deepStrictEqual((project as any)._getProjectUriFromHistory(workspaceFolderUri), vscode.Uri.joinPath(workspaceFolderUri, 'book1.leme'));
        await (project as any)._setProjectUriHistory(workspaceFolderUri, vscode.Uri.joinPath(workspaceFolderUri, 'book2.leme'));
        assert.deepStrictEqual((project as any)._getProjectUriFromHistory(workspaceFolderUri), vscode.Uri.joinPath(workspaceFolderUri, 'book2.leme'));

        workspaceFolderUri = vscode.Uri.file('/hoge3');
        await (project as any)._setProjectUriHistory(workspaceFolderUri, vscode.Uri.joinPath(workspaceFolderUri, 'book3.leme'));
        assert.deepStrictEqual((project as any)._getProjectUriFromHistory(workspaceFolderUri), vscode.Uri.joinPath(workspaceFolderUri, 'book3.leme'));
        assert.deepStrictEqual((project as any)._getProjectUriFromHistory(vscode.Uri.file('/hoge/fuga3')), undefined);

    });
});
