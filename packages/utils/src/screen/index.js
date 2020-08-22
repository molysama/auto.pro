import { getHeightPixels } from "@auto.pro/core";
import { Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, map, share, skip } from "rxjs/operators";
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
export function requestLayout() {
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
 */
export var screenDirection$ = screenDirectionSource.asObservable().pipe(debounceTime(50), map(function () { return context.getResources().getConfiguration().orientation; }), map(function (v) {
    if (v === 1) {
        return '竖屏';
    }
    else {
        return '横屏';
    }
}), distinctUntilChanged(), skip(1), share());
activity.getWindow().getDecorView().getChildAt(0).getViewTreeObserver().addOnGlobalLayoutListener(new JavaAdapter(android.view.ViewTreeObserver.OnGlobalLayoutListener, {
    onGlobalLayout: function () {
        screenDirectionSource.next(true);
    }
}));
