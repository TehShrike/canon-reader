import type { TypedMediator } from '#lib/mediator-instance.ts'

const platform = (window.navigator && window.navigator.platform) || ``
const isMac = platform.slice(0, 3).toLowerCase() === `mac`
const code_k = 75

const isK = (event: KeyboardEvent): boolean => event.key === `k` || event.keyCode === code_k
const isModified = (event: KeyboardEvent): boolean => event.ctrlKey || (isMac && event.metaKey)


export default (mediator: TypedMediator): void => {
	let currentBook: string | null = null

	mediator.call(`onStateRouter`, `stateChangeEnd`, (state: { name: string }, parameters: { book?: string }) => {
		if (state.name.indexOf(`main.text`) === 0) {
			currentBook = parameters.book ?? null
		} else {
			currentBook = null
		}
	})

	document.addEventListener(`keydown`, event => {
		if (isK(event) && isModified(event)) {
			event.preventDefault()
			mediator.call(`show navigation input`, currentBook)
		}
	})
}
