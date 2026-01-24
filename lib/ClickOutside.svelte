<script lang="ts">
import type { Snippet } from 'svelte'

interface Props {
	children: Snippet
	onclickoutside: () => void
}

let { children, onclickoutside }: Props = $props()

let container: HTMLDivElement

function handleClick(event: MouseEvent) {
	if (container && !container.contains(event.target as Node)) {
		onclickoutside()
	}
}

$effect(() => {
	document.addEventListener('click', handleClick, true)

	return () => {
		document.removeEventListener('click', handleClick, true)
	}
})
</script>

<div bind:this={container}>
	{@render children()}
</div>
