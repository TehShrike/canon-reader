import Reference from './Reference.svelte'
import getTargetStateFromReference from '#lib/get-target-state-from-reference.ts'
import type { TypedMediator } from '#lib/mediator-instance.ts'

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

		const targetState = getTargetStateFromReference(reference)

		if (targetState) {
			const { anchor, stateName, params } = targetState

			if (anchor) {
				mediator.call('setAnchorAfterStateTransition', stateName, params, anchor)
			}

			return Promise.reject({
				redirectTo: {
					name: stateName,
					params,
				},
			} as RedirectError)
		}

		return Promise.resolve({
			reference,
		})
	},
})
