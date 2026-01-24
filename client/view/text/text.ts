import Text from './Text.svelte'
import bibleBooksMap from '#lib/bible.ts'
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

		const bookSections = bibleBooksMap[book_id]
		assert(bookSections, `No book text found for ${book_id}`)

		const book = mediator.call(`get_book_by_id`, book_id)
		assert(book, `No book found for id: ${book_id}`)

		return Promise.resolve({
			bookSections,
			bookName: book.name,
			chapterCount: (chapterCounts as Record<string, number>)[book_id]!,
		})
	},
})
