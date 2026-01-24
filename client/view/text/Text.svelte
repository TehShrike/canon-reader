<script lang="ts">
import range from 'just-range'

import BookSections from '#component/BookSections.svelte'
import StickyFooter from '#component/StickyFooter.svelte'
import { querystring_params } from '#lib/querystring_store.svelte.ts'
import { from_range } from '#lib/simple_range.ts'
import RightMarginChapterNumbers from './RightMarginChapterNumbers.svelte'
import type { BookSection } from '#lib/book_types.ts'
import type { TypedMediator } from '#lib/mediator_instance.ts'

interface Props {
	mediator: TypedMediator
	book_id: string
	book_name: string
	book_sections: BookSection[]
	chapter_count: number
}

let { mediator, book_id, book_name, book_sections, chapter_count }: Props = $props()

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

const chapter_numbers = $derived(chapter_count ? range(1, chapter_count + 1) : [])
const highlighted_range = $derived(querystring_params.params.highlight
	? from_range(querystring_params.params.highlight)
	: undefined)
</script>

<svelte:head>
	<title>{book_name}</title>
</svelte:head>

<div class="container">
	<h1 class="book_name_header">
		{book_name}
	</h1>

	<div class="text_container" bind:this={text_container}>
		<BookSections {book_sections} {highlighted_range} />
	</div>
</div>

<RightMarginChapterNumbers {chapter_numbers} {current_chapter} />

<StickyFooter {mediator} current_book_id={book_id} />

<style>
.book_name_header {
	text-align: center;
}

.container {
	padding-left: var(--default-padding);
	padding-right: var(--default-padding);
	padding-top: var(--default-padding);
	padding-bottom: var(--default-padding);
}

.text_container {
	max-width: 600px;
	margin-left: var(--gutter-size);
	margin-right: var(--gutter-size);
}
</style>
