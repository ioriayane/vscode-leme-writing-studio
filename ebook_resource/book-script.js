
(function () {
    const mainDiv = document.getElementById('preview_main_content');

    // Handle the message inside the webview
    window.addEventListener('message', event => {
        const message = event.data; // JSON
        switch(message.command){
            case 'update':
                mainDiv.innerHTML = message.body;
                break;
        }
    });
}());