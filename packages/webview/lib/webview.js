'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var log = console.log;
var webview;
var set;
var eventList = {};
function runHtmlFunction(fnName, value) {
    return new Promise(function (resolve, reject) {
        webview.evaluateJavascript("javascript:" + fnName + "(" + value + ")", new JavaAdapter(ValueCallback, {
            onReceiveValue: function (result) {
                resolve(result);
            },
            onReceivedError: function (error) {
                reject(error);
            }
        }));
    });
}
function runHtmlJS(propertyName) {
    return new Promise(function (resolve, reject) {
        webview.evaluateJavascript("javascript:" + propertyName, new JavaAdapter(ValueCallback, {
            onReceiveValue: function (result) {
                resolve(result);
            },
            onReceivedError: function (error) {
                reject(error);
            }
        }));
    });
}
function on(eventName, callback) {
    eventList[eventName] = callback;
}
function off(eventName) {
    delete eventList[eventName];
}
function call(eventName) {
    var params = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        params[_i - 1] = arguments[_i];
    }
    var cb = eventList[eventName];
    if (cb) {
        return cb.apply(void 0, params);
    }
    else {
        return null;
    }
}
function run(url) {
    ui.layout("\n        <linear w=\"*\" h=\"*\">\n            <webview id=\"webview\" h=\"*\" w=\"*\" />\n        </linear>\n    ");
    webview = ui.webview;
    set = webview.getSettings();
    set.setAllowFileAccessFromFileURLs(false);
    set.setAllowUniversalAccessFromFileURLs(false);
    set.setSupportZoom(false);
    set.setJavaScriptEnabled(true);
    webview.loadUrl(url);
    var webcc = new JavaAdapter(WebChromeClient, {
        onJsPrompt: function (view, url, fnName, defaultValue, jsPromptResult) {
            var result = call(fnName, defaultValue && JSON.parse(defaultValue));
            jsPromptResult.confirm(result && JSON.stringify(result));
            return true;
        },
        onReceivedHttpError: function (view, request, error) {
            log('webview http error', error);
        },
        onReceivedError: function (view, errorCode, desc, failingUrl) {
            log('webview error', desc);
        },
        onConsoleMessage: function (msg) {
            log(msg.message());
        }
    });
    webview.setWebChromeClient(webcc);
    return {
        on: on,
        off: off,
        runHtmlFunction: runHtmlFunction,
        runHtmlJS: runHtmlJS,
        webview: webview
    };
}
var index = {
    install: function (option) {
        importClass(android.webkit.WebView);
        importClass(android.webkit.ValueCallback);
        importClass(android.webkit.WebChromeClient);
        importClass(android.webkit.WebResourceResponse);
        importClass(android.webkit.WebViewClient);
    }
};

exports.default = index;
exports.run = run;
