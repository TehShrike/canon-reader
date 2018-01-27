(function (stateRouter) {
'use strict';

stateRouter = stateRouter && stateRouter.hasOwnProperty('default') ? stateRouter['default'] : stateRouter;

var mannish = function createMediator() {
	const providers = Object.create(null);
	const syncProviders = Object.create(null);

	function call(name, ...args) {
		if (providers[name]) {
			try {
				const response = providers[name](...args);

				return Promise.resolve(response)
			} catch (err) {
				return Promise.reject(err)
			}
		} else {
			return Promise.reject(new Error(`No async provider found for "${name}"`))
		}
	}

	function callSync(name, ...args) {
		if (syncProviders[name]) {
			return syncProviders[name](...args)
		} else {
			throw new Error(`No synchronous provider found for "${name}"`)
		}
	}

	return {
		provide: createProvide('async', providers),
		call,
		provideSync: createProvide('synchronous', syncProviders),
		callSync
	}
};

const createProvide = (identifier, map) => function provide(name, fn) {
	if (typeof fn !== 'function') {
		throw new Error(`${fn} is not a function`)
	} else if (typeof name !== 'string') {
		throw new Error(`The provider name must be a string`)
	} else if (map[name]) {
		throw new Error(`There is already a ${identifier} provider for "${name}"`)
	} else {
		map[name] = fn;
	}
};

var views = [

]

var statefulServices = [

]

const mediator = mannish();

mediator.provideSync(`stateGo`, stateRouter.go);
mediator.provideSync(`makePath`, stateRouter.makePath);
mediator.provideSync(`onStateRouter`, (event, cb) => {
	stateRouter.on(event, cb);
});

const moduleInitializationPromises = statefulServices.map(module => Promise.resolve(module(mediator)));

views.map(createView => createView(mediator)).forEach(state => {
	try {
		stateRouter.addState(state);
	} catch (e) {
		console.error(`Error adding`, state);
		throw e
	}
});

stateRouter.on(`routeNotFound`, (route, parameters) => {
	stateRouter.go(`main.not-found`, Object.assign({ route }, parameters), { replace: true });
});

stateRouter.on(`stateChangeStart`, (state, params) => console.log(`stateChangeStart`, state.name, params));
stateRouter.on(`stateChangeError`, error => console.error(error));
stateRouter.on(`stateError`, error => console.error(error));
stateRouter.on(`stateChangeEnd`, (state, params) => console.log(`stateChangeEnd`, state.name, params));

Promise.all(moduleInitializationPromises).then(() => {
	stateRouter.evaluateCurrentRoute(`main`);
});

}(stateRouter));
//# sourceMappingURL=index-bundle.js.map
