import Home from './Home.svelte'

export interface State {
	name: string
	route: string
	template: typeof Home
}

export default (_mediator: unknown): State => ({
	name: `main.home`,
	route: ``,
	template: Home,
})
