import * as vscode from 'vscode';
import * as path from 'path';
import * as book from './book';

export class LemeProject {

    public static readonly commandNameCreateBook = 'leme-writing-studio.createBook';
    public static readonly commandNameSelectBook = 'leme-writing-studio.selectBook';

    private static readonly settingSelectedBookUri = 'selected-book-name';

    private _projectHistory: { [key: string]: vscode.Uri | undefined; } = {};

    public async loadLemeFile(lemeFileUri: vscode.Uri, bookSpec: book.BookSpecification, bookTextSetting: book.TextSetting): Promise<boolean> {

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
        function getValue<T>(obj: { [key: string]: any }, key: string, current: T): T {
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
        bookTextSetting.rubyAngle = getValue<boolean>(obj, 'making.format.text.rubyAngle', bookTextSetting.rubyAngle);
        bookTextSetting.rubyParen = getValue<boolean>(obj, 'making.format.text.rubyParen', bookTextSetting.rubyParen);
        bookTextSetting.eraseConsecutiveBlankLine = getValue<boolean>(obj, 'making.format.text.eraseConsecutiveBlankLine', bookTextSetting.eraseConsecutiveBlankLine);
        bookTextSetting.tcy = getValue<boolean>(obj, 'making.format.text.tcy', bookTextSetting.tcy);

        return updated;
    }

    public async createBook(workspaceFolders: readonly vscode.WorkspaceFolder[] | undefined,
        e: vscode.TextEditor | undefined
    ): Promise<void> {
        const newFileOptions: vscode.InputBoxOptions = {
            placeHolder: 'Please input a new LeME file name. ( in ${}/ )',
            title: 'LeME: New LeME file',
        };
        const selectFolderOptions: vscode.QuickPickOptions = {
            placeHolder: 'Please select a workspace folder.',
            title: 'LeME: Select Workspace folder'
        };

        let folderUri: vscode.Uri;
        let fileName: string;

        if (!workspaceFolders) {
            // no place to create
            return;
        }
        if (!e) {
            if (workspaceFolders.length === 1) {
                // only one
                folderUri = workspaceFolders[0].uri;
            } else {
                // select workspace
                const folders = workspaceFolders.map(value => {
                    return value.uri.fsPath;
                });
                const folder = await vscode.window.showQuickPick(folders, selectFolderOptions);
                if (!folder) {
                    return;
                }
                folderUri = vscode.Uri.file(folder);
            }
        } else {
            // search workspace
            const workspaceFolder = this._getWorkspaceUri(workspaceFolders, e.document.uri);
            if (!workspaceFolder) {
                return;
            }
            folderUri = workspaceFolder;
        }
        // input file name
        newFileOptions['placeHolder'] = newFileOptions['placeHolder']?.replace('${}', path.basename(folderUri.fsPath));
        const input = await vscode.window.showInputBox(newFileOptions);
        if (!input) {
            return;
        }
        fileName = input;

        // add extension
        if (path.extname(fileName).toLowerCase() !== '.leme') {
            fileName += '.leme';
        }

        // create!
        const bookTextSetting = book.defaultValueTextSetting();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const obj: { [key: string]: any } = {};

        obj['contents'] = [];
        obj['info.creator1'] = "";
        obj['info.creator1Kana'] = "";
        obj['info.creator2'] = "";
        obj['info.creator2Kana'] = "";
        obj['info.identifier'] = "";
        obj['info.language'] = 0;
        obj['info.publisher'] = "";
        obj['info.publisherKana'] = "";
        obj['info.title'] = "";
        obj['info.titleKana'] = "";
        obj['making.convertSpaceToEnspace'] = false;
        obj['making.enableHyperLink'] = false;
        obj['making.epubPath'] = ".";
        obj['making.format.markdown.convertCrlfToBr'] = true;
        obj['making.format.markdown.emMark'] = true;
        obj['making.format.markdown.emMark2'] = true;
        obj['making.format.markdown.emMarkComma'] = true;
        obj['making.format.markdown.pageBreakBeforeH1'] = true;
        obj['making.format.markdown.rubyAngle'] = true;
        obj['making.format.markdown.rubyCurly'] = true;
        obj['making.format.markdown.rubyParen'] = true;
        obj['making.format.markdown.tcy'] = true;
        obj['making.format.text.advanceMode'] = bookTextSetting.advanceMode;
        obj['making.format.text.bold'] = bookTextSetting.bold;
        obj['making.format.text.border'] = bookTextSetting.border;
        obj['making.format.text.emMark'] = bookTextSetting.emMarkDot;
        obj['making.format.text.emMark2'] = bookTextSetting.emMarkDot2;
        obj['making.format.text.emMarkComma'] = bookTextSetting.emMarkComma;
        obj['making.format.text.eraseConsecutiveBlankLine'] = bookTextSetting.eraseConsecutiveBlankLine;
        obj['making.format.text.firstLineHeading'] = bookTextSetting.firstLineHeading;
        obj['making.format.text.heading'] = bookTextSetting.headling;
        obj['making.format.text.horizontalRule'] = bookTextSetting.horizontalRule;
        obj['making.format.text.image'] = bookTextSetting.image;
        obj['making.format.text.italic'] = bookTextSetting.italic;
        obj['making.format.text.pageBreak'] = bookTextSetting.pageBreak;
        obj['making.format.text.paragraphAlign'] = bookTextSetting.align;
        obj['making.format.text.paragraphIndent'] = bookTextSetting.indent;
        obj['making.format.text.rubyAngle'] = bookTextSetting.rubyAngle;
        obj['making.format.text.rubyParen'] = bookTextSetting.rubyParen;
        obj['making.format.text.tcy'] = bookTextSetting.tcy;
        obj['making.generateMobi'] = false;
        obj['making.pdf.fixedImageSize.enable'] = true;
        obj['making.pdf.fixedImageSize.height'] = 2560;
        obj['making.pdf.fixedImageSize.width'] = 1815;
        obj['making.userCss.enable'] = false;
        obj['making.userCss.path'] = "";
        obj['spec.allowSpread'] = true;
        obj['spec.layout'] = "reflowable";
        obj['spec.pageProgressionDirection'] = "right";
        obj['spec.primaryWritingMode'] = "horizontal-rl";
        obj['spec.textFlowDirection'] = "vertical";

        await vscode.workspace.fs.writeFile(
            vscode.Uri.joinPath(folderUri, fileName),
            Uint8Array.from(Buffer.from(JSON.stringify(obj, undefined, '    ')))
        );
    }

    public async selectLemeFile(
        workspaceFolders: readonly vscode.WorkspaceFolder[] | undefined,
        documentUri: vscode.Uri
    ): Promise<vscode.Uri | undefined> {
        if (!workspaceFolders) {
            return undefined;
        }
        const workspaceUri = this._getWorkspaceUri(workspaceFolders, documentUri);
        if (!workspaceUri) {
            return undefined;
        }

        const files = await this._searchLemeFiles(workspaceUri);
        if (files.length <= 1) {
            // oepn
            return files[0];
        } else {
            // choice by user
            const candidateFiles = files.map(value => {
                return value.fsPath;
            });
            const file = await vscode.window.showQuickPick(candidateFiles, {
                placeHolder: 'Please select a LeME file.',
                title: 'LeME: Select LeME file'
            });
            if (!file) {
                return undefined;
            }
            await this._setProjectUriHistory(workspaceUri, vscode.Uri.file(file));
            return vscode.Uri.file(file);
        }
    }

    public async updateWorkspace(
        workspaceFolders: readonly vscode.WorkspaceFolder[] | undefined,
        documentUri: vscode.Uri
    ): Promise<vscode.Uri | undefined> {

        if (!workspaceFolders) {
            return undefined;
        }
        const workspaceUri = this._getWorkspaceUri(workspaceFolders, documentUri);
        if (!workspaceUri) {
            return undefined;
        }

        const file = this._getProjectUriFromHistory(workspaceUri);
        if (await this._fileExists(file)) {
            // from history
            return file;
        } else {
            const files = await this._searchLemeFiles(workspaceUri);

            if (files.length > 0) {
                await this._setProjectUriHistory(workspaceUri, files[0]);
                return files[0];
            } else {
                return undefined;
            }
        }
    }

    private async _fileExists(uri: vscode.Uri | undefined): Promise<boolean> {
        if (!uri) {
            return false;
        }
        try {
            const stat = await vscode.workspace.fs.stat(uri);
            return (stat.type === vscode.FileType.File);
        } catch (error) {
            return false;
        }
    }

    private async _searchLemeFiles(folder: vscode.Uri): Promise<vscode.Uri[]> {
        const children = await vscode.workspace.fs.readDirectory(folder);
        const files = children.map(([name, type]) => {
            if (type === vscode.FileType.File && path.extname(name).toLowerCase() === '.leme') {
                return vscode.Uri.joinPath(folder, name);
            }
            return;
        }).filter(value => value !== undefined);
        return files as vscode.Uri[];
    }

    private _getWorkspaceUri(
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

    private async _setProjectUriHistory(workspaceUri: vscode.Uri, uri: vscode.Uri): Promise<void> {
        this._projectHistory[workspaceUri.path] = uri;

        // save to settings
        if (vscode.workspace.workspaceFolders) {
            const config = vscode.workspace.getConfiguration('', workspaceUri);
            const value = config.get<string>(LemeProject.settingSelectedBookUri);
            if (value !== path.basename(uri.path)) {
                await config.update(LemeProject.settingSelectedBookUri, path.basename(uri.path), vscode.ConfigurationTarget.WorkspaceFolder);
            }
        }
    }

    private _getProjectUriFromHistory(workspaceUri: vscode.Uri): vscode.Uri | undefined {
        if (this._projectHistory[workspaceUri.path]) {
            // from history
            return this._projectHistory[workspaceUri.path];
        } else if (!vscode.workspace.workspaceFolders) {
            // outside of workspace
            return undefined;
        } else {
            // load from settings
            const config = vscode.workspace.getConfiguration('', workspaceUri);
            const value = config.get<string>(LemeProject.settingSelectedBookUri);
            if (value) {
                return vscode.Uri.joinPath(workspaceUri, value);
            } else {
                return undefined;
            }
        }
    }
}
