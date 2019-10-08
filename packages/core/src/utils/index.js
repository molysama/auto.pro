"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function toArray(list, start) {
    start = start || 0;
    var i = list.length - start;
    var ret = new Array(i);
    while (i--) {
        ret[i] = list[i + start];
    }
    return ret;
}
exports.toArray = toArray;
exports.isFunction = function (val) { return typeof val === 'function'; };
