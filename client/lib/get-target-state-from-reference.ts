import parseReference from '#lib/reference-parser.ts'
import { getChapterNumberId, getChapterVerseId } from '#lib/get-id.ts'
import validateVerseRange from '#lib/validate-verse-range.ts'
import { toRange } from '#lib/simple-range.ts'
import formatReferenceDisplay from '#lib/format-reference-display.ts'

interface TargetState {
	stateName: string
	params: {
		book: string
		highlight?: string
	}
	anchor: string | null
	displayText: string
}

export default (referenceString: string, defaultBookId?: string): TargetState | undefined => {
	if (!referenceString) {
		return
	}

	const parsed = parseReference(referenceString)
	const bookId = parsed.bookId || defaultBookId

	if (bookId) {
		const { start, end } = validateVerseRange(parsed)

		const stateName = `main.text`
		const params: { book: string; highlight?: string } = {
			book: bookId,
		}

		if (start.verse && start.chapter && end.chapter && end.verse) {
			params.highlight = toRange(start.chapter, start.verse, end.chapter, end.verse)
		}

		const anchor = getAnchor(start.chapter, start.verse)
		const displayText = formatReferenceDisplay(bookId, start, end)

		return {
			stateName,
			params,
			anchor,
			displayText,
		}
	}
}

function getAnchor(chapter: number | null, verse: number | null): string | null {
	if (chapter && verse) {
		return getChapterVerseId(chapter, verse)
	} else if (chapter) {
		return getChapterNumberId(chapter)
	} else {
		return null
	}
}
