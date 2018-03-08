export default mediator => {
	mediator.provideSync('goWithHashFragment', (state, params, options, anchor) => {
		if (anchor) {
			mediator.callSync('setAnchorAfterStateTransition', state, params, anchor)
		}

		mediator.callSync('stateGo', state, params, options)
	})
}

