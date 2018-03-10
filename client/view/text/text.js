import Text from './Text.html'
import bibleBooksMap from 'lib/bible.js'
import { fromRange } from 'lib/simple-range.js'

export default mediator => ({
	name: 'main.text',
	route: 'text/:book',
	querystringParameters: [ 'highlight' ],
	template: Text,
	resolve(data, parameters) {
		const bookSections = bibleBooksMap[parameters.book]
		if (!bookSections) {
			throw new Error(`No book text found for ${parameters.book}`)
		}

		const range = parameters.highlight
			? fromRange(parameters.highlight)
			: null

		const bookName = mediator.callSync('getBookById', parameters.book).name

		return Promise.resolve({
			bookSections,
			bookName,
			highlightedRange: range,
		})
	},
})
