import rangeCompare from 'multi-part-range-compare'

const START_OF_VERSE = 0
const END_OF_VERSE = Infinity

export default ({ bookId, start, end }) => {
	const rangeStart = verseToNumberArray(start, START_OF_VERSE)
	const rangeEnd = verseToNumberArray(end, END_OF_VERSE)

	return {
		start: rangeArrayToObject(rangeStart),
		end: rangeArrayToObject(isAfter(rangeStart, rangeEnd) ? rangeEnd : rangeStart),
	}
}

const rangeArrayToObject = ([ chapter, verse, section ]) => ({ chapter, verse, section })

const isAfter = (firstRange, secondRange) =>
	rangeCompare.relative(firstRange, firstRange, secondRange) === rangeCompare.GREATER_THAN_END

const verseToNumberArray = ({ chapter, verse, section }, defaultVerseSection) => {
	const sectionNumber = typeof section === 'string'
		? sectionCharacterToNumber(section)
		: defaultVerseSection

	return [ chapter, verse, sectionNumber ]
}

const sectionCharacterToNumber = str => str.toLowerCase().charCodeAt()
