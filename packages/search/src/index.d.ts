import { Observable } from 'rxjs';
import { Plugin } from '@auto.pro/core';
/**
 *
 * @param {string} path 待查图片路径
 * @param {object} option 查询参数
 * @param {string|boolean} useCache 缓存名，false则不使用缓存
 */
export declare function findImg(param: {
    path: string;
    option: any;
    useCache?: {
        key: string;
        offset: number;
        index: number | 'all';
    };
    eachTime: number;
    nextTime?: number;
    once?: boolean;
    take?: number;
    doIfNotFound?: Function;
    image?: Image;
}): Observable<[[number, number]]>;
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
