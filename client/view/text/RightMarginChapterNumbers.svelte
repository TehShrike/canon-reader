<script lang="ts">
import { get_chapter_number_id } from '#lib/get_id.ts'

const max_number_of_chapter_to_display = 15

interface Props {
	chapterNumbers: number[]
	currentChapter: number | null
}

let { chapterNumbers, currentChapter }: Props = $props()

const chapter_count = $derived(chapterNumbers.length)
const chapter_modulus_to_use = $derived(Math.ceil(chapter_count / max_number_of_chapter_to_display))
const chapter_numbers_to_display = $derived(chapterNumbers.filter(number =>
	(number - 1) % chapter_modulus_to_use === 0
))
const display_chapter_matches_current = $derived((display_chapter: number) => currentChapter
	&& currentChapter >= display_chapter
	&& currentChapter < (display_chapter + chapter_modulus_to_use))
</script>

<ol>
	{#each chapter_numbers_to_display as number}
		<li>
			{#if display_chapter_matches_current(number) && currentChapter !== null}
				<a href="#{get_chapter_number_id(currentChapter)}">
					<strong>{currentChapter}</strong>
				</a>
			{:else}
				<a href="#{get_chapter_number_id(number)}">
					{number}
				</a>
			{/if}
		</li>
	{/each}
</ol>

<style>
ol {
	list-style: none;
	position: fixed;
	z-index: 1;
	height: 100vh;
	width: 32px;
	margin: 0;
	padding: 0;
	top: 0;
	right: 0;
	display: flex;
	flex-direction: column;
	justify-content: space-evenly;
	align-items: center;
}

li {
	flex-basis: 16px;
	flex-grow: 1;
	width: 100%;
	height: 16px;
	padding: 0;
}

a {
	width: 100%;
	height: 100%;
	font-size: 16px;
	font-family: var(--sans-serif);
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>
