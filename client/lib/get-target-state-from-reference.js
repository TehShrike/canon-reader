import parseReference from 'lib/reference-parser'
import { getChapterNumberId, getChapterVerseId } from 'lib/get-id.js'
import validateVerseRange from 'lib/validate-verse-range.js'
import { toRange } from 'lib/simple-range.js'

export default (referenceString, defaultBookId) => {
	const parsed = parseReference(referenceString)
	const bookId = parsed.bookId || defaultBookId

	if (bookId) {
		const { start, end } = validateVerseRange(parsed)

		const stateName = 'main.text'
		const params = {
			book: bookId,
		}

		if (start.verse) {
			params.highlight = toRange(start.chapter, start.verse, end.chapter, end.verse)
		}

		const anchor = getAnchor(start.chapter, start.verse)

		return {
			stateName,
			params,
			anchor,
		}
	}
}

function getAnchor(chapter, verse) {
	if (chapter && verse) {
		return getChapterVerseId(chapter, verse)
	} else if (chapter) {
		return getChapterNumberId(chapter)
	} else {
		return null
	}
}
