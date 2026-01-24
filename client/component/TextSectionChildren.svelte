<script lang="ts">
import { get_chapter_number_id, get_chapter_verse_id } from '#lib/get_id.ts'
import withinRange from 'multi-part-range-compare'
import LeftMarginNumber from './LeftMarginNumber.svelte'
import type { SectionChildren, HighlightedRange } from '#lib/book_types.ts'

interface Props {
	children: readonly SectionChildren[]
	highlighted_range?: HighlightedRange | undefined
}

let { children, highlighted_range }: Props = $props()

const comparable_range = $derived(highlighted_range
	? {
		start: [highlighted_range.start_chapter, highlighted_range.start_verse],
		end: [highlighted_range.end_chapter, highlighted_range.end_verse]
	}
	: null)

const is_highlighted = $derived(comparable_range
	? (chapter: number, verse: number) => withinRange(comparable_range.start, comparable_range.end, [chapter, verse])
	: () => false)
</script>

{#each children as chunk}
	{#if chunk.type === 'chapter number'}
		<LeftMarginNumber
			number={chunk.value}
			emphasized={true}
			id={get_chapter_number_id(chunk.value)}
		/>
	{:else if chunk.type === 'verse number'}
		<LeftMarginNumber
			number={chunk.value}
			id={get_chapter_verse_id(chunk.chapterNumber ?? 0, chunk.value)}
		/>
	{:else if chunk.type === 'line break'}
		<br>
	{:else}
		<span
			class="verse_text"
			data-chapter-number={chunk.chapterNumber}
			data-verse-number={chunk.verseNumber}
			data-highlighted={is_highlighted(chunk.chapterNumber ?? 0, chunk.verseNumber ?? 0)}
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
