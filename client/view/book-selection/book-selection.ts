import BookSelection from './BookSelection.svelte'

export interface State {
	name: string
	route: string
	template: typeof BookSelection
}

export default (_mediator: unknown): State => ({
	name: 'main.book-selection',
	route: 'book-selection',
	template: BookSelection,
})
