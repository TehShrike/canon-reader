const scrollToElement = element => element && element.scrollIntoView()
const getElementById = id => id && document.getElementById(id)
const scrollToId = id => scrollToElement(getElementById(id))
const pushState = url => window.history.pushState({}, '', url)

export default mediator => {
	window.addEventListener('click', event => {
		const node = event.target

		if (node.nodeName.toLowerCase() === 'a') {
			const url = node.attributes.href.value

			if (url && nonHashFragmentPartsMatch(window.location.hash, url)) {
				const id = getIdOfFakeoHashFragmentFromUrl(url)

				scrollToId(id)
				pushState(url)
				event.preventDefault()
			}
		}
	})

	mediator.callSync('onStateRouter', 'stateChangeEnd', () => {
		const id = getIdOfFakeoHashFragmentFromUrl(window.location.hash)
		scrollToId(id)
		setTimeout(() => scrollToId(id), 20)
	})
}

const urlHashFragmentRegex = /^#[^#]+#(.+)$/
function getIdOfFakeoHashFragmentFromUrl(urlWithHash) {
	const match = urlWithHash.match(urlHashFragmentRegex)
	return match && match[1]
}

const urlWithoutHashFragmentRegex = /^#([^#]+)(?:#.+)?$/
function getUrlWithoutHashFragment(url) {
	const match = url.match(urlWithoutHashFragmentRegex)
	return match && match[1]
}

function nonHashFragmentPartsMatch(urlA, urlB) {
	return getUrlWithoutHashFragment(urlA) === getUrlWithoutHashFragment(urlB)
}
