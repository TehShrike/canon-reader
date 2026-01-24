import VerseLookup from './VerseLookup.svelte'
import assert from '#lib/assert.ts'
import bibleBooksMap from '#lib/bible.ts'
import parse_reference from '#lib/reference_parser.ts'
import get_target_state_from_reference from '#lib/get_target_state_from_reference.ts'
import withinRange from 'multi-part-range-compare'
import type { TypedMediator } from '#lib/mediator_instance.ts'
import type { State } from '#lib/asr_types.ts'
import type { Book, BookSection, SectionChildren } from '#lib/book_types.ts'

interface ApiResult {
	reference: string
	text: string
	type: 'paraphrase' | 'match'
	match_quality: number
}

interface ResolvedResult {
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

const remove_all_chunks_without_numbers_after_last_chunk_with_numbers = (book_sections: SectionChildren[]): SectionChildren[] => {
	const last_chunk_with_numbers_index = book_sections.findIndex(chunk => chunk.type === 'text' && chunk.chapterNumber && chunk.verseNumber)

	if (last_chunk_with_numbers_index === -1) {
		return []
	}

	return book_sections.slice(0, last_chunk_with_numbers_index + 1)
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
		if (chunk.type === 'text' && chunk.chapterNumber && chunk.verseNumber) {
			return withinRange(range_start, range_end, [chunk.chapterNumber, chunk.verseNumber])
		} else if (chunk.type === 'verse number' && chunk.chapterNumber) {
			return withinRange(range_start, range_end, [chunk.chapterNumber, chunk.value])
		}
		return false
	}

	return filter_book_to_range(book_sections, in_range)
}

export default (_mediator: TypedMediator): State => ({
	name: `main.verse-lookup`,
	route: `verse-lookup`,
	querystringParameters: ['q'],
	template: VerseLookup,
	async resolve(_data, parameters) {
		const query = parameters.q
		assert(query, `No query parameter provided`)

		const response = await fetch(`/api/verse_lookup?q=${encodeURIComponent(query)}`)
		const results: ApiResult[] = await response.json()

		const resolved_results: ResolvedResult[] = results.map(result => {
			const target = get_target_state_from_reference(result.reference)
			const parsed = parse_reference(result.reference)

			assert(parsed.bookId, `No book ID found in reference: ${result.reference}`)
			const book_sections = bibleBooksMap[parsed.bookId]
			assert(book_sections, `Book ID ${parsed.bookId} not found in bibleBooksMap`)
			assert(parsed.start.chapter && parsed.start.verse && parsed.end.chapter && parsed.end.verse, `No start or end chapter or verse found in parsed reference: ${parsed}`)

			const sections = extract_sections_for_range(
				book_sections,
				parsed.start.chapter,
				parsed.start.verse,
				parsed.end.chapter,
				parsed.end.verse
			)

			return {
				...result,
				book_id: parsed.bookId,
				target_params: target?.params ?? null,
				target_anchor: target?.anchor ?? null,
				display_text: target?.display_text ?? result.reference,
				sections,
			}
		})

		const results_with_sections = resolved_results.filter(r => r.sections.length > 0)
		assert(results_with_sections.length === resolved_results.length, `Some results had no matching sections`)

		return {
			query,
			results: results_with_sections,
		}
	},
})
