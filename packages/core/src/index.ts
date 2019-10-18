import { isFunction } from "./utils"

declare const requestScreenCapture: any
declare const toast: any
declare const exit: any

export type CapFunction = (path?: string) => any

export interface InjectionKey<T> extends Symbol {}

export interface Core {
    isRoot: boolean
    width: number
    height: number
    scale: number
    screenType: ('w' | 'h' | undefined)
    cap: CapFunction

    plugins: Plugin[]

    use(plugin: Plugin, option?: any): this
    provide<T>(key: InjectionKey<T> | string, value: T): void

    getWidth(value: number): number
    getHeight(value: number): number
}

type PluginInstallFunction = (core: Core, option?: any) => any

export type Plugin = 
    | PluginInstallFunction
    | {
        install: PluginInstallFunction
    }

const ctx: Record<symbol | string, any> = {
    provides: {}
}
export function inject<T>(key: InjectionKey<T> | string): T | undefined
export function inject<T>(key: InjectionKey<T> | string, defaultValue: T): T
export function inject(key: InjectionKey<any> | string, defaultValue?: any) {
  if (ctx) {
    const provides = ctx.provides
    if (key in provides) {
      // TS doesn't allow symbol as index type
      return provides[key as string]
    } else if (defaultValue !== undefined) {
      return defaultValue
    }
  }
}

/**
 * 
 * @param {number | 1280} param.baseWidth 脚本制作时的宽度基准值
 * @param {number | 720} param.baseHeight 脚本制作时的高度基准值
 * @param {boolean | true} param.needCap 是否需要截图权限
 */
export default function (param: {
    baseWidth?: number,
    baseHeight?: number,
    needCap?: boolean,
    needService?: boolean
} = {
}): Core {

    const needCap = param.needCap === false ? false : true
    const baseWidth = param.baseWidth || 1280
    const baseHeight = param.baseHeight || 720
    const screenType = baseWidth >= baseHeight ? 'w' : 'h'
    const isRoot = typeof $shell != 'undefined' && $shell.checkAccess && $shell.checkAccess('root') || false
    const max = typeof device != 'undefined' ? Math.max(device.width, device.height) : 0
    const min = typeof device != 'undefined' ? Math.min(device.width, device.height) : 0

    const width = screenType === 'w' ? max : min
    const height = screenType === 'w' ? min : max

    const scale = Math.min(width / baseWidth, height / baseHeight)

    threads && threads.start && threads.start(function () {

        if (needCap) {
            const [w, h] = screenType === 'w' ? [width, height] : [height, width]
            if (!requestScreenCapture(w, h)) {
                toast("请求截图失败");
                exit();
            }
        }

        if ((param.needService || !isRoot) && auto.service == null) {
            app.startActivity({
                action: "android.settings.ACCESSIBILITY_SETTINGS"
            });
        }
    })

    const core: Core = {
        isRoot,
        width,
        height,
        scale,
        plugins: [],
        screenType,
        cap (path?: string) {
            if (!needCap) {
                throw 'cap仅当needCap为真值时可用'
            }
            if (path) {
                return captureScreen(path)
            } else {
                return captureScreen()
            }
        },

        provide (key, value): void {
            ctx.provides[key as string] = value
        },
        use (plugin: Plugin, option: any = {}) {
            if (this.plugins.indexOf(plugin) != -1) {
                return core
            }
            if (isFunction(plugin)) {
                plugin(core, option)
            } else if (isFunction(plugin.install)) {
                plugin.install(core, option)
            }
            this.plugins.push(plugin)
            return core
        },
        getWidth(value: number = 1) {
            return Math.floor(this.width * value)
        },
        getHeight(value: number = 1) {
            return Math.floor(this.height * value)
        }
    }
    return core
}
