import equalEnough from '#lib/equal_enough.ts'
import type { TypedMediator } from '#lib/mediator_instance.ts'
import type { ErrorEvent, StateChangeEvent } from 'abstract-state-router'
import stateRouter from '../asr_instance.ts'
import type { State } from '#lib/asr_types.ts'

type Once = {
	(event: StateChangeEvent, cb: (state: State, params: Record<string, unknown>) => void): () => void
	(event: ErrorEvent, cb: (error: Error) => void): () => void
	(event: 'routeNotFound', cb: (route: string, params: Record<string, unknown>) => void): () => void
}
const once: Once = (event, cb) => {
	stateRouter.once(
		// @ts-expect-error
		event,
		cb
	)
	return () => stateRouter.removeListener(
		// @ts-expect-error
		event,
		cb
	)
}

export default (mediator: TypedMediator): void => {
	mediator.provide('after_state_transition_to', (state_name, params) => {
		return new Promise<void>((resolve) => {
			const cancel_functions = [
				once('stateChangeEnd', (end_state: { name: string }, end_params: Record<string, unknown>) => {
					if (end_state.name === state_name && equalEnough(params, end_params)) {
						resolve()
					} else {
						cancel()
					}
				}),
				once('stateChangeError', cancel),
				once('stateError', cancel),
				once('routeNotFound', cancel),
			]

			function cancel() {
				cancel_functions.forEach(fn => fn())
			}
		})
	})
}
