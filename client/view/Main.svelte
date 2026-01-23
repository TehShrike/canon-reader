<script lang="ts">
import ReferenceSearch from '#component/ReferenceSearch.svelte'
import StateLink from '#component/StateLink.svelte'
import ClickOutside from '#lib/ClickOutside.svelte'
import type { TypedMediator } from '#lib/mediator-instance.ts'

interface Position {
	top: number
	left: number
	right: number
	bottom: number
}

interface Props {
	mediator: TypedMediator
}

let { mediator }: Props = $props()

let showReferenceSearch = $state(false)
let currentBookId = $state<string | undefined>(undefined)
let manualPosition = $state<Position | null>(null)

let removeProviders: () => void

$effect(() => {
	const provide = mediator.provide

	const providerRemovers = [
		provide('position search box', (position: Position) => {
			console.log('position search box called with', position)
			manualPosition = position
		}),
		provide('unposition search box', () => {
			manualPosition = null
		}),
		provide('show navigation input', (bookId: string | null) => {
			showReferenceSearch = true
			currentBookId = bookId ?? undefined
		})
	]

	removeProviders = () => providerRemovers.forEach(remove => remove())

	return () => {
		removeProviders()
	}
})

const searchContainerStyle = $derived(manualPosition
	? `
		position: absolute;
		top: ${manualPosition.top}px;
		left: ${manualPosition.left}px;
	`
	: '')

function onClickOutsideSearch() {
	showReferenceSearch = false
}
</script>

<svelte:head>
	<title>Canon Reader</title>
</svelte:head>

<uiView></uiView>

<div class="footer">
	<StateLink state="main">Home</StateLink>
</div>

{#if showReferenceSearch}
<ClickOutside onclickoutside={onClickOutsideSearch}>
	<div class="search-container" style={searchContainerStyle}>
		<ReferenceSearch
			bind:show={showReferenceSearch}
			{mediator}
			{currentBookId}
			autofocus={true}
		/>
	</div>
</ClickOutside>
{/if}

<style>
.search-container {
	position: fixed;
	bottom: 96px;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
}

.footer {
	display: flex;
	padding-top: 8px;
	padding-bottom: 8px;
	padding-left: var(--default-padding);
	padding-right: var(--default-padding);
}
</style>
