import {fileURLToPath} from 'url';

import t from 'libtap';
import loader from '@istanbuljs/load-nyc-config';

t.test('load config', async t => {
	const config = await loader.loadNycConfig();

	t.same(config.include, ['hooked.js']);

	await import('../fixtures/hooked.js');

	const transformFile = fileURLToPath(new URL('../fixtures/hooked.js', import.meta.url).href);

	t.equal(Object.keys(global.__coverage__).length, 1);
	const transformCoverage = global.__coverage__[transformFile];
	t.equal(transformCoverage.path, transformFile);
});
