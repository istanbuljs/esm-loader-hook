import {test} from 'libtap';
import {load} from '@istanbuljs/esm-loader-hook';

test('check transform', async t => {
	const {source} = await load(
		new URL('../fixtures/no-source-map.js', import.meta.url),
		{format: 'module'},
		() => ({source: 'export default true;'}));

	t.match(source, /function\s+cov_/u);
	t.match(source, /export\s+default\s+true/u);
	t.notMatch(source, /\/\/# sourceMappingURL=/u);
});
