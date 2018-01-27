import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import svelte from 'rollup-plugin-svelte'
import json from 'rollup-plugin-json'
import sveltePreprocessPostcss from 'svelte-preprocess-postcss'

export default {
	input: `./client/index.js`,
	output: {
		file: `./public/build/index-bundle.js`,
		format: `iife`,
		sourcemap: true,
	},
	plugins: [
		svelte({
			preprocess: {
				style: sveltePreprocessPostcss(),
			},
			css(css) {
				css.write(`public/build/components.css`)
			},
		}),
		commonjs(),
		json(),
		resolve({
			browser: true,
		}),
	],
}
