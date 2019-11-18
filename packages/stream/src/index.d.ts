import { Observable } from 'rxjs';
export { concat } from 'rxjs';
/**
 * 添加事件流
 * @param param 要做的事
 * @param target 完成标志
 * @param {boolean} passValue 过滤器的值，默认为true
 * @param {number} maxRetryTimes 最大重试次数
 */
export declare const add: (param: any, target?: any, passValue?: boolean, maxRetryTimes?: number) => (source: Observable<any>) => Observable<any>;
declare const _default: {
    install(): void;
};
export default _default;
