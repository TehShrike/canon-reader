import nextTick from 'iso-next-tick'

export default mediator => {
	mediator.provideSync(`setAnchorAfterStateTransition`, (stateName, params, anchor) => {
		mediator.call(`afterStateTransitionTo`, stateName, params).then(() => {
			nextTick(() => window.location.replace(`#${ anchor }`))
		})
	})
}
