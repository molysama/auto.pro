"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@auto.pro/core");
var search_1 = require("@auto.pro/search");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var rxjs_2 = require("rxjs");
exports.concat = rxjs_2.concat;
function isFindImgParam(param) {
    return core_1.getPrototype(param) === 'Object' && param.path !== undefined;
}
function isFunction(param) {
    return core_1.getPrototype(param) === 'Function';
}
function isString(param) {
    return core_1.getPrototype(param) === 'String';
}
/**
 * 添加事件流
 * @param param 要做的事
 * @param target 完成标志
 * @param {boolean} passValue 过滤器的值，默认为true
 * @param {number} maxRetryTimes 最大重试次数
 */
exports.add = function (param, target, passValue, maxRetryTimes) {
    if (passValue === void 0) { passValue = true; }
    if (maxRetryTimes === void 0) { maxRetryTimes = 1; }
    return function (source) {
        return source.pipe(operators_1.mergeMap(function (v) { return rxjs_1.defer(function () {
            if (isFunction(param)) {
                var paramResult = param(v);
                if (rxjs_1.isObservable(paramResult)) {
                    return paramResult;
                }
                else {
                    return rxjs_1.of(paramResult);
                }
            }
            else if (isFindImgParam(param)) {
                return search_1.findImg(param);
            }
            else if (isString(param)) {
                return search_1.findImg({
                    path: v,
                    useCache: {
                        key: '__CACHE__'
                    },
                    index: 1
                });
            }
            else {
                return rxjs_1.of(param);
            }
        }).pipe(operators_1.mergeMap(function (paramValue) {
            var targetType = core_1.getPrototype(target);
            var filterValue = function () { return operators_1.map(function (v) {
                if (Boolean(v) === Boolean(passValue)) {
                    return [paramValue, v];
                }
                else {
                    throw "invalid target result: " + v + " is not " + passValue;
                }
            }); };
            if (targetType === 'Function') {
                var targetResult = target(paramValue);
                if (rxjs_1.isObservable(targetResult)) {
                    return targetResult.pipe(operators_1.filter(function (v) { return Boolean(v) === Boolean(passValue); }), operators_1.last(), operators_1.map(function (v) { return [paramValue, v]; }), operators_1.catchError(function (v) {
                        return rxjs_1.throwError("invalid target result: " + v);
                    }));
                }
                else {
                    return rxjs_1.of(targetResult).pipe(filterValue());
                }
            }
            else if (targetType === 'Object') {
                return search_1.findImg(target).pipe(filterValue());
            }
            else if (targetType === 'String') {
                return search_1.findImg({
                    path: target,
                    useCache: {
                        key: '__CACHE__'
                    },
                    index: 1
                }).pipe(filterValue());
            }
            else if (targetType === 'Undefined') {
                return rxjs_1.of(paramValue);
            }
            else {
                return rxjs_1.of(target).pipe(filterValue());
            }
        }), operators_1.retry(maxRetryTimes)); }));
    };
};
exports.default = {
    install: function () {
    }
};
