export const toRange = (startChapter, startVerse, endChapter, endVerse) =>
	`${startChapter}_${startVerse}-${endChapter}_${endVerse}`

const rangeRegex = /^(\d+)_(\d+)-(\d+)_(\d+)$/
export const fromRange = string => {
	const match = string.match(rangeRegex)

	if (match) {
		const [ , startChapter, startVerse, endChapter, endVerse ] = match

		return {
			startChapter: parseInt(startChapter, 10),
			startVerse: parseInt(startVerse, 10),
			endChapter: parseInt(endChapter, 10),
			endVerse: parseInt(endVerse, 10),
		}
	}
}
