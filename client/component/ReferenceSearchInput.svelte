<script lang="ts">
const code_escape = 27
const isEscape = (event: KeyboardEvent) => event.key === 'Escape' || event.keyCode === code_escape

interface Props {
	autofocus?: boolean
	value?: string
	onsubmit?: () => void
	onescape?: () => void
}

let { autofocus, value = $bindable(''), onsubmit, onescape }: Props = $props()
let input: HTMLInputElement

$effect(() => {
	if (autofocus) {
		input?.focus()
	}
})

$effect(() => {
	console.log('Inside the input, the value is', value)
})

function handleKeydown(event: KeyboardEvent) {
	if (isEscape(event)) {
		onescape?.()
	}
}

function handleSubmit(event: Event) {
	event.preventDefault()
	onsubmit?.()
}
</script>

<form onsubmit={handleSubmit}>
	<input
		type="text"
		bind:this={input}
		bind:value
		onkeydown={handleKeydown}
		placeholder="prov 30:2"
	>
</form>

<!--

- color the border green if the input can go somewhere valid
- expect:
	- current book, if any
- display:
	- currently inferred book name
	- currently understood chapter number
	- currently understood verse number

If it's feasible to validate chapter/verse numbers, then that validation
needs to be moved to a function in lib

Don't fire "submit" if the input isn't properly understood/green

-->

<style>
input {
	font-size: 32px;
	border-radius: 4px;
	padding: 4px 8px;
	max-width: calc(100% - 24px);
}
</style>
