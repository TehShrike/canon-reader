interface Env {
	ASSETS: Fetcher
}

const DISALLOW_ROBOTS = 'User-agent: *\nDisallow: /\n'

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url)
		const isProduction = url.hostname === 'canonreader.com'

		if (url.pathname === '/robots.txt') {
			const content = isProduction ? '' : DISALLOW_ROBOTS
			return new Response(content, { headers: { 'Content-Type': 'text/plain' } })
		}

		if (url.pathname.startsWith('/static/') || url.pathname.startsWith('/build/')) {
			return env.ASSETS.fetch(request)
		}

		const indexUrl = new URL('/index.html', url.origin)
		return env.ASSETS.fetch(indexUrl)
	},
}
