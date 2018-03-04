import views from './globbed-views'
import statefulServices from './globbed-services'

import mediator from 'lib/mediator-instance.js'

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

mediator.provideSync(`stateGo`, stateRouter.go)
mediator.provideSync(`makePath`, stateRouter.makePath)
mediator.provideSync(`stateIsActive`, stateRouter.stateIsActive)
mediator.provideSync(`onStateRouter`, (event, cb) => {
	stateRouter.on(event, cb)
	return () => stateRouter.removeListener(event, cb)
})
mediator.provideSync(`onceStateRouter`, (event, cb) => {
	stateRouter.once(event, cb)
	return () => stateRouter.removeListener(event, cb)
})

const moduleInitializationPromises = statefulServices.map(module => Promise.resolve(module(mediator)))

views.map(createView => createView(mediator)).forEach(state => {
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

stateRouter.on(`stateChangeStart`, (state, params) => console.log(`stateChangeStart`, state.name, params))
stateRouter.on(`stateChangeError`, error => console.error(error))
stateRouter.on(`stateError`, error => console.error(error))
stateRouter.on(`stateChangeEnd`, (state, params) => console.log(`stateChangeEnd`, state.name, params))

Promise.all(moduleInitializationPromises).then(() => {
	stateRouter.evaluateCurrentRoute(`main`)
	asrScrollPosition(stateRouter)
})
