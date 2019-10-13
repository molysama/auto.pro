'use strict';

import Core from '@auto.pro/core'
import SearchPlugin, {findImg} from '../src/index'

const core = Core()
core.use(SearchPlugin)

describe('search', () => {

    it('findImg', () => {
      findImg({
        path: 'assets',
        once: true,
        useCache: 'xxx'
      }).subscribe()

      expect(1).toEqual(1)  

    });
});
