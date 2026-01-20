import type { TypedMediator } from '#lib/mediator-instance.ts'

export default (mediator: TypedMediator): void => {
	mediator.provide('goWithHashFragment', (state, params, options, anchor) => {
		if (anchor) {
			mediator.call('setAnchorAfterStateTransition', state, params, anchor)
		}

		mediator.call('stateGo', state, params, options)
	})
}
