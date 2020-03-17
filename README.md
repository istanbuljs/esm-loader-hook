# @istanbuljs/esm-loader-hook

![Tests][tests-status]
[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![ISC][license-image]](LICENSE)

This [loader hook](https://nodejs.org/dist/latest/docs/api/esm.html#esm_hooks)
makes it relatively easy to use NYC to check coverage of ESM running in node.js
13.7.0.  Note this makes use of **experimental** node.js features and thus may
stop working upon release of new versions of node.js.  Until the node.js feature
is stabilized breakage should not be unexpected.

For more stable options to test coverage you can:
* Use [c8]
* Pre-instrument your code (run `nyc instrument` then test the output)


## Adding to processes

To install this hook into a process the module must be provided through the
`--experimental-loader` flag.

The following can be used for your `npm test` script to enable live instrumentation
of ES modules being tested with mocha:

```sh
cross-env 'NODE_OPTIONS=--experimental-loader @istanbuljs/esm-loader-hook' nyc mocha
```


## Configuration

This module executes [babel-plugin-istanbul] in a transformSource loader hook.  No
options are provided to the babel plugin and babel configuration files are not honored.
Normally configuration will be provided by the currently running instance of nyc.  If
this module is run outside nyc then it will use `@istanbuljs/load-nyc-config` to load
options, defaults from `@istanbuljs/schema` will apply to missing options or if no
configuration is found.


[tests-status]: https://github.com/cfware/node-preload/workflows/Tests/badge.svg
[npm-image]: https://img.shields.io/npm/v/@istanbuljs/esm-loader-hook.svg
[npm-url]: https://npmjs.org/package/@istanbuljs/esm-loader-hook
[downloads-image]: https://img.shields.io/npm/dm/@istanbuljs/esm-loader-hook.svg
[downloads-url]: https://npmjs.org/package/@istanbuljs/esm-loader-hook
[license-image]: https://img.shields.io/github/license/istanbuljs/esm-loader-hook

[babel-plugin-istanbul]: https://github.com/istanbuljs/babel-plugin-istanbul#readme
[c8]: https://github.com/bcoe/c8#readme
