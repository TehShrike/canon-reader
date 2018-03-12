import Main from './Main.html'

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
