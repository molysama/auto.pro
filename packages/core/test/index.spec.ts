
import assert from 'assert'
import createApp, { Plugin } from '../src/index'

describe('app', () => {
    it('use', () => {
        const app = createApp()
        assert.equal(app.isRoot, false)
    })
})