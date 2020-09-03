'use strict';
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import { height, isRoot, pausable, scale, width } from '@auto.pro/core';
import { switchMap, delay } from 'rxjs/operators';
import { of } from 'rxjs';
var Bezier = require('bezier-js');
export var clickPt = isRoot ?
    function (x, y) { return Tap(x, y); } :
    function (x, y) { return press(x, y, Math.floor(Math.random() * 150) + 250); };
/**
 * 根据给定的两个点进行滑动，root模式直接使用两点滑动，无障碍模式下使用贝塞尔曲线
 * @param {[number, number]} startPoint 起点
 * @param {[number, number]} endPoint 终点
 * @param {number} duration 滑动时间，默认随机800-1000毫秒，并根据两点距离进行调整
 */
export var swipe = function (duration, startPoint, endPoint, isPausable) {
    if (isPausable === void 0) { isPausable = true; }
    return function (source) { return source.pipe(pausable(isPausable, true), switchMap(function (v) {
        startPoint = startPoint || v[0];
        endPoint = endPoint || v[1];
        var x1 = startPoint[0];
        var y1 = startPoint[1];
        var x2 = endPoint[0];
        var y2 = endPoint[1];
        var xMax = Math.max(x1, x2);
        var xMin = Math.min(x1, x2);
        var yMax = Math.max(y1, y2);
        var yMin = Math.min(y1, y2);
        duration = duration || random(400, 500);
        duration += Math.max(xMax - xMin, yMax - yMin);
        if (isRoot) {
            Swipe(x1, y1, x2, y2, duration);
            return of(v).pipe(delay(duration));
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
        return of(v);
    })); };
};
/**
 * 根据坐标进行点击，若坐标不存在则啥都不做
 * @param {number} x 要点击的横坐标，缺省的话将点击流的值
 * @param {number} y 要点击的纵坐标，缺省的话将点击流的值
 * @param {[number, number]} delay 点击后的等待延迟，默认是[600, 800]，600-800毫秒
 * @param { number } randomOffsetX 随机x轴偏差，默认0
 * @param { number } randomOffsetY 随机y轴偏差，默认0
 */
export var click = function (randomOffsetX, randomOffsetY, x, y, useScale, isPausable) {
    if (randomOffsetX === void 0) { randomOffsetX = 0; }
    if (randomOffsetY === void 0) { randomOffsetY = 0; }
    if (useScale === void 0) { useScale = false; }
    if (isPausable === void 0) { isPausable = true; }
    return function (source) { return source.pipe(pausable(isPausable, true), switchMap(function (pt) {
        if (!x && !y && !pt) {
            return of(pt);
        }
        var currentX = x || pt[0];
        var currentY = y || pt[1];
        if (currentX && currentY) {
            currentX = Math.round(Math.max(0, Math.min(currentX + Math.random() * randomOffsetX, width)) * 10) / 10;
            currentY = Math.round(Math.max(0, Math.min(currentY + Math.random() * randomOffsetY, height)) * 10) / 10;
            useScale ? clickPt(currentX * scale, currentY * scale) : clickPt(currentX, currentY);
        }
        if (isRoot) {
            return of(pt).pipe(delay(500));
        }
        else {
            return of(pt);
        }
    })); };
};
