'use strict';
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __importStar(require("@auto.pro/core"));
var index_1 = __importStar(require("../src/index"));
var Bezier = require('bezier-js');
describe('ActionPlugin', function () {
    test('bezier', function () {
        var curve = new Bezier(60, 40, 180, 90, 105, 60, 120, 50);
        var LUT = curve.getLUT(16);
        // console.log(LUT)
        expect(LUT).not.toBeUndefined();
    });
    core_1.default();
    core_1.use(index_1.default);
    test('click', function () {
        expect(index_1.click).not.toBeUndefined();
    });
    test('swipe', function () {
        expect(index_1.swipe).not.toBeUndefined();
    });
});
