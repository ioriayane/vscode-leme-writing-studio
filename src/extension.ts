import * as vscode from 'vscode';
import { LemePreviewer } from './lemePreviewer';

export function activate(context: vscode.ExtensionContext) {

	let lemePreviewer = new LemePreviewer(context.extensionUri);

	context.subscriptions.push(vscode.commands.registerCommand(LemePreviewer.comandName, () => {
		lemePreviewer.create(context, vscode.window.activeTextEditor);
	}));

	context.subscriptions.push(vscode.window.onDidChangeVisibleTextEditors(e => {
		lemePreviewer.update(vscode.window.activeTextEditor);
	}));
	
	context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(e => {
		lemePreviewer.update(vscode.window.activeTextEditor);
	}));

}

export function deactivate() {}
