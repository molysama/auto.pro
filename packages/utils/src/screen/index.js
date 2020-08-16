"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.screenDirection$ = exports.requestLayout = exports.setSystemUiVisibility = exports.statusBarHeight = void 0;
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var resources = context.getResources();
var resourceId = resources.getIdentifier("status_bar_height", "dimen", "android");
exports.statusBarHeight = resources.getDimensionPixelSize(resourceId);
var systemUiVisibilitySub;
/**
 * 设置状态栏和界面的显示情况
 *
 * @param {VISIBILITY_TYPE} type
 */
function setSystemUiVisibility(type) {
    var window = activity.getWindow();
    var decorView = window.getDecorView();
    var rect = new android.graphics.Rect();
    decorView.getWindowVisibleDisplayFrame(rect);
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
    decorView.getChildAt(0).getLayoutParams().height = exports.statusBarHeight * 2 + rect.height();
    window.setStatusBarColor(android.graphics.Color.TRANSPARENT);
    if (!systemUiVisibilitySub) {
        systemUiVisibilitySub = exports.screenDirection$.subscribe(requestLayout);
    }
}
exports.setSystemUiVisibility = setSystemUiVisibility;
/**
 * 刷新屏幕
 */
function requestLayout() {
    var decorView = activity.getWindow().getDecorView();
    var target = decorView.getChildAt(0);
    var rect = new android.graphics.Rect();
    decorView.getWindowVisibleDisplayFrame(rect);
    target.getLayoutParams().height = exports.statusBarHeight + rect.height();
    target.requestLayout();
}
exports.requestLayout = requestLayout;
var screenDirectionSource = new rxjs_1.Subject();
/**
 * 屏幕旋转事件，返回旋转后的屏幕类型
 */
exports.screenDirection$ = screenDirectionSource.asObservable().pipe(operators_1.debounceTime(50), operators_1.map(function () { return context.getResources().getConfiguration().orientation; }), operators_1.map(function (v) {
    if (v === 1) {
        return '竖屏';
    }
    else {
        return '横屏';
    }
}), operators_1.distinctUntilChanged(), operators_1.skip(1), operators_1.share());
activity.getWindow().getDecorView().getChildAt(0).getViewTreeObserver().addOnGlobalLayoutListener(new JavaAdapter(android.view.ViewTreeObserver.OnGlobalLayoutListener, {
    onGlobalLayout: function () {
        screenDirectionSource.next(true);
    }
}));
