import { isFunction } from "./utils"

declare const $shell: any

export interface InjectionKey<T> extends Symbol {}



export declare function sleep (low: number, up?: number): void

export interface Image {

}

export interface App {
    isRoot?: boolean
    use(plugin: Plugin, option?: any): this
    provide<T>(key: InjectionKey<T> | string, value: T): void
}

type PluginInstallFunction = (app: App) => any

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

export function createApp(): App {
    const app: App = {
        isRoot: typeof $shell != 'undefined' && $shell.checkAccess('root') || false,
        provide (key, value): void {
            ctx.provides[key as string] = value
        },
        use (plugin: Plugin) {
            if (isFunction(plugin)) {
                plugin(app)
            } else if (isFunction(plugin.install)) {
                plugin.install(app)
            }
            return app
        }
    }
    return app
}

export default createApp
