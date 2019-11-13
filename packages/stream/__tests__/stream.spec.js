'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var stream = require('../src/index');
var index_1 = require("../src/index");
describe('stream', function () {
    test('add', function () {
        return index_1.add(function () { return 1; }, function (v) { return v + 19; }, function (v) { return v == 20; }).toPromise().then(function (v) { return expect(v).toEqual(20); });
    });
});
