<script lang="ts">
import { get_chapter_number_id, get_chapter_verse_id } from '#lib/get_id.ts'
import withinRange from 'multi-part-range-compare'
import LeftMarginNumber from './LeftMarginNumber.svelte'

interface TextChunk {
	type: 'chapter number' | 'verse number' | 'line break' | 'text'
	value: string | number
	chapterNumber?: number
	verseNumber?: number
}

interface HighlightedRange {
	startChapter: number
	startVerse: number
	endChapter: number
	endVerse: number
}

interface Props {
	children: TextChunk[]
	highlightedRange?: HighlightedRange | undefined
}

let { children, highlightedRange }: Props = $props()

const comparableRange = $derived(highlightedRange
	? {
		start: [highlightedRange.startChapter, highlightedRange.startVerse],
		end: [highlightedRange.endChapter, highlightedRange.endVerse]
	}
	: null)

const isHighlighted = $derived(comparableRange
	? (chapter: number, verse: number) => withinRange(comparableRange.start, comparableRange.end, [chapter, verse])
	: () => false)
</script>

{#each children as chunk}
	{#if chunk.type === 'chapter number'}
		<LeftMarginNumber
			number={Number(chunk.value)}
			emphasized={true}
			id={get_chapter_number_id(Number(chunk.value))}
		/>
	{:else if chunk.type === 'verse number'}
		<LeftMarginNumber
			number={Number(chunk.value)}
			id={get_chapter_verse_id(chunk.chapterNumber ?? 0, Number(chunk.value))}
		/>
	{:else if chunk.type === 'line break'}
		<br>
	{:else}
		<span
			class="verse_text"
			data-chapter-number={chunk.chapterNumber}
			data-verse-number={chunk.verseNumber}
			data-highlighted={isHighlighted(chunk.chapterNumber ?? 0, chunk.verseNumber ?? 0)}
		>
			{chunk.value}
		</span>
	{/if}
{/each}

<style>
[data-highlighted=true] {
	background-color: var(--background-yellow);
}
</style>
