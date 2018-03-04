import Text from './Text.html'
import bibleBooksMap from 'lib/bible.js'

export default mediator => ({
	name: 'main.text',
	route: 'text',
	querystringParameters: [ `book` ],
	template: Text,
	resolve(data, parameters) {
		const bookSections = bibleBooksMap[parameters.book]
		if (!bookSections) {
			throw new Error(`No book text found for ${parameters.book}`)
		}

		const bookName = mediator.callSync('getBookById', parameters.book).name

		return Promise.resolve({
			bookSections,
			bookName,
		})
	},
})
