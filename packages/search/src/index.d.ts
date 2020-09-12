export declare type FindImgParam = {
    path: string;
    when?: Function;
    option?: {
        region?: RegionType;
        threshold?: number;
    };
    index?: number;
    useCache?: {
        key?: string;
        offset?: number;
    };
    eachTime?: number;
    nextTime?: number;
    once?: boolean;
    take?: number;
    doIfNotFound?: Function;
    image?: Image;
    valid?: number;
    isPausable?: boolean;
    center?: boolean;
};
import { Observable } from 'rxjs';
export declare function clearCache(cacheName: string): void;
/**
 * 获取指定路径的Image对象，若已是Image则不重复获取
 * @param {string | Image} imgPath 图片路径
 * @param {number | undefined} mode 获取模式，若为0则返回灰度图像
 * @returns {Image | null}
 */
export declare function readImg(imgPath: Image | string, mode?: number): Image;
/**
 * 找图函数，此函数为异步函数！
 * @param {string} path 待查图片路径
 * @param {Function} when 传递一个函数作为filter，仅当函数返回值为真时进行找图
 * @param {object} option 查询参数
 * @param {number} index 取范围内的第几个结果，值从1开始。默认为1，设置为null、fale时返回所有结果
 * @param {object} useCache 缓存配置
 * @param {number} eachTime 找图定时器的间隔，默认为100(ms)
 * @param {number} nextTime 匹配到图片后，下一次匹配的间隔，默认为0(ms)
 * @param {boolean} once 是否只找一次，该值为true时直接返回本次匹配结果
 * @param {number} take 期望匹配到几次结果，默认为1
 * @param {function} doIfNotFound 本次未匹配到图片时将执行的函数
 * @param {Image} image 提供预截图，设置此值后，将只查询1次并返回匹配结果
 * @param {number} valid 当valid大于0时，启用颜色匹配验证，消除匹配误差，默认为30
 * @param {boolean} isPausable 是否受暂停状态影响，默认为true，受影响
 * @param {boolean} center 是否将返回坐标处理成图片中心
 * @returns {Observable<[[number, number] | [number, number] | null]>}
 */
export declare function findImg(param: FindImgParam): Observable<any>;
/**
 * (精确查找)
 * 判断区域内是否不含有colors中的任意一个，不含有则返回true，含有则返回false
 *
 * @param {string | Image} image     图源，若为字符串则自动回收内存
 * @param {Array} region    查找范围
 * @param {Array<Color>} colors    待查颜色数组
 */
export declare function noAnyColors(image: Image, region?: RegionType, colors?: []): boolean;
/**
 * (精确查找)
 * 区域内含有colors中的全部颜色时，返回true，否则返回false
 *
 * @param {string | Image} image     图源，若为字符串则自动回收内存
 * @param {Array} region 范围
 * @param {Array<Color>} colors 待查颜色数组
 */
export declare function hasMulColors(image: Image | string, region?: RegionType, colors?: []): boolean;
/**
 * 存在任意颜色，则返回颜色坐标，否则返回false
 *
 * @param {string | Image} image 图源，若为字符串则自动回收内存
 * @param {Array<Color>} colors 待查颜色数组
 * @param {{
 *      threshold: 10,
 *      region: []
 * }} option 查找参数
 * @returns {[number, number] | false}
 */
export declare function hasAnyColors(image: Image | string, colors?: [], option?: {
    threshold: number;
}): ([number, number] | false);
