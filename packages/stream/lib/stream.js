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
function add(target, doSomething, ensure) {
    var target$;
    var targetType = core.getPrototype(target);
    if (targetType === 'Function') {
        target$ = rxjs.of(target());
    }
    else if (targetType === 'Object') {
        target$ = search.findImg(target);
    }
    var ensure$;
    var ensureType = core.getPrototype(ensure);
    if (ensureType === 'Object') {
        ensure$ = function () { return search.findImg(ensure); };
    }
    else if (ensureType === 'Function') {
        ensure$ = function (param) { return rxjs.of(ensure(param)); };
    }
    else {
        ensure$ = function () { return rxjs.of(true); };
    }
    return target$.pipe(operators.mergeMap(function (value) {
        var result = doSomething && doSomething(value);
        return ensure$(result).pipe(operators.map(function (v) {
            if (v) {
                return result;
            }
            else {
                throw "invalid value: " + v;
            }
        }));
    }), operators.retry(10), operators.catchError(function (err) {
        return rxjs.of(err);
    }));
}
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
