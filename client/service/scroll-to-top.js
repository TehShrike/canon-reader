export default mediator => {
	mediator.callSync(`onStateRouter`, `stateChangeEnd`, () => {
		window.scrollTo(0, 0)
	})
}
