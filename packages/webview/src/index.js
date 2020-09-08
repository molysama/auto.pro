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
importClass(android.webkit.WebView);
importClass(android.webkit.ValueCallback);
importClass(android.webkit.WebChromeClient);
importClass(android.webkit.WebResourceResponse);
importClass(android.webkit.WebViewClient);
import { effectEvent } from "@auto.pro/core";
import { fromEvent } from "rxjs";
import { take } from 'rxjs/operators';
import uuidjs from 'uuid-js';
/**
 * @param {string} url  html路径
 * @param {WebViewOption} option  自定义
 * @param {string} option.xmlString 自定义界面
 * @param {string} option.webviewId 自定义界面的webviewId，使用自定义界面时必填，且要与界面字符串内webview的id一致
 * @param {Object} option.webviewClientOption JavaAdapter.WebChromeClient的回调拓展对象，可重写一些事件
 * @param {Function} option.afterLayout 紧接着布局初始化的钩子函数
 */
export function run(url, _a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.xmlString, xmlString = _c === void 0 ? "\n    <linear w=\"*\" h=\"*\">\n        <webview id=\"webview\" h=\"*\" w=\"*\" />\n    </linear>\n" : _c, _d = _b.webviewId, webviewId = _d === void 0 ? 'webview' : _d, _e = _b.webviewClientOption, webviewClientOption = _e === void 0 ? {} : _e, _f = _b.afterLayout, afterLayout = _f === void 0 ? function () { } : _f;
    var WEBVIEW_UID = uuidjs.create(4).toString();
    var effectThreadEvent = effectEvent;
    ui.layout(xmlString);
    afterLayout();
    var webview = ui[webviewId];
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
    effectEvent.on(WEBVIEW_UID, function (uuid, js) {
        ui.run(function () {
            webview.evaluateJavascript(js, new JavaAdapter(ValueCallback, {
                onReceiveValue: function (result) {
                    effectEvent.emit(uuid, result);
                },
                onReceivedError: function (error) {
                    effectEvent.emit(uuid, error);
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
        var uuid = uuidjs.create(4).toString();
        effectEvent.emit(WEBVIEW_UID, uuid, js);
        return fromEvent(effectEvent, uuid).pipe(take(1));
    }
    var webcc = new JavaAdapter(WebChromeClient, __assign({ onJsPrompt: function (view, url, fnName, defaultValue, jsPromptResult) {
            var param = defaultValue && JSON.parse(defaultValue);
            if (effectEvent.listenerCount(fnName + WEBVIEW_UID) > 0) {
                effectEvent.emit(fnName + WEBVIEW_UID, param, function (result) {
                    ui.run(function () {
                        jsPromptResult.confirm(result);
                    });
                });
            }
            else {
                jsPromptResult.confirm(undefined);
            }
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
    function on(eventName) {
        return fromEvent(effectEvent, eventName + WEBVIEW_UID);
    }
    return {
        webviewObject: webview,
        on: on,
        runHtmlFunction: runHtmlFunction,
        runHtmlJS: runHtmlJS
    };
}
