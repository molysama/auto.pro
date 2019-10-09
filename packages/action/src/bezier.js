"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @desc 贝塞尔曲线算法，包含了3阶贝塞尔
 */
var Bezier = /** @class */ (function () {
    function Bezier() {
    }
    /**
     * @desc 获取点，这里可以设置点的个数
     * @param {number} num 点个数
     * @param {Array} p1 点坐标
     * @param {Array} p2 点坐标
     * @param {Array} p3 点坐标
     * @param {Array} p4 点坐标
     * 如果参数是 num, p1, p2 为一阶贝塞尔
     * 如果参数是 num, p1, c1, p2 为二阶贝塞尔
     * 如果参数是 num, p1, c1, c2, p2 为三阶贝塞尔
     */
    Bezier.prototype.getBezierPoints = function (num, p1, p2, p3, p4) {
        if (num === void 0) { num = 100; }
        var func;
        var points = [];
        if (!p3 && !p4) {
            func = this.oneBezier;
        }
        else if (p3 && !p4) {
            func = this.twoBezier;
        }
        else if (p3 && p4) {
            func = this.threeBezier;
        }
        for (var i = 0; i < num; i++) {
            points.push(func(i / num, p1, p2, p3, p4));
        }
        if (p4) {
            points.push(__spreadArrays(p4));
        }
        else if (p3) {
            points.push(__spreadArrays(p3));
        }
        return points;
    };
    /**
     * @desc 一阶贝塞尔
     * @param {number} t 当前百分比
     * @param {Array} p1 起点坐标
     * @param {Array} p2 终点坐标
     */
    Bezier.prototype.oneBezier = function (t, p1, p2) {
        var x1 = p1[0], y1 = p1[1];
        var x2 = p2[0], y2 = p2[1];
        var x = x1 + (x2 - x1) * t;
        var y = y1 + (y2 - y1) * t;
        return [Math.floor(x), Math.floor(y)];
    };
    /**
     * @desc 二阶贝塞尔
     * @param {number} t 当前百分比
     * @param {Array} p1 起点坐标
     * @param {Array} p2 终点坐标
     * @param {Array} cp 控制点
     */
    Bezier.prototype.twoBezier = function (t, p1, cp, p2) {
        var x1 = p1[0], y1 = p1[1];
        var cx = cp[0], cy = cp[1];
        var x2 = p2[0], y2 = p2[1];
        var x = (1 - t) * (1 - t) * x1 + 2 * t * (1 - t) * cx + t * t * x2;
        var y = (1 - t) * (1 - t) * y1 + 2 * t * (1 - t) * cy + t * t * y2;
        return [Math.floor(x), Math.floor(y)];
    };
    /**
     * @desc 三阶贝塞尔
     * @param {number} t 当前百分比
     * @param {Array} p1 起点坐标
     * @param {Array} p2 终点坐标
     * @param {Array} cp1 控制点1
     * @param {Array} cp2 控制点2
     */
    Bezier.prototype.threeBezier = function (t, p1, cp1, cp2, p2) {
        var x1 = p1[0], y1 = p1[1];
        var x2 = p2[0], y2 = p2[1];
        var cx1 = cp1[0], cy1 = cp1[1];
        var cx2 = cp2[0], cy2 = cp2[1];
        var x = x1 * (1 - t) * (1 - t) * (1 - t) +
            3 * cx1 * t * (1 - t) * (1 - t) +
            3 * cx2 * t * t * (1 - t) +
            x2 * t * t * t;
        var y = y1 * (1 - t) * (1 - t) * (1 - t) +
            3 * cy1 * t * (1 - t) * (1 - t) +
            3 * cy2 * t * t * (1 - t) +
            y2 * t * t * t;
        return [Math.floor(x), Math.floor(y)];
    };
    return Bezier;
}());
exports.default = new Bezier();
