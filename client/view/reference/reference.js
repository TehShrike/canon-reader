import Reference from './Reference.html'
import parseReference from 'lib/reference-parser'
import { getChapterNumberId, getChapterVerseId } from 'lib/get-id.js'
import validateVerseRange from 'lib/validate-verse-range.js'

const definedKeysOnly = object => Object.keys(object).reduce((newObject, key) => {
	if (object[key] !== undefined && object[key] !== null) {
		newObject[key] = object[key]
	}

	return newObject
}, {})

const removeDefaults = params => {
	const copy = Object.assign({}, params)
	if (params.es === Infinity) {
		delete copy.es
	}

	if (params.ss === 0) {
		delete copy.ss
	}

	return copy
}

export default mediator => ({
	name: 'main.reference',
	route: 'reference',
	querystringParameters: [ 's' ],
	template: Reference,
	resolve(data, parameters) {
		const reference = parameters.s || ''

		const parsed = parseReference(reference)

		if (parsed.bookId) {
			const { start, end } = validateVerseRange(parsed)

			const stateName = 'main.text'
			const params = removeDefaults(definedKeysOnly({
				book: parsed.bookId,
				sc: start.chapter,
				sv: start.verse,
				ss: start.section,
				ec: end.chapter,
				ev: end.verse,
				es: end.section,
			}))

			const anchor = getAnchor(start.chapter, start.verse)
			if (anchor) {
				mediator.callSync('setAnchorAfterStateTransition', stateName, params, anchor)
			}

			return Promise.reject({
				redirectTo: {
					name: stateName,
					params,
				},
			})
		}

		return Promise.resolve({
			reference,
		})
	},
})

function getAnchor(chapter, verse) {
	if (chapter && verse) {
		return getChapterVerseId(chapter, verse)
	} else if (chapter) {
		return getChapterNumberId(chapter)
	} else {
		return null
	}
}
