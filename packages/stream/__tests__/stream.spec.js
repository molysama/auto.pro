'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var stream = require('../src/index');
var index_1 = require("../src/index");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
describe('stream', function () {
    test('add(1)', function () {
        return rxjs_1.of(true).pipe(index_1.add(1)).toPromise().then(function (v) { return expect(v).toEqual(1); });
    });
    test('add(fn)', function () {
        return rxjs_1.of(1).pipe(index_1.add(function (v) { return v + 1; })).toPromise().then(function (v) { return expect(v).toEqual(2); });
    });
    test('add(fn, true)', function () {
        return rxjs_1.of(10).pipe(index_1.add(function (v) { return v + 5; }, true)).toPromise().then(function (v) { return expect(v).toEqual([15, true]); });
    });
    test('add(fn, false, 2)', function () {
        var p = function () { return rxjs_1.of(true).pipe(operators_1.tap(function (v) { return console.log('of'); }), index_1.add(function () {
            console.log('add');
            return true;
        }, false, true, 2)).toPromise(); };
        return expect(p()).rejects.toMatch('invalid');
    });
    test('add(fn:() => ob)', function () {
        return rxjs_1.of(true).pipe(index_1.add(function () { return rxjs_1.of(1); })).toPromise().then(function (v) { return expect(v).toEqual(1); });
    });
    test('add(fn:(10) => ob)', function () {
        return rxjs_1.of(10).pipe(index_1.add(function (v) { return rxjs_1.of(v + 1); })).toPromise().then(function (v) { return expect(v).toEqual(11); });
    });
    test('add(fn, fn)', function () {
        return rxjs_1.of(1).pipe(index_1.add(function (v) { return v + 5; }, function (v) { return v === 6; })).toPromise().then(function (v) { return expect(v).toEqual([6, true]); });
    });
    test('add(fn, fn) err', function () {
        var $ = rxjs_1.of(1).pipe(index_1.add(function (v) { return v + 5; }, function (v) { return v === 5; }));
        return expect($.toPromise()).rejects.toMatch('invalid');
    });
    test('add(fn: () => ob, fn: () => ob)', function () {
        var $ = rxjs_1.of(true).pipe(index_1.add(function (v) { return rxjs_1.of(10); }, function (v) { return rxjs_1.of(v - 1).pipe(operators_1.filter(function (v) { return v > 0; })); }));
        return expect($.toPromise()).resolves.toEqual([10, 9]);
    });
    test('add(fn: () => ob, fn: () => ob) error', function () {
        var $ = rxjs_1.of(true).pipe(index_1.add(function (v) { return rxjs_1.of(10); }, function (v) { return rxjs_1.of(v - 1).pipe(operators_1.filter(function (v) { return v < 0; })); }));
        return expect($.toPromise()).rejects.toMatch('invalid');
    });
    test('add() * 2', function () {
        var $ = rxjs_1.of(10).pipe(index_1.add(function (v) { return v + 1; }), index_1.add(function (v) { return v + 2; }));
        return expect($.toPromise()).resolves.toEqual(13);
    });
    test('add(,) * 2', function () {
        var $ = rxjs_1.of(10).pipe(index_1.add(function (v) { return v + 1; }, true), index_1.add(function (_a) {
            var v = _a[0], passValue = _a[1];
            return v + 2;
        }));
        return expect($.toPromise()).resolves.toEqual(13);
    });
    test('add(fn, fn, true)', function () {
        var $ = rxjs_1.of(1).pipe(index_1.add(function (v) { return 1 + 2; }, function (v) { return v === 3; }));
        return expect($.toPromise()).resolves.toEqual([3, true]);
    });
    test('add(fn, fn, false)', function () {
        var $ = rxjs_1.of(1).pipe(index_1.add(function (v) { return 1 + 2; }, function (v) { return v === 3; }, false));
        return expect($.toPromise()).rejects.toMatch('invalid');
    });
    test('add(fn, ob, true)', function () {
        var $ = rxjs_1.of(1).pipe(index_1.add(function (v) { return 1 + 2; }, function (v) { return rxjs_1.of(v); }, true));
        return expect($.toPromise()).resolves.toEqual([3, 3]);
    });
    test('add(fn, ob, false)', function () {
        var $ = rxjs_1.of(1).pipe(index_1.add(function (v) { return 1 + 2; }, function (v) { return rxjs_1.of(v); }, false));
        return expect($.toPromise()).rejects.toMatch('invalid');
    });
});
