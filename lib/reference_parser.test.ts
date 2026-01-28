import { test } from 'node:test'
import * as assert from 'node:assert'
import reference_parser from '#lib/reference_parser.ts'

interface ParsedReference {
	book_id: string | null
	start: { chapter: number | null; verse: number | null; section: string | null }
	end: { chapter: number | null; verse: number | null; section: string | null }
}

const cases: Array<[string, ParsedReference]> = [
	[
		'rev 13:13', {
			book_id: 'revelation',
			start: { chapter: 13, verse: 13, section: null },
			end: { chapter: 13, verse: 13, section: null },
		},
	], [
		'josss', {
			book_id: null,
			start: { chapter: null, verse: null, section: null },
			end: { chapter: null, verse: null, section: null },
		},
	], [
		'nothing', {
			book_id: null,
			start: { chapter: null, verse: null, section: null },
			end: { chapter: null, verse: null, section: null },
		},
	], [
		'rev 12:2-14:4a', {
			book_id: 'revelation',
			start: { chapter: 12, verse: 2, section: null },
			end: { chapter: 14, verse: 4, section: 'a' },
		},
	], [
		'rev 12:2-4a', {
			book_id: 'revelation',
			start: { chapter: 12, verse: 2, section: null },
			end: { chapter: 12, verse: 4, section: 'a' },
		},
	], [
		'gen 3-4', {
			book_id: 'genesis',
			start: { chapter: 3, verse: null, section: null },
			end: { chapter: 4, verse: null, section: null },
		},
	], [
		'3', {
			book_id: null,
			start: { chapter: 3, verse: null, section: null },
			end: { chapter: 3, verse: null, section: null },
		},
	], [
		'3:4', {
			book_id: null,
			start: { chapter: 3, verse: 4, section: null },
			end: { chapter: 3, verse: 4, section: null },
		},
	], [
		'3-4', {
			book_id: null,
			start: { chapter: 3, verse: null, section: null },
			end: { chapter: 4, verse: null, section: null },
		},
	],
]

test(`reference_parser`, () => {
	cases.forEach(([ input, expected_output ]) => {
		const output = reference_parser(input)
		assert.deepStrictEqual(output, expected_output, input)
	})
})
