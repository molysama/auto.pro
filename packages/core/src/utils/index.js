var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import { effectEvent } from "..";
import uuidjs from 'uuid-js';
import { fromEvent } from "rxjs";
import { share } from "rxjs/operators";
export function converToArray(list, start) {
    start = start || 0;
    var i = list.length - start;
    var ret = new Array(i);
    while (i--) {
        ret[i] = list[i + start];
    }
    return ret;
}
export var isFunction = function (val) { return typeof val === 'function'; };
export function getTime() {
    return android.os.SystemClock.uptimeMillis();
}
/**
 * 将ui事件转化成作业线程事件
 * @param target
 * @param eventName
 */
export function fromUiEvent(target, eventName) {
    var eventId = uuidjs.create(4).toString();
    target.on(eventName, function () {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        effectEvent.emit.apply(effectEvent, __spreadArrays([eventId], params));
    });
    return fromEvent(effectEvent, eventId).pipe(share());
}
/**
 * 获取对象的原型
 * Java对象直接返回Java类名，如'Image'、'Point'
 * JS对象返回对应的原型，如 'Null' 'Undefined' 'String' 'Number' 'Function' 'Boolean' 'Array'
 * @param obj 要获取原型的对象
 * @returns {string}
 */
export function getPrototype(obj) {
    var prototype = Object.prototype.toString.call(obj);
    if (prototype == '[object JavaObject]') {
        return obj.getClass().getSimpleName();
    }
    else {
        return prototype.substring(prototype.indexOf(' ') + 1, prototype.indexOf(']'));
    }
}
