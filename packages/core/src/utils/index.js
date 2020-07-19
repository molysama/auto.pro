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
/**
 * 判断当前是否为横屏
 */
exports.isScreenLandscape = function () {
    var dm = context.getResources().getDisplayMetrics();
    var wm = context.getSystemService(context.WINDOW_SERVICE);
    wm.getDefaultDisplay().getRealMetrics(dm);
    return dm.widthPixels > dm.heightPixels;
};
/**
 * 返回屏幕水平像素
 */
exports.getWidthPixels = function () {
    var dm = context.getResources().getDisplayMetrics();
    var wm = context.getSystemService(context.WINDOW_SERVICE);
    wm.getDefaultDisplay().getRealMetrics(dm);
    return dm.widthPixels;
};
/**
 * 返回屏幕纵向像素
 */
exports.getHeightPixels = function () {
    var dm = context.getResources().getDisplayMetrics();
    var wm = context.getSystemService(context.WINDOW_SERVICE);
    wm.getDefaultDisplay().getRealMetrics(dm);
    return dm.heightPixels;
};
