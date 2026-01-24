import type { TypedMediator } from '#lib/mediator_instance.ts'

export default (mediator: TypedMediator): void => {
	mediator.call(`on_state_router`, `stateChangeEnd`, () => {
		window.scrollTo(0, 0)
	})
}
