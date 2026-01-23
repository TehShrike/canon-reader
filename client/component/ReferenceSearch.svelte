<script lang="ts">
import ReferenceSearchInput from './ReferenceSearchInput.svelte'
import getTargetStateFromReference from '#lib/get-target-state-from-reference.ts'
import type { TypedMediator } from '#lib/mediator-instance.ts'

interface Props {
	mediator: TypedMediator
	currentBookId?: string | undefined
	show?: boolean
	autofocus?: boolean
}

let { mediator, currentBookId, show = $bindable(false), autofocus = false }: Props = $props()
let inputValue = $state('')

const matchingReference = $derived(getTargetStateFromReference(inputValue, currentBookId))

function cancel() {
	show = false
}

function handleSubmit() {
	if (matchingReference) {
		const { anchor, stateName, params } = matchingReference

		if (anchor) {
			mediator.call('setAnchorAfterStateTransition', stateName, params, anchor)
		}

		mediator.call('stateGo', stateName, params)
	}

	show = false
}
</script>

<div class="background-border">
	<ReferenceSearchInput
		onSubmit={handleSubmit}
		onEscape={cancel}
		bind:value={inputValue}
		{autofocus}
	/>
	<div class="reference-feedback">{matchingReference?.displayText ?? ''}&nbsp;</div>
</div>

<style>
.background-border {
	padding: 16px;
	background-color: var(--gray);
	border-radius: 8px;
}

.reference-feedback {
	margin-top: 8px;
	color: var(--white);
	font-family: var(--sans-serif);
	font-size: 18px;
}
</style>
