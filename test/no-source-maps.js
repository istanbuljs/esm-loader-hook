import {test} from 'libtap';
// eslint-disable-next-line import/no-unresolved
import {transformSource} from '@istanbuljs/esm-loader-hook';

test('check transform', async t => {
	const context = {
		url: new URL('../fixtures/no-source-map.js', import.meta.url)
	};
	const {source} = await transformSource('export default true;', context);

	t.match(source, /function\s+cov_/u);
	t.match(source, /export\s+default\s+true/u);
	t.notMatch(source, /\/\/# sourceMappingURL=/u);
});
