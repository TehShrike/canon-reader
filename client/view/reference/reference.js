import Reference from './Reference.svelte'
import getTargetStateFromReference from 'lib/get-target-state-from-reference.js'

export default mediator => ({
	name: 'main.reference',
	route: 'reference',
	querystringParameters: [ 's' ],
	template: Reference,
	resolve(data, parameters) {
		const reference = parameters.s || ''

		const targetState = getTargetStateFromReference(reference)

		if (targetState) {
			const { anchor, stateName, params } = targetState

			if (anchor) {
				mediator.callSync('setAnchorAfterStateTransition', stateName, params, anchor)
			}

			return Promise.reject({
				redirectTo: {
					name: stateName,
					params,
				},
			})
		}

		return Promise.resolve({
			reference,
		})
	},
})
