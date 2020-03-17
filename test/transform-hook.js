import {fileURLToPath} from 'url';

import t from 'libtap';

import hooked from '../fixtures/hooked.js';

const transformFile = fileURLToPath(new URL('../fixtures/hooked.js', import.meta.url).href);

t.same(Object.keys(global.__coverage__), [transformFile]);

const transformCoverage = global.__coverage__[transformFile];
t.equal(transformCoverage.path, transformFile);

const censorSnapshot = {
	schema: '',
	hash: '',
	_coverageSchema: '',
	path: 'hooked.js'
};

t.matchSnapshot({...transformCoverage, ...censorSnapshot}, 'initial coverage');

t.same(hooked(), 'value');

t.matchSnapshot({...transformCoverage, ...censorSnapshot}, 'coverage after run');
