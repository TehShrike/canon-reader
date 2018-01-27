import mannish from 'mannish'

import views from './globbed-views'
import statefulServices from './globbed-services'

import StateRouter from 'abstract-state-router'
import makeSvelteStateRenderer from 'svelte-state-renderer'

const stateRouter = StateRouter(
	makeSvelteStateRenderer(),
	document.getElementById('target'),
)

const mediator = mannish()

mediator.provideSync(`stateGo`, stateRouter.go)
mediator.provideSync(`makePath`, stateRouter.makePath)
mediator.provideSync(`onStateRouter`, (event, cb) => {
	stateRouter.on(event, cb)
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
})
