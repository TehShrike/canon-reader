import type { SvelteStateRouter } from '#lib/asr_types.ts'

import sausage from 'sausage-router'
import makeRouter from 'hash-brown-router'
import createStateRouter from 'abstract-state-router'
import makeSvelteStateRenderer from 'svelte-state-renderer'

export default createStateRouter(
	makeSvelteStateRenderer() as unknown as () => ReturnType<typeof makeSvelteStateRenderer>,
	document.getElementById(`target`), {
		pathPrefix: ``,
		router: makeRouter(sausage()),
	}
) as SvelteStateRouter
