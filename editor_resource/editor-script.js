
(function () {

    const vscode = acquireVsCodeApi();

    // eslint-disable-next-line no-undef
    window.addEventListener('message', event => {
        const message = event.data; // JSON
        switch (message.command) {
            case 'update':
                update(message.text);
                vscode.setState({ text: message.text });
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
            const elm = document.getElementById(key);
            if (!elm) {
                return;
            }
            console.log(key);
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
        });
    }

    document.getElementById('info.creator1').addEventListener('change', (event) => {
        vscode.postMessage({ command: 'update', key: event.target.id, value: event.target.value });
    });
    document.getElementById('info.creator1Kana').addEventListener('change', (event) => {
        vscode.postMessage({ command: 'update', key: event.target.id, value: event.target.value });
    });
    document.getElementById('info.creator2').addEventListener('change', (event) => {
        vscode.postMessage({ command: 'update', key: event.target.id, value: event.target.value });
    });
    document.getElementById('info.creator2Kana').addEventListener('change', (event) => {
        vscode.postMessage({ command: 'update', key: event.target.id, value: event.target.value });
    });
    document.getElementById('info.identifier').addEventListener('change', (event) => {
        vscode.postMessage({ command: 'update', key: event.target.id, value: event.target.value });
    });
    document.getElementById('info.language').addEventListener('change', (event) => {
        vscode.postMessage({ command: 'update', key: event.target.id, value: parseInt(event.target.value) });   // select
    });
    document.getElementById('info.publisher').addEventListener('change', (event) => {
        vscode.postMessage({ command: 'update', key: event.target.id, value: event.target.value });
    });
    document.getElementById('info.publisherKana').addEventListener('change', (event) => {
        vscode.postMessage({ command: 'update', key: event.target.id, value: event.target.value });
    });
    document.getElementById('info.title').addEventListener('change', (event) => {
        vscode.postMessage({ command: 'update', key: event.target.id, value: event.target.value });
    });
    document.getElementById('info.titleKana').addEventListener('change', (event) => {
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


    const state = vscode.getState();
    if (state) {
        update(state.text);
    }
}());