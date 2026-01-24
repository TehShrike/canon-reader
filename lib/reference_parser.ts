import shortBookNames from '#lib/short_book_names.ts'
import { get_book_id } from '#lib/get_id.ts'

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
const book_name_regex = r.combine(
	r.optional(/\d/),
	r.oneOrMore(r.either(alphabetic, ' '))
)

const regex = r.combine(
	/^/,
	r.optional(r.capture(book_name_regex)),
	r.capture(r.anyNumber(r.either(/\d/, ':', '-', ' ', alphabetic))),
	/$/
)

const chapter_verse_range_regex = createChapterVerseRangeRegex()
const empty_verse_section: VerseSection = Object.freeze({ chapter: null, verse: null, section: null })
const no_match: ParsedReference = Object.freeze({ bookId: null, start: empty_verse_section, end: empty_verse_section })

export default (string: string): ParsedReference => {
	const match = string.match(regex)

	if (!match) {
		return no_match
	}

	const [ , book_part, verse_part ] = match

	const verse_range = verse_part
		? extractRangeFromMatch.chapterVerseRange(verse_part.match(chapter_verse_range_regex))
		: { start: empty_verse_section, end: empty_verse_section }

	const book_id = book_part ? match_book_id(book_part) : null

	return Object.assign({}, { bookId: book_id }, { start: verse_range.start, end: verse_range.end })
}

function match_book_id(any_string: string): string | null {
	const sanitized_string = get_book_id(any_string)
	return find_matching_short_book_name('', sanitized_string)
}

function find_matching_short_book_name(last_string_tested: string, rest_of_string: string): string | null {
	if (rest_of_string.length === 0 || last_string_tested.length >= shortBookNames.longest_unique_key) {
		return null
	}

	const [ new_character_to_test, ...rest ] = rest_of_string
	const this_string_test = last_string_tested + new_character_to_test

	const matching_book_id = shortBookNames.short_id_to_long_id[this_string_test]
	if (matching_book_id) {
		return matching_book_id
	}

	return find_matching_short_book_name(this_string_test, rest.join(''))
}
