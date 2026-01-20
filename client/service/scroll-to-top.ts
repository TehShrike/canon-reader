import type { TypedMediator } from '#lib/mediator-instance.ts'

export default (mediator: TypedMediator): void => {
	mediator.call(`onStateRouter`, `stateChangeEnd`, () => {
		window.scrollTo(0, 0)
	})
}
