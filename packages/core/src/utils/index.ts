
export function toArray(list: any, start?: number): Array<any> {
    start = start || 0
    let i = list.length - start
    const ret: Array<any> = new Array(i)
    while (i--) {
        ret[i] = list[i + start]
    }
    return ret
}

export const isFunction = (val: any): val is Function => typeof val === 'function'

/**
 * 判断当前是否为横屏
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