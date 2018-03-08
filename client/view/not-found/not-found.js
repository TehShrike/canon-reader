import NotFound from './NotFound.html'

export default mediator => ({
	name: 'main.not-found',
	route: 'not-found',
	querystringParameters: [ 'route', 'parameters' ],
	template: NotFound,
	resolve(data, parameters) {
		const paramsCopy = Object.assign({}, parameters)
		const route = paramsCopy.route
		delete paramsCopy.route

		return Promise.resolve({ route, parameters: paramsCopy })
	},
})
