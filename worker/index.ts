interface Env {
	ASSETS: Fetcher
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url)

		if (url.pathname === '/robots.txt') {
			return new Response('', { headers: { 'Content-Type': 'text/plain' } })
		}

		if (url.pathname.startsWith('/static/') || url.pathname.startsWith('/build/')) {
			return env.ASSETS.fetch(request)
		}

		const indexUrl = new URL('/index.html', url.origin)
		return env.ASSETS.fetch(indexUrl, request)
	},
}
