import * as vscode from 'vscode';
import { LemePreviewer } from './lemePreviewer';
import { LemeProject } from './lemeProject';
import { EditorController } from './editorController';
import { LemeFileEditorProvider } from './lemeFileEditorProvider';

let loading = false;

export function activate(context: vscode.ExtensionContext): void {

	const lemePreviewer = new LemePreviewer(context.extensionUri);
	const lemeProject = new LemeProject(vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1));
	const editorController = new EditorController(vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0));
	const lemeFileEditor = new LemeFileEditorProvider(context.extensionUri);

	context.subscriptions.push(lemeProject.statusBarItem);
	context.subscriptions.push(editorController.statusBarItem);

	editorController.update(vscode.window.activeTextEditor);
	updateWorkspace(vscode.window.activeTextEditor, lemePreviewer, lemeProject);


	context.subscriptions.push(vscode.commands.registerCommand(LemePreviewer.comandName, () => {
		lemePreviewer.create(context, vscode.window.activeTextEditor);
	}));

	context.subscriptions.push(vscode.commands.registerCommand(LemeProject.commandNameCreateBook, () => {
		lemeProject.createBook(vscode.workspace.workspaceFolders, vscode.window.activeTextEditor);
	}));

	context.subscriptions.push(vscode.commands.registerCommand(LemeProject.commandNameSelectBook, () => {
		selectBook(vscode.window.activeTextEditor, lemeProject);
	}));

	context.subscriptions.push(vscode.window.registerCustomEditorProvider(LemeFileEditorProvider.viewType, lemeFileEditor));


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
		updateWorkspace(e, lemePreviewer, lemeProject);
	}));

	context.subscriptions.push(vscode.window.onDidChangeVisibleTextEditors(() => {
		editorController.update(vscode.window.activeTextEditor);
		updateWorkspace(vscode.window.activeTextEditor, lemePreviewer, lemeProject);
	}));

	context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(() => {
		editorController.update(vscode.window.activeTextEditor);
		lemePreviewer.update(vscode.window.activeTextEditor);
	}));

	context.subscriptions.push(vscode.window.onDidChangeTextEditorSelection(() => {
		if (!loading) {
			lemePreviewer.update(vscode.window.activeTextEditor);
		}
	}));
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function deactivate(): void { }


function updateWorkspace(e: vscode.TextEditor | undefined,
	lemePreviewer: LemePreviewer,
	lemeProject: LemeProject
): void {
	if (!e) {
		return;
	}

	loading = true;
	lemeProject.updateWorkspace(e, vscode.workspace.workspaceFolders).then((lemeFileUri) => {
		if (!lemeFileUri) {
			loading = false;
		} else {
			if (!lemePreviewer.isSupportFileType(e.document.uri)) {
				loading = false;
			} else {
				// loads settings for previewer when acitve editting file is supported file type only.
				lemeProject.loadLemeFile(lemeFileUri, lemePreviewer.bookInfo, lemePreviewer.bookSpec, lemePreviewer.bookTextSetting).then(updated => {
					lemePreviewer.update(e, updated);
					loading = false;
				});
			}
		}
	});
}

function selectBook(e: vscode.TextEditor | undefined,
	lemeProject: LemeProject
): void {
	if (!e) {
		return;
	}

	lemeProject.selectLemeFile(vscode.workspace.workspaceFolders, e.document.uri).then(lemeFileUri => {
		if (lemeFileUri) {
			vscode.workspace.openTextDocument(lemeFileUri).then(document => {
				vscode.window.showTextDocument(document);
			});
		}
	});
}
