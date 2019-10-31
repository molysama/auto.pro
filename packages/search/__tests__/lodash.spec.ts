import random from 'lodash/fp/random'

describe('lodash', () => {

    test('random', () => {
        var num = random(0, 10)
        console.log('num', num)
        expect(num).not.toBeUndefined()
    })
})