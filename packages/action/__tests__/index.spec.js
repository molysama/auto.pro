'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __importDefault(require("@auto.pro/core"));
var index_1 = __importStar(require("../src/index"));
describe('ActionPlugin', function () {
    var app = core_1.default();
    test('app', function () {
        expect(app).not.toBeUndefined();
    });
    test('isRoot == false', function () {
        expect(app.isRoot).not.toBeUndefined();
    });
    app.use(index_1.default);
    var _a = index_1.useAction(), click = _a.click, cap = _a.cap, swipe = _a.swipe;
    test('click', function () {
        expect(click).not.toBeUndefined();
    });
    test('cap', function () {
        expect(cap).not.toBeUndefined();
    });
    test('swipe', function () {
        expect(swipe).not.toBeUndefined();
    });
});
