import { verse_lookup } from './verse_lookup.ts'

type Env = {
	ASSETS: Fetcher
	ANTHROPIC_API_KEY: string
}

const DISALLOW_ROBOTS = 'User-agent: *\nDisallow: /\n'

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url)
		const is_production = url.hostname === 'canonreader.com'

		if (url.pathname === '/robots.txt') {
			return new Response(is_production ? '' : DISALLOW_ROBOTS, {
				headers: { 'Content-Type': 'text/plain' },
			})
		}

		if (url.pathname === '/api/verse_lookup') {
			const query = url.searchParams.get('q')
			if (!query) {
				return new Response(JSON.stringify({ error: 'Missing q parameter' }), {
					status: 400,
					headers: { 'Content-Type': 'application/json' },
				})
			}
			return new Response(await verse_lookup(env.ANTHROPIC_API_KEY, query), {
				headers: { 'Content-Type': 'application/json' },
			})
		}

		if (url.pathname.startsWith('/static/') || url.pathname.startsWith('/build/')) {
			return env.ASSETS.fetch(request)
		}

		return env.ASSETS.fetch(new URL('/index.html', url.origin))
	},
}
