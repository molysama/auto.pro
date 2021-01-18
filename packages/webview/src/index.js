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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@auto.pro/core", "rxjs", "rxjs/operators", "uuid-js"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.run = void 0;
    importClass(android.webkit.WebView);
    importClass(android.webkit.ValueCallback);
    importClass(android.webkit.WebChromeClient);
    importClass(android.webkit.WebResourceResponse);
    importClass(android.webkit.WebViewClient);
    var core_1 = require("@auto.pro/core");
    var rxjs_1 = require("rxjs");
    var operators_1 = require("rxjs/operators");
    var uuid_js_1 = __importDefault(require("uuid-js"));
    /**
     * @param {string} url  html路径
     * @param {WebViewOption} option  自定义
     * @param {string} option.xmlString 自定义界面
     * @param {string} option.webviewId 自定义界面的webviewId，使用自定义界面时必填，且要与界面字符串内webview的id一致
     * @param {Object} option.webviewObject 可以自主传入webview对象，使用此选项时无法再自定义界面
     * @param {Object} option.chromeClientOption JavaAdapter.WebChromeClient的回调拓展对象，可重写其事件
     * @param {Object} option.webviewClientOption JavaAdapter.WebViewClient的回调拓展对象，可重写其事件
     * @param {Function} option.afterLayout 紧接着布局初始化的钩子函数
     */
    function run(url, _a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.xmlString, xmlString = _c === void 0 ? "\n    <linear w=\"*\" h=\"*\">\n        <webview id=\"webview\" h=\"*\" w=\"*\" />\n    </linear>\n" : _c, _d = _b.webviewId, webviewId = _d === void 0 ? 'webview' : _d, _e = _b.webviewObject, webviewObject = _e === void 0 ? null : _e, _f = _b.chromeClientOption, chromeClientOption = _f === void 0 ? {} : _f, _g = _b.webviewClientOption, webviewClientOption = _g === void 0 ? {} : _g, _h = _b.afterLayout, afterLayout = _h === void 0 ? function () { } : _h;
        // 每个webview对象都有其唯一UID，便于处理自身事件
        var WEBVIEW_UID = uuid_js_1.default.create(4).toString();
        var webview;
        if (webviewObject) {
            webview = webviewObject;
            afterLayout();
        }
        else {
            ui.layout(xmlString);
            afterLayout();
            webview = ui[webviewId];
        }
        var set = webview.getSettings();
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
        // webview执行html方法时必须在主线程执行，因此要用线程间的事件传递
        core_1.effectEvent.on(WEBVIEW_UID, function (uuid, js) {
            ui.run(function () {
                webview.evaluateJavascript(js, new JavaAdapter(ValueCallback, {
                    onReceiveValue: function (result) {
                        core_1.effectEvent.emit(uuid, result);
                    },
                    onReceivedError: function (error) {
                        core_1.effectEvent.emit(uuid, error);
                    }
                }));
            });
        });
        function runHtmlFunction(fnName) {
            var value = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                value[_i - 1] = arguments[_i];
            }
            var js = "javascript:" + fnName + "(..." + JSON.stringify(value) + ")";
            return getHtmlResult(js);
        }
        function runHtmlJS(propertyName) {
            var js = "javascript:" + propertyName;
            return getHtmlResult(js);
        }
        function getHtmlResult(js) {
            var uuid = uuid_js_1.default.create(4).toString();
            core_1.effectEvent.emit(WEBVIEW_UID, uuid, js);
            return rxjs_1.fromEvent(core_1.effectEvent, uuid).pipe(operators_1.take(1));
        }
        var webcc = new JavaAdapter(WebChromeClient, __assign({ onJsPrompt: function (view, url, fnName, defaultValue, jsPromptResult) {
                var param = defaultValue && JSON.parse(defaultValue);
                // 如果param的参数中存在PROMPT_CALLBACK，说明是回调型事件，直接返回空值
                if (param && param['PROMPT_CALLBACK']) {
                    jsPromptResult.confirm(undefined);
                    if (core_1.effectEvent.listenerCount(fnName + WEBVIEW_UID) > 0) {
                        core_1.effectEvent.emit(fnName + WEBVIEW_UID, param, function () {
                            var param = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                param[_i] = arguments[_i];
                            }
                            ui.run(function () {
                                webview.evaluateJavascript("javascript:" + param['PROMPT_CALLBACK'] + "(..." + JSON.stringify(param) + ")", new JavaAdapter(ValueCallback, {
                                    onReceiveValue: function (result) {
                                    },
                                    onReceivedError: function (error) {
                                    }
                                }));
                            });
                        });
                    }
                }
                else {
                    if (core_1.effectEvent.listenerCount(fnName + WEBVIEW_UID) > 0) {
                        core_1.effectEvent.emit(fnName + WEBVIEW_UID, param, function (result) {
                            ui.run(function () {
                                jsPromptResult.confirm(result);
                            });
                        });
                    }
                    else {
                        jsPromptResult.confirm(undefined);
                    }
                }
                return true;
            } }, chromeClientOption));
        var webvc = new JavaAdapter(WebViewClient, webviewClientOption);
        webview.setWebChromeClient(webcc);
        webview.setWebViewClient(webvc);
        webview.loadUrl(url);
        function on(eventName) {
            return rxjs_1.fromEvent(core_1.effectEvent, eventName + WEBVIEW_UID);
        }
        return {
            webviewObject: webview,
            on: on,
            runHtmlFunction: runHtmlFunction,
            runHtmlJS: runHtmlJS
        };
    }
    exports.run = run;
});
