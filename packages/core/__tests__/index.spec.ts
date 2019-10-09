import createApp, { Plugin } from '../src/index'

describe('app', () => {
    test('init', () => {
        const app = createApp()
        expect(app.isRoot).toBe(false)
    })
})