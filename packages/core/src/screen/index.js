import { Subject, fromEvent } from "rxjs";
import { debounceTime, distinctUntilChanged, map, share, skip } from "rxjs/operators";
/**
 * 编写脚本时的基准宽度
 */
export var baseWidth = 1280;
/**
 * 编写脚本时的基准高度
 */
export var baseHeight = 720;
/**
 * 与基准宽度对应的当前宽度
 */
export var width;
/**
 * 与基准高度对应的当前高度
 */
export var height;
/**
 * 与基准高宽对应的分辨率缩放比
 */
export var scale;
/**
 * 初始化屏幕参数
 * @param baseWidth
 * @param baseHeight
 */
export function initScreenSet(baseWidth, baseHeight) {
    if (baseWidth === void 0) { baseWidth = 1280; }
    if (baseHeight === void 0) { baseHeight = 720; }
    var screenType = baseWidth >= baseHeight ? 'w' : 'h';
    var max = Math.max(device.width, device.height);
    var min = Math.min(device.width, device.height);
    width = screenType === 'w' ? max : min;
    height = screenType === 'w' ? min : max;
    scale = Math.min(width / baseWidth, height / baseHeight);
}
/**
 * 截屏
 * @param path 要保存的图片路径
 */
export function cap(path) {
    if (path) {
        return images.captureScreen(path);
    }
    else {
        return images.captureScreen();
    }
}
/**
 * 返回异步截图流
 * @param value
 */
export var cap$ = fromEvent($images, 'screen_capture').pipe(share());
/**
 * 获取当前width的分式值，如value = 1/4，则获取width的1/4，并向下取整
 * @param value 要获取的宽度百分比
 * @returns 当前设备宽度 * value
 */
export function getWidth(value) {
    if (value === void 0) { value = 1; }
    return Math.floor(width * value);
}
/**
 * 获取当前height的分式值，如value = 1/4，则获取height的1/4，并向下取整
 * @param value 要获取的高度百分比
 * @returns 当前设备高度 * value
 */
export function getHeight(value) {
    if (value === void 0) { value = 1; }
    return Math.floor(height * value);
}
/**
 * 判断当前是否为横屏，true为横屏，false为竖屏
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
var resources = context.getResources();
var resourceId = resources.getIdentifier("status_bar_height", "dimen", "android");
export var statusBarHeight = resources.getDimensionPixelSize(resourceId);
var systemUiVisibilitySub;
/**
 * 设置状态栏和界面的显示情况
 *
 * @param {VISIBILITY_TYPE} type
 */
export function setSystemUiVisibility(type) {
    var window = activity.getWindow();
    var decorView = window.getDecorView();
    var rect = new android.graphics.Rect();
    decorView.getWindowVisibleDisplayFrame(rect);
    var rectHeight = rect.height();
    if (type === '无状态栏的沉浸式界面') {
        decorView.setSystemUiVisibility(android.view.View.SYSTEM_UI_FLAG_FULLSCREEN);
    }
    else if (type === '有状态栏的沉浸式界面') {
        decorView.setSystemUiVisibility(android.view.View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
            | android.view.View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR);
    }
    else {
        return;
    }
    window.setStatusBarColor(android.graphics.Color.TRANSPARENT);
    var params = decorView.getChildAt(0).getChildAt(1).getLayoutParams();
    if (statusBarHeight + rectHeight > getHeightPixels()) {
        params.height = rectHeight;
    }
    else {
        params.height = statusBarHeight + rectHeight;
    }
    if (!systemUiVisibilitySub) {
        systemUiVisibilitySub = screenDirection$.subscribe(requestLayout);
    }
}
/**
 * 刷新屏幕
 */
function requestLayout() {
    var decorView = activity.getWindow().getDecorView();
    var target = decorView.getChildAt(0).getChildAt(1);
    var rect = new android.graphics.Rect();
    decorView.getWindowVisibleDisplayFrame(rect);
    target.getLayoutParams().height = statusBarHeight + rect.height();
    target.requestLayout();
}
var screenDirectionSource = new Subject();
/**
 * 屏幕旋转事件，返回旋转后的屏幕类型
 * @returns {'横屏'|'竖屏'}
 */
export var screenDirection$ = screenDirectionSource.asObservable().pipe(debounceTime(50), map(function () { return context.getResources().getConfiguration().orientation; }), map(function (v) {
    if (v === 1) {
        return '竖屏';
    }
    else {
        return '横屏';
    }
}), distinctUntilChanged(), skip(1), share());
// 带界面的情况下，可以通过布局变化检测到屏幕旋转
if (typeof activity === 'undefined') {
    // 无界面下尚无思路，欢迎提交pr
}
else {
    activity.getWindow().getDecorView().getChildAt(0).getViewTreeObserver().addOnGlobalLayoutListener(new JavaAdapter(android.view.ViewTreeObserver.OnGlobalLayoutListener, {
        onGlobalLayout: function () {
            screenDirectionSource.next(true);
        }
    }));
}
