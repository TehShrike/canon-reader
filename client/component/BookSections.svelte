<script lang="ts">
import TextSectionChildren from './TextSectionChildren.svelte'
import type { BookSection, HighlightedRange } from '#lib/book_types.ts'

interface Props {
	book_sections: BookSection[]
	highlighted_range?: HighlightedRange | undefined
}

let { book_sections, highlighted_range }: Props = $props()
</script>

{#each book_sections as section}
	{#if section.type === 'header'}
		<h3>{section.value}</h3>
	{:else if section.type === 'break'}
		<hr>
	{:else if section.type === 'paragraph'}
		<p>
			<TextSectionChildren children={section.children ?? []} {highlighted_range} />
		</p>
	{:else if section.type === 'stanza'}
		<blockquote>
			<TextSectionChildren children={section.children ?? []} {highlighted_range} />
		</blockquote>
	{:else}
		<h1>WAT BROKEN</h1>
	{/if}
{/each}
