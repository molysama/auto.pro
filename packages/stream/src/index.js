"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@auto.pro/core");
var search_1 = require("@auto.pro/search");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var rxjs_2 = require("rxjs");
exports.concat = rxjs_2.concat;
/**
 * 添加事件流
 * @param target 要检测的目标
 * @param doSomething
 */
function add(target, doSomething, ensure) {
    var target$;
    var targetType = core_1.getPrototype(target);
    if (targetType === 'Function') {
        target$ = rxjs_1.of(target());
    }
    else if (targetType === 'Object') {
        target$ = search_1.findImg(target);
    }
    var ensure$;
    var ensureType = core_1.getPrototype(ensure);
    if (ensureType === 'Object') {
        ensure$ = function () { return search_1.findImg(ensure); };
    }
    else if (ensureType === 'Function') {
        ensure$ = function (param) { return rxjs_1.of(ensure(param)); };
    }
    else {
        ensure$ = function () { return rxjs_1.of(true); };
    }
    return target$.pipe(operators_1.mergeMap(function (value) {
        var result = doSomething && doSomething(value);
        return ensure$(result).pipe(operators_1.map(function (v) {
            if (v) {
                return result;
            }
            else {
                throw "invalid value: " + v;
            }
        }));
    }), operators_1.retry(10), operators_1.catchError(function (err) {
        return rxjs_1.of(err);
    }));
}
exports.add = add;
exports.default = {
    install: function () {
    }
};
