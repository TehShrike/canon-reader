const in_browser = typeof window !== 'undefined' && window.location

const parse_query_string = (): { [key: string]: string } => {
	const params = new URLSearchParams(window.location.search)
	return Object.fromEntries(params.entries())
}

const update_browser_url = (state: { [key: string]: string }, replace: boolean = true) => {
	const query_string = new URLSearchParams(state).toString()
	const new_url = query_string ? '?' + query_string : window.location.pathname

	if (replace) {
		window.history.replaceState({}, '', new_url)
	} else {
		window.history.pushState({}, '', new_url)
	}
}

const create_proxy_with_default_values_proxying_to_querystring_params = <
	Defaults extends { [key: string]: string }
>({
	params,
	defaults,
	initial_params,
}: {
	params: { [key: string]: string }
	defaults: Defaults
	initial_params: { [key: string]: string }
}) => {
	const proxy_params_with_defaults = $state<
		{ [key: string]: string | undefined } & Defaults
	>({
		...defaults,
		...initial_params,
	})

	return new Proxy(proxy_params_with_defaults, {
		set(target, prop, value) {
			if (prop in defaults && defaults[prop as keyof Defaults] === value) {
				delete params[prop as keyof typeof params]
			} else {
				params[prop as keyof typeof params] = value
			}

			target[prop as keyof typeof target] = value
			return true
		},
		deleteProperty(target, prop) {
			delete params[prop as keyof typeof params]

			if (prop in defaults) {
				type ReasonableTargetProperty = keyof typeof target
				const default_value = defaults[
					prop as keyof Defaults
				] as (typeof target)[ReasonableTargetProperty]

				target[prop as ReasonableTargetProperty] = default_value
			} else {
				delete target[prop as keyof typeof target]
			}

			return true
		},
	})
}

export const create_querystring_store = <
	Defaults extends { [key: string]: string }
>(
	defaults: Defaults
) => {
	const initial_params = in_browser ? parse_query_string() : {}
	const params = $state(initial_params)

	// This type is currently a lie since we don't validate that a key
	// necessarily has the same type as the defaults
	const params_with_defaults =
		create_proxy_with_default_values_proxying_to_querystring_params({
			params,
			defaults,
			initial_params,
		})

	$effect(() => {
		update_browser_url(params)
	})

	return {
		// params aren't mirrored back to params_with_defaults yet
		params_readable: params,

		params_with_defaults,
		get_altered_query_string: (
			param: string,
			value: string
		): string => {
			const { [param]: _, ...rest } = params
			const altered_value_is_the_same_as_the_default = value === defaults[param]
			const new_params = altered_value_is_the_same_as_the_default ? rest : { ...rest, [param]: String(value) }
			return '?' + new URLSearchParams(new_params).toString()
		},
	}
}

// Navigate function matching the old svelte-querystring-router API
export function navigate(options: {
	parameters?: Record<string, string | undefined>
	replace?: boolean
}) {
	if (!in_browser) return

	const current_params = parse_query_string()
	const new_params: Record<string, string> = { ...current_params }

	if (options.parameters) {
		for (const [key, value] of Object.entries(options.parameters)) {
			if (value === undefined) {
				delete new_params[key]
			} else {
				new_params[key] = value
			}
		}
	}

	update_browser_url(new_params, options.replace ?? false)
}

// Simple reactive store for reading querystring parameters
// Listens to popstate for browser back/forward navigation
function create_reactive_querystring_params() {
	let params = $state<Record<string, string>>(in_browser ? parse_query_string() : {})

	if (in_browser) {
		window.addEventListener('popstate', () => {
			const new_params = parse_query_string()
			// Update each key individually to maintain reactivity
			for (const key of Object.keys(params)) {
				if (!(key in new_params)) {
					delete params[key]
				}
			}
			for (const [key, value] of Object.entries(new_params)) {
				params[key] = value
			}
		})
	}

	return {
		get params() {
			return params
		}
	}
}

// Singleton store for querystring parameters, shared across components
export const querystring_params = create_reactive_querystring_params()
