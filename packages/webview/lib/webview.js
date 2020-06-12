'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var uuidjs = _interopDefault(require('uuidjs'));
var rxjs = require('rxjs');
var operators = require('rxjs/operators');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

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
    var subject = new rxjs.Subject();
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
            return rxjs.defer(function () {
                var uuid = uuidjs.generate();
                return rxjs.zip(subject.pipe(operators.filter(function (v) { return v['uuid'] === uuid; }), operators.map(function (v) { return v['promise']; }), operators.take(1)), rxjs.of(false).pipe(operators.tap(function () {
                    threadEvents.emit('fn', {
                        uuid: uuid,
                        params: __spreadArrays([fnName], value)
                    });
                }))).pipe(operators.map(function (v) { return v[0]; }));
            }).toPromise();
        },
        /**
         * 在webview中执行一个js语句
         * @param js
         */
        runHtmlJS: function (js) {
            return rxjs.defer(function () {
                var uuid = uuidjs.generate();
                return rxjs.zip(subject.pipe(operators.filter(function (v) { return v['uuid'] === uuid; }), operators.map(function (v) { return v['promise']; }), operators.take(1)), rxjs.of(false).pipe(operators.tap(function () {
                    threadEvents.emit('fn', {
                        uuid: uuid,
                        js: js
                    });
                }))).pipe(operators.map(function (v) { return v[0]; }));
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

exports.default = WebViewPlugin;
exports.run = run;
