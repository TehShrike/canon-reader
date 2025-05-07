<div bind:this={container} class="wat">
	<ReferenceSearchInput />
</div>

<style>
.wat {
	visibility: hidden;
}
</style>

<script lang="ts">
import ReferenceSearchInput from './ReferenceSearchInput.svelte'

interface Props {
	mediator: unknown
}

let { mediator } = $props<Props>()
let container: HTMLElement

$effect(() => {
	const { top, left, right, bottom } = container.getBoundingClientRect()

	mediator.callSync('position search box', {
		top,
		left,
		right,
		bottom,
	})

	return () => {
		mediator.callSync('unposition search box')
	}
})
</script>
