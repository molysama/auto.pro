import { concat, iif, of, ReplaySubject, timer } from 'rxjs'
import { toArray } from 'rxjs/operators'
import { isOpenForeground, isOpenStableMode, openForeground, openStableMode, requestFloatyPermission, requestServicePermission } from './permission'
import { height, initScreenSet, width } from './screen'

export * from './permission'
export * from './pausable'
export * from './screen'
export * from './store'
export * from './utils'

/**
 * 作业流
 */
export const effect$ = new ReplaySubject<[any, any]>(1)


/**
 * ui线程
 */
export const uiThread = threads.currentThread()

/**
 * ui线程事件
 */
export const uiEvent = events.emitter(uiThread)

/**
 * 作业线程
 */
export let effectThread: Thread

/**
 * 作业线程事件
 */
export let effectEvent

/**
 * @param {object} param  
 * @param {number | 1280} param.baseWidth 基准宽度
 * @param {number | 720} param.baseHeight 基准高度
 * @param { false | '横屏' | '竖屏' | '自动'} param.needCap 是否需要截图功能
 * @param {boolean | false} param.needService 是否需要无障碍服务，默认为false
 * @param {boolean | false} param.needFloaty 是否需要悬浮窗权限，默认为false
 * @param {boolean | false} param.needForeground 是否需要自动打开前台服务，默认为false
 */
export default function ({
    baseWidth = 1280,
    baseHeight = 720,
    needCap = false,
    needService = false,
    needFloaty = false,
    needForeground = false,
    needStableMode = true
}: {
    baseWidth?: number
    baseHeight?: number
    needCap?: false | '横屏' | '竖屏' | '自动'
    needService?: boolean
    needFloaty?: boolean
    needForeground?: boolean
    needStableMode?: boolean
} = {
    }) {

    initScreenSet(baseWidth, baseHeight)

    effectThread = threads.start(function () {

        const thisThread = threads.currentThread()
        effectEvent = events.emitter(thisThread)

        const requestService$ = iif(
            () => needService,
            requestServicePermission(),
            of(true)
        )

        const requestFloaty$ = iif(
            () => needFloaty,
            requestFloatyPermission(),
            of(true)
        )

        let requestScreenCapture$ = timer(0)
        if (needCap) {
            if (images.requestScreenCapture({
                async: true,
                orientation: {
                    '横屏': 1,
                    '竖屏': 2,
                    '自动': 3,
                    'true': 3
                }[needCap]
            })) {
                requestScreenCapture$ = timer(500)
            } else {
                toastLog('请求截图权限失败')
                exit()
            }
        }

        if (needForeground && !isOpenForeground()) {
            openForeground()
        }

        if (needStableMode && !isOpenStableMode()) {
            openStableMode()
        }

        concat(requestService$, requestFloaty$, requestScreenCapture$).pipe(
            toArray()
        ).subscribe({
            next() {
                effect$.next([thisThread, effectEvent])
            },
            error(err) {
                toastLog(err)
                exit()
            }
        })

        setInterval(() => { }, 10000)
    })

    effectThread.waitFor()

}
