var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { click } from '@auto.pro/action';
import { getPrototype, pausableTimer } from '@auto.pro/core';
import { clearCache, findImg } from '@auto.pro/search';
import { throwError } from 'rxjs';
import { catchError, delay, finalize, retry, switchMap, tap } from 'rxjs/operators';
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
export var clickImg = function (path, region, threshold) {
    if (region === void 0) { region = [0, 0]; }
    if (threshold === void 0) { threshold = 0.9; }
    return findImg({
        path: path,
        option: {
            region: region,
            threshold: threshold,
        },
    }).pipe(click(5, 5), delay(1000));
};
export var clickImgWithCheck = function (path, region, threshold, checkDelay, useCache) {
    if (region === void 0) { region = [0, 0]; }
    if (threshold === void 0) { threshold = 0.9; }
    if (checkDelay === void 0) { checkDelay = 1000; }
    if (useCache === void 0) { useCache = true; }
    // 点击和确认都使用同一个找图参数
    var param = {
        path: path,
        option: {
            region: region,
            threshold: threshold,
        },
        useCache: useCache ? {
            // 使用一个时间戳来进行区域缓存，执行完毕后销毁该缓存
            key: path + Date.now(),
        } : undefined,
    };
    return findImg(param).pipe(click(5, 5), switchMap(function () {
        return pausableTimer(checkDelay).pipe(switchMap(function () { return findImg(__assign(__assign({}, param), { once: true })); }), click(5, 5), tap(function (v) {
            if (v) {
                throw 'check unpass';
            }
        }), retry());
    }), catchError(function (err) {
        console.log("clickImgWithCheck " + param.path + " err", err);
        return throwError(err);
    }), 
    // 由于是按时间戳生成的唯一缓存，结束后清掉
    finalize(function () { var _a; return ((_a = param.useCache) === null || _a === void 0 ? void 0 : _a.key) && clearCache(param.useCache.key); }));
};
