export default function addEventListener(target, ...args) {
	target.addEventListener(...args)

	return () => target.removeEventListener(...args)
}
