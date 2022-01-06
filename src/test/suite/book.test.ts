import * as assert from 'assert';

import * as vscode from 'vscode';
import * as book from '../../book';


suite('Book Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('getContentItemBlank test', () => {

		assert.deepStrictEqual(book.getContentItemBlank(), {
			cover: false,
			firstPagePosition: 0,
			headingLevel: 0,
			headingText: '',
			imageHandling: 0,
			path: '空白ページ',
			tocHeadingLevel: 1,
			type: book.ContentType.blank
		});
	});


	test('getContentItemWord test', () => {
		const ext = 'docx';

		assert.deepStrictEqual(book.getContentItemWord(
			vscode.Uri.file('/path/to/book.leme'),
			vscode.Uri.file('/path/to/content.' + ext)
		), {
			cover: false,
			firstPagePosition: 0,
			headingLevel: 0,
			headingText: '',
			imageHandling: 1,
			path: 'content.' + ext,
			tocHeadingLevel: 1,
			type: book.ContentType.word
		});

		assert.deepStrictEqual(book.getContentItemWord(
			vscode.Uri.file('/path/to/book.leme'),
			vscode.Uri.file('/path/to/script/content.' + ext)
		), {
			cover: false,
			firstPagePosition: 0,
			headingLevel: 0,
			headingText: '',
			imageHandling: 1,
			path: 'script/content.' + ext,
			tocHeadingLevel: 1,
			type: book.ContentType.word
		});


		assert.deepStrictEqual(book.getContentItemWord(
			vscode.Uri.file('/path/to/book.leme'),
			vscode.Uri.file('/path/script/content.' + ext)
		), {
			cover: false,
			firstPagePosition: 0,
			headingLevel: 0,
			headingText: '',
			imageHandling: 1,
			path: '../script/content.' + ext,
			tocHeadingLevel: 1,
			type: book.ContentType.word
		});
	});


	test('getContentItemText test', () => {
		const ext = 'txt';

		assert.deepStrictEqual(book.getContentItemText(
			vscode.Uri.file('/path/to/book.leme'),
			vscode.Uri.file('/path/to/content.' + ext)
		), {
			cover: false,
			firstPagePosition: 0,
			headingLevel: 0,
			headingText: '',
			imageHandling: 1,
			path: 'content.' + ext,
			tocHeadingLevel: 1,
			type: book.ContentType.text
		});

		assert.deepStrictEqual(book.getContentItemText(
			vscode.Uri.file('/path/to/book.leme'),
			vscode.Uri.file('/path/to/script/content.' + ext)
		), {
			cover: false,
			firstPagePosition: 0,
			headingLevel: 0,
			headingText: '',
			imageHandling: 1,
			path: 'script/content.' + ext,
			tocHeadingLevel: 1,
			type: book.ContentType.text
		});


		assert.deepStrictEqual(book.getContentItemText(
			vscode.Uri.file('/path/to/book.leme'),
			vscode.Uri.file('/path/script/content.' + ext)
		), {
			cover: false,
			firstPagePosition: 0,
			headingLevel: 0,
			headingText: '',
			imageHandling: 1,
			path: '../script/content.' + ext,
			tocHeadingLevel: 1,
			type: book.ContentType.text
		});
	});


	test('getContentItemImage test', () => {
		const ext = 'png';

		assert.deepStrictEqual(book.getContentItemImage(
			vscode.Uri.file('/path/to/book.leme'),
			vscode.Uri.file('/path/to/content.' + ext)
		), {
			cover: false,
			firstPagePosition: 0,
			headingLevel: 0,
			headingText: '',
			imageHandling: 0,
			path: 'content.' + ext,
			tocHeadingLevel: 1,
			type: book.ContentType.image
		});

		assert.deepStrictEqual(book.getContentItemImage(
			vscode.Uri.file('/path/to/book.leme'),
			vscode.Uri.file('/path/to/script/content.' + ext)
		), {
			cover: false,
			firstPagePosition: 0,
			headingLevel: 0,
			headingText: '',
			imageHandling: 0,
			path: 'script/content.' + ext,
			tocHeadingLevel: 1,
			type: book.ContentType.image
		});


		assert.deepStrictEqual(book.getContentItemImage(
			vscode.Uri.file('/path/to/book.leme'),
			vscode.Uri.file('/path/script/content.' + ext)
		), {
			cover: false,
			firstPagePosition: 0,
			headingLevel: 0,
			headingText: '',
			imageHandling: 0,
			path: '../script/content.' + ext,
			tocHeadingLevel: 1,
			type: book.ContentType.image
		});
	});

	test('getContentItemToc test', () => {

		assert.deepStrictEqual(book.getContentItemToc(), {
			cover: false,
			firstPagePosition: 0,
			headingLevel: 0,
			headingText: '',
			imageHandling: 0,
			path: '目次',
			tocHeadingLevel: 3,
			type: book.ContentType.toc
		});
	});

	

	test('getContentItemPdf test', () => {
		const ext = 'pdf';

		assert.deepStrictEqual(book.getContentItemPdf(
			vscode.Uri.file('/path/to/book.leme'),
			vscode.Uri.file('/path/to/content.' + ext)
		), {
			cover: false,
			firstPagePosition: 0,
			headingLevel: 0,
			headingText: '',
			imageHandling: 1,
			path: 'content.' + ext,
			tocHeadingLevel: 1,
			type: book.ContentType.pdf
		});

		assert.deepStrictEqual(book.getContentItemPdf(
			vscode.Uri.file('/path/to/book.leme'),
			vscode.Uri.file('/path/to/script/content.' + ext)
		), {
			cover: false,
			firstPagePosition: 0,
			headingLevel: 0,
			headingText: '',
			imageHandling: 1,
			path: 'script/content.' + ext,
			tocHeadingLevel: 1,
			type: book.ContentType.pdf
		});


		assert.deepStrictEqual(book.getContentItemPdf(
			vscode.Uri.file('/path/to/book.leme'),
			vscode.Uri.file('/path/script/content.' + ext)
		), {
			cover: false,
			firstPagePosition: 0,
			headingLevel: 0,
			headingText: '',
			imageHandling: 1,
			path: '../script/content.' + ext,
			tocHeadingLevel: 1,
			type: book.ContentType.pdf
		});
	});

});
