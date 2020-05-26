import { isFunction } from "./utils"
import { concat, merge, from, BehaviorSubject, interval, timer, throwError, of, Observable, generate, combineLatest, TimeoutError } from 'rxjs'
import { toArray, switchMap, map, filter, concatMap, take, exhaustMap, skip, share, retryWhen, takeUntil, scan, takeWhile, catchError, repeat, tap, distinctUntilChanged, delayWhen } from 'rxjs/operators'


declare const requestScreenCapture: any
declare const toast: any
declare const exit: any

type PluginInstallFunction = (option?: any) => any

export type Plugin =
    | PluginInstallFunction
    | {
        install: PluginInstallFunction
    }

/**
 * 设备是否Root
 */
let isRoot: boolean

/**
 * 是否需要截图
 */
let needCap: boolean
/**
 * 是否需要无障碍服务
 */
let needService: boolean

/**
 * 基准宽度
 */
let baseWidth = 1280
/**
 * 基准高度
 */
let baseHeight = 720
/**
 * 当前设备宽度
 */
let width: number
/**
 * 当前设备高度
 */
let height: number
/**
 * 当前设备高宽与基准高宽的缩放比
 */
let scale: number

/**
 * 当前设备的屏幕类型，'w'代表横屏，'h'代表竖屏，若高宽相等则判定为横屏
 */
let screenType: ('w' | 'h')

/**
 * 截图，仅当needCap设为true时可用
 * @param path 要保存的图片路径
 * @returns {Image} 返回得到的截图
 */
function cap(path?: string) {
    if (!needCap) {
        throw 'cap仅当needCap为真值时可用'
    }
    if (path) {
        return captureScreen(path)
    } else {
        return captureScreen()
    }
}
const plugins: Plugin[] = []

/**
 * 加载插件
 * @param plugin 要加载的插件
 * @param option 插件需要的参数
 */
function use(plugin: Plugin, option?: any) {
    if (plugins.indexOf(plugin) !== -1) {
        return
    } else if (isFunction(plugin)) {
        plugin(option)
    } else if (isFunction(plugin.install)) {
        plugin.install(option)
    }
    return plugins.push(plugin)
}

/**
 * 程序是否处于暂停状态
 */
const pauseState$ = new BehaviorSubject(false)

/**
 * 操作符，使流可暂停，可设ispausable为false来强制关闭暂停效果
 * @param {boolean} isPausable 是否强制取消暂停效果
 * @param {boolean} wait wait为true时将阻塞并存储所有输入，为false时忽略暂停期间的输入
 */
const pausable = (isPausable = true, wait = true) => (source) => {
    if (isPausable) {
        if (wait) {
            return source.pipe(
                concatMap((value) =>
                    pauseState$.pipe(
                        filter((v) => !v),
                        take(1),
                        map(() => value)
                    )
                )
            )
        } else {
            return source.pipe(
                exhaustMap(value => pauseState$.pipe(
                    filter(v => !v),
                    take(1),
                    map(() => value)
                ))
            )
        }
    } else {
        return source
    }
}
/**
 * 将程序暂停
 */
function pause() {
    pauseState$.next(true)
}
/**
 * 将程序恢复运行
 */
function resume() {
    pauseState$.next(false)
}

/**
 * 可暂停的interval
 * @param t 时间间隔
 */
function pausableInterval(t: number = 0) {
    return pausableTimer(0, t)
}

/**
 * 可暂停的timer
 * @param t 首次延迟
 * @param each 之后的每次输出间隔
 */
function pausableTimer(t: number, each?: number) {
    return timer(t, each).pipe(
        pausable(true, false)
    )
}


/**
 * 可暂停的TimeoutWith
 * @param t 
 * @param ob 
 */
function pausableTimeoutWith(t: number, ob: Observable<any>) {
    return (source) => {
        let begin = Date.now()
        let total = t
        const source$ = source.pipe(share())

        return merge(
            source$,
            // 只允许默认和【非暂停->暂停】状态通过的流
            pauseState$.pipe(
                scan(
                    ([result, prev], now) => {
                        if (prev === undefined) {
                            result = true
                        } else if (prev === false && now === true) {
                            result = true
                        } else {
                            result = false
                        }
                        return [result, now]
                    },
                    [true, undefined]
                ),
                filter((v: any) => v[0]),
                map((v: any) => v[1]),
            )
                .pipe(
                    switchMap((vp) => {
                        // 如果是暂停，则延迟时间为：剩余时间 - (当前时间 - 起始时间)
                        if (vp) {
                            total = total - (Date.now() - begin)
                            return pauseState$.pipe(
                                filter((v) => !v),
                                concatMap(() => {
                                    begin = Date.now()
                                    return timer(total)
                                })
                            )
                        } else {
                            // 如果是非暂停，则延迟t毫秒，并初始化起始时间
                            begin = Date.now()
                            return timer(t)
                        }
                    }),
                    takeUntil(
                        source$.pipe(
                            tap(() => {
                                begin = Date.now()
                                total = t
                            })
                        )
                    ),
                    repeat(),
                    takeUntil(source$.pipe(toArray())),
                    switchMap(() => throwError(new TimeoutError())),
                )
        ).pipe(
            catchError(err => {
                if (err instanceof TimeoutError) {
                    return ob
                } else {
                    return err
                }
            })
        )
    }
}


/**
 * 可暂停的timeout
 * @param t 
 */
function pausableTimeout(t: number) {
    return pausableTimeoutWith(t, throwError(new TimeoutError()))
}



/**
 * 获取当前设备宽度的分式值，如value = 1/4，则获取宽度的1/4，并向下取整
 * @param value 要获取的宽度百分比
 * @returns 当前设备宽度 * value
 */
function getWidth(value: number = 1) {
    return Math.floor(width * value)
}
/**
 * 获取当前设备高度的分式值，如value = 1/4，则获取高度的1/4，并向下取整
 * @param value 要获取的高度百分比
 * @returns 当前设备高度 * value
 */
function getHeight(value: number = 1) {
    return Math.floor(height * value)
}

declare const android
export function getTime() {
    return android.os.SystemClock.uptimeMillis()
}

/**
 * 获取对象的原型
 * Java对象直接返回Java类名，如'Image'、'Point'
 * JS对象返回对应的原型，如 'Null' 'Undefined' 'String' 'Number' 'Function' 'Boolean' 'Array'
 * @param obj 要获取原型的对象
 * @returns {string}
 */
export function getPrototype(obj: any): string {
    const prototype = Object.prototype.toString.call(obj)
    if (prototype == '[object JavaObject]') {
        return obj.getClass().getSimpleName()
    } else {
        return prototype.substring(prototype.indexOf(' ') + 1, prototype.indexOf(']'))
    }
}

export {
    isRoot,
    cap,
    use,

    width,
    height,
    scale,
    getWidth,
    getHeight,
    screenType,

    pause,
    resume,
    pausable,
    pauseState$,
    pausableInterval,
    pausableTimer,
    pausableTimeout,
    pausableTimeoutWith
}

/**
 * 
 * @param {number | 1280} param.baseWidth 基准宽度
 * @param {number | 720} param.baseHeight 基准高度
 * @param {boolean | false} param.needCap 是否需要截图功能
 * @param {boolean | false} param.needService 是否需要无障碍服务，默认为false，但在非root环境下将强制开启
 */
export default function (param: {
    baseWidth?: number
    baseHeight?: number
    needCap?: boolean
    needService?: boolean
} = {}) {
    needCap = param.needCap === true ? true : false
    needService = param.needService === true ? true : false

    baseWidth = param.baseWidth || baseWidth
    baseHeight = param.baseHeight || baseHeight

    screenType = baseWidth >= baseHeight ? 'w' : 'h'
    isRoot = typeof $shell != 'undefined' && $shell.checkAccess && $shell.checkAccess('root') || false

    const max = typeof device != 'undefined' ? Math.max(device.width, device.height) : 0
    const min = typeof device != 'undefined' ? Math.min(device.width, device.height) : 0

    width = screenType === 'w' ? max : min
    height = screenType === 'w' ? min : max
    scale = Math.min(width / baseWidth, height / baseHeight)

    threads && threads.start && threads.start(function () {

        if (needCap) {
            if (!requestScreenCapture(width, height)) {
                toast("请求截图失败");
                exit();
            }
        }

        if ((needService || !isRoot) && auto.service == null) {
            app.startActivity({
                action: "android.settings.ACCESSIBILITY_SETTINGS"
            });
        }
    })

}