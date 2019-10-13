"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var width;
var height;
var scale;
var cap;
var cache = {};
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
    else {
        return param;
    }
}
function getPrototype(obj) {
    if (obj == undefined) {
        return null;
    }
    var prototype = Object.prototype.toString.call(obj);
    if (prototype == '[object JavaObject]') {
        return obj.getClass().getSimpleName();
    }
    else {
        return prototype.substring(prototype.indexOf(' ') + 1, prototype.indexOf(']'));
    }
}
function readImg(imgPath, mode) {
    if (!imgPath) {
        return null;
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
 *
 * @param {string} path 待查图片路径
 * @param {object} option 查询参数
 * @param {string|boolean} useCache 缓存名，false则不使用缓存
 */
function findImg(param) {
    var path = param.path || '';
    var option = param.option || {};
    var useCache = param.useCache;
    var cachePath = useCache && (useCache.key || '__cache__') || null;
    var cacheOffset = useCache && useCache.offset || 2;
    var eachTime = param.eachTime || 100;
    var nextTime = param.nextTime;
    var DO_IF_NOT_FOUND = param.doIfNotFound;
    var image = param.image || null;
    // 是否只找一次，无论是否找到都返回结果，默认false
    // 如果提供了截图cap，则只找一次
    var ONCE = image ? true : param.once;
    var TAKE_NUM = ONCE ? 1 : param.take === undefined ? 1 : param.take || 99999999;
    var template = readImg(path);
    if (!template) {
        return rxjs_1.throwError('template path is null');
    }
    template = images.scale(template, scale, scale);
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
    var pass$ = image ? null : new rxjs_1.BehaviorSubject(true);
    var image$ = image ? rxjs_1.of(image) : rxjs_1.timer(0, eachTime).pipe(operators_1.withLatestFrom(pass$ && pass$.pipe(operators_1.switchMap(function (v) {
        if (v) {
            return rxjs_1.of(v);
        }
        else {
            return rxjs_1.of(true).pipe(operators_1.delay(nextTime || 500), operators_1.startWith(false));
        }
    })) || rxjs_1.of(true)), operators_1.filter(function (v) { return v[1]; }), operators_1.map(function () { return cap(); }));
    return image$.pipe(operators_1.exhaustMap(function (src) {
        var match = images.matchTemplate(src, template, queryOption).matches;
        if (match.length == 0 && DO_IF_NOT_FOUND) {
            DO_IF_NOT_FOUND();
        }
        return rxjs_1.of(match);
    }), operators_1.take(ONCE ? 1 : 99999999), operators_1.filter(function (v) { return ONCE ? true : v.length > 0; }), operators_1.take(TAKE_NUM), operators_1.map(function (res) {
        return res.map(function (p) {
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
    }), operators_1.tap(function (res) {
        // 如果有结果，且确认要缓存
        // 若指定了index为数字，则将对应的结果存入缓存
        // 若指定了index为'all'，则将所有结果范围内的边界作为缓存
        // 若指定了useCache，但没指定index，则index为0
        if (res && res.length > 0 && useCache && cachePath && !cache[cachePath]) {
            useCache.index = useCache.index || 0;
            var cacheRegion = void 0;
            if (typeof useCache.index == 'number' && res.length > useCache.index) {
                cacheRegion = region([
                    res[useCache.index][0] - cacheOffset,
                    res[useCache.index][1] - cacheOffset,
                    res[useCache.index][0] + template.width + cacheOffset * 2,
                    res[useCache.index][1] + template.height + cacheOffset * 2
                ]);
            }
            else if (useCache.index === 'all') {
                if (res.length == 0) {
                    cacheRegion = region([
                        res[0][0] - cacheOffset,
                        res[0][1] - cacheOffset,
                        res[0][1] + template.width + cacheOffset * 2,
                        res[0][1] + template.height + cacheOffset * 2
                    ]);
                }
                else {
                    var xArray = res.map(function (e) { return e[0]; });
                    var yArray = res.map(function (e) { return e[1]; });
                    cacheRegion = region([
                        Math.min.apply(Math, xArray) - cacheOffset,
                        Math.min.apply(Math, yArray) - cacheOffset,
                        Math.max.apply(Math, xArray) + template.width + cacheOffset * 2,
                        Math.max.apply(Math, yArray) + template.height + cacheOffset * 2
                    ]);
                }
            }
            cache[cachePath] = cacheRegion;
            queryOption.region = cache[cachePath];
        }
        if (nextTime) {
            pass$ && pass$.next(false);
        }
    }), operators_1.finalize(function () {
        template.recycle();
        pass$ && pass$.complete();
    }));
}
exports.findImg = findImg;
function useSearch() {
    return {
        readImg: readImg,
        findImg: findImg
    };
}
exports.useSearch = useSearch;
var SearchPlugin = {
    install: function (core, option) {
        if (option === void 0) { option = {
            baseWidth: 1280,
            baseHeight: 720
        }; }
        var baseWidth = option.baseWidth || 1280;
        var baseHeight = option.baseHeight || 720;
        width = core.width;
        height = core.height;
        scale = Math.min(core.width / baseWidth, core.height / baseHeight);
        cap = core.cap;
    }
};
exports.default = SearchPlugin;
