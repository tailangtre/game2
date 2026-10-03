/**
 * Created by zhangrunfu on 17/10/19.
 */
(function () {

    function JsLoader(baseUrl, list, callback, progressCallback) {
        this.debug = false;
        this.baseUrl = baseUrl;
        this.callback = callback;
        this.progressCallback = progressCallback;
        this.jsQueue = null;
        if (null != list && list.length > 0) {
            this.jsQueue = list;
        } else {
            this.jsQueue = [
                "libs/puremvc-1.0.1.min.js",
                "utils/chance.js",
                "utils/map.js",
                "utils/stack.js",
                "utils/utils.js",
                "libs/clone.js",
                "libs/js-big-decimal.min.js",
                "libs/numeral.min.js",
                "utils/message-solid.js",
                "utils/fullScreen.js",
                "libs/TweenMax.js",
                "libs/SimpleDataFormat.js"
            ];
        }
    }

    JsLoader.prototype.startLoad = function () {
        this.seriesLoadScripts(this.jsQueue, this.callback, this.progressCallback, this.debug, this.baseUrl);
    };
    JsLoader.prototype.seriesLoadScripts = function (scripts, callback, progressCallback, debug, baseUrl) {
        if (typeof (scripts) != "object") var scripts = [scripts];
        var HEAD = document.getElementsByTagName("head").item(0) || document.documentElement;
        var s = new Array(), last = scripts.length - 1, recursiveLoad = function (i) {
            s[i] = document.createElement("script");
            s[i].setAttribute("type", "text/javascript");
            s[i].onload = s[i].onreadystatechange = function () { //Attach handlers for all browsers
                if (!/*@cc_on!@*/0 || this.readyState == "loaded" || this.readyState == "complete") {
                    this.onload = this.onreadystatechange = null; this.parentNode.removeChild(this);
                    if (typeof (progressCallback) == "function") {
                        progressCallback(Math.round(((i + 1) / scripts.length) * 100), i + 1, scripts.length);
                    }
                    if (i != last) recursiveLoad(i + 1); else if (typeof (callback) == "function") callback();
                }
            }
            var url = baseUrl + scripts[i];
            if (url.indexOf("libs") == -1 && url.indexOf("utils") == -1) {
                // if (GlobalClass.GAME_DEBUG) {
                //     url += "?" + Math.random();
                // }
                // else {
                    url += "?" + GlobalClass.GAME_VERSION;
                // }
            }
            s[i].setAttribute("src", url);
            // console.log("loading " + url);
            HEAD.appendChild(s[i]);
        };
        recursiveLoad(0);
    };

    if (typeof window === "object" && typeof window.document === "object") {
        window.JsLoader = JsLoader;
    };



})();
