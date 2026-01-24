import { send_message, extract_text } from '#lib/claude_api.ts'
import * as v from '#lib/json_validator.ts'
import { assert_valid } from '#lib/assert.ts'

const SYSTEM_PROMPT = `You are a Bible verse lookup assistant. The user will provide either a paraphrase of a passage, or a search string that could be found in many verses.

Return your response as a JSON array of objects, each with:
- "reference": the full reference (e.g., "John 3:16", "Romans 8:28-30")
- "text": the full text of the verse(s)
- "type": either "paraphrase" if the verse is a plausible paraphrase of what the user provided, or "match" if it only contains related ideas
- "match_quality": a number from 0 to 9, with 9 being an exact phrase match, 5 being a decent paraphrase, 0 if not a paraphrase at all

Return ONLY the JSON array, no other text.`

const verse_result_validator = v.array(v.object({
	reference: v.is_string,
	text: v.is_string,
	type: v.one_of(v.exact('paraphrase'), v.exact('match')),
	match_quality: v.is_number,
}))

export const verse_lookup = async (api_key: string, query: string) => {
	const response_text = extract_text(await send_message({
		api_key,
		messages: [{ role: 'user', content: query }],
		max_tokens: 4096,
		system: SYSTEM_PROMPT,
	}))

	const parsed = JSON.parse(response_text)
	assert_valid(verse_result_validator, parsed)

	return parsed
}
