import { Observable } from 'rxjs';
import { Plugin } from '@auto.pro/core';
declare function readImg(imgPath: string, mode?: number): any;
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
export declare function useSearch(): {
    readImg: typeof readImg;
    findImg: typeof findImg;
};
declare const SearchPlugin: Plugin;
export default SearchPlugin;
