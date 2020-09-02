import { concat, iif, of, Subject } from 'rxjs'
import { toArray } from 'rxjs/operators'
import { isOpenForeground, isOpenStableMode, openForeground, openStableMode, requestFloatyPermission, requestServicePermission } from './permission'
import { initScreenSet } from './screen'

export * from './pausable'
export * from './permission'
export * from './screen'
export * from './store'
export * from './utils'

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
            requestFloatyPermission(),
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
