import Home from './Home.svelte'
import type { State } from '#lib/asr_types.ts'

export default (_mediator: unknown): State => ({
	name: `main.home`,
	route: ``,
	template: Home,
})
