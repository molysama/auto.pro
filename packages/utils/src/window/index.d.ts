declare type VISIBILITY_TYPE = '正常' | '无状态栏的沉浸式界面' | '有状态栏的沉浸式界面';
/**
 * 设置状态栏和界面的显示情况
 *
 * @param {VISIBILITY_TYPE} type
 */
export declare function setSystemUiVisibility(type: VISIBILITY_TYPE): void;
export {};
