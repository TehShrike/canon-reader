import nextTick from 'iso-next-tick'
import type { TypedMediator } from '#lib/mediator_instance.ts'

export default (mediator: TypedMediator): void => {
	mediator.provide(`set_anchor_after_state_transition`, (state_name, params, anchor) => {
		mediator.call(`after_state_transition_to`, state_name, params).then(() => {
			nextTick(() => window.location.replace(`#${ anchor }`))
		})
	})
}
