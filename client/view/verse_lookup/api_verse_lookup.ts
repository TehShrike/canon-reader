export type ApiResult = {
	reference: string
	text: string
	type: 'paraphrase' | 'match'
	match_quality: number
}

export default async (query: string) => {
	const response = await fetch(`/api/verse_lookup?q=${encodeURIComponent(query)}`)
	const results: ApiResult[] = await response.json()
	return results
}
