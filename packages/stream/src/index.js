"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@auto.pro/core");
var search_1 = require("@auto.pro/search");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var rxjs_2 = require("rxjs");
exports.concat = rxjs_2.concat;
var createDefer = function (param, source) {
    return rxjs_1.defer(function () {
        var paramType = core_1.getPrototype(param);
        if (paramType === 'Function') {
            return source.pipe(operators_1.map(function (v) {
                return param(v);
            }));
        }
        else if (paramType === 'Object') {
            return source.pipe(operators_1.mergeMap(function () { return search_1.findImg(param); }));
        }
        else if (paramType === 'String') {
            return source.pipe(operators_1.mergeMap(function (path) { return search_1.findImg({
                path: path,
                useCache: {
                    key: '__CACHE__'
                },
                index: 1
            }); }));
        }
    });
};
/**
 * 添加事件流
 * @param target 要检测的目标
 * @param doSomething
 */
exports.add = function (param, target, maxErrorTime) {
    if (maxErrorTime === void 0) { maxErrorTime = 1; }
    return function (source) {
        return source.pipe(operators_1.mergeMap(function (v) { return rxjs_1.defer(function () {
            var paramType = core_1.getPrototype(param);
            if (paramType === 'Function') {
                var valueIsArray = core_1.getPrototype(v) === 'Array';
                var paramResult = void 0;
                if (valueIsArray) {
                    paramResult = param.apply(void 0, v);
                }
                else {
                    paramResult = param(v);
                }
                if (rxjs_1.isObservable(paramResult)) {
                    return paramResult;
                }
                else {
                    return rxjs_1.of(paramResult);
                }
            }
            else if (paramType === 'Object') {
                return search_1.findImg(param);
            }
            else if (paramType === 'String') {
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
            if (targetType === 'Function') {
                var targetResult = target(paramValue);
                if (rxjs_1.isObservable(targetResult)) {
                    return targetResult.pipe(operators_1.filter(function (v) { return Boolean(v); }), operators_1.last(), operators_1.map(function (v) { return [paramValue, v]; }), operators_1.catchError(function (v) {
                        return rxjs_1.throwError("invalid target result: " + v);
                    }));
                }
                else {
                    return rxjs_1.of(targetResult).pipe(operators_1.map(function (v) {
                        if (v) {
                            return [paramValue, v];
                        }
                        else {
                            throw "invalid target result: " + v;
                        }
                    }));
                }
            }
            else if (targetType === 'Object') {
                return search_1.findImg(target).pipe(operators_1.map(function (v) {
                    if (v) {
                        return [paramValue, v];
                    }
                    else {
                        throw "invalid target result: " + v;
                    }
                }));
            }
            else if (targetType === 'String') {
                return search_1.findImg({
                    path: target,
                    useCache: {
                        key: '__CACHE__'
                    },
                    index: 1
                }).pipe(operators_1.map(function (v) {
                    if (v) {
                        return [paramValue, v];
                    }
                    else {
                        throw "invalid target result: " + v;
                    }
                }));
            }
            else if (targetType === 'Undefined') {
                return rxjs_1.of(paramValue);
            }
            else {
                return rxjs_1.of(target).pipe(operators_1.map(function (v) {
                    if (v) {
                        return [paramValue, v];
                    }
                    else {
                        throw "invalid target result: " + v;
                    }
                }));
            }
        }), operators_1.retry(maxErrorTime)); }));
    };
};
exports.default = {
    install: function () {
    }
};
