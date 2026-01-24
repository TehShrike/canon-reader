const DEFAULT_MODEL: Model = 'claude-haiku-4-5'
const API_URL = 'https://api.anthropic.com/v1/messages'
const API_VERSION = '2023-06-01'

// ============================================================================
// Model Types
// ============================================================================

export type Model =
	| 'claude-opus-4-5-20251101'
	| 'claude-opus-4-5'
	| 'claude-3-7-sonnet-latest'
	| 'claude-3-7-sonnet-20250219'
	| 'claude-3-5-haiku-latest'
	| 'claude-3-5-haiku-20241022'
	| 'claude-haiku-4-5'
	| 'claude-haiku-4-5-20251001'
	| 'claude-sonnet-4-20250514'
	| 'claude-sonnet-4-0'
	| 'claude-4-sonnet-20250514'
	| 'claude-sonnet-4-5'
	| 'claude-sonnet-4-5-20250929'
	| 'claude-opus-4-0'
	| 'claude-opus-4-20250514'
	| 'claude-4-opus-20250514'
	| 'claude-opus-4-1-20250805'
	| 'claude-3-opus-latest'
	| 'claude-3-opus-20240229'
	| 'claude-3-haiku-20240307'

// ============================================================================
// Cache Control Types
// ============================================================================

export type CacheControlEphemeral = {
	type: 'ephemeral'
	ttl?: '5m' | '1h'
}

// ============================================================================
// Citation Types
// ============================================================================

export type CitationCharLocationParam = {
	type: 'char_location'
	cited_text: string
	document_index: number
	document_title: string
	start_char_index: number
	end_char_index: number
}

export type CitationPageLocationParam = {
	type: 'page_location'
	cited_text: string
	document_index: number
	document_title: string
	start_page_number: number
	end_page_number: number
}

export type CitationContentBlockLocationParam = {
	type: 'content_block_location'
	cited_text: string
	document_index: number
	document_title: string
	start_block_index: number
	end_block_index: number
}

export type CitationWebSearchResultLocationParam = {
	type: 'web_search_result_location'
	cited_text: string
	encrypted_index: string
	title: string
	url: string
}

export type CitationSearchResultLocationParam = {
	type: 'search_result_location'
	cited_text: string
	search_result_index: number
	source: string
	title: string
	start_block_index: number
	end_block_index: number
}

export type TextCitationParam =
	| CitationCharLocationParam
	| CitationPageLocationParam
	| CitationContentBlockLocationParam
	| CitationWebSearchResultLocationParam
	| CitationSearchResultLocationParam

// ============================================================================
// Image Source Types
// ============================================================================

export type Base64ImageSource = {
	type: 'base64'
	media_type: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'
	data: string
}

export type URLImageSource = {
	type: 'url'
	url: string
}

export type ImageSource = Base64ImageSource | URLImageSource

// ============================================================================
// Document Source Types
// ============================================================================

export type Base64PDFSource = {
	type: 'base64'
	media_type: 'application/pdf'
	data: string
}

export type PlainTextSource = {
	type: 'text'
	media_type: 'text/plain'
	data: string
}

export type ContentBlockSource = {
	type: 'content'
	content: string | ContentBlockParam[]
}

export type URLPDFSource = {
	type: 'url'
	url: string
}

export type DocumentSource = Base64PDFSource | PlainTextSource | ContentBlockSource | URLPDFSource

// ============================================================================
// Content Block Param Types (for request)
// ============================================================================

export type TextBlockParam = {
	type: 'text'
	text: string
	cache_control?: CacheControlEphemeral
	citations?: TextCitationParam[]
}

export type ImageBlockParam = {
	type: 'image'
	source: ImageSource
	cache_control?: CacheControlEphemeral
}

export type CitationsConfigParam = {
	enabled?: boolean
}

export type DocumentBlockParam = {
	type: 'document'
	source: DocumentSource
	cache_control?: CacheControlEphemeral
	citations?: CitationsConfigParam
	context?: string
	title?: string
}

export type SearchResultBlockParam = {
	type: 'search_result'
	content: TextBlockParam[]
	source: string
	title: string
	cache_control?: CacheControlEphemeral
	citations?: CitationsConfigParam
}

export type ThinkingBlockParam = {
	type: 'thinking'
	thinking: string
	signature: string
}

export type RedactedThinkingBlockParam = {
	type: 'redacted_thinking'
	data: string
}

export type ToolUseBlockParam = {
	type: 'tool_use'
	id: string
	name: string
	input: Record<string, unknown>
	cache_control?: CacheControlEphemeral
}

export type ToolResultBlockParam = {
	type: 'tool_result'
	tool_use_id: string
	content?: string | (TextBlockParam | ImageBlockParam | SearchResultBlockParam | DocumentBlockParam)[]
	is_error?: boolean
	cache_control?: CacheControlEphemeral
}

export type ServerToolUseBlockParam = {
	type: 'server_tool_use'
	id: string
	name: 'web_search'
	input: Record<string, unknown>
	cache_control?: CacheControlEphemeral
}

export type WebSearchResultBlockParam = {
	type: 'web_search_result'
	encrypted_content: string
	title: string
	url: string
	page_age?: string
}

export type WebSearchToolResultError = {
	type: 'web_search_tool_result_error'
	error_code: 'invalid_tool_input' | 'unavailable' | 'max_uses_exceeded' | 'too_many_requests' | 'query_too_long'
}

export type WebSearchToolResultBlockParam = {
	type: 'web_search_tool_result'
	tool_use_id: string
	content: WebSearchResultBlockParam[] | WebSearchToolResultError
	cache_control?: CacheControlEphemeral
}

export type ContentBlockParam =
	| TextBlockParam
	| ImageBlockParam
	| DocumentBlockParam
	| SearchResultBlockParam
	| ThinkingBlockParam
	| RedactedThinkingBlockParam
	| ToolUseBlockParam
	| ToolResultBlockParam
	| ServerToolUseBlockParam
	| WebSearchToolResultBlockParam

// ============================================================================
// Message Types
// ============================================================================

export type MessageParam = {
	role: 'user' | 'assistant'
	content: string | ContentBlockParam[]
}

// ============================================================================
// Tool Types
// ============================================================================

export type ToolInputSchema = {
	type: 'object'
	properties?: Record<string, unknown>
	required?: string[]
}

export type Tool = {
	name: string
	input_schema: ToolInputSchema
	description?: string
	cache_control?: CacheControlEphemeral
	type?: 'custom'
}

export type ToolBash20250124 = {
	type: 'bash_20250124'
	name: 'bash'
	cache_control?: CacheControlEphemeral
}

export type ToolTextEditor20250124 = {
	type: 'text_editor_20250124'
	name: 'str_replace_editor'
	cache_control?: CacheControlEphemeral
}

export type ToolTextEditor20250429 = {
	type: 'text_editor_20250429'
	name: 'str_replace_based_edit_tool'
	cache_control?: CacheControlEphemeral
}

export type ToolTextEditor20250728 = {
	type: 'text_editor_20250728'
	name: 'str_replace_based_edit_tool'
	cache_control?: CacheControlEphemeral
	max_characters?: number
}

export type WebSearchToolUserLocation = {
	type: 'approximate'
	city?: string
	country?: string
	region?: string
	timezone?: string
}

export type WebSearchTool20250305 = {
	type: 'web_search_20250305'
	name: 'web_search'
	allowed_domains?: string[]
	blocked_domains?: string[]
	cache_control?: CacheControlEphemeral
	max_uses?: number
	user_location?: WebSearchToolUserLocation
}

export type ToolUnion =
	| Tool
	| ToolBash20250124
	| ToolTextEditor20250124
	| ToolTextEditor20250429
	| ToolTextEditor20250728
	| WebSearchTool20250305

// ============================================================================
// Tool Choice Types
// ============================================================================

export type ToolChoiceAuto = {
	type: 'auto'
	disable_parallel_tool_use?: boolean
}

export type ToolChoiceAny = {
	type: 'any'
	disable_parallel_tool_use?: boolean
}

export type ToolChoiceTool = {
	type: 'tool'
	name: string
	disable_parallel_tool_use?: boolean
}

export type ToolChoiceNone = {
	type: 'none'
}

export type ToolChoice = ToolChoiceAuto | ToolChoiceAny | ToolChoiceTool | ToolChoiceNone

// ============================================================================
// Thinking Config Types
// ============================================================================

export type ThinkingConfigEnabled = {
	type: 'enabled'
	budget_tokens: number
}

export type ThinkingConfigDisabled = {
	type: 'disabled'
}

export type ThinkingConfigParam = ThinkingConfigEnabled | ThinkingConfigDisabled

// ============================================================================
// Metadata Types
// ============================================================================

export type Metadata = {
	user_id?: string
}

// ============================================================================
// Request Types
// ============================================================================

export type MessagesRequest = {
	model?: Model
	messages: MessageParam[]
	max_tokens: number
	metadata?: Metadata
	service_tier?: 'auto' | 'standard_only'
	stop_sequences?: string[]
	stream?: boolean
	system?: string | TextBlockParam[]
	temperature?: number
	thinking?: ThinkingConfigParam
	tool_choice?: ToolChoice
	tools?: ToolUnion[]
	top_k?: number
	top_p?: number
}

// ============================================================================
// Response Content Block Types
// ============================================================================

export type CitationCharLocation = {
	type: 'char_location'
	cited_text: string
	document_index: number
	document_title: string
	file_id: string
	start_char_index: number
	end_char_index: number
}

export type CitationPageLocation = {
	type: 'page_location'
	cited_text: string
	document_index: number
	document_title: string
	file_id: string
	start_page_number: number
	end_page_number: number
}

export type CitationContentBlockLocation = {
	type: 'content_block_location'
	cited_text: string
	document_index: number
	document_title: string
	file_id: string
	start_block_index: number
	end_block_index: number
}

export type CitationsWebSearchResultLocation = {
	type: 'web_search_result_location'
	cited_text: string
	encrypted_index: string
	title: string
	url: string
}

export type CitationsSearchResultLocation = {
	type: 'search_result_location'
	cited_text: string
	search_result_index: number
	source: string
	title: string
	start_block_index: number
	end_block_index: number
}

export type TextCitation =
	| CitationCharLocation
	| CitationPageLocation
	| CitationContentBlockLocation
	| CitationsWebSearchResultLocation
	| CitationsSearchResultLocation

export type TextBlock = {
	type: 'text'
	text: string
	citations: TextCitation[]
}

export type ThinkingBlock = {
	type: 'thinking'
	thinking: string
	signature: string
}

export type RedactedThinkingBlock = {
	type: 'redacted_thinking'
	data: string
}

export type ToolUseBlock = {
	type: 'tool_use'
	id: string
	name: string
	input: Record<string, unknown>
}

export type ServerToolUseBlock = {
	type: 'server_tool_use'
	id: string
	name: 'web_search'
	input: Record<string, unknown>
}

export type WebSearchResultBlock = {
	type: 'web_search_result'
	encrypted_content: string
	page_age: string
	title: string
	url: string
}

export type WebSearchToolResultBlock = {
	type: 'web_search_tool_result'
	tool_use_id: string
	content: WebSearchToolResultError | WebSearchResultBlock[]
}

export type ContentBlock =
	| TextBlock
	| ThinkingBlock
	| RedactedThinkingBlock
	| ToolUseBlock
	| ServerToolUseBlock
	| WebSearchToolResultBlock

// ============================================================================
// Usage Types
// ============================================================================

export type CacheCreation = {
	ephemeral_5m_input_tokens: number
	ephemeral_1h_input_tokens: number
}

export type ServerToolUsage = {
	web_search_requests: number
}

export type Usage = {
	input_tokens: number
	output_tokens: number
	cache_creation_input_tokens: number
	cache_read_input_tokens: number
	cache_creation: CacheCreation
	server_tool_use: ServerToolUsage
	service_tier: 'standard' | 'priority' | 'batch'
}

// ============================================================================
// Response Types
// ============================================================================

export type StopReason = 'end_turn' | 'max_tokens' | 'stop_sequence' | 'tool_use' | 'pause_turn' | 'refusal'

export type MessagesResponse = {
	id: string
	type: 'message'
	role: 'assistant'
	model: Model
	content: ContentBlock[]
	stop_reason: StopReason
	stop_sequence: string | null
	usage: Usage
}

// ============================================================================
// Error Types
// ============================================================================

export type ApiError = {
	type: 'error'
	error: {
		type: string
		message: string
	}
}

// ============================================================================
// API Client
// ============================================================================

export type SendMessageOptions = {
	api_key: string
	model?: Model
	messages: MessageParam[]
	max_tokens: number
	metadata?: Metadata
	service_tier?: 'auto' | 'standard_only'
	stop_sequences?: string[]
	system?: string | TextBlockParam[]
	temperature?: number
	thinking?: ThinkingConfigParam
	tool_choice?: ToolChoice
	tools?: ToolUnion[]
	top_k?: number
	top_p?: number
}

export const send_message = async ({ api_key, model = DEFAULT_MODEL, ...rest }: SendMessageOptions): Promise<MessagesResponse> => {
	const response = await fetch(API_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'anthropic-version': API_VERSION,
			'x-api-key': api_key,
		},
		body: JSON.stringify({ model, ...rest, stream: false }),
	})

	const data = await response.json()

	if (!response.ok) {
		throw new Error(`Claude API error: ${(data as ApiError).error?.message ?? response.statusText}`)
	}

	return data as MessagesResponse
}

export const extract_text = (response: MessagesResponse): string =>
	response.content
		.filter((block): block is TextBlock => block.type === 'text')
		.map(block => block.text)
		.join('')
