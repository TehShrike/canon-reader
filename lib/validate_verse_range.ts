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
	const range_start = verse_to_number_array(start)
	const range_end = verse_to_number_array(end)

	return {
		start: range_array_to_object(range_start),
		end: range_array_to_object(is_after(range_start, range_end) ? range_end : range_start),
	}
}

const range_array_to_object = ([ chapter, verse ]: [number | null, number | null]): VersePosition => ({ chapter, verse })

const is_after = (first_range: [number | null, number | null], second_range: [number | null, number | null]): boolean =>
	rangeCompare.relative(first_range, first_range, second_range) === rangeCompare.GREATER_THAN_END

const verse_to_number_array = ({ chapter, verse }: VersePosition): [number | null, number | null] => [ chapter, verse ]
