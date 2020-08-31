
importClass(android.webkit.WebView)
importClass(android.webkit.ValueCallback)
importClass(android.webkit.WebChromeClient)
importClass(android.webkit.WebResourceResponse)
importClass(android.webkit.WebViewClient)

interface WebViewOption {
    xmlString: string
    webviewId: string
    webviewClientOption?: any
}

import { fromEvent, Observable } from "rxjs"
import { take } from 'rxjs/operators'
import uuidjs from 'uuid-js'
import { effectThread, uiThread } from "@auto.pro/core"

const uiThreadEvent = events.emitter(uiThread)

const CREATE_WEBVIEW = uuidjs.create(4).toString()
const CREATE_WEBVIEW_RESULT = CREATE_WEBVIEW + '_RESULT'

uiThreadEvent.on(CREATE_WEBVIEW, (url, {
    xmlString = `
    <linear w="*" h="*">
        <webview id="webview" h="*" w="*" />
    </linear>
`,
    webviewId = 'webview',
    webviewClientOption = {}
} = {
    }) => {

    const effectThreadEvent = events.emitter(effectThread)

    // 每一个webview的事件id都不同
    const WEBVIEW_EVENT = uuidjs.create(4).toString()

    ui.layout(xmlString)

    const webview = ui[webviewId]
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

    // webview的方法必须在同一个线程内执行，因此要用线程间的事件传递

    uiThreadEvent.on(WEBVIEW_EVENT, (uuid, js) => {
        webview.evaluateJavascript(js, new JavaAdapter(ValueCallback, {
            onReceiveValue(result) {
                effectThreadEvent.emit(uuid, result)
            },
            onReceivedError(error) {
                effectThreadEvent.emit(uuid, error)
            }
        }))
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
        uiThreadEvent.emit(WEBVIEW_EVENT, uuid, js)
        return fromEvent(effectThreadEvent, uuid).pipe(
            take(1)
        )
    }

    const webcc = new JavaAdapter(WebChromeClient, {
        onJsPrompt: function (view, url, fnName, defaultValue, jsPromptResult) {
            const param = defaultValue && JSON.parse(defaultValue)

            if (effectThreadEvent.listenerCount(fnName + WEBVIEW_EVENT) > 0) {
                effectThreadEvent.emit(fnName + WEBVIEW_EVENT, param, function (result) {
                    jsPromptResult.confirm(result)
                })
            } else {
                jsPromptResult.confirm(undefined)
            }

            return true
        },
        onReceivedHttpError: function (view, request, error) {
            log('webview http error', error)
        },
        onReceivedError: function (view, errorCode, desc, failingUrl) {
            log('webview error', desc)
        },
        onConsoleMessage: function (msg) {
            log(msg.message())
        },
        ...webviewClientOption
    })

    webview.setWebChromeClient(webcc)
    webview.loadUrl(url)

    function on(eventName) {
        return fromEvent(effectThreadEvent, eventName + WEBVIEW_EVENT)
    }

    uiThreadEvent.emit(CREATE_WEBVIEW_RESULT, {
        on,
        off: effectThreadEvent.removeListener,
        runHtmlFunction,
        runHtmlJS
    })

})

type CreateWebviewResult = Observable<{
    on(eventName: string): Observable<[any, Function]>
    off(): void
    runHtmlFunction(fnName: string, ...value): Observable<any>
    runHtmlJS(js: string): Observable<any>
}>

/*
 * 
 * @param {string} url html路径
 * @param {object} option 自定义选项
 * @param {string} option.xmlString 自定义界面
 * @param {string} option.webviewId 自定义界面的webviewId，使用自定义时必填，且要与字符串内的webview的id一致
 * @param {string} option.webviewClientOption 自定义webview的事件监听
 */
export function run(url, option?: WebViewOption): CreateWebviewResult {
    uiThreadEvent.emit(CREATE_WEBVIEW, url, option)
    return fromEvent<any>(uiThreadEvent, CREATE_WEBVIEW_RESULT).pipe(
        take(1)
    )
}