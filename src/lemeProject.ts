import * as vscode from 'vscode';
import * as path from 'path';
import * as book from './book';



export async function loadLemeFile(lemeFileUri: vscode.Uri, bookSpec: book.BookSpecification, bookTextSetting: book.TextSetting): Promise<boolean> {

    let updated = false;

    let obj;
    try {
        const data = await vscode.workspace.fs.readFile(lemeFileUri);
        obj = JSON.parse(data.toString());
    } catch (error) {
        return updated;
    }
    if(!obj){
        return updated;
    }

    let temp: book.TextFlowDirection;
    if(obj['spec.textFlowDirection'] === 'horizontal'){
        temp = book.TextFlowDirection.horizontal;
    }else{
        temp = book.TextFlowDirection.vertical;
    }
    if(bookSpec.textFlowDirection !== temp){
        bookSpec.textFlowDirection = temp;
        updated = true;
    }
    bookTextSetting.eraceConsecutiveBlankLine = true;

    return updated;
}

export function updateWorkspace(
    workspaceFolders: readonly vscode.WorkspaceFolder[] | undefined,
    documentUri: vscode.Uri,
    callback: (lemeProjectUri: vscode.Uri | undefined) => void): void {

    searchLemeFiles(getWorkspaceUri(workspaceFolders, documentUri)).then((lemeFileUris) => {
        if (!lemeFileUris) {
            callback(undefined);
        } else if (lemeFileUris.length > 0) {
            callback(lemeFileUris[0]);
        }
    });
}

function getWorkspaceUri(
    workspaceFolders: readonly vscode.WorkspaceFolder[] | undefined,
    documentUri: vscode.Uri
): vscode.Uri | undefined {

    if (!workspaceFolders) {
        return undefined;
    }
    let ret: vscode.Uri | undefined = undefined;

    workspaceFolders.forEach(folder => {
        if (documentUri.toString().indexOf(folder.uri.toString()) === 0) {
            ret = folder.uri;
        }
    });

    return ret;
}

async function searchLemeFiles(workspaceUri: vscode.Uri | undefined): Promise<vscode.Uri[] | undefined> {
    if (!workspaceUri) {
        return undefined;
    }

    const children = await vscode.workspace.fs.readDirectory(workspaceUri);
    const files = children.map(([name, type], index) => {
        if (type === vscode.FileType.File && path.extname(name).toLowerCase() === '.leme') {
            console.log('file(' + index + '):' + name);
            return vscode.Uri.joinPath(workspaceUri, name);
        }
        return;
    });

    return (files.filter(value => value !== undefined) as vscode.Uri[]);
}
