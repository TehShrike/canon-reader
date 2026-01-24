import { join } from 'path'
import books from 'books-of-the-bible'
import flatMap from '#lib/flat_map.ts'
// @ts-expect-error no types available
import makeDir from 'make-dir'
import { writeFile, readFile } from 'fs/promises'
import { get_book_id } from '#lib/get_id.ts'
import { createRequire } from 'module'
import type { Book, BookSection, SectionChildren, VerseNumberChunk, TextContentChunk } from '#lib/book_types.ts'

const require = createRequire(import.meta.url)

const relative = (path: string) => join(import.meta.dirname, path)
const toJson = (object: unknown) => JSON.stringify(object, null, '\t')
const toTypeScript = (object: unknown) => `export default ${toJson(object)} as const\n`

// Input types from world-english-bible and revelation packages
type InputSeparatorChunk = { type: 'paragraph start' }
	| { type: 'paragraph end' }
	| { type: 'stanza start' }
	| { type: 'stanza end' }
	| { type: 'line break' }
	| { type: 'break' }
	| { type: 'continue previous paragraph' }

type InputTextChunk = { type: 'paragraph text'; chapterNumber?: number | undefined; verseNumber?: number | undefined; sectionNumber?: number | undefined; value: string }
	| { type: 'line text'; chapterNumber?: number | undefined; verseNumber?: number | undefined; sectionNumber?: number | undefined; value: string }
	| { type: 'chapter number'; value: number }
	| { type: 'header'; value: string }

type InputVerseNumberChunk = { type: 'verse number'; value: number; chapterNumber?: number }

type InputChunk = InputSeparatorChunk | InputTextChunk | InputVerseNumberChunk

type InputBook = InputChunk[]

type RevelationChunk = {
	type: string
	chapterNumber?: number
	verseNumber?: number
	text?: string
}

// Intermediate type used during processing
type IntermediateChild = {
	type?: string | undefined
	chapterNumber?: number | undefined
	verseNumber?: number | undefined
	value?: string | number | undefined
}

main().catch(err => {
	console.error(err)
})

async function main() {
	await makeDir(relative('../../lib/books'))

	const output = await Promise.all(books.map(async book => {
		const book_id = get_book_id(book.name)
		const book_data: InputBook = book_id === 'revelation'
			? loadPickeringRevelation()
			: JSON.parse(await readFile(require.resolve(`world-english-bible/json/${book_id}.json`), 'utf8'))

		const array_of_sections = makeArrayOfSections(book_data)
		const book_with_markers: Book = bookSectionsWithChapterAndVerseMarkers(array_of_sections)

		return {
			book_with_markers,
			number_of_chapters: getNumberOfChapters(book_with_markers),
			id: book_id,
		}
	}))

	await Promise.all(output.map(({ book_with_markers, id }) => {
		return writeFile(relative(`../../lib/books/${id}.ts`), toTypeScript(book_with_markers))
	}))
	console.log(`wrote ${output.length} books`)

	const chapter_counts = output.reduce((acc, { number_of_chapters, id }) => {
		acc[id] = number_of_chapters
		return acc
	}, {} as Record<string, number>)

	await writeFile(relative('../../lib/books/chapter-counts.ts'), toTypeScript(chapter_counts))
	console.log('wrote chapter-counts.ts')
}

function loadPickeringRevelation(): InputBook {
	const require = createRequire(import.meta.url)
	const revelation: RevelationChunk[] = JSON.parse(
		require('fs').readFileSync(require.resolve('revelation/revelation.json'), 'utf8')
	)
	let inParagraph = false

	const toTextChunk = (chunk: RevelationChunk): InputChunk => ({
		type: 'paragraph text' as const,
		chapterNumber: chunk.chapterNumber,
		verseNumber: chunk.verseNumber,
		value: chunk.text ?? '',
	})

	return flatMap(
		revelation.filter(
			({ type }) => type !== 'header'
		),
		(chunk): InputChunk[] => {
			if (chunk.type === 'paragraph break') {
				inParagraph = false

				return [{
					type: 'paragraph end' as const,
				}]
			}

			const paragraph = chunk.type === 'verse'

			if (paragraph && !inParagraph) {
				inParagraph = true
				return [
					{ type: 'paragraph start' as const },
					toTextChunk(chunk),
				]
			}

			return [toTextChunk(chunk)]
		}
	)
}

type IntermediateSection = {
	type: 'paragraph' | 'stanza' | 'break' | 'header'
	value?: string | undefined
	children?: IntermediateChild[] | undefined
}

function makeArrayOfSections(book: InputBook): IntermediateSection[] {
	const sections: IntermediateSection[] = []
	let current: IntermediateSection | null = null

	const createNew = (type: 'paragraph' | 'stanza') => {
		current = { type, children: [] }
	}

	book.forEach(chunk => {
		if (chunk.type === 'paragraph start') {
			createNew('paragraph')
		} else if (chunk.type === 'stanza start') {
			createNew('stanza')
		} else if (chunk.type === 'paragraph end' || chunk.type === 'stanza end') {
			if (current) {
				sections.push(current)
			}
			current = null
		} else if (chunk.type === 'break' || chunk.type === 'header' || chunk.type === 'line break') {
			if (current) {
				current.children?.push(chunk as IntermediateChild)
			} else {
				sections.push(chunk as IntermediateSection)
			}
		} else {
			if (current === null) {
				console.error(chunk)
				throw new Error(`wat`)
			}
			const textChunk = chunk as { chapterNumber?: number; verseNumber?: number; value?: string | number }
			current.children?.push({
				chapterNumber: textChunk.chapterNumber,
				verseNumber: textChunk.verseNumber,
				value: textChunk.value,
			})
		}
	})

	return sections
}

function bookSectionsWithChapterAndVerseMarkers(bookSections: IntermediateSection[]): Book {
	let lastChapterNumber: number | null = null
	let lastVerseNumber: number | null = null

	return bookSections.map(section => {
		const children: SectionChildren[] | undefined = section.children
			? flatMap(section.children, (chunk): SectionChildren[] => {
				const { chapterNumber, verseNumber } = chunk
				const itemsToReturn: SectionChildren[] = []

				if (chapterNumber && chapterNumber !== lastChapterNumber) {
					itemsToReturn.push({
						type: 'chapter number',
						value: chapterNumber,
					})
					lastChapterNumber = chapterNumber
				}

				if (verseNumber && verseNumber !== lastVerseNumber) {
					const verseChunk: VerseNumberChunk = chapterNumber !== undefined
						? { type: 'verse number', value: verseNumber, chapterNumber }
						: { type: 'verse number', value: verseNumber }
					itemsToReturn.push(verseChunk)
					lastVerseNumber = verseNumber
				}

				// Text content chunk (no type field)
				if (chunk.value !== undefined) {
					const textChunk: TextContentChunk = {
						type: 'text',
						value: String(chunk.value),
						...(chunk.chapterNumber !== undefined ? { chapterNumber: chunk.chapterNumber } : {}),
						...(chunk.verseNumber !== undefined ? { verseNumber: chunk.verseNumber } : {}),
					}
					itemsToReturn.push(textChunk)
				} else if (chunk.type === 'line break') {
					itemsToReturn.push({ type: 'line break' })
				}

				return itemsToReturn
			})
			: undefined

		const result: BookSection = section.value !== undefined
			? { type: section.type, value: section.value, children }
			: { type: section.type, children }

		return result
	})
}

function getNumberOfChapters(bookSections: Book): number {
	return flatMap(bookSections,
		({ children }) => children
			? children
				.filter((chunk): chunk is { type: 'chapter number'; value: number } => chunk.type === 'chapter number')
				.map(({ value }) => value)
			: []
	).length
}
