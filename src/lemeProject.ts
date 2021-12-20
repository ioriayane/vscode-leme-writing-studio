import * as vscode from 'vscode';
import * as path from 'path';
import * as child_process from 'child_process';
import * as book from './book';

export class LemeProject {

    public static readonly commandNameCreateBook = 'leme-writing-studio.createBook';
    public static readonly commandNameSelectBook = 'leme-writing-studio.selectBook';
    public static readonly commandNameMakeEbook = 'leme-writing-studio.makeEbook';

    private static readonly settingSelectedBookUri = 'lemeWritingStudio.selectedBookName';


    public static readonly infoCreator1 = 'info.creator1';
    public static readonly infoCreator1Kana = 'info.creator1Kana';
    public static readonly infoCreator2 = 'info.creator2';
    public static readonly infoCreator2Kana = 'info.creator2Kana';
    public static readonly infoIdentifier = 'info.identifier';
    public static readonly infoLanguage = 'info.language';
    public static readonly infoPublisher = 'info.publisher';
    public static readonly infoPublisherKana = 'info.publisherKana';
    public static readonly infoTitle = 'info.title';
    public static readonly infoTitleKana = 'info.titleKana';

    public static readonly makingConvertSpaceToEnspace = 'making.convertSpaceToEnspace';
    public static readonly makingEnableHyperLink = 'making.enableHyperLink';
    public static readonly makingEpubPath = 'making.epubPath';

    public static readonly makingFormatTextAdvanceMode = 'making.format.text.advanceMode';
    public static readonly makingFormatTextBold = 'making.format.text.bold';
    public static readonly makingFormatTextBorder = 'making.format.text.border';
    public static readonly makingFormatTextEmMark = 'making.format.text.emMark';
    public static readonly makingFormatTextEmMark2 = 'making.format.text.emMark2';
    public static readonly makingFormatTextEmMarkComma = 'making.format.text.emMarkComma';
    public static readonly makingFormatTextFirstLineHeading = 'making.format.text.firstLineHeading';
    public static readonly makingFormatTextHeading = 'making.format.text.heading';
    public static readonly makingFormatTextHorizontalRule = 'making.format.text.horizontalRule';
    public static readonly makingFormatTextImage = 'making.format.text.image';
    public static readonly makingFormatTextItalic = 'making.format.text.italic';
    public static readonly makingFormatTextPageBreak = 'making.format.text.pageBreak';
    public static readonly makingFormatTextParagraphAlign = 'making.format.text.paragraphAlign';
    public static readonly makingFormatTextParagraphIndent = 'making.format.text.paragraphIndent';
    public static readonly makingFormatTextRubyAngle = 'making.format.text.rubyAngle';
    public static readonly makingFormatTextRubyParen = 'making.format.text.rubyParen';
    public static readonly makingFormatTextEraseConsecutiveBlankLine = 'making.format.text.eraseConsecutiveBlankLine';
    public static readonly makingFormatTextTcy = 'making.format.text.tcy';

    public static readonly specAllowSpread = 'spec.allowSpread';
    public static readonly specLayout = 'spec.layout';
    public static readonly specPageProgressionDirection = 'spec.pageProgressionDirection';
    public static readonly specPrimaryWritingMode = 'spec.primaryWritingMode';
    public static readonly specTextFlowDirection = 'spec.textFlowDirection';


    private _projectHistory: { [key: string]: vscode.Uri | undefined; } = {};

    constructor(private _statusBarItem: vscode.StatusBarItem) {
        _statusBarItem.command = LemeProject.commandNameSelectBook;
        _statusBarItem.tooltip = 'Select LeME file(*.leme)';
    }

    get statusBarItem(): vscode.StatusBarItem {
        return this._statusBarItem;
    }

    public async loadLemeFile(
        lemeFileUri: vscode.Uri
        , bookInfo: book.BookInformation
        , bookSpec: book.BookSpecification
        , bookMaking: book.BookMaking
        , bookTextSetting: book.TextSetting
    ): Promise<boolean> {

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

        bookInfo.creator1 = getValue<string>(obj, LemeProject.infoCreator1, bookInfo.creator1);
        bookInfo.creator1Kana = getValue<string>(obj, LemeProject.infoCreator1Kana, bookInfo.creator1Kana);
        bookInfo.creator2 = getValue<string>(obj, LemeProject.infoCreator2, bookInfo.creator2);
        bookInfo.creator2Kana = getValue<string>(obj, LemeProject.infoCreator2Kana, bookInfo.creator2Kana);
        bookInfo.identifier = getValue<string>(obj, LemeProject.infoIdentifier, bookInfo.identifier);
        bookInfo.language = getValue<book.BookLanguage>(obj, LemeProject.infoLanguage, bookInfo.language);
        bookInfo.publisher = getValue<string>(obj, LemeProject.infoPublisher, bookInfo.publisher);
        bookInfo.publisherKana = getValue<string>(obj, LemeProject.infoPublisherKana, bookInfo.publisherKana);
        bookInfo.title = getValue<string>(obj, LemeProject.infoTitle, bookInfo.title);
        bookInfo.titleKana = getValue<string>(obj, LemeProject.infoTitleKana, bookInfo.titleKana);

        bookMaking.convertSpaceToEnspace = getValue<boolean>(obj, LemeProject.makingConvertSpaceToEnspace, bookMaking.convertSpaceToEnspace);
        bookMaking.enableHyperLink = getValue<boolean>(obj, LemeProject.makingEnableHyperLink, bookMaking.enableHyperLink);
        bookMaking.epubPath = getValue<string>(obj, LemeProject.makingEpubPath, bookMaking.epubPath);

        bookTextSetting.advanceMode = getValue<boolean>(obj, LemeProject.makingFormatTextAdvanceMode, bookTextSetting.advanceMode);
        bookTextSetting.bold = getValue<boolean>(obj, LemeProject.makingFormatTextBold, bookTextSetting.bold);
        bookTextSetting.border = getValue<boolean>(obj, LemeProject.makingFormatTextBorder, bookTextSetting.border);
        bookTextSetting.emMarkDot = getValue<boolean>(obj, LemeProject.makingFormatTextEmMark, bookTextSetting.emMarkDot);
        bookTextSetting.emMarkDot2 = getValue<boolean>(obj, LemeProject.makingFormatTextEmMark2, bookTextSetting.emMarkDot2);
        bookTextSetting.emMarkComma = getValue<boolean>(obj, LemeProject.makingFormatTextEmMarkComma, bookTextSetting.emMarkComma);
        bookTextSetting.firstLineHeading = getValue<boolean>(obj, LemeProject.makingFormatTextFirstLineHeading, bookTextSetting.firstLineHeading);
        bookTextSetting.heading = getValue<boolean>(obj, LemeProject.makingFormatTextHeading, bookTextSetting.heading);
        bookTextSetting.horizontalRule = getValue<boolean>(obj, LemeProject.makingFormatTextHorizontalRule, bookTextSetting.horizontalRule);
        bookTextSetting.image = getValue<boolean>(obj, LemeProject.makingFormatTextImage, bookTextSetting.image);
        bookTextSetting.italic = getValue<boolean>(obj, LemeProject.makingFormatTextItalic, bookTextSetting.italic);
        bookTextSetting.pageBreak = getValue<boolean>(obj, LemeProject.makingFormatTextPageBreak, bookTextSetting.pageBreak);
        bookTextSetting.align = getValue<boolean>(obj, LemeProject.makingFormatTextParagraphAlign, bookTextSetting.align);
        bookTextSetting.indent = getValue<boolean>(obj, LemeProject.makingFormatTextParagraphIndent, bookTextSetting.indent);
        bookTextSetting.rubyAngle = getValue<boolean>(obj, LemeProject.makingFormatTextRubyAngle, bookTextSetting.rubyAngle);
        bookTextSetting.rubyParen = getValue<boolean>(obj, LemeProject.makingFormatTextRubyParen, bookTextSetting.rubyParen);
        bookTextSetting.eraseConsecutiveBlankLine = getValue<boolean>(obj, LemeProject.makingFormatTextEraseConsecutiveBlankLine, bookTextSetting.eraseConsecutiveBlankLine);
        bookTextSetting.tcy = getValue<boolean>(obj, LemeProject.makingFormatTextTcy, bookTextSetting.tcy);

        bookSpec.allowSpread = getValue<boolean>(obj, LemeProject.specAllowSpread, bookSpec.allowSpread);
        bookSpec.pageProgressionDirection = getValue<book.PageProgressionDirection>(obj, LemeProject.specPageProgressionDirection, bookSpec.pageProgressionDirection);
        bookSpec.textFlowDirection = getValue<book.TextFlowDirection>(obj, LemeProject.specTextFlowDirection, bookSpec.textFlowDirection);

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
        const bookMaking = book.defaultValueBookMakeing();
        const bookTextSetting = book.defaultValueTextSetting();
        const bookSpec = book.defaultValueBookSpecification();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const obj: { [key: string]: any } = {};

        obj['contents'] = [];
        obj[LemeProject.infoCreator1] = '';
        obj[LemeProject.infoCreator1Kana] = '';
        obj[LemeProject.infoCreator2] = '';
        obj[LemeProject.infoCreator2Kana] = '';
        obj[LemeProject.infoIdentifier] = '';
        obj[LemeProject.infoLanguage] = 0;
        obj[LemeProject.infoPublisher] = '';
        obj[LemeProject.infoPublisherKana] = '';
        obj[LemeProject.infoTitle] = '';
        obj[LemeProject.infoTitleKana] = '';
        obj[LemeProject.makingConvertSpaceToEnspace] = bookMaking.convertSpaceToEnspace;
        obj[LemeProject.makingEnableHyperLink] = bookMaking.enableHyperLink;
        obj[LemeProject.makingEpubPath] = '.';
        obj['making.format.markdown.convertCrlfToBr'] = true;
        obj['making.format.markdown.emMark'] = true;
        obj['making.format.markdown.emMark2'] = true;
        obj['making.format.markdown.emMarkComma'] = true;
        obj['making.format.markdown.pageBreakBeforeH1'] = true;
        obj['making.format.markdown.rubyAngle'] = true;
        obj['making.format.markdown.rubyCurly'] = true;
        obj['making.format.markdown.rubyParen'] = true;
        obj['making.format.markdown.tcy'] = true;
        obj[LemeProject.makingFormatTextAdvanceMode] = bookTextSetting.advanceMode;
        obj[LemeProject.makingFormatTextBold] = bookTextSetting.bold;
        obj[LemeProject.makingFormatTextBorder] = bookTextSetting.border;
        obj[LemeProject.makingFormatTextEmMark] = bookTextSetting.emMarkDot;
        obj[LemeProject.makingFormatTextEmMark2] = bookTextSetting.emMarkDot2;
        obj[LemeProject.makingFormatTextEmMarkComma] = bookTextSetting.emMarkComma;
        obj[LemeProject.makingFormatTextFirstLineHeading] = bookTextSetting.firstLineHeading;
        obj[LemeProject.makingFormatTextHeading] = bookTextSetting.heading;
        obj[LemeProject.makingFormatTextHorizontalRule] = bookTextSetting.horizontalRule;
        obj[LemeProject.makingFormatTextImage] = bookTextSetting.image;
        obj[LemeProject.makingFormatTextItalic] = bookTextSetting.italic;
        obj[LemeProject.makingFormatTextPageBreak] = bookTextSetting.pageBreak;
        obj[LemeProject.makingFormatTextParagraphAlign] = bookTextSetting.align;
        obj[LemeProject.makingFormatTextParagraphIndent] = bookTextSetting.indent;
        obj[LemeProject.makingFormatTextRubyAngle] = bookTextSetting.rubyAngle;
        obj[LemeProject.makingFormatTextRubyParen] = bookTextSetting.rubyParen;
        obj[LemeProject.makingFormatTextEraseConsecutiveBlankLine] = bookTextSetting.eraseConsecutiveBlankLine;
        obj[LemeProject.makingFormatTextTcy] = bookTextSetting.tcy;
        obj['making.generateMobi'] = false;
        obj['making.pdf.fixedImageSize.enable'] = true;
        obj['making.pdf.fixedImageSize.height'] = 2560;
        obj['making.pdf.fixedImageSize.width'] = 1815;
        obj['making.userCss.enable'] = false;
        obj['making.userCss.path'] = '';
        obj[LemeProject.specAllowSpread] = bookSpec.allowSpread;
        obj[LemeProject.specLayout] = 'reflowable';
        obj[LemeProject.specPageProgressionDirection] = bookSpec.pageProgressionDirection;
        obj[LemeProject.specPrimaryWritingMode] = 'horizontal-rl';
        obj[LemeProject.specTextFlowDirection] = bookSpec.textFlowDirection;

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

        let file: vscode.Uri;
        const files = await this._searchLemeFiles(workspaceUri);
        if (files.length <= 1) {
            // oepn
            file = files[0];
        } else {
            // choice by user
            const candidateFiles = files.map(value => {
                return value.fsPath;
            });
            const fileStr = await vscode.window.showQuickPick(candidateFiles, {
                placeHolder: 'Please select a LeME file.',
                title: 'LeME: Select LeME file'
            });
            if (!fileStr) {
                return undefined;
            }
            file = vscode.Uri.file(fileStr);
            await this._setProjectUriHistory(workspaceUri, file);
        }
        // update Status bar
        this.statusBarItem.text = '$(open-editors-view-icon) ' + path.basename(file.fsPath);
        this.statusBarItem.show();

        return file;
    }

    public async makeEbook(
        document: vscode.TextDocument | undefined,
        workspaceFolders: readonly vscode.WorkspaceFolder[] | undefined,
        outputChannel: vscode.OutputChannel
    ): Promise<void> {
        if (!document) {
            return undefined;
        }
        const lemeFileUri = await this._getProjectUri(workspaceFolders, document.uri);
        if (!lemeFileUri) {
            //
            return;
        }
        const config = vscode.workspace.getConfiguration('');
        const lemePath = config.get<string>('lemeWritingStudio.lemeCliExecutablePath');
        if (!lemePath) {
            return;
        }
        const folder = path.dirname(lemePath);
        let command = lemePath;
        command += ' -platform offscreen';
        command += ' --leme-file ' + lemeFileUri.path;
        // eslint-disable-next-line @typescript-eslint/naming-convention
        child_process.exec(command, { env: { LD_LIBRARY_PATH: folder } }, (error, stdout, stderror) => {
            outputChannel.appendLine(stdout);
            outputChannel.appendLine(stderror);
        });
    }

    public async updateWorkspace(document: vscode.TextDocument | undefined,
        workspaceFolders: readonly vscode.WorkspaceFolder[] | undefined,
    ): Promise<vscode.Uri | undefined> {
        if (!document) {
            return undefined;
        }
        const lemeFileUri = await this._getProjectUri(workspaceFolders, document.uri);
        if (!lemeFileUri) {
            this._statusBarItem.hide();
        } else {
            this._statusBarItem.text = '$(open-editors-view-icon) ' + path.basename(lemeFileUri.fsPath);
            this._statusBarItem.show();
        }
        return lemeFileUri;
    }

    private async _getProjectUri(
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
