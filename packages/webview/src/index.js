"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var uuid_js_1 = __importDefault(require("uuid-js"));
var rxjs_1 = require("rxjs");
var rxjs_2 = require("rxjs");
var operators_1 = require("rxjs/operators");
var rxjs_3 = require("rxjs");
var operators_2 = require("rxjs/operators");
var operators_3 = require("rxjs/operators");
var rxjs_4 = require("rxjs");
var operators_4 = require("rxjs/operators");
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
function run(url) {
    ui.layout("\n        <linear w=\"*\" h=\"*\">\n            <webview id=\"webview\" h=\"*\" w=\"*\" />\n        </linear>\n    ");
    webview = ui.webview;
    set = webview.getSettings();
    set.setAllowFileAccessFromFileURLs(false);
    set.setAllowUniversalAccessFromFileURLs(false);
    set.setSupportZoom(false);
    set.setJavaScriptEnabled(true);
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
    webview.loadUrl(url);
    var subject = new rxjs_1.Subject();
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
            return rxjs_2.defer(function () {
                var uuid = uuid_js_1.default.create(4).toString();
                return rxjs_3.zip(subject.pipe(operators_2.filter(function (v) { return v['uuid'] === uuid; }), operators_4.map(function (v) { return v['promise']; }), operators_3.take(1)), rxjs_4.of(false).pipe(operators_1.tap(function () {
                    threadEvents.emit('fn', {
                        uuid: uuid,
                        params: __spreadArrays([fnName], value)
                    });
                }))).pipe(operators_4.map(function (v) { return v[0]; }));
            }).toPromise();
        },
        /**
         * 在webview中执行一个js语句
         * @param js
         */
        runHtmlJS: function (js) {
            return rxjs_2.defer(function () {
                var uuid = uuid_js_1.default.create(4).toString();
                return rxjs_3.zip(subject.pipe(operators_2.filter(function (v) { return v['uuid'] === uuid; }), operators_4.map(function (v) { return v['promise']; }), operators_3.take(1)), rxjs_4.of(false).pipe(operators_1.tap(function () {
                    threadEvents.emit('fn', {
                        uuid: uuid,
                        js: js
                    });
                }))).pipe(operators_4.map(function (v) { return v[0]; }));
            }).toPromise();
        },
        webview: webview
    };
}
exports.run = run;
var WebViewPlugin = {
    install: function (option) {
        importClass(android.webkit.WebView);
        importClass(android.webkit.ValueCallback);
        importClass(android.webkit.WebChromeClient);
        importClass(android.webkit.WebResourceResponse);
        importClass(android.webkit.WebViewClient);
    }
};
exports.default = WebViewPlugin;
