import equalEnough from 'lib/equal-enough'

export default mediator => {
	mediator.provide('afterStateTransitionTo', (stateName, params) => {
		return new Promise((resolve, reject) => {
			const cancelFunctions = [
				mediator.callSync('onceStateRouter', 'stateChangeEnd', listener),
				mediator.callSync('onceStateRouter', 'stateChangeError', cancel),
				mediator.callSync('onceStateRouter', 'stateError', cancel),
				mediator.callSync('onceStateRouter', 'routeNotFound', cancel),
				// mediator.callSync('onceStateRouter', 'stateChangeCancelled', cancel),
			]
			function listener(endState, endParams) {
				if (endState.name === stateName && equalEnough(params, endParams)) {
					resolve()
				} else {
					cancel()
				}
			}
			function cancel() {
				cancelFunctions.forEach(fn => fn())
				// reject()
			}
		})
	})
}
