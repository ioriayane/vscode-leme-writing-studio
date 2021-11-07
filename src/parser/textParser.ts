import { TreeItemCollapsibleState } from 'vscode';
import * as parser from './index';

export class TextParser {
    public parse(text: string): parser.Paragraph[] {

        let lines = text.split('\n');
        let document: parser.Paragraph[] = lines.map((line, index) => {
            let para = new parser.Paragraph();
            let items: parser.ParagraphItem[] = [];

            // initial state
            items.push(new parser.ParagraphItemText(line, ''));
            
            items = this._parseImage(items);


            para.items = items;
            return para;
        });

        return document;
    }

    private _parseImage(items: parser.ParagraphItem[]): parser.ParagraphItem[] {
        let retItems: parser.ParagraphItem[] = [];

        items.map((item, index) => {
            if(item.type !== parser.ParagraphItemType.Text){
                retItems.push(item);
                return;
            }

            let reg = /[!！][\[［][^\[\]［］\(（]*[\]］][（\(][^）\)]*[）\)]/g;

            let m = (item as parser.ParagraphItemText).text.match(reg);
            if (!m) {
                retItems.push(item);
                return;
            }
            const splitItems = (item as parser.ParagraphItemText).text.split(reg);
            for(let i=0; i<splitItems.length; i++){
                retItems.push(new parser.ParagraphItemText(splitItems[i], ''));
                if(i < m.length){
                    const splitImageSyntax = m[i].split(/[\]］][（\(]/);
                    retItems.push(new parser.ParagraphItemImage(splitImageSyntax[1].slice(0, -1), ''));
                }
            }
        });

        return retItems;
    }
}
