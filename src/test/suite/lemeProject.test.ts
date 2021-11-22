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

    test('getWorkspaceUri test(update)', async () => {
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
        bookTextSetting.rubyBracket = false;
        bookTextSetting.rubyParen = false;
        bookTextSetting.eraceConsecutiveBlankLine = true;
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
        assert.strictEqual(bookTextSetting.rubyBracket, true, 'rubyBracket');
        assert.strictEqual(bookTextSetting.rubyParen, true, 'rubyParen');
        assert.strictEqual(bookTextSetting.eraceConsecutiveBlankLine, false, 'eraceConsecutiveBlankLine');
        assert.strictEqual(bookTextSetting.tcy, true, 'tcy');

    });


    test('getWorkspaceUri test(none update)', async () => {
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
        bookTextSetting.rubyBracket = true;
        bookTextSetting.rubyParen = true;
        bookTextSetting.eraceConsecutiveBlankLine = false;
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
        assert.strictEqual(bookTextSetting.rubyBracket, true, 'rubyBracket');
        assert.strictEqual(bookTextSetting.rubyParen, true, 'rubyParen');
        assert.strictEqual(bookTextSetting.eraceConsecutiveBlankLine, false, 'eraceConsecutiveBlankLine');
        assert.strictEqual(bookTextSetting.tcy, true, 'tcy');

    });
});
