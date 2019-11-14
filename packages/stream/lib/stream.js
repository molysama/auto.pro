'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var core = require('@auto.pro/core');
var search = require('@auto.pro/search');
var rxjs = require('rxjs');
var operators = require('rxjs/operators');

/**
 * 添加事件流
 * @param target 要检测的目标
 * @param doSomething
 */
var add = function (param, target, maxErrorTime) {
    if (maxErrorTime === void 0) { maxErrorTime = 1; }
    return function (source) {
        return source.pipe(operators.mergeMap(function (v) { return rxjs.defer(function () {
            var paramType = core.getPrototype(param);
            if (paramType === 'Function') {
                var valueIsArray = core.getPrototype(v) === 'Array';
                var paramResult = void 0;
                if (valueIsArray) {
                    paramResult = param.apply(void 0, v);
                }
                else {
                    paramResult = param(v);
                }
                if (rxjs.isObservable(paramResult)) {
                    return paramResult;
                }
                else {
                    return rxjs.of(paramResult);
                }
            }
            else if (paramType === 'Object') {
                return search.findImg(param);
            }
            else if (paramType === 'String') {
                return search.findImg({
                    path: v,
                    useCache: {
                        key: '__CACHE__'
                    },
                    index: 1
                });
            }
            else {
                return rxjs.of(param);
            }
        }).pipe(operators.mergeMap(function (paramValue) {
            var targetType = core.getPrototype(target);
            if (targetType === 'Function') {
                var targetResult = target(paramValue);
                if (rxjs.isObservable(targetResult)) {
                    return targetResult.pipe(operators.filter(function (v) { return Boolean(v); }), operators.last(), operators.map(function (v) { return [paramValue, v]; }), operators.catchError(function (v) {
                        return rxjs.throwError("invalid target result: " + v);
                    }));
                }
                else {
                    return rxjs.of(targetResult).pipe(operators.map(function (v) {
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
                return search.findImg(target).pipe(operators.map(function (v) {
                    if (v) {
                        return [paramValue, v];
                    }
                    else {
                        throw "invalid target result: " + v;
                    }
                }));
            }
            else if (targetType === 'String') {
                return search.findImg({
                    path: target,
                    useCache: {
                        key: '__CACHE__'
                    },
                    index: 1
                }).pipe(operators.map(function (v) {
                    if (v) {
                        return [paramValue, v];
                    }
                    else {
                        throw "invalid target result: " + v;
                    }
                }));
            }
            else if (targetType === 'Undefined') {
                return rxjs.of(paramValue);
            }
            else {
                return rxjs.of(target).pipe(operators.map(function (v) {
                    if (v) {
                        return [paramValue, v];
                    }
                    else {
                        throw "invalid target result: " + v;
                    }
                }));
            }
        }), operators.retry(maxErrorTime)); }));
    };
};
var index = {
    install: function () {
    }
};

Object.defineProperty(exports, 'concat', {
    enumerable: true,
    get: function () {
        return rxjs.concat;
    }
});
exports.add = add;
exports.default = index;
