import views from './globbed_views.ts'
import statefulServices from './globbed_services.ts'

import mediator from '#lib/mediator_instance.ts'

import sausage from 'sausage-router'
import makeRouter from 'hash-brown-router'
import StateRouter from 'abstract-state-router'
import asrScrollPosition from 'asr-scroll-position'
import makeSvelteStateRenderer from 'svelte-state-renderer'

const stateRouter = StateRouter(
	makeSvelteStateRenderer(),
	document.getElementById(`target`), {
		pathPrefix: ``,
		router: makeRouter(sausage()),
	}
)

mediator.provide(`state_go`, stateRouter.go)
mediator.provide(`make_path`, stateRouter.makePath)
mediator.provide(`state_is_active`, stateRouter.stateIsActive)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
mediator.provide(`on_state_router`, (event: string, cb: (...args: any[]) => void) => {
	stateRouter.on(event, cb)
	return () => stateRouter.removeListener(event, cb)
})
// eslint-disable-next-line @typescript-eslint/no-explicit-any
mediator.provide(`once_state_router`, (event: string, cb: (...args: any[]) => void) => {
	stateRouter.once(event, cb)
	return () => stateRouter.removeListener(event, cb)
})

const moduleInitializationPromises = statefulServices.map(module => Promise.resolve(module(mediator)))

views.map(createView => createView(mediator)).forEach((state) => {
	try {
		stateRouter.addState(state)
	} catch (e) {
		console.error(`Error adding`, state)
		throw e
	}
})

stateRouter.on(`routeNotFound`, (route: string, parameters: Record<string, unknown>) => {
	stateRouter.go(`main.not-found`, Object.assign({ route }, parameters), { replace: true })
})

stateRouter.on(`stateChangeError`, (error: unknown) => console.error(error))
stateRouter.on(`stateError`, (error: unknown) => console.error(error))

Promise.all(moduleInitializationPromises).then(() => {
	stateRouter.evaluateCurrentRoute(`main`)
	asrScrollPosition(stateRouter)
})
