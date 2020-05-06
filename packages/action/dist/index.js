'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

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
        if (core.isRoot) {
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
        var currentX = x + randomOffsetX * Math.random() * (Math.random() >= 0.5 ? 1 : -1);
        var currentY = y + randomOffsetY * Math.random() * (Math.random() >= 0.5 ? 1 : -1);
        currentX = Math.max(0, Math.min(currentX, core.width));
        currentY = Math.max(0, Math.min(currentY, core.height));
        if (core.isRoot) {
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
        exports.click(x * core.scale, y * core.scale, delay, randomOffsetX, randomOffsetY);
    };
}
var Action = {
    install: function (option) {
        setAction();
    }
};

exports.default = Action;
