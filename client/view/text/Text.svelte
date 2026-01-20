<svelte:head>
	<title>{bookName}</title>
</svelte:head>

<div class="container">
	<h1 class="book-name-header">
		{bookName}
	</h1>

	<div class="text-container" bind:this={textContainer}>
		{#each bookSections as section}
			{#if section.type === 'header'}
				<h3>{section.value}</h3>
			{:else if section.type === 'break'}
				<hr>
			{:else if section.type === 'paragraph'}
				<p>
					<TextSectionChildren children={section.children ?? []} {highlightedRange} />
				</p>
			{:else if section.type === 'stanza'}
				<blockquote>
					<TextSectionChildren children={section.children ?? []} {highlightedRange} />
				</blockquote>
			{:else}
				<h1>WAT BROKEN</h1>
			{/if}
		{/each}
	</div>
</div>

<RightMarginChapterNumbers {chapterNumbers} {currentChapter} />

<div class="sticky-footer">
	<div class="book-notch">
		<StateLink state="main.book-selection" className="bigger-link">Books</StateLink>
	</div>
</div>

<style>
.sticky-footer {
	position: fixed;
	left: 0;
	bottom: 0;
	right: 0;
	display: flex;
	justify-content: center;
}

.book-notch {
	background-color: var(--blue-darkened);
	display: flex;
	clip-path: polygon(0 100%, 25% 0, 75% 0, 100% 100%);
}

.book-notch :global(a) {
	padding: 4px 48px;
	color: var(--white);
}

.book-name-header {
	text-align: center;
}

.container {
	padding-left: var(--default-padding);
	padding-right: var(--default-padding);
	padding-top: var(--default-padding);
	padding-bottom: var(--default-padding);
}

:global(.bigger-link) {
	font-size: x-large;
	font-family: sans-serif;
}

.text-container {
	max-width: 600px;
	margin-left: var(--gutter-size);
	margin-right: var(--gutter-size);
}
</style>

<script lang="ts">
import range from 'just-range'
import svelteQuerystringRouter from 'svelte-querystring-router'
const { attachQuerystringData, getCurrentParameters } = svelteQuerystringRouter

import StateLink from '#component/StateLink.svelte'
import { getChapterNumberId } from '#lib/get-id.ts'
import { fromRange } from '#lib/simple-range.ts'
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

let currentChapter = $state<number | null>(null)
let querystringParameters = $state<Record<string, string>>(getCurrentParameters())
let textContainer: HTMLElement
let viewportTopObserver: IntersectionObserver

function observeIntersectionsWithTopOfViewport(elements: NodeListOf<Element>, cb: (entries: IntersectionObserverEntry[]) => void) {
	const observer = new IntersectionObserver(entries => {
		const intersectingEntries = entries.filter(entry => entry.isIntersecting)
		cb(intersectingEntries)
	}, {
		rootMargin: '0px 0px -95%',
		threshold: 0.1
	})

	Array.from(elements).forEach(element => observer.observe(element))

	return observer
}

$effect(() => {
	const state = { querystringParameters }
	attachQuerystringData(state)
	querystringParameters = state.querystringParameters

	const textElements = textContainer?.querySelectorAll('.verse-text')
	if (textElements) {
		viewportTopObserver = observeIntersectionsWithTopOfViewport(textElements, entries => {
			const chapter = entries.reduce((current, entry) => {
				const data = (entry.target as HTMLElement).dataset
				const entryChapter = parseInt(data.chapterNumber || '0', 10)
				return Math.max(current, entryChapter)
			}, 0)

			if (chapter) {
				currentChapter = chapter
			}
		})
	}

	return () => {
		viewportTopObserver?.disconnect()
	}
})

const chapterNumbers = $derived(chapterCount ? range(1, chapterCount + 1) : [])
const highlightedRange = $derived(querystringParameters.highlight
	? fromRange(querystringParameters.highlight)
	: undefined)
</script>
