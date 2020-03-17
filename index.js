import {fileURLToPath} from 'url';
import babel from '@babel/core';
import loader from '@istanbuljs/load-nyc-config';
import schema from '@istanbuljs/schema';
import TestExclude from 'test-exclude';

function nycEnvironmentConfig() {
	try {
		return JSON.parse(process.env.NYC_CONFIG);
	} catch {
		return null;
	}
}

const initialCWD = process.env.NYC_CWD || process.cwd();
let nycConfig = nycEnvironmentConfig();
let testExclude;
let babelConfig;

export async function transformSource(source, context) {
	if (nycConfig === null) {
		nycConfig = {
			...schema.defaults.nyc,
			...await loader.loadNycConfig({cwd: initialCWD})
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

	if (Buffer.isBuffer(source)) {
		source = source.toString();
	} else if (typeof source !== 'string') {
		return {source};
	}

	const filename = fileURLToPath(context.url);
	/* babel-plugin-istanbul does this but the early check optimizes */
	if (!testExclude.shouldInstrument(filename)) {
		return {source};
	}

	/* Can/should this handle inputSourceMap? */
	const {code} = await babel.transformAsync(source, {
		babelrc: false,
		configFile: false,
		filename,
		/* Revisit this if transformSource adds support for returning sourceMap object */
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

	return {source: code};
}
