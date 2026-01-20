<div class="background-border">
	<ReferenceSearchInput
		onsubmit={handleSubmit}
		onescape={cancel}
		bind:value={inputValue}
		{autofocus}
	/>
</div>

<style>
.background-border {
	padding: 16px;
	background-color: var(--gray);
	border-radius: 8px;
}
</style>

<script lang="ts">
import svelteQuerystringRouter from 'svelte-querystring-router'
const { navigate } = svelteQuerystringRouter

import ReferenceSearchInput from './ReferenceSearchInput.svelte'
import getTargetStateFromReference from '#lib/get-target-state-from-reference.ts'

interface Reference {
	anchor?: string
	stateName: string
	params: {
		book: string
		highlight?: string
	}
}

interface Props {
	mediator: any
	currentBookId?: string | undefined
	show?: boolean
	autofocus?: boolean
}

let { mediator, currentBookId, show = $bindable(false), autofocus = false }: Props = $props()
let inputValue = $state('')
let lastState: string | null = null
let lastParams: Reference['params'] | null = null
let lastAnchor: string | null = null
let haveNavigated = false

const matchingReference = $derived(getTargetStateFromReference(inputValue, currentBookId))

function navigationState() {
	if (!matchingReference) return

	const { anchor, stateName, params } = matchingReference

	const sameState = lastState === stateName
		&& lastParams?.book === params.book

	if (!sameState) {
		if (anchor) {
			mediator.call('setAnchorAfterStateTransition', stateName, params, anchor)
		}

		mediator.call('stateGo', stateName, params, {
			replace: haveNavigated
		})

		haveNavigated = true
	} else {
		const updateQuerystring = params.highlight !== lastParams?.highlight
		const updateAnchor = anchor
			&& anchor !== lastAnchor
			&& document.getElementById(anchor)

		if (updateQuerystring || updateAnchor) {
			if (updateQuerystring) {
				navigate({
					parameters: {
						highlight: params.highlight
					},
					replace: haveNavigated
				})
			}

			if (updateAnchor) {
				window.history.replaceState({}, '', `#${anchor}`)
				const element = document.getElementById(anchor)
				element?.scrollIntoView(true)
			}

			haveNavigated = true
		}
	}

	lastState = stateName
	lastParams = params
	lastAnchor = anchor
}

$effect(() => {
	if (matchingReference) {
		navigationState()
	}
})

function cancel() {
	const hadNavigated = haveNavigated
	show = false
	haveNavigated = false

	if (hadNavigated) {
		window.history.back()
	}
}

function handleSubmit() {
	show = false
}
</script>
