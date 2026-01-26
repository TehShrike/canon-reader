import VerseLookup from './VerseLookup.svelte'
import assert from '#lib/assert.ts'
import type { TypedMediator } from '#lib/mediator_instance.ts'
import type { State } from '#lib/asr_types.ts'

export default (mediator: TypedMediator): State => ({
	name: `main.verse-lookup`,
	route: `verse-lookup`,
	querystringParameters: ['q'],
	template: VerseLookup,
	async resolve(_data, parameters) {
		const query = parameters.q
		assert(query, `No query parameter provided`)


		return {
			mediator,
			query,
		}
	},
})
