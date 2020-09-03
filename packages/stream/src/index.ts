
import { click } from '@auto.pro/action'
import { getPrototype, pausableTimer } from '@auto.pro/core'
import { clearCache, findImg, FindImgParam } from '@auto.pro/search'
import { throwError } from 'rxjs'
import { catchError, delay, finalize, retry, switchMap, tap } from 'rxjs/operators'

export { concat } from 'rxjs'

function isFindImgParam(param: Function | FindImgParam | string | any): param is FindImgParam {
    return getPrototype(<FindImgParam>param) === 'Object' && (<FindImgParam>param).path !== undefined
}
function isFunction(param: Function | FindImgParam | string | any): param is Function {
    return getPrototype(<Function>param) === 'Function'
}
function isString(param: Function | FindImgParam | string | any): param is string {
    return getPrototype(<string>param) === 'String'
}

export const tag = (text: string, showValue: boolean = false, fn?: Function) => {
    tap(v => {
        if (showValue) {
            console.log('tag', text, v)
        } else {
            console.log('tag', text)
        }
        if (fn) {
            fn(v)
        }
    })
}

export const clickImg = (path: string, region: RegionType = [0, 0], threshold = 0.9) => {
    return findImg({
        path,
        option: {
            region,
            threshold,
        },
    }).pipe(
        click(5, 5),
        delay(1000)
    )
}

export const clickImgWithCheck = (
    path,
    region: RegionType = [0, 0],
    threshold = 0.9,
    checkDelay = 1000,
    useCache = true
) => {

    // 点击和确认都使用同一个找图参数
    const param: FindImgParam = {
        path,
        option: {
            region,
            threshold,
        },
        useCache: useCache ? {
            // 使用一个时间戳来进行区域缓存，执行完毕后销毁该缓存
            key: path + Date.now(),
        } : undefined,
    }
    return findImg(param).pipe(
        click(5, 5),
        switchMap(() =>
            pausableTimer(checkDelay).pipe(
                switchMap(() => findImg({ ...param, once: true })),
                click(5, 5),
                tap(v => {
                    if (v) {
                        throw 'check unpass'
                    }
                }),
                retry()
            )
        ),
        catchError((err) => {
            console.log(`clickImgWithCheck ${param.path} err`, err)
            return throwError(err)
        }),
        // 由于是按时间戳生成的唯一缓存，结束后清掉
        finalize(() => param.useCache?.key && clearCache(param.useCache.key))
    )
}