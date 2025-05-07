<a
	href={href}
	data-active={stateIsActive(state, params)}
	on:click={navigate}
	class={className}
>
	<slot />
</a>

<script lang="ts">
import shouldInterceptClick from 'click-should-be-intercepted-for-navigation'
import mediator from 'lib/mediator-instance.js'

interface Props {
	state: string
	params?: Record<string, string>
	inherit?: boolean
	className?: string
	anchor?: string
}

let { state, params = {}, inherit = false, className = '', anchor = '' } = $props<Props>()

const stateIsActive = (...args: unknown[]) => mediator.callSync('stateIsActive', ...args)
const makePath = (...args: unknown[]) => mediator.callSync('makePath', ...args)

function currentPath() {
	return window.location.pathname + window.location.search
}

$derived.hashFragment = anchor ? `#${anchor}` : ''
$derived.path = makePath(state, params, { inherit })
$derived.href = path + hashFragment

let cancelListener: () => void

$effect(() => {
	cancelListener = mediator.callSync(
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
			mediator.callSync('goWithHashFragment', state, params, { inherit }, anchor)
		} else {
			window.location.href = hashFragment
		}
	}
}
</script>
