export interface InjectionKey<T> extends Symbol {
}
export interface App {
    isRoot?: boolean;
    use(plugin: Plugin, option?: any): this;
    provide<T>(key: InjectionKey<T> | string, value: T): void;
}
declare type PluginInstallFunction = (app: App) => any;
export declare type Plugin = PluginInstallFunction | {
    install: PluginInstallFunction;
};
export declare function inject<T>(key: InjectionKey<T> | string): T | undefined;
export declare function inject<T>(key: InjectionKey<T> | string, defaultValue: T): T;
export declare function createApp(): App;
export default createApp;
