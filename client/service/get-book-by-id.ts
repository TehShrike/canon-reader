import { getBookId } from '#lib/get-id.ts'
import books from 'books-of-the-bible'
import type { TypedMediator } from '#lib/mediator-instance.ts'

interface Book {
	name: string
	aliases: string[]
}

export default (mediator: TypedMediator): void => {
	const idToBook: Record<string, Book> = Object.create(null)

	books.forEach((book: Book) => {
		const id = getBookId(book.name)
		idToBook[id] = book
	})

	mediator.provide('getBookById', (id) => idToBook[id])
}
