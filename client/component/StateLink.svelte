<a
	href={href}
	data-active={stateIsActive(state, params)}
	onclick={navigate}
	class={className}
>
	{@render children()}
</a>

<script lang="ts">
import type { Snippet } from 'svelte'
import shouldInterceptClick from 'click-should-be-intercepted-for-navigation'
import mediator from '#lib/mediator-instance.ts'

interface Props {
	state: string
	params?: Record<string, string>
	inherit?: boolean
	className?: string
	anchor?: string
	children: Snippet
}

let { state, params = {}, inherit = false, className = '', anchor = '', children }: Props = $props()

const stateIsActive = (state: string, params?: Record<string, unknown>) => mediator.call('stateIsActive', state, params)
const makePath = (state: string, params?: Record<string, unknown>, options?: { inherit?: boolean }) => mediator.call('makePath', state, params, options)

function currentPath() {
	return window.location.pathname + window.location.search
}

const hashFragment = $derived(anchor ? `#${anchor}` : '')
const path = $derived(makePath(state, params, { inherit }))
const href = $derived(path + hashFragment)

let cancelListener: () => void

$effect(() => {
	cancelListener = mediator.call(
		'onStateRouter',
		'stateChangeEnd',
		() => {
			// Force reactivity update
			stateIsActive(state, params)
		}
	)

	return () => {
		cancelListener()
	}
})

function navigate(event: MouseEvent) {
	if (shouldInterceptClick(event)) {
		event.preventDefault()

		if (path !== currentPath()) {
			mediator.call('goWithHashFragment', state, params, { inherit }, anchor)
		} else {
			window.location.href = hashFragment
		}
	}
}
</script>
