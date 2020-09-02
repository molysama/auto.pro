import { Subject } from 'rxjs';
export * from './pausable';
export * from './permission';
export * from './screen';
export * from './store';
export * from './utils';
/**
 * 作业用
 */
export declare const effect$: Subject<unknown>;
/**
 * ui线程
 */
export declare const uiThread: any;
/**
 * 作业线程
 */
export declare let effectThread: Thread;
/**
 * @param {object} param
 * @param {number | 1280} param.baseWidth 基准宽度
 * @param {number | 720} param.baseHeight 基准高度
 * @param {boolean | false} param.needCap 是否需要截图功能
 * @param {boolean | false} param.needService 是否需要无障碍服务，默认为false
 * @param {boolean | false} param.needFloaty 是否需要悬浮窗权限，默认为false
 * @param {boolean | false} param.needForeground 是否需要自动打开前台服务，默认为false
 */
export default function ({ baseWidth, baseHeight, needCap, needService, needFloaty, needForeground, needStableMode }?: {
    baseWidth?: number | undefined;
    baseHeight?: number | undefined;
    needCap?: boolean | undefined;
    needService?: boolean | undefined;
    needFloaty?: boolean | undefined;
    needForeground?: boolean | undefined;
    needStableMode?: boolean | undefined;
}): void;
