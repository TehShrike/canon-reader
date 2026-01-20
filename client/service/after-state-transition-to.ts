import equalEnough from '#lib/equal-enough.ts'
import type { TypedMediator } from '#lib/mediator-instance.ts'

export default (mediator: TypedMediator): void => {
	mediator.provide('afterStateTransitionTo', (stateName, params) => {
		return new Promise<void>((resolve) => {
			const cancelFunctions = [
				mediator.call('onceStateRouter', 'stateChangeEnd', listener),
				mediator.call('onceStateRouter', 'stateChangeError', cancel),
				mediator.call('onceStateRouter', 'stateError', cancel),
				mediator.call('onceStateRouter', 'routeNotFound', cancel),
				// mediator.call('onceStateRouter', 'stateChangeCancelled', cancel),
			]
			function listener(endState: { name: unknown }, endParams: Record<string, unknown>) {
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
