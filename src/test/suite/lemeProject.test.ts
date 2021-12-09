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
        const bookInfo = book.defaultValueBookInformation();
        const bookSpec = book.defaultValueBookSpecification();
        const bookTextSetting = book.defaultValueTextSetting();

        assert.strictEqual(await project.loadLemeFile(vscode.Uri.file('/hoge'), bookInfo, bookSpec, bookTextSetting), false);
    });

    test('getWorkspaceUri test(update)', async () => {
        const project = new LemeProject(vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1));
        const bookInfo = book.defaultValueBookInformation();
        const bookSpec = book.defaultValueBookSpecification();
        const bookTextSetting = book.defaultValueTextSetting();

        bookInfo.creator1 = 'a';
        bookInfo.creator1Kana = 'b';
        bookInfo.creator2 = 'c';
        bookInfo.creator2Kana = 'd';
        bookInfo.identifier = 'd';
        bookInfo.language = book.BookLanguage.en;
        bookInfo.publisher = 'f';
        bookInfo.publisherKana = 'g';
        bookInfo.title = 'h';
        bookInfo.titleKana = 'i';

        bookSpec.allowSpread = false;
        bookSpec.pageProgressionDirection = book.PageProgressionDirection.left;
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
            bookInfo, bookSpec, bookTextSetting),
            true);

        assert.strictEqual(bookInfo.creator1, '作者1', 'creator1');
        assert.strictEqual(bookInfo.creator1Kana, 'さくしゃ1', 'creator1Kana');
        assert.strictEqual(bookInfo.creator2, '作者2', 'creator2');
        assert.strictEqual(bookInfo.creator2Kana, 'さくしゃ2', 'creator2Kana');
        assert.strictEqual(bookInfo.identifier, '123456789456123', 'identifier');
        assert.strictEqual(bookInfo.language, book.BookLanguage.ja, 'language');
        assert.strictEqual(bookInfo.publisher, '理ろぐ', 'publisher');
        assert.strictEqual(bookInfo.publisherKana, 'リログ', 'publisherKana');
        assert.strictEqual(bookInfo.title, 'タイトル', 'title');
        assert.strictEqual(bookInfo.titleKana, 'たいとる', 'titleKana');

        assert.strictEqual(bookSpec.allowSpread, true, 'allowSpread');
        assert.strictEqual(bookSpec.pageProgressionDirection, book.PageProgressionDirection.right, 'pageProgressionDirection');
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
        const bookInfo = book.defaultValueBookInformation();
        const bookSpec = book.defaultValueBookSpecification();
        const bookTextSetting = book.defaultValueTextSetting();

        bookInfo.creator1 = '作者1';
        bookInfo.creator1Kana = 'さくしゃ1';
        bookInfo.creator2 = '作者2';
        bookInfo.creator2Kana = 'さくしゃ2';
        bookInfo.identifier = '123456789456123';
        bookInfo.language = book.BookLanguage.ja;
        bookInfo.publisher = '理ろぐ';
        bookInfo.publisherKana = 'リログ';
        bookInfo.title = 'タイトル';
        bookInfo.titleKana = 'たいとる';

        bookSpec.allowSpread = true;
        bookSpec.pageProgressionDirection = book.PageProgressionDirection.right;
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
            bookInfo, bookSpec, bookTextSetting),
            false);

        assert.strictEqual(bookInfo.creator1, '作者1', 'creator1');
        assert.strictEqual(bookInfo.creator1Kana, 'さくしゃ1', 'creator1Kana');
        assert.strictEqual(bookInfo.creator2, '作者2', 'creator2');
        assert.strictEqual(bookInfo.creator2Kana, 'さくしゃ2', 'creator2Kana');
        assert.strictEqual(bookInfo.identifier, '123456789456123', 'identifier');
        assert.strictEqual(bookInfo.language, book.BookLanguage.ja, 'language');
        assert.strictEqual(bookInfo.publisher, '理ろぐ', 'publisher');
        assert.strictEqual(bookInfo.publisherKana, 'リログ', 'publisherKana');
        assert.strictEqual(bookInfo.title, 'タイトル', 'title');
        assert.strictEqual(bookInfo.titleKana, 'たいとる', 'titleKana');

        assert.strictEqual(bookSpec.allowSpread, true, 'allowSpread');
        assert.strictEqual(bookSpec.pageProgressionDirection, book.PageProgressionDirection.right, 'pageProgressionDirection');
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
