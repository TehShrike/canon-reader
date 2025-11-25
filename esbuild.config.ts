import { build, context, type BuildOptions, type Plugin } from 'esbuild'
import * as esbuildSvelteModule from 'esbuild-svelte'

const sveltePlugin = (esbuildSvelteModule as unknown as { default: (options?: Record<string, unknown>) => Plugin }).default

const is_watch = process.argv.includes('--watch')
const is_dev = process.argv.includes('--dev') || is_watch

const build_options: BuildOptions = {
	entryPoints: ['client/index.js'],
	bundle: true,
	outfile: 'public/build/index-bundle.js',
	format: 'iife',
	target: ['es2020'],
	sourcemap: true,
	minify: !is_dev,
	plugins: [
		sveltePlugin({
			compilerOptions: {
				dev: is_dev,
			},
		}),
	],
	loader: {
		'.json': 'json',
	},
	alias: {
		'lib': './client/lib',
		'component': './client/component',
	},
	logLevel: 'info',
}

if (is_watch) {
	const ctx = await context(build_options)
	await ctx.watch()
	console.log('Watching for changes...')
} else {
	await build(build_options)
	console.log('Build complete')
}
