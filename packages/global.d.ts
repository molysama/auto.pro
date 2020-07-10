interface Image { }

declare const context: any
declare const runtime: any
declare const android: any
declare const ui: any
declare const JavaAdapter: any
declare const WebView: any
declare const WebChromeClient: any
declare const WebResourceResponse: any
declare const WebViewClient: any
declare const ValueCallback: any
declare const threads: any
declare const events
declare const importClass
declare const org
declare const $shell: any
declare const files
declare const colors
declare const images: any
declare const device: any
declare const auto: any
declare const app: any

declare function sleep(low: number, up?: number): void
declare function Tap(x: number, y: number): void
declare function press(x: number, y: number, delay: number): void
declare function random(low: number, up: number): number
declare function Swipe(x1: number, y1: number, x2: number, y2: number, duration: number): void
declare function gesture(duration: number, ...points: Array<number>): void
declare function captureScreen(path?: string): Image
