
(function () {
    const mainDiv = document.getElementById('preview_main_content');

    window.addEventListener('message', event => {
        const message = event.data; // JSON
        switch(message.command){
            case 'update':
                mainDiv.innerHTML = message.body;
                scrollUpdate();
                break;
        }
    });

    function scrollUpdate(){
        var scrollMark = document.getElementById('scroll_mark');
        if(mainDiv && scrollMark){
            if(document.documentElement.classList.contains('vrtl')){
                // vertical
                window.scroll(-1 * (mainDiv.clientWidth - scrollMark.offsetLeft - window.innerWidth * 0.75), 0);
            }else{
                // horizontal
                window.scroll(0, scrollMark.offsetTop - window.innerHeight * 0.75);
            }
        }
    }
}());