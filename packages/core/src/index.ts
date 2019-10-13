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
 * @param {'w' | 'h' | undefined} screenType 期望的屏幕类型，默认为横屏'w'，设为undefined时将无屏幕信息，影响截图、找图等功能
 */
export default function (screenType: ('w' | 'h' | undefined) = 'w'): Core {

    const isRoot = typeof $shell != 'undefined' && $shell.checkAccess && $shell.checkAccess('root') || false
    const width = typeof device != 'undefined' ? Math.max(device.width, device.height) : 0
    const height = typeof device != 'undefined' ? Math.min(device.width, device.height) : 0

    if (!isRoot) {
        threads && threads.start && threads.start(function () {

            if (screenType) {
                const [w, h] = screenType === 'w' ? [width, height] : [height, width]
                if (!requestScreenCapture(w, h)) {
                    toast("请求截图失败");
                    exit();
                }
            }

            if (auto.service == null) {
                app.startActivity({
                    action: "android.settings.ACCESSIBILITY_SETTINGS"
                });
            }
        })
    }

    const core: Core = {
        isRoot,
        width,
        height,
        plugins: [],
        screenType,
        cap (path?: string) {
            if (!screenType) {
                throw 'cap仅当screenType为真值时可用'
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
            if (this.plugins.includes(plugin)) {
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
