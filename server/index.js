/*
- compress output
- set etags
- any time a file starts with "static/" serve public/static/ with koa-serve
- maybe have a whitelist of files to server from public/
- otherwise, serve up the index.html
- maybe eventually someday inject a live-reload script like live-server does
*/

import Koa from 'koa'
import createRouter from 'koa-bestest-router'
import compress from 'koa-compress'
import conditionalGet from 'koa-conditional-get'
import etag from 'koa-etag'
import send from 'koa-send'
import { join } from 'path'

const relative = path => join(import.meta.url, path)
const staticPath = relative('../public/static')
const buildPath = relative('../public/build')
const publicPath = relative('../public')

startServer(process.env.PORT || 8888)

function startServer(port) {
	const app = new Koa()

	app.use(compress())
	app.use(conditionalGet())
	app.use(etag())

	app.use(createRouter({
		GET: {
			'/robots.txt': async context => {
				context.body = process.env.UP_STAGE === 'production' ? '' : 'User-agent: *\nDisallow: /\n'
			},
			'/static/:path(.+)': async context => {
				await send(context, context.params.path, { root: staticPath })
			},
			'/build/:path(.+)': async context => {
				await send(context, context.params.path, { root: buildPath })
			},
			'/(.*)': async context => {
				await send(context, 'index.html', { root: publicPath })
			},
		},
	}, { set404: true }))

	app.listen(port)
}
