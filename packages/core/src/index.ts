import { BehaviorSubject, concat, defer, iif, merge, Observable, of, Subject, throwError, TimeoutError, timer } from 'rxjs'
import { catchError, concatMap, delay, exhaustMap, filter, map, repeat, scan, share, switchMap, take, takeUntil, tap, toArray } from 'rxjs/operators'
import { isOpenAccessibilityByRoot, isOpenForeground, isOpenStableMode, openAccessibilityByRoot, openForeground, openStableMode } from './utils/settings'
export * from './utils/index'
export * from './utils/settings'
export * from './utils/store'
export {
    isRoot,
    cap,

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
 * 设备是否Root
 */
let isRoot: boolean

/**
 * 基准宽度
 */
let baseWidth = 1280
/**
 * 基准高度
 */
let baseHeight = 720

/**
 * 当前设备宽度，为最长的那条边
 */
let width: number
/**
 * 当前设备高度，为最短的那条边
 */
let height: number
/**
 * 当前设备高宽与基准高宽的缩放比
 */
let scale: number

/**
 * 脚本需求的屏幕类型，'w'代表横屏，'h'代表竖屏，若高宽相等则判定为横屏
 */
let screenType: ('w' | 'h')

/**
 * 截图，仅当needCap设为true时可用
 * @param path 要保存的图片路径
 */
function cap(path?: string) {
    if (path) {
        return images.captureScreen(path)
    } else {
        return images.captureScreen()
    }
}


//################################################################################
//                                   暂停功能
/**
 * 
 *
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
function pausableInterval(t: number = 0, isWait = true) {
    return pausableTimer(0, t, isWait)
}

/**
 * 可暂停的timer
 * @param t 首次延迟
 * @param each 之后的每次输出间隔
 */
function pausableTimer(t: number, each?: number, isWait = true) {
    return timer(t, each).pipe(
        pausable(true, isWait)
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
                    return throwError(err)
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
//                                 暂停功能结束
//#############################################################################


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

/**
 * 作业用
 */
export const effect$ = new Subject()

/**
 * ui线程
 */
export const uiThread = threads.currentThread()

/**
 * 作业线程
 */
export let effectThread: Thread


export function requestService() {
    const isRoot = $shell.checkAccess('root')
    return of(isRoot).pipe(
        switchMap(v => {
            if (v && !isOpenAccessibilityByRoot()) {
                openAccessibilityByRoot()
                return timer(0, 200).pipe(
                    map(() => isOpenAccessibilityByRoot()),
                    filter(v => v),
                    take(1)
                )
            } else if (!v && auto.service === null) {
                app.startActivity({
                    action: "android.settings.ACCESSIBILITY_SETTINGS"
                })
                return timer(0, 200).pipe(
                    map(() => auto.service !== null),
                    filter(v => v),
                    take(1)
                )
            } else {
                return of(true)
            }
        })
    )
}

export function requestFloaty() {
    return iif(
        floaty.checkPermission,
        of(true),
        defer(() => {
            floaty.requestPermission()
            return timer(0, 200).pipe(
                map(() => floaty.checkPermission()),
                filter(v => v),
                take(1)
            )
        })
    )
}

/**
 * @param {object} param  
 * @param {number | 1280} param.baseWidth 基准宽度
 * @param {number | 720} param.baseHeight 基准高度
 * @param {boolean | false} param.needCap 是否需要截图功能
 * @param {boolean | false} param.needService 是否需要无障碍服务，默认为false
 * @param {boolean | false} param.needFloaty 是否需要悬浮窗权限，默认为false
 * @param {boolean | false} param.needForeground 是否需要自动打开前台服务，默认为false
 */
export default function ({
    baseWidth: w = 1280,
    baseHeight: h = 720,
    needCap = false,
    needService = false,
    needFloaty = false,
    needForeground = false,
    needStableMode = true
} = {
    }) {

    baseWidth = w
    baseHeight = h

    screenType = baseWidth >= baseHeight ? 'w' : 'h'
    isRoot = $shell.checkAccess('root')

    const max = Math.max(device.width, device.height)
    const min = Math.min(device.width, device.height)

    width = screenType === 'w' ? max : min
    height = screenType === 'w' ? min : max
    scale = Math.min(width / baseWidth, height / baseHeight)

    effectThread = threads.start(function () {

        const effectThread = threads.currentThread()

        const requestService$ = iif(
            () => needService,
            requestService(),
            of(true)
        )

        const requestFloaty$ = iif(
            () => needFloaty,
            requestFloaty(),
            of(true)
        )

        const requestScreenCapture$ = iif(
            () => needCap,
            of(images.requestScreenCapture(width, height)).pipe(
                tap(v => {
                    if (!v) {
                        toast("请求截图失败");
                        exit();
                    }
                }),
                delay(500)
            ),
            of(true)
        )

        if (needForeground && !isOpenForeground()) {
            openForeground()
        }

        if (needStableMode && !isOpenStableMode()) {
            openStableMode()
        }

        concat(requestService$, requestFloaty$, requestScreenCapture$).pipe(
            toArray()
        ).subscribe(() => {
            effect$.next(effectThread)
        })

        setInterval(() => { }, 10000)
    })

}
