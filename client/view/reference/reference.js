import Reference from './Reference.html'
import parseReference from 'lib/reference-parser'
import { getChapterNumberId, getChapterVerseId } from 'lib/get-id.js'

export default mediator => ({
	name: 'main.reference',
	route: 'reference',
	querystringParameters: [ 's' ],
	template: Reference,
	resolve(data, parameters) {
		const reference = parameters.s || ''

		const parsed = parseReference(reference)

		if (parsed.bookId) {
			const { chapter, verse } = parsed.start
			const anchor = getAnchor(chapter, verse)

			const stateName = 'main.text'
			const params = {
				book: parsed.bookId,
			}

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
