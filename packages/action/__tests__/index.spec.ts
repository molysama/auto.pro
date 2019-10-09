'use strict';

import Core from "@auto.pro/core"
import ActionPlugin, {useAction} from '../src/index'


describe('ActionPlugin', () => {

    const app = Core()

    test('app', () => {
        expect(app).not.toBeUndefined()
    })

    test('isRoot == false', () => {
        expect(app.isRoot).not.toBeUndefined()
    })

    app.use(ActionPlugin)
    const {click, cap, swipe} = useAction()

    test('click', () => {
        expect(click).not.toBeUndefined()
    })
    test('cap', () => {
        expect(cap).not.toBeUndefined()
    })
    test('swipe', () => {
        expect(swipe).not.toBeUndefined()
    })
})
