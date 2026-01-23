import test from 'node:test'
import assert from 'node:assert'
import referenceParser from './reference-parser.ts'

interface ParsedReference {
	bookId: string | null
	start: { chapter: number | null; verse: number | null; section: string | null }
	end: { chapter: number | null; verse: number | null; section: string | null }
}

const cases: Array<[string, ParsedReference]> = [
	[
		'rev 13:13', {
			bookId: 'revelation',
			start: { chapter: 13, verse: 13, section: null },
			end: { chapter: 13, verse: 13, section: null },
		},
	], [
		'josss', {
			bookId: 'joshua',
			start: { chapter: null, verse: null, section: null },
			end: { chapter: null, verse: null, section: null },
		},
	], [
		'nothing', {
			bookId: null,
			start: { chapter: null, verse: null, section: null },
			end: { chapter: null, verse: null, section: null },
		},
	], [
		'rev 12:2-14:4a', {
			bookId: 'revelation',
			start: { chapter: 12, verse: 2, section: null },
			end: { chapter: 14, verse: 4, section: 'a' },
		},
	], [
		'rev 12:2-4a', {
			bookId: 'revelation',
			start: { chapter: 12, verse: 2, section: null },
			end: { chapter: 12, verse: 4, section: 'a' },
		},
	], [
		'gen 3-4', {
			bookId: 'genesis',
			start: { chapter: 3, verse: null, section: null },
			end: { chapter: 4, verse: null, section: null },
		},
	], [
		'3', {
			bookId: null,
			start: { chapter: 3, verse: null, section: null },
			end: { chapter: 3, verse: null, section: null },
		},
	], [
		'3:4', {
			bookId: null,
			start: { chapter: 3, verse: 4, section: null },
			end: { chapter: 3, verse: 4, section: null },
		},
	], [
		'3-4', {
			bookId: null,
			start: { chapter: 3, verse: null, section: null },
			end: { chapter: 4, verse: null, section: null },
		},
	],
]

test(`reference-regex`, () => {
	cases.forEach(([ input, expectedOutput ]) => {
		const output = referenceParser(input)
		assert.deepEqual(output, expectedOutput, input)
	})
	console.log('done')
})
