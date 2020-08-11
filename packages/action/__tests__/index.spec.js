'use strict';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
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
