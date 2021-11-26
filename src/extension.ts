import * as vscode from 'vscode';
import * as path from 'path';
import { LemePreviewer } from './lemePreviewer';
import * as project from './lemeProject';

let loading = false;

export function activate(context: vscode.ExtensionContext): void {

	const lemePreviewer = new LemePreviewer(context.extensionUri);

	const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
	statusBarItem.command = LemePreviewer.comandName;
	context.subscriptions.push(statusBarItem);

	updateWorkspace(vscode.window.activeTextEditor, statusBarItem, lemePreviewer);


	context.subscriptions.push(vscode.commands.registerCommand(LemePreviewer.comandName, () => {
		lemePreviewer.create(context, vscode.window.activeTextEditor);
	}));

	context.subscriptions.push(vscode.commands.registerCommand(project.commandNameCreateBook, () => {
		project.createBook(vscode.workspace.workspaceFolders, vscode.window.activeTextEditor);
	}));

	context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(e => {
		updateWorkspace(e, statusBarItem, lemePreviewer);
	}));

	context.subscriptions.push(vscode.window.onDidChangeVisibleTextEditors(() => {
		updateWorkspace(vscode.window.activeTextEditor, statusBarItem, lemePreviewer);
	}));

	context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(() => {
		lemePreviewer.update(vscode.window.activeTextEditor);
	}));

	context.subscriptions.push(vscode.window.onDidChangeTextEditorSelection(() => {
		if(!loading){
			lemePreviewer.update(vscode.window.activeTextEditor);
		}
	}));
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function deactivate(): void { }


function updateWorkspace(e: vscode.TextEditor | undefined, statusBarItem: vscode.StatusBarItem, lemePreviewer: LemePreviewer): void {
	if (!e) {
		return;
	}

	loading = true;
	project.updateWorkspace(vscode.workspace.workspaceFolders, e.document.uri).then((lemeFileUri) => {
		loading = false;
		if (!lemeFileUri) {
			statusBarItem.hide();
			lemePreviewer.update(e);
		} else {
			statusBarItem.text = '$(open-editors-view-icon) ' + path.basename(lemeFileUri.fsPath);
			statusBarItem.show();

			if (lemePreviewer.isSupportFileType(e.document.uri)) {
				// loads settings for previewer when acitve editting file is supported file type only.
				project.loadLemeFile(lemeFileUri, lemePreviewer.bookSpec, lemePreviewer.bookTextSetting).then(updated => {
					lemePreviewer.update(e, updated);
				});
			}
		}
	});
}
