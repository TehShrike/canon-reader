import Text from './Text.html'
import bibleBooksMap from 'lib/bible.js'

const rangeDefaults = {
	sc: Infinity,
	sv: 0,
	ss: 0,
	ec: 0,
	ev: Infinity,
	es: Infinity,
}

const toNumberOrDefault = params => {
	return Object.keys(params).reduce((object, key) => {
		const value = params[key] === 'Infinity'
			? Infinity
			: parseInt(params[key], 10)

		object[key] = Number.isNaN(value) ? rangeDefaults[key] : value

		return object
	}, {})
}

export default mediator => ({
	name: 'main.text',
	route: 'text/:book',
	querystringParameters: [ 'sc', 'sv', 'ss', 'ec', 'ev', 'es' ],
	defaultParameters: rangeDefaults,
	template: Text,
	resolve(data, parameters) {
		const bookSections = bibleBooksMap[parameters.book]
		if (!bookSections) {
			throw new Error(`No book text found for ${parameters.book}`)
		}

		const range = toNumberOrDefault(parameters)

		const bookName = mediator.callSync('getBookById', parameters.book).name

		return Promise.resolve({
			bookSections,
			bookName,
			highlightedRange: {
				startChapter: range.sc,
				startVerse: range.sv,
				startSection: range.sc,
				endChapter: range.ec,
				endVerse: range.ev,
				endSection: range.es,
			},
		})
	},
})
