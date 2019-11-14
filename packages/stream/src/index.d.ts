import { findImgParam } from '@auto.pro/search';
import { Observable } from 'rxjs';
export { concat } from 'rxjs';
/**
 * 添加事件流
 * @param target 要检测的目标
 * @param doSomething
 */
export declare const add: (param: string | number | boolean | Function | findImgParam | null | undefined, target?: string | number | boolean | Function | findImgParam | null | undefined, maxErrorTime?: number) => (source: Observable<any>) => Observable<any>;
declare const _default: {
    install(): void;
};
export default _default;
