<script lang="ts">
import ReferenceSearch from '#component/ReferenceSearch.svelte'
import StateLink from '#component/StateLink.svelte'
import ClickOutside from '#lib/ClickOutside.svelte'
import type { TypedMediator } from '#lib/mediator_instance.ts'

interface Props {
	mediator: TypedMediator
}

let { mediator }: Props = $props()

let show_reference_search = $state(false)
let current_book_id = $state<string | undefined>(undefined)

$effect(() => {
	return mediator.provide('show_navigation_input', (book_id: string | null) => {
		show_reference_search = true
		current_book_id = book_id ?? undefined
	})
})

function on_click_outside_search() {
	show_reference_search = false
}
</script>

<svelte:head>
	<title>Canon Reader</title>
</svelte:head>

<uiView></uiView>

<div class="footer">
	<StateLink state="main">Home</StateLink>
</div>

{#if show_reference_search}
<ClickOutside onclickoutside={on_click_outside_search}>
	<div class="search_container">
		<ReferenceSearch
			bind:show={show_reference_search}
			{mediator}
			{current_book_id}
			autofocus={true}
		/>
	</div>
</ClickOutside>
{/if}

<style>
.search_container {
	position: fixed;
	bottom: 96px;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	z-index: 2;
}

.footer {
	display: flex;
	padding-top: 8px;
	padding-bottom: 8px;
	padding-left: var(--default-padding);
	padding-right: var(--default-padding);
}
</style>
