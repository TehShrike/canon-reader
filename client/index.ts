import views from './globbed_views.ts'
import statefulServices from './globbed_services.ts'

import mediator from '#lib/mediator_instance.ts'
import asrScrollPosition from 'asr-scroll-position'
import stateRouter from './asr_instance.ts'

mediator.provide(`state_go`, stateRouter.go)
mediator.provide(`make_path`, stateRouter.makePath)
mediator.provide(`state_is_active`, stateRouter.stateIsActive)
mediator.provide(`on_state_change_end`, (cb) => {
	const wrapper = (state: { name: string }, parameters: object) => {
		cb(state, parameters as Record<string, string | null>)
	}
	stateRouter.on(`stateChangeEnd`, wrapper)
	return () => stateRouter.removeListener(`stateChangeEnd`, wrapper)
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

stateRouter.on(`routeNotFound`, (route, parameters) => {
	stateRouter.go(`main.not-found`, Object.assign({ route }, parameters), { replace: true })
})

stateRouter.on(`stateChangeError`, (error) => console.error(error))
stateRouter.on(`stateError`, (error) => console.error(error))

Promise.all(moduleInitializationPromises).then(() => {
	stateRouter.evaluateCurrentRoute(`main`)
	asrScrollPosition(stateRouter)
})
