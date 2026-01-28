// @ts-expect-error no types available
import createEmitter from 'better-emitter'
import browserEvent from '#lib/browser_event.ts'

const emitter = createEmitter()
let resizing = false

const debounced_resize_done = debounce(
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

	debounced_resize_done()
})

export default emitter



function debounce(fn: () => void, ms: number): () => void {
	let timeout_id: ReturnType<typeof setTimeout> | null = null

	return () => {
		if (timeout_id) {
			clearTimeout(timeout_id)
		}

		timeout_id = setTimeout(() => {
			timeout_id = null
			fn()
		}, ms)
	}
}
