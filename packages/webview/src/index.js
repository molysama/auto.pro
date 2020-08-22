var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import { defer, of, Subject, zip } from "rxjs";
import { filter, map, take, tap } from 'rxjs/operators';
import uuidjs from 'uuid-js';
var log = console.log;
var threadEvents;
var webview;
var set;
var eventList = {};
function runHtmlFunction(fnName) {
    var value = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        value[_i - 1] = arguments[_i];
    }
    return new Promise(function (resolve, reject) {
        webview.evaluateJavascript("javascript:" + fnName + "(..." + JSON.stringify(value) + ")", new JavaAdapter(ValueCallback, {
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
/**
 *
 * @param {string} url html路径
 * @param {object} option 自定义选项
 * @param {string} option.xmlString 自定义界面
 * @param {string} option.webviewId 自定义界面的webviewId，使用自定义时必填，且要与字符串内的webview的id一致
 */
export function run(url, _a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.xmlString, xmlString = _c === void 0 ? "\n    <linear w=\"*\" h=\"*\">\n        <webview id=\"webview\" h=\"*\" w=\"*\" />\n    </linear>\n" : _c, _d = _b.webviewId, webviewId = _d === void 0 ? 'webview' : _d, _e = _b.webviewClientOption, webviewClientOption = _e === void 0 ? {} : _e;
    ui.layout(xmlString);
    webview = ui[webviewId];
    set = webview.getSettings();
    if (url.startsWith('file:')) {
        set.setAllowFileAccess(true);
        set.setAllowFileAccessFromFileURLs(true);
        set.setAllowUniversalAccessFromFileURLs(true);
    }
    else {
        set.setAllowFileAccess(false);
        set.setAllowFileAccessFromFileURLs(false);
        set.setAllowUniversalAccessFromFileURLs(false);
    }
    set.setSupportZoom(false);
    set.setJavaScriptEnabled(true);
    var webcc = new JavaAdapter(WebChromeClient, __assign({ onJsPrompt: function (view, url, fnName, defaultValue, jsPromptResult) {
            var result = call(fnName, defaultValue && JSON.parse(defaultValue));
            jsPromptResult.confirm(result && JSON.stringify(result));
            return true;
        }, onReceivedHttpError: function (view, request, error) {
            log('webview http error', error);
        }, onReceivedError: function (view, errorCode, desc, failingUrl) {
            log('webview error', desc);
        }, onConsoleMessage: function (msg) {
            log(msg.message());
        } }, webviewClientOption));
    webview.setWebChromeClient(webcc);
    webview.loadUrl(url);
    var subject = new Subject();
    // webview的方法必须在同一个线程内执行，因此要用线程间的事件传递
    threadEvents = events.emitter(threads.currentThread());
    threadEvents.on('fn', function (_a) {
        var uuid = _a.uuid, params = _a.params;
        var promise = runHtmlFunction.apply(void 0, params);
        subject.next({
            uuid: uuid,
            promise: promise
        });
    });
    threadEvents.on('js', function (_a) {
        var uuid = _a.uuid, js = _a.js;
        var promise = runHtmlJS(js);
        subject.next({
            uuid: uuid,
            promise: promise
        });
    });
    return {
        on: on,
        off: off,
        /**
         * 执行webview中网页的函数
         * @param fnName 要执行的方法
         * @param value 要传递的参数
         */
        runHtmlFunction: function (fnName) {
            var value = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                value[_i - 1] = arguments[_i];
            }
            return defer(function () {
                var uuid = uuidjs.create(4).toString();
                return zip(subject.pipe(filter(function (v) { return v['uuid'] === uuid; }), map(function (v) { return v['promise']; }), take(1)), of(false).pipe(tap(function () {
                    threadEvents.emit('fn', {
                        uuid: uuid,
                        params: __spreadArrays([fnName], value)
                    });
                }))).pipe(map(function (v) { return v[0]; }));
            }).toPromise();
        },
        /**
         * 在webview中执行一个js语句
         * @param js
         */
        runHtmlJS: function (js) {
            return defer(function () {
                var uuid = uuidjs.create(4).toString();
                return zip(subject.pipe(filter(function (v) { return v['uuid'] === uuid; }), map(function (v) { return v['promise']; }), take(1)), of(false).pipe(tap(function () {
                    threadEvents.emit('js', {
                        uuid: uuid,
                        js: js
                    });
                }))).pipe(map(function (v) { return v[0]; }));
            }).toPromise();
        },
        webview: webview
    };
}
var WebViewPlugin = {
    install: function (option) {
        importClass(android.webkit.WebView);
        importClass(android.webkit.ValueCallback);
        importClass(android.webkit.WebChromeClient);
        importClass(android.webkit.WebResourceResponse);
        importClass(android.webkit.WebViewClient);
    }
};
export default WebViewPlugin;
