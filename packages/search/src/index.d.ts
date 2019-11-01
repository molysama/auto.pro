import 'es6-shim';
import { Observable } from 'rxjs';
import { Plugin } from '@auto.pro/core';
export declare function readImg(imgPath: Image | string, mode?: number): any;
/**
 *
 * @param {string} path 待查图片路径
 * @param {object} option 查询参数
 * @param {number} index 取范围内的第几个结果，值从1开始，设置该值后将转换返回值为该index的坐标或null
 * @param {string|boolean} useCache 缓存配置
 * @param {number} eachTime 找图定时器的间隔，默认为100(ms)
 * @param {number} nextTime 匹配到图片后，下一次匹配的间隔，默认为0(ms)
 * @param {boolean} once 是否只找一次，该值为true时直接返回本次匹配结果
 * @param {number} take 期望匹配到几次结果，默认为1
 * @param {function} doIfNotFound 本次未匹配到图片时将执行的函数
 * @param {Image} image 提供预截图，设置此值后，将只查询1次并返回匹配结果
 * @param {'image'|'color'} method 找图的方式，默认为image图片匹配。设为'color'后自动提取特征点并进行多点找色，且只能匹配到范围内的第一个结果，即index只有1能生效
 * @returns {Observable<[[number, number] | [number, number] | null]>}
 */
export declare function findImg(param: {
    path: string;
    option: any;
    index?: number;
    useCache?: {
        key: string;
        offset: number;
    };
    eachTime?: number;
    nextTime?: number;
    once?: boolean;
    take?: number;
    doIfNotFound?: Function;
    image?: Image;
    method?: string;
    colorPointNumber?: number;
}): Observable<any>;
/**
 * (精确查找)
 * 判断区域内是否不含有colors中的任意一个，不含有则返回true，含有则返回false
 *
 * @param {Image} image     图源
 * @param {Array} region    查找范围
 * @param {Array} colors    待查颜色数组
 */
export declare function noAnyColors(image: Image, region?: [], colors?: []): boolean;
/**
 * (精确查找)
 * 区域内含有colors中的全部颜色时，返回true，否则返回false
 *
 * @param image 图源
 * @param region 范围
 * @param colors 待查颜色数组
 */
export declare function hasMulColors(image: Image | string, region?: [], colors?: []): boolean;
/**
 * 存在任意颜色，则返回颜色坐标，否则返回false
 *
 * @param image
 * @param colors
 * @param option
 * @returns {[number, number] | false}
 */
export declare function hasAnyColors(image: Image | string, colors?: [], option?: {
    threshold: number;
}): ([number, number] | false);
declare const SearchPlugin: Plugin;
export default SearchPlugin;
