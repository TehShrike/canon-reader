import shortBookNames from 'lib/short-book-names.js'
import { getBookId } from 'lib/get-id.js'

import { extractRangeFromMatch, createChapterVerseRangeRegex } from 'verse-reference-regex'
import r from 'regex-fun'

const bookNameRegex = r.combine(
	r.optional(/\d/),
	r.oneOrMoreNonGreedy(r.either(/\w/, ' '))
)

const regex = r.combine(
	/^/,
	r.capture(bookNameRegex),
	r.anyNumberNonGreedy(/\s/),
	r.capture(r.anyNumber(r.either(/\d/, ':', /a-zA-Z/))),
	/$/
)

const chapterVerseRangeRegex = createChapterVerseRangeRegex()
const emptyVerseSection = Object.freeze({ chapter: null, verse: null, section: null })

export default string => {
	const [ , bookPart, versePart ] = string.match(regex)

	const verseRange = versePart
		? extractRangeFromMatch.chapterVerseRange(versePart.match(chapterVerseRangeRegex))
		: { start: emptyVerseSection, end: emptyVerseSection }

	const bookId = matchBookId(bookPart)

	return Object.assign({}, { bookId }, { start: verseRange.start, end: verseRange.end })
}

function matchBookId(anyString) {
	const sanitizedString = getBookId(anyString)
	return findMatchingShortBookName('', sanitizedString)
}

function findMatchingShortBookName(lastStringTested, restOfString) {
	if (restOfString.length === 0 || lastStringTested.length >= shortBookNames.longestUniqueKey) {
		return null
	}

	const [ newCharacterToTest, ...rest ] = restOfString
	const thisStringTest = lastStringTested += newCharacterToTest

	const matchingBookId = shortBookNames.shortIdToLongId[thisStringTest]
	if (matchingBookId) {
		return matchingBookId
	}

	return findMatchingShortBookName(thisStringTest, rest)
}
