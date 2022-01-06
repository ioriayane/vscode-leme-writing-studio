import * as vscode from 'vscode';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class LemeTextCompletionItemProvider implements vscode.CompletionItemProvider {
    provideCompletionItems(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext
    ): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList<vscode.CompletionItem>> {
        // Because VSCode's completion function is a hindrance when writing Japanese novels.
        return [new vscode.CompletionItem('')];
    }
}