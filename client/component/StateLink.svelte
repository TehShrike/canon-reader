<script lang="ts">
import type { Snippet } from 'svelte'
import shouldInterceptClick from 'click-should-be-intercepted-for-navigation'
import mediator from '#lib/mediator_instance.ts'

interface Props {
	state: string
	params?: Record<string, string>
	inherit?: boolean
	className?: string
	anchor?: string
	children: Snippet
}

let { state, params = {}, inherit = false, className = '', anchor = '', children }: Props = $props()

const state_is_active = (state: string, params?: Record<string, unknown>) => mediator.call('state_is_active', state, params)
const make_path = (state: string, params?: Record<string, unknown>, options?: { inherit?: boolean }) => mediator.call('make_path', state, params, options)

function current_path() {
	return window.location.pathname + window.location.search
}

const hash_fragment = $derived(anchor ? `#${anchor}` : '')
const path = $derived(make_path(state, params, { inherit }))
const href = $derived(path + hash_fragment)

let cancel_listener: () => void

$effect(() => {
	cancel_listener = mediator.call('on_state_change_end', () => {
		// Force reactivity update
		state_is_active(state, params)
	})

	return () => {
		cancel_listener()
	}
})

function navigate(event: MouseEvent) {
	if (shouldInterceptClick(event)) {
		event.preventDefault()

		if (path !== current_path()) {
			mediator.call('go_with_hash_fragment', state, params, { inherit }, anchor)
		} else {
			window.location.href = hash_fragment
		}
	}
}
</script>

<a
	href={href}
	data-active={state_is_active(state, params)}
	onclick={navigate}
	class={className}
>
	{@render children()}
</a>
