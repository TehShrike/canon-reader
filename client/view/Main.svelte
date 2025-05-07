<svelte:head>
	<title>Canon Reader</title>
</svelte:head>

<uiView></uiView>

<div class="footer">
	<StateLink state="main">Home</StateLink>
</div>

{#if showReferenceSearch}
<ClickWatcher
	on:clickExternal={onClickOutsideSearch}
>
	<div class="search-container" style={searchContainerStyle}>
		<ReferenceSearch
			bind:show={showReferenceSearch}
			{mediator}
			{currentBookId}
			autofocus={true}
		/>
	</div>
</ClickWatcher>
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

.container {
	padding-left: var(--default-padding);
	padding-right: var(--default-padding);
}
</style>

<script lang="ts">
import ReferenceSearch from 'component/ReferenceSearch.svelte'
import StateLink from 'component/StateLink.svelte'
import ClickWatcher from 'svelte-panel-click'

interface Position {
	top: string
	left: string
}

interface MainState {
	showReferenceSearch: boolean
	currentBookId?: string
	manualPosition?: Position
}

let state: MainState = {
	showReferenceSearch: false
}

let removeProviders: () => void

$effect(() => {
	const provideSync = mediator.provideSync

	const providerRemovers = [
		provideSync('position search box', (position: Position) => {
			console.log('position search box called with', position)
			state.manualPosition = position
		}),
		provideSync('unposition search box', () => {
			state.manualPosition = null
		}),
		provideSync('show navigation input', (currentBookId: string) => {
			state.showReferenceSearch = true
			state.currentBookId = currentBookId
		})
	]

	removeProviders = () => providerRemovers.forEach(remove => remove())

	return () => {
		removeProviders()
	}
})

$derived.searchContainerStyle = state.manualPosition
	? `
		position: absolute;
		top: ${state.manualPosition.top};
		left: ${state.manualPosition.left};
	`
	: ''

function onClickOutsideSearch() {
	state.showReferenceSearch = false
}
</script>
