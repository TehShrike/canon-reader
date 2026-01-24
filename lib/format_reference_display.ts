import books from 'books-of-the-bible'
import { get_book_id } from '#lib/get_id.ts'

interface Book {
	name: string
	aliases: string[]
}

interface VersePosition {
	chapter: number | null
	verse: number | null
}

const id_to_book: Record<string, Book> = Object.create(null)

books.forEach((book: Book) => {
	const id = get_book_id(book.name)
	id_to_book[id] = book
})

export default function format_reference_display(
	book_id: string,
	start: VersePosition,
	end: VersePosition
): string {
	const book = id_to_book[book_id]
	if (!book) {
		return ''
	}

	const book_name = book.name

	if (!start.chapter) {
		return book_name
	}

	if (!start.verse) {
		return `${book_name} ${start.chapter}`
	}

	const start_ref = `${start.chapter}:${start.verse}`

	if (!end.chapter || !end.verse) {
		return `${book_name} ${start_ref}`
	}

	if (start.chapter === end.chapter && start.verse === end.verse) {
		return `${book_name} ${start_ref}`
	}

	if (start.chapter === end.chapter) {
		return `${book_name} ${start.chapter}:${start.verse}-${end.verse}`
	}

	return `${book_name} ${start_ref}-${end.chapter}:${end.verse}`
}
