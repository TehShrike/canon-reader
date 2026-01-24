import mannish from 'mannish'

interface MediatorRegistry {
	state_go: (state: string, params?: Record<string, unknown>, options?: { replace?: boolean; inherit?: boolean }) => void
	make_path: (state: string, params?: Record<string, unknown>, options?: { inherit?: boolean }) => string
	state_is_active: (state: string, params?: Record<string, unknown>) => boolean

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	on_state_router: (event: string, cb: (...args: any[]) => void) => () => void
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	once_state_router: (event: string, cb: (...args: any[]) => void) => () => void

	go_with_hash_fragment: (state: string, params: Record<string, unknown>, options: { inherit?: boolean }, anchor: string) => void
	set_anchor_after_state_transition: (state_name: string, params: Record<string, unknown>, anchor: string) => void

	after_state_transition_to: (state_name: string, params: Record<string, unknown>) => Promise<void>

	get_book_by_id: (id: string) => { name: string; aliases: string[] } | undefined

	position_search_box: (position: { top: number; left: number; right: number; bottom: number }) => void
	unposition_search_box: () => void
	show_navigation_input: (book_id: string | null) => void
}

// Typed mediator interface
interface TypedMediator {
	provide<K extends keyof MediatorRegistry>(
		name: K,
		fn: MediatorRegistry[K]
	): () => void

	call<K extends keyof MediatorRegistry>(
		name: K,
		...args: Parameters<MediatorRegistry[K]>
	): ReturnType<MediatorRegistry[K]>
}

const mediator = mannish() as TypedMediator

export default mediator
export type { MediatorRegistry, TypedMediator }
