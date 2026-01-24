import type { TypedMediator } from '#lib/mediator_instance.ts'

export default (mediator: TypedMediator): void => {
	mediator.provide('go_with_hash_fragment', (state, params, options, anchor) => {
		if (anchor) {
			mediator.call('set_anchor_after_state_transition', state, params, anchor)
		}

		mediator.call('state_go', state, params, options)
	})
}
