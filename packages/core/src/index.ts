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

let isRoot: boolean
let needCap: boolean
let needService: boolean

let baseWidth = 1280
let baseHeight = 720
let width: number
let height: number
let scale: number

let screenType: ('w' | 'h' | undefined)

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
let isPause: boolean = false
function pause () {
    isPause = true
}
function resume () {
    isPause = false
}
function getWidth (value: number = 1) {
    return Math.floor(width * value)
}
function getHeight (value: number = 1) {
    return Math.floor(height * value)
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