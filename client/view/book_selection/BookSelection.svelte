<script lang="ts">
import books from 'books-of-the-bible'
import book_colors from '#lib/book_of_the_bible_colors.ts'
import { get_book_id } from '#lib/get_id.ts'
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

const book_names = $derived(books.map(({ name, aliases }: Book) => {
	const use_first_alias_for_short = name.length > 5 && aliases[0]

	return {
		full: name,
		short: use_first_alias_for_short ? aliases[0] : name,
		id: get_book_id(name)
	}
}))

function get_book_color(id: string): string {
	return book_colors[id] ?? ''
}
</script>

<div class="book_names">
	{#each book_names as name}
		<div class="book" style="background-color: {get_book_color(name.id)}">
			<StateLink state="main.text" params={{ book: name.id }}>
				<div class="short_name">
					{name.short}
				</div>
				<div class="full_name">
					{name.full}
				</div>
			</StateLink>
		</div>
	{/each}
</div>

<style>
.book_names {
	margin: 4px;
	display: flex;
	flex-wrap: wrap;
	align-content: flex-start;
	font-family: sans-serif;
	border-top: 1px solid gray;
	border-left: 1px solid gray;
}

.book {
	height: 15vw;
	flex-basis: 25%;
	white-space: nowrap;
	box-sizing: border-box;
	border-bottom: 1px solid gray;
	border-right: 1px solid gray;
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

.short_name {
	display: none;
}

@media (max-width: 550px) {
	.short_name {
		display: inherit;
	}

	.full_name {
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
