import {fileURLToPath} from 'url';

import {test} from 'libtap';
// eslint-disable-next-line import/no-unresolved
import * as loaderHook from '@istanbuljs/esm-loader-hook';

test('exports', async t => {
	t.same(Object.keys(loaderHook), ['transformSource']);
	t.match(loaderHook, {transformSource: Function});
});

test('transform buffer', async t => {
	const {source} = await loaderHook.transformSource(
		Buffer.from('export default true;'),
		{
			url: new URL('../fixtures/buffer.js', import.meta.url)
		}
	);

	t.match(source, /function\s+cov_/u);
	t.match(source, /export\s+default\s+true/u);
	t.match(source, /\/\/# sourceMappingURL=/u);
});

test('transform not string', async t => {
	const notString = {};
	const {source} = await loaderHook.transformSource(notString);

	t.equal(source, notString);
});

test('transform hook', async t => {
	await t.spawn(
		process.execPath,
		[fileURLToPath(new URL('transform-hook.js', import.meta.url).href)],
		{
			env: {
				...process.env,
				NYC_CWD: fileURLToPath(new URL('../fixtures', import.meta.url).href),
				NODE_OPTIONS: [].concat(
					process.env.NODE_OPTIONS || [],
					'--experimental-loader @istanbuljs/esm-loader-hook'
				).join(' ')
			}
		},
		'transform-hook.js'
	);
});

test('load config with transform hook', async t => {
	await t.spawn(
		process.execPath,
		[fileURLToPath(new URL('transform-hook-load-config.js', import.meta.url).href)],
		{
			cwd: fileURLToPath(new URL('../fixtures', import.meta.url).href),
			env: {
				...process.env,
				NODE_OPTIONS: [].concat(
					process.env.NODE_OPTIONS || [],
					`--experimental-loader ${new URL('../index.js', import.meta.url).href}`
				).join(' ')
			}
		},
		'transform-hook-load-config.js'
	);
});

test('no source maps', async t => {
	await t.spawn(
		process.execPath,
		[fileURLToPath(new URL('no-source-maps.js', import.meta.url).href)],
		{
			env: {
				...process.env,
				NYC_CONFIG: JSON.stringify({
					include: [],
					produceSourceMap: false
				})
			}
		},
		'no-source-maps.js'
	);
});
