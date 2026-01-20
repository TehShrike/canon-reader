export interface VerseRange {
	startChapter: number
	startVerse: number
	endChapter: number
	endVerse: number
}

export const toRange = (startChapter: number, startVerse: number, endChapter: number, endVerse: number): string =>
	`${startChapter}_${startVerse}-${endChapter}_${endVerse}`

const rangeRegex = /^(\d+)_(\d+)-(\d+)_(\d+)$/
export const fromRange = (string: string): VerseRange | undefined => {
	const match = string.match(rangeRegex)

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
