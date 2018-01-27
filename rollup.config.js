import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import svelte from 'rollup-plugin-svelte'
import json from 'rollup-plugin-json'
import sveltePreprocessPostcss from 'svelte-preprocess-postcss'

export default {
	name: `revelationStructure`,
	input: `./client/index.js`,
	output: {
		file: `./public/static/index-bundle.js`,
		format: `iife`,
	},
	sourcemap: true,
	plugins: [
		svelte({
			preprocess: {
				style: sveltePreprocessPostcss(),
			},
			css(css) {
				css.write(`public/static/components.css`)
			},
		}),
		commonjs(),
		json(),
		resolve({
			browser: true,
		}),
	],
}
