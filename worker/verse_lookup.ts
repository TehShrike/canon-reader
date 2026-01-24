import { send_message, extract_text } from '#lib/claude_api.ts'

const SYSTEM_PROMPT = `You are a Bible verse lookup assistant. Given a user's query, identify all Bible verses that match what they're looking for.

Return your response as a JSON array of objects, each with:
- "reference": the full reference (e.g., "John 3:16", "Romans 8:28-30")
- "text": the full text of the verse(s)

Use the ESV translation. If the query is ambiguous, include all likely matches. If no verses match, return an empty array.

Return ONLY the JSON array, no other text.`

export const verse_lookup = async (api_key: string, query: string) =>
	extract_text(await send_message({
		api_key,
		messages: [{ role: 'user', content: query }],
		max_tokens: 4096,
		system: SYSTEM_PROMPT,
	}))
