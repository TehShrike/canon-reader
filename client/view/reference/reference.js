import Reference from './Reference.html'
import parseReference from 'lib/reference-parser'
import { getChapterNumberId, getChapterVerseId } from 'lib/get-id.js'
import validateVerseRange from 'lib/validate-verse-range.js'
import { toRange } from 'lib/simple-range.js'

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
			const params = {
				book: parsed.bookId,
			}

			if (start.verse) {
				params.highlight = toRange(start.chapter, start.verse, end.chapter, end.verse)
			}

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
