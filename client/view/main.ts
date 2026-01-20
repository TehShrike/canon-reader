import Main from './Main.svelte'
import type { TypedMediator } from '#lib/mediator-instance.ts'

export interface State {
	name: string
	route: string
	defaultChild: string
	template: typeof Main
	resolve: () => Promise<{ mediator: TypedMediator }>
}

export default (mediator: TypedMediator): State => ({
	name: `main`,
	route: ``,
	defaultChild: `home`,
	template: Main,
	resolve() {
		return Promise.resolve({
			mediator,
		})
	},
})
