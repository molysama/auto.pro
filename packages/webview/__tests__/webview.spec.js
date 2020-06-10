"use strict";
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
});
