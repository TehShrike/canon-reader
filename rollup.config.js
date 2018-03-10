import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import svelte from 'rollup-plugin-svelte'
import json from 'rollup-plugin-json'
import sveltePreprocessPostcss from 'svelte-preprocess-postcss'
import visualizer from 'rollup-plugin-visualizer'

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
				style: (...args) => sveltePreprocessPostcss()(...args).catch(err => {
					console.error(err)
					throw err
				}),
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
		visualizer(),
	],
}
