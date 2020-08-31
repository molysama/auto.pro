'use strict';
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import { height, isRoot, pausable, scale, width } from '@auto.pro/core';
import { tap } from 'rxjs/operators';
var Bezier = require('bezier-js');
export var clickOP = function (randomOffsetX, randomOffsetY, isPausable) {
    if (randomOffsetX === void 0) { randomOffsetX = 0; }
    if (randomOffsetY === void 0) { randomOffsetY = 0; }
    if (isPausable === void 0) { isPausable = true; }
    return function (source) { return source.pipe(pausable(isPausable, false), tap(function (pt) {
        var _a;
        var x = (_a = pt || [], _a[0]), y = _a[1];
        click(x, y, [600, 800], randomOffsetX, randomOffsetY);
    })); };
};
/**
 * 根据给定的两个点进行滑动，root模式直接使用两点滑动，无障碍模式下使用贝塞尔曲线
 * @param {[number, number]} startPoint 起点
 * @param {[number, number]} endPoint 终点
 * @param {number} duration 滑动时间，默认随机800-1000毫秒，并根据两点距离进行调整
 */
export var swipe = function (startPoint, endPoint, duration) {
    var x1 = startPoint[0];
    var y1 = startPoint[1];
    var x2 = endPoint[0];
    var y2 = endPoint[1];
    var xMax = Math.max(x1, x2);
    var xMin = Math.min(x1, x2);
    var yMax = Math.max(y1, y2);
    var yMin = Math.min(y1, y2);
    // duration 距离成正比，每100px加100毫秒
    duration = duration || random(800, 1000);
    duration += Math.max(xMax - xMin, yMax - yMin);
    if (isRoot) {
        Swipe(x1, y1, x2, y2, duration);
        sleep(duration);
        return;
    }
    var c1 = [
        Math.floor((xMax - xMin) / 3 + xMin) - random(5, 10),
        Math.floor((yMax - yMin) / 3 + yMin) + random(5, 10)
    ];
    var c2 = [
        Math.floor((xMax - xMin) / 3 * 2 + xMin) + random(5, 10),
        Math.floor((yMax - yMin) / 3 * 2 + yMin) - random(5, 10)
    ];
    var curve = new (Bezier.bind.apply(Bezier, __spreadArrays([void 0], startPoint, endPoint, c1, c2)))();
    var points = curve.getLUT(16).map(function (p) { return [Math.floor(p['x']), Math.floor(p['y'])]; });
    gesture.apply(void 0, __spreadArrays([duration], points));
};
/**
 * 根据坐标进行点击，若坐标不存在则啥都不做
 * @param {number} x 要点击的横坐标
 * @param {number} y 要点击的纵坐标
 * @param {[number, number]} delay 点击后的等待延迟，默认是[600, 800]，600-800毫秒
 * @param { number } randomOffsetX 随机x轴偏差，默认0
 * @param { number } randomOffsetY 随机y轴偏差，默认0
 */
export var click = function (x, y, delay, randomOffsetX, randomOffsetY) {
    if (delay === void 0) { delay = [600, 800]; }
    if (randomOffsetX === void 0) { randomOffsetX = 0; }
    if (randomOffsetY === void 0) { randomOffsetY = 0; }
    if (x == null || y == null) {
        return;
    }
    var currentX = x + randomOffsetX * Math.random();
    var currentY = y + randomOffsetY * Math.random();
    // 保留一位小数
    currentX = Math.round(Math.max(0, Math.min(currentX, width)) * 10) / 10;
    currentY = Math.round(Math.max(0, Math.min(currentY, height)) * 10) / 10;
    if (isRoot) {
        Tap(currentX, currentY);
        sleep(300);
    }
    else {
        press(currentX, currentY, random.apply(void 0, delay));
    }
    return [currentX, currentY];
};
/**
 * 根据坐标进行点击，并按设置的标准分辨率进行适配
 */
export var clickRes = function (x, y, delay, randomOffsetX, randomOffsetY) {
    if (delay === void 0) { delay = [600, 800]; }
    if (randomOffsetX === void 0) { randomOffsetX = 0; }
    if (randomOffsetY === void 0) { randomOffsetY = 0; }
    return click(x * scale, y * scale, delay, randomOffsetX, randomOffsetY);
};
