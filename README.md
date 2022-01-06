# LeME Writing Studio

(English follows Japanese)

## 概要

小説などの原稿執筆をサポートするExtensionです。

[電書籍作成ソフトLeME](https://leme.style/)で変換できる原稿のプレビューに対応しています。

### 機能一覧

- 原稿のプレビュー（[書式詳細](https://leme.style/making-guide/point-text/)）
- LeMEファイル(*.leme)の新規作成・編集
- 電子書籍(EPUB)の作成（別途LeMEのインストールが必要）
- ステータスバーへ情報の表示
  - ワークスペース内のLeMEファイルの表示
  - 行数と文字数の表示
- 原稿執筆のサポート機能
  - シンタックスハイライト
  - ルビの入力サポート
  - 日本語テキスト向けのワードジャンプ
- 見出しのアウトライン一覧

---

## 原稿のプレビュー

電子書籍（epub）に変換した結果をプレビューできます。

最終的な出来上がりの確認は出版するストアのリーダーアプリにて確認してください。

![preview](https://github.com/ioriayane/vscode-leme-writing-studio/raw/main/images/preview.png)

### 表示方法

- コマンドパレット（Ctrl+Shift+P）で`LeME: Preview`を選択
- テキストファイルの編集画面を右クリックし`LeME: Preview`を選択

### プレビュー内容について

書字方向（縦書き・横書き）や書式（ルビや太字など）の反映対象はワークスペース内のLeMEファイル（*.leme）の設定を使用します。

テキストファイルのカーソル位置がプレビュー内でハイライトされ、表示位置も連動して移動します。

[LeMEのサイトで解説している書式](https://leme.style/making-guide/point-text/)が反映されて表示されます。

---

## LeMEファイル(*.leme)の新規作成・編集

### LeMEファイル(*.leme)の新規作成

コマンドパレット（Ctrl+Shift+P）で`LeME: New LeME file(*.leme)`を選択します。

リフロー形式の電子書籍向けの設定でLeMEファイルが作成されます。

### LeMEファイル(*.leme)の編集

LeMEファイルを開くと専用のエディタが表示されます。ステータスバーに表示されているLeMEファイルをクリックしても表示されます。

LeMEで作成したファイルも編集できます。Extensionで編集できる項目以外は元の状態を維持します。

![edit leme file](https://github.com/ioriayane/vscode-leme-writing-studio/raw/main/images/edit_lemefile.png)

LeMEファイル内の`Book Specification`の`Text flow direction`の選択内容に応じてプレビューの縦書きと横書きが切り替わります。

※ 保存すると反映されます。

![leme file spec](https://github.com/ioriayane/vscode-leme-writing-studio/raw/main/images/edit_lemefile_spec.png)

書式（ルビや太字など）の反映も同様です。

※ 保存すると反映されます。

![leme file formatting](https://github.com/ioriayane/vscode-leme-writing-studio/raw/main/images/edit_lemefile_formatting.png)

---

## 電子書籍(EPUB)の作成

### 準備

1. 設定（Shift+,）で`leme`で検索
2. `Leme Writing Studio: Leme Cli Executable Path`にLeMEのCLI版のパスを指定

![setting cli](https://github.com/ioriayane/vscode-leme-writing-studio/raw/main/images/setting_cli.png)

設定例：

- Windows : `C:\Program Files\LeME\LeMEcli.exe`
- Linux : `/home/user/LeME/build-leme_cli/src/LeMEcli`
- MacOS : `/Users/user/Applications/LeME/LeME.app/Contents/MacOS/LeMEcli`

### 変換実行

コマンドパレット（Ctrl+Shift+P）で`LeME: Make an ebook(*.epub)`を選択します。

## ステータスバーへ情報の表示

テキストファイルを表示しているときに下記の情報を表示します。

- ワークスペース内のLeMEファイル名
- TL : 合計行数
- TC : 合計文字数

![status bar](https://github.com/ioriayane/vscode-leme-writing-studio/raw/main/images/statusbar_info.png)

ワークスペース内に複数のLeMEファイルが存在しているときに、LeMEファイル名をクリックすると選択できます。

プレビューの内容は選択しているLeMEファイルの設定が反映されます。

## 原稿執筆のサポート機能

### サポート機能の準備

サポート機能を使用するためには言語設定を`LeME Text`に設定する必要があります。

ウインドウ右下の`Plain Text`と表示されているところをクリック（Ctrl+K M）して`leme`と入力してでてくる候補を選択します。

![language change](https://github.com/ioriayane/vscode-leme-writing-studio/raw/main/images/language_change.gif)

この設定は開いているファイル単位になるため、設定（Ctrl+,）で`Files: Associations`に登録すると便利です。`associations`で検索するとでてきます。

![setting file associations](https://github.com/ioriayane/vscode-leme-writing-studio/raw/main/images/setting_file_associations.png)

### シンタックスハイライト

[LeMEのサイトで解説している書式](https://leme.style/making-guide/point-text/)がハイライトされます。

### ルビの入力サポート

送り仮名や助詞まで入力した状態でCtrl+Rを入力するとルビの入力モードにはいります。その際、直前の漢字のかたまりがルビを付加する候補となります。

予め選択している状態でCtrl+Rを入力した場合は選択対象がルビの付加対象になります。

![support ruby](https://github.com/ioriayane/vscode-leme-writing-studio/raw/main/images/support_ruby.gif)

### 日本語テキスト向けのワードジャンプ

Visual Studio Codeでは日本語の文中でCtrl+左右カーソルを押すと文頭か文末までジャンプしてしまいますが、漢字・かな・記号の区切りでジャンプするようになります。

### 見出しのアウトライン一覧

言語設定を`LeME Text`にしていると`見出し(#)`と`画像`が表示されます。

![support outline](https://github.com/ioriayane/vscode-leme-writing-studio/raw/main/images/support_outline.png)

## Overview

This is an extension to support the writing of novels and other manuscripts.

It supports previewing manuscripts that can be converted by [LeME, an e-book creation software](https://leme.style/).

### Function list

- Preview of the manuscript (formatting details)
- Create and edit new LeME files (*.leme)
- Create an eBook (EPUB) (LeME must be installed separately)
- Display information in the status bar
  - Display of LeME files in the workspace
  - Display of the number of lines and characters
- Manuscript writing supports
  - Syntax highlighting
  - Ruby typing assistance
  - Word jump for Japanese text
- List of headline outlines

---

## Preview a manuscript

You can preview the result of converting your manuscript into an ebook (epub).

To check the final result, please use the reader application of the publishing store.

![preview](https://github.com/ioriayane/vscode-leme-writing-studio/raw/main/images/preview.png)

### Display method

- Select `LeME: Preview` from the command palette(Ctrl+Shift+P)
- Right-click on the text file editing window and select `LeME: Preview`

### About the preview

The settings in the LeME file (*.leme) in the workspace are used to reflect the writing direction (vertical or horizontal) and formatting (ruby, bold, etc.).

The cursor position in the text file will be highlighted in the preview, and the display position will move with it.

[The formatting described on the LeME website](https://leme.style/making-guide/point-text/) will be reflected in the display.

---

## Creating and editing a new LeME file (*.leme)

### Creating a new LeME file (*.leme)

Select `LeME: New LeME file(*.leme)` from the command palette (Ctrl+Shift+P).

A LeME file will be created with the settings for reflow format ebooks.

### Editing a LeME file (*.leme)

When you open a LeME file, a special editor will appear. You can also click on a LeME file in the status bar to display it.

Files created with LeME can also be edited, except for items that can be edited with Extensions, which remain in their original state.

![edit leme file](https://github.com/ioriayane/vscode-leme-writing-studio/raw/main/images/edit_lemefile.png)

Depending on the selection of `Text flow direction` in the `Book Specification` of the LeME file, the vertical or horizontal writing mode of the preview will be switched.

This is reflected when you save the file.

![leme file spec](https://github.com/ioriayane/vscode-leme-writing-studio/raw/main/images/edit_lemefile_spec.png)

The same is true for formatting (ruby, bold, etc.).

This is reflected when you save the file.

![leme file formatting](https://github.com/ioriayane/vscode-leme-writing-studio/raw/main/images/edit_lemefile_formatting.png)

---

## Creating an eBook (EPUB)

### Preparation

1. Search for `leme` in Settings (Shift+,)
1. Specify the path to the CLI version of LeME in `Leme Writing Studio: Leme Cli Executable Path`.

![setting cli](https://github.com/ioriayane/vscode-leme-writing-studio/raw/main/images/setting_cli.png)

Configuration example :

- Windows : `C:\Program Files\LeME\LeMEcli.exe`
- Linux : `/home/user/LeME/build-leme_cli/src/LeMEcli`
- MacOS : `/Users/user/Applications/LeME/LeME.app/Contents/MacOS/LeMEcli`

### Conversion execution

Select `LeME: Make an ebook(*.epub)` in the command palette (Ctrl+Shift+P).

## Display information in the status bar

Displays the following information when a text file is being displayed.

- Name of the LeME file in the workspace
- TL : Total number of lines
- TC : Total number of characters

![status bar](https://github.com/ioriayane/vscode-leme-writing-studio/raw/main/images/statusbar_info.png)

When there are multiple LeME files in the workspace, click on the LeME file name to select it.

The contents of the preview will reflect the settings of the selected LeME file.

## Manuscript writing supports

### Prepare support functions

The language setting must be set to `LeME Text` in order to use the support functions.

Click on `Plain Text` in the lower right corner of the window (Ctrl+K M), type `leme` and select the suggestions that come up.

![language change](https://github.com/ioriayane/vscode-leme-writing-studio/raw/main/images/language_change.gif)

Since this setting is per open file, it is useful to register it in `Files: Associations` in the settings (Ctrl+,). You can find it by searching for `associations`.

![setting file associations](https://github.com/ioriayane/vscode-leme-writing-studio/raw/main/images/setting_file_associations.png)

### Syntax highlight

[The format described on the LeME website](https://leme.style/making-guide/point-text/) will be highlighted.

### Ruby input support

If you type Ctrl+R after inputting the kana or particle, you will enter the ruby input mode. In this case, the previous chunk of kanji will be used as a candidate for adding the ruby.

If you press Ctrl+R while a kanji is already selected, the selected target will be used as a candidate for adding the ruby.

![support ruby](https://github.com/ioriayane/vscode-leme-writing-studio/raw/main/images/support_ruby.gif)

### Word jump for Japanese text

In Visual Studio Code, if you press Ctrl + left/right cursor in a Japanese sentence, it will jump to the beginning or the end of the sentence, but it will jump by separating kanji, kana, and symbols.

### List of headline outlines

If the language setting is set to `LeME Text`, `headings` and `images` will be displayed.

![support outline](https://github.com/ioriayane/vscode-leme-writing-studio/raw/main/images/support_outline.png)
