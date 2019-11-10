import { isFunction } from "./utils"

declare const requestScreenCapture: any
declare const toast: any
declare const exit: any

type PluginInstallFunction = (option?: any) => any

export type Plugin = 
    | PluginInstallFunction
    | {
        install: PluginInstallFunction
    }

/**
 * 设备是否Root
 */
let isRoot: boolean

/**
 * 是否需要截图
 */
let needCap: boolean
/**
 * 是否需要无障碍服务
 */
let needService: boolean

/**
 * 基准宽度
 */
let baseWidth = 1280
/**
 * 基准高度
 */
let baseHeight = 720
/**
 * 当前设备宽度
 */
let width: number
/**
 * 当前设备高度
 */
let height: number
/**
 * 当前设备高宽与基准高宽的缩放比
 */
let scale: number

/**
 * 当前设备的屏幕类型，'w'代表横屏，'h'代表竖屏，若高宽相等则判定为横屏
 */
let screenType: ('w' | 'h')

/**
 * 截图，仅当needCap设为true时可用
 * @param path 要保存的图片路径
 * @returns {Image} 返回得到的截图
 */
function cap (path?: string) {
    if (!needCap) {
        throw 'cap仅当needCap为真值时可用'
    }
    if (path) {
        return captureScreen(path)
    } else {
        return captureScreen()
    }
}
const plugins: Plugin[] = []

/**
 * 加载插件
 * @param plugin 要加载的插件
 * @param option 插件需要的参数
 */
function use (plugin: Plugin, option?: any) {
    if (plugins.indexOf(plugin) !== -1) {
        return 
    } else if (isFunction(plugin)) {
        plugin(option)
    } else if (isFunction(plugin.install)) {
        plugin.install(option)
    }
    return plugins.push(plugin)
}
/**
 * 程序是否处于暂停状态
 */
let isPause: boolean = false
/**
 * 将程序暂停
 */
function pause () {
    isPause = true
}
/**
 * 将程序恢复运行
 */
function resume () {
    isPause = false
}
/**
 * 获取当前设备宽度的分式值，如value = 1/4，则获取宽度的1/4，并向下取整
 * @param value 要获取的宽度百分比
 * @returns 当前设备宽度 * value
 */
function getWidth (value: number = 1) {
    return Math.floor(width * value)
}
/**
 * 获取当前设备高度的分式值，如value = 1/4，则获取高度的1/4，并向下取整
 * @param value 要获取的高度百分比
 * @returns 当前设备高度 * value
 */
function getHeight (value: number = 1) {
    return Math.floor(height * value)
}

declare const android
export function getTime() {
    return android.os.SystemClock.uptimeMillis()
}

/**
 * 获取对象的原型
 * Java对象直接返回Java类名，如'Image'、'Point'
 * JS对象返回对应的原型，如 'Null' 'Undefined' 'String' 'Number' 'Function' 'Boolean'
 * @param obj 要获取原型的对象
 * @returns {string}
 */
export function getPrototype (obj: any) {
    const prototype = Object.prototype.toString.call(obj)
    if (prototype == '[object JavaObject]') {
        return obj.getClass().getSimpleName()
    } else {
        return prototype.substring(prototype.indexOf(' ') + 1, prototype.indexOf(']'))
    }
}

export {
    isRoot,
    cap,
    use,

    width,
    height,
    scale,
    getWidth,
    getHeight,
    screenType,

    isPause,
    pause,
    resume
}

/**
 * 
 * @param {number | 1280} param.baseWidth 基准宽度
 * @param {number | 720} param.baseHeight 基准高度
 * @param {boolean | false} param.needCap 是否需要截图功能
 * @param {boolean | false} param.needService 是否需要无障碍服务，默认为false，但在非root环境下将强制开启
 */
export default function (param: {
    baseWidth?: number
    baseHeight?: number
    needCap?: boolean
    needService?: boolean
} = {}) {
    needCap = param.needCap === true ? true : false
    needService = param.needService === true ? true : false

    baseWidth = param.baseWidth || baseWidth
    baseHeight = param.baseHeight || baseHeight

    screenType = baseWidth >= baseHeight ? 'w' : 'h'
    isRoot = typeof $shell != 'undefined' && $shell.checkAccess && $shell.checkAccess('root') || false

    const max = typeof device != 'undefined' ? Math.max(device.width, device.height) : 0
    const min = typeof device != 'undefined' ? Math.min(device.width, device.height) : 0

    width = screenType === 'w' ? max : min
    height = screenType === 'w' ? min : max
    scale = Math.min(width / baseWidth, height / baseHeight)

    threads && threads.start && threads.start(function () {

        if (needCap) {
            const [w, h] = screenType === 'w' ? [width, height] : [height, width]
            if (!requestScreenCapture(w, h)) {
                toast("请求截图失败");
                exit();
            }
        }

        if ((needService || !isRoot) && auto.service == null) {
            app.startActivity({
                action: "android.settings.ACCESSIBILITY_SETTINGS"
            });
        }
    })

}