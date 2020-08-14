import { getHeightPixels } from "@auto.pro/core"

type VISIBILITY_TYPE = '正常'
    | '无状态栏的沉浸式界面'
    | '有状态栏的沉浸式界面'

/**
 * 设置状态栏和界面的显示情况
 * 
 * @param {VISIBILITY_TYPE} type
 */
export function setSystemUiVisibility(type: VISIBILITY_TYPE) {
    const window = activity.getWindow()
    const decorView = window.getDecorView()
    switch (type) {
        case '正常':
            window.getDecorView().setSystemUiVisibility(android.view.View.SYSTEM_UI_FLAG_VISIBLE)
            break;
        case '无状态栏的沉浸式界面':
            window.getDecorView().setSystemUiVisibility(android.view.View.SYSTEM_UI_FLAG_FULLSCREEN)
            window.setStatusBarColor(android.graphics.Color.TRANSPARENT)
            decorView.getChildAt(0).getChildAt(1).getLayoutParams().height = getHeightPixels()
            break;
        case '有状态栏的沉浸式界面':
            decorView.setSystemUiVisibility(android.view.View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN)
            window.setStatusBarColor(android.graphics.Color.TRANSPARENT)
            decorView.getChildAt(0).getChildAt(1).getLayoutParams().height = getHeightPixels()
        default:
            break;
    }

}

