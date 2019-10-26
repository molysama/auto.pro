import Core, {isPause, pause, resume, isRoot} from '../src/index'

Core({
    baseWidth: 1920,
    baseHeight: 1280
})

describe('Core', () => {

    test('isRoot exist', () => {
        expect(isRoot).not.toBeUndefined()
    })

    test('pause', () => {
        pause()
        expect(isPause).toBe(true)
    })

    test('resume', () => {
        resume()
        expect(isPause).toBe(false)
    })
})