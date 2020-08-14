import { getHeightPixels } from "@auto.pro/core"
import { Subject, Observable } from "rxjs"
import { debounceTime } from "rxjs/operators"
import { skip } from "rxjs/operators"
import { map } from "rxjs/operators"
import { distinctUntilChanged } from "rxjs/operators"
import { share } from "rxjs/operators"

const resources = context.getResources()
const resourceId = resources.getIdentifier("status_bar_height", "dimen", "android")
export const statusBarHeight = resources.getDimensionPixelSize(resourceId)

type VISIBILITY_TYPE =
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
        case '无状态栏的沉浸式界面':
            window.getDecorView().setSystemUiVisibility(android.view.View.SYSTEM_UI_FLAG_FULLSCREEN)
            decorView.getChildAt(0).getLayoutParams().height = statusBarHeight + getHeightPixels()
            window.setStatusBarColor(android.graphics.Color.TRANSPARENT)
            break;

        case '有状态栏的沉浸式界面':
            decorView.setSystemUiVisibility(
                android.view.View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                | android.view.View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR
            )
            decorView.getChildAt(0).getLayoutParams().height = statusBarHeight + getHeightPixels()
            window.setStatusBarColor(android.graphics.Color.TRANSPARENT)
            screenDirection$.subscribe(requestLayout)
        default:
            break;
    }

}

/**
 * 刷新屏幕
 */
export function requestLayout() {
    const target = activity.getWindow().getDecorView().getChildAt(0)
    target.getLayoutParams().height = statusBarHeight + getHeightPixels()
    target.requestLayout()
}

const screenDirectionSource = new Subject()

/**
 * 屏幕旋转事件，返回旋转后的屏幕类型
 */
export const screenDirection$: Observable<ScreenType> = screenDirectionSource.asObservable().pipe(
    debounceTime(50),
    map(() => context.getResources().getConfiguration().orientation),
    map(v => {
        if (v === 1) {
            return '竖屏'
        } else {
            return '横屏'
        }
    }),
    distinctUntilChanged(),
    skip(1),
    share()
)
activity.getWindow().getDecorView().getChildAt(0).getViewTreeObserver().addOnGlobalLayoutListener(
    new JavaAdapter(android.view.ViewTreeObserver.OnGlobalLayoutListener, {
        onGlobalLayout() {
            screenDirectionSource.next(true)
        }
    })
)
