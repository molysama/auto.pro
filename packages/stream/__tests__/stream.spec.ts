'use strict';

const stream = require('../src/index');
import { add } from '../src/index'

describe('stream', () => {
    test('add', () => {
        return add(
            () => 1,
            v => v + 19,
            v => v == 20
        ).toPromise().then(v => expect(v).toEqual(20))

    })
});
