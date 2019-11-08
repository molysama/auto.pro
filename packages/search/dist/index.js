'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('es6-shim');
var rxjs = require('rxjs');
var operators = require('rxjs/operators');
var core = require('@auto.pro/core');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

importClass(org.opencv.core.MatOfKeyPoint);
importClass(org.opencv.features2d.FastFeatureDetector);
var cache = {};
var colorCache = {};
function getMatches(src) {
    var gray = images.grayscale(src);
    var sift = FastFeatureDetector.create();
    var keyPoints = new MatOfKeyPoint();
    sift.detect(gray.mat, keyPoints);
    gray.recycle();
    return keyPoints.toArray().map(function (e) { return e.pt; });
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
        w = x + w >= core.width ? core.width - x : w;
        h = y + h >= core.height ? core.height - y : h;
        return [x, y, w, h];
    }
    else if (param.length == 2) {
        return [
            Math.min(Math.max(0, param[0]), core.width),
            Math.min(Math.max(0, param[1]), core.height)
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
function readImg(imgPath, mode) {
    if (!imgPath) {
        return null;
    }
    var result;
    if (core.getPrototype(imgPath) != 'String') {
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
 * @param {number} colorPointNumber 'color'模式下，可以指定色点的个数，默认为10
 * @returns {Observable<[[number, number] | [number, number] | null]>}
 */
function findImg(param) {
    return rxjs.defer(function () {
        var path = param.path || '';
        if (!path) {
            return rxjs.throwError('path为空');
        }
        var option = param.option || {};
        var index = param.index;
        var useCache = param.useCache;
        var cachePath = useCache && (path + useCache.key || '__cache__') || null;
        var cacheOffset = useCache && useCache.offset || 2;
        var eachTime = param.eachTime || 100;
        var nextTime = param.nextTime || 0;
        var DO_IF_NOT_FOUND = param.doIfNotFound;
        var image = param.image || null;
        // 是否只找一次，无论是否找到都返回结果，默认false
        // 如果提供了截图cap，则只找一次
        var ONCE = image ? true : param.once;
        var TAKE_NUM = ONCE ? 1 : param.take === undefined ? 1 : param.take || 99999999;
        // const method = param.method === 'image' ? 'image' : 'color'
        var method = param.method === 'color' ? 'color' : 'image';
        var queryOption = __assign({}, option);
        var template;
        var colorTemplate;
        if (method === 'color') {
            var threshold = queryOption.threshold;
            if (threshold > 0 && threshold < 1 || threshold === undefined) {
                threshold = 10;
            }
            queryOption.threshold = threshold;
            // 如果path对应的缓存不存在，则需要readImg并获取色点
            if (!colorCache[path]) {
                template = readImg(path);
                if (!template) {
                    return rxjs.throwError('template path is null');
                }
                // template = images.scale(template, scale, scale)
                var points_1 = [];
                var keyPoints = getMatches(template);
                if (keyPoints.length <= 8) {
                    keyPoints.push({ x: template.width / 3, y: template.height / 3 });
                    keyPoints.push({ x: template.width / 2, y: template.height / 3 });
                    keyPoints.push({ x: template.width / 2, y: template.height / 2 });
                    keyPoints.push({ x: template.width * 3 / 4, y: template.height * 3 / 4 });
                }
                rxjs.from(keyPoints).pipe(operators.map(function (pt) {
                    var c = colors.toString(images.pixel(template, pt['x'], pt['y']));
                    return [pt['x'] * core.scale, pt['y'] * core.scale, c];
                }), operators.distinct(function (p) { return p[0] + "_" + p[1] + "_" + p[2]; }), operators.take(param.colorPointNumber === undefined ? 10 : Math.floor(param.colorPointNumber))).subscribe(function (o) { return points_1.push(o); });
                colorTemplate = {
                    color: colors.toString(images.pixel(template, 0, 0)),
                    points: points_1,
                    width: template.width * core.scale,
                    height: template.height * core.scale
                };
                template.recycle();
                template = null;
                colorCache[path] = colorTemplate;
            }
            else {
                colorTemplate = colorCache[path];
            }
        }
        else {
            template = readImg(path);
            if (!template) {
                return rxjs.throwError('template path is null');
            }
            template = images.scale(template, core.scale, core.scale);
            queryOption.threshold = queryOption.threshold || 0.8;
        }
        // 如果确认使用缓存，且缓存里已经设置有region的话，直接赋值
        if (cachePath && cache[cachePath]) {
            queryOption.region = cache[cachePath];
        }
        else if (queryOption.region) {
            var region_1 = queryOption.region || [0, 0];
            if (region_1[0] < 0) {
                region_1[0] = 0;
            }
            if (region_1[1] < 0) {
                region_1[1] = 0;
            }
            if (region_1.length == 4) {
                var x = region_1[0] + region_1[2];
                var y = region_1[1] + region_1[3];
                if (x > core.width) {
                    region_1[2] = core.width - region_1[0];
                }
                if (y > core.height) {
                    region_1[3] = core.height - region_1[1];
                }
            }
            queryOption.region = region_1;
        }
        var isPass = true;
        var t;
        return rxjs.timer(0, eachTime).pipe(operators.filter(function () { return !core.isPause && isPass; }), operators.exhaustMap(function () {
            var match;
            if (method === 'image') {
                match = images.matchTemplate(image || core.cap(), template, queryOption).matches;
            }
            else {
                var result = images.findMultiColors(image || core.cap(), colorTemplate['color'], colorTemplate['points'], queryOption);
                if (result) {
                    match = [[result['x'], result['y']]];
                }
                else {
                    match = [];
                }
            }
            if (match.length == 0 && DO_IF_NOT_FOUND) {
                DO_IF_NOT_FOUND();
            }
            return rxjs.of(match);
        }), operators.take(ONCE ? 1 : 99999999), operators.filter(function (v) { return ONCE ? true : v.length > 0; }), operators.take(TAKE_NUM), operators.map(function (res) {
            var result = method === 'color' ? res : res.map(function (p) {
                return [
                    Math.floor(p.point['x']),
                    Math.floor(p.point['y'])
                ];
            }).sort(function (a, b) {
                var absY = Math.abs(a[1] - b[1]);
                var absX = Math.abs(a[0] - b[0]);
                if (absY > 4 && a[1] > b[1]) {
                    return true;
                }
                else if (absY < 4) {
                    return absX > 4 && a[0] > b[0];
                }
                else {
                    return false;
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
        }), operators.tap(function (res) {
            // 如果有结果，且确认要缓存
            if (res && res.length > 0 && useCache && cachePath && !cache[cachePath]) {
                var xArray = res.map(function (e) { return e[0]; });
                var yArray = res.map(function (e) { return e[1]; });
                var img = method === 'color' ? colorTemplate : template;
                cache[cachePath] = region([
                    Math.min.apply(Math, xArray) - cacheOffset,
                    Math.min.apply(Math, yArray) - cacheOffset,
                    Math.max.apply(Math, xArray) + img.width + cacheOffset * 2,
                    Math.max.apply(Math, yArray) + img.height + cacheOffset * 2
                ]);
                queryOption.region = cache[cachePath];
            }
        }), operators.map(function (res) {
            var result;
            // 如果设置了取第几个，则对最后结果进行处理，有结果则直接返回索引0的值，无结果则返回null
            if (index != undefined) {
                result = res.length > 0 ? res[0] : null;
            }
            else {
                result = res;
            }
            return result;
        }), 
        // 如果没有设置ONCE，且设置了index，则对最终结果进行过滤
        operators.filter(function (v) {
            if (!ONCE && index != undefined) {
                return v;
            }
            else {
                return true;
            }
        }), operators.tap(function (v) {
            if (v && nextTime && isPass) {
                isPass = false;
                t = setTimeout(function () {
                    isPass = true;
                }, nextTime);
            }
        }), operators.finalize(function () {
            if (t) {
                clearTimeout(t);
            }
            if (template) {
                template.recycle();
            }
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
function noAnyColors(image, region, colors) {
    if (region === void 0) { region = []; }
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
    if (core.getPrototype(image) === 'String') {
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
function hasMulColors(image, region, colors) {
    if (region === void 0) { region = []; }
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
    if (core.getPrototype(image) === 'String') {
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
function hasAnyColors(image, colors, option) {
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
    if (core.getPrototype(image) === 'String') {
        src.recycle();
    }
    return result;
}
var SearchPlugin = {
    install: function (option) {
    }
};

exports.default = SearchPlugin;
exports.findImg = findImg;
exports.hasAnyColors = hasAnyColors;
exports.hasMulColors = hasMulColors;
exports.noAnyColors = noAnyColors;
exports.readImg = readImg;
