export type ChapterNumberChunk = {
	readonly type: 'chapter number'
	readonly value: number
}

export type VerseNumberChunk = {
	readonly type: 'verse number'
	readonly value: number
	readonly chapterNumber?: number
}

export type LineBreakChunk = {
	readonly type: 'line break'
}

export type TextContentChunk = {
	readonly type: 'text'
	readonly chapterNumber?: number
	readonly verseNumber?: number
	readonly value: string
}

export type SectionChildren = ChapterNumberChunk | VerseNumberChunk | LineBreakChunk | TextContentChunk

export type BookSection = {
	readonly type: 'header' | 'break' | 'paragraph' | 'stanza'
	readonly value?: string | undefined
	readonly children?: readonly SectionChildren[] | undefined
}

export type Book = readonly BookSection[]

export type HighlightedRange = {
	start_chapter: number
	start_verse: number
	end_chapter: number
	end_verse: number
}
