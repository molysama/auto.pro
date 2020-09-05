import { Observable } from "rxjs";
/**
 * 编写脚本时的基准宽度
 */
export declare let baseWidth: number;
/**
 * 编写脚本时的基准高度
 */
export declare let baseHeight: number;
/**
 * 与基准宽度对应的当前宽度
 */
export declare let width: number;
/**
 * 与基准高度对应的当前高度
 */
export declare let height: number;
/**
 * 与基准高宽对应的分辨率缩放比
 */
export declare let scale: number;
/**
 * 初始化屏幕参数
 * @param baseWidth
 * @param baseHeight
 */
export declare function initScreenSet(baseWidth?: number, baseHeight?: number): void;
/**
 * 截屏
 * @param path 要保存的图片路径
 */
export declare function cap(path?: string): void | Image;
/**
 * 返回异步截图流
 * @param value
 */
export declare const cap$: Observable<Image>;
/**
 * 获取当前width的分式值，如value = 1/4，则获取width的1/4，并向下取整
 * @param value 要获取的宽度百分比
 * @returns 当前设备宽度 * value
 */
export declare function getWidth(value?: number): number;
/**
 * 获取当前height的分式值，如value = 1/4，则获取height的1/4，并向下取整
 * @param value 要获取的高度百分比
 * @returns 当前设备高度 * value
 */
export declare function getHeight(value?: number): number;
/**
 * 判断当前是否为横屏，true为横屏，false为竖屏
 */
export declare const isScreenLandscape: () => boolean;
/**
 * 返回屏幕水平像素
 */
export declare const getWidthPixels: () => number;
/**
 * 返回屏幕纵向像素
 */
export declare const getHeightPixels: () => number;
export declare const statusBarHeight: any;
declare type VISIBILITY_TYPE = '无状态栏的沉浸式界面' | '有状态栏的沉浸式界面';
/**
 * 设置状态栏和界面的显示情况
 *
 * @param {VISIBILITY_TYPE} type
 */
export declare function setSystemUiVisibility(type: VISIBILITY_TYPE): void;
/**
 * 屏幕旋转事件，返回旋转后的屏幕类型
 * @returns {'横屏'|'竖屏'}
 */
export declare const screenDirection$: Observable<"竖屏" | "横屏">;
export {};
