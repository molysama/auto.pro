'use strict';

import Core, {isRoot, use} from "@auto.pro/core"
import ActionPlugin, {click, swipe} from '../src/index'

const Bezier = require('bezier-js')

describe('ActionPlugin', () => {

    test('bezier', () => {
        var curve = new Bezier(60, 40, 180, 90, 105, 60, 120, 50);
        var LUT = curve.getLUT(16);
        // console.log(LUT)
        expect(LUT).not.toBeUndefined()
    })

    Core()

    use(ActionPlugin)

    test('click', () => {
        expect(click).not.toBeUndefined()
    })

    test('swipe', () => {
        expect(swipe).not.toBeUndefined()
    })
})
