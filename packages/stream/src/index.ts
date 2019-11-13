
import { width, height, isPause, scale, getPrototype } from '@auto.pro/core'
import { findImg, findImgParam } from '@auto.pro/search'
import { of, defer, merge, Observable } from 'rxjs'
import { map, mergeMap, retry, catchError } from 'rxjs/operators'

export { concat } from 'rxjs'

/**
 * 添加事件流
 * @param target 要检测的目标
 * @param doSomething 
 */
export function add (target: (findImgParam | Function), doSomething: (value) => any, ensure?: (findImgParam | string | Function) ): Observable<any> {
    let target$
    const targetType = getPrototype(target)
    if (targetType === 'Function') {
        target$ = of((target as Function)())
    } else if (targetType === 'Object') {
        target$ = findImg(target as findImgParam)
    }
    let ensure$: (param) => Observable<any>
    const ensureType = getPrototype(ensure)
    if (ensureType === 'Object') {
        ensure$ = () => findImg(ensure as findImgParam)
    } else if (ensureType === 'Function') {
        ensure$ = (param) => of((ensure as Function)(param))
    } else {
        ensure$ = () => of(true)
    }

    return target$.pipe(
        mergeMap(value => {
            let result = doSomething && doSomething(value)
            return ensure$(result).pipe(
                map(v => {
                    if (v) {
                        return result
                    } else {
                        throw `invalid value: ${v}`
                    }
                })
            )
        }),
        retry(10),
        catchError(err => {
            return of(err)
        })
    )
}

export default {
    install () {

    }
}