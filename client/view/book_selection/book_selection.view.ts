import BookSelection from './BookSelection.svelte'
import type { State } from '#lib/asr_types.ts'

export default (_mediator: unknown): State => ({
	name: 'main.book-selection',
	route: 'book-selection',
	template: BookSelection,
})
