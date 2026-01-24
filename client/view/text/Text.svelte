<script lang="ts">
import range from 'just-range'

import StateLink from '#component/StateLink.svelte'
import { querystring_params } from '#lib/querystring_store.svelte.ts'
import { get_chapter_number_id } from '#lib/get_id.ts'
import { from_range } from '#lib/simple_range.ts'
import TextSectionChildren from './TextSectionChildren.svelte'
import RightMarginChapterNumbers from './RightMarginChapterNumbers.svelte'

interface TextChunk {
	type: 'chapter number' | 'verse number' | 'line break' | 'text'
	value: string | number
	chapterNumber?: number
	verseNumber?: number
}

interface BookSection {
	type: 'header' | 'break' | 'paragraph' | 'stanza'
	value?: string
	children?: TextChunk[]
}

interface Props {
	bookName: string
	bookSections: BookSection[]
	chapterCount: number
}

let { bookName, bookSections, chapterCount }: Props = $props()

let current_chapter = $state<number | null>(null)
let text_container: HTMLElement
let viewport_top_observer: IntersectionObserver

function observe_intersections_with_top_of_viewport(elements: NodeListOf<Element>, cb: (entries: IntersectionObserverEntry[]) => void) {
	const observer = new IntersectionObserver(entries => {
		const intersecting_entries = entries.filter(entry => entry.isIntersecting)
		cb(intersecting_entries)
	}, {
		rootMargin: '0px 0px -95%',
		threshold: 0.1
	})

	Array.from(elements).forEach(element => observer.observe(element))

	return observer
}

$effect(() => {
	const text_elements = text_container?.querySelectorAll('.verse_text')
	if (text_elements) {
		viewport_top_observer = observe_intersections_with_top_of_viewport(text_elements, entries => {
			const chapter = entries.reduce((current, entry) => {
				const data = (entry.target as HTMLElement).dataset
				const entry_chapter = parseInt(data.chapterNumber || '0', 10)
				return Math.max(current, entry_chapter)
			}, 0)

			if (chapter) {
				current_chapter = chapter
			}
		})
	}

	return () => {
		viewport_top_observer?.disconnect()
	}
})

const chapter_numbers = $derived(chapterCount ? range(1, chapterCount + 1) : [])
const highlighted_range = $derived(querystring_params.params.highlight
	? from_range(querystring_params.params.highlight)
	: undefined)
</script>

<svelte:head>
	<title>{bookName}</title>
</svelte:head>

<div class="container">
	<h1 class="book_name_header">
		{bookName}
	</h1>

	<div class="text_container" bind:this={text_container}>
		{#each bookSections as section}
			{#if section.type === 'header'}
				<h3>{section.value}</h3>
			{:else if section.type === 'break'}
				<hr>
			{:else if section.type === 'paragraph'}
				<p>
					<TextSectionChildren children={section.children ?? []} highlightedRange={highlighted_range} />
				</p>
			{:else if section.type === 'stanza'}
				<blockquote>
					<TextSectionChildren children={section.children ?? []} highlightedRange={highlighted_range} />
				</blockquote>
			{:else}
				<h1>WAT BROKEN</h1>
			{/if}
		{/each}
	</div>
</div>

<RightMarginChapterNumbers chapterNumbers={chapter_numbers} currentChapter={current_chapter} />

<div class="sticky_footer">
	<div class="book_notch">
		<StateLink state="main.book-selection" className="bigger_link">Books</StateLink>
	</div>
</div>

<style>
.sticky_footer {
	position: fixed;
	left: 0;
	bottom: 0;
	right: 0;
	display: flex;
	justify-content: center;
}

.book_notch {
	background-color: var(--blue-darkened);
	display: flex;
	clip-path: polygon(0 100%, 25% 0, 75% 0, 100% 100%);
}

.book_notch :global(a) {
	padding: 4px 48px;
	color: var(--white);
}

.book_name_header {
	text-align: center;
}

.container {
	padding-left: var(--default-padding);
	padding-right: var(--default-padding);
	padding-top: var(--default-padding);
	padding-bottom: var(--default-padding);
}

:global(.bigger_link) {
	font-size: x-large;
	font-family: sans-serif;
}

.text_container {
	max-width: 600px;
	margin-left: var(--gutter-size);
	margin-right: var(--gutter-size);
}
</style>
