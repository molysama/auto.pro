export declare type CapFunction = (path?: string) => any;
export interface InjectionKey<T> extends Symbol {
}
export interface Core {
    isRoot: boolean;
    width: number;
    height: number;
    scale: number;
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
 * @param {number | 1280} param.baseWidth 脚本制作时的宽度基准值
 * @param {number | 720} param.baseHeight 脚本制作时的高度基准值
 * @param {boolean | true} param.needCap 是否需要截图权限
 */
export default function (param?: {
    baseWidth?: number;
    baseHeight?: number;
    needCap?: boolean;
    needService?: boolean;
}): Core;
export {};
