//全屏
function toggleFullscreen() {
    if (isFullscreen()) {
        exitFull()
    } else {
       // requestFullScreen(element,isIframe)
    }
}

function isFullscreen() {
    var document
    if(window != top){
        document = parent.document;

    }else{
        document = window.document;
    }
    return document.fullscreenElement || document.webkitFullscreenElement

}


function exitFull() {
    
    var _document;
    var _window;
    if(window != top){
        _document = parent.document;
        _window= parent.window;
    }else{
        _document= window.document;
        _window= window;
    }


    var exitMethod = _document.exitFullscreen || //W3C
        _document.mozCancelFullScreen || //FireFox
        _document.webkitExitFullscreen || //Chrome等
        _document.webkitExitFullscreen; //IE11
    if (exitMethod) {
        exitMethod.call(_document);
    } else if (typeof _window.ActiveXObject !== "undefined") { //for Internet Explorer
        try {
            var wscript = new ActiveXObject("WScript.Shell");
            if (wscript !== null) {
                wscript.SendKeys("{F11}");
            }
        }catch (e) {
            //ie 安全策略不支持
            console.warn("ie 安全策略不支持");
        }

    }
}

