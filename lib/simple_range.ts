export interface VerseRange {
	startChapter: number
	startVerse: number
	endChapter: number
	endVerse: number
}

export const to_range = (start_chapter: number, start_verse: number, end_chapter: number, end_verse: number): string =>
	`${start_chapter}_${start_verse}-${end_chapter}_${end_verse}`

const range_regex = /^(\d+)_(\d+)-(\d+)_(\d+)$/
export const from_range = (string: string): VerseRange | undefined => {
	const match = string.match(range_regex)

	if (match) {
		const [ , startChapter, startVerse, endChapter, endVerse ] = match

		return {
			startChapter: parseInt(startChapter!, 10),
			startVerse: parseInt(startVerse!, 10),
			endChapter: parseInt(endChapter!, 10),
			endVerse: parseInt(endVerse!, 10),
		}
	}
}
