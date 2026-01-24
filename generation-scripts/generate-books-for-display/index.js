import { join } from 'path'
import books from 'books-of-the-bible'
import flatMap from '#lib/flat_map.ts'
import makeDir from 'make-dir'
import { writeFile } from 'fs/promises'
import { get_book_id } from '#lib/get_id.ts'
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
	await makeDir(relative('../../lib/books'))

	const output = books.map(book => {
		const book_id = get_book_id(book.name)
		const book_data = book_id === 'revelation'
			? loadPickeringRevelation()
			: JSON.parse(readFileSync(require.resolve(`world-english-bible/json/${ book_id }.json`), 'utf8'))

		const array_of_sections = makeArrayOfSections(book_data)
		const book_with_markers = bookSectionsWithChapterAndVerseMarkers(array_of_sections)

		return {
			book_with_markers,
			number_of_chapters: getNumberOfChapters(book_with_markers),
			id: book_id,
		}
	})

	await Promise.all(output.map(({ book_with_markers, id }) => {
		writeFile(relative(`../../lib/books/${ id }.ts`), toTypeScript(book_with_markers))
	}))
	console.log(`wrote ${ output.length } books`)

	const chapter_counts = output.reduce((acc, { number_of_chapters, id }) => {
		acc[id] = number_of_chapters
		return acc
	}, {})

	await writeFile(relative('../../lib/books/chapter-counts.ts'), toTypeScript(chapter_counts))
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
