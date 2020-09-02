export declare function converToArray(list: any, start?: number): Array<any>;
export declare const isFunction: (val: any) => val is Function;
export declare function getTime(): any;
/**
 * 获取对象的原型
 * Java对象直接返回Java类名，如'Image'、'Point'
 * JS对象返回对应的原型，如 'Null' 'Undefined' 'String' 'Number' 'Function' 'Boolean' 'Array'
 * @param obj 要获取原型的对象
 * @returns {string}
 */
export declare function getPrototype(obj: any): string;
