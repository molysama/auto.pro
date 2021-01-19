
importClass(android.webkit.WebView)
importClass(android.webkit.ValueCallback)
importClass(android.webkit.WebChromeClient)
importClass(android.webkit.WebResourceResponse)
importClass(android.webkit.WebViewClient)

interface WebViewOption {
    xmlString?: string
    webviewId?: string
    webviewObject?: any
    chromeClientOption?: any
    webviewClientOption?: any
    afterLayout?: Function
}

import { effectEvent } from "@auto.pro/core"
import { fromEvent, Observable } from "rxjs"
import { take } from 'rxjs/operators'
import uuidjs from 'uuid-js'


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
export function run(url, {
    xmlString = `
    <linear w="*" h="*">
        <webview id="webview" h="*" w="*" />
    </linear>
`,
    webviewId = 'webview',
    webviewObject = null,
    chromeClientOption = {},
    webviewClientOption = null,
    afterLayout = () => { }
}: WebViewOption = {
    }): CreateWebviewResult {

    // 每个webview对象都有其唯一UID，便于处理自身事件
    const WEBVIEW_UID = uuidjs.create(4).toString()

    let webview
    if (webviewObject) {
        webview = webviewObject
        afterLayout()
    } else {
        ui.layout(xmlString)
        afterLayout()
        webview = ui[webviewId]
    }

    const set = webview.getSettings()

    if (url.startsWith('file:')) {
        set.setAllowFileAccess(true);
        set.setAllowFileAccessFromFileURLs(true);
        set.setAllowUniversalAccessFromFileURLs(true);
    } else {
        set.setAllowFileAccess(false);
        set.setAllowFileAccessFromFileURLs(false)
        set.setAllowUniversalAccessFromFileURLs(false)
    }

    set.setSupportZoom(false)
    set.setJavaScriptEnabled(true)
    webview.loadUrl(url)

    // webview执行html方法时必须在主线程执行，因此要用线程间的事件传递
    effectEvent.on(WEBVIEW_UID, (uuid, js) => {
        ui.run(() => {
            webview.evaluateJavascript(js, new JavaAdapter(ValueCallback, {
                onReceiveValue(result) {
                    effectEvent.emit(uuid, result)
                },
                onReceivedError(error) {
                    effectEvent.emit(uuid, error)
                }
            }))
        })
    })

    function runHtmlFunction(fnName, ...value) {
        const js = `javascript:${fnName}(...${JSON.stringify(value)})`
        return getHtmlResult(js)
    }
    function runHtmlJS(propertyName) {
        const js = `javascript:${propertyName}`
        return getHtmlResult(js)
    }
    function getHtmlResult(js) {
        const uuid = uuidjs.create(4).toString()
        effectEvent.emit(WEBVIEW_UID, uuid, js)
        return fromEvent(effectEvent, uuid).pipe(
            take(1)
        )
    }

    webview.setWebChromeClient(new JavaAdapter(WebChromeClient, {
        onJsPrompt: function (view, url, fnName, defaultValue, jsPromptResult) {
            const param = defaultValue && JSON.parse(defaultValue)

            // 如果param的参数中存在PROMPT_CALLBACK，说明是回调型事件，直接返回空值
            if (param && param['PROMPT_CALLBACK']) {
                jsPromptResult.confirm(undefined)
                if (effectEvent.listenerCount(fnName + WEBVIEW_UID) > 0) {
                    effectEvent.emit(fnName + WEBVIEW_UID, param.params, function (...result) {
                        ui.run(() => {
                            webview.evaluateJavascript(`javascript:${param['PROMPT_CALLBACK']}(...${JSON.stringify(result)})`, new JavaAdapter(ValueCallback, {
                                onReceiveValue(result) {
                                },
                                onReceivedError(error) {
                                }
                            }))
                        })
                    })
                }

            } else {
                if (effectEvent.listenerCount(fnName + WEBVIEW_UID) > 0) {
                    effectEvent.emit(fnName + WEBVIEW_UID, param, function (result) {
                        ui.run(() => {
                            jsPromptResult.confirm(result)
                        })
                    })
                } else {
                    jsPromptResult.confirm(undefined)
                }

            }

            return true
        },
        ...chromeClientOption
    }))

    if (webviewClientOption) {
        webview.setWebViewClient(new JavaAdapter(WebViewClient, webviewClientOption))
    }

    function on(eventName: string) {
        return fromEvent<[any, Function]>(effectEvent, eventName + WEBVIEW_UID)
    }

    return {
        webviewObject: webview,
        on,
        runHtmlFunction,
        runHtmlJS
    }
}

type CreateWebviewResult = {
    webviewObject: any
    on(eventName: string): Observable<[any, Function]>
    runHtmlFunction(fnName: string, ...value): Observable<any>
    runHtmlJS(js: string): Observable<any>
}