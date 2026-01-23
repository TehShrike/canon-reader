export default function addEventListener<K extends keyof WindowEventMap>(
	target: Window,
	type: K,
	listener: (this: Window, ev: WindowEventMap[K]) => unknown,
	options?: boolean | AddEventListenerOptions
): () => void
export default function addEventListener<K extends keyof DocumentEventMap>(
	target: Document,
	type: K,
	listener: (this: Document, ev: DocumentEventMap[K]) => unknown,
	options?: boolean | AddEventListenerOptions
): () => void
export default function addEventListener<K extends keyof HTMLElementEventMap>(
	target: HTMLElement,
	type: K,
	listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => unknown,
	options?: boolean | AddEventListenerOptions
): () => void
export default function addEventListener(
	target: EventTarget,
	type: string,
	listener: EventListenerOrEventListenerObject,
	options?: boolean | AddEventListenerOptions
): () => void {
	target.addEventListener(type, listener, options)

	return () => target.removeEventListener(type, listener, options)
}
