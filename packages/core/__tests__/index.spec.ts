import Core, { isRoot } from '../src/index'

Core({
    baseWidth: 1920,
    baseHeight: 1280
})

describe('Core', () => {

    test('isRoot exist', () => {
        expect(isRoot).not.toBeUndefined()
    })

})