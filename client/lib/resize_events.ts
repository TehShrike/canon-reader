// @ts-expect-error no types available
import createEmitter from 'better-emitter'
import browserEvent from './browser_event.ts'

const emitter = createEmitter()
let resizing = false

const debouncedResizeDone = debounce(
	() => {
		emitter.emit('resize stop')
		resizing = false
	},
	100
)

browserEvent(window, 'resize', () => {
	if (!resizing) {
		emitter.emit('resize start')
		resizing = true
	}

	debouncedResizeDone()
})

export default emitter



function debounce(fn: () => void, ms: number): () => void {
	let timeoutId: ReturnType<typeof setTimeout> | null = null

	return () => {
		if (timeoutId) {
			clearTimeout(timeoutId)
		}

		timeoutId = setTimeout(() => {
			timeoutId = null
			fn()
		}, ms)
	}
}
