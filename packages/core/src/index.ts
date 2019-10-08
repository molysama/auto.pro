import { isFunction } from "./utils"

export interface App {
    use(plugin: Plugin, option?: any): this
    provide<T>(key: Symbol | string, value: T): void
    inject<T>(key: Symbol | string): T
}

type PluginInstallFunction = (app: App) => any

export type Plugin = 
    | PluginInstallFunction
    | {
        install: PluginInstallFunction
    }

export function createApp(): App {
    const ctx: Record<symbol | string, any> = {
        provides: {}
    }
    const app: App = {
        provide (key, value): void {
            ctx.provides[key as any] = value
        },
        inject (key: (Symbol | string), defaultValue?: any) {
            const provides = ctx.provides
            if (key in provides) {
                return provides[key as any] as any
            } else if (defaultValue !== undefined) {
                return defaultValue
            }
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
