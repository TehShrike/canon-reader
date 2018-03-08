import { getBookId } from 'lib/get-id.js'
import books from 'books-of-the-bible'

export default mediator => {
	const idToBook = Object.create(null)

	books.forEach(book => {
		const id = getBookId(book.name)
		idToBook[id] = book
	})

	mediator.provideSync('getBookById', id => idToBook[id])
}
