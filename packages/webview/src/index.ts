import { Plugin } from "@auto.pro/core"

declare const android: any
declare const ui: any
declare const JavaAdapter: any
declare const WebView: any
declare const WebChromeClient: any
declare const WebResourceResponse: any
declare const WebViewClient: any
declare const ValueCallback: any

const log = console.log

let webview
let set
const eventList = {}

function runHtmlFunction(fnName, value) {
    return new Promise((resolve, reject) => {
        webview.evaluateJavascript(`javascript:${fnName}(${value})`, new JavaAdapter(ValueCallback, {
            onReceiveValue(result) {
                resolve(result)
            },
            onReceivedError(error) {
                reject(error)
            }
        }))
    })
}
function runHtmlJS(propertyName) {
    return new Promise((resolve, reject) => {
        webview.evaluateJavascript(`javascript:${propertyName}`, new JavaAdapter(ValueCallback, {
            onReceiveValue(result) {
                resolve(result)
            },
            onReceivedError(error) {
                reject(error)
            }
        }))
    })
}
function on(eventName: string, callback: Function) {
    eventList[eventName] = callback
}
function off(eventName: string) {
    delete eventList[eventName]
}
function call(eventName, ...params) {
    const cb = eventList[eventName]
    if (cb) {
        return cb(...params)
    } else {
        return null
    }
}

export function run(url: string) {
    ui.layout(`
        <linear w="*" h="*">
            <webview id="webview" h="*" w="*" />
        </linear>
    `)

    webview = ui.webview
    set = webview.getSettings()

    set.setAllowFileAccessFromFileURLs(false)
    set.setAllowUniversalAccessFromFileURLs(false)
    set.setSupportZoom(false)
    set.setJavaScriptEnabled(true)
    webview.loadUrl(url)

    const webcc = new JavaAdapter(WebChromeClient, {
        onJsPrompt: function (view, url, fnName, defaultValue, jsPromptResult) {

            let result = call(fnName, defaultValue && JSON.parse(defaultValue))
            jsPromptResult.confirm(result && JSON.stringify(result))
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
        }
    })

    webview.setWebChromeClient(webcc)

    return {
        on,
        off,
        runHtmlFunction,
        runHtmlJS,
        webview
    }
}

const WebViewPlugin: Plugin = {
    install(option: any) {
        importClass(android.webkit.WebView)
        importClass(android.webkit.ValueCallback)
        importClass(android.webkit.WebChromeClient)
        importClass(android.webkit.WebResourceResponse)
        importClass(android.webkit.WebViewClient)
    }
}

export default WebViewPlugin