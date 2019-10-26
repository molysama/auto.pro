declare type PluginInstallFunction = (option?: any) => any;
export declare type Plugin = PluginInstallFunction | {
    install: PluginInstallFunction;
};
declare let isRoot: boolean;
declare let width: number;
declare let height: number;
declare let scale: number;
declare let screenType: ('w' | 'h' | undefined);
declare function cap(path?: string): Image;
declare function use(plugin: Plugin, option?: any): number | undefined;
declare let isPause: boolean;
declare function pause(): void;
declare function resume(): void;
declare function getWidth(value?: number): number;
declare function getHeight(value?: number): number;
export { isRoot, cap, use, width, height, scale, getWidth, getHeight, screenType, isPause, pause, resume };
export default function (param?: {
    baseWidth?: number;
    baseHeight?: number;
    needCap?: boolean;
    needService?: boolean;
}): void;
