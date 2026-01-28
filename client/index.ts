import views from './globbed_views.ts'
import stateful_services from './globbed_services.ts'

import mediator from '#lib/mediator_instance.ts'
import asrScrollPosition from 'asr-scroll-position'
import state_router from './asr_instance.ts'

mediator.provide(`state_go`, state_router.go)
mediator.provide(`make_path`, state_router.makePath)
mediator.provide(`state_is_active`, state_router.stateIsActive)
mediator.provide(`on_state_change_end`, (cb) => {
	const wrapper = (state: { name: string }, parameters: object) => {
		cb(state, parameters as Record<string, string | null>)
	}
	state_router.on(`stateChangeEnd`, wrapper)
	return () => state_router.removeListener(`stateChangeEnd`, wrapper)
})

const module_initialization_promises = stateful_services.map(module => Promise.resolve(module(mediator)))

views.map(create_view => create_view(mediator)).forEach((state) => {
	try {
		state_router.addState(state)
	} catch (e) {
		console.error(`Error adding`, state)
		throw e
	}
})

state_router.on(`routeNotFound`, (route, parameters) => {
	state_router.go(`main.not-found`, Object.assign({ route }, parameters), { replace: true })
})

state_router.on(`stateChangeError`, (error) => console.error(error))
state_router.on(`stateError`, (error) => console.error(error))

Promise.all(module_initialization_promises).then(() => {
	state_router.evaluateCurrentRoute(`main`)
	asrScrollPosition(state_router)
})
