import shortBookNames from '#lib/short-book-names.ts'
import { getBookId } from '#lib/get-id.ts'

// @ts-expect-error no types available
import { extractRangeFromMatch, createChapterVerseRangeRegex } from 'verse-reference-regex'
// @ts-expect-error no types available
import r from 'regex-fun'

interface VerseSection {
	chapter: number | null
	verse: number | null
	section: string | null
}

interface ParsedReference {
	bookId: string | null
	start: VerseSection
	end: VerseSection
}

const alphabetic = /[a-zA-Z]/
const bookNameRegex = r.combine(
	r.optional(/\d/),
	r.oneOrMore(r.either(alphabetic, ' '))
)

const regex = r.combine(
	/^/,
	r.optional(r.capture(bookNameRegex)),
	r.capture(r.anyNumber(r.either(/\d/, ':', '-', ' ', alphabetic))),
	/$/
)

const chapterVerseRangeRegex = createChapterVerseRangeRegex()
const emptyVerseSection: VerseSection = Object.freeze({ chapter: null, verse: null, section: null })
const noMatch: ParsedReference = Object.freeze({ bookId: null, start: emptyVerseSection, end: emptyVerseSection })

export default (string: string): ParsedReference => {
	const match = string.match(regex)

	if (!match) {
		return noMatch
	}

	const [ , bookPart, versePart ] = match

	const verseRange = versePart
		? extractRangeFromMatch.chapterVerseRange(versePart.match(chapterVerseRangeRegex))
		: { start: emptyVerseSection, end: emptyVerseSection }

	const bookId = bookPart ? matchBookId(bookPart) : null

	return Object.assign({}, { bookId }, { start: verseRange.start, end: verseRange.end })
}

function matchBookId(anyString: string): string | null {
	const sanitizedString = getBookId(anyString)
	return findMatchingShortBookName('', sanitizedString)
}

function findMatchingShortBookName(lastStringTested: string, restOfString: string): string | null {
	if (restOfString.length === 0 || lastStringTested.length >= shortBookNames.longestUniqueKey) {
		return null
	}

	const [ newCharacterToTest, ...rest ] = restOfString
	const thisStringTest = lastStringTested + newCharacterToTest

	const matchingBookId = shortBookNames.shortIdToLongId[thisStringTest]
	if (matchingBookId) {
		return matchingBookId
	}

	return findMatchingShortBookName(thisStringTest, rest.join(''))
}
