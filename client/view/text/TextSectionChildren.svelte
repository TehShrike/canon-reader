{#each children as chunk}
	{#if chunk.type === 'chapter number'}
		<LeftMarginNumber
			number={chunk.value}
			emphasized={true}
			id={getChapterNumberId(chunk.value)}
		/>
	{:elseif chunk.type === 'verse number'}
		<LeftMarginNumber
			number={chunk.value}
			id={getChapterVerseId(chunk.chapterNumber, chunk.value)}
		/>
	{:elseif chunk.type === 'line break'}
		<br>
	{:else}
		<span
			class="verse-text"
			data-chapter-number={chunk.chapterNumber}
			data-verse-number={chunk.verseNumber}
			data-highlighted={isHighlighted(chunk.chapterNumber, chunk.verseNumber)}
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

<script lang="ts">
import { getChapterNumberId, getChapterVerseId } from 'lib/get-id.js'
import withinRange from 'multi-part-range-compare'
import LeftMarginNumber from './LeftMarginNumber.svelte'

interface TextChunk {
	type: 'chapter number' | 'verse number' | 'line break' | 'text'
	value: string
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
	highlightedRange?: HighlightedRange
}

let { children, highlightedRange } = $props<Props>()

$derived.comparableRange = highlightedRange
	? {
		start: [highlightedRange.startChapter, highlightedRange.startVerse],
		end: [highlightedRange.endChapter, highlightedRange.endVerse]
	}
	: null

$derived.isHighlighted = comparableRange
	? (chapter: number, verse: number) => withinRange(comparableRange.start, comparableRange.end, [chapter, verse])
	: () => false
</script>
