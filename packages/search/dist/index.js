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
function getMatches(template) {
    var gray = images.grayscale(template);
    var sift = FastFeatureDetector.create();
    var keyPoints = new MatOfKeyPoint();
    sift.detect(gray.mat, keyPoints);
    gray.recycle();
    var result = [];
    var ks = keyPoints.toArray();
    for (var i = 0; i < ks.length && i <= 6; i++) {
        result.push(ks[i]['pt']);
    }
    // result = [
    //     ...result,
    //     {x: template.width / 4, y: template.height / 4},
    //     {x: template.width / 2, y: template.height / 4},
    //     {x: template.width * 3 / 4, y: template.height / 4},
    //     {x: template.width / 4, y: template.height / 2},
    //     {x: template.width / 2, y: template.height / 2},
    //     {x: template.width * 3 / 4, y: template.height / 2},
    //     {x: template.width / 4, y: template.height * 3 / 4},
    //     {x: template.width / 2, y: template.height * 3 / 4},
    //     {x: template.width * 3 / 4, y: template.height * 3 / 4}
    // ]
    return result.map(function (_a) {
        var x = _a.x, y = _a.y;
        // 先取色，后对坐标进行伸缩
        var color = images.pixel(template, x, y);
        x = Math.floor(x * core.scale);
        y = Math.floor(y * core.scale);
        return {
            x: x,
            y: y,
            color: color
        };
    });
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
function matchByColor(img, option, threshold) {
    if (threshold === void 0) { threshold = 10; }
    var headX = option.region[0];
    var headY = option.region[1];
    var headColor = option.headColor;
    var body = option.body;
    var bitmap = img.getBitmap();
    var w = bitmap.getWidth();
    var h = bitmap.getHeight();
    var pixels = util.java.array("int", w * h);
    bitmap.getPixels(pixels, 0, w, 0, 0, w, h);
    if (colors.isSimilar(headColor, pixels[headX + headY * w], threshold)) {
        var found = body && body.every(function (b) {
            return colors.isSimilar(b.color, pixels[headX + b.x + w * (headY + b.y)], threshold);
        });
        if (found) {
            return [
                {
                    point: {
                        x: headX,
                        y: headY
                    }
                }
            ];
        }
        else {
            return [];
        }
    }
    else {
        return [];
    }
}
/**
 * 找图函数，此函数为异步函数！
 * @param {string} path 待查图片路径
 * @param {object} option 查询参数
 * @param {number} index 取范围内的第几个结果，值从1开始，设置该值后将转换返回值为该index的坐标或null
 * @param {object} useCache 缓存配置
 * @param {number} eachTime 找图定时器的间隔，默认为100(ms)
 * @param {number} nextTime 匹配到图片后，下一次匹配的间隔，默认为0(ms)
 * @param {boolean} once 是否只找一次，该值为true时直接返回本次匹配结果
 * @param {number} take 期望匹配到几次结果，默认为1
 * @param {function} doIfNotFound 本次未匹配到图片时将执行的函数
 * @param {Image} image 提供预截图，设置此值后，将只查询1次并返回匹配结果
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
        var cachePath = useCache && (path + (useCache.key || '__CACHE__')) || null;
        var cacheOffset = useCache && useCache.offset || 0;
        var eachTime = param.eachTime || 100;
        var nextTime = param.nextTime || 0;
        var DO_IF_NOT_FOUND = param.doIfNotFound;
        var image = param.image || null;
        // 是否只找一次，无论是否找到都返回结果，默认false
        // 如果提供了截图cap，则只找一次
        var ONCE = image ? true : param.once;
        var TAKE_NUM = ONCE ? 1 : param.take === undefined ? 1 : param.take || 99999999;
        var queryOption = __assign({}, option);
        var template, scaleTemplate;
        queryOption.threshold = queryOption.threshold || 0.8;
        // 如果该图片已经缓存成色点，则不需要再读取图片，并可直接获得缓存的region
        if (cachePath && cache[cachePath]) {
            queryOption.region = cache[cachePath];
            // 若无缓存，则需要读取图片，并校对region参数
        }
        else {
            template = readImg(path);
            if (!template) {
                return rxjs.throwError('template path is null');
            }
            scaleTemplate = images.scale(template, core.scale, core.scale);
            if (queryOption.region) {
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
        }
        var isPass = true;
        var t;
        return rxjs.timer(0, eachTime).pipe(operators.filter(function () { return !core.isPause && isPass; }), operators.exhaustMap(function () {
            var match;
            var colorCache = cachePath && cache[cachePath];
            // 如果已经存在缓存，且指定了index，则使用找色
            if (colorCache && index) {
                match = matchByColor(image || core.cap(), colorCache);
                // 否则使用模板匹配
            }
            else {
                match = images.matchTemplate(image || core.cap(), scaleTemplate, queryOption).matches;
            }
            if (match.length == 0 && DO_IF_NOT_FOUND) {
                DO_IF_NOT_FOUND();
            }
            return rxjs.of(match);
        }), operators.take(ONCE ? 1 : 99999999), operators.filter(function (v) { return ONCE ? true : v.length > 0; }), operators.take(TAKE_NUM), operators.map(function (res) {
            var result = res.map(function (p) {
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
                var cacheRegion = region([
                    Math.min.apply(Math, xArray) - cacheOffset,
                    Math.min.apply(Math, yArray) - cacheOffset,
                    Math.max.apply(Math, xArray) + scaleTemplate.width + 1 + cacheOffset * 2,
                    Math.max.apply(Math, yArray) + scaleTemplate.height + 1 + cacheOffset * 2
                ]);
                // 如果指定了index，则将模板转换为特征点，并保存颜色、坐标、区域
                if (index) {
                    cache[cachePath] = {
                        headColor: images.pixel(template, 0, 0),
                        // 使用的是未经过裁剪的模板图片，因此结果应该进行scale处理
                        body: getMatches(template),
                        region: __spreadArrays(cacheRegion)
                    };
                    // 如果不指定index，则指保存区域
                }
                else {
                    cache[cachePath] = {
                        region: __spreadArrays(cacheRegion)
                    };
                }
                queryOption.region = __spreadArrays(cacheRegion);
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
            if (scaleTemplate) {
                scaleTemplate.recycle();
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
