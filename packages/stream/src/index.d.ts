import { findImgParam } from '@auto.pro/search';
import { Observable } from 'rxjs';
export { concat } from 'rxjs';
/**
 * 添加事件流
 * @param target 要检测的目标
 * @param doSomething
 */
export declare function add(target: (findImgParam | Function), doSomething: (value: any) => any, ensure?: (findImgParam | string | Function)): Observable<any>;
declare const _default: {
    install(): void;
};
export default _default;
