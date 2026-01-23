<script lang="ts">
import books from 'books-of-the-bible'
import bookColors from '#lib/book-of-the-bible-colors.ts'
import { getBookId } from '#lib/get-id.ts'
import StateLink from '#component/StateLink.svelte'

interface Book {
	name: string
	aliases: string[]
}

interface BookName {
	full: string
	short: string
	id: string
}

const bookNames = $derived(books.map(({ name, aliases }: Book) => {
	const useFirstAliasForShort = name.length > 5 && aliases[0]

	return {
		full: name,
		short: useFirstAliasForShort ? aliases[0] : name,
		id: getBookId(name)
	}
}))

function getBookColor(id: string): string {
	return bookColors[id] ?? ''
}
</script>

<div class="book-names">
	{#each bookNames as name}
		<div class="book" style="background-color: {getBookColor(name.id)}">
			<StateLink state="main.text" params={{ book: name.id }}>
				<div class="short-name">
					{name.short}
				</div>
				<div class="full-name">
					{name.full}
				</div>
			</StateLink>
		</div>
	{/each}
</div>

<style>
.book-names {
	padding: 4px;
	display: flex;
	flex-wrap: wrap;
	align-content: flex-start;
	font-family: sans-serif;
}

.book {
	height: 15vw;
	flex-basis: 25%;
	white-space: nowrap;
	outline: 1px solid grey;
}

.book :global(a) {
	width: 100%;
	height: 100%;
	color: var(--black);
	text-decoration-line: none;
	display: flex;
	align-items: center;
	justify-content: center;
}

.short-name {
	display: none;
}

@media (max-width: 550px) {
	.short-name {
		display: inherit;
	}

	.full-name {
		display: none;
	}
}

@media (min-width: 1000px) {
	.book {
		flex-basis: 20%;
		height: 20vh;
	}
}

@media (min-width: 1300px) {
	.book {
		flex-basis: 16.6%;
	}
}
</style>
