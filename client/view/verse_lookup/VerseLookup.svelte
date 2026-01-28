<script lang="ts">
import StateLink from '#component/StateLink.svelte'
import BookSections from '#component/BookSections.svelte'
import StickyFooter from '#component/StickyFooter.svelte'
import type { TypedMediator } from '#lib/mediator_instance.ts'
import api_verse_lookup from './api_verse_lookup.ts'
import resolve_api_lookup_result_to_text from './resolve_api_lookup_result_to_text.ts'
import type { ResolvedResult } from './resolve_api_lookup_result_to_text.ts'

interface Props {
	mediator: TypedMediator
	query: string
}

let { mediator, query }: Props = $props()

const sort_results = (results: ResolvedResult[]) => {
	return results.sort((a, b) => {
		if (b.match_quality === a.match_quality) {
			return a.type === 'paraphrase' ? -1 : 1
		}

		return b.match_quality - a.match_quality
	})
}

const results = $derived(api_verse_lookup(query).then(resolve_api_lookup_result_to_text).then(sort_results))
</script>

<svelte:head>
	<title>Verse Lookup: {query}</title>
</svelte:head>

<div class="container">
	{#await results}
		<h1>Searching for "{query}"</h1>
	{:then}
		<h1>Results for "{query}"</h1>
	{/await}

	{#await results}
		<p class="loading">Clauding...</p>
	{:then results}
		{#if results.length === 0}
			<p>No results found.</p>
		{:else}
			{#each results as result}
				<article class="result">
					<header>
						{#if result.target_params}
							<h2>
								<StateLink
									state="main.text"
									params={result.target_params}
									anchor={result.target_anchor ?? ''}
								>
									{result.display_text}
								</StateLink>
							</h2>
						{:else}
							<h2>{result.reference}</h2>
						{/if}
						<div class="meta">
							<span class="match_quality">Match quality: {result.match_quality}/9</span>
							<span class="type">{result.type}</span>
						</div>
					</header>

					<div class="sections">
						<BookSections book_sections={result.sections} />
					</div>
				</article>
			{/each}
		{/if}
	{/await}
</div>

<StickyFooter {mediator} />

<style>
.container {
	padding: var(--default-padding);
	max-width: 800px;
	margin: 0 auto;
}

h1 {
	margin-bottom: 1.5rem;
}

.result {
	margin-bottom: 2rem;
	padding-bottom: 2rem;
	border-bottom: 1px solid var(--gray-light, #ddd);
}

.result:last-child {
	border-bottom: none;
}

.result header {
	margin-bottom: 1rem;
}

.result h2 {
	margin: 0 0 0.5rem 0;
	font-size: 1.25rem;
}

.result h2 :global(a) {
	color: var(--blue, #0066cc);
	text-decoration: none;
}

.result h2 :global(a:hover) {
	text-decoration: underline;
}

.meta {
	display: flex;
	gap: 1rem;
	font-size: 0.875rem;
	color: var(--gray, #666);
}

.match_quality {
	font-weight: 500;
}

.type {
	text-transform: capitalize;
}

.sections {
	margin-left: var(--gutter-size, 32px);
}

.loading {
	animation: loading_pulse 1s ease-in-out infinite;
}

@keyframes loading_pulse {
	0%, 100% {
		color: var(--black);
	}
	50% {
		color: var(--blue-lightened);
	}
}
</style>
