
import { width, height, isPause, scale, getPrototype } from '@auto.pro/core'
import { findImg, findImgParam } from '@auto.pro/search'
import { of, defer, merge, Observable, isObservable, throwError } from 'rxjs'
import { map, mergeMap, retry, catchError, mapTo, tap, filter, last } from 'rxjs/operators'

export { concat } from 'rxjs'

const createDefer = (param: (findImgParam | String | Function), source: Observable<any>) => {
    return defer(() => {

        const paramType = getPrototype(param)
        if (paramType === 'Function') {
            return source.pipe(
                map(v => {
                    return (param as Function)(v)
                })
            )
        } else if (paramType === 'Object') {
            return source.pipe(
                mergeMap(() => findImg(param as findImgParam))
            )
        } else if (paramType === 'String') {
            return source.pipe(
                mergeMap(path => findImg({
                    path,
                    useCache: {
                        key: '__CACHE__'
                    },
                    index: 1
                }))
            )
        }
    })
}

/**
 * 添加事件流
 * @param target 要检测的目标
 * @param doSomething 
 */
export const add = (param: any, target?: any, maxErrorTime: number = 1) => (source: Observable<any>) => {

    return source.pipe(mergeMap(v => defer(() => {
        const paramType = getPrototype(param)
        if (paramType === 'Function') {
            const valueIsArray = getPrototype(v) === 'Array'
            let paramResult
            if (valueIsArray) {
                paramResult = (param as Function)(...v)
            } else {
                paramResult = (param as Function)(v)
            }
            if (isObservable(paramResult)) {
                return paramResult
            } else {
                return of(paramResult)
            }
        } else if (paramType === 'Object') {
            return findImg(param as findImgParam)
        } else if (paramType === 'String') {
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
            if (targetType === 'Function') {
                const targetResult = (target as Function)(paramValue)
                if (isObservable(targetResult)) {
                    return targetResult.pipe(
                        filter(v => Boolean(v)),
                        last(),
                        map(v => [paramValue, v]),
                        catchError(v => {
                            return throwError(`invalid target result: ${v}`)
                        })
                    )
                } else {
                    return of(targetResult).pipe(
                        map(v => {
                            if (v) {
                                return [paramValue, v]
                            } else {
                                throw `invalid target result: ${v}`
                            }
                        })

                    )
                }
            } else if (targetType === 'Object') {
                return findImg(target as findImgParam).pipe(
                    map(v => {
                        if (v) {
                            return [paramValue, v]
                        } else {
                            throw `invalid target result: ${v}`
                        }
                    })
                )
            } else if (targetType === 'String') {
                return findImg({
                    path: target as string,
                    useCache: {
                        key: '__CACHE__'
                    },
                    index: 1
                }).pipe(
                    map(v => {
                        if (v) {
                            return [paramValue, v]
                        } else {
                            throw `invalid target result: ${v}`
                        }
                    })
                )
            } else if (targetType === 'Undefined') {
                return of(paramValue)
            } else {
                return of(target).pipe(
                    map(v => {
                        if (v) {
                            return [paramValue, v]
                        } else {
                            throw `invalid target result: ${v}`
                        }
                    })
                )
            }
        }),
        retry(maxErrorTime)
    )))
}

export default {
    install () {

    }
}