
import assert from 'assert'
import createApp from '@auto.pro/core'
import ActionPlugin, {useAction} from '../lib/action'

const app = createApp()

describe('ActionPlugin', () => {
    it('app', () => {
        assert.ok(app)
    })

    it('isRoot == false', () => {
        assert.equal(app.isRoot, false)
    })

    app.use(ActionPlugin)
    const {click, cap, swipe} = useAction()
    it('click', () => {
        assert.ok(click)
    })
    it('cap', () => {
        assert.ok(cap)
    })
    it('swipe', () => {
        assert.ok(swipe)
    })
})