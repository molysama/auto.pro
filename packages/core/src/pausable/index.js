import { BehaviorSubject, merge, throwError, TimeoutError, timer } from 'rxjs';
import { catchError, concatMap, exhaustMap, filter, map, repeat, scan, share, switchMap, take, takeUntil, tap, toArray } from 'rxjs/operators';
/**
 * 程序暂停状态值
 * true为正在暂停，false为非暂停
 */
export var pauseState$ = new BehaviorSubject(false);
// export declare function filter<T>(predicate: (value: T, index: number) => boolean, thisArg?: any): MonoTypeOperatorFunction<T>;
/**
 * 操作符，使流可暂停，可设ispausable为false来强制关闭暂停效果
 * @param {boolean} isPausable 是否强制取消暂停效果
 * @param {boolean} wait wait为true时将阻塞并存储所有输入，为false时忽略暂停期间的输入
 */
export var pausable = function (isPausable, wait) {
    if (isPausable === void 0) { isPausable = true; }
    if (wait === void 0) { wait = true; }
    return function (source) {
        if (isPausable) {
            if (wait) {
                return source.pipe(concatMap(function (value) {
                    return pauseState$.pipe(filter(function (v) { return !v; }), take(1), map(function () { return value; }));
                }));
            }
            else {
                return source.pipe(exhaustMap(function (value) { return pauseState$.pipe(filter(function (v) { return !v; }), take(1), map(function () { return value; })); }));
            }
        }
        else {
            return source;
        }
    };
};
/**
 * 将程序暂停
 */
export function pause() {
    pauseState$.next(true);
}
/**
 * 将程序恢复运行
 */
export function resume() {
    pauseState$.next(false);
}
/**
 * 可暂停的interval
 * @param t 时间间隔
 */
export function pausableInterval(t, isWait) {
    if (t === void 0) { t = 0; }
    if (isWait === void 0) { isWait = true; }
    return pausableTimer(0, t, isWait);
}
/**
 * 可暂停的timer
 * @param t 首次延迟
 * @param each 之后的每次输出间隔
 */
export function pausableTimer(t, each, isWait) {
    if (isWait === void 0) { isWait = true; }
    return timer(t, each).pipe(pausable(true, isWait));
}
/**
 * 可暂停的timeoutWith
 * @param t
 * @param ob
 */
export function pausableTimeoutWith(t, ob) {
    return function (source) {
        var begin = Date.now();
        var total = t;
        var source$ = source.pipe(share());
        return merge(source$, 
        // 只允许默认和【非暂停->暂停】状态通过的流
        pauseState$.pipe(scan(function (_a, now) {
            var result = _a[0], prev = _a[1];
            if (prev === undefined) {
                result = true;
            }
            else if (prev === false && now === true) {
                result = true;
            }
            else {
                result = false;
            }
            return [result, now];
        }, [true, undefined]), filter(function (v) { return v[0]; }), map(function (v) { return v[1]; }))
            .pipe(switchMap(function (vp) {
            // 如果是暂停，则延迟时间为：剩余时间 - (当前时间 - 起始时间)
            if (vp) {
                total = total - (Date.now() - begin);
                return pauseState$.pipe(filter(function (v) { return !v; }), concatMap(function () {
                    begin = Date.now();
                    return timer(total);
                }));
            }
            else {
                // 如果是非暂停，则延迟t毫秒，并初始化起始时间
                begin = Date.now();
                return timer(t);
            }
        }), takeUntil(source$.pipe(tap(function () {
            begin = Date.now();
            total = t;
        }))), repeat(), takeUntil(source$.pipe(toArray())), switchMap(function () { return throwError(new TimeoutError()); }))).pipe(catchError(function (err) {
            if (err instanceof TimeoutError) {
                return ob;
            }
            else {
                return throwError(err);
            }
        }));
    };
}
/**
 * 可暂停的timeout
 * @param t
 */
export function pausableTimeout(t) {
    return pausableTimeoutWith(t, throwError(new TimeoutError()));
}
