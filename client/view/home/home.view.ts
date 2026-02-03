import Home from './Home.svelte'
import type { State } from '#lib/asr_types.ts'
import type { TypedMediator } from '#lib/mediator_instance.ts'

export default (mediator: TypedMediator): State => ({
	name: `main.home`,
	route: ``,
	template: Home,
	resolve: () => Promise.resolve({ mediator }),
})
