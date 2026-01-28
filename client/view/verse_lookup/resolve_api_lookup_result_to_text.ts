import type { Book, BookSection, SectionChildren } from "#lib/book_types.ts"
import type { ApiResult } from "./api_verse_lookup.ts"
import withinRange from "multi-part-range-compare"
import assert from "#lib/assert.ts"
import bible_books_map from "#lib/bible.ts"
import parse_reference from "#lib/reference_parser.ts"
import get_target_state_from_reference from "#lib/get_target_state_from_reference.ts"

export type ResolvedResult = {
	reference: string
	text: string
	type: 'paraphrase' | 'match'
	match_quality: number
	book_id: string | null
	target_params: { book: string; highlight?: string } | null
	target_anchor: string | null
	display_text: string
	sections: BookSection[]
}

export default (api_results: ApiResult[]): ResolvedResult[] => {
	return api_results.map(result => {
		const target = get_target_state_from_reference(result.reference)
		const parsed = parse_reference(result.reference)

		assert(parsed.book_id, `No book ID found in reference: ${result.reference}`)
		const book_sections = bible_books_map[parsed.book_id]
		assert(book_sections, `Book ID ${parsed.book_id} not found in bible_books_map`)
		assert(parsed.start.chapter && parsed.start.verse && parsed.end.chapter && parsed.end.verse, `No start or end chapter or verse found in parsed reference: ${parsed}`)

		const sections = extract_sections_for_range(
			book_sections,
			parsed.start.chapter,
			parsed.start.verse,
			parsed.end.chapter,
			parsed.end.verse
		)

		assert(sections.length > 0, `No sections found for reference: ${result.reference}`)

		return {
			...result,
			book_id: parsed.book_id,
			target_params: target?.params ?? null,
			target_anchor: target?.anchor ?? null,
			display_text: target?.display_text ?? result.reference,
			sections,
		}
	})
}

function extract_sections_for_range(
	book_sections: Book,
	start_chapter: number,
	start_verse: number,
	end_chapter: number,
	end_verse: number
): BookSection[] {
	const range_start = [start_chapter, start_verse]
	const range_end = [end_chapter, end_verse]

	const in_range = (chunk: SectionChildren) => {
		if (chunk.type === 'text' && chunk.chapter_number && chunk.verse_number) {
			return withinRange(range_start, range_end, [chunk.chapter_number, chunk.verse_number])
		} else if (chunk.type === 'verse number' && chunk.chapter_number) {
			return withinRange(range_start, range_end, [chunk.chapter_number, chunk.value])
		}
		return false
	}

	return filter_book_to_range(book_sections, in_range)
}

const filter_book_to_range = (book_sections: Book, in_range: (chunk: SectionChildren) => boolean): BookSection[] => {
	let am_in_range = false
	return book_sections.flatMap(section => {
		if (!section.children) {
			return am_in_range ? section : []
		}
		const relevant_children = remove_all_chunks_without_numbers_after_last_chunk_with_numbers(section.children.filter(chunk => {
			am_in_range = in_range(chunk)
			return am_in_range
		}))

		if (relevant_children.length > 0) {
			return [{
				...section,
				children: relevant_children,
			}]
		}

		return []
	})
}

const remove_all_chunks_without_numbers_after_last_chunk_with_numbers = (book_sections: SectionChildren[]): SectionChildren[] => {
	const last_chunk_with_numbers_index = book_sections.findLastIndex(chunk => chunk.type === 'text' && chunk.chapter_number && chunk.verse_number)

	if (last_chunk_with_numbers_index === -1) {
		return []
	}

	return book_sections.slice(0, last_chunk_with_numbers_index + 1)
}

