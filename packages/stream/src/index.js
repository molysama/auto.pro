import { getPrototype } from '@auto.pro/core';
import { tap } from 'rxjs/operators';
export { concat } from 'rxjs';
function isFindImgParam(param) {
    return getPrototype(param) === 'Object' && param.path !== undefined;
}
function isFunction(param) {
    return getPrototype(param) === 'Function';
}
function isString(param) {
    return getPrototype(param) === 'String';
}
export var tag = function (text, showValue, fn) {
    if (showValue === void 0) { showValue = false; }
    tap(function (v) {
        if (showValue) {
            console.log('tag', text, v);
        }
        else {
            console.log('tag', text);
        }
        if (fn) {
            fn(v);
        }
    });
};
// export const clickImg = (path: string, region: RegionType = [0, 0], threshold = 0.9) => {
//     return findImg({
//         path,
//         option: {
//             region,
//             threshold,
//         },
//     }).pipe(
//         tap((pt) => {
//             // click(x, y, [600, 800], 5, 5)
//         }),
//         delay(1000)
//     )
// }
// export const clickImgWithCheck = (
//     path,
//     region: RegionType = [0, 0],
//     threshold = 0.9,
//     checkDelay = 1000,
//     useCache = true
// ) => {
//     // 点击和确认都使用同一个找图参数
//     const param: FindImgParam = {
//         path,
//         option: {
//             region,
//             threshold,
//         },
//         useCache: useCache ? {
//             // 使用一个时间戳来进行区域缓存，执行完毕后销毁该缓存
//             key: path + Date.now(),
//         } : undefined,
//     }
//     return findImg(param).pipe(
//         tap(([x, y]) => {
//             click(x, y)
//         }),
//         switchMap((pt) =>
//             pausableTimer(checkDelay).pipe(
//                 switchMap(() => findImg({ ...param, once: true })),
//                 switchMap((v) => {
//                     // 如果点击后能再次找到该图，则再次点击并抛出错误，随后retry会重试确认
//                     if (v) {
//                         click(v[0], v[1])
//                         return throwError("check unpass")
//                     } else {
//                         return of(pt)
//                     }
//                 }),
//                 retry()
//             )
//         ),
//         catchError((err) => {
//             console.log(`clickImgWithCheck ${param.path} err`, err)
//             return throwError(err)
//         }),
//         // 由于是按时间戳生成的唯一缓存，结束后清掉
//         finalize(() => param.useCache?.key && clearCache(param.useCache.key))
//     )
// }
export default {
    install: function () {
    }
};
