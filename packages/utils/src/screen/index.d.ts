import { Observable } from "rxjs";
export declare const statusBarHeight: any;
declare type VISIBILITY_TYPE = '无状态栏的沉浸式界面' | '有状态栏的沉浸式界面';
/**
 * 设置状态栏和界面的显示情况
 *
 * @param {VISIBILITY_TYPE} type
 */
export declare function setSystemUiVisibility(type: VISIBILITY_TYPE): void;
/**
 * 刷新屏幕
 */
export declare function requestLayout(): void;
/**
 * 屏幕旋转事件，返回旋转后的屏幕类型
 */
export declare const screenDirection$: Observable<ScreenType>;
export {};
