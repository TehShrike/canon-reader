const platform = (window.navigator && window.navigator.platform) || ``
const isMac = platform.slice(0, 3).toLowerCase() === `mac`
const code_k = 75

const isK = event => event.key === `k` || event.keyCode === code_k
const isModified = event => event.ctrlKey || (isMac && event.metaKey)


export default mediator => {
	let currentBook = null

	mediator.callSync(`onStateRouter`, `stateChangeEnd`, (state, parameters) => {
		if (state.name.indexOf(`main.text`) === 0) {
			currentBook = parameters.book
		} else {
			currentBook = null
		}
	})

	document.addEventListener(`keydown`, event => {
		if (isK(event) && isModified(event)) {
			event.preventDefault()
			mediator.callSync(`show navigation input`, currentBook)
		}
	})
}
