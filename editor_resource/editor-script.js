
(function () {

    const vscode = acquireVsCodeApi();

    // eslint-disable-next-line no-undef
    window.addEventListener('message', event => {
        const message = event.data; // JSON
        switch (message.command) {
            case 'update':
                update(message.text);
                break;
        }
    });

    function update(/** @type {string} */ text) {
        let json;
        try {
            if (text.trim().length === 0) {
                text = '{}';
            }
            json = JSON.parse(text);
        } catch {
            return;
        }
        const keys = Object.keys(json);
        keys.forEach(key => {
            if (key === 'contents') {
                const tempParent = document.getElementById('contents');
                // clear children
                const parent = tempParent.cloneNode(false);
                tempParent.parentNode.replaceChild(parent, tempParent);
                // append children
                json[key].forEach((obj, index) => appendContentItem(parent, obj, index));
            } else {
                updateSettingItem(key, json);
            }
        });
    }

    function appendContentItem(parent, obj, index) {
        // console.log(obj['type'] + ':' + obj['path']);
        // make 
        const rootDiv = document.createElement('div');
        parent.appendChild(rootDiv);

        if (index === 0) {
            rootDiv.className = 'content-first';
        } else {
            rootDiv.className = 'content';
        }

        const div = document.createElement('div');
        rootDiv.appendChild(div);

        let text = (index + 1) + ' : ';
        // book.ContentType
        // Blank = 0,
        // Word = 1,
        // Text = 2,
        // Image = 3,
        // Toc = 4,
        // Unknown = 5,
        // Pdf = 6,
        // Markdown = 7,
        switch (obj['type']) {
            case 0:
                text += 'Blank';
                break;
            case 1:
                text += 'Word : ' + obj['path'];
                break;
            case 2:
                text += 'Text : ' + obj['path'];
                // image handling
                appendContentItemControlSelect(rootDiv, 5, index, obj);
                break;
            case 3:
                if (obj['cover']) {
                    text += 'Cover : ' + obj['path'];
                } else {
                    text += 'Image : ' + obj['path'];
                }
                // Cover checkbox
                appendContentItemControlInput(rootDiv, 4, index, obj);
                break;
            case 4:
                text += 'Table of contents';
                break;
            case 6:
                text += 'PDF : ' + obj['path'];
                break;
            case 7:
                text += 'Markdown : ' + obj['path'];
                break;
            default:
                text += 'Unknown : ' + obj['path'];
                break;
        }
        div.innerText = text;
        div.style = 'float: left';

        // Up button
        appendContentItemControlInput(rootDiv, 0, index, obj);
        // Down button
        appendContentItemControlInput(rootDiv, 1, index, obj);
        // Delete button
        appendContentItemControlInput(rootDiv, 2, index, obj);

    }

    function appendContentItemControlInput(parent, command, index, obj) {
        const input = document.createElement('input');
        parent.appendChild(input);

        input.id = 'contentItem-' + index;
        switch (command) {
            case 0:
                // Up
                input.type = 'button';
                input.value = 'Up';
                input.addEventListener('click', (event) => {
                    vscode.postMessage({
                        command: 'contents-item-up',
                        key: event.target.id.replace('contentItem-', ''),
                        value: ''
                    });
                });
                break;
            case 1:
                // Down
                input.type = 'button';
                input.value = 'Down';
                input.addEventListener('click', (event) => {
                    vscode.postMessage({
                        command: 'contents-item-down',
                        key: event.target.id.replace('contentItem-', ''),
                        value: ''
                    });
                });
                break;
            case 2:
                // Delete
                input.type = 'button';
                input.value = 'Del';
                input.addEventListener('click', (event) => {
                    vscode.postMessage({
                        command: 'contents-item-delete',
                        key: event.target.id.replace('contentItem-', ''),
                        value: ''
                    });
                });
                break;
            case 3:
                // toc (reserved)
                break;
            case 4:
                // is cover
                {
                    input.type = 'checkbox';
                    input.checked = obj['cover'];
                    input.addEventListener('click', (event) => {
                        vscode.postMessage({
                            command: 'contents-item-cover',
                            key: event.target.id.replace('contentItem-', ''),
                            value: event.target.checked
                        });
                    });
                    const label = document.createElement('label');
                    parent.appendChild(label);
                    label.for = input.id;
                    label.innerText = 'is cover';
                    break;
                }
            case 5:
                // image handling (reserved)
                break;
            case 6:
                // blank page(reserved)
                break;
        }
    }

    function appendContentItemControlSelect(parent, command, index, obj) {
        // label
        const span = document.createElement('span');
        parent.appendChild(span);
        // select
        const select = document.createElement('select');
        parent.appendChild(select);

        select.id = 'contentItem-' + index;
        select.className = 'small';
        switch (command) {
            case 5:
                // image handling
                {
                    // label
                    span.innerText = 'Image handling : ';
                    // selecting items
                    const optValues = ['None', 'Fix', 'Scroll'];
                    optValues.forEach((value, i) => {
                        const option = document.createElement('option');
                        select.appendChild(option);
                        option.value = i;
                        option.innerText = value;
                        if ('imageHandling' in obj) {
                            if (i === obj['imageHandling']) {
                                option.selected = true;
                            }
                        }
                    });
                    select.addEventListener('change', (event) => {
                        vscode.postMessage({
                            command: 'contents-item-image-handling',
                            key: event.target.id.replace('contentItem-', ''),
                            value: parseInt(event.target.value)
                        });
                    });
                    break;
                }
        }
    }

    function updateSettingItem(key, json) {
        const elm = document.getElementById(key);
        if (!elm) {
            return;
        }
        // console.log(key);
        // console.log(elm);
        // console.log(elm.tagName);
        switch (elm.tagName.toLowerCase()) {
            case 'select':
                if (elm.value !== json[key]) {
                    elm.value = json[key];
                }
                break;
            case 'input':
                if (elm.type === 'checkbox') {
                    if (elm.checked !== json[key]) {
                        elm.checked = json[key];
                    }
                } else {
                    if (elm.value !== json[key]) {
                        elm.value = json[key];
                    }
                }
                break;
        }
    }

    document.getElementById('contents-add-item').addEventListener('click', (event) => {
        vscode.postMessage({ command: 'contents-add-item', key: '', value: '' });
    });
    document.getElementById('contents-add-toc').addEventListener('click', (event) => {
        vscode.postMessage({ command: 'contents-add-toc', key: '', value: '' });
    });
    document.getElementById('contents-add-blank').addEventListener('click', (event) => {
        vscode.postMessage({ command: 'contents-add-blank', key: '', value: '' });
    });


    document.getElementById('info.creator1').addEventListener('input', (event) => {
        vscode.postMessage({ command: 'update', key: event.target.id, value: event.target.value });
    });
    document.getElementById('info.creator1Kana').addEventListener('input', (event) => {
        vscode.postMessage({ command: 'update', key: event.target.id, value: event.target.value });
    });
    document.getElementById('info.creator2').addEventListener('input', (event) => {
        vscode.postMessage({ command: 'update', key: event.target.id, value: event.target.value });
    });
    document.getElementById('info.creator2Kana').addEventListener('input', (event) => {
        vscode.postMessage({ command: 'update', key: event.target.id, value: event.target.value });
    });
    document.getElementById('info.identifier').addEventListener('input', (event) => {
        vscode.postMessage({ command: 'update', key: event.target.id, value: event.target.value });
    });
    document.getElementById('info.language').addEventListener('change', (event) => {
        vscode.postMessage({ command: 'update', key: event.target.id, value: event.target.value });   // select
    });
    document.getElementById('info.publisher').addEventListener('input', (event) => {
        vscode.postMessage({ command: 'update', key: event.target.id, value: event.target.value });
    });
    document.getElementById('info.publisherKana').addEventListener('input', (event) => {
        vscode.postMessage({ command: 'update', key: event.target.id, value: event.target.value });
    });
    document.getElementById('info.title').addEventListener('input', (event) => {
        vscode.postMessage({ command: 'update', key: event.target.id, value: event.target.value });
    });
    document.getElementById('info.titleKana').addEventListener('input', (event) => {
        vscode.postMessage({ command: 'update', key: event.target.id, value: event.target.value });
    });


    document.getElementById('spec.allowSpread').addEventListener('change', (event) => {
        vscode.postMessage({ command: 'update', key: event.target.id, value: event.target.checked });
    });
    document.getElementById('spec.pageProgressionDirection').addEventListener('change', (event) => {
        vscode.postMessage({ command: 'update', key: event.target.id, value: event.target.value });
    });
    document.getElementById('spec.textFlowDirection').addEventListener('change', (event) => {
        vscode.postMessage({ command: 'update', key: event.target.id, value: event.target.value });
    });


    document.getElementById('making.convertSpaceToEnspace').addEventListener('change', (event) => {
        vscode.postMessage({ command: 'update', key: event.target.id, value: event.target.checked });
    });
    document.getElementById('making.enableHyperLink').addEventListener('change', (event) => {
        vscode.postMessage({ command: 'update', key: event.target.id, value: event.target.checked });
    });
    document.getElementById('making.epubPath').addEventListener('input', (event) => {
        vscode.postMessage({ command: 'update', key: event.target.id, value: event.target.value });
    });


    document.getElementById('making.format.text.advanceMode').addEventListener('change', (event) => {
        vscode.postMessage({ command: 'update', key: event.target.id, value: event.target.checked });
    });
    document.getElementById('making.format.text.bold').addEventListener('change', (event) => {
        vscode.postMessage({ command: 'update', key: event.target.id, value: event.target.checked });
    });
    document.getElementById('making.format.text.border').addEventListener('change', (event) => {
        vscode.postMessage({ command: 'update', key: event.target.id, value: event.target.checked });
    });
    document.getElementById('making.format.text.emMark').addEventListener('change', (event) => {
        vscode.postMessage({ command: 'update', key: event.target.id, value: event.target.checked });
    });
    document.getElementById('making.format.text.emMark2').addEventListener('change', (event) => {
        vscode.postMessage({ command: 'update', key: event.target.id, value: event.target.checked });
    });
    document.getElementById('making.format.text.emMarkComma').addEventListener('change', (event) => {
        vscode.postMessage({ command: 'update', key: event.target.id, value: event.target.checked });
    });
    document.getElementById('making.format.text.firstLineHeading').addEventListener('change', (event) => {
        vscode.postMessage({ command: 'update', key: event.target.id, value: event.target.checked });
    });
    document.getElementById('making.format.text.heading').addEventListener('change', (event) => {
        vscode.postMessage({ command: 'update', key: event.target.id, value: event.target.checked });
    });
    document.getElementById('making.format.text.horizontalRule').addEventListener('change', (event) => {
        vscode.postMessage({ command: 'update', key: event.target.id, value: event.target.checked });
    });
    document.getElementById('making.format.text.image').addEventListener('change', (event) => {
        vscode.postMessage({ command: 'update', key: event.target.id, value: event.target.checked });
    });
    document.getElementById('making.format.text.italic').addEventListener('change', (event) => {
        vscode.postMessage({ command: 'update', key: event.target.id, value: event.target.checked });
    });
    document.getElementById('making.format.text.pageBreak').addEventListener('change', (event) => {
        vscode.postMessage({ command: 'update', key: event.target.id, value: event.target.checked });
    });
    document.getElementById('making.format.text.paragraphAlign').addEventListener('change', (event) => {
        vscode.postMessage({ command: 'update', key: event.target.id, value: event.target.checked });
    });
    document.getElementById('making.format.text.paragraphIndent').addEventListener('change', (event) => {
        vscode.postMessage({ command: 'update', key: event.target.id, value: event.target.checked });
    });
    document.getElementById('making.format.text.rubyAngle').addEventListener('change', (event) => {
        vscode.postMessage({ command: 'update', key: event.target.id, value: event.target.checked });
    });
    document.getElementById('making.format.text.rubyParen').addEventListener('change', (event) => {
        vscode.postMessage({ command: 'update', key: event.target.id, value: event.target.checked });
    });
    document.getElementById('making.format.text.eraseConsecutiveBlankLine').addEventListener('change', (event) => {
        vscode.postMessage({ command: 'update', key: event.target.id, value: event.target.checked });
    });
    document.getElementById('making.format.text.tcy').addEventListener('change', (event) => {
        vscode.postMessage({ command: 'update', key: event.target.id, value: event.target.checked });
    });


    // vscode.setState(), vscode.getStte()を使わない理由
    // CustomEditorで編集して保存しない状態でVSCodeを終了して再度開くと
    // 編集中の状態を復元してしまうが、実ファイルの編集内容は破棄されていて
    // 内容が食い違うから
    vscode.postMessage({ command: 'loaded', key: '', value: '' });
}());