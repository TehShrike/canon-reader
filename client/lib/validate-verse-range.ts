import rangeCompare from 'multi-part-range-compare'

interface VersePosition {
	chapter: number | null
	verse: number | null
}

interface ParsedReference {
	bookId: string | null
	start: VersePosition
	end: VersePosition
}

interface ValidatedRange {
	start: VersePosition
	end: VersePosition
}

export default ({ bookId, start, end }: ParsedReference): ValidatedRange => {
	const rangeStart = verseToNumberArray(start)
	const rangeEnd = verseToNumberArray(end)

	return {
		start: rangeArrayToObject(rangeStart),
		end: rangeArrayToObject(isAfter(rangeStart, rangeEnd) ? rangeEnd : rangeStart),
	}
}

const rangeArrayToObject = ([ chapter, verse ]: [number | null, number | null]): VersePosition => ({ chapter, verse })

const isAfter = (firstRange: [number | null, number | null], secondRange: [number | null, number | null]): boolean =>
	rangeCompare.relative(firstRange, firstRange, secondRange) === rangeCompare.GREATER_THAN_END

const verseToNumberArray = ({ chapter, verse }: VersePosition): [number | null, number | null] => [ chapter, verse ]
