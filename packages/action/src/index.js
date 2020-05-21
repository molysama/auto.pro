'use strict';
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@auto.pro/core");
var operators_1 = require("rxjs/operators");
var Bezier = require('bezier-js');
function setAction() {
    exports.swipe = function (startPoint, endPoint, duration) {
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
        if (core_1.isRoot) {
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
    exports.click = function (x, y, delay, randomOffsetX, randomOffsetY) {
        if (delay === void 0) { delay = [600, 800]; }
        if (randomOffsetX === void 0) { randomOffsetX = 0; }
        if (randomOffsetY === void 0) { randomOffsetY = 0; }
        if (x == null || y == null) {
            return;
        }
        var currentX = x + randomOffsetX * Math.random();
        var currentY = y + randomOffsetY * Math.random();
        // 保留一位小数
        currentX = Math.round(Math.max(0, Math.min(currentX, core_1.width)) * 10) / 10;
        currentY = Math.round(Math.max(0, Math.min(currentY, core_1.height)) * 10) / 10;
        if (core_1.isRoot) {
            Tap(currentX, currentY);
            sleep(300);
        }
        else {
            press(currentX, currentY, random.apply(void 0, delay));
        }
    };
    exports.clickRes = function (x, y, delay, randomOffsetX, randomOffsetY) {
        if (delay === void 0) { delay = [600, 800]; }
        if (randomOffsetX === void 0) { randomOffsetX = 0; }
        if (randomOffsetY === void 0) { randomOffsetY = 0; }
        exports.click(x * core_1.scale, y * core_1.scale, delay, randomOffsetX, randomOffsetY);
    };
    exports.clickOP = function (x, y, delay, randomOffsetX, randomOffsetY, isPauseable) {
        if (delay === void 0) { delay = [600, 800]; }
        if (randomOffsetX === void 0) { randomOffsetX = 0; }
        if (randomOffsetY === void 0) { randomOffsetY = 0; }
        if (isPauseable === void 0) { isPauseable = true; }
        return function (source) { return source.pipe(core_1.pauseable(isPauseable, false), operators_1.map(function (pt) {
            if (x == null && core_1.getPrototype(pt) === 'Array') {
                exports.click.apply(void 0, pt);
                return pt;
            }
            else if (core_1.getPrototype(x) === 'Array') {
                exports.click.apply(void 0, x);
                return [x, y, delay, randomOffsetX, randomOffsetY];
            }
            else if (x != null) {
                exports.click(x, y, delay, randomOffsetX, randomOffsetY);
                return [x, y, delay, randomOffsetX, randomOffsetY];
            }
            else {
                return null;
            }
        })); };
    };
}
var Action = {
    install: function (option) {
        if (option === void 0) { option = {}; }
        setAction();
    }
};
exports.default = Action;
