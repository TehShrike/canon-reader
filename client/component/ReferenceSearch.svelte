<script lang="ts">
import ReferenceSearchInput from './ReferenceSearchInput.svelte'
import get_target_state_from_reference from '#lib/get_target_state_from_reference.ts'
import type { TypedMediator } from '#lib/mediator_instance.ts'

interface Props {
	mediator: TypedMediator
	current_book_id?: string | undefined
	show?: boolean
	autofocus?: boolean
	placeholder?: string
}

let { mediator, current_book_id, show = $bindable(false), autofocus = false, placeholder = '' }: Props = $props()
let input_value = $state('')

const matching_reference = $derived(get_target_state_from_reference(input_value, current_book_id))

function cancel() {
	show = false
}

function handle_submit() {
	if (matching_reference) {
		const { anchor, params } = matching_reference

		if (params.book !== current_book_id) {
			if (anchor) {
				mediator.call('set_anchor_after_state_transition', 'main.text', params, anchor)
			}

			mediator.call('state_go', 'main.text', params)
		} else {
			window.location.replace(`#${ anchor }`)
		}
	} else if (input_value.trim()) {
		mediator.call('state_go', 'main.verse-lookup', { q: input_value.trim() })
	}

	show = false
}
</script>

<div class="background_border">
	<label>
		Search
		<ReferenceSearchInput
			on_submit={handle_submit}
			on_escape={cancel}
			bind:value={input_value}
			{autofocus}
			{placeholder}
		/>
	</label>
	<div class="reference_feedback">{matching_reference?.display_text ?? ''}&nbsp;</div>
</div>

<style>
.background_border {
	padding: 16px;
	background-color: var(--gray);
	border-radius: 8px;
	width: 60vw;
	max-width: 600px;
	text-align: left;
}


.reference_feedback {
	margin-top: 8px;
	color: var(--white);
	font-family: var(--sans-serif);
	font-size: 18px;
}

label {
	color: var(--white);
	font-family: var(--sans-serif);
}

</style>
