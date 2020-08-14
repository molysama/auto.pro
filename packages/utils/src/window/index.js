"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setSystemUiVisibility = void 0;
var core_1 = require("@auto.pro/core");
/**
 * 设置状态栏和界面的显示情况
 *
 * @param {VISIBILITY_TYPE} type
 */
function setSystemUiVisibility(type) {
    var window = activity.getWindow();
    var decorView = window.getDecorView();
    switch (type) {
        case '正常':
            window.getDecorView().setSystemUiVisibility(android.view.View.SYSTEM_UI_FLAG_VISIBLE);
            break;
        case '无状态栏的沉浸式界面':
            window.getDecorView().setSystemUiVisibility(android.view.View.SYSTEM_UI_FLAG_FULLSCREEN);
            window.setStatusBarColor(android.graphics.Color.TRANSPARENT);
            decorView.getChildAt(0).getChildAt(1).getLayoutParams().height = core_1.getHeightPixels();
            break;
        case '有状态栏的沉浸式界面':
            decorView.setSystemUiVisibility(android.view.View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN);
            window.setStatusBarColor(android.graphics.Color.TRANSPARENT);
            decorView.getChildAt(0).getChildAt(1).getLayoutParams().height = core_1.getHeightPixels();
        default:
            break;
    }
}
exports.setSystemUiVisibility = setSystemUiVisibility;
