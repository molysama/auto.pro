var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import { getPrototype, height, pausable, scale, width, cap$ } from '@auto.pro/core';
import { defer, of, throwError } from 'rxjs';
import { exhaustMap, filter, finalize, map, take, tap, throttleTime } from 'rxjs/operators';
var cache = {};
export function clearCache(cacheName) {
    delete cache[cacheName];
}
/**
 * 将坐标转换成region类型，即[x1, y1, x2, y2] -> [x, y, w, h]，并做好边界处理
 * @param param
 */
function region(param) {
    if (param.length == 4) {
        var x = Math.max(0, param[0]);
        var y = Math.max(0, param[1]);
        var w = param[2] - x;
        var h = param[3] - y;
        w = x + w >= width ? width - x : w;
        h = y + h >= height ? height - y : h;
        return [x, y, w, h];
    }
    else if (param.length == 2) {
        return [
            Math.min(Math.max(0, param[0]), width),
            Math.min(Math.max(0, param[1]), height)
        ];
    }
    else {
        return param;
    }
}
/**
 * 获取指定路径的Image对象，若已是Image则不重复获取
 * @param {string | Image} imgPath 图片路径
 * @param {number | undefined} mode 获取模式，若为0则返回灰度图像
 * @returns {Image | null}
 */
export function readImg(imgPath, mode) {
    if (!imgPath) {
        throw "\u56FE\u7247" + imgPath + "\u4E0D\u5B58\u5728";
    }
    var result;
    if (getPrototype(imgPath) != 'String') {
        result = imgPath;
    }
    else {
        result = images.read(imgPath);
    }
    if (mode === 0) {
        result = images.grayscale(result);
    }
    return result;
}
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
export function findImg(param) {
    return defer(function () {
        var path = param.path || '';
        var option = param.option || {};
        var index = param.index === undefined ? 1 : param.index;
        var useCache = param.useCache;
        var cachePath = useCache && (path + useCache.key || '__CACHE__') || null;
        var cacheOffset = useCache && useCache.offset || 2;
        var eachTime = param.eachTime || 100;
        var nextTime = param.nextTime || 0;
        var DO_IF_NOT_FOUND = param.doIfNotFound;
        var image = param.image || null;
        var valid = param.valid == null ? 30 : ~~param.valid;
        var isPausable = param.isPausable === false ? false : true;
        // 是否只找一次，无论是否找到都返回结果，默认false
        // 如果提供了截图cap，则只找一次
        var ONCE = image ? true : param.once;
        var TAKE_NUM = ONCE ? 1 : param.take === undefined ? 1 : param.take || 99999999;
        var template = readImg(path);
        if (!template) {
            return throwError("template path " + path + " is null");
        }
        if (scale !== 1) {
            template = images.scale(template, scale, scale);
        }
        var queryOption = __assign({}, option);
        queryOption.threshold = queryOption.threshold || 0.8;
        // 如果确认使用缓存，且缓存里已经设置有region的话，直接赋值
        if (cachePath && cache[cachePath]) {
            queryOption.region = cache[cachePath];
        }
        else if (queryOption.region) {
            var region_1 = queryOption.region;
            if (region_1[0] < 0) {
                region_1[0] = 0;
            }
            if (region_1[1] < 0) {
                region_1[1] = 0;
            }
            if (region_1.length == 4) {
                var x = region_1[0] + region_1[2];
                var y = region_1[1] + region_1[3];
                if (x > width) {
                    region_1[2] = width - region_1[0];
                }
                if (y > height) {
                    region_1[3] = height - region_1[1];
                }
            }
            queryOption.region = region_1;
        }
        var when = param.when || (function () { return true; });
        var isPass = true;
        var t;
        return cap$.pipe(pausable(isPausable, false), filter(function (cap) { return cap.isRecycled() === false; }), throttleTime(eachTime), filter(function () { return isPass && when(); }), exhaustMap(function (cap) {
            var src = image || cap;
            var matches = images.matchTemplate(src, template, queryOption).matches;
            if (valid > 0) {
                matches = matches.filter(function (match) {
                    return images.findColorInRegion(src, images.pixel(template, 0, 0), match.point.x, match.point.y, 10, 10, valid);
                });
            }
            if (matches.length == 0 && DO_IF_NOT_FOUND) {
                DO_IF_NOT_FOUND();
            }
            return of(matches);
        }), take(ONCE ? 1 : 99999999), filter(function (v) { return ONCE ? true : v.length > 0; }), take(TAKE_NUM), 
        // TODO 使用MatchingResult自带的排序
        map(function (res) {
            var result = res.map(function (p) {
                return [
                    Math.floor(p.point['x']),
                    Math.floor(p.point['y'])
                ];
            }).sort(function (a, b) {
                var absY = Math.abs(a[1] - b[1]);
                var absX = Math.abs(a[0] - b[0]);
                if (absY > 4 && a[1] > b[1]) {
                    return -1;
                }
                else if (absY < 4) {
                    return (absX > 4 && a[0] > b[0]) ? -1 : 1;
                }
                else {
                    return 1;
                }
            });
            // 如果设置了取第几个
            if (index != undefined) {
                // 如果从缓存里找，则只判断索引0
                if (cachePath && cache[cachePath]) {
                    result = result.length > 0 ? [result[0]] : [];
                }
                else {
                    // 如果还未设置缓存，则取第index-1个，没有则返回空数组
                    result = result.length >= index ? [result[index - 1]] : [];
                }
            }
            return result;
        }), tap(function (res) {
            // 如果有结果，且确认要缓存
            if (res && res.length > 0 && useCache && cachePath && !cache[cachePath]) {
                var xArray = res.map(function (e) { return e[0]; });
                var yArray = res.map(function (e) { return e[1]; });
                cache[cachePath] = region([
                    Math.min.apply(Math, xArray) - cacheOffset,
                    Math.min.apply(Math, yArray) - cacheOffset,
                    Math.max.apply(Math, xArray) + template.width + cacheOffset * 2,
                    Math.max.apply(Math, yArray) + template.height + cacheOffset * 2
                ]);
                queryOption.region = cache[cachePath];
            }
        }), map(function (res) {
            var result;
            // 如果设置了取第几个，则对最后结果进行处理，有结果则直接返回索引0的值，无结果则返回null
            if (index != undefined) {
                result = res.length > 0 ? res[0] : null;
            }
            else {
                result = res;
            }
            if (param.center) {
                result = result && result.map(function (pt) { return [pt[0] + template.width / 2, pt[1] + template.height / 2]; });
            }
            return result;
        }), 
        // 如果没有设置ONCE，且设置了index，则对最终结果进行过滤
        filter(function (v) {
            if (!ONCE && index != undefined) {
                return v;
            }
            else {
                return true;
            }
        }), tap(function (v) {
            if (v && nextTime && isPass) {
                isPass = false;
                t = setTimeout(function () {
                    isPass = true;
                }, nextTime);
            }
        }), finalize(function () {
            if (t) {
                clearTimeout(t);
            }
            template.recycle();
        }));
    });
}
/**
 * (精确查找)
 * 判断区域内是否不含有colors中的任意一个，不含有则返回true，含有则返回false
 *
 * @param {string | Image} image     图源，若为字符串则自动回收内存
 * @param {Array} region    查找范围
 * @param {Array<Color>} colors    待查颜色数组
 */
export function noAnyColors(image, region, colors) {
    if (region === void 0) { region = [0, 0]; }
    if (colors === void 0) { colors = []; }
    var src = readImg(image);
    var result = !colors.some(function (c) {
        if (images.findColorEquals.apply(images, __spreadArrays([src, c], region))) {
            return true;
        }
        else {
            return false;
        }
    });
    if (getPrototype(image) === 'String') {
        src.recycle();
    }
    return result;
}
/**
 * (精确查找)
 * 区域内含有colors中的全部颜色时，返回true，否则返回false
 *
 * @param {string | Image} image     图源，若为字符串则自动回收内存
 * @param {Array} region 范围
 * @param {Array<Color>} colors 待查颜色数组
 */
export function hasMulColors(image, region, colors) {
    if (region === void 0) { region = [0, 0]; }
    if (colors === void 0) { colors = []; }
    var src = readImg(image);
    var result = colors.every(function (c) {
        if (images.findColorEquals.apply(images, __spreadArrays([src, c], region))) {
            return true;
        }
        else {
            return false;
        }
    });
    if (getPrototype(image) === 'String') {
        src.recycle();
    }
    return result;
}
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
export function hasAnyColors(image, colors, option) {
    if (colors === void 0) { colors = []; }
    if (option === void 0) { option = {
        threshold: 10
    }; }
    var result = false;
    var src = readImg(image);
    colors.some(function (c) {
        var has = images.findColor(src, c, option);
        if (has) {
            result = [has['x'], has['y']];
            return true;
        }
        else {
            return false;
        }
    });
    if (getPrototype(image) === 'String') {
        src.recycle();
    }
    return result;
}
