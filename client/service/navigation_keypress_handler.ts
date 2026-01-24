import type { TypedMediator } from '#lib/mediator_instance.ts'

const platform = (window.navigator && window.navigator.platform) || ``
const is_mac = platform.slice(0, 3).toLowerCase() === `mac`
const code_k = 75

const is_k = (event: KeyboardEvent): boolean => event.key === `k` || event.keyCode === code_k
const is_modified = (event: KeyboardEvent): boolean => event.ctrlKey || (is_mac && event.metaKey)


export default (mediator: TypedMediator): void => {
	let current_book: string | null = null

	mediator.call(`on_state_router`, `stateChangeEnd`, (state: { name: string }, parameters: { book?: string }) => {
		if (state.name.indexOf(`main.text`) === 0) {
			current_book = parameters.book ?? null
		} else {
			current_book = null
		}
	})

	document.addEventListener(`keydown`, event => {
		if (is_k(event) && is_modified(event)) {
			event.preventDefault()
			mediator.call(`show_navigation_input`, current_book)
		}
	})
}
