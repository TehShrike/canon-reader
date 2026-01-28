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
const to_json = (object: unknown) => JSON.stringify(object, null, '\t')
const to_book_typescript = (object: unknown) => `import type { Book } from '#lib/book_types.ts'\n\nconst book: Book = ${to_json(object)}\n\nexport default book\n`
const to_typescript = (object: unknown) => `export default ${to_json(object)} as const\n`

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
			? load_pickering_revelation()
			: JSON.parse(await readFile(require.resolve(`world-english-bible/json/${book_id}.json`), 'utf8'))

		const array_of_sections = make_array_of_sections(book_data)
		const book_with_markers: Book = book_sections_with_chapter_and_verse_markers(array_of_sections)

		return {
			book_with_markers,
			number_of_chapters: get_number_of_chapters(book_with_markers),
			id: book_id,
		}
	}))

	await Promise.all(output.map(({ book_with_markers, id }) => {
		return writeFile(relative(`../../lib/books/${id}.ts`), to_book_typescript(book_with_markers))
	}))
	console.log(`wrote ${output.length} books`)

	const chapter_counts = output.reduce((acc, { number_of_chapters, id }) => {
		acc[id] = number_of_chapters
		return acc
	}, {} as Record<string, number>)

	await writeFile(relative('../../lib/books/chapter-counts.ts'), to_typescript(chapter_counts))
	console.log('wrote chapter-counts.ts')
}

function load_pickering_revelation(): InputBook {
	const require = createRequire(import.meta.url)
	const revelation: RevelationChunk[] = JSON.parse(
		require('fs').readFileSync(require.resolve('revelation/revelation.json'), 'utf8')
	)
	let in_paragraph = false

	const to_text_chunk = (chunk: RevelationChunk): InputChunk => ({
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
				in_paragraph = false

				return [{
					type: 'paragraph end' as const,
				}]
			}

			const paragraph = chunk.type === 'verse'

			if (paragraph && !in_paragraph) {
				in_paragraph = true
				return [
					{ type: 'paragraph start' as const },
					to_text_chunk(chunk),
				]
			}

			return [to_text_chunk(chunk)]
		}
	)
}

type IntermediateSection = {
	type: 'paragraph' | 'stanza' | 'break' | 'header'
	value?: string | undefined
	children?: IntermediateChild[] | undefined
}

function make_array_of_sections(book: InputBook): IntermediateSection[] {
	const sections: IntermediateSection[] = []
	let current: IntermediateSection | null = null

	const create_new = (type: 'paragraph' | 'stanza') => {
		current = { type, children: [] }
	}

	book.forEach(chunk => {
		if (chunk.type === 'paragraph start') {
			create_new('paragraph')
		} else if (chunk.type === 'stanza start') {
			create_new('stanza')
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
			const text_chunk = chunk as { chapterNumber?: number; verseNumber?: number; value?: string | number }
			current.children?.push({
				chapterNumber: text_chunk.chapterNumber,
				verseNumber: text_chunk.verseNumber,
				value: text_chunk.value,
			})
		}
	})

	return sections
}

function book_sections_with_chapter_and_verse_markers(book_sections: IntermediateSection[]): Book {
	let last_chapter_number: number | null = null
	let last_verse_number: number | null = null

	return book_sections.map(section => {
		const children: SectionChildren[] | undefined = section.children
			? flatMap(section.children, (chunk): SectionChildren[] => {
				const { chapterNumber, verseNumber } = chunk
				const items_to_return: SectionChildren[] = []

				if (chapterNumber && chapterNumber !== last_chapter_number) {
					items_to_return.push({
						type: 'chapter number',
						value: chapterNumber,
					})
					last_chapter_number = chapterNumber
				}

				if (verseNumber && verseNumber !== last_verse_number) {
					const verse_chunk: VerseNumberChunk = chapterNumber !== undefined
						? { type: 'verse number', value: verseNumber, chapter_number: chapterNumber }
						: { type: 'verse number', value: verseNumber }
					items_to_return.push(verse_chunk)
					last_verse_number = verseNumber
				}

				// Text content chunk (no type field)
				if (chunk.value !== undefined) {
					const text_chunk: TextContentChunk = {
						type: 'text',
						value: String(chunk.value),
						...(chunk.chapterNumber !== undefined ? { chapter_number: chunk.chapterNumber } : {}),
						...(chunk.verseNumber !== undefined ? { verse_number: chunk.verseNumber } : {}),
					}
					items_to_return.push(text_chunk)
				} else if (chunk.type === 'line break') {
					items_to_return.push({ type: 'line break' })
				}

				return items_to_return
			})
			: undefined

		const result: BookSection = section.value !== undefined
			? { type: section.type, value: section.value, children }
			: { type: section.type, children }

		return result
	})
}

function get_number_of_chapters(book_sections: Book): number {
	return flatMap(book_sections,
		({ children }) => children
			? children
				.filter((chunk): chunk is { type: 'chapter number'; value: number } => chunk.type === 'chapter number')
				.map(({ value }) => value)
			: []
	).length
}
