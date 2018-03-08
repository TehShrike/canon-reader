import Reference from './Reference.html'
import shortBookNames from 'lib/short-book-names.js'

export default mediator => ({
	name: 'main.reference',
	route: 'reference/:reference',
	template: Reference,
	resolve(data, parameters) {
		const reference = parameters.reference

		return Promise.resolve({
			reference,
		})
	},
})
