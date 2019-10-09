'use strict';
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@auto.pro/core");
var bezier_1 = __importDefault(require("./bezier"));
function click(isRoot) {
    return function (x, y, delay) {
        if (delay === void 0) { delay = [600, 800]; }
        if (isRoot) {
            Tap(x, y);
            core_1.sleep(300);
        }
        else {
            press(x, y, random.apply(void 0, delay));
        }
    };
}
function swipe(isRoot) {
    return function (startPoint, endPoint, duration) {
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
            core_1.sleep(duration);
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
        var points = bezier_1.default.getBezierPoints(50, startPoint, c1, c2, endPoint);
        // 根据方向来排序坐标
        gesture.apply(void 0, __spreadArrays([duration], points));
    };
}
function cap() {
    return function (path) {
        if (path) {
            return captureScreen(path);
        }
        else {
            return captureScreen();
        }
    };
}
function useAction() {
    return {
        click: core_1.inject(clickKey),
        cap: core_1.inject(capKey),
        swipe: core_1.inject(swipeKey)
    };
}
exports.useAction = useAction;
var clickKey = Symbol();
var capKey = Symbol();
var swipeKey = Symbol();
var Action = {
    install: function (app) {
        var isRoot = app.isRoot || false;
        app.provide(clickKey, click(isRoot));
        app.provide(capKey, cap());
        app.provide(swipeKey, swipe(isRoot));
    }
};
exports.default = Action;
