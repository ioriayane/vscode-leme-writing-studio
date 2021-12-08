
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
            if (elm) {
                if (elm.value !== json[key]) {
                    elm.value = json[key];
                }
            }
        });
    }

    document.getElementById('spec.textFlowDirection').addEventListener('change', (event) => {
        vscode.postMessage({ command: 'update', key: event.target.id, value: event.target.value });
    });


    const state = vscode.getState();
    if (state) {
        update(state.text);
    }
}());