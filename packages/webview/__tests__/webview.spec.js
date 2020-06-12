"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var uuid_js_1 = __importDefault(require("uuid-js"));
describe('webview', function () {
    test('runHtmlFunction param', function () {
        var arr = [];
        function run() {
            var value = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                value[_i] = arguments[_i];
            }
            eval("arr.push(..." + JSON.stringify(value) + ")");
            console.log(arr);
            return arr;
        }
        expect(run(1, 2, 'ddd', [4, 5, 6])).toEqual([1, 2, 'ddd', [4, 5, 6]]);
    });
    test('uuid', function () {
        var uuid = uuid_js_1.default.create(4).toString();
        console.log('uuid', uuid);
        expect(uuid).not.toBeUndefined();
    });
});
