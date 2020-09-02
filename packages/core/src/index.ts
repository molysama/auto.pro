import { concat, iif, of, Subject } from 'rxjs'
import { toArray } from 'rxjs/operators'
import { isOpenForeground, isOpenStableMode, openForeground, openStableMode, requestFloatyPermission, requestServicePermission, requestScreenCapturePermission } from './permission'
import { initScreenSet } from './screen'

export * from './pausable'
export * from './permission'
export * from './screen'
export * from './store'
export * from './utils'


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
    baseWidth = 1280,
    baseHeight = 720,
    needCap = false,
    needService = false,
    needFloaty = false,
    needForeground = false,
    needStableMode = true
} = {
    }) {

    initScreenSet(baseWidth, baseHeight)

    effectThread = threads.start(function () {

        const effectThread = threads.currentThread()

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

        const requestScreenCapture$ = iif(
            () => needCap,
            requestScreenCapturePermission(),
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
