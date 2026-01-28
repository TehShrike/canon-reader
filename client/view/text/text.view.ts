import Text from './Text.svelte'
import bible_books_map from '#lib/bible.ts'
import chapterCounts from '#lib/books/chapter-counts.ts'
import assert from '#lib/assert.ts'
import type { TypedMediator } from '#lib/mediator_instance.ts'
import type { State } from '#lib/asr_types.ts'

export default (mediator: TypedMediator): State => ({
	name: `main.text`,
	route: `text/:book`,
	template: Text,
	resolve(_data, parameters) {
		const book_id = parameters.book
		assert(book_id, `No book parameter provided`)

		const book_sections = bible_books_map[book_id]
		assert(book_sections, `No book text found for ${book_id}`)

		const book = mediator.call(`get_book_by_id`, book_id)
		assert(book, `No book found for id: ${book_id}`)

		return Promise.resolve({
			mediator,
			book_id,
			book_sections,
			book_name: book.name,
			chapter_count: (chapterCounts as Record<string, number>)[book_id]!,
		})
	},
})
