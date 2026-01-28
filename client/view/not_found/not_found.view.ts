import NotFound from './NotFound.svelte'
import type { State } from '#lib/asr_types.ts'

export default (_mediator: unknown): State => ({
	name: 'main.not-found',
	route: 'not-found',
	querystringParameters: [ 'route', 'parameters' ],
	template: NotFound,
	resolve(_data, parameters) {
		const params_copy = Object.assign({}, parameters)
		const route = params_copy.route
		delete params_copy.route

		return Promise.resolve({ route, parameters: params_copy })
	},
})
