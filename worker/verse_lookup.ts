import { send_message, extract_text } from '#lib/claude_api.ts'
import type { OutputFormat } from '#lib/claude_api.ts'
import * as v from '#lib/json_validator.ts'
import { assert_valid } from '#lib/assert.ts'

const SYSTEM_PROMPT = `You are a Bible verse lookup assistant. The user will provide either a paraphrase of a passage, or a search string that could be found in many verses.

For each matching verse, provide:
- "reference": the full reference (e.g., "John 3:16", "Romans 8:28-30", "Genesis 1:31-2:3")
- "text": the full text of the verse(s)
- "type": either "paraphrase" if the verse is a direct paraphrase of what the user provided, or "similar" if it only contains related ideas
- "match_quality": a number from 0 to 9, with 9 being an exact phrase match or perfect paraphrase, 5 being a partial paraphrase, 0 if not a paraphrase at all`

const verse_result_validator = v.array(v.object({
	reference: v.is_string,
	text: v.is_string,
	type: v.one_of(v.exact('paraphrase'), v.exact('similar')),
	match_quality: v.is_number,
}))

// https://platform.claude.com/docs/en/build-with-claude/structured-outputs
const output_format: OutputFormat = {
	type: 'json_schema',
	schema: {
		type: 'array',
		items: {
			type: 'object',
			properties: {
				reference: { type: 'string' },
				text: { type: 'string' },
				type: { type: 'string', enum: [ 'paraphrase', 'similar' ] },
				match_quality: { type: 'number' },
			},
			required: [ 'reference', 'text', 'type', 'match_quality' ],
			additionalProperties: false,
		},
	},
}

const CACHE_TTL_SECONDS = 60 * 60

const get_cache_key = (query: string) => `verse_lookup:${query.toLowerCase().trim()}`

export const verse_lookup = async (api_key: string, query: string, cache: KVNamespace) => {
	const cache_key = get_cache_key(query)

	const cached = await cache.get(cache_key)
	if (cached) {
		return JSON.parse(cached)
	}

	const response_text = extract_text(await send_message({
		api_key,
		messages: [{ role: 'user', content: query }],
		max_tokens: 10_000,
		system: SYSTEM_PROMPT,
		output_format,
	}))

	const parsed = JSON.parse(response_text)
	assert_valid(verse_result_validator, parsed)

	await cache.put(cache_key, JSON.stringify(parsed), { expirationTtl: CACHE_TTL_SECONDS })

	return parsed
}
