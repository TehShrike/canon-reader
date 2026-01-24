import type { Validator } from '#lib/json_validator.ts'

function assert(condition: unknown, message?: string): asserts condition {
	if (!condition) throw new Error(message ?? 'Assertion failed')
}

export default assert

export function assert_valid<T>(validator: Validator<T>, value: unknown): asserts value is T {
	if (!validator.is_valid(value)) {
		throw new Error(`Assertion failed: ${validator.get_messages(value, 'value').join(', ')}`)
	}
}

export function assert_never(value: never, message?: string): never {
	throw new Error(message ?? `Unexpected value: ${value}`)
}
