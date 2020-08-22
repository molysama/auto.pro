export function toArray(list, start) {
    start = start || 0;
    var i = list.length - start;
    var ret = new Array(i);
    while (i--) {
        ret[i] = list[i + start];
    }
    return ret;
}
export var isFunction = function (val) { return typeof val === 'function'; };
/**
 * 判断当前是否为横屏
 */
export var isScreenLandscape = function () {
    var dm = context.getResources().getDisplayMetrics();
    var wm = context.getSystemService(context.WINDOW_SERVICE);
    wm.getDefaultDisplay().getRealMetrics(dm);
    return dm.widthPixels > dm.heightPixels;
};
/**
 * 返回屏幕水平像素
 */
export var getWidthPixels = function () {
    var dm = context.getResources().getDisplayMetrics();
    var wm = context.getSystemService(context.WINDOW_SERVICE);
    wm.getDefaultDisplay().getRealMetrics(dm);
    return dm.widthPixels;
};
/**
 * 返回屏幕纵向像素
 */
export var getHeightPixels = function () {
    var dm = context.getResources().getDisplayMetrics();
    var wm = context.getSystemService(context.WINDOW_SERVICE);
    wm.getDefaultDisplay().getRealMetrics(dm);
    return dm.heightPixels;
};
