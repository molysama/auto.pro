"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = __importDefault(require("../src/index"));
describe('Core', function () {
    var core = index_1.default();
    test('init', function () {
        expect(core.width).toBe(1280);
    });
    test('cap', function () {
        expect(core.cap).not.toBeUndefined();
    });
});
