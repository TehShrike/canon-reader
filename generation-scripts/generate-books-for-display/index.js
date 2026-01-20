import { join } from 'path'
import books from 'books-of-the-bible'
import flatMap from '../../client/lib/flat-map.ts'
import makeDir from 'make-dir'
import { writeFile } from 'fs/promises'
import { getBookId } from '../../client/lib/get-id.ts'
import { readFileSync } from 'fs'

const relative = path => join(import.meta.dirname, path)
const toJson = object => JSON.stringify(object, null, '\t')
const toTypeScript = object => `export default ${toJson(object)} as const\n`
import { createRequire } from 'module'

const require = createRequire(import.meta.url)

main().catch(err => {
	console.error(err)
})

async function main() {
	await makeDir(relative('../../client/lib/books'))

	const output = books.map(book => {
		const bookId = getBookId(book.name)
		const bookData = bookId === 'revelation'
			? loadPickeringRevelation()
			: JSON.parse(readFileSync(require.resolve(`world-english-bible/json/${ bookId }.json`), 'utf8'))

		const arrayOfSections = makeArrayOfSections(bookData)
		const bookWithMarkers = bookSectionsWithChapterAndVerseMarkers(arrayOfSections)

		return {
			bookWithMarkers,
			numberOfChapters: getNumberOfChapters(bookWithMarkers),
			id: bookId,
		}
	})

	await Promise.all(output.map(({ bookWithMarkers, id }) => {
		writeFile(relative(`../../client/lib/books/${ id }.ts`), toTypeScript(bookWithMarkers))
	}))
	console.log(`wrote ${ output.length } books`)

	const chapterCounts = output.reduce((acc, { numberOfChapters, id }) => {
		acc[id] = numberOfChapters
		return acc
	}, {})

	await writeFile(relative('../../client/lib/books/chapter-counts.ts'), toTypeScript(chapterCounts))
	console.log('wrote chapter-counts.ts')
}

function loadPickeringRevelation() {
	const revelation = JSON.parse(readFileSync(require.resolve('revelation/revelation.json'), 'utf8'))
	let inParagraph = false

	const toTextChunk = chunk => ({
		chapterNumber: chunk.chapterNumber,
		verseNumber: chunk.verseNumber,
		value: chunk.text,
	})

	return flatMap(
		revelation.filter(
			({ type }) => type !== 'header'
		),
		chunk => {
			if (chunk.type === 'paragraph break') {
				inParagraph = false

				return [{
					type: 'paragraph end',
				}]
			}

			const paragraph = chunk.type === 'verse'

			if (paragraph && !inParagraph) {
				inParagraph = true
				return [
					{ type: 'paragraph start' },
					toTextChunk(chunk),
				]
			}

			return [ toTextChunk(chunk) ]
		}
	)
}

function makeArrayOfSections(book) {
	const sections = []
	let current = null

	const createNew = type => current = { type, children: [] }

	book.forEach(chunk => {
		if (chunk.type === 'paragraph start') {
			createNew('paragraph')
		} else if (chunk.type === 'stanza start') {
			createNew('stanza')
		} else if (chunk.type === 'paragraph end' || chunk.type === 'stanza end') {
			sections.push(current)
			current = null
		} else if (chunk.type === 'break' || chunk.type === 'header' || chunk.type === 'line break') {
			if (current) {
				current.children.push(chunk)
			} else {
				sections.push(chunk)
			}
		} else {
			if (current === null) {
				console.error(chunk)
				throw new Error(`wat`)
			}
			current.children.push({
				chapterNumber: chunk.chapterNumber,
				verseNumber: chunk.verseNumber,
				value: chunk.value,
			})
		}
	})

	return sections
}

function bookSectionsWithChapterAndVerseMarkers(bookSections) {
	let lastChapterNumber = null
	let lastVerseNumber = null

	return bookSections.map(section => Object.assign({}, section, {
		children: section.children && flatMap(section.children, chunk => {
			const { chapterNumber, verseNumber } = chunk
			const itemsToReturn = []

			if (chapterNumber && chapterNumber !== lastChapterNumber) {
				itemsToReturn.push({
					type: 'chapter number',
					value: chapterNumber,
				})
				lastChapterNumber = chapterNumber
			}

			if (verseNumber && verseNumber !== lastVerseNumber) {
				itemsToReturn.push({
					type: 'verse number',
					value: verseNumber,
					chapterNumber,
				})
				lastVerseNumber = verseNumber
			}

			itemsToReturn.push(chunk)

			return itemsToReturn
		}),
	}))
}

function getNumberOfChapters(bookSectionsWithChapterAndVerseMarkers) {
	return flatMap(bookSectionsWithChapterAndVerseMarkers,
		({ children }) => children
			? children
				.filter(({ type }) => type === 'chapter number')
				.map(({ value }) => value)
			: []
	).length
}
