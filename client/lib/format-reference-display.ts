import books from 'books-of-the-bible'
import { getBookId } from '#lib/get-id.ts'

interface Book {
	name: string
	aliases: string[]
}

interface VersePosition {
	chapter: number | null
	verse: number | null
}

const idToBook: Record<string, Book> = Object.create(null)

books.forEach((book: Book) => {
	const id = getBookId(book.name)
	idToBook[id] = book
})

export default function formatReferenceDisplay(
	bookId: string,
	start: VersePosition,
	end: VersePosition
): string {
	const book = idToBook[bookId]
	if (!book) {
		return ''
	}

	const bookName = book.name

	if (!start.chapter) {
		return bookName
	}

	if (!start.verse) {
		return `${bookName} ${start.chapter}`
	}

	const startRef = `${start.chapter}:${start.verse}`

	if (!end.chapter || !end.verse) {
		return `${bookName} ${startRef}`
	}

	if (start.chapter === end.chapter && start.verse === end.verse) {
		return `${bookName} ${startRef}`
	}

	if (start.chapter === end.chapter) {
		return `${bookName} ${start.chapter}:${start.verse}-${end.verse}`
	}

	return `${bookName} ${startRef}-${end.chapter}:${end.verse}`
}
