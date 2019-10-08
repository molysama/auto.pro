
import assert from 'assert'
import createApp, { Plugin } from '../src/index'

describe('app', () => {
    it('use', () => {
        const plugin: Plugin = {
            install (app) {
                app.provide('action', () => 1)
            } 
        }
        const app = createApp()
        app.use(plugin)
        const action: Function = app.inject('action')
        assert.equal(action(), 1)
    })
})