import Main from './Main.svelte'

export default mediator => ({
	name: `main`,
	route: ``,
	defaultChild: `home`,
	template: Main,
	resolve() {
		return Promise.resolve({
			mediator,
		})
	},
})
