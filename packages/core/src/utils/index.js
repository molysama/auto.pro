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
