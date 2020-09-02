
/**
 * 设备是否Root
 */
export const isRoot = $shell.checkAccess('root')

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