import { Observable } from 'rxjs';
export * from './pausable';
export * from './permission';
export * from './screen';
export * from './store';
export * from './utils';
/**
 * 作业流
 */
export declare let effect$: Observable<any>;
/**
 * 作业线程
 */
export declare let effectThread: Thread;
/**
 * 作业线程事件
 */
export declare let effectEvent: any;
/**
 * @param {CoreOption} param 初始化参数
 * @param {number | 1280} param.baseWidth 基准宽度，默认为1280
 * @param {number | 720} param.baseHeight 基准高度，默认为720
 * @param { false | '横屏' | '竖屏' | '自动'} param.needCap 是否需要截图功能，默认为false
 * @param {boolean | false} param.needService 是否需要无障碍服务，默认为false
 * @param {boolean | false} param.needFloaty 是否需要悬浮窗权限，默认为false
 * @param {boolean | false} param.needForeground 是否需要自动打开前台服务，默认为false
 */
export default function ({ baseWidth, baseHeight, needCap, needService, needFloaty, needForeground, needStableMode }?: {
    baseWidth?: number;
    baseHeight?: number;
    needCap?: false | '横屏' | '竖屏' | '自动';
    needService?: boolean;
    needFloaty?: boolean;
    needForeground?: boolean;
    needStableMode?: boolean;
}): void;
