"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var random_1 = __importDefault(require("lodash/fp/random"));
describe('lodash', function () {
    test('random', function () {
        var num = random_1.default(0, 10);
        console.log('num', num);
        expect(num).not.toBeUndefined();
    });
});
