import NotFound from './NotFound.svelte'

interface Parameters {
	route?: string
	[key: string]: string | undefined
}

export interface State {
	name: string
	route: string
	querystringParameters: string[]
	template: typeof NotFound
	resolve: (data: unknown, parameters: Parameters) => Promise<{ route: string | undefined; parameters: Record<string, string | undefined> }>
}

export default (_mediator: unknown): State => ({
	name: 'main.not-found',
	route: 'not-found',
	querystringParameters: [ 'route', 'parameters' ],
	template: NotFound,
	resolve(_data, parameters) {
		const paramsCopy = Object.assign({}, parameters)
		const route = paramsCopy.route
		delete paramsCopy.route

		return Promise.resolve({ route, parameters: paramsCopy })
	},
})
