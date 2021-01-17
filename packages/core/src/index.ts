import { concat, fromEvent, iif, interval, Observable, of } from 'rxjs'
import { filter, map, shareReplay, take, toArray } from 'rxjs/operators'
import { isOpenForeground, isOpenStableMode, openForeground, openStableMode, requestFloatyPermission, requestServicePermission } from './permission'
import { initScreenSet } from './screen'
import { disableVolumeExit } from './utils'

export * from './pausable'
export * from './permission'
export * from './screen'
export * from './store'
export * from './utils'

/**
 * 作业流
 */
export let effect$: Observable<any>

/**
 * 作业线程
 */
export let effectThread: Thread

/**
 * 作业线程事件
 */
export let effectEvent

interface CoreOption {
    baseWidth?: number
    baseHeight?: number
    needCap?: false | '横屏' | '竖屏' | '自动'
    capType?: '异步' | '同步'
    needService?: boolean
    needFloaty?: boolean
    needForeground?: boolean
    needStableMode?: boolean
}

/**
 * @param {CoreOption} param 初始化参数
 * @param {number | 1280} param.baseWidth 基准宽度，默认为1280
 * @param {number | 720} param.baseHeight 基准高度，默认为720
 * @param { false | '横屏' | '竖屏' | '自动'} param.needCap 是否需要截图功能，默认为false
 * @param { '异步' | '同步' } param.capType 截图模式，默认为异步
 * @param {boolean | false} param.needService 是否需要无障碍服务，默认为false
 * @param {boolean | false} param.needFloaty 是否需要悬浮窗权限，默认为false
 * @param {boolean | false} param.needForeground 是否需要自动打开前台服务，默认为false
 * @param {boolean | false} param.needVolExit 是否需要音量上键退出程序，默认为true
 */
export default function ({
    baseWidth = 1280,
    baseHeight = 720,
    needCap = false,
    capType = '异步',
    needService = false,
    needFloaty = false,
    needForeground = false,
    needStableMode = false,
    needVolExit = true
}: {
    baseWidth?: number
    baseHeight?: number
    needCap?: false | '横屏' | '竖屏' | '自动'
    capType?: '异步' | '同步'
    needService?: boolean
    needFloaty?: boolean
    needForeground?: boolean
    needStableMode?: boolean
    needVolExit?: boolean
} = {
    }) {

    if (!needVolExit) {
        disableVolumeExit()
    }

    initScreenSet(baseWidth, baseHeight)

    effectThread = threads.start(function () {

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

        if (needCap) {
            if (!images.requestScreenCapture({
                async: capType === '异步',
                orientation: {
                    '横屏': 1,
                    '竖屏': 2,
                    '自动': 3,
                    'true': 3
                }[needCap]
            })) {
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

        concat(requestService$, requestFloaty$).pipe(
            toArray()
        ).subscribe({
            next() {
                interval(10).pipe(
                    filter(() => effectEvent && effectEvent.listenerCount('effect$') > 0),
                    take(1)
                ).subscribe(() => {
                    effectEvent.emit('effect$')
                })
            },
            error(err) {
                toastLog(err)
            }
        })

        setInterval(() => { }, 10000)
    })

    effectThread.waitFor()
    effectEvent = events.emitter(effectThread);
    effect$ = fromEvent(effectEvent, 'effect$').pipe(
        map(() => [effectThread, effectEvent]),
        shareReplay(1)
    )

}
