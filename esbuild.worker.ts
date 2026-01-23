import { build, context, type BuildOptions } from 'esbuild'

const is_watch = process.argv.includes('--watch')
const is_dev = process.argv.includes('--dev') || is_watch

const build_options: BuildOptions = {
	entryPoints: ['worker/index.ts'],
	bundle: true,
	outfile: 'build/_worker.js',
	format: 'esm',
	target: ['esnext'],
	sourcemap: true,
	minify: !is_dev,
	logLevel: 'info',
}

if (is_watch) {
	const ctx = await context(build_options)
	await ctx.watch()
	console.log('Watching worker for changes...')
} else {
	await build(build_options)
	console.log('Worker build complete')
}
