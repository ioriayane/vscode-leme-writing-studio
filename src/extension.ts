import * as vscode from 'vscode';
import * as path from 'path';
import { LemePreviewer } from './lemePreviewer';
import { LemeProject } from './lemeProject';
import { EditorController } from './editorController';
import { LemeFileEditorProvider } from './lemeFileEditorProvider';
import { LemeTextCompletionItemProvider } from './lemeTextCompletionItemProvider';
import { LemeTextTreeDataProvider } from './lemeTextTreeDataProvider';

let loading = false;

export function activate(context: vscode.ExtensionContext): void {

	const outputChannel = vscode.window.createOutputChannel('LeME Writing Studio');
	outputChannel.appendLine('LeME Writing Studio Extension is starting');

	const lemePreviewer = new LemePreviewer(context.extensionUri);
	const lemeProject = new LemeProject(vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1));
	const editorController = new EditorController(vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0));
	const lemeFileEditor = new LemeFileEditorProvider(context.extensionUri);
	const lemeTextTreeDataProvider = new LemeTextTreeDataProvider();

	context.subscriptions.push(lemeProject.statusBarItem);
	context.subscriptions.push(editorController.statusBarItem);

	editorController.update(vscode.window.activeTextEditor);
	updateWorkspace(vscode.window.activeTextEditor, lemePreviewer, lemeProject, lemeTextTreeDataProvider, outputChannel);


	context.subscriptions.push(vscode.commands.registerCommand(LemePreviewer.comandName, () => {
		lemePreviewer.create(context, vscode.window.activeTextEditor);
	}));

	context.subscriptions.push(vscode.commands.registerCommand(LemeProject.commandNameCreateBook, () => {
		lemeProject.createBook(vscode.workspace.workspaceFolders, vscode.window.activeTextEditor);
	}));

	context.subscriptions.push(vscode.commands.registerCommand(LemeProject.commandNameSelectBook, () => {
		selectBook(vscode.window.activeTextEditor, lemePreviewer, lemeProject, outputChannel);
	}));

	context.subscriptions.push(vscode.commands.registerCommand(LemeProject.commandNameMakeEbook, () => {
		lemeProject.makeEbook(vscode.window.activeTextEditor?.document, vscode.workspace.workspaceFolders, outputChannel);
	}));

	// context.subscriptions.push(vscode.commands.registerCommand(LemeFileEditorProvider.comandNameAddFile, (e) => {
	// 	let uri: vscode.Uri | undefined;
	// 	if (e instanceof vscode.Uri) {
	// 		// from tree or texteditor
	// 		uri = e;
	// 	} else if (vscode.window.activeTextEditor) {
	// 		// from command palette
	// 		uri = vscode.window.activeTextEditor.document.uri;
	// 	} else {
	// 		uri = undefined;
	// 	}
	// 	addContentItem(uri, lemeFileEditor, lemeProject);
	// }));

	context.subscriptions.push(vscode.window.registerCustomEditorProvider(LemeFileEditorProvider.viewType, lemeFileEditor));


	context.subscriptions.push(vscode.commands.registerTextEditorCommand(EditorController.commandNameFormatRuby, async editor => {
		editorController.formatRuby(editor, vscode.window.showInputBox);
	}));

	context.subscriptions.push(vscode.languages.registerCompletionItemProvider(
		{ scheme: 'file', language: 'lemeText' },
		new LemeTextCompletionItemProvider()));


	context.subscriptions.push(vscode.commands.registerCommand('skipRight', () => {
		editorController.right(vscode.window.activeTextEditor, false);
	}));
	context.subscriptions.push(vscode.commands.registerCommand('skipRightSelect', () => {
		editorController.right(vscode.window.activeTextEditor, true);
	}));
	context.subscriptions.push(vscode.commands.registerCommand('skipLeft', () => {
		editorController.left(vscode.window.activeTextEditor, false);
	}));
	context.subscriptions.push(vscode.commands.registerCommand('skipLeftSelect', () => {
		editorController.left(vscode.window.activeTextEditor, true);
	}));


	context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(e => {
		editorController.update(e);
		updateWorkspace(e, lemePreviewer, lemeProject, lemeTextTreeDataProvider, outputChannel);
	}));

	// context.subscriptions.push(vscode.window.onDidChangeVisibleTextEditors(() => {
	// 	editorController.update(vscode.window.activeTextEditor);
	// 	updateWorkspace(vscode.window.activeTextEditor, lemePreviewer, lemeProject, outputPanel);
	// }));

	lemeFileEditor.onActivate = (document => {
		lemeProject.updateWorkspace(document, vscode.workspace.workspaceFolders);
	});

	context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(() => {
		editorController.update(vscode.window.activeTextEditor);
		if (!loading) {
			lemePreviewer.update(vscode.window.activeTextEditor).then(paragraphs => {
				lemeTextTreeDataProvider.refresh(paragraphs);
			});
		}
	}));

	context.subscriptions.push(vscode.window.onDidChangeTextEditorSelection((e) => {
		if (!loading) {
			lemePreviewer.update(e.textEditor);
		}
	}));

	vscode.window.registerTreeDataProvider('lemeTextTree', lemeTextTreeDataProvider);
	vscode.commands.registerCommand(LemeTextTreeDataProvider.commandNameRefresh,
		() => lemeTextTreeDataProvider.refresh()
	);
	vscode.commands.registerCommand(LemeTextTreeDataProvider.commandNameSelection,
		(element) => lemeTextTreeDataProvider.selection(element, vscode.commands.executeCommand)
	);
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function deactivate(): void { }


function updateWorkspace(e: vscode.TextEditor | undefined,
	lemePreviewer: LemePreviewer,
	lemeProject: LemeProject,
	lemeTextTreeDataProvider: LemeTextTreeDataProvider,
	outputChannel: vscode.OutputChannel
): void {
	if (!e) {
		return;
	}

	loading = true;
	lemeProject.updateWorkspace(e.document, vscode.workspace.workspaceFolders).then((lemeFileUri) => {
		if (!lemeFileUri) {
			loading = false;
		} else {
			if (!lemePreviewer.isSupportFileType(e.document.uri)) {
				loading = false;
			} else {
				// loads settings for previewer when acitve editting file is supported file type only.
				lemeProject.loadLemeFile(
					lemeFileUri, lemePreviewer.bookInfo, lemePreviewer.bookSpec,
					lemePreviewer.bookMaking, lemePreviewer.bookTextSetting
				).then(updated => {
					lemePreviewer.update(e, updated).then((document) => {
						loading = false;
						lemeTextTreeDataProvider.refresh(document);
						outputChannel.appendLine('Updated the workspace from a LeME file : ' + path.basename(lemeFileUri.path));
					});
				});
			}
		}
	});
}

function selectBook(e: vscode.TextEditor | undefined,
	lemePreviewer: LemePreviewer,
	lemeProject: LemeProject,
	outputChannel: vscode.OutputChannel
): void {
	if (!e) {
		return;
	}

	lemeProject.selectLemeFile(vscode.workspace.workspaceFolders, e.document.uri).then(lemeFileUri => {
		if (lemeFileUri) {
			outputChannel.appendLine('Selected a LeME file : ' + path.basename(lemeFileUri.path));
			// updateWorkspace(e, lemePreviewer, lemeProject, outputChannel);
			vscode.commands.executeCommand('vscode.openWith', lemeFileUri, LemeFileEditorProvider.viewType);
		}
	});
}

// function addContentItem(
// 	documentUri: vscode.Uri | undefined,
// 	lemeFileEditor: LemeFileEditorProvider,
// 	lemeProject: LemeProject
// ): void {
// 	if (!documentUri) {
// 		return;
// 	}
// 	lemeProject.selectLemeFile(vscode.workspace.workspaceFolders, documentUri).then(lemeFileUri => {
// 		if (lemeFileUri) {
// 			vscode.workspace.openTextDocument(lemeFileUri).then(lemeFile => {
// 				if(lemeFile){
// 					lemeFileEditor.addContentItem(lemeFile, documentUri);
// 					vscode.window.showTextDocument(lemeFile);
// 				}
// 			});
// 		}
// 	});
// }