
import { width, height, isPause, scale, getPrototype } from '@auto.pro/core'
import { findImg, FindImgParam } from '@auto.pro/search'
import { of, defer, merge, Observable, isObservable, throwError } from 'rxjs'
import { map, mergeMap, retry, catchError, mapTo, tap, filter, last } from 'rxjs/operators'

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

/**
 * 添加事件流
 * @param param 要做的事
 * @param target 完成标志
 * @param {boolean} passValue 过滤器的值，默认为true
 * @param {number} maxRetryTimes 最大重试次数
 */
export const add = (param: (Function | FindImgParam | Observable<any> | string | any), target?: (Function | FindImgParam | Observable<any> | string | any), passValue: boolean = true, maxRetryTimes: number = 1) => (source: Observable<any>) => {

    return source.pipe(mergeMap(v => defer(() => {
        if (isObservable(param)) {
            return param
        } else if (isFunction(param)) {
            let paramResult = param(v)
            if (isObservable(paramResult)) {
                return paramResult
            } else {
                return of(paramResult)
            }
        } else if (isFindImgParam(param)) {
            return findImg(param)
        } else if (isString(param)) {
            return findImg({
                path: v,
                useCache: {
                    key: '__CACHE__'
                },
                index: 1
            })
        } else {
            return of(param)
        }
    }).pipe(
        mergeMap(paramValue => {

            const targetType = getPrototype(target)
            const filterValue = () => map(v => {
                if (Boolean(v) === Boolean(passValue)) {
                    return [paramValue, v]
                } else {
                    throw `invalid target result: ${v} is not ${passValue}`
                }
            })
            if (isObservable(target)) {
                return target.pipe(
                    filterValue()
                )
            } else if (targetType === 'Function') {
                const targetResult = (target as Function)(paramValue)
                if (isObservable(targetResult)) {
                    return targetResult.pipe(
                        filter(v => Boolean(v) === Boolean(passValue)),
                        last(),
                        map(v => [paramValue, v]),
                        catchError(v => {
                            return throwError(`invalid target result: ${v}`)
                        })
                    )
                } else {
                    return of(targetResult).pipe(
                        filterValue()
                    )
                }
            } else if (targetType === 'Object') {
                return findImg(target as FindImgParam).pipe(
                    filterValue()
                )
            } else if (targetType === 'String') {
                return findImg({
                    path: target as string,
                    useCache: {
                        key: '__CACHE__'
                    },
                    index: 1
                }).pipe(
                    filterValue()
                )
            } else if (targetType === 'Undefined') {
                return of(paramValue)
            } else {
                return of(target).pipe(
                    filterValue()
                )
            }
        }),
        retry(maxRetryTimes)
    )))
}

export default {
    install() {

    }
}