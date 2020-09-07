export declare function converToArray(list: any, start?: number): Array<any>;
export declare const isFunction: (val: any) => val is Function;
export declare function getTime(): any;
/**
 * 将ui事件转化成作业线程事件
 * @param target
 * @param eventName
 */
export declare function fromUiEvent(target: any, eventName: any): import("rxjs").Observable<unknown>;
/**
 * 获取对象的原型
 * Java对象直接返回Java类名，如'Image'、'Point'
 * JS对象返回对应的原型，如 'Null' 'Undefined' 'String' 'Number' 'Function' 'Boolean' 'Array'
 * @param obj 要获取原型的对象
 * @returns {string}
 */
export declare function getPrototype(obj: any): string;
