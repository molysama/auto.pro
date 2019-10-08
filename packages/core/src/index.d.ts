export interface App {
    use(plugin: Plugin, option?: any): this;
    provide<T>(key: Symbol | string, value: T): void;
    inject<T>(key: Symbol | string): T;
}
declare type PluginInstallFunction = (app: App) => any;
export declare type Plugin = PluginInstallFunction | {
    install: PluginInstallFunction;
};
export declare function createApp(): App;
export default createApp;
