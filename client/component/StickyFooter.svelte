<script lang="ts">
import StateLink from './StateLink.svelte'
import type { TypedMediator } from '#lib/mediator_instance.ts'

interface Props {
	mediator: TypedMediator
	current_book_id?: string | undefined
}

let { mediator, current_book_id }: Props = $props()

function show_search() {
	mediator.call('show_navigation_input', current_book_id ?? null)
}
</script>

<div class="sticky_footer">
	<div class="notch left">
		<button type="button" onclick={show_search} class="notch_button" aria-label="Search">
			<span class="search_icon">🔍</span>
		</button>
	</div>
	<div class="notch right">
		<StateLink state="main.book-selection" class_name="notch_link" aria_label="Books">📚</StateLink>
	</div>
</div>

<style>
.sticky_footer {
	position: fixed;
	left: 0;
	bottom: 0;
	right: 0;
	display: flex;
	justify-content: space-evenly;
	pointer-events: none;
}

.notch {
	pointer-events: auto;
	background-color: var(--blue-darkened);
	display: flex;
	clip-path: polygon(0 100%, 25% 0, 75% 0, 100% 100%);
}

.notch_button {
	background: none;
	border: none;
	padding: 4px 48px;
	color: var(--white);
	font-size: x-large;
	font-family: sans-serif;
	cursor: pointer;
}

.notch_button:hover {
	opacity: 0.9;
}

.search_icon {
	font-size: x-large;
}

.notch :global(.notch_link) {
	padding: 4px 48px;
	color: var(--white);
	font-size: x-large;
	font-family: sans-serif;
}
</style>
