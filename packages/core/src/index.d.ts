export declare type CapFunction = (path?: string) => any;
export interface InjectionKey<T> extends Symbol {
}
export interface Core {
    isRoot: boolean;
    width: number;
    height: number;
    screenType: ('w' | 'h' | undefined);
    cap: CapFunction;
    plugins: Plugin[];
    use(plugin: Plugin, option?: any): this;
    provide<T>(key: InjectionKey<T> | string, value: T): void;
    getWidth(value: number): number;
    getHeight(value: number): number;
}
declare type PluginInstallFunction = (core: Core, option?: any) => any;
export declare type Plugin = PluginInstallFunction | {
    install: PluginInstallFunction;
};
export declare function inject<T>(key: InjectionKey<T> | string): T | undefined;
export declare function inject<T>(key: InjectionKey<T> | string, defaultValue: T): T;
/**
 *
 * @param {'w' | 'h' | undefined} screenType 期望的屏幕类型，默认为横屏'w'，设为undefined时将无屏幕信息，影响截图、找图等功能
 */
export default function (screenType?: ('w' | 'h' | undefined)): Core;
export {};
