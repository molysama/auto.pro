type ScreenType = '横屏' | '竖屏'
interface Thread {
    [key: string]: any
}
interface AutoStorage {

    /**
     * 取key对应的值，值不存在时返回defaultValue或undefined
     * @param key 
     * @param defaultValue 
     */
    get(key: string, defaultValue?: any): any
    /**
     * 把value保存到key，value必须是可JSON化的值
     * @param key 
     * @param value 
     */
    put(key: string, value: any): void
    /**
     * 移除key对应的数据
     * @param key 
     */
    remove(key: string): void
    /**
     * 是否存在key对应的数据
     * @param key 
     */
    contains(key: string): boolean

    /**
     * 清除所有数据
     */
    clear(): void
}
interface Image {
    width: number
    height: number
    getWidth(): number
    getHeight(): number
    saveTo(path): void
    pixel(x: number, y: number): number
    recycle: Function
    isRecycled(): boolean
    mat: Mat
}
interface Point {
    x: number,
    y: number
}
interface Mat {
    [key: string]: any
}
interface Match {
    point: Point,
    similarity: number
}
interface MatchingResult {
    matches: Match[]
    points: Point[]
    first(): Match | null
    last(): Match | null
    leftmost(): Match | null
    rightmost(): Match | null
    bottommost(): Match | null
    best(): Match | null
    worst(): Match | null
    sortBy(cmp: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'): MatchingResult
}

type Color = string | number
type ImageType = 'jpg' | 'jpeg' | 'png' | 'webp'
type Interpolation = 'LINEAR' | 'NEAREST' | 'AREA' | 'CUBIC' | 'LANCZOS4'
type ThresholdType = 'BINARY' | 'BINARY_INV' | 'TRUNC' | 'TOZERO' | 'TOZERO_INV' | 'OTSU' | 'TRIANGLE'
type BlurType = 'DEFAULT' | 'CONSTANT' | 'REPLICATE' | 'REFLECT' | 'WRAP' | 'REFLECT_10' | 'TRANSPARENT' | 'REFLECT101' | 'ISOLATED'
type RegionType = [number, number] | [number, number, number, number]

declare const colors: {
    /**
     * 返回颜色值的字符串，格式为 "#AARRGGBB"
     * @param {Color} color 颜色值
     */
    toString(color: Color): string

    /**
     * 返回颜色color的R通道的值，范围0~255
     * @param {Color} color 颜色值
     */
    red(color: Color): number

    /**
     * 返回颜色color的G通道的值，范围0~255
     * @param {Color} color 颜色值
     */
    green(color: Color): number

    /**
     * 返回颜色color的B通道的值，范围0~255
     * @param {Color} color 颜色值
     */
    blue(color: Color): number

    /**
     * 返回颜色color的Alpha通道的值，范围0~255
     * @param {Color} color 颜色值
     */
    alpha(color: Color): number

    /**
     * 将rgb三通道的值组合成整数颜色值
     * @param {number} red 
     * @param {number} green 
     * @param {number} blue 
     */
    rgb(red: number, green: number, blue: number): number

    /**
     * 将string颜色转换成number颜色
     * @param {string} color 
     */
    parseColor(color: string): number

    /**
     * 判断两个颜色是否相似
     * @param {Color} color1 
     * @param {Color} color2 
     * @param {number} threshold 默认为4，取值为0~255，值越大则判定越宽泛，值为0是要求完全相等才为true
     * @param {'diff'|'rga'|'rbg+'|'hs'} algorithm 颜色匹配算法，默认为'diff'
     */
    isSimilar(color1: Color, color2: Color, threshold?: number, algorithm?: string): boolean

    /**
     * 判断两个颜色是否相等，忽略Alpha通道
     * @param color1 
     * @param color2 
     */
    equals(color1: Color, color2: Color): boolean

}

declare const $images: {
    on(eventName, callback: any): void
    off: any
}

declare const images: {
    read(path: string): Image

    load(url: string): void

    copy(image: Image): Image

    save(image: Image, path: string, format?: ImageType, quality?: number): void

    fromBase64(base64: string): Image

    toBase64(image: Image, format?: ImageType, quality?: number): string

    clip(image: Image, x: number, y: number, width: number, height: number): Image

    resize(image: Image, size?: [number, number], interpolation?: Interpolation): Image

    scale(image: Image, scaleX, scaleY, interpolation?: Interpolation): Image

    rotate(image: Image, degress: number, x?: number, y?: number): Image

    concat(image: Image, resource: Image, direction?: 'LEFT' | 'RIGHT' | 'TOP' | 'BOTTOM'): Image

    grayscale(image: Image): Image

    threshold(image: Image, threshold: number, maxVal: number, thresholdType?: ThresholdType): Image

    adaptiveThreshold(image: Image, maxValue: number, adaptiveMethod: 'MEAN_C' | 'GAUSSIAN_C', thresholdType: 'BINARY' | 'BINARY_INV', blockSize: number, C: number): Image

    cvtColor(image: Image, code: 'BGR2GRAY' | 'BGR2HSV' | string, dstCn?: number): Image

    inRange(image: Image, lowBound: Color, upperBound: Color): Image

    interval(image: Image, color: Color, interval: number): Image

    blue(image: Image, size: [number, number], anchor?: Array<any>, type?: BlurType): Image

    medianBlur(image: Image, size: [number, number]): Image

    gaussianBlur(image: Image, size: [number, number], sigmaX?: number, sigmaY?: number, type?: BlurType): Image

    matToImage(mat: Mat): Image

    requestScreenCapture(landscape?: boolean): boolean
    requestScreenCapture(width: number, height: number): boolean
    requestScreenCapture(option: {
        async?: boolean
        orientation?: number
        width?: number
        height?: number
    }): boolean

    captureScreen(): Image
    captureScreen(path: string): void

    pixel(image: Image, x: number, y: number): number

    findColor(image: Image, color: Color, options: {
        region?: RegionType
        threshold?: number
    }): Point | null
    findColorInRegion(image: Image, color: Color, x: number, y: number, width?: number, height?: number, threshold?: number): Point | null
    findColorEquals(image: Image, color: Color, ...region: RegionType): Point | null
    findMultiColors(image: Image, firstColor: Color, colorList: [number, number, Color][], options?: { region?: RegionType, threshold: number }): Point | null
    detectsColor(image: Image, color: Color, x: number, y: number, threshold?: number, algorithm?: 'diff' | 'equal' | 'rgb' | 'rgb+' | 'hs'): boolean

    findImage(image: Image, template: Image, options?: {
        region?: RegionType,
        threshold?: number,
        level?: number
    }): Point | null
    findImageInRegion(image: Image, template: Image, ...region: RegionType): Point | null
    matchTemplate(image, template, options?: {
        region?: RegionType,
        threshold?: number,
        max?: number,
        level?: number
    }): MatchingResult
}

declare const $settings: {
    isEnabled(str: string): boolean
    setEnabled(str, state: boolean): void
}

declare const activity: any
declare const dialogs: any
declare const storages: {
    create(text: string): AutoStorage
    remove(text: string): boolean
}
declare function log(text: string, ...args): void
declare function toastLog(text: string): void

declare const Animator: any
declare const AnimatorSet: any
declare const ObjectAnimator: any
declare const context: any
declare const java: any
declare function waitForPackage(packageName: string, eachTime?: number): void

interface FloatyWindow {
    setAdjustEnabled(enabled: boolean): void
    setPosition(x: number, y: number): void
    getX(): number
    getY(): number
    setSize(width: number, height: number): void
    getWidth(): number
    getHeight(): number
    close(): void
    exitOnClose(): void
}
interface FloatyRawWindow extends Omit<FloatyWindow, 'setAdjustEnabled'> {
    setTouchable(toucable: boolean)
}
declare const floaty: {
    checkPermission(): boolean
    requestPermission(): boolean
    window(layout: any): FloatyWindow & { [key: string]: any }
    rawWindow(layout: any): FloatyRawWindow & { [key: string]: any }
}
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
declare const device: any
declare const auto: any
declare const app: any

declare function toast(str: string): void
declare function exit(num?: number): void
declare function sleep(low: number, up?: number): void
declare function Tap(x: number, y: number): void
declare function press(x: number, y: number, delay: number): void
declare function random(low: number, up: number): number
declare function Swipe(x1: number, y1: number, x2: number, y2: number, duration: number): void
declare function gesture(duration: number, ...points: Array<number>): void
declare function captureScreen(path?: string): Image
