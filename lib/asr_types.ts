import type { Component } from 'svelte'
import type {
	Redirect,
	AbstractStateRouter,
	Renderer,
	GoOptions,
} from 'abstract-state-router'

// Re-export types from abstract-state-router
export type { Redirect, GoOptions }

// Svelte-specific type aliases
export type SvelteDomApi = object
export type SvelteStateRouter = AbstractStateRouter<Component, SvelteDomApi>
export type SvelteRenderer = Renderer<Component, SvelteDomApi>

// State type with resolve params typed to allow undefined values
export type State = {
	template: Component
	name: string
	route: string
	defaultChild?: string
	data?: object
	resolve?: (data: unknown, params: Record<string, string | undefined>) => Promise<unknown>
	activate?: (context: unknown) => void
	querystringParameters?: string[]
	defaultParameters?: Record<string, string | null | (() => string | null)>
	canLeaveState?: (domApi: object) => boolean
}
