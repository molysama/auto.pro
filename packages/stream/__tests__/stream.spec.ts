'use strict';

// const stream = require('../src/index');
// import { add, concat } from '../src/index'
// import { empty, of } from 'rxjs';
// import { tap, filter, map } from 'rxjs/operators';

// describe('stream', () => {
//     test('add(1)', () => {
//         return of(true).pipe(
//             add(1)
//         ).toPromise().then(v => expect(v).toEqual(1))
//     })

//     test('add(fn)', () => {
//         return of(1).pipe(
//             add(v => v + 1)
//         ).toPromise().then(v => expect(v).toEqual(2))
//     })

//     test('add(fn, true)', () => {
//         return of(10).pipe(
//             add(v => v + 5, true)
//         ).toPromise().then(v => expect(v).toEqual([15, true]))
//     })

//     test('add(fn, false, 2)', () => {
//         let p = () => of(true).pipe(
//             tap(v => console.log('of')),
//             add(() => {
//                 console.log('add')
//                 return true
//             }, false, true, 2)
//         ).toPromise()
//         return expect(p()).rejects.toMatch('invalid')
//     })

//     test('add(fn:() => ob)', () => {
//         return of(true).pipe(
//             add(() => of(1))
//         ).toPromise().then(v => expect(v).toEqual(1))
//     })

//     test('add(fn:(10) => ob)', () => {
//         return of(10).pipe(
//             add(v => of(v + 1))
//         ).toPromise().then(v => expect(v).toEqual(11))
//     })

//     test('add(fn, fn)', () => {
//         return of(1).pipe(
//             add(v => v + 5, v => v === 6),
//         ).toPromise().then(v => expect(v).toEqual([6, true]))
//     })

//     test('add(fn, fn) err', () => {
//         let $ = of(1).pipe(
//             add(v => v + 5, v => v === 5)
//         )
//         return expect($.toPromise()).rejects.toMatch('invalid')
//     })

//     test('add(fn: () => ob, fn: () => ob)', () => {
//         let $ = of(true).pipe(
//             add(v => of(10), v => of(v - 1).pipe(filter(v => v > 0)))
//         )
//         return expect($.toPromise()).resolves.toEqual([10, 9])
//     })

//     test('add(fn: () => ob, fn: () => ob) error', () => {
//         let $ = of(true).pipe(
//             add(v => of(10), v => of(v - 1).pipe(filter(v => v < 0)))
//         )
//         return expect($.toPromise()).rejects.toMatch('invalid')
//     })

//     test('add() * 2', () => {
//         let $ = of(10).pipe(
//             add(v => v + 1),
//             add(v => v + 2)
//         )
//         return expect($.toPromise()).resolves.toEqual(13)
//     })

//     test('add(,) * 2', () => {
//         let $ = of(10).pipe(
//             add(v => v + 1, true),
//             add(([v, passValue]) => v + 2)
//         )
//         return expect($.toPromise()).resolves.toEqual(13)
//     })

//     test('add(fn, fn, true)', () => {
//         let $ = of(1).pipe(
//             add(v => 1 + 2, v => v === 3)
//         )
//         return expect($.toPromise()).resolves.toEqual([3, true])
//     })

//     test('add(fn, fn, false)', () => {
//         let $ = of(1).pipe(
//             add(v => 1 + 2, v => v === 3, false)
//         )
//         return expect($.toPromise()).rejects.toMatch('invalid')
//     })

//     test('add(fn, () => ob, true)', () => {
//         let $ = of(1).pipe(
//             add(v => 1 + 2, v => of(v), true)
//         )
//         return expect($.toPromise()).resolves.toEqual([3, 3])
//     })

//     test('add(fn, () => ob, false)', () => {
//         let $ = of(1).pipe(
//             add(v => 1 + 2, v => of(v), false)
//         )
//         return expect($.toPromise()).rejects.toMatch('invalid')
//     })

//     test('add(ob, ob)', () => {
//         let $ = of(1).pipe(
//             add(of(false), of(true))
//         )
//         return expect($.toPromise()).resolves.toEqual([false, true])
//     })

//     test('add(ob, ob, false)', () => {
//         let $ = of(1).pipe(
//             add(of(false, of(true)), false)
//         )
//         return expect($.toPromise()).rejects.toMatch('invalid')
//     })

// });
