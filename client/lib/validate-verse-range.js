import rangeCompare from 'multi-part-range-compare'

export default ({ bookId, start, end }) => {
	const rangeStart = verseToNumberArray(start)
	const rangeEnd = verseToNumberArray(end)

	return {
		start: rangeArrayToObject(rangeStart),
		end: rangeArrayToObject(isAfter(rangeStart, rangeEnd) ? rangeEnd : rangeStart),
	}
}

const rangeArrayToObject = ([ chapter, verse ]) => ({ chapter, verse })

const isAfter = (firstRange, secondRange) =>
	rangeCompare.relative(firstRange, firstRange, secondRange) === rangeCompare.GREATER_THAN_END

const verseToNumberArray = ({ chapter, verse }) => [ chapter, verse ]
