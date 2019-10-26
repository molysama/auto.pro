"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = __importStar(require("../src/index"));
index_1.default({
    baseWidth: 1920,
    baseHeight: 1280
});
describe('Core', function () {
    test('isRoot exist', function () {
        expect(index_1.isRoot).not.toBeUndefined();
    });
    test('pause', function () {
        index_1.pause();
        expect(index_1.isPause).toBe(true);
    });
    test('resume', function () {
        index_1.resume();
        expect(index_1.isPause).toBe(false);
    });
});
