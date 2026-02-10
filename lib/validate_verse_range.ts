import rangeCompare from 'multi-part-range-compare'

interface ReferenceWithinBook {
	chapter: number
	verse: number | null
}

type VerseRange = {
	start: ReferenceWithinBook
	end: ReferenceWithinBook
}

const range_array_to_object = ([ chapter, verse ]: [number, number | null]): ReferenceWithinBook => ({ chapter, verse })

const is_after = (first_range: [number, number | null], second_range: [number, number | null]): boolean => {
	const [first_chapter, first_verse] = first_range
	const [second_chapter, second_verse] = second_range
	const first_without_null = typeof first_verse === 'number' ? [first_chapter, first_verse] : [first_chapter]
	const second_without_null = typeof second_verse === 'number' ? [second_chapter, second_verse] : [second_chapter]
	return rangeCompare.relative(first_without_null, first_without_null, second_without_null) === rangeCompare.GREATER_THAN_END
}


const verse_to_number_array = ({ chapter, verse }: ReferenceWithinBook): [number, number | null] => [ chapter, verse ]

export default ({ start, end }: VerseRange): VerseRange => {
	const range_start = verse_to_number_array(start)
	const range_end = verse_to_number_array(end)

	return {
		start: range_array_to_object(range_start),
		end: range_array_to_object(is_after(range_start, range_end) ? range_end : range_start),
	}
}

