import Text from './Text.svelte'
import bibleBooksMap from '#lib/bible.ts'
import chapterCounts from '#lib/books/chapter-counts.ts'
import type { TypedMediator } from '#lib/mediator_instance.ts'

interface Parameters {
	book: string
}

export interface State {
	name: string
	route: string
	template: typeof Text
	resolve: (data: unknown, parameters: Parameters) => Promise<{
		bookSections: unknown
		bookName: string
		chapterCount: number
	}>
}

export default (mediator: TypedMediator): State => ({
	name: `main.text`,
	route: `text/:book`,
	template: Text,
	resolve(_data, parameters) {
		const bookSections = bibleBooksMap[parameters.book]
		if (!bookSections) {
			throw new Error(`No book text found for ${ parameters.book }`)
		}

		const book = mediator.call(`get_book_by_id`, parameters.book)
		if (!book) {
			throw new Error(`No book found for id: ${ parameters.book }`)
		}
		const bookName = book.name

		return Promise.resolve({
			bookSections,
			bookName,
			chapterCount: (chapterCounts as Record<string, number>)[parameters.book]!,
		})
	},
})
