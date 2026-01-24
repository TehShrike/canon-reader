import { get_book_id } from '#lib/get_id.ts'
import books from 'books-of-the-bible'
import type { TypedMediator } from '#lib/mediator_instance.ts'

interface Book {
	name: string
	aliases: string[]
}

export default (mediator: TypedMediator): void => {
	const id_to_book: Record<string, Book> = Object.create(null)

	books.forEach((book: Book) => {
		const id = get_book_id(book.name)
		id_to_book[id] = book
	})

	mediator.provide('get_book_by_id', (id) => id_to_book[id])
}
