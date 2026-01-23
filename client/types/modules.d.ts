declare module 'click-should-be-intercepted-for-navigation' {
	export default function shouldInterceptClick(event: MouseEvent): boolean
}

declare module 'just-range' {
	export default function range(start: number, end?: number): number[]
}

declare module 'iso-next-tick' {
	export default function nextTick(callback: () => void): void
}

declare module 'mannish' {
	interface Mediator {
		provide: (name: string, fn: (...args: unknown[]) => unknown) => () => void
		call: (name: string, ...args: unknown[]) => unknown
	}
	export default function mannish(): Mediator
}

declare module 'sausage-router' {
	export default function sausage(): unknown
}

declare module 'hash-brown-router' {
	export default function makeRouter(sausage: unknown): unknown
}

declare module 'abstract-state-router' {
	interface StateRouter {
		go: (state: string, params?: Record<string, unknown>, options?: { replace?: boolean; inherit?: boolean }) => void
		makePath: (state: string, params?: Record<string, unknown>, options?: { inherit?: boolean }) => string
		stateIsActive: (state: string, params?: Record<string, unknown>) => boolean
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		on: (event: string, cb: (...args: any[]) => void) => void
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		once: (event: string, cb: (...args: any[]) => void) => void
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		removeListener: (event: string, cb: (...args: any[]) => void) => void
		addState: (state: unknown) => void
		evaluateCurrentRoute: (defaultState: string) => void
	}
	export default function StateRouter(renderer: unknown, target: Element | null, options?: unknown): StateRouter
}

declare module 'svelte-state-renderer' {
	export default function makeSvelteStateRenderer(): unknown
}

declare module 'asr-scroll-position' {
	export default function asrScrollPosition(stateRouter: unknown): void
}

declare module 'books-of-the-bible' {
	interface Book {
		name: string
		aliases: string[]
	}
	const books: Book[]
	export default books
}

declare module 'multi-part-range-compare' {
	type RelativeResult = -1 | 0 | 1 | 2

	interface RangeCompare {
		(start: (number | null)[], end: (number | null)[], point: (number | null)[]): boolean
		relative: (start: (number | null)[], end: (number | null)[], point: (number | null)[]) => RelativeResult
		LESS_THAN_START: -1
		WITHIN_RANGE: 0
		GREATER_THAN_END: 1
		INVALID: 2
	}

	const rangeCompare: RangeCompare
	export default rangeCompare
}

declare module 'chromatism2' {
	interface AdjacentResult {
		hex: string[]
	}
	export function adjacent(angle: number, sections: number, color: string): AdjacentResult
}
