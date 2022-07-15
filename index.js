import {fileURLToPath} from 'url';
import babel from '@babel/core';
import loader from '@istanbuljs/load-nyc-config';
import schema from '@istanbuljs/schema';
import TestExclude from 'test-exclude';

function nycEnvironmentConfig() {
	try {
		return JSON.parse(process.env.NYC_CONFIG);
	} catch {
	}
}

let nycConfig;
let testExclude;
let babelConfig;

export async function load(url, context, nextLoad) {
	if (context.format !== 'module' || loader.isLoading()) {
		return nextLoad(url, context);
	}

	if (!nycConfig) {
		nycConfig = nycEnvironmentConfig() || {
			...schema.defaults.nyc,
			...await loader.loadNycConfig({
				cwd: process.env.NYC_CWD || process.cwd()
			})
		};
	}

	if (!testExclude) {
		testExclude = new TestExclude(nycConfig);
		babelConfig = {
			...nycConfig,
			// Skip/optimize the test-exclude used within babel-plugin-istanbul
			include: [],
			exclude: [],
			extension: [],
			excludeNodeModules: false
		};
	}

	const filename = fileURLToPath(url);
	/* babel-plugin-istanbul does this but the early check optimizes */
	if (!testExclude.shouldInstrument(filename)) {
		return nextLoad(url, context);
	}

	const fromNext = await nextLoad(url, context);
	let {source} = fromNext;
	if (typeof source !== 'string') {
		source = new TextDecoder().decode(source);
	}

	/* Can/should this handle inputSourceMap? */
	const {code} = await babel.transformAsync(source, {
		babelrc: false,
		configFile: false,
		filename,
		/* Revisit this if the load hook adds support for returning sourceMap object */
		sourceMaps: babelConfig.produceSourceMap ? 'inline' : false,
		compact: babelConfig.compact,
		comments: babelConfig.preserveComments,
		parserOpts: {
			sourceType: 'module',
			plugins: babelConfig.parserPlugins
		},
		plugins: [
			['babel-plugin-istanbul', babelConfig]
		]
	});

	return {
		format: fromNext.format,
		source: code
	};
}
