"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = __importDefault(require("../src/index"));
describe('app', function () {
    test('init', function () {
        var app = index_1.default();
        expect(app.isRoot).toBe(false);
    });
});
