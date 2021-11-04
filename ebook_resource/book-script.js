
(function () {
    console.log('preview html');
    const main_div = document.getElementById('preview_main_content');

    // Handle the message inside the webview
    window.addEventListener('message', event => {
        console.log('message listen');
        const message = event.data; // The JSON data our extension sent
        main_div.innerHTML = message.body;
    });
}());