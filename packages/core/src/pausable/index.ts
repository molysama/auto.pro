
import { BehaviorSubject, merge, Observable, throwError, TimeoutError, timer, MonoTypeOperatorFunction } from 'rxjs'
import { catchError, concatMap, exhaustMap, filter, map, repeat, scan, share, switchMap, take, takeUntil, tap, toArray } from 'rxjs/operators'

/**
 * 程序暂停状态值
 * true为正在暂停，false为非暂停
 */
export const pauseState$ = new BehaviorSubject(false)

// export declare function filter<T>(predicate: (value: T, index: number) => boolean, thisArg?: any): MonoTypeOperatorFunction<T>;
/**
 * 操作符，使流可暂停，可设ispausable为false来强制关闭暂停效果
 * @param {boolean} isPausable 是否强制取消暂停效果
 * @param {boolean} wait wait为true时将阻塞并存储所有输入，为false时忽略暂停期间的输入
 */
export const pausable = <T>(isPausable = true, wait = true) => (source: Observable<T>) => {
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
export function pause() {
    pauseState$.next(true)
}
/**
 * 将程序恢复运行
 */
export function resume() {
    pauseState$.next(false)
}

/**
 * 可暂停的interval
 * @param t 时间间隔
 */
export function pausableInterval(t: number = 0, isWait = true) {
    return pausableTimer(0, t, isWait)
}

/**
 * 可暂停的timer
 * @param t 首次延迟
 * @param each 之后的每次输出间隔
 */
export function pausableTimer(t: number, each?: number, isWait = true) {
    return timer(t, each).pipe(
        pausable(true, isWait)
    )
}


/**
 * 可暂停的timeoutWith
 * @param t 
 * @param ob 
 */
export function pausableTimeoutWith(t: number, ob: Observable<any>) {
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
export function pausableTimeout(t: number) {
    return pausableTimeoutWith(t, throwError(new TimeoutError()))
}