import type { TypedMediator } from '#lib/mediator_instance.ts'

export default (mediator: TypedMediator): void => {
	mediator.call(`on_state_change_end`, () => {
		window.scrollTo(0, 0)
	})
}
