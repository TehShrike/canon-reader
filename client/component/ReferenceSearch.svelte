<script lang="ts">
import ReferenceSearchInput from './ReferenceSearchInput.svelte'
import get_target_state_from_reference from '#lib/get_target_state_from_reference.ts'
import type { TypedMediator } from '#lib/mediator_instance.ts'

interface Props {
	mediator: TypedMediator
	current_book_id?: string | undefined
	show?: boolean
	autofocus?: boolean
}

let { mediator, current_book_id, show = $bindable(false), autofocus = false }: Props = $props()
let input_value = $state('')

const matching_reference = $derived(get_target_state_from_reference(input_value, current_book_id))

function cancel() {
	show = false
}

function handle_submit() {
	if (matching_reference) {
		const { anchor, params } = matching_reference

		if (anchor) {
			mediator.call('set_anchor_after_state_transition', 'main.text', params, anchor)
		}

		mediator.call('state_go', 'main.text', params)
	} else if (input_value.trim()) {
		mediator.call('state_go', 'main.verse-lookup', { q: input_value.trim() })
	}

	show = false
}
</script>

<div class="background_border">
	<ReferenceSearchInput
		on_submit={handle_submit}
		on_escape={cancel}
		bind:value={input_value}
		{autofocus}
	/>
	<div class="reference_feedback">{matching_reference?.display_text ?? ''}&nbsp;</div>
</div>

<style>
.background_border {
	padding: 16px;
	background-color: var(--gray);
	border-radius: 8px;
}

.reference_feedback {
	margin-top: 8px;
	color: var(--white);
	font-family: var(--sans-serif);
	font-size: 18px;
}
</style>
