import Text from './Text.svelte'
import bibleBooksMap from 'lib/bible.js'
import chapterCounts from 'lib/books/chapter-counts.json'

export default mediator => ({
	name: `main.text`,
	route: `text/:book`,
	template: Text,
	resolve(data, parameters) {
		const bookSections = bibleBooksMap[parameters.book]
		if (!bookSections) {
			throw new Error(`No book text found for ${ parameters.book }`)
		}

		const bookName = mediator.callSync(`getBookById`, parameters.book).name

		return Promise.resolve({
			bookSections,
			bookName,
			chapterCount: chapterCounts[parameters.book],
		})
	},
})
