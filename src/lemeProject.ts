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
    if (!obj) {
        return updated;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function getValue<T>(obj: any, key: string, current: T): T {
        let value = current;
        if (key in obj) {
            value = obj[key];
            if (current !== value) {
                updated = true;
            }
        }
        return value as T;
    }

    bookSpec.language = getValue<book.BookLanguage>(obj, 'info.language', bookSpec.language);
    bookSpec.textFlowDirection = getValue<book.TextFlowDirection>(obj, 'spec.textFlowDirection', bookSpec.textFlowDirection);

    bookTextSetting.advanceMode = getValue<boolean>(obj, 'making.format.text.advanceMode', bookTextSetting.advanceMode);
    bookTextSetting.bold = getValue<boolean>(obj, 'making.format.text.bold', bookTextSetting.bold);
    bookTextSetting.border = getValue<boolean>(obj, 'making.format.text.border', bookTextSetting.border);
    bookTextSetting.emMarkDot = getValue<boolean>(obj, 'making.format.text.emMark', bookTextSetting.emMarkDot);
    bookTextSetting.emMarkDot2 = getValue<boolean>(obj, 'making.format.text.emMark2', bookTextSetting.emMarkDot2);
    bookTextSetting.emMarkComma = getValue<boolean>(obj, 'making.format.text.emMarkComma', bookTextSetting.emMarkComma);
    bookTextSetting.firstLineHeading = getValue<boolean>(obj, 'making.format.text.firstLineHeading', bookTextSetting.firstLineHeading);
    bookTextSetting.headling = getValue<boolean>(obj, 'making.format.text.heading', bookTextSetting.headling);
    bookTextSetting.horizontalRule = getValue<boolean>(obj, 'making.format.text.horizontalRule', bookTextSetting.horizontalRule);
    bookTextSetting.image = getValue<boolean>(obj, 'making.format.text.image', bookTextSetting.image);
    bookTextSetting.italic = getValue<boolean>(obj, 'making.format.text.italic', bookTextSetting.italic);
    bookTextSetting.pageBreak = getValue<boolean>(obj, 'making.format.text.pageBreak', bookTextSetting.pageBreak);
    bookTextSetting.align = getValue<boolean>(obj, 'making.format.text.paragraphAlign', bookTextSetting.align);
    bookTextSetting.indent = getValue<boolean>(obj, 'making.format.text.paragraphIndent', bookTextSetting.indent);
    bookTextSetting.rubyBracket = getValue<boolean>(obj, 'making.format.text.rubyAngle', bookTextSetting.rubyBracket);
    bookTextSetting.rubyParen = getValue<boolean>(obj, 'making.format.text.rubyParen', bookTextSetting.rubyParen);
    bookTextSetting.eraceConsecutiveBlankLine = getValue<boolean>(obj, 'making.format.text.shortenEmptyLine', bookTextSetting.eraceConsecutiveBlankLine);
    bookTextSetting.tcy = getValue<boolean>(obj, 'making.format.text.tcy', bookTextSetting.tcy);

    return updated;
}


export async function updateWorkspace(
    workspaceFolders: readonly vscode.WorkspaceFolder[] | undefined,
    documentUri: vscode.Uri
): Promise<vscode.Uri | undefined> {

    if (!workspaceFolders) {
        return undefined;
    }
    const workspaceUri = getWorkspaceUri(workspaceFolders, documentUri);
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
    }).filter(value => value !== undefined);

    if (files.length > 0) {
        return files[0];
    } else {
        return undefined;
    }
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
