
import { Subject, fromEvent, Observable } from "rxjs"
import { debounceTime, distinctUntilChanged, map, share, skip } from "rxjs/operators"

/**
 * 编写脚本时的基准宽度
 */
export let baseWidth = 1280

/**
 * 编写脚本时的基准高度
 */
export let baseHeight = 720

/**
 * 与基准宽度对应的当前宽度
 */
export let width: number

/**
 * 与基准高度对应的当前高度
 */
export let height: number

/**
 * 与基准高宽对应的分辨率缩放比
 */
export let scale: number

/**
 * 初始化屏幕参数
 * @param baseWidth 
 * @param baseHeight 
 */
export function initScreenSet(baseWidth = 1280, baseHeight = 720) {

    const screenType = baseWidth >= baseHeight ? 'w' : 'h'

    const max = Math.max(device.width, device.height)
    const min = Math.min(device.width, device.height)

    width = screenType === 'w' ? max : min
    height = screenType === 'w' ? min : max
    scale = Math.min(width / baseWidth, height / baseHeight)
}

/**
 * 截屏
 * @param path 要保存的图片路径
 */
export function cap(path?: string) {
    if (path) {
        return images.captureScreen(path)
    } else {
        return images.captureScreen()
    }
}

/**
 * 返回异步截图流
 * @param value 
 */
export const cap$ = (fromEvent($images, 'screen_capture') as Observable<Image>).pipe(
    share()
)

/**
 * 获取当前width的分式值，如value = 1/4，则获取width的1/4，并向下取整
 * @param value 要获取的宽度百分比
 * @returns 当前设备宽度 * value
 */
export function getWidth(value: number = 1) {
    return Math.floor(width * value)
}

/**
 * 获取当前height的分式值，如value = 1/4，则获取height的1/4，并向下取整
 * @param value 要获取的高度百分比
 * @returns 当前设备高度 * value
 */
export function getHeight(value: number = 1) {
    return Math.floor(height * value)
}

/**
 * 判断当前是否为横屏，true为横屏，false为竖屏
 */
export const isScreenLandscape = (): boolean => {
    let dm = context.getResources().getDisplayMetrics();
    let wm = context.getSystemService(context.WINDOW_SERVICE);
    wm.getDefaultDisplay().getRealMetrics(dm);
    return dm.widthPixels > dm.heightPixels
}

/**
 * 返回屏幕水平像素
 */
export const getWidthPixels = (): number => {
    let dm = context.getResources().getDisplayMetrics();
    let wm = context.getSystemService(context.WINDOW_SERVICE);
    wm.getDefaultDisplay().getRealMetrics(dm);
    return dm.widthPixels
}

/**
 * 返回屏幕纵向像素
 */
export const getHeightPixels = (): number => {
    let dm = context.getResources().getDisplayMetrics();
    let wm = context.getSystemService(context.WINDOW_SERVICE);
    wm.getDefaultDisplay().getRealMetrics(dm);
    return dm.heightPixels
}


const resources = context.getResources()
const resourceId = resources.getIdentifier("status_bar_height", "dimen", "android")
export const statusBarHeight = resources.getDimensionPixelSize(resourceId)

type VISIBILITY_TYPE =
    | '无状态栏的沉浸式界面'
    | '有状态栏的沉浸式界面'

let systemUiVisibilitySub
/**
 * 设置状态栏和界面的显示情况
 * 
 * @param {VISIBILITY_TYPE} type
 */
export function setSystemUiVisibility(type: VISIBILITY_TYPE) {
    const window = activity.getWindow()
    const decorView = window.getDecorView()
    const rect = new android.graphics.Rect()
    decorView.getWindowVisibleDisplayFrame(rect)
    const rectHeight = rect.height()

    if (type === '无状态栏的沉浸式界面') {
        decorView.setSystemUiVisibility(android.view.View.SYSTEM_UI_FLAG_FULLSCREEN)

    } else if (type === '有状态栏的沉浸式界面') {
        decorView.setSystemUiVisibility(
            android.view.View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
            | android.view.View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR
        )

    } else {
        return
    }

    window.setStatusBarColor(android.graphics.Color.TRANSPARENT)

    const params = decorView.getChildAt(0).getChildAt(1).getLayoutParams()
    if (statusBarHeight + rectHeight > getHeightPixels()) {
        params.height = rectHeight
    } else {
        params.height = statusBarHeight + rectHeight
    }


    if (!systemUiVisibilitySub) {
        systemUiVisibilitySub = screenDirection$.subscribe(requestLayout)
    }

}

/**
 * 刷新屏幕
 */
function requestLayout() {
    const decorView = activity.getWindow().getDecorView()
    const target = decorView.getChildAt(0).getChildAt(1)
    const rect = new android.graphics.Rect()
    decorView.getWindowVisibleDisplayFrame(rect)
    target.getLayoutParams().height = statusBarHeight + rect.height()
    target.requestLayout()
}

const screenDirectionSource = new Subject()

/**
 * 屏幕旋转事件，返回旋转后的屏幕类型
 * @returns {'横屏'|'竖屏'}
 */
export const screenDirection$ = screenDirectionSource.asObservable().pipe(
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

// 带界面的情况下，可以通过布局变化检测到屏幕旋转
if (typeof activity === 'undefined') {
    // 无界面下尚无思路，欢迎提交pr
} else {
    activity.getWindow().getDecorView().getChildAt(0).getViewTreeObserver().addOnGlobalLayoutListener(
        new JavaAdapter(android.view.ViewTreeObserver.OnGlobalLayoutListener, {
            onGlobalLayout() {
                screenDirectionSource.next(true)
            }
        })
    )
}