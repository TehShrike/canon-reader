import Reference from './Reference.svelte'
import get_target_state_from_reference from '#lib/get_target_state_from_reference.ts'
import type { TypedMediator } from '#lib/mediator_instance.ts'

interface Parameters {
	s?: string
}

interface RedirectError {
	redirectTo: {
		name: string
		params: Record<string, string>
	}
}

export interface State {
	name: string
	route: string
	querystringParameters: string[]
	template: typeof Reference
	resolve: (data: unknown, parameters: Parameters) => Promise<{ reference: string }>
}

export default (mediator: TypedMediator): State => ({
	name: 'main.reference',
	route: 'reference',
	querystringParameters: [ 's' ],
	template: Reference,
	resolve(_data, parameters) {
		const reference = parameters.s || ''

		const target_state = get_target_state_from_reference(reference)

		if (target_state) {
			const { anchor, state_name, params } = target_state

			if (anchor) {
				mediator.call('set_anchor_after_state_transition', state_name, params, anchor)
			}

			return Promise.reject({
				redirectTo: {
					name: state_name,
					params,
				},
			} as RedirectError)
		}

		return Promise.resolve({
			reference,
		})
	},
})
