import Main from './Main.svelte'
import type { TypedMediator } from '#lib/mediator_instance.ts'
import type { State } from '#lib/asr_types.ts'

export default (mediator: TypedMediator): State => ({
	name: `main`,
	route: ``,
	defaultChild: `home`,
	template: Main,
	resolve() {
		return Promise.resolve({
			mediator,
		})
	},
})
