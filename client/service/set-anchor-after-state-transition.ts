import nextTick from 'iso-next-tick'
import type { TypedMediator } from '#lib/mediator-instance.ts'

export default (mediator: TypedMediator): void => {
	mediator.provide(`setAnchorAfterStateTransition`, (stateName, params, anchor) => {
		mediator.call(`afterStateTransitionTo`, stateName, params).then(() => {
			nextTick(() => window.location.replace(`#${ anchor }`))
		})
	})
}
