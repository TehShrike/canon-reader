<script lang="ts">
import ReferenceSearchInput from './ReferenceSearchInput.svelte'
import type { TypedMediator } from '#lib/mediator_instance.ts'

interface Props {
	mediator: TypedMediator
}

let { mediator }: Props = $props()
let container: HTMLElement

$effect(() => {
	const { top, left, right, bottom } = container.getBoundingClientRect()

	mediator.call('position_search_box', {
		top,
		left,
		right,
		bottom,
	})

	return () => {
		mediator.call('unposition_search_box')
	}
})
</script>

<div bind:this={container} class="wat">
	<ReferenceSearchInput />
</div>

<style>
.wat {
	visibility: hidden;
}
</style>
