import {test} from 'libtap';
import {transformSource} from '@istanbuljs/esm-loader-hook';

test('check transform', async t => {
	const context = {
		format: 'module',
		url: new URL('../fixtures/no-source-map.js', import.meta.url)
	};
	const {source} = await transformSource('export default true;', context, source => ({source}));

	t.match(source, /function\s+cov_/u);
	t.match(source, /export\s+default\s+true/u);
	t.notMatch(source, /\/\/# sourceMappingURL=/u);
});
