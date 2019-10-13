import Core from '../src/index'

declare const __TEST_GLOBAL__

describe('Core', () => {


    const core = Core()
    test('init', () => {
        expect(core.width).toBe(1280)
    })

    test('cap', () => {
        expect(core.cap).not.toBeUndefined()
    })
})