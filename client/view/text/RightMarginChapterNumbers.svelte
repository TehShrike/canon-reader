<ol>
	{#each chapterNumbersToDisplay as number}
		<li>
			{#if displayChapterMatchesCurrent(number)}
				<a href="#{getChapterNumberId(currentChapter)}">
					<strong>{currentChapter}</strong>
				</a>
			{:else}
				<a href="#{getChapterNumberId(number)}">
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

<script lang="ts">
import { getChapterNumberId } from 'lib/get-id.js'

const maxNumberOfChapterToDisplay = 15

interface Props {
	chapterNumbers: number[]
	currentChapter: number | null
}

let { chapterNumbers, currentChapter }: Props = $props()

const chapterCount = $derived(chapterNumbers.length)
const chapterModulusToUse = $derived(Math.ceil(chapterCount / maxNumberOfChapterToDisplay))
const chapterNumbersToDisplay = $derived(chapterNumbers.filter(number =>
	(number - 1) % chapterModulusToUse === 0
))
const displayChapterMatchesCurrent = $derived((displayChapter: number) => currentChapter
	&& currentChapter >= displayChapter
	&& currentChapter < (displayChapter + chapterModulusToUse))
</script>
