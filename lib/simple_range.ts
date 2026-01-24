export interface VerseRange {
	start_chapter: number
	start_verse: number
	end_chapter: number
	end_verse: number
}

export const to_range = (start_chapter: number, start_verse: number, end_chapter: number, end_verse: number): string =>
	`${start_chapter}_${start_verse}-${end_chapter}_${end_verse}`

const range_regex = /^(\d+)_(\d+)-(\d+)_(\d+)$/
export const from_range = (string: string): VerseRange | undefined => {
	const match = string.match(range_regex)

	if (match) {
		const [ , start_chapter, start_verse, end_chapter, end_verse ] = match

		return {
			start_chapter: parseInt(start_chapter!, 10),
			start_verse: parseInt(start_verse!, 10),
			end_chapter: parseInt(end_chapter!, 10),
			end_verse: parseInt(end_verse!, 10),
		}
	}
}
