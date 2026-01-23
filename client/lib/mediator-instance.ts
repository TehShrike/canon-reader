import mannish from 'mannish'

// Registry of all providers with their signatures
interface MediatorRegistry {
	// State router wrappers
	stateGo: (state: string, params?: Record<string, unknown>, options?: { replace?: boolean; inherit?: boolean }) => void
	makePath: (state: string, params?: Record<string, unknown>, options?: { inherit?: boolean }) => string
	stateIsActive: (state: string, params?: Record<string, unknown>) => boolean

	// Event subscriptions (return unsubscribe function)
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onStateRouter: (event: string, cb: (...args: any[]) => void) => () => void
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onceStateRouter: (event: string, cb: (...args: any[]) => void) => () => void

	// Navigation
	goWithHashFragment: (state: string, params: Record<string, unknown>, options: { inherit?: boolean }, anchor: string) => void
	setAnchorAfterStateTransition: (stateName: string, params: Record<string, unknown>, anchor: string) => void

	// Async providers
	afterStateTransitionTo: (stateName: string, params: Record<string, unknown>) => Promise<void>

	// Book lookup
	getBookById: (id: string) => { name: string; aliases: string[] } | undefined

	// UI positioning
	'position search box': (position: { top: number; left: number; right: number; bottom: number }) => void
	'unposition search box': () => void
	'show navigation input': (bookId: string | null) => void
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
