import equalEnough from '#lib/equal_enough.ts'
import type { TypedMediator } from '#lib/mediator_instance.ts'

export default (mediator: TypedMediator): void => {
	mediator.provide('after_state_transition_to', (state_name, params) => {
		return new Promise<void>((resolve) => {
			const cancel_functions = [
				mediator.call('once_state_router', 'stateChangeEnd', listener),
				mediator.call('once_state_router', 'stateChangeError', cancel),
				mediator.call('once_state_router', 'stateError', cancel),
				mediator.call('once_state_router', 'routeNotFound', cancel),
				// mediator.call('once_state_router', 'stateChangeCancelled', cancel),
			]
			function listener(end_state: { name: unknown }, end_params: Record<string, unknown>) {
				if (end_state.name === state_name && equalEnough(params, end_params)) {
					resolve()
				} else {
					cancel()
				}
			}
			function cancel() {
				cancel_functions.forEach(fn => fn())
				// reject()
			}
		})
	})
}
