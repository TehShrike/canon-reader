import parse_reference from '#lib/reference_parser.ts'
import { get_chapter_number_id, get_chapter_verse_id } from '#lib/get_id.ts'
import validate_verse_range from '#lib/validate_verse_range.ts'
import { to_range } from '#lib/simple_range.ts'
import format_reference_display from '#lib/format_reference_display.ts'

interface TargetState {
	state_name: string
	params: {
		book: string
		highlight?: string
	}
	anchor: string | null
	display_text: string
}

export default (reference_string: string, default_book_id?: string): TargetState | undefined => {
	if (!reference_string) {
		return
	}

	const parsed = parse_reference(reference_string)
	const book_id = parsed.bookId || default_book_id

	if (book_id) {
		const { start, end } = validate_verse_range(parsed)

		const state_name = `main.text`
		const params: { book: string; highlight?: string } = {
			book: book_id,
		}

		if (start.verse && start.chapter && end.chapter && end.verse) {
			params.highlight = to_range(start.chapter, start.verse, end.chapter, end.verse)
		}

		const anchor = get_anchor(start.chapter, start.verse)
		const display_text = format_reference_display(book_id, start, end)

		return {
			state_name,
			params,
			anchor,
			display_text,
		}
	}
}

function get_anchor(chapter: number | null, verse: number | null): string | null {
	if (chapter && verse) {
		return get_chapter_verse_id(chapter, verse)
	} else if (chapter) {
		return get_chapter_number_id(chapter)
	} else {
		return null
	}
}
