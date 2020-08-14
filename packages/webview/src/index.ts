import { Plugin } from "@auto.pro/core"
import { defer, of, Subject, zip } from "rxjs"
import { filter, map, take, tap } from 'rxjs/operators'
import uuidjs from 'uuid-js'

const log = console.log
let threadEvents

let webview
let set
const eventList = {}

interface EventParam {
    uuid: string
    params: [string, ...any[]]
}

function runHtmlFunction(fnName, ...value) {

    return new Promise((resolve, reject) => {
        webview.evaluateJavascript(`javascript:${fnName}(...${JSON.stringify(value)})`, new JavaAdapter(ValueCallback, {
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

/**
 * 
 * @param {string} url html路径
 * @param {object} option 自定义选项
 * @param {string} option.xmlString 自定义界面
 * @param {string} option.webviewId 自定义界面的webviewId，使用自定义时必填，且要与字符串内的webview的id一致
 */
export function run(url: string, {
    xmlString = `
    <linear w="*" h="*">
        <webview id="webview" h="*" w="*" />
    </linear>
`,
    webviewId = 'webview',
} = {
    }) {

    ui.layout(xmlString)

    webview = ui[webviewId]
    set = webview.getSettings()

    if (url.startsWith('file://')) {
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
    webview.loadUrl(url)

    const subject = new Subject()

    // webview的方法必须在同一个线程内执行，因此要用线程间的事件传递
    threadEvents = events.emitter(threads.currentThread())
    threadEvents.on('fn', ({ uuid, params }: EventParam) => {
        const promise = runHtmlFunction(...params)
        subject.next({
            uuid,
            promise
        })
    })
    threadEvents.on('js', ({ uuid, js }) => {
        const promise = runHtmlJS(js)
        subject.next({
            uuid,
            promise
        })
    })
    return {
        on,
        off,
        /**
         * 执行webview中网页的函数
         * @param fnName 要执行的方法
         * @param value 要传递的参数
         */
        runHtmlFunction(fnName: string, ...value) {
            return defer(() => {
                const uuid = uuidjs.create(4).toString()
                return zip(
                    subject.pipe(
                        filter((v: any) => v['uuid'] === uuid),
                        map(v => v['promise']),
                        take(1)
                    ),
                    of(false).pipe(
                        tap(() => {
                            threadEvents.emit('fn', {
                                uuid,
                                params: [fnName, ...value]
                            })
                        })
                    )
                ).pipe(
                    map(v => v[0])
                )
            }).toPromise()
        },
        /**
         * 在webview中执行一个js语句
         * @param js 
         */
        runHtmlJS(js) {

            return defer(() => {
                const uuid = uuidjs.create(4).toString()
                return zip(
                    subject.pipe(
                        filter((v: any) => v['uuid'] === uuid),
                        map(v => v['promise']),
                        take(1)
                    ),
                    of(false).pipe(
                        tap(() => {
                            threadEvents.emit('js', {
                                uuid,
                                js
                            })
                        })
                    )
                ).pipe(
                    map(v => v[0])
                )
            }).toPromise()
        },
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